import { ThreatVector } from '../types/cyber';

/**
 * Parses an IPv4 address string into a 4-byte tuple.
 */
function parseIpv4(ipStr: string): [number, number, number, number] {
  const cleanIp = (ipStr || '').replace(/[^\d.]/g, '');
  const parts = cleanIp.split('.').map(p => parseInt(p, 10));
  if (parts.length === 4 && parts.every(p => !isNaN(p) && p >= 0 && p <= 255)) {
    return [parts[0], parts[1], parts[2], parts[3]];
  }
  return [192, 168, 1, 100];
}

/**
 * Generates a valid standard libpcap binary file Blob representing the raw packet data
 * of a detected threat incident. This PCAP can be loaded into Wireshark, tcpdump, or Zeek.
 */
export function generateThreatPcapBlob(threat: ThreatVector): Blob {
  // 1. Libpcap Global Header (24 bytes)
  const globalHeader = new Uint8Array([
    0xd4, 0xc3, 0xb2, 0xa1, // magic_number (0xa1b2c3d4 in little endian)
    0x02, 0x00,             // version_major (2)
    0x04, 0x00,             // version_minor (4)
    0x00, 0x00, 0x00, 0x00, // thiszone (GMT to local correction = 0)
    0x00, 0x00, 0x00, 0x00, // sigfigs (accuracy of timestamps = 0)
    0xff, 0xff, 0x00, 0x00, // snaplen (max length of captured packets = 65535)
    0x01, 0x00, 0x00, 0x00  // network (1 = LINKTYPE_ETHERNET)
  ]);

  // 2. Protocol and Port inference based on threat vector
  const isDns = threat.type === 'Data_Exfiltration' || threat.title.toLowerCase().includes('dns');
  const isVolumetric = threat.type === 'DDoS_Volumetric';
  const srcPort = isDns ? 53120 : 44100;
  const dstPort = isDns ? 53 : (isVolumetric ? 80 : 443);
  const isUdp = isDns;
  const protoNum = isUdp ? 17 : 6;

  // 3. Construct Raw Payload String
  const payloadString = 
    `[ACDC-OPERATIONAL-FORENSIC-CAPTURE]\n` +
    `Threat-ID: ${threat.id}\n` +
    `Severity: ${threat.severity}\n` +
    `Tactic: ${threat.mitreTactic}\n` +
    `Entropy-H(x): ${threat.mathematicalProof.shannonEntropy} bits\n` +
    `Mahalanobis-Distance: ${threat.mahalanobisDistance}\n` +
    `Bayesian-Posterior: ${(threat.bayesianConfidence * 100).toFixed(2)}%\n` +
    `Mitigation-Actuator: ${threat.actuatorUsed}\n` +
    `Status: ${threat.status}\n` +
    `Target: ${threat.targetAsset}\n` +
    `Raw-Payload: ${threat.title} | ${isDns ? 'a8f9c1b2d3.c2-exfil-proxy.darknet-relay.ru TXT IN' : 'GET /?attack=exploit_buffer_overflow HTTP/1.1'}`;

  const encoder = new TextEncoder();
  const payloadBytes = encoder.encode(payloadString);

  // 4. Ethernet Frame Header (14 bytes)
  const ethHeader = new Uint8Array([
    0x00, 0x50, 0x56, 0xc0, 0x00, 0x08, // Destination MAC
    0x00, 0x0c, 0x29, 0x6a, 0x9b, 0x3c, // Source MAC
    0x08, 0x00                          // EtherType IPv4 (0x0800)
  ]);

  // 5. IPv4 Header (20 bytes)
  const srcIpBytes = parseIpv4(threat.sourceIp);
  const dstIpClean = (threat.targetAsset || '').split(' ')[0];
  const dstIpBytes = parseIpv4(dstIpClean || '10.0.0.1');

  const transportLen = isUdp ? 8 : 20;
  const ipTotalLen = 20 + transportLen + payloadBytes.length;

  const ipHeader = new Uint8Array(20);
  ipHeader[0] = 0x45; // Version 4, Header length 5 (20 bytes)
  ipHeader[1] = 0x00; // DSCP / ECN
  ipHeader[2] = (ipTotalLen >> 8) & 0xff;
  ipHeader[3] = ipTotalLen & 0xff;
  ipHeader[4] = 0x13; // Packet Identification
  ipHeader[5] = 0x37;
  ipHeader[6] = 0x40; // Flags (Don't Fragment)
  ipHeader[7] = 0x00;
  ipHeader[8] = 64;   // TTL (Time To Live)
  ipHeader[9] = protoNum; // UDP (17) or TCP (6)
  ipHeader[10] = 0x00; // Header Checksum placeholder
  ipHeader[11] = 0x00;
  ipHeader[12] = srcIpBytes[0];
  ipHeader[13] = srcIpBytes[1];
  ipHeader[14] = srcIpBytes[2];
  ipHeader[15] = srcIpBytes[3];
  ipHeader[16] = dstIpBytes[0];
  ipHeader[17] = dstIpBytes[1];
  ipHeader[18] = dstIpBytes[2];
  ipHeader[19] = dstIpBytes[3];

  // Simple IP checksum calculation
  let sum = 0;
  for (let i = 0; i < 20; i += 2) {
    if (i !== 10) {
      sum += (ipHeader[i] << 8) + ipHeader[i + 1];
    }
  }
  while (sum >> 16) {
    sum = (sum & 0xffff) + (sum >> 16);
  }
  const checksum = ~sum & 0xffff;
  ipHeader[10] = (checksum >> 8) & 0xff;
  ipHeader[11] = checksum & 0xff;

  // 6. Transport Layer (UDP or TCP)
  const transportHeader = new Uint8Array(transportLen);
  transportHeader[0] = (srcPort >> 8) & 0xff;
  transportHeader[1] = srcPort & 0xff;
  transportHeader[2] = (dstPort >> 8) & 0xff;
  transportHeader[3] = dstPort & 0xff;

  if (isUdp) {
    const udpLen = 8 + payloadBytes.length;
    transportHeader[4] = (udpLen >> 8) & 0xff;
    transportHeader[5] = udpLen & 0xff;
    transportHeader[6] = 0x00; // Checksum placeholder
    transportHeader[7] = 0x00;
  } else {
    // TCP
    transportHeader[4] = 0x00; // Sequence number
    transportHeader[5] = 0x01;
    transportHeader[6] = 0x00;
    transportHeader[7] = 0x01;
    transportHeader[8] = 0x00; // Acknowledgment number
    transportHeader[9] = 0x00;
    transportHeader[10] = 0x00;
    transportHeader[11] = 0x00;
    transportHeader[12] = 0x50; // Data offset 5 (20 bytes)
    transportHeader[13] = 0x18; // Flags (PSH, ACK)
    transportHeader[14] = 0x72; // Window size
    transportHeader[15] = 0x10;
  }

  // 7. Assemble Full Network Frame
  const frameLength = ethHeader.length + ipHeader.length + transportHeader.length + payloadBytes.length;
  const fullFrame = new Uint8Array(frameLength);
  fullFrame.set(ethHeader, 0);
  fullFrame.set(ipHeader, ethHeader.length);
  fullFrame.set(transportHeader, ethHeader.length + ipHeader.length);
  fullFrame.set(payloadBytes, ethHeader.length + ipHeader.length + transportHeader.length);

  // 8. Libpcap Packet Header (16 bytes)
  const packetHeader = new Uint8Array(16);
  const tsSec = Math.floor(threat.timestamp / 1000);
  const tsUsec = (threat.timestamp % 1000) * 1000;
  const view = new DataView(packetHeader.buffer);
  view.setUint32(0, tsSec, true);       // ts_sec
  view.setUint32(4, tsUsec, true);      // ts_usec
  view.setUint32(8, frameLength, true); // incl_len
  view.setUint32(12, frameLength, true);// orig_len

  // 9. Combine Global Header + Packet Header + Full Frame into complete PCAP binary
  const totalPcapSize = globalHeader.length + packetHeader.length + fullFrame.length;
  const pcapBuffer = new Uint8Array(totalPcapSize);
  pcapBuffer.set(globalHeader, 0);
  pcapBuffer.set(packetHeader, globalHeader.length);
  pcapBuffer.set(fullFrame, globalHeader.length + packetHeader.length);

  return new Blob([pcapBuffer], { type: 'application/vnd.tcpdump.pcap' });
}

/**
 * Initiates browser download of the PCAP snippet file for a threat.
 */
export function downloadThreatPcap(threat: ThreatVector): string {
  const blob = generateThreatPcapBlob(threat);
  const url = URL.createObjectURL(blob);
  const safeId = threat.id.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const filename = `threat-${safeId}-packet-capture.pcap`;

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);

  return filename;
}
