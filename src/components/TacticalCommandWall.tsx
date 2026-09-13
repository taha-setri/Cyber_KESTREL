import React, { useState, useEffect, useRef } from 'react';
import { 
  NetworkNode, 
  TelemetryEvent, 
  ThreatVector,
  CommandCenterKPIs,
  DefenseActionLog
} from '../types/cyber';
import { 
  Activity, 
  Server, 
  Database, 
  ShieldCheck, 
  ShieldAlert, 
  Terminal, 
  Pause, 
  Play, 
  Filter, 
  Globe, 
  Cpu, 
  Layers, 
  Zap,
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Tag,
  Eye,
  Copy,
  Check,
  FileText,
  Shield,
  Info,
  Flame,
  RadioTower,
  Clock,
  Bell,
  BellRing,
  BellOff,
  FileDown,
  FileCode,
  FileSpreadsheet,
  ExternalLink,
  Award,
  CheckCircle2,
  Building2,
  CreditCard,
  Mail,
  Key,
  DollarSign,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Crown
} from 'lucide-react';
import { subscriptionService, SubscriberRecord } from '../services/subscriptionService';
import { FounderSubscriberDossierModal } from './FounderSubscriberDossierModal';
import { soundEffects } from '../services/soundEffects';
import { KestrelLogo } from './KestrelLogo';
import { 
  exportExecutiveHtmlReport, 
  exportExecutiveJsonReport, 
  exportExecutiveCsvReport, 
  exportExecutiveMarkdownReport 
} from '../services/executiveReportExporter';
import { exportExecutiveReportPdf } from '../services/pdfReportGenerator';
import { ThreatDensityHeatmap } from './ThreatDensityHeatmap';
import { NodeEntropySparklines, MicroSparkline } from './NodeEntropySparklines';
import { MiniSparkline } from './MiniSparkline';
import { ExpandableNodeDiagnostic } from './ExpandableNodeDiagnostic';
import { 
  NetworkLatencyHeatmapOverlay, 
  drawLatencyHeatmapCanvas 
} from './NetworkLatencyHeatmapOverlay';
import { 
  LatencyHeatmapMode, 
  LatencyMetricType, 
  calculatePropagationLinks, 
  calculateSegmentAggregates,
  getNodeSegment,
  getLatencyColor
} from '../services/networkLatencyModel';
import { 
  generateInitialNodeHistory, 
  calculateNextNodeMetrics, 
  buildNodeMetricHistory, 
  NodeMetricHistory 
} from '../services/nodeResourceTelemetry';

interface TacticalCommandWallProps {
  nodes: NetworkNode[];
  onSelectNode: (node: NetworkNode) => void;
  selectedNode: NetworkNode | null;
  telemetryStream: TelemetryEvent[];
  activeThreats: ThreatVector[];
  onSelectThreat: (threat: ThreatVector) => void;
  lang: 'ar' | 'en';
  onOpenIngestionLab?: () => void;
  isCriticalAudioEnabled?: boolean;
  onToggleCriticalAudio?: () => void;
  onTestCriticalAudio?: () => void;
  onUpdateThreatSeverity?: (threatId: string, newSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => void;
  kpis?: CommandCenterKPIs;
  defenseLogs?: DefenseActionLog[];
  onOpenExecutiveReport?: () => void;
  onOpenCommercialPlans?: () => void;
  onOpenPostQuantumShield?: () => void;
  onOpenCustomDomainLaunch?: () => void;
  onOpenFounderCockpit?: () => void;
}

export const TacticalCommandWall: React.FC<TacticalCommandWallProps> = ({
  nodes,
  onSelectNode,
  selectedNode,
  telemetryStream,
  activeThreats,
  onSelectThreat,
  lang,
  onOpenIngestionLab,
  isCriticalAudioEnabled = true,
  onToggleCriticalAudio,
  onTestCriticalAudio,
  onUpdateThreatSeverity,
  kpis,
  defenseLogs = [],
  onOpenExecutiveReport,
  onOpenCommercialPlans,
  onOpenPostQuantumShield,
  onOpenCustomDomainLaunch,
  onOpenFounderCockpit
}) => {
  // Founder Subscribers & Client Intelligence State for TAHA SETRII
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(() => subscriptionService.getSubscribers());
  const [newSubscriberAlert, setNewSubscriberAlert] = useState<SubscriberRecord | null>(null);
  const [isSubscribersLedgerOpen, setIsSubscribersLedgerOpen] = useState(true);
  const [selectedSubscriberForDossier, setSelectedSubscriberForDossier] = useState<SubscriberRecord | null>(null);
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState('');
  const [revealedSubscriberKeys, setRevealedSubscriberKeys] = useState<Record<string, boolean>>({});
  const [copiedSubKeyId, setCopiedSubKeyId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscriptionService.subscribe((updatedSubs, newSub) => {
      setSubscribers(updatedSubs);
      if (newSub) {
        setNewSubscriberAlert(newSub);
        try {
          soundEffects.playMitigationChirp();
        } catch {}
        setTimeout(() => {
          setNewSubscriberAlert(prev => (prev?.id === newSub.id ? null : prev));
        }, 12000);
      }
    });
    return () => unsubscribe();
  }, []);

  const [streamPaused, setStreamPaused] = useState(false);
  const [frozenTelemetryStream, setFrozenTelemetryStream] = useState<TelemetryEvent[]>([]);
  const [pausedAtTimestamp, setPausedAtTimestamp] = useState<number | null>(null);
  const [inspectedLog, setInspectedLog] = useState<TelemetryEvent | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [telemetryFilter, setTelemetryFilter] = useState<'ALL' | 'DROPPED' | 'SYSCALL' | 'CRITICAL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');
  const [mitreFilter, setMitreFilter] = useState('ALL');
  const [sourceIpFilter, setSourceIpFilter] = useState('');

  // Dedicated Threat List Search by IP address or Threat Type
  const [threatSearchQuery, setThreatSearchQuery] = useState('');
  const [threatTypeFilter, setThreatTypeFilter] = useState<'ALL' | string>('ALL');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [lastExportedNotice, setLastExportedNotice] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Active KPIs for report export
  const activeKpis: CommandCenterKPIs = kpis || {
    mttdMs: 142,
    mttrSec: 0.85,
    efficacyIndex: 99.94,
    falsePositiveRate: 0.0004,
    blastRadiusPercent: 0.02,
    ingestionEps: 18450,
    queueLatencyMs: 1.2,
    activeNodes: nodes.filter(n => n.status !== 'ISOLATED').length,
    isolatedNodes: nodes.filter(n => n.status === 'ISOLATED').length,
    totalPacketsScanned: 1845020,
    mitigationsCount: defenseLogs.length || 14
  };

  // Computed Founder Subscribers Metrics & Filters
  const totalFounderMRR = subscribers.reduce((sum, s) => sum + s.monthlyPrice, 0);
  const totalFounderARR = totalFounderMRR * 12;

  const filteredSubscribers = subscribers.filter(s => {
    if (!subscriberSearchQuery.trim()) return true;
    const q = subscriberSearchQuery.toLowerCase();
    return (
      s.orgName.toLowerCase().includes(q) ||
      s.adminEmail.toLowerCase().includes(q) ||
      s.planNameAr.toLowerCase().includes(q) ||
      s.planNameEn.toLowerCase().includes(q) ||
      s.invoiceId.toLowerCase().includes(q)
    );
  });

  const toggleRevealSubKey = (id: string) => {
    setRevealedSubscriberKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copySubKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedSubKeyId(id);
    setTimeout(() => setCopiedSubKeyId(null), 2500);
  };

  const triggerPdfExport = () => {
    const filename = exportExecutiveReportPdf(activeKpis, activeThreats, defenseLogs, lang);
    setLastExportedNotice(filename);
    setIsExportMenuOpen(false);
    setTimeout(() => setLastExportedNotice(null), 4000);
  };

  const triggerHtmlExport = () => {
    const filename = exportExecutiveHtmlReport(activeKpis, activeThreats, defenseLogs, lang);
    setLastExportedNotice(filename);
    setIsExportMenuOpen(false);
    setTimeout(() => setLastExportedNotice(null), 4000);
  };

  const triggerJsonExport = () => {
    const filename = exportExecutiveJsonReport(activeKpis, activeThreats, defenseLogs);
    setLastExportedNotice(filename);
    setIsExportMenuOpen(false);
    setTimeout(() => setLastExportedNotice(null), 4000);
  };

  const triggerCsvExport = () => {
    const filename = exportExecutiveCsvReport(activeKpis, activeThreats, defenseLogs);
    setLastExportedNotice(filename);
    setIsExportMenuOpen(false);
    setTimeout(() => setLastExportedNotice(null), 4000);
  };

  const triggerMarkdownExport = () => {
    const filename = exportExecutiveMarkdownReport(activeKpis, activeThreats, defenseLogs);
    setLastExportedNotice(filename);
    setIsExportMenuOpen(false);
    setTimeout(() => setLastExportedNotice(null), 4000);
  };

  // Latency Heatmap Overlay State & Controls
  const [latencyOverlayEnabled, setLatencyOverlayEnabled] = useState(true);
  const [latencyHeatmapMode, setLatencyHeatmapMode] = useState<LatencyHeatmapMode>('SEGMENT_BASED');
  const [latencyMetricType, setLatencyMetricType] = useState<LatencyMetricType>('RTT_PROPAGATION');
  const [heatIntensityGain, setHeatIntensityGain] = useState(1.0);
  const [showLinkDelayLabels, setShowLinkDelayLabels] = useState(true);

  const latencyOverlayRef = useRef({
    enabled: latencyOverlayEnabled,
    mode: latencyHeatmapMode,
    metricType: latencyMetricType,
    gain: heatIntensityGain,
    showLinkLabels: showLinkDelayLabels
  });

  useEffect(() => {
    latencyOverlayRef.current = {
      enabled: latencyOverlayEnabled,
      mode: latencyHeatmapMode,
      metricType: latencyMetricType,
      gain: heatIntensityGain,
      showLinkLabels: showLinkDelayLabels
    };
  }, [latencyOverlayEnabled, latencyHeatmapMode, latencyMetricType, heatIntensityGain, showLinkDelayLabels]);

  // Live node resource metrics (CPU, Memory, Packet Drop Rate, and Network Latency sparklines)
  const [nodeResourceMetrics, setNodeResourceMetrics] = useState<Record<string, NodeMetricHistory>>({});
  const [diagnosticExpanded, setDiagnosticExpanded] = useState<boolean>(true);
  const nodeResourceHistRef = useRef<Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory?: number[]; packetDrop?: number[] }>>({});
  const nodeMetricsRef = useRef(nodeResourceMetrics);

  useEffect(() => {
    nodeMetricsRef.current = nodeResourceMetrics;
  }, [nodeResourceMetrics]);

  // Initialize resource history on nodes load
  useEffect(() => {
    const initial: Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory?: number[]; packetDrop?: number[] }> = {};
    nodes.forEach(n => {
      initial[n.id] = generateInitialNodeHistory(n);
    });
    nodeResourceHistRef.current = initial;

    const res: Record<string, NodeMetricHistory> = {};
    nodes.forEach(n => {
      const hist = initial[n.id] || generateInitialNodeHistory(n);
      res[n.id] = buildNodeMetricHistory(n.id, hist.entropy, hist.cpu, hist.latency, n.status === 'ISOLATED', hist.memory, hist.packetDrop);
    });
    setNodeResourceMetrics(res);
  }, [nodes.length]);

  // Rolling update loop driven by incoming live telemetry
  useEffect(() => {
    const timer = setInterval(() => {
      const updated: Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory?: number[]; packetDrop?: number[] }> = { ...nodeResourceHistRef.current };
      const recent = telemetryStream.slice(0, 10);

      nodes.forEach(n => {
        const prev = updated[n.id] || generateInitialNodeHistory(n);
        const next = calculateNextNodeMetrics(n, prev, recent);
        updated[n.id] = {
          entropy: [...prev.entropy.slice(1), next.entropy],
          cpu: [...prev.cpu.slice(1), next.cpu],
          latency: [...prev.latency.slice(1), next.latency],
          memory: [...(prev.memory || []).slice(1), next.memory],
          packetDrop: [...(prev.packetDrop || []).slice(1), next.packetDrop]
        };
      });
      nodeResourceHistRef.current = updated;

      const res: Record<string, NodeMetricHistory> = {};
      nodes.forEach(n => {
        const hist = updated[n.id] || generateInitialNodeHistory(n);
        res[n.id] = buildNodeMetricHistory(n.id, hist.entropy, hist.cpu, hist.latency, n.status === 'ISOLATED', hist.memory, hist.packetDrop);
      });
      setNodeResourceMetrics(res);
    }, 1800);

    return () => clearInterval(timer);
  }, [nodes, telemetryStream]);

  // Threat type human-readable labels
  const getThreatTypeLabel = (type: string, isAr: boolean) => {
    switch (type) {
      case 'DDoS_Volumetric':
        return isAr ? 'هجوم حجب الخدمة (DDoS)' : 'DDoS Volumetric';
      case 'Ransomware_Drift':
        return isAr ? 'برمجية فدية وانجراف' : 'Ransomware Drift';
      case 'Data_Exfiltration':
        return isAr ? 'تسريب بيانات مشفرة' : 'Data Exfiltration';
      case 'APT_Lateral':
        return isAr ? 'تحرك جانبي (APT)' : 'APT Lateral Move';
      case 'Zero_Day_Syscall':
        return isAr ? 'ثغرة يوم-صفر (Syscall)' : 'Zero-Day Syscall';
      case 'Recon_Scan':
        return isAr ? 'مسح منافذ استطلاعي' : 'Recon Port Scan';
      default:
        return type.replace(/_/g, ' ');
    }
  };

  const getThreatTypeStyle = (type: string) => {
    switch (type) {
      case 'DDoS_Volumetric':
        return 'bg-blue-950/70 text-blue-300 border-blue-700/50 hover:bg-blue-900/60';
      case 'Ransomware_Drift':
        return 'bg-rose-950/70 text-rose-300 border-rose-700/50 hover:bg-rose-900/60';
      case 'Data_Exfiltration':
        return 'bg-amber-950/70 text-amber-300 border-amber-700/50 hover:bg-amber-900/60';
      case 'APT_Lateral':
        return 'bg-purple-950/70 text-purple-300 border-purple-700/50 hover:bg-purple-900/60';
      case 'Zero_Day_Syscall':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-700/50 hover:bg-emerald-900/60';
      case 'Recon_Scan':
        return 'bg-sky-950/70 text-sky-300 border-sky-700/50 hover:bg-sky-900/60';
      default:
        return 'bg-slate-900 text-slate-300 border-slate-700';
    }
  };

  const isThreatFilterActive = threatSearchQuery.trim() !== '' || threatTypeFilter !== 'ALL';

  const clearThreatFilters = () => {
    setThreatSearchQuery('');
    setThreatTypeFilter('ALL');
  };

  const isFilterActive = searchQuery.trim() !== '' || severityFilter !== 'ALL' || mitreFilter !== 'ALL' || sourceIpFilter.trim() !== '' || isThreatFilterActive;

  const clearAllFilters = () => {
    setSearchQuery('');
    setSeverityFilter('ALL');
    setMitreFilter('ALL');
    setSourceIpFilter('');
    setThreatSearchQuery('');
    setThreatTypeFilter('ALL');
  };

  const handleHeatmapFilter = (filterVal: string) => {
    if (!filterVal) {
      setSearchQuery('');
      setSourceIpFilter('');
      return;
    }
    if (filterVal.startsWith('10.0.')) {
      setSearchQuery(filterVal);
      setSourceIpFilter('');
    } else {
      setSourceIpFilter(filterVal);
      setSearchQuery(filterVal);
    }
  };

  // Toggle pause / freeze state for telemetry stream
  const togglePauseTelemetry = () => {
    if (!streamPaused) {
      // Freeze incoming stream at current instant
      setFrozenTelemetryStream(telemetryStream);
      setPausedAtTimestamp(Date.now());
      setStreamPaused(true);
    } else {
      // Unfreeze / Resume live stream
      setStreamPaused(false);
      setPausedAtTimestamp(null);
      setFrozenTelemetryStream([]);
    }
  };

  // Active telemetry source: frozen snapshot if paused, else live stream
  const activeTelemetrySource = streamPaused ? frozenTelemetryStream : telemetryStream;

  // Queued new events arriving while paused
  const newEventsBufferedCount = streamPaused && pausedAtTimestamp
    ? telemetryStream.filter(evt => evt.timestamp > pausedAtTimestamp).length
    : 0;

  // Extract distinct source IPs from threats for one-click filtering
  const distinctThreatIps = Array.from(
    new Set(activeThreats.map(t => t.sourceIp.split('/')[0]).filter(Boolean))
  );

  // Filtered threats based on threat search bar (IP or type), global search, severity, MITRE tactic, and source IP
  const filteredThreats = activeThreats.filter(threat => {
    // 1. Threat List Dedicated Search (by IP address or Threat Type)
    if (threatSearchQuery.trim()) {
      const q = threatSearchQuery.toLowerCase().trim();
      const rawType = threat.type.toLowerCase();
      const typeEn = getThreatTypeLabel(threat.type, false).toLowerCase();
      const typeAr = getThreatTypeLabel(threat.type, true).toLowerCase();

      // Check IP address match (source IP or target asset IP)
      const matchesIp = 
        threat.sourceIp.toLowerCase().includes(q) ||
        threat.targetAsset.toLowerCase().includes(q);

      // Check Threat Type match (e.g., 'ddos', 'ransomware', 'exfiltration', 'apt', 'lateral', 'zero_day', 'recon', etc.)
      const matchesType = 
        rawType.includes(q) ||
        typeEn.includes(q) ||
        typeAr.includes(q) ||
        (q === 'ddos' && rawType.includes('ddos')) ||
        (q === 'ransomware' && rawType.includes('ransomware')) ||
        (q === 'exfiltration' && rawType.includes('exfiltration')) ||
        (q === 'apt' && rawType.includes('apt')) ||
        ((q === 'zero-day' || q === 'zero day') && rawType.includes('zero_day')) ||
        (q === 'recon' && rawType.includes('recon'));

      // Check General title / MITRE tactic
      const matchesGeneral = 
        threat.title.toLowerCase().includes(q) ||
        threat.titleAr.toLowerCase().includes(q) ||
        threat.mitreTactic.toLowerCase().includes(q);

      if (!matchesIp && !matchesType && !matchesGeneral) return false;
    }

    // 2. Threat Type Specific Filter
    if (threatTypeFilter !== 'ALL') {
      if (threat.type !== threatTypeFilter) return false;
    }

    // 3. Global search query (if active)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        threat.sourceIp.toLowerCase().includes(q) ||
        threat.targetAsset.toLowerCase().includes(q) ||
        threat.title.toLowerCase().includes(q) ||
        threat.titleAr.toLowerCase().includes(q) ||
        threat.mitreTactic.toLowerCase().includes(q) ||
        threat.type.toLowerCase().includes(q) ||
        threat.actuatorUsed.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (severityFilter !== 'ALL') {
      if (threat.severity !== severityFilter) return false;
    }

    if (mitreFilter !== 'ALL') {
      if (!threat.mitreTactic.toLowerCase().includes(mitreFilter.toLowerCase())) return false;
    }

    if (sourceIpFilter.trim()) {
      if (!threat.sourceIp.toLowerCase().includes(sourceIpFilter.toLowerCase().trim())) return false;
    }

    return true;
  });

  // Filtered telemetry incorporating global search, severity, source IP, and MITRE correlation
  const filteredTelemetry = activeTelemetrySource.filter(evt => {
    if (telemetryFilter === 'DROPPED' && evt.actionTaken !== 'XDP_DROPPED' && evt.actionTaken !== 'SDN_ISOLATED') return false;
    if (telemetryFilter === 'SYSCALL' && evt.protocol !== 'eBPF-Syscall') return false;
    if (telemetryFilter === 'CRITICAL' && evt.severity !== 'CRITICAL') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const match = 
        evt.sourceIp.toLowerCase().includes(q) ||
        evt.destinationIp.toLowerCase().includes(q) ||
        evt.protocol.toLowerCase().includes(q) ||
        evt.actionTaken.toLowerCase().includes(q) ||
        evt.sourcePort.toString().includes(q) ||
        evt.destinationPort.toString().includes(q);
      if (!match) return false;
    }

    if (severityFilter !== 'ALL') {
      if (severityFilter === 'CRITICAL' && evt.severity !== 'CRITICAL') return false;
      if (severityFilter === 'HIGH' && evt.severity !== 'HIGH' && evt.severity !== 'ELEVATED') return false;
      if (severityFilter === 'MEDIUM' && evt.severity !== 'ELEVATED') return false;
      if (severityFilter === 'LOW' && evt.severity !== 'NORMAL') return false;
    }

    if (sourceIpFilter.trim()) {
      if (!evt.sourceIp.toLowerCase().includes(sourceIpFilter.toLowerCase().trim())) return false;
    }

    if (mitreFilter !== 'ALL') {
      const tacticMatches = 
        activeThreats.some(t => t.mitreTactic.toLowerCase().includes(mitreFilter.toLowerCase()) && (t.sourceIp.includes(evt.sourceIp) || evt.sourceIp.includes(t.sourceIp.split('/')[0]))) ||
        (mitreFilter === 'T1048' && evt.protocol === 'DNS') ||
        (mitreFilter === 'T1498' && (evt.actionTaken === 'XDP_DROPPED' || evt.packetSize > 1200)) ||
        (mitreFilter === 'T1021' && (evt.destinationPort === 445 || evt.destinationPort === 3389 || evt.destinationPort === 22)) ||
        (mitreFilter === 'T1068' && evt.protocol === 'eBPF-Syscall');
      if (!tacticMatches) return false;
    }

    return true;
  });

  // Canvas-based interactive topology animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particleOffset = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle background grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const step = 30;
      for (let x = 0; x < canvas.width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // If Latency Heatmap Overlay is active, render the rich heat halos, segment boundaries & link latency gradients
      const overlayCfg = latencyOverlayRef.current;
      const currentMetrics = nodeMetricsRef.current;

      if (overlayCfg.enabled) {
        const links = calculatePropagationLinks(nodes, currentMetrics, telemetryStream.slice(0, 15));
        const segs = calculateSegmentAggregates(nodes, currentMetrics);
        drawLatencyHeatmapCanvas(
          ctx,
          canvas.width,
          canvas.height,
          nodes,
          currentMetrics,
          links,
          segs,
          overlayCfg.mode,
          overlayCfg.metricType,
          overlayCfg.gain,
          overlayCfg.showLinkLabels,
          particleOffset
        );
      } else {
        // Draw standard connections
        nodes.forEach(node => {
          node.connections.forEach(targetId => {
            const targetNode = nodes.find(n => n.id === targetId);
            if (!targetNode) return;

            const isTargeted = node.status === 'TARGETED' || targetNode.status === 'TARGETED';
            const isIsolated = node.status === 'ISOLATED' || targetNode.status === 'ISOLATED';

            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(targetNode.x, targetNode.y);

            if (isIsolated) {
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.4)';
              ctx.setLineDash([4, 4]);
              ctx.lineWidth = 1.5;
            } else if (isTargeted) {
              ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
              ctx.setLineDash([6, 3]);
              ctx.lineWidth = 2;
            } else {
              ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
              ctx.setLineDash([]);
              ctx.lineWidth = 1;
            }
            ctx.stroke();
            ctx.setLineDash([]);

            // Animated particle packet stream
            if (!isIsolated) {
              const dx = targetNode.x - node.x;
              const dy = targetNode.y - node.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              const count = Math.max(1, Math.floor(distance / 70));

              for (let i = 0; i < count; i++) {
                const progress = ((particleOffset / 100) + (i / count)) % 1;
                const px = node.x + dx * progress;
                const py = node.y + dy * progress;

                ctx.beginPath();
                ctx.arc(px, py, isTargeted ? 3 : 2, 0, Math.PI * 2);
                ctx.fillStyle = isTargeted ? '#ef4444' : '#22d3ee';
                ctx.shadowColor = isTargeted ? '#ef4444' : '#06b6d4';
                ctx.shadowBlur = 6;
                ctx.fill();
                ctx.shadowBlur = 0;
              }
            }
          });
        });
      }

      // Draw Wire-speed mitigation barrier if attacks exist
      if (activeThreats.some(t => t.status === 'ACTIVE_INTERCEPTION' || t.status === 'NEUTRALIZED')) {
        ctx.save();
        ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(330, 80);
        ctx.lineTo(330, 420);
        ctx.stroke();

        ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
        ctx.font = '10px "JetBrains Mono", monospace';
        ctx.fillText('eBPF / XDP WIRE-SPEED SHIELD', 340, 95);
        ctx.restore();
      }

      particleOffset = (particleOffset + 0.8) % 100;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [nodes, activeThreats]);

  const getNodeIcon = (type: NetworkNode['type']) => {
    switch (type) {
      case 'INTERNET': return <Globe className="w-4 h-4 text-cyan-400" />;
      case 'EDGE_ROUTER': return <Cpu className="w-4 h-4 text-emerald-400" />;
      case 'FIREWALL': return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'CORE_SWITCH': return <Layers className="w-4 h-4 text-blue-400" />;
      case 'DATABASE': return <Database className="w-4 h-4 text-purple-400" />;
      case 'APP_SERVER': return <Server className="w-4 h-4 text-slate-300" />;
      case 'IAM_KEY_VAULT': return <ShieldAlert className="w-4 h-4 text-rose-400" />;
      case 'AIRGAP_BACKUP': return <Activity className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <div className="space-y-4">
      
      {/* Global Search and Filter Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3.5 shadow-lg">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input 
              type="text"
              id="global-tactical-search"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' 
                ? 'بحث شامل: IP المصدر (مثال: 194.26)، الهدف، التكتيك، المنفذ، البروتوكول...' 
                : 'Global filter: Source IP (e.g. 194.26), target asset, MITRE tactic, port, protocol...'}
              className="w-full bg-[#04060a] border border-slate-700/80 rounded-lg pl-9 pr-8 py-2 text-xs font-mono-cyber text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Controls Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            
            {/* Severity Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono-cyber text-slate-400 whitespace-nowrap">
                {lang === 'ar' ? 'الخطورة:' : 'Severity:'}
              </span>
              <select
                id="tactical-filter-severity"
                value={severityFilter}
                onChange={e => setSeverityFilter(e.target.value as any)}
                className="bg-[#04060a] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono-cyber text-slate-200 focus:outline-none focus:border-cyan-500 cursor-pointer"
              >
                <option value="ALL">{lang === 'ar' ? 'كافة المستويات (All)' : 'All Severities'}</option>
                <option value="CRITICAL">CRITICAL (حرج)</option>
                <option value="HIGH">HIGH (مرتفع)</option>
                <option value="MEDIUM">MEDIUM (متوسط)</option>
                <option value="LOW">LOW (منخفض / سليم)</option>
              </select>
            </div>

            {/* MITRE Tactic Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-mono-cyber text-slate-400 whitespace-nowrap">
                {lang === 'ar' ? 'تكتيك MITRE:' : 'MITRE Tactic:'}
              </span>
              <select
                id="tactical-filter-mitre"
                value={mitreFilter}
                onChange={e => setMitreFilter(e.target.value)}
                className="bg-[#04060a] border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs font-mono-cyber text-cyan-300 focus:outline-none focus:border-cyan-500 max-w-[210px] truncate cursor-pointer"
              >
                <option value="ALL">{lang === 'ar' ? 'كافة تكتيكات MITRE' : 'All MITRE Tactics'}</option>
                <option value="T1498">T1498 - Network Denial of Service</option>
                <option value="T1048">T1048 - Exfiltration Over Protocol</option>
                <option value="T1021">T1021 - Lateral Movement</option>
                <option value="T1068">T1068 - Privilege Escalation</option>
                <option value="T1071">T1071 - Application Layer C2</option>
                <option value="T1566">T1566 - Phishing / Initial Access</option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {isFilterActive && (
              <button
                id="tactical-filter-reset"
                onClick={clearAllFilters}
                className="px-2.5 py-1.5 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40 text-xs font-mono-cyber flex items-center gap-1.5 transition-colors cursor-pointer"
                title={lang === 'ar' ? 'إعادة ضبط كافة المرشحات' : 'Clear all filters'}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تصفير الفلاتر' : 'Reset'}</span>
              </button>
            )}

          </div>
        </div>

        {/* Quick Source IP Filter Chips & Active Status Counter */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono-cyber">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 flex items-center gap-1 text-[10px]">
              <Filter className="w-3 h-3 text-cyan-400" />
              {lang === 'ar' ? 'IP المصدر السريع:' : 'Quick IP Filter:'}
            </span>
            {distinctThreatIps.map(ip => {
              const isSelected = sourceIpFilter === ip;
              return (
                <button
                  key={ip}
                  onClick={() => setSourceIpFilter(isSelected ? '' : ip)}
                  className={`px-2 py-0.5 rounded border transition-all cursor-pointer text-[10px] ${
                    isSelected
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold ring-1 ring-cyan-400/50'
                      : 'bg-slate-900/90 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                  title={isSelected ? 'Clear IP filter' : `Filter by ${ip}`}
                >
                  {ip}
                </button>
              );
            })}
            {sourceIpFilter && !distinctThreatIps.includes(sourceIpFilter) && (
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500 text-cyan-300 font-bold text-[10px] flex items-center gap-1">
                {sourceIpFilter}
                <button onClick={() => setSourceIpFilter('')} className="hover:text-red-300 cursor-pointer">
                  <X className="w-2.5 h-2.5" />
                </button>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-slate-400">
              {lang === 'ar' ? 'التهديدات:' : 'Threats:'}{' '}
              <strong className={filteredThreats.length > 0 ? 'text-red-400' : 'text-slate-500'}>
                {filteredThreats.length} / {activeThreats.length}
              </strong>
            </span>
            <span className="text-slate-400">
              {lang === 'ar' ? 'السجلات:' : 'Logs:'}{' '}
              <strong className="text-cyan-400">
                {filteredTelemetry.length} / {activeTelemetrySource.length}
              </strong>
            </span>

            {/* Quick Pause Telemetry Toggle */}
            <button
              onClick={togglePauseTelemetry}
              id="top-quick-pause-telemetry-btn"
              className={`px-2 py-0.5 rounded border text-[10px] font-mono-cyber flex items-center gap-1 transition-all cursor-pointer ${
                streamPaused
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 font-bold shadow-[0_0_8px_rgba(245,158,11,0.25)] animate-pulse'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-slate-700'
              }`}
              title={streamPaused ? 'Resume live incoming telemetry stream' : 'Pause / freeze telemetry stream for detailed investigation'}
            >
              {streamPaused ? (
                <>
                  <Play className="w-2.5 h-2.5 text-emerald-400 fill-emerald-400" />
                  <span>{lang === 'ar' ? 'السجلات مجمدة' : 'Telemetry Paused'}</span>
                  {newEventsBufferedCount > 0 && (
                    <span className="px-1 rounded bg-amber-500/30 text-amber-200 text-[8px]">
                      +{newEventsBufferedCount}
                    </span>
                  )}
                </>
              ) : (
                <>
                  <Pause className="w-2.5 h-2.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'تجميد السجلات' : 'Pause Telemetry'}</span>
                </>
              )}
            </button>

            {isFilterActive && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] font-bold">
                {lang === 'ar' ? 'مُرشح نشط' : 'FILTER ACTIVE'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Live Real-time Subscriber Alert for Founder TAHA SETRII */}
      {newSubscriberAlert && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-slate-900 to-emerald-950/90 border-2 border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] flex flex-wrap items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-900/60 border border-emerald-400/80 flex items-center justify-center text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.35)] shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 text-[10px] font-mono font-black uppercase tracking-wider">
                  {lang === 'ar' ? '🎉 إشعار اشتراك جديد وارد للمؤسس TAHA SETRII' : '🎉 NEW CLIENT SUBSCRIBED TO FOUNDER TAHA SETRII'}
                </span>
                <span className="text-xs font-mono font-bold text-white">
                  +${newSubscriberAlert.monthlyPrice} / {lang === 'ar' ? 'شهرياً' : 'mo'}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-slate-800 text-[10px] font-mono text-cyan-300">
                  {newSubscriberAlert.invoiceId}
                </span>
              </div>
              <p className="text-xs text-slate-200 font-mono mt-1">
                <strong className="text-white">{newSubscriberAlert.orgName}</strong> ({newSubscriberAlert.adminEmail}) • {lang === 'ar' ? newSubscriberAlert.planNameAr : newSubscriberAlert.planNameEn}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedSubscriberForDossier(newSubscriberAlert)}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs font-bold transition-all cursor-pointer shadow-md flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'فحص ملف المشترك الآن' : 'Inspect Client Dossier'}</span>
            </button>
            <button
              onClick={() => setNewSubscriberAlert(null)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Founder Executive Client Intelligence Hub & Subscriber Radar */}
      <div className="rounded-2xl border-2 border-emerald-500/50 bg-[#080d19]/95 backdrop-blur-md overflow-hidden shadow-[0_0_35px_rgba(16,185,129,0.18)]">
        {/* Executive Header */}
        <div className="p-4 border-b border-slate-800/80 bg-gradient-to-r from-emerald-950/40 via-slate-900/60 to-slate-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <KestrelLogo size="sm" lang={lang} glow={true} />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <span className="text-cyan-400 font-black">KESTREL</span>
                  <span>{lang === 'ar' ? '— قمرة المشتركين والعملاء للمؤسس TAHA SETRII' : '— FOUNDER TAHA SETRII EXECUTIVE SUBSCRIBER RADAR'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 font-mono font-bold">
                    (sécurité Maroc)
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'ar' 
                  ? 'رادار صقر كستريل: رصد فوري لكافة المؤسسات المشتركة بالباقات الشهرية ومفاتيح الحماية المشفرة' 
                  : 'Kestrel Aegis Radar: Real-time client telemetry, active SaaS subscriptions, and provisioned keys'}
              </p>
            </div>
          </div>

          {/* 4 Quick Executive Metrics */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">{lang === 'ar' ? 'المشتركون:' : 'Clients:'}</span>
              <span className="font-bold text-white">{subscribers.length}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-xs font-mono flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-300">MRR:</span>
              <span className="font-bold text-emerald-400">${totalFounderMRR.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">{lang === 'ar' ? '/شهر' : '/mo'}</span>
            </div>

            <div className="px-3 py-1.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-xs font-mono flex items-center gap-1.5 hidden md:flex">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-300">ARR:</span>
              <span className="font-bold text-cyan-300">${totalFounderARR.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400">{lang === 'ar' ? '/سنة' : '/yr'}</span>
            </div>

            {onOpenCustomDomainLaunch && (
              <button
                onClick={onOpenCustomDomainLaunch}
                id="tactical-domain-launch-btn"
                data-testid="tactical-domain-launch-btn"
                title={lang === 'ar' ? 'إعدادات النطاق المخصص والإنطلاق الرسمي للعامة والـ DNS' : 'Custom Domain, Anycast DNS & Public Production Launch'}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-blue-950 hover:from-cyan-900 hover:to-blue-900 text-cyan-300 hover:text-white border border-cyan-400/70 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.3)]"
              >
                <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
                <span>{lang === 'ar' ? 'النطاق والإنطلاق' : 'Domain & Launch'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/50 font-mono font-black">
                  LIVE
                </span>
              </button>
            )}

            {onOpenFounderCockpit && (
              <button
                onClick={onOpenFounderCockpit}
                id="tactical-founder-cockpit-btn"
                data-testid="tactical-founder-cockpit-btn"
                title={lang === 'ar' ? 'فتح قمرة المؤسس الشاملة TAHA SETRII (النطاق، التراخيص، رادار المشتركين، ميثاق السيادة)' : 'Open Founder TAHA SETRII Executive Cockpit'}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 hover:from-amber-900 hover:to-emerald-900 text-amber-300 hover:text-white border border-amber-500/70 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_18px_rgba(245,158,11,0.35)]"
              >
                <Crown className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{lang === 'ar' ? 'قمرة المؤسس الشاملة 🇲🇦' : 'Full Founder Cockpit 🇲🇦'}</span>
              </button>
            )}

            {onOpenCommercialPlans && (
              <button
                onClick={onOpenCommercialPlans}
                className="px-3 py-1.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-emerald-300 border border-emerald-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إدارة الباقات' : 'Manage Plans'}</span>
              </button>
            )}

            {onOpenPostQuantumShield && (
              <button
                onClick={onOpenPostQuantumShield}
                id="tactical-pqc-shield-btn"
                title={lang === 'ar' ? 'فحص ومراقبة درع التشفير المقاوم للحوسبة الكمومية (NIST PQC FIPS 203/204)' : 'Inspect Sovereign Post-Quantum Cryptography Shield'}
                className="px-3 py-1.5 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/50 text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.25)]"
              >
                <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>{lang === 'ar' ? 'درع ما بعد الكم (PQC)' : 'PQC Shield'}</span>
                <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-400/40">
                  FIPS 203
                </span>
              </button>
            )}

            <button
              onClick={() => setIsSubscribersLedgerOpen(!isSubscribersLedgerOpen)}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={isSubscribersLedgerOpen ? "Collapse ledger" : "Expand ledger"}
            >
              {isSubscribersLedgerOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Body content when open */}
        {isSubscribersLedgerOpen && (
          <div className="p-4 space-y-4">
            {/* Search and filter bar for subscribers */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="relative flex-1 min-w-[240px] max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 rtl:left-auto rtl:right-3" />
                <input
                  type="text"
                  value={subscriberSearchQuery}
                  onChange={(e) => setSubscriberSearchQuery(e.target.value)}
                  placeholder={lang === 'ar' ? 'بحث باسم الشركة، بريد المسؤول، رقم الفاتورة أو الباقة...' : 'Search by organization, admin email, invoice, plan...'}
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-9 py-2 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 text-xs"
                />
                {subscriberSearchQuery && (
                  <button
                    onClick={() => setSubscriberSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rtl:right-auto rtl:left-3 text-slate-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{lang === 'ar' ? 'المعروض:' : 'Showing:'} <strong className="text-emerald-400">{filteredSubscribers.length}</strong> {lang === 'ar' ? 'من' : 'of'} {subscribers.length} {lang === 'ar' ? 'مشترك معتمد' : 'clients'}</span>
                <span className="text-slate-600">|</span>
                <span className="text-cyan-400 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>SLA: 99.999% Guaranteed</span>
                </span>
              </div>
            </div>

            {/* Subscribers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
              {filteredSubscribers.map((sub) => {
                const isKeyRevealed = Boolean(revealedSubscriberKeys[sub.id]);
                const isJustSubscribed = Date.now() - sub.subscribedAt < 1000 * 60 * 30; // within 30 min

                return (
                  <div
                    key={sub.id}
                    className={`p-4 rounded-xl bg-[#0b1020] border transition-all flex flex-col justify-between gap-3 relative overflow-hidden group ${
                      isJustSubscribed 
                        ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.25)]' 
                        : 'border-slate-800 hover:border-emerald-500/50 hover:bg-[#0c1326]'
                    }`}
                  >
                    {/* Top Row: Org name & Status Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0 font-bold font-mono text-xs">
                            {sub.orgName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-white font-mono leading-tight group-hover:text-emerald-300 transition-colors">
                              {sub.orgName}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Mail className="w-2.5 h-2.5 text-slate-500" />
                              <span className="select-all">{sub.adminEmail}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${
                            sub.status === 'ACTIVE' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' 
                              : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                          }`}>
                            {sub.status}
                          </span>
                          {isJustSubscribed && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950 text-[8px] font-mono font-black animate-pulse">
                              NEW / LIVE
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Plan & Pricing Tier */}
                      <div className="mt-3 p-2.5 rounded-lg bg-slate-950/80 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                        <div>
                          <span className="text-emerald-400 font-bold block text-[11px]">
                            {lang === 'ar' ? sub.planNameAr : sub.planNameEn}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {sub.billingCycle === 'annual' ? (lang === 'ar' ? 'عقد سنوي مفوتر' : 'Annual Contract') : (lang === 'ar' ? 'تجديد شهري' : 'Monthly Retainer')}
                          </span>
                        </div>
                        <div className="text-right rtl:text-left">
                          <span className="text-white font-bold text-sm block">
                            ${sub.monthlyPrice}
                            <span className="text-[10px] text-slate-400 font-normal"> /mo</span>
                          </span>
                          <span className="text-[9px] text-slate-400 font-mono">
                            {sub.paymentMethod === 'card' ? 'Stripe Card' : (sub.paymentMethod === 'wire' ? 'B2B Wire' : 'Trial')}
                          </span>
                        </div>
                      </div>

                      {/* Protected Infrastructure & Region */}
                      <div className="mt-2.5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span className="flex items-center gap-1.5 truncate">
                          <Server className="w-3 h-3 text-cyan-400 shrink-0" />
                          <span className="truncate">{sub.region}</span>
                        </span>
                        <span className="text-slate-500 shrink-0 text-[10px]">
                          {sub.serversCount} {lang === 'ar' ? 'خادم' : 'nodes'}
                        </span>
                      </div>

                      {/* Secret Token Preview (Masked / Toggle) */}
                      <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px] font-mono flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate text-slate-400">
                          <Key className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span className="truncate text-emerald-300">
                            {isKeyRevealed ? sub.apiKeyFull : sub.apiKeyMasked}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => toggleRevealSubKey(sub.id)}
                            className="p-1 rounded text-slate-400 hover:text-white cursor-pointer transition-colors"
                            title={isKeyRevealed ? "Hide key" : "Reveal full key"}
                          >
                            {isKeyRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                          <button
                            type="button"
                            onClick={() => copySubKey(sub.apiKeyFull, sub.id)}
                            className="p-1 rounded text-slate-400 hover:text-emerald-300 cursor-pointer transition-colors"
                            title="Copy key"
                          >
                            {copiedSubKeyId === sub.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Footer Buttons */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs font-mono">
                      <span className="text-[10px] text-slate-500">
                        {new Date(sub.subscribedAt).toLocaleDateString()}
                      </span>

                      <button
                        onClick={() => setSelectedSubscriberForDossier(sub)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-emerald-950/80 text-slate-200 hover:text-emerald-300 border border-slate-700 hover:border-emerald-500/50 text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'فحص الملف الكامل' : 'Client Dossier'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
      
      {/* Topology & Kinetic Visual Area (Col 1-8) */}
      <div className="xl:col-span-8 flex flex-col gap-4">
        
        {/* Main Canvas Card */}
        <div className="relative rounded-xl border border-slate-800 bg-[#090d16] p-4 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
              <h2 className="text-sm font-bold tracking-wide text-slate-200 font-display-cyber uppercase">
                {lang === 'ar' ? 'خريطة الطبولوجيا وتدفق التهديدات الحية (Kinetic Surface)' : 'LIVE ATTACK SURFACE & KINETIC TOPOLOGY'}
              </h2>
            </div>
            
            <div className="flex items-center gap-3 text-xs font-mono-cyber text-slate-400 flex-wrap">
              {/* Quick Heatmap Overlay Toggle Button */}
              <button
                id="quick-canvas-latency-toggle-btn"
                onClick={() => setLatencyOverlayEnabled(!latencyOverlayEnabled)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono-cyber flex items-center gap-1.5 border transition-all cursor-pointer ${
                  latencyOverlayEnabled
                    ? 'bg-gradient-to-r from-amber-500/25 to-rose-500/25 border-amber-400 text-amber-200 font-bold shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={latencyOverlayEnabled ? 'Disable Latency Heatmap' : 'Enable Latency Heatmap'}
              >
                <Flame className={`w-3.5 h-3.5 ${latencyOverlayEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-500'}`} />
                <span>{lang === 'ar' ? 'خريطة حرارة التأخير' : 'Latency Heatmap'}</span>
                <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                  latencyOverlayEnabled ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
                }`}>
                  {latencyOverlayEnabled ? 'ON' : 'OFF'}
                </span>
              </button>

              <div className="h-3 w-px bg-slate-800 hidden sm:block" />

              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span> {lang === 'ar' ? 'سليم' : 'Healthy'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span> {lang === 'ar' ? 'مستهدف' : 'Targeted'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> {lang === 'ar' ? 'معزول ذاتياً' : 'Isolated'}
              </span>
            </div>
          </div>

          {/* Latency Heatmap Overlay Control & KPI Bar */}
          <div className="mb-3">
            <NetworkLatencyHeatmapOverlay
              nodes={nodes}
              selectedNode={selectedNode}
              onSelectNode={onSelectNode}
              nodeResourceMetrics={nodeResourceMetrics}
              telemetryStream={telemetryStream}
              lang={lang}
              overlayEnabled={latencyOverlayEnabled}
              onToggleOverlay={setLatencyOverlayEnabled}
              heatmapMode={latencyHeatmapMode}
              onChangeMode={setLatencyHeatmapMode}
              metricType={latencyMetricType}
              onChangeMetricType={setLatencyMetricType}
              heatIntensityGain={heatIntensityGain}
              onChangeHeatIntensityGain={setHeatIntensityGain}
              showLinkDelayLabels={showLinkDelayLabels}
              onToggleLinkDelayLabels={setShowLinkDelayLabels}
            />
          </div>

          {/* Interactive Topology Container */}
          <div className="relative w-full h-[460px] bg-[#060911] rounded-lg border border-slate-900 overflow-hidden">
            {/* Background Canvas for lines & particles */}
            <canvas 
              ref={canvasRef} 
              width={980} 
              height={460}
              className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* DOM Nodes for full interaction and accessibility */}
            {nodes.map(node => {
              const isSelected = selectedNode?.id === node.id;
              const metrics = nodeResourceMetrics[node.id];
              const isCpuExhausted = metrics?.isCpuExhausted;
              const isLatencySpike = metrics?.isLatencySpike;

              let borderClass = 'border-slate-700 bg-slate-900/90 text-slate-200';
              if (node.status === 'ISOLATED') {
                borderClass = 'border-red-500 bg-red-950/80 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)] ring-2 ring-red-500/50';
              } else if (node.status === 'TARGETED' || isCpuExhausted) {
                borderClass = 'border-red-500 bg-red-950/80 text-red-100 shadow-[0_0_15px_rgba(239,68,68,0.45)] ring-1 ring-red-500/60 animate-pulse';
              } else if (isLatencySpike) {
                borderClass = 'border-amber-500 bg-amber-950/80 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
              } else if (isSelected) {
                borderClass = 'border-cyan-400 bg-cyan-950/80 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.4)]';
              }

              return (
                <button
                  key={node.id}
                  id={`topology-node-${node.id}`}
                  onClick={() => {
                    onSelectNode(node);
                    setDiagnosticExpanded(true);
                  }}
                  style={{
                    position: 'absolute',
                    left: `${(node.x / 980) * 100}%`,
                    top: `${(node.y / 460) * 100}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  className={`group z-10 px-2.5 py-1.5 rounded-lg border text-left flex items-center gap-2 cursor-pointer transition-all hover:scale-105 ${borderClass}`}
                >
                  <div className="p-1 rounded bg-black/40 shrink-0">
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="text-[11px] leading-tight shrink-0">
                    <div className="font-bold font-display-cyber flex items-center gap-1">
                      <span>{lang === 'ar' ? node.labelAr : node.label}</span>
                      {node.status === 'ISOLATED' ? (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-red-500/30 text-red-300 font-mono-cyber">
                          {lang === 'ar' ? 'معزول' : 'QUARANTINE'}
                        </span>
                      ) : isCpuExhausted ? (
                        <span className="text-[8px] px-1 py-0.2 rounded bg-red-500/40 text-red-200 font-mono-cyber font-bold animate-pulse">
                          EXHAUSTED
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[9px] font-mono-cyber opacity-70">
                      {node.ip}
                    </div>
                  </div>

                  {/* Miniature Sparklines for CPU and Network Latency Per Node */}
                  <div className="border-l border-slate-700/80 pl-1.5 ml-0.5 flex flex-col gap-0.5 text-[8px] font-mono-cyber select-none">
                    <div className="flex items-center gap-1" title={`CPU Load: ${metrics?.currentCpu ?? 20}%`}>
                      <span className="text-slate-400 text-[7px] w-4">CPU</span>
                      <MiniSparkline
                        points={metrics?.cpuPoints || [20, 20]}
                        width={30}
                        height={10}
                        metricType="cpu"
                      />
                      <span className={`w-5 text-right font-bold ${
                        isCpuExhausted ? 'text-red-400' : (metrics?.currentCpu ?? 0) >= 60 ? 'text-amber-300' : 'text-slate-300'
                      }`}>
                        {metrics?.currentCpu ?? 20}%
                      </span>
                    </div>

                    <div className="flex items-center gap-1" title={`Wire Latency: ${metrics?.currentLatency ?? 3.2}ms`}>
                      <span className="text-slate-400 text-[7px] w-4">LAT</span>
                      <MiniSparkline
                        points={metrics?.latencyPoints || [3, 3]}
                        width={30}
                        height={10}
                        metricType="latency"
                      />
                      <span className={`w-5 text-right font-bold ${
                        isLatencySpike ? 'text-rose-400' : 'text-cyan-300'
                      }`}>
                        {Math.round(metrics?.currentLatency ?? 3)}m
                      </span>
                    </div>
                  </div>

                  {/* Expandable Diagnostic Trigger Button */}
                  <div
                    id={`btn-expand-diagnostic-${node.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node);
                      setDiagnosticExpanded(true);
                    }}
                    className="border-l border-slate-700/80 pl-1.5 ml-0.5 flex items-center shrink-0"
                    title={lang === 'ar' ? 'فتح التشخيص الموسع (المعالج، الذاكرة، إسقاط الحزم)' : 'Open Expandable Diagnostic (CPU, Memory, Packet Drops)'}
                  >
                    <span className="px-1.5 py-1 rounded bg-cyan-500/10 hover:bg-cyan-500/30 border border-cyan-500/30 text-cyan-300 text-[8px] font-mono-cyber font-bold flex items-center gap-0.5 transition-colors cursor-pointer">
                      <Activity className="w-2.5 h-2.5 text-cyan-400" />
                      <span>{lang === 'ar' ? 'تشخيص' : 'DIAG'}</span>
                    </span>
                  </div>

                  {/* Heatmap Overlay Latency Pill */}
                  {latencyOverlayEnabled && (
                    <div 
                      className="px-1.5 py-0.5 rounded text-[8px] font-mono-cyber font-bold flex items-center gap-1 border shrink-0"
                      style={{
                        backgroundColor: getLatencyColor(metrics?.currentLatency ?? 3.2, 0.25),
                        borderColor: getLatencyColor(metrics?.currentLatency ?? 3.2, 0.6),
                        color: (metrics?.currentLatency ?? 3.2) > 35 ? '#fecaca' : '#a5f3fc'
                      }}
                      title={`Segment: ${getNodeSegment(node.id).shortLabel} | RTT: ${metrics?.currentLatency ?? 3.2}ms`}
                    >
                      <span 
                        className="w-1.5 h-1.5 rounded-full" 
                        style={{ backgroundColor: getLatencyColor(metrics?.currentLatency ?? 3.2, 1.0) }} 
                      />
                      <span>{Math.round(metrics?.currentLatency ?? 3.2)}ms</span>
                    </div>
                  )}
                </button>
              );
            })}

            {/* Quick Status Legend overlay */}
            <div className="absolute bottom-3 left-3 bg-[#090d16]/90 border border-slate-800 px-3 py-1.5 rounded text-[10px] font-mono-cyber text-slate-400 backdrop-blur-sm">
              <span>eBPF Layer: <strong className="text-emerald-400">ACTIVE</strong></span>
              <span className="mx-2">|</span>
              <span>SDN Fabric: <strong className="text-cyan-400">SYNCED</strong></span>
            </div>
          </div>

          {/* Node detail drawer if selected */}
          {selectedNode && (
            <div className="mt-3 p-3.5 rounded-lg border border-cyan-500/30 bg-cyan-950/25 flex flex-col gap-2.5 text-xs font-mono-cyber">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    {lang === 'ar' ? selectedNode.labelAr : selectedNode.label}
                  </span>
                  <span className="text-slate-400">IP: <strong className="text-slate-200">{selectedNode.ip}</strong></span>
                  <span className="text-slate-400">{lang === 'ar' ? 'مستوى التهديد:' : 'Threat Index:'} <strong className={selectedNode.threatLevel > 30 ? 'text-amber-400' : 'text-emerald-400'}>{selectedNode.threatLevel}%</strong></span>
                  <span className="text-slate-400">{lang === 'ar' ? 'الحالة السيبرانية:' : 'Status:'} <strong className="text-slate-200">{selectedNode.status}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleHeatmapFilter(selectedNode.ip)}
                    className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <Search className="w-3 h-3" />
                    <span>{lang === 'ar' ? 'تصفية سجلات هذه العقدة' : 'Filter Node Telemetry'}</span>
                  </button>
                  <button
                    id="btn-close-node-drawer"
                    onClick={() => onSelectNode(null as any)}
                    className="p-1 rounded bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'إغلاق التشخيص' : 'Close Node Diagnostic'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expandable Diagnostic View with Live Sparklines for CPU, Memory, and Packet Drop Rate */}
              {nodeResourceMetrics[selectedNode.id] && (
                <div id="expandable-diagnostic-container">
                  <ExpandableNodeDiagnostic
                    node={selectedNode}
                    metrics={nodeResourceMetrics[selectedNode.id]}
                    telemetryStream={telemetryStream}
                    lang={lang}
                    isExpandedDefault={diagnosticExpanded}
                    onFilterByNodeIp={(ip) => handleHeatmapFilter(ip)}
                    allNodes={nodes}
                    onSelectNode={(n) => {
                      onSelectNode(n);
                      setDiagnosticExpanded(true);
                    }}
                  />
                </div>
              )}

              {/* Detailed Propagation Delay & Route Metrics for Selected Node */}
              {(() => {
                const seg = getNodeSegment(selectedNode.id);
                const nodeLat = nodeResourceMetrics[selectedNode.id]?.currentLatency ?? 3.2;
                return (
                  <div className="pt-2 border-t border-cyan-500/20 grid grid-cols-1 md:grid-cols-3 gap-2.5 text-[11px]">
                    <div className="bg-[#03060c] p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Layers className="w-3 h-3 text-cyan-400" />
                          <span>{lang === 'ar' ? 'الشريحة والمنطقة الجغرافية' : 'Segment & Geo PoP'}</span>
                        </span>
                        <span 
                          className="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                          style={{ backgroundColor: `${seg.color}25`, color: seg.color, borderColor: `${seg.color}60` }}
                        >
                          {seg.shortLabel}
                        </span>
                      </div>
                      <div className="text-slate-200 font-bold text-xs mt-1">
                        {lang === 'ar' ? seg.nameAr : seg.name}
                      </div>
                      <div className="text-slate-400 text-[10px]">
                        {lang === 'ar' ? seg.geoRegionAr : seg.geoRegion}
                      </div>
                      <div className="text-[9px] text-cyan-400">
                        {lang === 'ar' ? `المسافة البصرية التقريبية: ~${seg.approxDistanceKm} كم` : `Optical Fiber Path: ~${seg.approxDistanceKm} km`}
                      </div>
                    </div>

                    <div className="bg-[#03060c] p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{lang === 'ar' ? 'تفكيك تأخير الحزم (Transit)' : 'Packet Transit Breakdown'}</span>
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${
                          nodeLat > 35 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse' 
                            : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        }`}>
                          RTT: {nodeLat} ms
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-1.5 text-[10px] mt-1.5">
                        <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-500 block text-[8px]">t_fiber (سرعة الضوء):</span>
                          <span className="text-slate-200 font-bold font-mono-cyber">{seg.nominalFiberDelayMs} ms</span>
                        </div>
                        <div className="p-1.5 rounded bg-slate-900/60 border border-slate-800">
                          <span className="text-slate-500 block text-[8px]">t_queue (احتقان الرتل):</span>
                          <span className={`font-bold font-mono-cyber ${nodeLat - seg.nominalFiberDelayMs > 15 ? 'text-amber-300' : 'text-emerald-400'}`}>
                            {Math.max(0.2, parseFloat((nodeLat - seg.nominalFiberDelayMs).toFixed(1)))} ms
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#03060c] p-2.5 rounded-lg border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-[10px] uppercase font-bold flex items-center gap-1.5">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          <span>{lang === 'ar' ? 'تأخير القفزات المباشرة' : 'Direct Hop Latencies'}</span>
                        </span>
                        <span className="text-[9px] text-slate-400 font-mono-cyber">{selectedNode.connections.length} {lang === 'ar' ? 'أقران' : 'Peers'}</span>
                      </div>
                      <div className="space-y-1 max-h-20 overflow-y-auto pr-1 mt-1">
                        {selectedNode.connections.map(targetId => {
                          const target = nodes.find(n => n.id === targetId);
                          if (!target) return null;
                          const targetLat = nodeResourceMetrics[target.id]?.currentLatency ?? 3.0;
                          const hopRtt = parseFloat(((nodeLat + targetLat) / 2).toFixed(1));
                          return (
                            <div key={targetId} className="flex items-center justify-between text-[10px] p-1 rounded bg-slate-900/40 border border-slate-800/80">
                              <span className="text-slate-300 truncate max-w-[120px]">{lang === 'ar' ? target.labelAr : target.label}</span>
                              <span className={`font-bold font-mono-cyber px-1.5 py-0.2 rounded text-[9px] ${
                                hopRtt > 35 ? 'bg-rose-500/20 text-rose-300' : hopRtt > 15 ? 'bg-amber-500/20 text-amber-300' : 'bg-cyan-500/20 text-cyan-300'
                              }`}>
                                {hopRtt} ms
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Quick prompt when no node is selected */}
          {!selectedNode && (
            <div className="mt-3 p-3 rounded-xl border border-slate-800/90 bg-[#040812]/85 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-cyber text-slate-400 shadow-inner">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
                <span>
                  {lang === 'ar' 
                    ? 'انقر على أي عقدة شبكية في المخطط التكتيكي أعلاه لفتح التشخيص الموسّع (المعالج، الذاكرة، معدل إسقاط الحزم)' 
                    : 'Click any network node on the tactical topology to view its Expandable Diagnostic (CPU, Memory, Packet Drop Rate)'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-slate-500 font-bold">{lang === 'ar' ? 'تشخيص موسّع لجميع العقد:' : 'Expandable Diagnostic Nodes:'}</span>
                {nodes.map(n => {
                  const m = nodeResourceMetrics[n.id];
                  return (
                    <button
                      key={n.id}
                      id={`quick-diag-node-${n.id}`}
                      onClick={() => {
                        onSelectNode(n);
                        setDiagnosticExpanded(true);
                      }}
                      className={`px-2 py-0.5 rounded text-[10px] transition-all cursor-pointer flex items-center gap-1.5 border ${
                        n.status === 'ISOLATED'
                          ? 'bg-red-950/60 text-red-300 border-red-800 hover:border-red-500'
                          : m?.isCpuExhausted
                          ? 'bg-amber-950/40 text-amber-300 border-amber-700/60 hover:border-amber-400'
                          : 'bg-slate-900/90 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border-slate-800 hover:border-cyan-500/50'
                      }`}
                      title={`${n.label} (${n.ip}) - Click to open Expandable Diagnostic`}
                    >
                      <span>{lang === 'ar' ? n.labelAr : n.label}</span>
                      <span className="text-[8px] text-slate-500 font-mono-cyber">({n.ip})</span>
                      {m && (
                        <span className={`text-[8px] font-mono-cyber font-bold ${
                          m.isCpuExhausted ? 'text-red-400' : 'text-cyan-400'
                        }`}>
                          {m.currentCpu}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Real-time 60s Entropy Sparklines Matrix for All Active Nodes */}
        <NodeEntropySparklines
          nodes={nodes}
          selectedNode={selectedNode}
          onSelectNode={onSelectNode}
          telemetryStream={telemetryStream}
          lang={lang}
          onFilterByIp={(ip) => handleHeatmapFilter(ip)}
        />

        {/* MITRE ATT&CK Kill Chain Tracker */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold font-display-cyber text-slate-300 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'مسار سلسلة القتل والاعتراض اللحظي (MITRE ATT&CK Kill-Chain Matrix)' : 'MITRE ATT&CK KILL-CHAIN AUTONOMOUS DEFENSE TRACE'}</span>
            </h3>
            <span className="text-[10px] font-mono-cyber text-cyan-400">
              {lang === 'ar' ? 'التحييد يتم قبل مرحلة التسريب' : 'Mitigation Pre-Exfiltration'}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs font-mono-cyber">
            {[
              { id: 'recon', name: '1. Reconnaissance', nameAr: '1. الاستطلاع', count: '148 Scans/s', state: 'FILTERED' },
              { id: 'access', name: '2. Initial Access', nameAr: '2. النفاذ الأولي', count: '12 Probes/s', state: 'CHALLENGED' },
              { id: 'lateral', name: '3. Lateral Move', nameAr: '3. الحركة الأفقية', count: '1 Attempt', state: 'ISOLATED' },
              { id: 'exfil', name: '4. Exfiltration', nameAr: '4. تسريب البيانات', count: '0 Leaks', state: 'BLOCKED' },
              { id: 'contain', name: '5. Autonomous Contain', nameAr: '5. التحييد الذاتي', count: '100% Success', state: 'SECURED' },
            ].map((stage, idx) => (
              <div 
                key={stage.id} 
                className={`p-2.5 rounded-lg border flex flex-col justify-between ${
                  idx === 4 
                    ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300' 
                    : idx === 2 
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300'
                }`}
              >
                <div className="text-[11px] font-bold">
                  {lang === 'ar' ? stage.nameAr : stage.name}
                </div>
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-80">
                  <span>{stage.count}</span>
                  <span className="font-semibold">{stage.state}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real-Time Telemetry & eBPF Ingestion Feed (Col 9-12) */}
      <div className="xl:col-span-4 flex flex-col gap-4">
        
        {/* Active Threat Interceptions Quick List */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3 flex-wrap gap-2">
            <h3 className="text-xs font-bold font-display-cyber text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <span>{lang === 'ar' ? 'الاعتراضات التهديدية النشطة' : 'ACTIVE INTERCEPTIONS'}</span>
            </h3>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Audio Alert Toggle for Critical Threat Severity */}
              {onToggleCriticalAudio && (
                <div className="flex items-center rounded border border-slate-800 bg-slate-900/90 p-0.5">
                  <button
                    onClick={onToggleCriticalAudio}
                    id="tactical-wall-crit-audio-toggle"
                    title={
                      isCriticalAudioEnabled
                        ? (lang === 'ar' ? 'الإنذار الصوتي للحالات الحرجة مفعّل (يطلق صفارة عند تصنيف التهديد CRITICAL للمراقبة دون شاشة)' : 'Critical Audio Alert: ACTIVE (Dispatches siren when threat severity changes to CRITICAL)')
                        : (lang === 'ar' ? 'الإنذار الصوتي للحالات الحرجة معطل (انقر للتفعيل)' : 'Critical Audio Alert: MUTED (Click to enable audio monitoring)')
                    }
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono-cyber flex items-center gap-1 transition-all cursor-pointer ${
                      isCriticalAudioEnabled
                        ? 'bg-red-950/80 text-red-300 border border-red-500/50 shadow-[0_0_8px_rgba(239,68,68,0.25)]'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {isCriticalAudioEnabled ? (
                      <BellRing className="w-3 h-3 text-red-400 animate-pulse" />
                    ) : (
                      <BellOff className="w-3 h-3 text-slate-500" />
                    )}
                    <span className="font-bold">{isCriticalAudioEnabled ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
                  </button>

                  {onTestCriticalAudio && (
                    <button
                      onClick={onTestCriticalAudio}
                      id="tactical-wall-crit-audio-test"
                      title={lang === 'ar' ? 'اختبار صفارة الإنذار للحالات الحرجة' : 'Test Critical Threat Siren'}
                      className="px-1.5 py-0.5 text-[9px] font-mono-cyber text-slate-400 hover:text-red-300 border-l border-slate-800 transition-colors cursor-pointer"
                    >
                      {lang === 'ar' ? 'تجربة' : 'Test'}
                    </button>
                  )}
                </div>
              )}

              <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                {filteredThreats.length} / {activeThreats.length} {lang === 'ar' ? 'مؤكد' : 'VERIFIED'}
              </span>

              {/* Direct Instant PDF Export Button */}
              <button
                id="tactical-wall-direct-pdf-btn"
                onClick={triggerPdfExport}
                title={lang === 'ar' ? 'تصدير وثيقة التوثيق والتدقيق الجنائي مباشرة كملف PDF معتمد' : 'Export Official Forensic Audit Report as PDF'}
                className="px-2 py-0.5 rounded text-[10px] font-mono-cyber flex items-center gap-1 bg-gradient-to-r from-red-600/90 to-rose-700/90 hover:from-red-500 hover:to-rose-600 border border-red-500/80 text-white font-bold transition-all cursor-pointer shadow-[0_0_8px_rgba(225,29,72,0.3)]"
              >
                <FileDown className="w-3 h-3 text-white" />
                <span>{lang === 'ar' ? 'تقرير PDF' : 'AUDIT PDF'}</span>
              </button>

              {/* Quick Export Audit Dropdown */}
              <div className="relative">
                <button
                  id="tactical-wall-export-audit-btn"
                  onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
                  title={lang === 'ar' ? 'خيارات تصدير تقارير التوثيق والسجلات الجنائية' : 'Documentation & Forensic Export Options'}
                  className="px-2 py-0.5 rounded text-[10px] font-mono-cyber flex items-center gap-1 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 hover:text-white transition-all cursor-pointer shadow-sm"
                >
                  <FileDown className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold">{lang === 'ar' ? 'خيارات التصدير' : 'EXPORT'}</span>
                </button>

                {isExportMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-64 rounded-xl bg-[#090e18] border border-cyan-500/40 shadow-2xl p-2 z-30 font-mono-cyber text-xs">
                    <div className="text-[10px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
                      <span>{lang === 'ar' ? 'تصدير التقرير والتوثيق' : 'Export Reports & Dossiers'}</span>
                      <span className="text-cyan-400 font-mono">ACDC v4.2</span>
                    </div>
                    <div className="mt-1.5 space-y-1">
                      {/* PDF Option at Top */}
                      <button
                        id="quick-export-pdf-btn"
                        onClick={triggerPdfExport}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-white flex items-center justify-between transition-colors cursor-pointer text-[11px] font-bold shadow-sm"
                      >
                        <div className="flex items-center gap-2">
                          <FileDown className="w-3.5 h-3.5 text-red-400" />
                          <span>{lang === 'ar' ? 'وثيقة PDF الرسمية المعتمدة' : 'Official PDF Audit Report'}</span>
                        </div>
                        <span className="text-[9px] bg-red-600/40 text-red-200 px-1 py-0.2 rounded border border-red-500/60 font-bold">.pdf</span>
                      </button>

                      <button
                        id="quick-export-html-btn"
                        onClick={triggerHtmlExport}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <FileCode className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{lang === 'ar' ? 'وثيقة HTML التنفيذية' : 'HTML Executive Dossier'}</span>
                        </div>
                        <span className="text-[9px] text-cyan-400 font-bold">.html</span>
                      </button>

                      <button
                        id="quick-export-json-btn"
                        onClick={triggerJsonExport}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <FileDown className="w-3.5 h-3.5 text-blue-400" />
                          <span>{lang === 'ar' ? 'بيانات الجلسة JSON كاملة' : 'Full Session JSON'}</span>
                        </div>
                        <span className="text-[9px] text-blue-400 font-bold">.json</span>
                      </button>

                      <button
                        id="quick-export-csv-btn"
                        onClick={triggerCsvExport}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{lang === 'ar' ? 'جدول بيانات CSV' : 'Audit CSV Spreadsheet'}</span>
                        </div>
                        <span className="text-[9px] text-emerald-400 font-bold">.csv</span>
                      </button>

                      <button
                        id="quick-export-md-btn"
                        onClick={triggerMarkdownExport}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-slate-800 text-slate-200 hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[11px]"
                      >
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-purple-400" />
                          <span>{lang === 'ar' ? 'إيجاز تنفيذي Markdown' : 'Markdown Briefing'}</span>
                        </div>
                        <span className="text-[9px] text-purple-400 font-bold">.md</span>
                      </button>

                      {onOpenExecutiveReport && (
                        <div className="pt-1 border-t border-slate-800 mt-1">
                          <button
                            id="quick-open-report-modal-btn"
                            onClick={() => {
                              setIsExportMenuOpen(false);
                              onOpenExecutiveReport();
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg bg-cyan-950/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 hover:text-white flex items-center justify-between transition-colors cursor-pointer text-[11px]"
                          >
                            <div className="flex items-center gap-2">
                              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                              <span>{lang === 'ar' ? 'فتح لوحة التدقيق الشاملة' : 'Open Full Audit Modal'}</span>
                            </div>
                            <span className="text-[9px] text-cyan-400">&rarr;</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Export Success Notification Banner */}
          {lastExportedNotice && (
            <div className="mb-3 p-2 rounded-lg bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-between text-[11px] text-emerald-300 font-mono-cyber animate-fadeIn">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {lang === 'ar' ? 'تم تنزيل تقرير التدقيق: ' : 'Downloaded audit report: '}
                  <strong className="text-white">{lastExportedNotice}</strong>
                </span>
              </div>
              <span className="text-[9px] font-bold text-emerald-400">AUDIT OK</span>
            </div>
          )}

          {/* Threat List Search Bar (Filter by IP or Threat Type) */}
          <div className="mb-3 space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-cyan-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                id="threat-list-search-bar"
                value={threatSearchQuery}
                onChange={(e) => setThreatSearchQuery(e.target.value)}
                placeholder={
                  lang === 'ar'
                    ? 'تصفية بالـ IP (مثال: 194.26) أو نوع التهديد (DDoS, Ransomware...)'
                    : 'Filter by IP (e.g. 194.26) or Threat Type (DDoS, Ransomware, APT)...'
                }
                className="w-full bg-[#04060a] border border-slate-700/80 rounded-lg pl-8 pr-7 py-1.5 text-xs font-mono-cyber text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/40 transition-all"
              />
              {threatSearchQuery && (
                <button
                  id="clear-threat-search-btn"
                  onClick={() => setThreatSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={lang === 'ar' ? 'مسح بحث التهديدات' : 'Clear threat search'}
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Quick Filters Row: Threat Type Select & Reset */}
            <div className="flex items-center justify-between gap-1.5 flex-wrap text-[10px] font-mono-cyber">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-slate-400 flex items-center gap-1 text-[10px]">
                  <Filter className="w-3 h-3 text-cyan-400" />
                  {lang === 'ar' ? 'نوع التهديد:' : 'Threat Type:'}
                </span>
                <select
                  id="threat-type-filter-select"
                  value={threatTypeFilter}
                  onChange={(e) => setThreatTypeFilter(e.target.value)}
                  className="bg-[#04060a] border border-slate-700/80 rounded px-1.5 py-0.5 text-[10px] text-cyan-300 focus:outline-none focus:border-cyan-500 cursor-pointer max-w-[155px] truncate"
                >
                  <option value="ALL">{lang === 'ar' ? 'كافة الأنواع (All Types)' : 'All Threat Types'}</option>
                  <option value="DDoS_Volumetric">DDoS Volumetric</option>
                  <option value="Ransomware_Drift">Ransomware Drift</option>
                  <option value="Data_Exfiltration">Data Exfiltration</option>
                  <option value="APT_Lateral">APT Lateral Move</option>
                  <option value="Zero_Day_Syscall">Zero-Day Syscall</option>
                  <option value="Recon_Scan">Recon Port Scan</option>
                </select>
              </div>

              {/* Clear threat filters if active */}
              {isThreatFilterActive && (
                <button
                  id="reset-threat-filter-btn"
                  onClick={clearThreatFilters}
                  className="text-[10px] text-cyan-400 hover:text-cyan-300 underline cursor-pointer"
                >
                  {lang === 'ar' ? 'إلغاء التصفية' : 'Reset Filter'}
                </button>
              )}
            </div>

            {/* Quick Filter Pills (Threat Types) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
              {[
                { id: 'ALL', label: lang === 'ar' ? 'الكل' : 'All' },
                { id: 'DDoS_Volumetric', label: 'DDoS' },
                { id: 'Ransomware_Drift', label: 'Ransomware' },
                { id: 'Data_Exfiltration', label: 'Exfiltration' },
                { id: 'APT_Lateral', label: 'Lateral' },
                { id: 'Zero_Day_Syscall', label: 'Zero-Day' },
                { id: 'Recon_Scan', label: 'Recon' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setThreatTypeFilter(item.id)}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono-cyber whitespace-nowrap transition-all cursor-pointer border ${
                    threatTypeFilter === item.id
                      ? 'bg-cyan-950/90 text-cyan-300 border-cyan-500/70 shadow-sm font-semibold'
                      : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Active IP Filter Indicator */}
            {(threatSearchQuery || sourceIpFilter) && (
              <div className="flex items-center justify-between bg-cyan-950/40 border border-cyan-500/30 px-2 py-0.5 rounded text-[10px] font-mono-cyber text-cyan-300">
                <span className="truncate">
                  {lang === 'ar' ? 'تصفية نشطة:' : 'Active Query:'}{' '}
                  <span className="text-white font-semibold">{threatSearchQuery || sourceIpFilter}</span>
                </span>
                <button
                  onClick={() => {
                    setThreatSearchQuery('');
                    setSourceIpFilter('');
                  }}
                  className="hover:text-white cursor-pointer ml-1 text-slate-400"
                  title="Clear active filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {filteredThreats.length === 0 ? (
              <div className="p-4 rounded-lg border border-dashed border-slate-800 text-center flex flex-col items-center justify-center gap-2 text-slate-400 text-xs font-mono-cyber">
                <ShieldAlert className="w-6 h-6 text-emerald-500/60" />
                <span className="text-slate-300 font-semibold">
                  {isThreatFilterActive
                    ? (lang === 'ar' 
                        ? `لا توجد تهديدات تطابق البحث [${threatSearchQuery || threatTypeFilter}]` 
                        : `No active threats match IP or type filter "${threatSearchQuery || threatTypeFilter}"`)
                    : (lang === 'ar' ? 'المحيط السيبراني محصن بالكامل — لم تسجل أي تهديدات حتى الآن' : 'Perimeter Secure — Zero active threat vectors recorded')
                  }
                </span>
                {!isThreatFilterActive && (
                  <span className="text-[10px] text-slate-500 max-w-xs">
                    {lang === 'ar' 
                      ? 'الحماية الذاتية ترصد منفذ الحزم الحي واختبارات المعمل باستمرار' 
                      : 'Autonomous engines monitor live wire stream and forensic lab continuously.'}
                  </span>
                )}
                {(isFilterActive || isThreatFilterActive) && (
                  <button onClick={clearAllFilters} className="text-cyan-400 hover:underline text-[11px] cursor-pointer">
                    {lang === 'ar' ? 'تصفير كافة الفلاتر للرجوع' : 'Reset all filters to view all threats'}
                  </button>
                )}
              </div>
            ) : (
              filteredThreats.map(threat => {
                let sevClass = 'bg-red-950/60 text-red-400 border-red-800/40';
                if (threat.severity === 'HIGH') sevClass = 'bg-amber-950/60 text-amber-400 border-amber-800/40';
                if (threat.severity === 'MEDIUM') sevClass = 'bg-yellow-950/60 text-yellow-300 border-yellow-800/40';

                return (
                  <div 
                    key={threat.id}
                    onClick={() => onSelectThreat(threat)}
                    className="p-2.5 rounded-lg border border-slate-800 hover:border-cyan-500/50 bg-slate-900/80 hover:bg-slate-800/60 cursor-pointer transition-all"
                  >
                    <div className="flex items-center justify-between text-xs font-semibold gap-2">
                      <span className="text-slate-200 truncate flex-1">
                        {lang === 'ar' ? threat.titleAr : threat.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {threat.severity === 'CRITICAL' ? (
                          <span className="text-[9px] font-mono-cyber px-1.5 py-0.2 rounded border bg-red-950/90 text-red-300 border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.35)] flex items-center gap-1">
                            <BellRing className="w-2.5 h-2.5 text-red-400" />
                            CRITICAL
                          </span>
                        ) : (
                          <div className="flex items-center gap-1">
                            <span className={`text-[9px] font-mono-cyber px-1.5 py-0.2 rounded border ${sevClass}`}>
                              {threat.severity}
                            </span>
                            {onUpdateThreatSeverity && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateThreatSeverity(threat.id, 'CRITICAL');
                                }}
                                title={lang === 'ar' ? 'تصعيد التهديد إلى CRITICAL (يطلق الإنذار الصوتي)' : 'Escalate threat to CRITICAL (Triggers audio alert)'}
                                className="text-[9px] font-mono-cyber px-1 py-0.2 rounded bg-red-950/40 hover:bg-red-900/70 text-red-400 hover:text-red-200 border border-red-800/50 transition-colors"
                              >
                                +CRIT
                              </button>
                            )}
                          </div>
                        )}
                        <span className="text-[10px] font-mono-cyber text-emerald-400 bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                          {threat.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono-cyber text-slate-400 gap-1.5 flex-wrap">
                      <div className="flex items-center gap-1.5 truncate">
                        <button 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            const ip = threat.sourceIp.split('/')[0];
                            setThreatSearchQuery(ip);
                          }}
                          className="hover:text-cyan-300 text-slate-400 transition-colors text-left truncate cursor-pointer flex items-center gap-1"
                          title={lang === 'ar' ? `تصفية قائمة التهديدات بهذا الـ IP: ${threat.sourceIp}` : `Click to filter threat list by this IP: ${threat.sourceIp}`}
                        >
                          <span className="text-slate-500 text-[9px]">SRC:</span>
                          <span className="underline decoration-dotted text-cyan-300 font-mono">{threat.sourceIp}</span>
                        </button>
                        <span className="text-slate-600">→</span>
                        <span className="text-slate-400 truncate max-w-[85px]" title={`Target Asset: ${threat.targetAsset}`}>
                          {threat.targetAsset}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Threat Type Badge (Clickable to filter by type) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setThreatTypeFilter(threat.type);
                          }}
                          className={`px-1.5 py-0.2 rounded border text-[9px] font-mono-cyber transition-all cursor-pointer ${getThreatTypeStyle(threat.type)}`}
                          title={lang === 'ar' ? `تصفية القائمة بنوع: ${threat.type}` : `Filter list by threat type: ${threat.type}`}
                        >
                          {getThreatTypeLabel(threat.type, lang === 'ar')}
                        </button>

                        {threat.mitreTactic && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              const code = threat.mitreTactic.split(' ')[0];
                              setMitreFilter(code);
                            }}
                            className="px-1.5 py-0.2 rounded bg-purple-950/40 hover:bg-purple-900/50 text-purple-300 border border-purple-800/40 text-[9px] truncate max-w-[110px] cursor-pointer"
                            title={`Click to filter by ${threat.mitreTactic}`}
                          >
                            {threat.mitreTactic.split(' - ')[0]}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Threat Density Visual Mini-Heatmap Widget */}
        <ThreatDensityHeatmap
          telemetryStream={telemetryStream}
          activeThreats={activeThreats}
          lang={lang}
          onSelectFilter={handleHeatmapFilter}
          activeSearchQuery={searchQuery}
          activeSourceIp={sourceIpFilter}
        />

        {/* Live Sub-second Log / eBPF Stream */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex-1 flex flex-col relative">
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2.5 gap-2">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase">
                {lang === 'ar' ? 'تدفق سجلات الحركة والاستشعار الحي' : 'HIGH-SPEED TELEMETRY STREAM'}
              </h3>
            </div>
            
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Telemetry Stream Status Badge */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-[10px] font-mono-cyber">
                {streamPaused ? (
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                    {lang === 'ar' ? 'مجمد' : 'FROZEN'}
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {lang === 'ar' ? 'بث حي' : 'LIVE'}
                  </span>
                )}
                <span className="text-slate-600">|</span>
                <span className="text-slate-400">
                  {filteredTelemetry.length}/{activeTelemetrySource.length}
                </span>
              </div>

              {onOpenIngestionLab && (
                <button
                  onClick={onOpenIngestionLab}
                  className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center gap-1 transition-colors cursor-pointer"
                  title={lang === 'ar' ? 'إدخال وفحص سجلات حقيقية' : 'Inject and evaluate real logs'}
                >
                  <Terminal className="w-3 h-3 text-cyan-400" />
                  <span className="hidden sm:inline">{lang === 'ar' ? '+ فحص حقيقي' : '+ Lab Ingestion'}</span>
                </button>
              )}

              {/* Export Telemetry & Incident PDF Button */}
              <button
                id="telemetry-export-pdf-btn"
                onClick={triggerPdfExport}
                className="px-2 py-1 rounded bg-red-950/80 hover:bg-red-900 border border-red-500/50 text-red-200 hover:text-white text-[10px] font-mono-cyber flex items-center gap-1 transition-colors cursor-pointer shadow-sm"
                title={lang === 'ar' ? 'تصدير وثيقة السجلات الجنائية والتدقيق بصيغة PDF' : 'Export Forensic Telemetry & Audit Dossier as PDF'}
              >
                <FileDown className="w-3 h-3 text-red-400" />
                <span className="font-bold">{lang === 'ar' ? 'تصدير PDF' : 'Export PDF'}</span>
              </button>

              {/* Explicit Pause / Freeze Telemetry Toggle */}
              <button
                onClick={togglePauseTelemetry}
                id="pause-telemetry-toggle-btn"
                className={`px-2.5 py-1 rounded-md border text-[10px] font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer ${
                  streamPaused
                    ? 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-500/60 text-amber-300 font-bold shadow-[0_0_10px_rgba(245,158,11,0.25)] animate-pulse'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-amber-300 border-slate-700'
                }`}
                title={streamPaused ? 'Resume live incoming telemetry stream' : 'Pause telemetry stream to freeze events for detailed investigation'}
              >
                {streamPaused ? (
                  <>
                    <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                    <span>{lang === 'ar' ? 'استئناف البث' : 'Resume Telemetry'}</span>
                  </>
                ) : (
                  <>
                    <Pause className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span>{lang === 'ar' ? 'تجميد السجلات' : 'Pause Telemetry'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Prominent Stream Frozen Alert Banner */}
          {streamPaused && (
            <div className="mb-2.5 p-2 rounded-lg bg-amber-950/40 border border-amber-500/50 flex flex-wrap items-center justify-between gap-2 text-[10px] font-mono-cyber text-amber-200 shadow-lg">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="font-bold uppercase tracking-wider text-amber-300">
                  {lang === 'ar' ? 'تم تجميد تدفق السجلات (وضع الفحص والتحقيق)' : 'TELEMETRY STREAM FROZEN (INVESTIGATION MODE)'}
                </span>
                <span className="text-slate-500 hidden sm:inline">|</span>
                <span className="text-slate-300">
                  {newEventsBufferedCount > 0 ? (
                    <span className="text-amber-300 font-semibold">
                      +{newEventsBufferedCount} {lang === 'ar' ? 'سجلات جديدة مؤقتة في الخلفية' : 'new incoming events queued in background'}
                    </span>
                  ) : (
                    <span>{lang === 'ar' ? 'الإطار الزمني ثابت ومحفوظ للتحقيق' : 'Frame locked at freeze moment'}</span>
                  )}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setFrozenTelemetryStream(telemetryStream);
                    setPausedAtTimestamp(Date.now());
                  }}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[9px] cursor-pointer transition-colors"
                  title={lang === 'ar' ? 'تحديث لقطة السجلات الحالية مع البقاء في وضع التجميد' : 'Snapshot latest logs and keep stream paused'}
                >
                  {lang === 'ar' ? 'تحديث اللقطة' : 'Step Snapshot'}
                </button>

                <button
                  onClick={togglePauseTelemetry}
                  className="px-2.5 py-0.5 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/60 text-emerald-300 text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-colors shadow-sm"
                >
                  <Play className="w-2.5 h-2.5 fill-emerald-400" />
                  <span>{lang === 'ar' ? 'استئناف' : 'Resume'}</span>
                </button>
              </div>
            </div>
          )}

          {/* Filter Pills */}
          <div className="flex items-center justify-between gap-1.5 mb-2 text-[10px] font-mono-cyber flex-wrap">
            <div className="flex items-center gap-1.5">
              {(['ALL', 'DROPPED', 'SYSCALL', 'CRITICAL'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTelemetryFilter(f)}
                  className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                    telemetryFilter === f
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <span className="text-[9px] text-slate-500 hidden sm:inline">
              {streamPaused ? (
                <span className="text-amber-400">{lang === 'ar' ? 'انقر على أي سجل لفتحه وفحصه بعمق' : 'Click any log entry to inspect deep payload'}</span>
              ) : (
                <span>{lang === 'ar' ? 'قم بتجميد البث لتفحص السجلات بأريحية' : 'Freeze stream anytime to inspect logs'}</span>
              )}
            </span>
          </div>

          {/* Stream Terminal Window */}
          <div className="flex-1 bg-[#05080f] rounded-lg border border-slate-900 p-2 font-mono-cyber text-[10px] overflow-y-auto space-y-1.5 max-h-[380px]">
            {filteredTelemetry.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-slate-400">
                <Terminal className="w-6 h-6 text-cyan-500 animate-pulse" />
                {isFilterActive ? (
                  <>
                    <span>{lang === 'ar' ? 'لا توجد سجلات تطابق شروط الفلترة المحددة' : 'No telemetry logs match active filters'}</span>
                    <button onClick={clearAllFilters} className="text-cyan-400 hover:underline text-[10px] cursor-pointer">
                      {lang === 'ar' ? 'إلغاء تفعيل الفلاتر' : 'Clear search & filters'}
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-slate-200 font-bold">
                      {lang === 'ar' ? 'وضع الاستماع السلكي الصارم نشط (100% Strict Production)' : 'STRICT WIRE INGESTION MODE ACTIVE (100% Real)'}
                    </span>
                    <span className="text-[10px] text-slate-400 max-w-md">
                      {lang === 'ar' 
                        ? 'اللوحة صارمة ولا تولد بيانات افتراضية. بانتظار تدفق الحزم عبر السيرفر (POST /api/ingest) أو عميل اللينكس الحي.' 
                        : 'Pure strict zero-trust listener. Waiting for real wire packets via POST /api/ingest or live Linux daemon.'}
                    </span>
                  </>
                )}
              </div>
            ) : (
              filteredTelemetry.slice(0, 50).map((evt, idx) => {
                let actionBadge = 'bg-slate-800 text-slate-300';
                if (evt.actionTaken === 'XDP_DROPPED') actionBadge = 'bg-red-950 text-red-400 border border-red-600/40';
                if (evt.actionTaken === 'SDN_ISOLATED') actionBadge = 'bg-amber-950 text-amber-300 border border-amber-600/40';
                if (evt.actionTaken === 'INSPECTED') actionBadge = 'bg-cyan-950 text-cyan-300 border border-cyan-600/40';

                const isInspected = inspectedLog?.id === evt.id;

                return (
                  <div 
                    key={`${evt.id}-${evt.timestamp}-${idx}`} 
                    onClick={() => setInspectedLog(evt)}
                    className={`p-1.5 rounded transition-all duration-150 border flex flex-col gap-0.5 cursor-pointer group select-none ${
                      isInspected 
                        ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-900/40 hover:bg-slate-800/60 border-transparent hover:border-slate-700/60'
                    }`}
                    title={lang === 'ar' ? 'انقر لفحص تفاصيل وحمولة الحزمة الكاملة' : 'Click to inspect packet details & raw payload'}
                  >
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="text-cyan-400">{new Date(evt.timestamp).toISOString().substring(14, 23)}</span>
                        <span className="px-1 py-0.2 rounded bg-slate-800 text-slate-300 text-[8px] font-bold">
                          {evt.protocol}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`px-1 py-0.2 rounded text-[8px] font-bold ${actionBadge}`}>
                          {evt.actionTaken}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedLog(evt);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-cyan-950 text-cyan-400 transition-opacity"
                          title="Inspect this event"
                        >
                          <Eye className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-slate-300">
                      <span className="truncate">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSourceIpFilter(evt.sourceIp);
                          }}
                          className="hover:text-cyan-300 text-slate-200 transition-colors cursor-pointer underline decoration-dotted font-bold"
                          title="Filter by this source IP"
                        >
                          {evt.sourceIp}
                        </button>
                        <span className="text-slate-500">:{evt.sourcePort}</span> &rarr; {evt.destinationIp}
                        <span className="text-slate-500">:{evt.destinationPort}</span>
                      </span>
                      <span className="text-slate-500 shrink-0">{evt.packetSize} B</span>
                    </div>

                    <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5">
                      <span>H(x): <strong className={evt.entropyValue > 6.45 ? 'text-red-400 font-bold' : evt.entropyValue > 5.5 ? 'text-amber-400' : 'text-slate-300'}>{evt.entropyValue}</strong></span>
                      <span>Score: <strong className={evt.signatureFreeScore > 80 ? 'text-red-400' : 'text-emerald-400'}>{evt.signatureFreeScore}</strong></span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>

    {/* Log Inspection Deep Forensic Modal / Drawer */}
    {inspectedLog && (
      <div 
        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
        onClick={() => setInspectedLog(null)}
      >
        <div 
          className="bg-[#080d1a] border border-cyan-500/40 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-200 font-mono-cyber text-xs"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="p-3.5 border-b border-slate-800 bg-[#0a1122] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-cyan-400" />
              <div>
                <h3 className="font-bold text-sm text-slate-100 font-display-cyber flex items-center gap-2">
                  <span>{lang === 'ar' ? 'فحص السجل التكتيكي المعمق' : 'TELEMETRY RECORD INSPECTOR'}</span>
                  <span className="text-xs text-cyan-400 font-mono-cyber">#{inspectedLog.id}</span>
                </h3>
                <p className="text-[10px] text-slate-400">
                  {streamPaused ? (
                    <span className="text-amber-400 font-bold">
                      {lang === 'ar' ? 'وضع التجميد نشط - الإطار محمي من الإزاحة' : 'Frozen Stream Investigation Frame - Protected from push-off'}
                    </span>
                  ) : (
                    <span>{lang === 'ar' ? 'مستخرج من تدفق eBPF الحي' : 'Captured from active eBPF wire telemetry'}</span>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(inspectedLog, null, 2));
                  setCopiedLogId(inspectedLog.id);
                  setTimeout(() => setCopiedLogId(null), 2000);
                }}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Copy full JSON record"
              >
                {copiedLogId === inspectedLog.id ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 text-slate-400" />
                    <span>JSON</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setInspectedLog(null)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-4 overflow-y-auto space-y-4">
            
            {/* Top Stat Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-2 rounded-lg bg-[#04070f] border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'الإجراء المتخذ' : 'Action Taken'}</span>
                <span className={`text-xs font-bold ${
                  inspectedLog.actionTaken === 'XDP_DROPPED' ? 'text-red-400' :
                  inspectedLog.actionTaken === 'SDN_ISOLATED' ? 'text-amber-400' : 'text-cyan-400'
                }`}>
                  {inspectedLog.actionTaken}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#04070f] border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'مستوى الخطورة' : 'Severity'}</span>
                <span className={`text-xs font-bold ${
                  inspectedLog.severity === 'CRITICAL' ? 'text-red-400' :
                  inspectedLog.severity === 'HIGH' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {inspectedLog.severity}
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#04070f] border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'انتروبيا شانون H(x)' : 'Shannon Entropy'}</span>
                <span className={`text-xs font-bold ${
                  inspectedLog.entropyValue >= 6.45 ? 'text-red-400' : 'text-cyan-300'
                }`}>
                  {inspectedLog.entropyValue} <span className="text-[9px] text-slate-500 font-normal">bits/B</span>
                </span>
              </div>

              <div className="p-2 rounded-lg bg-[#04070f] border border-slate-800">
                <span className="text-[9px] text-slate-500 uppercase block">{lang === 'ar' ? 'نقاط الشذوذ الرياضي' : 'Anomaly Score'}</span>
                <span className={`text-xs font-bold ${
                  inspectedLog.signatureFreeScore >= 80 ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {inspectedLog.signatureFreeScore} / 100
                </span>
              </div>
            </div>

            {/* Network Vector Details */}
            <div className="p-3 rounded-lg bg-[#04070f] border border-slate-800 space-y-2">
              <h4 className="text-[10px] uppercase font-bold text-cyan-400 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'تفاصيل المتجه الشبكي والتوجيه' : 'Network Routing & Wire Vector'}</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'المصدر (Source):' : 'Source Address:'}</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <strong className="text-slate-100 font-mono-cyber">{inspectedLog.sourceIp}:{inspectedLog.sourcePort}</strong>
                    <button
                      onClick={() => {
                        setSourceIpFilter(inspectedLog.sourceIp);
                        setInspectedLog(null);
                      }}
                      className="px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[9px] hover:bg-cyan-900 cursor-pointer"
                    >
                      {lang === 'ar' ? 'فلترة' : 'Filter IP'}
                    </button>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'الوجهة (Destination):' : 'Destination Target:'}</span>
                  <div className="mt-0.5">
                    <strong className="text-slate-100 font-mono-cyber">{inspectedLog.destinationIp}:{inspectedLog.destinationPort}</strong>
                    {nodes.find(n => n.ip === inspectedLog.destinationIp) && (
                      <span className="ml-2 text-[10px] text-cyan-400">
                        ({nodes.find(n => n.ip === inspectedLog.destinationIp)?.label})
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'البروتوكول / المسبار:' : 'Protocol / Hook:'}</span>
                  <span className="text-slate-200 mt-0.5 font-bold block">{inspectedLog.protocol}</span>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'حجم الحزمة المنقولة:' : 'Payload Size:'}</span>
                  <span className="text-slate-200 mt-0.5 block">{inspectedLog.packetSize} Bytes</span>
                </div>

                <div className="sm:col-span-2">
                  <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'التوقيت الدقيق بالميلي ثانية:' : 'Precise UTC Timestamp:'}</span>
                  <span className="text-slate-300 font-mono-cyber text-[11px] block mt-0.5">
                    {new Date(inspectedLog.timestamp).toISOString()} ({inspectedLog.timestamp} ms)
                  </span>
                </div>
              </div>
            </div>

            {/* In-Kernel Raw Hex Payload Inspection */}
            <div className="p-3 rounded-lg bg-[#04070f] border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'تفكيك حمولة الحزمة (Hex / Wire Dump)' : 'Raw Wire Payload Inspection (Hex / ASCII)'}</span>
                </h4>
                <span className="text-[9px] text-slate-500 font-mono-cyber">eBPF XDP_HOOK</span>
              </div>

              <div className="bg-[#020307] p-2 rounded border border-slate-900 font-mono-cyber text-[10px] text-slate-400 overflow-x-auto leading-relaxed">
                <div>0000: 45 00 00 {inspectedLog.packetSize.toString(16).padStart(2, '0')} 1c 46 40 00 40 {inspectedLog.protocol === 'TCP' ? '06' : '11'} b1 e6 0a 00 01 02  E..F@.@.........</div>
                <div>0010: 7f 00 00 01 {inspectedLog.sourcePort.toString(16).padStart(4, '0')} {inspectedLog.destinationPort.toString(16).padStart(4, '0')} 00 1c 00 00 00 00 00 00  ................</div>
                <div>0020: {inspectedLog.entropyValue > 6.45 ? 'ff 3c 9a 7e 10 b2 a4 d8 99 21 cc ee 01 44 8a fc' : '7b 22 61 75 74 68 22 3a 20 22 62 65 61 72 65 72'}  {inspectedLog.entropyValue > 6.45 ? '..~.....!..D..' : '{"auth": "bearer'}</div>
                <div>0030: {inspectedLog.entropyValue > 6.45 ? 'e2 81 70 99 12 fa bc d4 43 00 91 a3 bb 77 22 19' : '20 74 6f 6b 65 6e 22 7d 0a 00 00 00 00 00 00 00'}  {inspectedLog.entropyValue > 6.45 ? '..p.....C....w".' : ' token"}........'}</div>
              </div>
            </div>

          </div>

          {/* Modal Footer */}
          <div className="p-3 border-t border-slate-800 bg-[#0a1122] flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSourceIpFilter(inspectedLog.sourceIp);
                  setInspectedLog(null);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? `تصفية سجلات IP: ${inspectedLog.sourceIp}` : `Filter IP: ${inspectedLog.sourceIp}`}</span>
              </button>
            </div>

            <button
              onClick={() => setInspectedLog(null)}
              className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs cursor-pointer transition-colors font-bold"
            >
              {lang === 'ar' ? 'إغلاق نافذة الفحص' : 'Close Inspector'}
            </button>
          </div>

        </div>
      </div>
    )}

    {/* Founder Confidential Subscriber Dossier & Certificate Modal */}
    <FounderSubscriberDossierModal
      isOpen={Boolean(selectedSubscriberForDossier)}
      onClose={() => setSelectedSubscriberForDossier(null)}
      subscriber={selectedSubscriberForDossier}
      lang={lang}
    />

  </div>
  );
};
