import { NetworkNode, TelemetryEvent } from '../types/cyber';
import { NodeMetricHistory } from './nodeResourceTelemetry';

export type LatencyHeatmapMode = 'SEGMENT_BASED' | 'GEOGRAPHICAL';
export type LatencyMetricType = 'RTT_PROPAGATION' | 'QUEUE_BUFFERBLOAT' | 'JITTER_VARIANCE';

export interface NetworkSegmentDef {
  id: string;
  name: string;
  nameAr: string;
  shortLabel: string;
  nodeIds: string[];
  color: string;
  borderColor: string;
  bgGlow: string;
  geoRegion: string;
  geoRegionAr: string;
  approxDistanceKm: number;
  nominalFiberDelayMs: number;
  description: string;
  descriptionAr: string;
}

export interface SegmentAggregate {
  segment: NetworkSegmentDef;
  avgLatencyMs: number;
  peakLatencyMs: number;
  minLatencyMs: number;
  jitterMs: number;
  activeNodesCount: number;
  congestedNodesCount: number;
  status: 'OPTIMAL' | 'NOMINAL' | 'ELEVATED' | 'CONGESTED';
  intensity: number; // 0.0 to 1.0
  color: string;
}

export interface PropagationLink {
  sourceId: string;
  targetId: string;
  sourceNode: NetworkNode;
  targetNode: NetworkNode;
  rttMs: number;
  jitterMs: number;
  queueDelayMs: number;
  propagationDelayMs: number;
  packetLossPercent: number;
  intensity: number; // 0.0 to 1.0
  status: 'OPTIMAL' | 'NOMINAL' | 'ELEVATED' | 'CONGESTED';
  color: string;
  isBottleneck: boolean;
}

export interface LatencyNetworkSummary {
  meanRttMs: number;
  medianRttMs: number;
  peakRttMs: number;
  minRttMs: number;
  avgJitterMs: number;
  totalHotspots: number;
  worstLink: {
    source: string;
    target: string;
    rttMs: number;
    segmentName: string;
  } | null;
  ebpfKernelBypassTransitMs: number;
  globalPropagationEfficiency: number; // Percentage (e.g. 96.4%)
}

// Fixed Segment Definitions for our Architecture
export const NETWORK_SEGMENTS: NetworkSegmentDef[] = [
  {
    id: 'segment-ingress',
    name: 'Perimeter Ingress & Global WAN',
    nameAr: 'محيط النفاذ والشبكة العالمية (WAN)',
    shortLabel: 'WAN / Ingress',
    nodeIds: ['node-ext-1', 'node-ext-2'],
    color: '#06b6d4',
    borderColor: 'rgba(6, 182, 212, 0.4)',
    bgGlow: 'rgba(6, 182, 212, 0.08)',
    geoRegion: 'Multi-Region (US-East & EU-West Tier-1 PoPs)',
    geoRegionAr: 'نقاط تواجد عالمية (أمريكا الشمالية وغرب أوروبا)',
    approxDistanceKm: 6200,
    nominalFiberDelayMs: 31.0,
    description: 'External threat sensor surface and Border Gateway transit ingress.',
    descriptionAr: 'سطح استشعار التهديدات الخارجية ومسار عبور بروتوكول BGP.'
  },
  {
    id: 'segment-edge',
    name: 'Edge DMZ & Kernel Gateways',
    nameAr: 'منطقة الحافة العازلة (DMZ) وبوابات النواة',
    shortLabel: 'Edge DMZ',
    nodeIds: ['node-edge-1', 'node-edge-2'],
    color: '#10b981',
    borderColor: 'rgba(16, 185, 129, 0.4)',
    bgGlow: 'rgba(16, 185, 129, 0.08)',
    geoRegion: 'Frankfurt Datacenter DC-01/02',
    geoRegionAr: 'مركز بيانات فرانكفورت DC-01/02',
    approxDistanceKm: 450,
    nominalFiberDelayMs: 2.25,
    description: 'Hardware NIC acceleration and eBPF/XDP wire-speed packet ingestion.',
    descriptionAr: 'معالجة بطاقات الشبكة المسرعة واعتراض الحزم اللحظي بنواة eBPF/XDP.'
  },
  {
    id: 'segment-security',
    name: 'Zero-Trust Gatekeeper (PEP)',
    nameAr: 'حاجز انعدام الثقة ونقطة فرض السياسات',
    shortLabel: 'PEP Firewall',
    nodeIds: ['node-fw-1'],
    color: '#f59e0b',
    borderColor: 'rgba(245, 158, 11, 0.4)',
    bgGlow: 'rgba(245, 158, 11, 0.08)',
    geoRegion: 'Secure Gateway Enclave',
    geoRegionAr: 'جيب بوابات الأمان الصارم',
    approxDistanceKm: 12,
    nominalFiberDelayMs: 0.1,
    description: 'Deep packet inspection (DPI) and cryptographic TLS termination proxy.',
    descriptionAr: 'الفحص العميق لحزم الشبكة والتحقق من التشفير الثنائي.'
  },
  {
    id: 'segment-core',
    name: 'Core SDN Fabric & Spine Switch',
    nameAr: 'محول النواة الموزع وشبكة SDN الفقرية',
    shortLabel: 'SDN Backbone',
    nodeIds: ['node-core-1'],
    color: '#6366f1',
    borderColor: 'rgba(99, 102, 241, 0.4)',
    bgGlow: 'rgba(99, 102, 241, 0.08)',
    geoRegion: 'Metropolitan Optical Ring (Zero-Hop)',
    geoRegionAr: 'الحلقة البصرية الحضرية (زمن عبور فائق الصغر)',
    approxDistanceKm: 5,
    nominalFiberDelayMs: 0.03,
    description: 'Ultra-low latency micro-segmentation switch routing East-West packets.',
    descriptionAr: 'توجيه حزم الخوادم الداخلية بشرائح دقيقة فائقة السرعة.'
  },
  {
    id: 'segment-compute',
    name: 'Workload Compute & App Tier',
    nameAr: 'عناقيد التطبيقات ومعالجة المهام',
    shortLabel: 'App Compute',
    nodeIds: ['node-app-1', 'node-app-2'],
    color: '#8b5cf6',
    borderColor: 'rgba(139, 92, 246, 0.4)',
    bgGlow: 'rgba(139, 92, 246, 0.08)',
    geoRegion: 'Private Cloud Pod Alpha & Beta',
    geoRegionAr: 'السحابة الخاصة المعزولة (الكبسولة ألفا وبيتا)',
    approxDistanceKm: 8,
    nominalFiberDelayMs: 0.04,
    description: 'Production container clusters and mission runtime services.',
    descriptionAr: 'عناقيد حاويات الإنتاج وخدمات تنفيذ العمليات السيبرانية.'
  },
  {
    id: 'segment-data',
    name: 'Mission Data Tier-0 & HSM Vault',
    nameAr: 'مستودع البيانات الحرج والخزينة المشفرة',
    shortLabel: 'Tier-0 Vault',
    nodeIds: ['node-db-1', 'node-vault-1', 'node-airgap-1'],
    color: '#ec4899',
    borderColor: 'rgba(236, 72, 153, 0.4)',
    bgGlow: 'rgba(236, 72, 153, 0.08)',
    geoRegion: 'Hardened Underground Bunker Facility',
    geoRegionAr: 'منشأة محصنة تحت الأرض ومحمية من النبضات الكهرومغناطيسية',
    approxDistanceKm: 140,
    nominalFiberDelayMs: 0.7,
    description: 'Hardware security modules, mission datastores, and air-gapped backups.',
    descriptionAr: 'خزائن التشفير العتادية HSM والنسخ الاحتياطية المعزولة مادياً.'
  }
];

/**
 * Returns color string for a given latency value using a continuous multi-stop gradient
 * < 5ms:   Optimal (Emerald / Cyan)
 * 5-15ms:  Nominal LAN (Blue)
 * 15-40ms: Moderate Delay / WAN (Amber / Orange)
 * > 40ms:  Congestion / Bufferbloat Spike (Crimson / Neon Red)
 */
export function getLatencyColor(latencyMs: number, alpha: number = 1.0): string {
  if (latencyMs <= 4.0) {
    // Ultra-low latency: Emerald #10b981
    return `rgba(16, 185, 129, ${alpha})`;
  } else if (latencyMs <= 10.0) {
    // Low latency: Cyan #06b6d4
    return `rgba(6, 182, 212, ${alpha})`;
  } else if (latencyMs <= 22.0) {
    // Switched / Nominal: Sky blue #3b82f6
    return `rgba(59, 130, 246, ${alpha})`;
  } else if (latencyMs <= 45.0) {
    // Elevated propagation delay: Amber #f59e0b
    return `rgba(245, 158, 11, ${alpha})`;
  } else if (latencyMs <= 75.0) {
    // Severe jitter / heavy queue delay: Orange-red #f97316
    return `rgba(249, 115, 22, ${alpha})`;
  } else {
    // Critical bufferbloat / DDoS saturation: Crimson red #ef4444
    return `rgba(239, 68, 68, ${alpha})`;
  }
}

/**
 * Returns normalized intensity score (0.0 to 1.0)
 */
export function getLatencyIntensity(latencyMs: number): number {
  // Cap at 100ms for max heatmap intensity
  return Math.min(1.0, Math.max(0.05, latencyMs / 80.0));
}

/**
 * Finds segment for a given node ID
 */
export function getNodeSegment(nodeId: string): NetworkSegmentDef {
  const found = NETWORK_SEGMENTS.find(seg => seg.nodeIds.includes(nodeId));
  return found || NETWORK_SEGMENTS[0];
}

/**
 * Computes pairwise propagation delay links between connected nodes
 */
export function calculatePropagationLinks(
  nodes: NetworkNode[],
  nodeMetrics: Record<string, NodeMetricHistory>,
  recentTelemetry: TelemetryEvent[]
): PropagationLink[] {
  const links: PropagationLink[] = [];
  const processedPairs = new Set<string>();

  nodes.forEach(source => {
    source.connections.forEach(targetId => {
      const target = nodes.find(n => n.id === targetId);
      if (!target) return;

      const pairKey = [source.id, target.id].sort().join(':::');
      if (processedPairs.has(pairKey)) return;
      processedPairs.add(pairKey);

      const sourceMetric = nodeMetrics[source.id];
      const targetMetric = nodeMetrics[target.id];

      const sourceLat = sourceMetric?.currentLatency || 3.0;
      const targetLat = targetMetric?.currentLatency || 3.0;

      // Base link latency is calculated from node queuing + physical segment transit
      const sourceSeg = getNodeSegment(source.id);
      const targetSeg = getNodeSegment(target.id);
      
      const interSegment = sourceSeg.id !== targetSeg.id;
      const physicalPropagationDelay = interSegment 
        ? Math.max(sourceSeg.nominalFiberDelayMs, targetSeg.nominalFiberDelayMs)
        : 0.15;

      // Check telemetry between these nodes
      const activeTraffic = recentTelemetry.filter(e => 
        (e.sourceIp === source.ip && e.destinationIp === target.ip) ||
        (e.sourceIp === target.ip && e.destinationIp === source.ip) ||
        (source.type === 'INTERNET' && e.sourceIp === source.ip)
      );

      const trafficPressure = activeTraffic.length > 0
        ? activeTraffic.reduce((sum, e) => sum + (e.packetSize / 1500), 0) * 1.8
        : 0;

      const queueDelay = parseFloat(((sourceLat * 0.45) + (targetLat * 0.45) + trafficPressure).toFixed(1));
      const rttMs = parseFloat((physicalPropagationDelay + queueDelay).toFixed(1));
      const jitterMs = parseFloat((Math.abs(sourceLat - targetLat) * 0.45).toFixed(2));
      const packetLossPercent = rttMs > 60 ? parseFloat((Math.min(18.5, (rttMs - 50) * 0.4)).toFixed(1)) : 0;

      let status: PropagationLink['status'] = 'OPTIMAL';
      if (rttMs > 45.0) {
        status = 'CONGESTED';
      } else if (rttMs > 20.0) {
        status = 'ELEVATED';
      } else if (rttMs > 8.0) {
        status = 'NOMINAL';
      }

      const intensity = getLatencyIntensity(rttMs);
      const color = getLatencyColor(rttMs, 0.9);

      links.push({
        sourceId: source.id,
        targetId: target.id,
        sourceNode: source,
        targetNode: target,
        rttMs,
        jitterMs,
        queueDelayMs: queueDelay,
        propagationDelayMs: physicalPropagationDelay,
        packetLossPercent,
        intensity,
        status,
        color,
        isBottleneck: rttMs >= 40.0
      });
    });
  });

  return links;
}

/**
 * Calculates aggregate propagation metrics per segment
 */
export function calculateSegmentAggregates(
  nodes: NetworkNode[],
  nodeMetrics: Record<string, NodeMetricHistory>
): SegmentAggregate[] {
  return NETWORK_SEGMENTS.map(segment => {
    const segNodes = nodes.filter(n => segment.nodeIds.includes(n.id));
    if (segNodes.length === 0) {
      return {
        segment,
        avgLatencyMs: 2.0,
        peakLatencyMs: 2.0,
        minLatencyMs: 2.0,
        jitterMs: 0.1,
        activeNodesCount: 0,
        congestedNodesCount: 0,
        status: 'OPTIMAL',
        intensity: 0.1,
        color: getLatencyColor(2.0)
      };
    }

    const latencies = segNodes.map(n => nodeMetrics[n.id]?.currentLatency || 3.0);
    const avgLatencyMs = parseFloat((latencies.reduce((a, b) => a + b, 0) / latencies.length).toFixed(1));
    const peakLatencyMs = parseFloat(Math.max(...latencies).toFixed(1));
    const minLatencyMs = parseFloat(Math.min(...latencies).toFixed(1));
    const jitterMs = parseFloat((peakLatencyMs - minLatencyMs).toFixed(1));

    const congestedCount = segNodes.filter(n => (nodeMetrics[n.id]?.currentLatency || 0) >= 40).length;

    let status: SegmentAggregate['status'] = 'OPTIMAL';
    if (avgLatencyMs >= 35 || congestedCount > 0) {
      status = 'CONGESTED';
    } else if (avgLatencyMs >= 18) {
      status = 'ELEVATED';
    } else if (avgLatencyMs >= 6) {
      status = 'NOMINAL';
    }

    const intensity = getLatencyIntensity(avgLatencyMs);
    const color = getLatencyColor(avgLatencyMs);

    return {
      segment,
      avgLatencyMs,
      peakLatencyMs,
      minLatencyMs,
      jitterMs,
      activeNodesCount: segNodes.length,
      congestedNodesCount: congestedCount,
      status,
      intensity,
      color
    };
  });
}

/**
 * Computes network-wide propagation KPIs
 */
export function calculateNetworkWideLatencyKPIs(
  links: PropagationLink[],
  segments: SegmentAggregate[],
  queueLatencyMs: number = 0.38
): LatencyNetworkSummary {
  if (links.length === 0) {
    return {
      meanRttMs: 3.5,
      medianRttMs: 3.2,
      peakRttMs: 6.0,
      minRttMs: 1.2,
      avgJitterMs: 0.4,
      totalHotspots: 0,
      worstLink: null,
      ebpfKernelBypassTransitMs: queueLatencyMs,
      globalPropagationEfficiency: 99.4
    };
  }

  const rtts = links.map(l => l.rttMs).sort((a, b) => a - b);
  const meanRttMs = parseFloat((rtts.reduce((a, b) => a + b, 0) / rtts.length).toFixed(1));
  const medianRttMs = rtts[Math.floor(rtts.length / 2)];
  const peakRttMs = rtts[rtts.length - 1];
  const minRttMs = rtts[0];

  const avgJitterMs = parseFloat((links.reduce((acc, l) => acc + l.jitterMs, 0) / links.length).toFixed(2));
  const hotspots = links.filter(l => l.status === 'CONGESTED' || l.status === 'ELEVATED').length;

  let worstLink: LatencyNetworkSummary['worstLink'] = null;
  const sortedByRtt = [...links].sort((a, b) => b.rttMs - a.rttMs);
  if (sortedByRtt.length > 0 && sortedByRtt[0].rttMs > 12.0) {
    const worst = sortedByRtt[0];
    const seg = getNodeSegment(worst.sourceId);
    worstLink = {
      source: worst.sourceNode.label,
      target: worst.targetNode.label,
      rttMs: worst.rttMs,
      segmentName: seg.name
    };
  }

  const globalPropagationEfficiency = parseFloat(
    Math.max(72, Math.min(99.9, 100 - (meanRttMs * 0.4) - (hotspots * 4.5))).toFixed(1)
  );

  return {
    meanRttMs,
    medianRttMs,
    peakRttMs,
    minRttMs,
    avgJitterMs,
    totalHotspots: hotspots,
    worstLink,
    ebpfKernelBypassTransitMs: queueLatencyMs,
    globalPropagationEfficiency
  };
}
