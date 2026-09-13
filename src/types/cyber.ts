export type DefconLevel = 0 | 1 | 2 | 3 | 4 | 5;

export interface TelemetryEvent {
  id: string;
  timestamp: number;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'TLS 1.3' | 'DNS' | 'eBPF-Syscall';
  packetSize: number;
  entropyValue: number;
  actionTaken: 'INSPECTED' | 'PERMITTED' | 'XDP_DROPPED' | 'SDN_ISOLATED' | 'BGP_ROUTED' | 'RATE_LIMITED';
  severity: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL' | 'NEUTRALIZED';
  signatureFreeScore: number;
}

export interface ThreatVector {
  id: string;
  title: string;
  titleAr: string;
  type: 'DDoS_Volumetric' | 'APT_Lateral' | 'Data_Exfiltration' | 'Zero_Day_Syscall' | 'Recon_Scan' | 'Ransomware_Drift';
  sourceIp: string;
  targetAsset: string;
  timestamp: number;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  stage: 'RECON' | 'INITIAL_ACCESS' | 'LATERAL_MOVE' | 'EXFILTRATION' | 'CONTAINED';
  mitreTactic: string;
  entropyDelta: number;
  mahalanobisDistance: number;
  bayesianConfidence: number;
  blastRadiusNodes: number;
  actuatorUsed: 'eBPF/XDP' | 'BGP Flowspec' | 'SDN Micro-segmentation' | 'EDR Process Freeze' | 'IdP Token Nullify';
  status: 'ACTIVE_INTERCEPTION' | 'NEUTRALIZED' | 'INVESTIGATING';
  mathematicalProof: {
    shannonEntropy: number;
    baselineEntropy: number;
    klDivergence: number;
    chiSquareThreshold: number;
    kalmanResidual: number;
  };
}

export interface DefenseActionLog {
  id: string;
  timestamp: number;
  threatId: string;
  actuator: 'eBPF/XDP Wire-speed' | 'BGP Flowspec' | 'SDN Zero-Trust Quarantine' | 'EDR Memory Freeze' | 'IdP Token Revoke';
  target: string;
  status: 'EXECUTED_SUB_SECOND' | 'VERIFIED' | 'REVERTED_MANUALLY';
  executionTimeMs: number;
  cryptoHash: string;
}

export interface MerkleBlock {
  blockNumber: number;
  timestamp: number;
  merkleRoot: string;
  previousHash: string;
  hash: string;
  transactionsCount: number;
  verified: boolean;
  signer: string;
}

export interface CommandCenterKPIs {
  mttdMs: number;
  mttrSec: number;
  efficacyIndex: number;
  falsePositiveRate: number;
  blastRadiusPercent: number;
  ingestionEps: number;
  queueLatencyMs: number;
  activeNodes: number;
  isolatedNodes: number;
  totalPacketsScanned: number;
  mitigationsCount: number;
}

export interface NetworkNode {
  id: string;
  label: string;
  labelAr: string;
  type: 'INTERNET' | 'EDGE_ROUTER' | 'FIREWALL' | 'CORE_SWITCH' | 'DATABASE' | 'APP_SERVER' | 'IAM_KEY_VAULT' | 'AIRGAP_BACKUP';
  ip: string;
  status: 'HEALTHY' | 'TARGETED' | 'ISOLATED' | 'HIGH_LOAD';
  threatLevel: number; // 0 - 100
  x: number;
  y: number;
  connections: string[];
}

export interface PacketInputData {
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'TLS 1.3' | 'DNS' | 'eBPF-Syscall' | 'HTTP/HTTPS';
  packetSize: number;
  payload: string;
  syscallName?: string;
  interArrivalMs?: number;
  rawLog?: string;
}

export interface ForensicAnalysisResult {
  timestamp: number;
  input: PacketInputData;
  shannonEntropy: number;
  baselineEntropy: number;
  entropyDelta: number;
  byteDistribution: { char: string; code: number; count: number; freq: number }[];
  klDivergence: number;
  mahalanobisDistance: number;
  mahalanobisThreshold: number;
  pageHinkleyValue: number;
  bayesianPosterior: number;
  bayesianBreakdown: {
    priorAttack: number;
    likelihoodAttack: number;
    likelihoodBenign: number;
  };
  isAnomaly: boolean;
  severity: 'NORMAL' | 'ELEVATED' | 'HIGH' | 'CRITICAL';
  detectedThreatType: string;
  detectedThreatTypeAr: string;
  mitreTactic: string;
  recommendedActuator: 'eBPF/XDP Wire-speed' | 'BGP Flowspec' | 'SDN Zero-Trust Quarantine' | 'EDR Memory Freeze' | 'IdP Token Revoke' | 'PERMITTED';
  decisionRationaleAr: string;
  decisionRationaleEn: string;
  generatedFirewallRule: string;
  cryptoProof: {
    merkleRoot: string;
    sha3Hash: string;
    hardwareSigner: string;
  };
}

export interface SessionSnapshot {
  id: string;
  timestamp: number;
  formattedDate: string;
  totalThreats: number;
  neutralizedCount: number;
  totalMitigations: number;
  efficacyIndex: number;
  mttdMs: number;
  mttrSec: number;
  defconLevel: DefconLevel;
  merkleRoot: string;
  notes?: string;
}

export interface MathematicalThresholds {
  mahalanobisThreshold: number;
  entropyThreshold: number;
  bayesianPrior: number;
  kalmanGain: number;
  chiSquareConfidence: number;
}

export type TenantPlan = 'ENTERPRISE_CORE' | 'CLOUD_MESH_SOVEREIGN' | 'BUSINESS_PRO' | 'MSSP_WHITE_LABEL';

export interface ClientWorkspace {
  id: string; // Tenant unique ID e.g. "TENANT-BM-9021"
  name: string; // Organization name e.g. "Bank Al-Maghrib Cloud Operations"
  nameAr: string;
  clientPasskey: string; // Secret key given to client to access their workspace e.g. "CLI-BM-SEC-889"
  plan: TenantPlan;
  status: 'ACTIVE' | 'SUSPENDED' | 'PROVISIONING';
  assignedServers: string[]; // List of asset IPs/nodes assigned to this client
  allocatedQuotaMonthly: number; // Max scanned packets/requests
  consumedQuotaMonthly: number;
  apiKey: string; // Associated primary API key
  createdAt: number;
  expiresAt: number;
  contactEmail: string;
  contactPhone: string;
  dedicatedInstanceUrl?: string;
  customBranding?: {
    accentColor: string;
    logoText?: string;
    customDomain?: string;
  };
}
