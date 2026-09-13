import { ThreatVector, DefenseActionLog } from '../types/cyber';

// ==========================================
// 1. STIX 2.1 & TAXII Global Threat Feeds
// ==========================================
export interface StixThreatIndicator {
  id: string;
  name: string;
  pattern: string;
  patternType: 'stix' | 'yara' | 'sigma' | 'snort';
  validFrom: string;
  confidence: number;
  threatActor?: string;
  sourceFeed: 'CISA_AIS' | 'ALIENVAULT_OTX' | 'MANDIANT_ADV' | 'VIRUSTOTAL_FEED' | 'SANS_ISC';
  mitreTactic: string;
  mitreTechnique: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  indicatorType: 'ipv4-addr' | 'domain-name' | 'file-hash-sha256' | 'url';
  value: string;
  autoBlockRuleId?: string;
  lastSeen: string;
}

export interface StixFeedStatus {
  feedId: string;
  feedName: string;
  provider: string;
  protocol: 'TAXII 2.1' | 'STIX 2.1 HTTPS' | 'REST/mTLS';
  status: 'CONNECTED' | 'SYNCING' | 'DEGRADED';
  indicatorsCount: number;
  lastSyncTime: string;
  latencyMs: number;
}

// ==========================================
// 2. Production Connectors & API Mesh
// ==========================================
export interface ProductionConnector {
  id: string;
  name: string;
  nameAr: string;
  category: 'FIREWALL_SDN' | 'CLOUD_SIEM' | 'EDR_XDR' | 'OT_SCADA' | 'IDENTITY_PAM';
  vendor: string;
  endpointUrl: string;
  authMethod: 'mTLS v1.3' | 'OAuth 2.0 / Bearer' | 'Hardware HSM API Key' | 'SAML / FIDO2';
  status: 'ONLINE' | 'ACTIVE_SHIELD' | 'STANDBY' | 'SYNCING';
  latencyMs: number;
  actionsExecutedCount: number;
  lastHeartbeat: string;
  capabilities: string[];
}

// ==========================================
// 3. Sovereign & Global Compliance Standards
// ==========================================
export interface ComplianceFrameworkScore {
  frameworkId: 'NIST_CSF' | 'ISO_27001' | 'NCA_ECC' | 'DGSSI_DNSSI' | 'NIS2_DORA' | 'NIST_800_53';
  frameworkName: string;
  frameworkNameAr: string;
  organization: string;
  score: number; // 0-100%
  status: 'COMPLIANT' | 'NEEDS_REVIEW' | 'WARNING';
  mandatoryControlsMet: number;
  mandatoryControlsTotal: number;
  keyArticlesMapped: {
    articleCode: string;
    description: string;
    descriptionAr: string;
    status: 'ACTIVE_AUTOMATED' | 'VERIFIED_AUDIT';
  }[];
}

// ==========================================
// 4. Federated Multi-Region Sovereign Clusters
// ==========================================
export interface SovereignClusterNode {
  id: string;
  regionCode: string;
  locationName: string;
  locationNameAr: string;
  countryCode: string;
  flagEmoji: string;
  status: 'PRIMARY' | 'REPLICA_SYNCED' | 'ISOLATED_CELL';
  sovereigntyPolicy: 'LOCAL_DATA_STRICT' | 'FEDERATED_IOC_ONLY';
  syncLatencyMs: number;
  nodesCount: number;
  threatsMitigatedCount: number;
  consensusRole: 'LEADER' | 'FOLLOWER';
}

// ==========================================
// 5. Sigma Rules
// ==========================================
export interface SigmaRuleDefinition {
  id: string;
  title: string;
  status: 'EXPERIMENTAL' | 'PRODUCTION_DEPLOYED';
  author: string;
  logsource: {
    category: string;
    product: string;
  };
  detectionSummary: string;
  condition: string;
  matchedCount: number;
  yamlCode: string;
}

// ==========================================
// 6. Live Cyber Drill & Adversary Emulation
// ==========================================
export interface CyberDrillScenario {
  id: string;
  name: string;
  nameAr: string;
  mitreScenario: string;
  threatActorGroup: string;
  targetDomain: 'CRITICAL_INFRASTRUCTURE' | 'FINANCIAL_CORE' | 'GOV_TELEMETRY';
  complexityLevel: 'NATION_STATE_APT' | 'HYBRID_WARFARE' | 'STEALTH_LATERAL';
  estimatedDurationSec: number;
  simulatedVectorsCount: number;
  autonomousRemediationGoal: string;
  autonomousRemediationGoalAr: string;
}

// ==========================================
// Initial Seed Data for Global Enterprise Hub
// ==========================================

export const INITIAL_STIX_FEEDS: StixFeedStatus[] = [
  {
    feedId: 'feed-cisa-ais',
    feedName: 'CISA Automated Indicator Sharing (AIS)',
    provider: 'US Cybersecurity & Infrastructure Security Agency',
    protocol: 'TAXII 2.1',
    status: 'CONNECTED',
    indicatorsCount: 14820,
    lastSyncTime: 'Just now (12s ago)',
    latencyMs: 38
  },
  {
    feedId: 'feed-alienvault-otx',
    feedName: 'AlienVault OTX Pulse Stream',
    provider: 'AT&T Cybersecurity Community',
    protocol: 'STIX 2.1 HTTPS',
    status: 'CONNECTED',
    indicatorsCount: 42910,
    lastSyncTime: '34s ago',
    latencyMs: 64
  },
  {
    feedId: 'feed-mandiant-adv',
    feedName: 'Mandiant Threat Intelligence Feed',
    provider: 'Google Cloud Mandiant Intelligence',
    protocol: 'REST/mTLS',
    status: 'CONNECTED',
    indicatorsCount: 9540,
    lastSyncTime: '1m ago',
    latencyMs: 42
  },
  {
    feedId: 'feed-sans-isc',
    feedName: 'SANS Internet Storm Center DShield',
    provider: 'SANS Technology Institute',
    protocol: 'STIX 2.1 HTTPS',
    status: 'CONNECTED',
    indicatorsCount: 28400,
    lastSyncTime: '2m ago',
    latencyMs: 51
  }
];

export const INITIAL_STIX_INDICATORS: StixThreatIndicator[] = [
  {
    id: 'indicator--9a4f21e0-33b1-4c55-8910-fe33441a9901',
    name: 'Volt Typhoon Sovereign Infrastructure Infiltration Tool',
    pattern: "[ipv4-addr:value = '198.51.100.74' AND network-traffic:dst_port = 443]",
    patternType: 'stix',
    validFrom: '2026-09-10T08:00:00Z',
    confidence: 96,
    threatActor: 'APT41 / Volt Typhoon',
    sourceFeed: 'MANDIANT_ADV',
    mitreTactic: 'Command and Control',
    mitreTechnique: 'T1071.001 - Web Protocols',
    severity: 'CRITICAL',
    indicatorType: 'ipv4-addr',
    value: '198.51.100.74',
    autoBlockRuleId: 'XDP-FW-9901',
    lastSeen: '4m ago'
  },
  {
    id: 'indicator--b23d51aa-12e4-4fa9-b889-cd77882e3344',
    name: 'Sandworm SCADA/Modbus Protocol Desynchronization Payload',
    pattern: "[file:hashes.'SHA-256' = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069']",
    patternType: 'yara',
    validFrom: '2026-09-11T12:00:00Z',
    confidence: 98,
    threatActor: 'Sandworm Group',
    sourceFeed: 'CISA_AIS',
    mitreTactic: 'Inhibit Response Function',
    mitreTechnique: 'T0815 - Denial of View',
    severity: 'CRITICAL',
    indicatorType: 'file-hash-sha256',
    value: '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    autoBlockRuleId: 'OT-ISOLATE-882E',
    lastSeen: '12m ago'
  },
  {
    id: 'indicator--c49f82d1-99ee-4712-9ab1-aa33990011ee',
    name: 'Cobalt Strike Malleable C2 Beaconing Fingerprint',
    pattern: "[domain-name:value = 'telemetry-cdn-edge-sync.net']",
    patternType: 'stix',
    validFrom: '2026-09-12T02:00:00Z',
    confidence: 92,
    threatActor: 'Lazarus / FIN7',
    sourceFeed: 'ALIENVAULT_OTX',
    mitreTactic: 'Exfiltration',
    mitreTechnique: 'T1041 - Exfiltration Over C2 Channel',
    severity: 'HIGH',
    indicatorType: 'domain-name',
    value: 'telemetry-cdn-edge-sync.net',
    autoBlockRuleId: 'DNS-SINKHOLE-0011',
    lastSeen: '18m ago'
  }
];

export const INITIAL_PRODUCTION_CONNECTORS: ProductionConnector[] = [
  {
    id: 'conn-paloalto-panos',
    name: 'Palo Alto Networks PAN-OS Zero-Trust Gateway',
    nameAr: 'بوابة بالو ألتو PAN-OS لانعدام الثقة',
    category: 'FIREWALL_SDN',
    vendor: 'Palo Alto Networks',
    endpointUrl: 'https://panos-api.mesh.internal/api/v10.2/dynamic-address-groups',
    authMethod: 'mTLS v1.3',
    status: 'ACTIVE_SHIELD',
    latencyMs: 14,
    actionsExecutedCount: 4218,
    lastHeartbeat: '2s ago',
    capabilities: ['Dynamic DAG Quarantine', 'eBPF Filter Sync', 'TLS Decryption Mirror']
  },
  {
    id: 'conn-crowdstrike-falcon',
    name: 'CrowdStrike Falcon Real-Time Host Isolation API',
    nameAr: 'محرك العزل اللحظي كراودسترايك فالكون',
    category: 'EDR_XDR',
    vendor: 'CrowdStrike Inc.',
    endpointUrl: 'https://api.crowdstrike.com/devices/entities/devices-actions/v2?action_name=contain',
    authMethod: 'OAuth 2.0 / Bearer',
    status: 'ACTIVE_SHIELD',
    latencyMs: 28,
    actionsExecutedCount: 894,
    lastHeartbeat: '4s ago',
    capabilities: ['Endpoint Network Quarantine', 'Process Memory Freeze', 'RTR Live Scripting']
  },
  {
    id: 'conn-cloudflare-flowspec',
    name: 'Cloudflare Magic Transit & BGP Flowspec Mesh',
    nameAr: 'شبكة كلاودفلير ماجيك ترانزيت وتدفق BGP Flowspec',
    category: 'FIREWALL_SDN',
    vendor: 'Cloudflare Global Anycast',
    endpointUrl: 'https://api.cloudflare.com/client/v4/accounts/mesh-acdc/magic/routes',
    authMethod: 'Hardware HSM API Key',
    status: 'ONLINE',
    latencyMs: 8,
    actionsExecutedCount: 15320,
    lastHeartbeat: '1s ago',
    capabilities: ['Sub-Second BGP Flowspec Drop', 'Anycast Volumetric Scrubber', 'GRE Tunnel Pinning']
  },
  {
    id: 'conn-azure-sentinel',
    name: 'Microsoft Sentinel SIEM / SOAR Ingestion Bridge',
    nameAr: 'جسر مايكروسوفت سينتينل للرصد والتحليل',
    category: 'CLOUD_SIEM',
    vendor: 'Microsoft Security',
    endpointUrl: 'https://management.azure.com/subscriptions/acdc-mesh/resourceGroups/SecOps',
    authMethod: 'OAuth 2.0 / Bearer',
    status: 'ONLINE',
    latencyMs: 46,
    actionsExecutedCount: 2940,
    lastHeartbeat: '5s ago',
    capabilities: ['KQL Automated Trigger', 'Incident Case Synchronization', 'Graph Security Graph API']
  },
  {
    id: 'conn-aws-guardduty',
    name: 'AWS GuardDuty & Security Hub Auto-Remediator',
    nameAr: 'منظومة AWS غارد ديوتي ومحور الأمان',
    category: 'CLOUD_SIEM',
    vendor: 'Amazon Web Services',
    endpointUrl: 'https://securityhub.eu-west-2.amazonaws.com/findings/import',
    authMethod: 'mTLS v1.3',
    status: 'ONLINE',
    latencyMs: 39,
    actionsExecutedCount: 1810,
    lastHeartbeat: '3s ago',
    capabilities: ['Security Group Live Revocation', 'IAM Role Session Termination', 'VPC Flow Log Streaming']
  },
  {
    id: 'conn-ot-scada-modbus',
    name: 'OT/SCADA Modbus & DNP3 Deterministic Airgap Shield',
    nameAr: 'درع الأنظمة الصناعية الحساسة OT/SCADA بروتوكول Modbus',
    category: 'OT_SCADA',
    vendor: 'ACDC Sovereign Industrial Module',
    endpointUrl: 'tls://scada-gateway.plant01.local:5020',
    authMethod: 'Hardware HSM API Key',
    status: 'ACTIVE_SHIELD',
    latencyMs: 3,
    actionsExecutedCount: 312,
    lastHeartbeat: '1s ago',
    capabilities: ['Coil Command White-Listing', 'Airgap Relay Actuation', 'Deterministic Packet Dropping']
  }
];

export const INITIAL_COMPLIANCE_SCORES: ComplianceFrameworkScore[] = [
  {
    frameworkId: 'NCA_ECC',
    frameworkName: 'NCA Essential Cybersecurity Controls (ECC-1:2018)',
    frameworkNameAr: 'الضوابط الأساسية للأمن السيبراني - الهيئة الوطنية للأمن السيبراني (NCA ECC)',
    organization: 'National Cybersecurity Authority (المملكة العربية السعودية)',
    score: 98.6,
    status: 'COMPLIANT',
    mandatoryControlsMet: 112,
    mandatoryControlsTotal: 114,
    keyArticlesMapped: [
      {
        articleCode: 'ECC-2-12-3',
        description: 'Automated Event Log Correlation & Instant Cyber Threat Containment',
        descriptionAr: 'التحليل والربط الآلي لسجلات الأحداث والاحتواء الفوري للتهديدات السيبرانية',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'ECC-3-1-2',
        description: 'Continuous Cryptographic Attestation and Network Micro-Segmentation',
        descriptionAr: 'التوثيق التشفيري المستمر وتقسيم الشبكات الدقيق (Micro-segmentation)',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'ECC-2-9-1',
        description: 'Autonomous Sub-second Protection Against Distributed Denial of Service (DDoS)',
        descriptionAr: 'الحماية اللحظية الذاتية ضد هجمات حجب الخدمة الموزعة (DDoS)',
        status: 'ACTIVE_AUTOMATED'
      }
    ]
  },
  {
    frameworkId: 'NIST_CSF',
    frameworkName: 'NIST Cybersecurity Framework 2.0 (CSF 2.0)',
    frameworkNameAr: 'إطار المعهد الوطني الأمريكي للمعايير والتقنية (NIST CSF 2.0)',
    organization: 'National Institute of Standards and Technology (USA)',
    score: 97.4,
    status: 'COMPLIANT',
    mandatoryControlsMet: 104,
    mandatoryControlsTotal: 108,
    keyArticlesMapped: [
      {
        articleCode: 'RS.AN-03',
        description: 'Analysis is performed to determine what has occurred, who did it, and potential impact',
        descriptionAr: 'تحليل السبب الجذري والجهة المنفذة والأثر المحتمل فور وقوع الحادث',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'RS.MI-01',
        description: 'Incidents are contained, mitigated, and isolated automatically',
        descriptionAr: 'احتواء الحوادث وعزل مصادر التهديد بصورة آلية فورية',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'ID.RA-05',
        description: 'Threats, vulnerabilities, likelihoods, and impacts are used to determine risk',
        descriptionAr: 'توظيف قياسات الاحتمالية البايزية لحساب معدل المخاطر والتهديدات',
        status: 'ACTIVE_AUTOMATED'
      }
    ]
  },
  {
    frameworkId: 'ISO_27001',
    frameworkName: 'ISO/IEC 27001:2022 Information Security Management',
    frameworkNameAr: 'معيار الآيزو الدولي لإدارة أمن المعلومات (ISO/IEC 27001:2022)',
    organization: 'International Organization for Standardization',
    score: 96.8,
    status: 'COMPLIANT',
    mandatoryControlsMet: 90,
    mandatoryControlsTotal: 93,
    keyArticlesMapped: [
      {
        articleCode: 'A.8.16',
        description: 'Monitoring activities for anomalous behavior and potential security incidents',
        descriptionAr: 'المراقبة المستمرة للسلوك الشاذ وحوادث الأمن السيبراني المحتملة',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'A.8.20',
        description: 'Network controls, security mechanisms and service levels are implemented',
        descriptionAr: 'تطبيق ضوابط الشبكة المتطورة وبروتوكولات eBPF/XDP المعتمدة',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'A.5.24',
        description: 'Information security incident management planning and automated preparation',
        descriptionAr: 'إدارة واستجابة الحوادث الأمنية وخطط الاحتواء الاستباقية',
        status: 'ACTIVE_AUTOMATED'
      }
    ]
  },
  {
    frameworkId: 'DGSSI_DNSSI',
    frameworkName: 'Morocco National Directive for Information Systems Security (DNSSI)',
    frameworkNameAr: 'التوجيهية الوطنية لأمن نظم المعلومات - المديرية العامة لأمن نظم المعلومات (DGSSI - sécurité Maroc)',
    organization: 'Direction Générale de la Sécurité des Systèmes d\'Information (DGSSI - sécurité Maroc)',
    score: 99.1,
    status: 'COMPLIANT',
    mandatoryControlsMet: 98,
    mandatoryControlsTotal: 99,
    keyArticlesMapped: [
      {
        articleCode: 'DNSSI-M.5.1',
        description: 'Sovereign data hosting strictly within national borders with hardware isolation',
        descriptionAr: 'استضافة ومعالجة البيانات السيادية حصراً داخل التراب الوطني مع العزل المادي',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'DNSSI-M.7.3',
        description: 'Real-time proactive intrusion response, eBPF telemetry and forensic Merkle chain',
        descriptionAr: 'الاستجابة الفورية الاستباقية للهجمات مع التوثيق الجنائي بسلسلة ميركل المشفرة',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'DNSSI-M.8.2',
        description: 'Autonomous zero-trust micro-segmentation of critical national infrastructures',
        descriptionAr: 'التقسيم الشبكي المجهري الصارم وفق نموذج انعدام الثقة للبنى التحتية الحيوية',
        status: 'ACTIVE_AUTOMATED'
      }
    ]
  },
  {
    frameworkId: 'NIS2_DORA',
    frameworkName: 'EU NIS2 Directive & Digital Operational Resilience Act (DORA)',
    frameworkNameAr: 'توجيه الاتحاد الأوروبي NIS2 وقانون المرونة التشغيلية الرقمية (DORA)',
    organization: 'European Union Cybersecurity Agency (ENISA)',
    score: 95.2,
    status: 'COMPLIANT',
    mandatoryControlsMet: 78,
    mandatoryControlsTotal: 82,
    keyArticlesMapped: [
      {
        articleCode: 'NIS2-Art.21',
        description: 'Multi-factor authentication, secured communications, and real-time containment',
        descriptionAr: 'الاتصالات المشفرة والاستجابة اللحظية لحوادث البنى التحتية الحيوية',
        status: 'ACTIVE_AUTOMATED'
      },
      {
        articleCode: 'DORA-Art.12',
        description: 'Detection of anomalous activities, ICT-related incidents, and network telemetry',
        descriptionAr: 'كشف الأنشطة الشاذة والحوادث التقنية اللحظية في القطاعات المالية',
        status: 'ACTIVE_AUTOMATED'
      }
    ]
  }
];

export const INITIAL_SOVEREIGN_CLUSTERS: SovereignClusterNode[] = [
  {
    id: 'cluster-rabat-01',
    regionCode: 'ma-north-1',
    locationName: 'Rabat Sovereign Cybersecurity & Defense Grid',
    locationNameAr: 'مركز العمليات والسيادة السيبرانية الوطني - الرباط',
    countryCode: 'MA',
    flagEmoji: '🇲🇦',
    status: 'PRIMARY',
    sovereigntyPolicy: 'LOCAL_DATA_STRICT',
    syncLatencyMs: 1.4,
    nodesCount: 72,
    threatsMitigatedCount: 1840,
    consensusRole: 'LEADER'
  },
  {
    id: 'cluster-riyadh-01',
    regionCode: 'sa-central-1',
    locationName: 'Riyadh Sovereign Security Operation Grid',
    locationNameAr: 'مركز العمليات السيادي المركزي - الرياض',
    countryCode: 'SA',
    flagEmoji: '🇸🇦',
    status: 'PRIMARY',
    sovereigntyPolicy: 'LOCAL_DATA_STRICT',
    syncLatencyMs: 1.8,
    nodesCount: 64,
    threatsMitigatedCount: 1429,
    consensusRole: 'LEADER'
  },
  {
    id: 'cluster-frankfurt-01',
    regionCode: 'eu-central-1',
    locationName: 'Frankfurt Financial Cloud Mesh',
    locationNameAr: 'الشبكة المالية السحابية - فرانكفورت',
    countryCode: 'DE',
    flagEmoji: '🇩🇪',
    status: 'REPLICA_SYNCED',
    sovereigntyPolicy: 'FEDERATED_IOC_ONLY',
    syncLatencyMs: 44.2,
    nodesCount: 48,
    threatsMitigatedCount: 892,
    consensusRole: 'FOLLOWER'
  },
  {
    id: 'cluster-london-01',
    regionCode: 'eu-west-2',
    locationName: 'London Financial & Government SOC',
    locationNameAr: 'مركز العمليات المالية والحكومية - لندن',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    status: 'REPLICA_SYNCED',
    sovereigntyPolicy: 'FEDERATED_IOC_ONLY',
    syncLatencyMs: 48.6,
    nodesCount: 52,
    threatsMitigatedCount: 1104,
    consensusRole: 'FOLLOWER'
  },
  {
    id: 'cluster-singapore-01',
    regionCode: 'ap-southeast-1',
    locationName: 'Singapore Pacific Maritime & Core Gateway',
    locationNameAr: 'بوابة المحيط الهادئ والملاحة - سنغافورة',
    countryCode: 'SG',
    flagEmoji: '🇸🇬',
    status: 'REPLICA_SYNCED',
    sovereigntyPolicy: 'FEDERATED_IOC_ONLY',
    syncLatencyMs: 76.1,
    nodesCount: 36,
    threatsMitigatedCount: 645,
    consensusRole: 'FOLLOWER'
  },
  {
    id: 'cluster-virginia-01',
    regionCode: 'us-east-1',
    locationName: 'Virginia Sovereign Federal Hub',
    locationNameAr: 'المركز الفيدرالي السيادي - فرجينيا',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    status: 'REPLICA_SYNCED',
    sovereigntyPolicy: 'FEDERATED_IOC_ONLY',
    syncLatencyMs: 82.4,
    nodesCount: 80,
    threatsMitigatedCount: 2310,
    consensusRole: 'FOLLOWER'
  }
];

export const INITIAL_SIGMA_RULES: SigmaRuleDefinition[] = [
  {
    id: 'sigma-rule-volumetric-syn-exhaustion',
    title: 'Detection of High-Velocity SYN Flooding with High Entropy Deviation',
    status: 'PRODUCTION_DEPLOYED',
    author: 'ACDC Detection Engineering Team',
    logsource: {
      category: 'network_traffic',
      product: 'ebpf_xdp_probes'
    },
    detectionSummary: 'Detects wire packets with SYN flag set where entropy delta exceeds 1.2 b/B and rate exceeds 500,000 pps',
    condition: 'selection_syn_flags and high_entropy_deviation',
    matchedCount: 124,
    yamlCode: `title: High Velocity SYN Flood with Kernel Bypass
id: acdc-sigma-001
status: production
description: Identifies distributed SYN floods violating Shannon entropy baselines
logsource:
    category: network_traffic
    product: ebpf_probes
detection:
    selection:
        tcp.flags.syn: 1
        tcp.flags.ack: 0
    timeframe: 100ms
    condition: selection | count() > 25000 and entropy_delta > 1.2
level: critical`
  },
  {
    id: 'sigma-rule-lateral-kerberoast-ldap',
    title: 'Lateral Movement via Kerberoasting & Anomalous RPC Invocations',
    status: 'PRODUCTION_DEPLOYED',
    author: 'ACDC Autonomous Core Team',
    logsource: {
      category: 'authentication',
      product: 'active_directory_kerberos'
    },
    detectionSummary: 'Flags repeated TGS ticket requests with RC4-HMAC encryption targeting service principal names',
    condition: 'selection_tgs_rc4 and count_spn_targets > 5',
    matchedCount: 38,
    yamlCode: `title: Kerberoast SPN Ticket Extraction
id: acdc-sigma-002
status: production
description: Detects lateral movement ticket generation requesting RC4-HMAC service tickets
logsource:
    category: auth
    product: kerberos
detection:
    selection:
        EventID: 4769
        TicketEncryptionType: 0x17
    condition: selection | count() by TargetUserName > 5
level: high`
  }
];

export const INITIAL_CYBER_DRILLS: CyberDrillScenario[] = [
  {
    id: 'drill-nation-state-ransomware',
    name: 'Nation-State Kinetic Ransomware Outbreak (Volt Typhoon / BlackCat)',
    nameAr: 'محاكاة تفشي برمجية فدية سيادية متقدمة (Volt Typhoon / BlackCat)',
    mitreScenario: 'T1486 Data Encrypted for Impact + T1078 Valid Accounts',
    threatActorGroup: 'APT41 / BlackCat Syndicate',
    targetDomain: 'CRITICAL_INFRASTRUCTURE',
    complexityLevel: 'NATION_STATE_APT',
    estimatedDurationSec: 4.2,
    simulatedVectorsCount: 8,
    autonomousRemediationGoal: 'Sub-second micro-isolation of active domain controllers & host memory freeze via CrowdStrike RTR within 450ms',
    autonomousRemediationGoalAr: 'عزل مجهري لحظي لمتحكمات النطاق وتجميد الذاكرة العشوائية عبر كراودسترايك في أقل من 450 مللي ثانية'
  },
  {
    id: 'drill-scada-blackout-grid',
    name: 'Power Grid SCADA / Modbus Protocol Desynchronization Attack',
    nameAr: 'هجوم تعطيل وتزامن بروتوكولات شبكات الطاقة والتحكم الصناعي SCADA / Modbus',
    mitreScenario: 'T0815 Denial of View + T0855 Unauthorized Command Message',
    threatActorGroup: 'Sandworm / Industroyer2',
    targetDomain: 'CRITICAL_INFRASTRUCTURE',
    complexityLevel: 'HYBRID_WARFARE',
    estimatedDurationSec: 3.6,
    simulatedVectorsCount: 5,
    autonomousRemediationGoal: 'Deterministic hardware airgap relay trigger and PLC coil write-command whitelisting within 250ms',
    autonomousRemediationGoalAr: 'تفعيل مرحل العزل المادي الحقيقي Airgap وحظر أوامر الكتابة الخبيثة في أقل من 250 مللي ثانية'
  },
  {
    id: 'drill-stealth-dns-exfiltration',
    name: 'Stealth Multiplexed DNS Tunneling & C2 Beacon Exfiltration',
    nameAr: 'تسريب بيانات مشفر خفي عبر أنفاق DNS متعددة ونقاط C2 خفية',
    mitreScenario: 'T1071.004 DNS Exfiltration + T1048 Exfiltration Over Alternative Protocol',
    threatActorGroup: 'Lazarus / APT38',
    targetDomain: 'FINANCIAL_CORE',
    complexityLevel: 'STEALTH_LATERAL',
    estimatedDurationSec: 2.8,
    simulatedVectorsCount: 6,
    autonomousRemediationGoal: 'Autonomous sinkholing of TXT record queries and BGP Anycast route diversion in 180ms',
    autonomousRemediationGoalAr: 'إسقاط وتوجيه استعلامات DNS الشاذة فورياً إلى ثقب أسود Sinkhole في أقل من 180 مللي ثانية'
  }
];
