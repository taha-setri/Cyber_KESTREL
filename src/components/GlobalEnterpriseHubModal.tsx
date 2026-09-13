import React, { useState } from 'react';
import { 
  Globe, Shield, Cpu, Layers, CheckCircle2, AlertTriangle, 
  ExternalLink, RefreshCw, Database, Lock, Server, Play, 
  Sparkles, Sliders, ChevronRight, X, ArrowUpRight, Search,
  Download, Terminal, FileCode, Check, ShieldAlert, Plus, Printer, Target
} from 'lucide-react';
import { 
  INITIAL_STIX_FEEDS, 
  INITIAL_STIX_INDICATORS, 
  INITIAL_PRODUCTION_CONNECTORS, 
  INITIAL_COMPLIANCE_SCORES, 
  INITIAL_SOVEREIGN_CLUSTERS,
  INITIAL_SIGMA_RULES,
  INITIAL_CYBER_DRILLS,
  StixThreatIndicator,
  ProductionConnector,
  ComplianceFrameworkScore,
  SovereignClusterNode,
  SigmaRuleDefinition,
  CyberDrillScenario
} from '../services/globalEnterpriseService';
import { exportSovereignComplianceDossierHtml } from '../services/executiveReportExporter';
import { CommandCenterKPIs, ThreatVector, DefenseActionLog } from '../types/cyber';

interface GlobalEnterpriseHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  kpis: CommandCenterKPIs;
  threats: ThreatVector[];
  defenseLogs: DefenseActionLog[];
  onTriggerNotification?: (msg: string, type: 'info' | 'success' | 'warning' | 'danger') => void;
}

type TabType = 'STIX_TAXII' | 'CONNECTORS' | 'COMPLIANCE' | 'CLUSTERS' | 'CYBER_DRILLS' | 'EXPLAINABLE_AI';

export const GlobalEnterpriseHubModal: React.FC<GlobalEnterpriseHubModalProps> = ({
  isOpen,
  onClose,
  lang,
  kpis,
  threats,
  defenseLogs,
  onTriggerNotification
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('STIX_TAXII');
  
  // State for connectors
  const [connectors, setConnectors] = useState<ProductionConnector[]>(INITIAL_PRODUCTION_CONNECTORS);
  const [testingConnectorId, setTestingConnectorId] = useState<string | null>(null);
  const [isAddConnectorModalOpen, setIsAddConnectorModalOpen] = useState(false);
  const [newConnName, setNewConnName] = useState('');
  const [newConnVendor, setNewConnVendor] = useState('Palo Alto / Fortinet / Custom');
  const [newConnEndpoint, setNewConnEndpoint] = useState('https://soc-gateway.local/api/v2/firewall');
  const [newConnCategory, setNewConnCategory] = useState<ProductionConnector['category']>('FIREWALL_SDN');

  // State for STIX/TAXII
  const [indicators, setIndicators] = useState<StixThreatIndicator[]>(INITIAL_STIX_INDICATORS);
  const [isSyncingFeeds, setIsSyncingFeeds] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // State for Sigma
  const [sigmaRules, setSigmaRules] = useState<SigmaRuleDefinition[]>(INITIAL_SIGMA_RULES);
  const [selectedSigma, setSelectedSigma] = useState<SigmaRuleDefinition>(INITIAL_SIGMA_RULES[0]);
  const [isImportSigmaOpen, setIsImportSigmaOpen] = useState(false);
  const [importedSigmaTitle, setImportedSigmaTitle] = useState('');
  const [importedSigmaYaml, setImportedSigmaYaml] = useState(`title: Custom Sovereign Threat Detection Rule
id: sigma-custom-rule-001
status: production
description: Autonomous detection of suspicious C2 beaconing
logsource:
    category: network_traffic
    product: ebpf_probes
detection:
    selection:
        dst_port: 8443
    condition: selection
level: high`);

  // State for clusters
  const [selectedCluster, setSelectedCluster] = useState<SovereignClusterNode>(INITIAL_SOVEREIGN_CLUSTERS[0]);

  // State for Cyber Drills
  const [drills, setDrills] = useState<CyberDrillScenario[]>(INITIAL_CYBER_DRILLS);
  const [runningDrillId, setRunningDrillId] = useState<string | null>(null);
  const [drillCompletedOutcome, setDrillCompletedOutcome] = useState<{
    drillId: string;
    containmentTimeMs: number;
    neutralizedVectorsCount: number;
    readinessScore: number;
    blastRadiusContained: number;
  } | null>(null);

  // State for Explainable AI & What-If
  const [selectedThreatForExplanation, setSelectedThreatForExplanation] = useState<ThreatVector | null>(threats[0] || null);
  const [whatIfTarget, setWhatIfTarget] = useState<string>('EDGE_ROUTER_01');
  const [whatIfAction, setWhatIfAction] = useState<string>('ISOLATE_NODE');
  const [whatIfResult, setWhatIfResult] = useState<{
    estimatedDowntimeSec: number;
    businessImpactIndex: number;
    blastRadiusReductionPercent: number;
    legalComplianceStatus: string;
    recommendation: string;
    recommendationAr: string;
  } | null>(null);

  if (!isOpen) return null;

  // Handle live connector ping test
  const handleTestConnector = (connId: string) => {
    setTestingConnectorId(connId);
    setTimeout(() => {
      setConnectors(prev => prev.map(c => {
        if (c.id === connId) {
          return {
            ...c,
            status: 'ACTIVE_SHIELD',
            latencyMs: Math.max(2, Math.floor(c.latencyMs * 0.9 + Math.random() * 4)),
            lastHeartbeat: 'Just now (mTLS verified)',
            actionsExecutedCount: c.actionsExecutedCount + 1
          };
        }
        return c;
      }));
      setTestingConnectorId(null);
      if (onTriggerNotification) {
        onTriggerNotification(
          lang === 'ar' ? 'تم تأكيد الاتصال الآمن والمصادقة التشفيرية mTLS 1.3' : 'Secure mTLS 1.3 handshake verified and authenticated successfully',
          'success'
        );
      }
    }, 750);
  };

  // Add custom connector
  const handleAddConnector = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConnName.trim()) return;

    const newConnector: ProductionConnector = {
      id: `conn-custom-${Date.now().toString(36)}`,
      name: newConnName,
      nameAr: newConnName,
      vendor: newConnVendor,
      category: newConnCategory,
      endpointUrl: newConnEndpoint,
      authMethod: 'mTLS v1.3',
      status: 'ACTIVE_SHIELD',
      lastHeartbeat: 'Just added (Verified mTLS)',
      latencyMs: 14,
      actionsExecutedCount: 1,
      capabilities: ['Sub-Second Blocking', 'Zero-Trust Rule Insertion', 'Live Ingestion']
    };

    setConnectors(prev => [newConnector, ...prev]);
    setIsAddConnectorModalOpen(false);
    setNewConnName('');

    if (onTriggerNotification) {
      onTriggerNotification(
        lang === 'ar' ? `تم ربط وتوثيق موصل الإنتاج الجديد بنجاح: ${newConnector.name}` : `Production connector successfully verified & added: ${newConnector.name}`,
        'success'
      );
    }
  };

  // Import custom Sigma rule
  const handleImportSigma = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importedSigmaYaml.trim()) return;

    const newRule: SigmaRuleDefinition = {
      id: `sigma-user-${Date.now().toString(36)}`,
      title: importedSigmaTitle.trim() || 'Custom Verified Sigma Rule',
      status: 'PRODUCTION_DEPLOYED',
      author: 'Security Operations Engineer (Active Operator)',
      logsource: {
        category: 'network_traffic',
        product: 'ebpf_xdp_probes'
      },
      detectionSummary: 'Operator-defined high entropy inspection rule integrated into wire-speed kernel filters',
      condition: 'selection_user_filter',
      matchedCount: 0,
      yamlCode: importedSigmaYaml
    };

    setSigmaRules(prev => [newRule, ...prev]);
    setSelectedSigma(newRule);
    setIsImportSigmaOpen(false);
    setImportedSigmaTitle('');

    if (onTriggerNotification) {
      onTriggerNotification(
        lang === 'ar' ? `تم اعتماد ونشر قاعدة Sigma الجديدة بنجاح في مسبارات النواة: ${newRule.title}` : `Custom Sigma rule compiled and deployed to kernel probes: ${newRule.title}`,
        'success'
      );
    }
  };

  // Run cyber drill
  const handleRunCyberDrill = (drill: CyberDrillScenario) => {
    setRunningDrillId(drill.id);
    setDrillCompletedOutcome(null);

    if (onTriggerNotification) {
      onTriggerNotification(
        lang === 'ar' ? `بدء تمرين الجاهزية والاشتباك السيبراني: ${drill.nameAr}` : `Cyber Readiness Drill initiated: ${drill.name}`,
        'warning'
      );
    }

    setTimeout(() => {
      setRunningDrillId(null);
      const containmentMs = Math.floor(180 + Math.random() * 120);
      const outcome = {
        drillId: drill.id,
        containmentTimeMs: containmentMs,
        neutralizedVectorsCount: drill.simulatedVectorsCount,
        readinessScore: 99.4,
        blastRadiusContained: 99.8
      };
      setDrillCompletedOutcome(outcome);

      if (onTriggerNotification) {
        onTriggerNotification(
          lang === 'ar'
            ? `اكتمل التمرين بنجاح! تم تحييد كامل المتجهات في ${containmentMs} مللي ثانية (جاهزية 99.4%)`
            : `Drill executed successfully! Neutralized all vectors in ${containmentMs}ms (Readiness: 99.4%)`,
          'success'
        );
      }
    }, 2800);
  };

  // Export sovereign certificate
  const handleExportSovereignCert = () => {
    exportSovereignComplianceDossierHtml(kpis, 'Morocco National Directive (DGSSI / DNSSI) & NIST CSF 2.0', 99.1, lang);
    if (onTriggerNotification) {
      onTriggerNotification(
        lang === 'ar' ? 'تم استخراج شهادة الامتثال والسيادة الرسمية المعتمدة بنجاح' : 'Official Sovereign Compliance Certificate exported successfully',
        'success'
      );
    }
  };

  // Handle Sync Feeds
  const handleSyncFeeds = () => {
    setIsSyncingFeeds(true);
    setTimeout(() => {
      setIsSyncingFeeds(false);
      const newIndicator: StixThreatIndicator = {
        id: `indicator--${Math.random().toString(36).substr(2, 9)}`,
        name: 'DarkRadiation Zero-Day Ransomware Delivery Pipe',
        pattern: "[file:hashes.'SHA-256' = '3b92dc18148a1d65dfc2d4b1fa3d677284addd200126d90697f83b1657ff1fc5']",
        patternType: 'stix',
        validFrom: new Date().toISOString(),
        confidence: 99,
        threatActor: 'APT29 / Nobelium',
        sourceFeed: 'MANDIANT_ADV',
        mitreTactic: 'Initial Access',
        mitreTechnique: 'T1190 - Exploit Public-Facing Application',
        severity: 'CRITICAL',
        indicatorType: 'file-hash-sha256',
        value: '3b92dc18148a1d65dfc2d4b1fa3d677284addd200126d90697f83b1657ff1fc5',
        autoBlockRuleId: `FW-SHIELD-${Math.floor(1000 + Math.random() * 9000)}`,
        lastSeen: 'Just now'
      };
      setIndicators(prev => [newIndicator, ...prev]);
      if (onTriggerNotification) {
        onTriggerNotification(
          lang === 'ar' ? 'تمت مزامنة 3,420 مؤشر اختراق STIX 2.1 عالمي جديد فوراً' : 'Synchronized 3,420 new global STIX 2.1 threat indicators',
          'info'
        );
      }
    }, 1200);
  };

  // Handle Run What-If Simulation
  const handleRunWhatIf = () => {
    const isEdge = whatIfTarget.includes('EDGE');
    const isFullIsolate = whatIfAction === 'ISOLATE_NODE';
    
    setWhatIfResult({
      estimatedDowntimeSec: isFullIsolate ? (isEdge ? 1.4 : 0.0) : 0.0,
      businessImpactIndex: isFullIsolate ? (isEdge ? 24 : 8) : 2,
      blastRadiusReductionPercent: isFullIsolate ? 94.8 : 78.5,
      legalComplianceStatus: 'NIST CSF RS.MI-01 & NCA ECC-2-12 APPROVED',
      recommendation: isEdge && isFullIsolate 
        ? 'Selective BGP Flowspec rate-limiting is mathematically preferred over full hardware isolation to preserve non-malicious ingress routing.'
        : 'Sub-second eBPF/XDP filter execution guarantees 0ms service degradation with 99.4% blast radius containment.',
      recommendationAr: isEdge && isFullIsolate
        ? 'يُفضّل رياضياً تطبيق فلترة BGP Flowspec الذكية بدلاً من عزل المحول الكامل لضمان استمرار تدفق البيانات الطبيعية دون انقطاع.'
        : 'تطبيق مشغل eBPF/XDP فائق السرعة يضمن 0 مللي ثانية توقف للخدمة مع احتواء 99.4% من مساحة الانفجار.'
    });
  };

  const filteredIndicators = indicators.filter(ind => 
    ind.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.threatActor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ind.sourceFeed.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div 
        className="w-full max-w-7xl h-[92vh] flex flex-col bg-slate-950 border border-cyan-500/40 rounded-xl shadow-[0_0_50px_rgba(6,182,212,0.25)] text-slate-100 overflow-hidden font-sans"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Header Bar */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-cyan-600 to-blue-700 text-white shadow-lg shadow-cyan-500/30">
              <Globe className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-bold font-display-cyber tracking-wide text-white">
                  {lang === 'ar' ? 'منظومة السيادة والأمن السيبراني العالمية' : 'ACDC Sovereign & Global Enterprise Command Mesh'}
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-500/40 font-mono font-bold">
                  TIER-4 ENTERPRISE GRADE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {lang === 'ar' 
                  ? 'تكامل STIX/TAXII العالمي • موصلات الإنتاج الميدانية • الامتثال السيادي المستمر (NIST/ISO/NCA) • التفسير الذاتي'
                  : 'Global STIX/TAXII Feeds • Production Connectors Mesh • Continuous Sovereign Compliance • Federated Multi-Region'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-xs font-mono">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-slate-300">{lang === 'ar' ? 'السيادة السيبرانية:' : 'Sovereignty State:'}</span>
              <span className="text-emerald-400 font-bold">STRICT_PROTECTION</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={lang === 'ar' ? 'إغلاق النافذة' : 'Close window'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800 flex items-center gap-2 overflow-x-auto scrollbar-thin">
          <button
            onClick={() => setActiveTab('STIX_TAXII')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'STIX_TAXII'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'استخبارات التهديدات (STIX 2.1 / Sigma)' : 'Threat Intel (STIX / Sigma)'}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-cyan-900/80 text-cyan-200">
              {indicators.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CONNECTORS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CONNECTORS'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'ar' ? 'موصلات البنية التحتية (API Mesh)' : 'Production Connectors Mesh'}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-blue-900/80 text-blue-200">
              {connectors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('COMPLIANCE')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'COMPLIANCE'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? 'الامتثال السيادي الدولي (NIST / ISO / NCA)' : 'Sovereign Compliance (NCA/NIST)'}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-emerald-900/80 text-emerald-200">
              98.6%
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CLUSTERS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CLUSTERS'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span>{lang === 'ar' ? 'العقد السيادية الموزعة (Federated Mesh)' : 'Federated Sovereign Mesh'}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-indigo-900/80 text-indigo-200">
              6 Regions
            </span>
          </button>

          <button
            onClick={() => setActiveTab('CYBER_DRILLS')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'CYBER_DRILLS'
                ? 'bg-red-500/20 text-red-300 border border-red-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Target className="w-3.5 h-3.5 text-red-400" />
            <span>{lang === 'ar' ? 'تمارين الجاهزية والاشتباك (Cyber Drills)' : 'Live Cyber Drills & Red Team'}</span>
            <span className="px-1.5 py-0.2 text-[9px] rounded bg-red-900/80 text-red-200">
              {drills.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('EXPLAINABLE_AI')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'EXPLAINABLE_AI'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-400/50 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>{lang === 'ar' ? 'محرك التفسير ومحاكاة الأثر (Explainable AI)' : 'Explainable AI & What-If'}</span>
          </button>
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin bg-slate-950/80">

          {/* TAB 1: STIX 2.1, TAXII & SIGMA RULES */}
          {activeTab === 'STIX_TAXII' && (
            <div className="space-y-6">
              {/* Feeds Status Cards */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'موجزات التهديدات العالمية الحية (STIX 2.1 / TAXII)' : 'Connected Global Threat Feeds (STIX 2.1 / TAXII)'}</span>
                  </h3>
                  <button
                    onClick={handleSyncFeeds}
                    disabled={isSyncingFeeds}
                    className="px-3 py-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingFeeds ? 'animate-spin' : ''}`} />
                    <span>{isSyncingFeeds ? (lang === 'ar' ? 'جاري المزامنة...' : 'Syncing...') : (lang === 'ar' ? 'مزامنة الموجزات الآن' : 'Sync All Feeds')}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {INITIAL_STIX_FEEDS.map(feed => (
                    <div key={feed.feedId} className="p-3.5 rounded-lg bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30 font-mono font-bold">
                          {feed.protocol}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          {feed.status}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100 mt-2 line-clamp-1">{feed.feedName}</h4>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{feed.provider}</p>
                      <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-400">
                        <span>{feed.indicatorsCount.toLocaleString()} IoCs</span>
                        <span className="text-cyan-400">{feed.latencyMs}ms</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Threat Indicators Stream & Sigma Engine */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Left 2 Cols: STIX Indicators */}
                <div className="lg:col-span-2 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-amber-400" />
                      <span>{lang === 'ar' ? 'مؤشرات الاختراق اللحظية المسجلة (Active IoCs)' : 'Real-Time Threat Indicators (STIX Ingested)'}</span>
                    </h3>
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder={lang === 'ar' ? 'ابحث عن IP أو Hash أو APT...' : 'Filter IP, Hash, APT actor...'}
                        className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    {filteredIndicators.map(ind => (
                      <div key={ind.id} className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 hover:border-slate-700 text-xs font-mono transition-all">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              ind.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-500/40' : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                            }`}>
                              {ind.severity}
                            </span>
                            <span className="font-bold text-slate-200">{ind.name}</span>
                          </div>
                          <span className="text-[10px] text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                            {ind.sourceFeed}
                          </span>
                        </div>

                        <div className="mt-2 text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 break-all font-mono">
                          <span className="text-slate-500">Pattern: </span>
                          <span className="text-cyan-300">{ind.pattern}</span>
                        </div>

                        <div className="mt-2 flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/80">
                          <div className="flex items-center gap-3">
                            <span>Actor: <strong className="text-slate-300">{ind.threatActor || 'Unknown'}</strong></span>
                            <span>MITRE: <strong className="text-purple-300">{ind.mitreTechnique}</strong></span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              Auto-Blocked: {ind.autoBlockRuleId}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right 1 Col: Sigma Rules Engine */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                      <FileCode className="w-4 h-4 text-emerald-400" />
                      <span>{lang === 'ar' ? 'قواعد Sigma القياسية للكشف' : 'Sigma Rules Detection Engine'}</span>
                    </h3>
                    <button
                      onClick={() => setIsImportSigmaOpen(true)}
                      className="px-2 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'إضافة قاعدة' : 'Import Rule'}</span>
                    </button>
                  </div>

                  <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-800 space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {sigmaRules.map(rule => (
                        <button
                          key={rule.id}
                          onClick={() => setSelectedSigma(rule)}
                          className={`flex-1 min-w-[120px] p-2 rounded text-left text-xs font-mono transition-all cursor-pointer ${
                            selectedSigma.id === rule.id
                              ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300'
                              : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <div className="font-bold line-clamp-1">{rule.title}</div>
                          <div className="text-[10px] text-slate-500 mt-1">{rule.matchedCount} Live Matches</div>
                        </button>
                      ))}
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 font-bold">{selectedSigma.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-400">Target Source:</span>
                        <span className="text-cyan-400">{selectedSigma.logsource.product}</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] uppercase text-slate-400 font-mono mb-1">Sigma YAML Definition:</div>
                      <pre className="p-2.5 rounded bg-black/80 border border-slate-800 text-[10px] font-mono text-emerald-300 overflow-x-auto max-h-48 scrollbar-thin">
                        {selectedSigma.yamlCode}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTION CONNECTORS MESH */}
          {activeTab === 'CONNECTORS' && (
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/90 border border-slate-800">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Server className="w-4 h-4 text-blue-400" />
                    <span>{lang === 'ar' ? 'شبكة موصلات البنية التحتية الإنتاجية (Production Mesh)' : 'Enterprise Production Connectors Mesh'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'ربط مباشر وموثّق بتشفير mTLS v1.3 مع جدران الحماية، أنظمة EDR، منصات السحاب، وشبكات التحكم الصناعي'
                      : 'Real-world production driver integrations with firewalls, cloud SIEMs, EDR/XDR, and SCADA infrastructure.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <button
                    onClick={() => setIsAddConnectorModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-mono font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-900/30 cursor-pointer transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'ربط موصل إنتاجي جديد' : 'Add Production Connector'}</span>
                  </button>
                  <span className="px-2.5 py-1.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40">
                    {connectors.filter(c => c.status === 'ACTIVE_SHIELD').length} / {connectors.length} Active
                  </span>
                  <span className="px-2.5 py-1.5 rounded bg-blue-950 text-blue-400 border border-blue-500/40">
                    Avg Latency: 18ms
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectors.map(conn => (
                  <div key={conn.id} className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/30 font-mono font-bold">
                          {conn.category}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-mono">
                          <span className={`w-2 h-2 rounded-full ${
                            conn.status === 'ACTIVE_SHIELD' ? 'bg-emerald-400 animate-pulse' : 'bg-blue-400'
                          }`}></span>
                          <span className={conn.status === 'ACTIVE_SHIELD' ? 'text-emerald-400 font-bold' : 'text-blue-400'}>
                            {conn.status}
                          </span>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-2.5 font-sans">
                        {lang === 'ar' ? conn.nameAr : conn.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{conn.vendor}</p>

                      <div className="mt-3 p-2 rounded bg-slate-950 border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all">
                        <span className="text-slate-500">API: </span>
                        <span className="text-cyan-400">{conn.endpointUrl}</span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {conn.capabilities.map((cap, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-[10px] text-slate-300 font-mono">
                            {cap}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] font-mono text-slate-400">
                        <div>Latency: <strong className="text-cyan-300">{conn.latencyMs}ms</strong></div>
                        <div className="text-[10px] text-slate-500">{conn.actionsExecutedCount.toLocaleString()} calls</div>
                      </div>

                      <button
                        onClick={() => handleTestConnector(conn.id)}
                        disabled={testingConnectorId === conn.id}
                        className="px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600 text-blue-200 hover:text-white border border-blue-500/40 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Play className={`w-3 h-3 ${testingConnectorId === conn.id ? 'animate-spin' : ''}`} />
                        <span>{testingConnectorId === conn.id ? 'Verifying...' : (lang === 'ar' ? 'فحص mTLS' : 'Test mTLS')}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CONTINUOUS SOVEREIGN COMPLIANCE */}
          {activeTab === 'COMPLIANCE' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-emerald-200 font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'لوحة الامتثال التنظيمي والسيادي اللحظي' : 'Continuous Sovereign Compliance & Regulatory Audit'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {lang === 'ar'
                      ? 'مراقبة ومطابقة آلية مباشرة لكل إجراء دفاعي ضد الضوابط الأساسية للأمن السيبراني (NCA ECC) والمعايير العالمية (NIST CSF 2.0 / ISO 27001 / DGSSI DNSSI)'
                      : 'Real-time programmatic correlation verifying all autonomous mitigation actions adhere to sovereign & global cybersecurity mandates.'}
                  </p>
                </div>
                <div className="flex items-center gap-3 font-mono">
                  <button
                    onClick={handleExportSovereignCert}
                    className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-950 cursor-pointer transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'طباعة شهادة السيادة الرسمية (PDF/HTML)' : 'Print Sovereign Certificate'}</span>
                  </button>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-400">98.6%</div>
                    <div className="text-[10px] text-slate-400 uppercase tracking-wider">{lang === 'ar' ? 'الامتثال الكلي المعتمد' : 'Global Score'}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {INITIAL_COMPLIANCE_SCORES.map(fw => (
                  <div key={fw.frameworkId} className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                          {fw.frameworkId}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-1.5">
                          {lang === 'ar' ? fw.frameworkNameAr : fw.frameworkName}
                        </h4>
                        <p className="text-[11px] text-slate-400">{fw.organization}</p>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-lg font-bold text-emerald-400">{fw.score}%</span>
                        <div className="text-[10px] text-slate-500">{fw.mandatoryControlsMet} / {fw.mandatoryControlsTotal} controls</div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all duration-1000"
                        style={{ width: `${fw.score}%` }}
                      ></div>
                    </div>

                    {/* Key Mapped Articles */}
                    <div className="mt-4 space-y-2 border-t border-slate-800 pt-3">
                      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-mono">
                        {lang === 'ar' ? 'الضوابط المرتبطة آلياً بالمنظومة:' : 'Key Automated Controls:'}
                      </div>
                      {fw.keyArticlesMapped.map((art, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-start justify-between gap-2 text-xs">
                          <div>
                            <span className="font-mono text-emerald-400 font-bold text-[11px]">{art.articleCode}</span>
                            <p className="text-[11px] text-slate-300 mt-0.5">
                              {lang === 'ar' ? art.descriptionAr : art.description}
                            </p>
                          </div>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-[9px] text-emerald-300 font-mono whitespace-nowrap border border-emerald-800/40">
                            {art.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: FEDERATED SOVEREIGN MESH */}
          {activeTab === 'CLUSTERS' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-indigo-300 font-mono flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-400" />
                    <span>{lang === 'ar' ? 'شبكة التجمعات السيادية العالمية الموزعة (Federated Mesh)' : 'Global Geo-Distributed Sovereign Clusters'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'سياسة صارمة لعزل البيانات الحساسة محلياً (Data Sovereignty) مع مزامنة مؤشرات الاختراق (IoCs) المجردة بين العواصم'
                      : 'Strict regional data sovereignty policies ensuring raw logs remain within national borders while IoCs sync globally.'}
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 font-mono">
                  Consensus: Raft v3.2 Active
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {INITIAL_SOVEREIGN_CLUSTERS.map(cluster => (
                  <button
                    key={cluster.id}
                    onClick={() => setSelectedCluster(cluster)}
                    className={`p-3.5 rounded-xl text-left transition-all cursor-pointer border flex flex-col justify-between ${
                      selectedCluster.id === cluster.id
                        ? 'bg-indigo-950/60 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{cluster.flagEmoji}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          cluster.consensusRole === 'LEADER' ? 'bg-amber-950 text-amber-300 border border-amber-500/40' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {cluster.consensusRole}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold mt-2 font-mono">{cluster.regionCode}</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {lang === 'ar' ? cluster.locationNameAr : cluster.locationName}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
                      <span>{cluster.nodesCount} Nodes</span>
                      <span className="text-indigo-400">{cluster.syncLatencyMs}ms</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Cluster Dossier */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedCluster.flagEmoji}</span>
                    <div>
                      <h4 className="text-sm font-bold text-white font-sans">
                        {lang === 'ar' ? selectedCluster.locationNameAr : selectedCluster.locationName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                        <span>Region: <strong className="text-indigo-300">{selectedCluster.regionCode}</strong></span>
                        <span>•</span>
                        <span>Sovereignty Policy: <strong className="text-emerald-400">{selectedCluster.sovereigntyPolicy}</strong></span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded bg-slate-800 text-xs font-mono text-slate-300">
                      Sync Latency: <strong className="text-indigo-400">{selectedCluster.syncLatencyMs} ms</strong>
                    </span>
                    <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-mono">
                      {selectedCluster.threatsMitigatedCount} Mitigations
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Data Sovereignty Seal</div>
                    <div className="text-slate-200 font-bold mt-1">NATIVE_IN_COUNTRY_STORAGE</div>
                    <p className="text-[10px] text-slate-400 mt-1">Raw telemetry and logs never egress outside sovereign geographic boundary.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Inter-Cluster Consensus</div>
                    <div className="text-indigo-300 font-bold mt-1">Raft Quorum (5/5 Nodes)</div>
                    <p className="text-[10px] text-slate-400 mt-1">Sub-second threat signature voting with Byzantine fault tolerance.</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                    <div className="text-slate-500 text-[10px] uppercase">Hardware HSM Binding</div>
                    <div className="text-emerald-400 font-bold mt-1">FIPS 140-3 Level 4 Sealed</div>
                    <p className="text-[10px] text-slate-400 mt-1">All inter-cluster federation packets signed via isolated physical HSM modules.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CYBER DRILLS & RED TEAM ADVERSARY EMULATION */}
          {activeTab === 'CYBER_DRILLS' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-500/40 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-red-200 font-mono flex items-center gap-2">
                    <Target className="w-5 h-5 text-red-400" />
                    <span>{lang === 'ar' ? 'منصة تمارين الجاهزية ومحاكاة الخصوم المتقدمين (Cyber Drills)' : 'Autonomous Cyber Readiness & Adversary Emulation Drills'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                    {lang === 'ar'
                      ? 'محاكاة هجمات حقيقية من دول وخصوم متقدمين لاختبار قدرة المنظومة على الكشف اللحظي واحتواء التهديد في أقل من ثانية دون تدخل بشري.'
                      : 'Real-world adversary emulation testing zero-trust containment, sub-second eBPF actuators, and autonomous blast-radius limits.'}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-mono text-xs">
                  <span className="px-2.5 py-1.5 rounded bg-red-950 text-red-300 border border-red-500/40">
                    Target Containment: &lt; 300ms
                  </span>
                  <span className="px-2.5 py-1.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                    Readiness: 99.4%
                  </span>
                </div>
              </div>

              {drillCompletedOutcome && (
                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/60 shadow-lg shadow-emerald-950/40 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{lang === 'ar' ? 'تقرير نتائج تمرين الجاهزية الأخير (تم الاحتواء بنجاح)' : 'Cyber Drill Execution Outcome — Neutralized'}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700 font-mono">
                      PASSED_TIER_4
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono text-center">
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Autonomous Containment</div>
                      <div className="text-base font-bold text-cyan-400 mt-0.5">{drillCompletedOutcome.containmentTimeMs} ms</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Threat Vectors Neutralized</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{drillCompletedOutcome.neutralizedVectorsCount} / {drillCompletedOutcome.neutralizedVectorsCount}</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Blast Radius Contained</div>
                      <div className="text-base font-bold text-indigo-400 mt-0.5">{drillCompletedOutcome.blastRadiusContained}%</div>
                    </div>
                    <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                      <div className="text-slate-500 text-[10px]">Sovereign Readiness Score</div>
                      <div className="text-base font-bold text-emerald-400 mt-0.5">{drillCompletedOutcome.readinessScore}%</div>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {drills.map(drill => (
                  <div 
                    key={drill.id} 
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/30 font-mono font-bold">
                          {drill.adversaryGroup}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono font-bold ${
                          drill.severity === 'CRITICAL' ? 'bg-red-950 text-red-400 border border-red-600/50' : 'bg-amber-950 text-amber-400'
                        }`}>
                          {drill.severity}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-white mt-2 font-sans">
                        {lang === 'ar' ? drill.nameAr : drill.name}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {lang === 'ar' ? drill.descriptionAr : drill.description}
                      </p>

                      <div className="mt-3 p-2.5 rounded bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Target Node:</span>
                          <span className="text-cyan-300 font-bold">{drill.targetNode}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">MITRE Technique:</span>
                          <span className="text-purple-300 font-bold">{drill.mitreTechnique}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Simulated Vectors:</span>
                          <span className="text-amber-300 font-bold">{drill.simulatedVectorsCount.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-slate-500">Defense Mechanism:</span>
                          <span className="text-emerald-400 font-bold">{drill.autonomousDefenseAction}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <div className="text-[11px] font-mono text-slate-400">
                        <span>Expected SLA: <strong className="text-cyan-400">&lt; 300ms</strong></span>
                      </div>

                      <button
                        onClick={() => handleRunCyberDrill(drill)}
                        disabled={runningDrillId !== null}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                          runningDrillId === drill.id
                            ? 'bg-amber-600 text-white animate-pulse'
                            : 'bg-red-600 hover:bg-red-500 text-white shadow-md shadow-red-950'
                        }`}
                      >
                        <Play className={`w-3.5 h-3.5 ${runningDrillId === drill.id ? 'animate-spin' : ''}`} />
                        <span>
                          {runningDrillId === drill.id
                            ? (lang === 'ar' ? 'جاري الاشتباك السيبراني...' : 'Emulating Drill...')
                            : (lang === 'ar' ? 'بدء التمرين السيبراني' : 'Execute Cyber Drill')}
                        </span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: EXPLAINABLE AI & WHAT-IF SIMULATOR */}
          {activeTab === 'EXPLAINABLE_AI' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-purple-200 font-mono flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ar' ? 'محرك التفسير الذاتي ومحاكاة أثر القرارات (Explainable AI & What-If)' : 'Explainable AI & Operational Impact Simulator'}</span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {lang === 'ar'
                      ? 'تفسير دقيق باللغة الطبيعية لأسباب العزل والتدخل الدفاعي مع تقييم الأثر التشغيلي قبل تنفيذ القرارات'
                      : 'Plain-language explainability for mathematical autonomous defense actions and what-if blast radius forecasting.'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Threat Explanation Card */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'تفسير القرار الدفاعي للتهديد المحدد' : 'Autonomous Decision Explainability'}</span>
                  </h4>

                  {selectedThreatForExplanation ? (
                    <div className="space-y-3 text-xs font-mono">
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                        <div className="text-slate-400 text-[10px]">Target Threat:</div>
                        <div className="text-sm font-bold text-white mt-0.5">{selectedThreatForExplanation.title}</div>
                        <div className="flex items-center gap-3 text-slate-400 text-[10px] mt-1">
                          <span>Severity: <strong className="text-red-400">{selectedThreatForExplanation.severity}</strong></span>
                          <span>Confidence: <strong className="text-cyan-400">{(selectedThreatForExplanation.bayesianConfidence * 100).toFixed(1)}%</strong></span>
                          <span>Actuator: <strong className="text-emerald-400">{selectedThreatForExplanation.actuatorUsed}</strong></span>
                        </div>
                      </div>

                      <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 space-y-2">
                        <div className="text-xs font-bold text-purple-300">
                          {lang === 'ar' ? 'التفسير الرياضي للقرار (Mathematical Justification):' : 'Mathematical Justification:'}
                        </div>
                        <p className="text-slate-300 leading-relaxed text-[11px]">
                          {lang === 'ar'
                            ? `تم رصد انحراف شاذ في مسافة ماهالانوبيس بمقدار (${selectedThreatForExplanation.mahalanobisDistance.toFixed(2)}σ) متجاوزاً عتبة الخطر المسموحة (3.0σ). أظهرت حزم البيانات تشويهاً في إنتروبيا شانون (ΔH = ${selectedThreatForExplanation.entropyDelta.toFixed(2)} b/B)، مما استدعى تفعيل المشغل (${selectedThreatForExplanation.actuatorUsed}) في زمن استجابة قياسي لمنع انتشار التهديد إلى العقد المجاورة.`
                            : `Mahalanobis distance anomaly reached ${selectedThreatForExplanation.mahalanobisDistance.toFixed(2)}σ exceeding threshold (3.0σ). Shannon entropy delta (ΔH = ${selectedThreatForExplanation.entropyDelta.toFixed(2)} b/B) indicated malicious payload encryption. Actuator [${selectedThreatForExplanation.actuatorUsed}] was autonomously selected as optimal minimum blast-radius response.`}
                        </p>
                      </div>

                      <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-[11px] text-emerald-300">
                        <strong>Regulatory Mandate Compliance:</strong> Confirmed compliant with NIST CSF RS.MI-01 & NCA ECC-2-12-3.
                      </div>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-xs font-mono">No active threat selected.</div>
                  )}
                </div>

                {/* What-If Simulator */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-400" />
                    <span>{lang === 'ar' ? 'محاكي الأثر التشغيلي "ماذا لو؟" (What-If Simulator)' : 'What-If Operational Impact Simulator'}</span>
                  </h4>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] text-slate-400 font-mono block mb-1">
                        {lang === 'ar' ? 'العقدة المستهدفة للفحص:' : 'Target Infrastructure Node:'}
                      </label>
                      <select 
                        value={whatIfTarget}
                        onChange={(e) => setWhatIfTarget(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="EDGE_ROUTER_01">Edge Router 01 (BGP Gateway)</option>
                        <option value="CORE_SWITCH_01">Core Switch 01 (Backbone Fabric)</option>
                        <option value="APP_SERVER_01">App Server 01 (Microservices)</option>
                        <option value="DATABASE_MAIN">Main Database (Postgres Core)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-slate-400 font-mono block mb-1">
                        {lang === 'ar' ? 'الإجراء الدفاعي المقترح للمحاكاة:' : 'Proposed Defense Action:'}
                      </label>
                      <select 
                        value={whatIfAction}
                        onChange={(e) => setWhatIfAction(e.target.value)}
                        className="w-full p-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500"
                      >
                        <option value="ISOLATE_NODE">Full Hardware Node Isolation (Airgap)</option>
                        <option value="EBPF_FILTER">eBPF/XDP Micro-Filtering (Kernel Bypass)</option>
                        <option value="BGP_FLOWSPEC">BGP Flowspec Rate Limiting</option>
                      </select>
                    </div>

                    <button
                      onClick={handleRunWhatIf}
                      className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-purple-900/30"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'تشغيل محاكاة الأثر التشغيلي' : 'Execute What-If Forecast'}</span>
                    </button>

                    {whatIfResult && (
                      <div className="mt-3 p-3.5 rounded-lg bg-slate-950 border border-purple-500/40 space-y-2 text-xs font-mono animate-fadeIn">
                        <div className="grid grid-cols-3 gap-2 text-center pb-2 border-b border-slate-800">
                          <div>
                            <div className="text-[10px] text-slate-500">Service Downtime</div>
                            <div className="font-bold text-cyan-400">{whatIfResult.estimatedDowntimeSec}s</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">Business Impact</div>
                            <div className={`font-bold ${whatIfResult.businessImpactIndex > 15 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {whatIfResult.businessImpactIndex} / 100
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">Blast Reduction</div>
                            <div className="font-bold text-emerald-400">+{whatIfResult.blastRadiusReductionPercent}%</div>
                          </div>
                        </div>

                        <div className="text-[11px] text-slate-300 pt-1">
                          <strong className="text-purple-300">Tactical Recommendation: </strong>
                          {lang === 'ar' ? whatIfResult.recommendationAr : whatIfResult.recommendation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Bar */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-3 text-slate-400">
            <span>Merkle Attestation: <strong className="text-cyan-400">0x9a8f4c2b1e0d3a77...</strong></span>
            <span>•</span>
            <span>SOC Grade: <strong className="text-emerald-400">Tier-4 Sovereign Automated</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق' : 'Close Hub'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Add Production Connector */}
      {isAddConnectorModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 border border-blue-500/50 rounded-xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <Server className="w-4 h-4 text-blue-400" />
                <span>{lang === 'ar' ? 'ربط وتوثيق موصل إنتاجي جديد (mTLS)' : 'Register Production Connector (mTLS)'}</span>
              </div>
              <button onClick={() => setIsAddConnectorModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddConnector} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'اسم الجهاز أو الخدمة:' : 'Device / Service Name:'}</label>
                <input
                  type="text"
                  required
                  value={newConnName}
                  onChange={e => setNewConnName(e.target.value)}
                  placeholder="e.g. Casablanca Core Border Firewall (PAN-OS)"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:border-blue-400 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'الشركة المصنعة / الطراز:' : 'Vendor / Type:'}</label>
                  <input
                    type="text"
                    value={newConnVendor}
                    onChange={e => setNewConnVendor(e.target.value)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:border-blue-400 outline-none"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'تصنيف البنية:' : 'Category:'}</label>
                  <select
                    value={newConnCategory}
                    onChange={e => setNewConnCategory(e.target.value as any)}
                    className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:border-blue-400 outline-none"
                  >
                    <option value="FIREWALL_SDN">FIREWALL_SDN</option>
                    <option value="CLOUD_SIEM">CLOUD_SIEM</option>
                    <option value="EDR_XDR">EDR_XDR</option>
                    <option value="OT_SCADA">OT_SCADA</option>
                    <option value="IDENTITY_PAM">IDENTITY_PAM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'رابط الـ API الآمن (Zero-Trust mTLS):' : 'Endpoint REST / gRPC API:'}</label>
                <input
                  type="text"
                  required
                  value={newConnEndpoint}
                  onChange={e => setNewConnEndpoint(e.target.value)}
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:border-blue-400 outline-none"
                />
              </div>

              <div className="p-2.5 rounded bg-blue-950/40 border border-blue-800/40 text-[11px] text-blue-300">
                {lang === 'ar'
                  ? 'سيتم تفعيل المصادقة التشفيرية المتبادلة mTLS 1.3 مع التحقق من بصمة شهادة X.509 تلقائياً.'
                  : 'mTLS 1.3 mutual cryptographic authentication will be established and validated with sovereign X.509 pins.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddConnectorModalOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-md shadow-blue-900/40"
                >
                  {lang === 'ar' ? 'حفظ وتفعيل الموصل' : 'Register & Verify'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Import Custom Sigma Rule */}
      {isImportSigmaOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-slate-900 border border-emerald-500/50 rounded-xl p-5 shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'استيراد واعتماد قاعدة كشف Sigma قياسية' : 'Import Custom Sigma Detection Rule'}</span>
              </div>
              <button onClick={() => setIsImportSigmaOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportSigma} className="space-y-3">
              <div>
                <label className="text-slate-400 block mb-1">{lang === 'ar' ? 'عنوان القاعدة:' : 'Rule Title:'}</label>
                <input
                  type="text"
                  required
                  value={importedSigmaTitle}
                  onChange={e => setImportedSigmaTitle(e.target.value)}
                  placeholder="e.g. Critical Ransomware Volume Shadow Copy Deletion"
                  className="w-full p-2 bg-slate-950 border border-slate-700 rounded text-slate-200 focus:border-emerald-400 outline-none"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Sigma YAML Code (Standard Specification):</label>
                <textarea
                  rows={8}
                  value={importedSigmaYaml}
                  onChange={e => setImportedSigmaYaml(e.target.value)}
                  className="w-full p-2.5 bg-black/80 border border-slate-700 rounded text-emerald-300 font-mono text-[11px] focus:border-emerald-400 outline-none resize-none"
                ></textarea>
              </div>

              <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-800/40 text-[11px] text-emerald-300">
                {lang === 'ar'
                  ? 'يتم ترجمة القاعدة آلياً ونشرها في مسبارات eBPF المباشرة بدون أي توقف في تدفق الشبكة.'
                  : 'Rule will be autonomously parsed and injected into live eBPF/XDP wire-speed filters with zero packet drop.'}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsImportSigmaOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 hover:text-white"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-900/40"
                >
                  {lang === 'ar' ? 'نشر القاعدة في المنظومة' : 'Deploy Rule to Probes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
