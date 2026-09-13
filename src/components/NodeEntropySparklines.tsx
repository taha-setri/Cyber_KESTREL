import React, { useState, useEffect, useMemo, useRef } from 'react';
import { NetworkNode, TelemetryEvent } from '../types/cyber';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  ShieldCheck, 
  Radio, 
  Layers, 
  Server, 
  Database, 
  Key, 
  Archive, 
  Flame, 
  Clock, 
  CheckCircle2,
  Cpu,
  Wifi,
  Gauge,
  Zap,
  BarChart2,
  ChevronDown,
  ChevronUp,
  ShieldAlert,
  Filter
} from 'lucide-react';
import { MiniSparkline } from './MiniSparkline';
import { 
  generateInitialNodeHistory, 
  calculateNextNodeMetrics, 
  buildNodeMetricHistory, 
  NodeMetricHistory,
  CPU_EXHAUSTION_THRESHOLD,
  LATENCY_SPIKE_THRESHOLD,
  ENTROPY_SPIKE_THRESHOLD,
  MEMORY_PRESSURE_THRESHOLD,
  PACKET_DROP_THRESHOLD
} from '../services/nodeResourceTelemetry';

export interface NodeEntropyPoint {
  timestamp: number;
  entropy: number;
  isSpike: boolean;
}

export interface NodeEntropyHistory {
  nodeId: string;
  points: NodeEntropyPoint[];
  currentEntropy: number;
  baselineEntropy: number;
  peakEntropy60s: number;
  minEntropy60s: number;
  avgEntropy60s: number;
  delta60s: number;
  hasSpike: boolean;
  spikeCount60s: number;
}

export const ENTROPY_BASELINE_NORMAL = 4.15;
export { ENTROPY_SPIKE_THRESHOLD };

interface NodeEntropySparklinesProps {
  nodes: NetworkNode[];
  selectedNode: NetworkNode | null;
  onSelectNode: (node: NetworkNode) => void;
  telemetryStream: TelemetryEvent[];
  lang: 'ar' | 'en';
  onFilterByIp?: (ip: string) => void;
}

// Micro Sparkline SVG Component (retained for backward compatibility)
export const MicroSparkline: React.FC<{
  points: number[];
  width?: number;
  height?: number;
  isSpike?: boolean;
  threshold?: number;
  minVal?: number;
  maxVal?: number;
  colorScheme?: 'auto' | 'cyan' | 'red' | 'amber' | 'emerald';
}> = ({
  points,
  width = 110,
  height = 28,
  isSpike = false,
  threshold = ENTROPY_SPIKE_THRESHOLD,
  minVal = 2.0,
  maxVal = 8.2,
  colorScheme = 'auto'
}) => {
  if (!points || points.length < 2) {
    return (
      <div 
        style={{ width, height }} 
        className="flex items-center justify-center bg-slate-900/40 rounded border border-slate-800 text-[8px] font-mono-cyber text-slate-500"
      >
        --
      </div>
    );
  }

  const latestVal = points[points.length - 1];
  let strokeColor = '#06b6d4';
  
  if (colorScheme === 'auto') {
    if (isSpike || latestVal >= threshold) {
      strokeColor = '#ef4444';
    } else if (latestVal >= 5.5) {
      strokeColor = '#f59e0b';
    } else {
      strokeColor = '#10b981';
    }
  } else if (colorScheme === 'red') {
    strokeColor = '#ef4444';
  } else if (colorScheme === 'amber') {
    strokeColor = '#f59e0b';
  }

  const range = maxVal - minVal || 1;
  const stepX = width / (points.length - 1);

  const coords = points.map((val, idx) => {
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const x = idx * stepX;
    const y = height - ((clamped - minVal) / range) * (height - 4) - 2;
    return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
  });

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;
  const thresholdY = height - ((threshold - minVal) / range) * (height - 4) - 2;
  const lastPoint = coords[coords.length - 1];

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`} 
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={`grad-${colorScheme}-${isSpike ? 'spike' : 'norm'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>

      <line 
        x1="0" 
        y1={thresholdY} 
        x2={width} 
        y2={thresholdY} 
        stroke="#ef4444" 
        strokeWidth="0.75" 
        strokeDasharray="2 3" 
        strokeOpacity="0.4" 
      />

      <path d={areaD} fill={`url(#grad-${colorScheme}-${isSpike ? 'spike' : 'norm'})`} />
      <path 
        d={pathD} 
        fill="none" 
        stroke={strokeColor} 
        strokeWidth={isSpike ? '1.8' : '1.3'} 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />

      {lastPoint && (
        <g>
          {isSpike && (
            <circle 
              cx={lastPoint.x} 
              cy={lastPoint.y} 
              r="4.5" 
              fill={strokeColor} 
              opacity="0.6" 
              className="animate-ping" 
            />
          )}
          <circle 
            cx={lastPoint.x} 
            cy={lastPoint.y} 
            r={isSpike ? '2.5' : '2'} 
            fill={strokeColor} 
            stroke="#060911" 
            strokeWidth="1" 
          />
        </g>
      )}
    </svg>
  );
};

export const NodeEntropySparklines: React.FC<NodeEntropySparklinesProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  telemetryStream,
  lang,
  onFilterByIp
}) => {
  // Filter and View Modes
  const [filterMode, setFilterMode] = useState<'ALL' | 'EXHAUSTED_OR_SPIKES' | 'CRITICAL_TIERS'>('ALL');
  const [metricView, setMetricView] = useState<'TRI_METRIC' | 'RESOURCE_TRIO' | 'CPU_ONLY' | 'LATENCY_ONLY' | 'ENTROPY_ONLY'>('RESOURCE_TRIO');
  const [expandedNodeIds, setExpandedNodeIds] = useState<Record<string, boolean>>({});

  // Multi-metric history buffer (Entropy, CPU %, Network Latency ms, Memory %, Packet Drop Rate %)
  const [historyBuffer, setHistoryBuffer] = useState<Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory: number[]; packetDrop: number[] }>>({});
  const historyRef = useRef<Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory: number[]; packetDrop: number[] }>>({});

  // Initialize and seed 60s sliding window for each node
  useEffect(() => {
    const initialHist: Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory: number[]; packetDrop: number[] }> = {};

    nodes.forEach(node => {
      initialHist[node.id] = generateInitialNodeHistory(node);
    });

    historyRef.current = initialHist;
    setHistoryBuffer(initialHist);
  }, [nodes.length]);

  // Rolling 60s update tick: evaluates real incoming telemetry for each node and updates window
  useEffect(() => {
    const timer = setInterval(() => {
      const updated: Record<string, { entropy: number[]; cpu: number[]; latency: number[]; memory: number[]; packetDrop: number[] }> = { ...historyRef.current };
      const recentTelemetry = telemetryStream.slice(0, 10);

      nodes.forEach(node => {
        const prev = updated[node.id] || generateInitialNodeHistory(node);
        const next = calculateNextNodeMetrics(node, prev, recentTelemetry);

        updated[node.id] = {
          entropy: [...prev.entropy.slice(1), next.entropy],
          cpu: [...prev.cpu.slice(1), next.cpu],
          latency: [...prev.latency.slice(1), next.latency],
          memory: [...(prev.memory || []).slice(1), next.memory],
          packetDrop: [...(prev.packetDrop || []).slice(1), next.packetDrop]
        };
      });

      historyRef.current = updated;
      setHistoryBuffer(updated);
    }, 1800);

    return () => clearInterval(timer);
  }, [nodes, telemetryStream]);

  // Compute rich statistical metrics per node for the last 60s
  const nodeMetrics: Record<string, NodeMetricHistory> = useMemo(() => {
    const result: Record<string, NodeMetricHistory> = {};
    nodes.forEach(node => {
      const hist = historyBuffer[node.id] || generateInitialNodeHistory(node);
      result[node.id] = buildNodeMetricHistory(
        node.id, 
        hist.entropy, 
        hist.cpu, 
        hist.latency, 
        node.status === 'ISOLATED',
        hist.memory,
        hist.packetDrop
      );
    });
    return result;
  }, [nodes, historyBuffer]);

  // Overall cluster stats
  const aggregateStats = useMemo(() => {
    const metricList = Object.values(nodeMetrics);
    const totalCpuExhausted = metricList.filter(m => m.isCpuExhausted).length;
    const totalLatencySpikes = metricList.filter(m => m.isLatencySpike).length;
    const totalSpikingNodes = metricList.filter(m => m.isEntropySpike).length;

    const avgCpu = metricList.length > 0
      ? Math.round(metricList.reduce((acc, m) => acc + m.currentCpu, 0) / metricList.length)
      : 25;

    const avgLatency = metricList.length > 0
      ? (metricList.reduce((acc, m) => acc + m.currentLatency, 0) / metricList.length).toFixed(1)
      : '3.5';

    const avgClusterEntropy = metricList.length > 0
      ? (metricList.reduce((acc, m) => acc + m.currentEntropy, 0) / metricList.length).toFixed(2)
      : '4.20';

    const highestCpuNode = [...metricList].sort((a, b) => b.currentCpu - a.currentCpu)[0];
    const highestLatencyNode = [...metricList].sort((a, b) => b.currentLatency - a.currentLatency)[0];

    return {
      totalCpuExhausted,
      totalLatencySpikes,
      totalSpikingNodes,
      avgCpu,
      avgLatency,
      avgClusterEntropy,
      highestCpuNode,
      highestLatencyNode
    };
  }, [nodeMetrics]);

  // Filtered nodes based on active tab
  const displayedNodes = useMemo(() => {
    return nodes.filter(node => {
      const metric = nodeMetrics[node.id];
      if (filterMode === 'EXHAUSTED_OR_SPIKES') {
        return metric?.isCpuExhausted || metric?.isLatencySpike || metric?.isEntropySpike || node.status === 'TARGETED';
      }
      if (filterMode === 'CRITICAL_TIERS') {
        return node.type === 'DATABASE' || node.type === 'IAM_KEY_VAULT' || node.type === 'EDGE_ROUTER' || node.type === 'CORE_SWITCH';
      }
      return true;
    });
  }, [nodes, nodeMetrics, filterMode]);

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'INTERNET': return <Radio className="w-3.5 h-3.5 text-slate-400" />;
      case 'EDGE_ROUTER': return <Activity className="w-3.5 h-3.5 text-cyan-400" />;
      case 'FIREWALL': return <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />;
      case 'CORE_SWITCH': return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'APP_SERVER': return <Server className="w-3.5 h-3.5 text-indigo-400" />;
      case 'DATABASE': return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case 'IAM_KEY_VAULT': return <Key className="w-3.5 h-3.5 text-amber-400" />;
      case 'AIRGAP_BACKUP': return <Archive className="w-3.5 h-3.5 text-emerald-500" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3.5 space-y-3 shadow-xl">
      
      {/* Header and Telemetry Horizon Info */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
        
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-cyan-400">
            <Gauge className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-xs font-bold font-display-cyber text-slate-100 uppercase tracking-wide">
                {lang === 'ar' 
                  ? 'مصفوفة استنزاف الموارد ومخططات العقد اللحظية (CPU / Latency / Entropy)' 
                  : 'NODE RESOURCE EXHAUSTION & SPARKLINE MATRIX (60s HORIZON)'}
              </h3>

              {/* Resource Exhaustion Badges */}
              {aggregateStats.totalCpuExhausted > 0 ? (
                <span className="text-[9px] font-mono-cyber px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/40 font-bold animate-pulse flex items-center gap-1">
                  <Cpu className="w-2.5 h-2.5 text-red-400" />
                  {aggregateStats.totalCpuExhausted} {lang === 'ar' ? 'استنزاف معالج' : 'CPU EXHAUSTED'}
                </span>
              ) : null}

              {aggregateStats.totalLatencySpikes > 0 ? (
                <span className="text-[9px] font-mono-cyber px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold animate-pulse flex items-center gap-1">
                  <Wifi className="w-2.5 h-2.5 text-rose-400" />
                  {aggregateStats.totalLatencySpikes} {lang === 'ar' ? 'اختناق شبكي' : 'LATENCY SPIKES'}
                </span>
              ) : null}

              {aggregateStats.totalCpuExhausted === 0 && aggregateStats.totalLatencySpikes === 0 && (
                <span className="text-[9px] font-mono-cyber px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                  {lang === 'ar' ? 'الموارد مستقرة' : 'RESOURCES OPTIMAL'}
                </span>
              )}
            </div>
            
            <p className="text-[10px] font-mono-cyber text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="flex items-center gap-1 text-slate-400">
                <Clock className="w-3 h-3 text-cyan-400" />
                {lang === 'ar' ? 'نافذة رصد متدحرجة: T-60s إلى T-0s' : 'Sliding telemetry: T-60s to T-0s'}
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Cpu className="w-3 h-3 text-amber-400" />
                {lang === 'ar' ? 'معدل المعالج:' : 'Avg CPU:'}{' '}
                <strong className={aggregateStats.avgCpu >= 70 ? 'text-red-400' : 'text-amber-300'}>
                  {aggregateStats.avgCpu}%
                </strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 text-slate-300">
                <Activity className="w-3 h-3 text-cyan-400" />
                {lang === 'ar' ? 'زمن الاستجابة:' : 'Avg Latency:'}{' '}
                <strong className="text-cyan-300">{aggregateStats.avgLatency} ms</strong>
              </span>
            </p>
          </div>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          
          {/* Metric View Switcher */}
          <div className="flex items-center bg-[#04060a] p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono-cyber">
            <button
              id="btn-metric-resource-trio"
              onClick={() => setMetricView('RESOURCE_TRIO')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metricView === 'RESOURCE_TRIO'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-[0_0_8px_rgba(6,182,212,0.25)]'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View live sparklines for CPU, Memory, and Packet Drop Rate trends"
            >
              <Activity className="w-2.5 h-2.5 text-cyan-400" />
              <span>{lang === 'ar' ? 'المعالج/الذاكرة/الإسقاط' : 'CPU/Mem/Drops'}</span>
            </button>
            <button
              onClick={() => setMetricView('TRI_METRIC')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metricView === 'TRI_METRIC'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="View all 3 metrics simultaneously per node: CPU, Latency, and Entropy"
            >
              <BarChart2 className="w-2.5 h-2.5" />
              <span>{lang === 'ar' ? 'المقاييس الثلاثية' : 'Tri-Metric'}</span>
            </button>
            <button
              onClick={() => setMetricView('CPU_ONLY')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metricView === 'CPU_ONLY'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Focus on CPU load and compute exhaustion"
            >
              <Cpu className="w-2.5 h-2.5 text-amber-400" />
              <span>CPU %</span>
            </button>
            <button
              onClick={() => setMetricView('LATENCY_ONLY')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metricView === 'LATENCY_ONLY'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Focus on network latency and queue congestion"
            >
              <Wifi className="w-2.5 h-2.5 text-rose-400" />
              <span>Latency</span>
            </button>
            <button
              onClick={() => setMetricView('ENTROPY_ONLY')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                metricView === 'ENTROPY_ONLY'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Focus on Shannon entropy analysis"
            >
              <Zap className="w-2.5 h-2.5 text-purple-400" />
              <span>Entropy</span>
            </button>
          </div>

          {/* Node Filter Tabs */}
          <div className="flex items-center gap-1 bg-[#04060a] p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono-cyber">
            <button
              onClick={() => setFilterMode('ALL')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer ${
                filterMode === 'ALL'
                  ? 'bg-slate-800 text-slate-200 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? 'الكل' : 'All'} ({nodes.length})
            </button>
            <button
              onClick={() => setFilterMode('EXHAUSTED_OR_SPIKES')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer flex items-center gap-1 ${
                filterMode === 'EXHAUSTED_OR_SPIKES'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>{lang === 'ar' ? 'المستنزفة فقط' : 'Exhausted Only'}</span>
              {(aggregateStats.totalCpuExhausted > 0 || aggregateStats.totalLatencySpikes > 0) && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
              )}
            </button>
            <button
              onClick={() => setFilterMode('CRITICAL_TIERS')}
              className={`px-2 py-0.8 rounded-md transition-all cursor-pointer ${
                filterMode === 'CRITICAL_TIERS'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? 'Tier-0' : 'Tier-0 Core'}
            </button>
          </div>

        </div>

      </div>

      {/* Grid of Micro-Sparkline Cards for Each Active Node */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
        {displayedNodes.map(node => {
          const metric = nodeMetrics[node.id];
          const isSelected = selectedNode?.id === node.id;
          const isExhausted = metric?.exhaustionLevel === 'EXHAUSTED';
          const isCpuHigh = metric?.isCpuExhausted;
          const isLatencyHigh = metric?.isLatencySpike;

          let cardBorder = 'border-slate-800/80 bg-[#070b13] hover:border-slate-700';
          if (isSelected) {
            cardBorder = 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.25)]';
          } else if (isExhausted || isCpuHigh) {
            cardBorder = 'border-red-600/60 bg-red-950/25 hover:border-red-500 ring-1 ring-red-500/40 shadow-[0_0_14px_rgba(239,68,68,0.2)]';
          } else if (isLatencyHigh || node.status === 'TARGETED') {
            cardBorder = 'border-amber-600/50 bg-amber-950/20 hover:border-amber-500 ring-1 ring-amber-500/30';
          }

          return (
            <div
              key={node.id}
              id={`node-sparkline-card-${node.id}`}
              onClick={() => {
                onSelectNode(node);
                if (onFilterByIp) onFilterByIp(node.ip);
              }}
              className={`p-2.5 rounded-lg border transition-all duration-150 cursor-pointer flex flex-col justify-between gap-2 select-none group ${cardBorder}`}
              title={`${node.label} (${node.ip}) - Click to inspect resource metrics`}
            >
              {/* Top Row: Node Icon, Label, and Status Badges */}
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex items-center gap-1.5 truncate">
                  <div className={`p-1 rounded ${
                    isExhausted || isCpuHigh 
                      ? 'bg-red-500/20 text-red-300' 
                      : 'bg-slate-800/80 text-slate-300'
                  }`}>
                    {getNodeIcon(node.type)}
                  </div>
                  <div className="truncate">
                    <div className="text-[11px] font-bold font-display-cyber text-slate-100 truncate leading-tight group-hover:text-cyan-300 transition-colors">
                      {lang === 'ar' ? node.labelAr : node.label}
                    </div>
                    <div className="text-[9px] font-mono-cyber text-slate-400 truncate opacity-85">
                      {node.ip}
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="shrink-0 text-right">
                  {isExhausted ? (
                    <span className="text-[8px] font-mono-cyber font-bold px-1.5 py-0.2 rounded bg-red-500/30 text-red-200 border border-red-500/50 animate-pulse flex items-center gap-0.5">
                      <Flame className="w-2.5 h-2.5 text-red-400" />
                      EXHAUSTION
                    </span>
                  ) : node.status === 'ISOLATED' ? (
                    <span className="text-[8px] font-mono-cyber font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      QUARANTINE
                    </span>
                  ) : metric?.exhaustionLevel === 'ELEVATED' ? (
                    <span className="text-[8px] font-mono-cyber font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ELEVATED
                    </span>
                  ) : (
                    <span className="text-[8px] font-mono-cyber px-1 py-0.2 rounded bg-slate-800 text-slate-400">
                      NOMINAL
                    </span>
                  )}
                </div>
              </div>

              {/* Middle Section: Miniature Sparkline Charts */}
              {metricView === 'RESOURCE_TRIO' ? (
                /* Resource Trio View: CPU Trend + Memory Trend + Packet Drop Rate Trend */
                <div className="space-y-1.5 bg-[#03060c] p-2 rounded border border-slate-900/90 text-xs">
                  {/* CPU Sparkline Row */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-14 shrink-0">
                      <Cpu className="w-3 h-3 text-amber-400" />
                      <span>CPU:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.cpuPoints || [20, 20]}
                        width={90}
                        height={16}
                        minVal={0}
                        maxVal={100}
                        threshold={CPU_EXHAUSTION_THRESHOLD}
                        metricType="cpu"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      isCpuHigh ? 'text-red-400 animate-pulse' : 'text-amber-300'
                    }`}>
                      {metric?.currentCpu ?? 20}%
                    </div>
                  </div>

                  {/* Memory (RAM) Sparkline Row */}
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-14 shrink-0">
                      <Layers className="w-3 h-3 text-indigo-400" />
                      <span>RAM:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.memoryPoints || [35, 35]}
                        width={90}
                        height={16}
                        minVal={0}
                        maxVal={100}
                        threshold={MEMORY_PRESSURE_THRESHOLD}
                        metricType="memory"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      metric?.isMemoryElevated ? 'text-amber-400' : 'text-indigo-300'
                    }`}>
                      {metric?.currentMemory ?? 35}%
                    </div>
                  </div>

                  {/* Packet Drop Rate Sparkline Row */}
                  <div className="flex items-center justify-between gap-1.5 pt-0.5 border-t border-slate-900">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-14 shrink-0">
                      <Activity className="w-3 h-3 text-rose-400" />
                      <span>Drop:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.packetDropPoints || [0.1, 0.1]}
                        width={90}
                        height={16}
                        minVal={0}
                        maxVal={25}
                        threshold={PACKET_DROP_THRESHOLD}
                        metricType="packet_drop"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      metric?.isPacketDropSpike ? 'text-red-400 animate-pulse' : 'text-rose-300'
                    }`}>
                      {metric?.currentPacketDropRate?.toFixed(1) ?? '0.1'}%
                    </div>
                  </div>
                </div>
              ) : metricView === 'TRI_METRIC' ? (
                /* Tri-Metric View: CPU Sparkline + Network Latency Sparkline + Entropy Sparkline */
                <div className="space-y-1.5 bg-[#03060c] p-2 rounded border border-slate-900/90 text-xs">
                  {/* CPU Sparkline Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-16 shrink-0">
                      <Cpu className="w-3 h-3 text-amber-400" />
                      <span>CPU:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.cpuPoints || [20, 20]}
                        width={90}
                        height={16}
                        minVal={0}
                        maxVal={100}
                        threshold={CPU_EXHAUSTION_THRESHOLD}
                        metricType="cpu"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      isCpuHigh ? 'text-red-400 animate-pulse' : metric?.currentCpu && metric.currentCpu >= 60 ? 'text-amber-300' : 'text-slate-300'
                    }`}>
                      {metric?.currentCpu ?? 20}%
                    </div>
                  </div>

                  {/* Network Latency Sparkline Row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-16 shrink-0">
                      <Activity className="w-3 h-3 text-cyan-400" />
                      <span>Latency:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.latencyPoints || [3, 3]}
                        width={90}
                        height={16}
                        minVal={0}
                        maxVal={80}
                        threshold={LATENCY_SPIKE_THRESHOLD}
                        metricType="latency"
                        unit="ms"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      isLatencyHigh ? 'text-rose-400 animate-pulse' : 'text-cyan-300'
                    }`}>
                      {metric?.currentLatency ?? 3.2}ms
                    </div>
                  </div>

                  {/* Shannon Entropy Sparkline Row */}
                  <div className="flex items-center justify-between gap-2 pt-0.5 border-t border-slate-900">
                    <div className="flex items-center gap-1 text-[10px] font-mono-cyber text-slate-400 w-16 shrink-0">
                      <Zap className="w-3 h-3 text-purple-400" />
                      <span>Entropy:</span>
                    </div>
                    <div className="flex-1 overflow-hidden flex justify-center">
                      <MiniSparkline
                        points={metric?.entropyPoints || [4.1, 4.1]}
                        width={90}
                        height={16}
                        minVal={2.0}
                        maxVal={8.0}
                        threshold={ENTROPY_SPIKE_THRESHOLD}
                        metricType="entropy"
                        unit="b/B"
                        interactiveHover={true}
                      />
                    </div>
                    <div className={`text-[10px] font-mono-cyber font-bold w-10 text-right shrink-0 ${
                      metric?.isEntropySpike ? 'text-red-400' : 'text-purple-300'
                    }`}>
                      {metric?.currentEntropy.toFixed(1) ?? '4.1'}
                    </div>
                  </div>
                </div>
              ) : metricView === 'CPU_ONLY' ? (
                /* Focused CPU Load View */
                <div className="bg-[#03060c] p-2 rounded border border-slate-900/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Cpu className="w-3.5 h-3.5" />
                      CPU Compute Exhaustion
                    </span>
                    <span className={`font-bold ${isCpuHigh ? 'text-red-400 animate-pulse' : 'text-slate-200'}`}>
                      {metric?.currentCpu ?? 20}%
                    </span>
                  </div>
                  <div className="py-1 flex justify-center">
                    <MiniSparkline
                      points={metric?.cpuPoints || [20, 20]}
                      width={180}
                      height={26}
                      minVal={0}
                      maxVal={100}
                      threshold={CPU_EXHAUSTION_THRESHOLD}
                      metricType="cpu"
                      unit="%"
                      interactiveHover={true}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono-cyber text-slate-500">
                    <span>Peak 60s: <strong className={isCpuHigh ? 'text-red-400' : 'text-slate-400'}>{metric?.peakCpu ?? 20}%</strong></span>
                    <span>Avg: <strong className="text-slate-400">{metric?.avgCpu ?? 20}%</strong></span>
                    <span>Limit: <strong className="text-red-400">80%</strong></span>
                  </div>
                </div>
              ) : metricView === 'LATENCY_ONLY' ? (
                /* Focused Network Latency View */
                <div className="bg-[#03060c] p-2 rounded border border-slate-900/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold">
                      <Activity className="w-3.5 h-3.5" />
                      Wire Packet Latency
                    </span>
                    <span className={`font-bold ${isLatencyHigh ? 'text-rose-400 animate-pulse' : 'text-cyan-300'}`}>
                      {metric?.currentLatency ?? 3.2} ms
                    </span>
                  </div>
                  <div className="py-1 flex justify-center">
                    <MiniSparkline
                      points={metric?.latencyPoints || [3, 3]}
                      width={180}
                      height={26}
                      minVal={0}
                      maxVal={80}
                      threshold={LATENCY_SPIKE_THRESHOLD}
                      metricType="latency"
                      unit="ms"
                      interactiveHover={true}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono-cyber text-slate-500">
                    <span>Peak: <strong className={isLatencyHigh ? 'text-rose-400' : 'text-cyan-400'}>{metric?.peakLatency ?? 3.2}ms</strong></span>
                    <span>Avg: <strong className="text-slate-400">{metric?.avgLatency ?? 3.2}ms</strong></span>
                    <span>Threshold: <strong className="text-rose-400">45ms</strong></span>
                  </div>
                </div>
              ) : (
                /* Focused Shannon Entropy View */
                <div className="bg-[#03060c] p-2 rounded border border-slate-900/90 space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-400">
                    <span className="flex items-center gap-1 text-purple-400 font-bold">
                      <Zap className="w-3.5 h-3.5" />
                      Shannon Entropy H(x)
                    </span>
                    <span className={`font-bold ${metric?.isEntropySpike ? 'text-red-400' : 'text-purple-300'}`}>
                      {metric?.currentEntropy.toFixed(2) ?? '4.15'} b/B
                    </span>
                  </div>
                  <div className="py-1 flex justify-center">
                    <MiniSparkline
                      points={metric?.entropyPoints || [4.1, 4.1]}
                      width={180}
                      height={26}
                      minVal={2.0}
                      maxVal={8.0}
                      threshold={ENTROPY_SPIKE_THRESHOLD}
                      metricType="entropy"
                      unit="b/B"
                      interactiveHover={true}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[9px] font-mono-cyber text-slate-500">
                    <span>Peak: <strong className={metric?.isEntropySpike ? 'text-red-400' : 'text-slate-400'}>{metric?.peakEntropy.toFixed(2) ?? '4.15'}</strong></span>
                    <span>Anomaly Limit: <strong className="text-red-400">&ge; 6.45 b/B</strong></span>
                  </div>
                </div>
              )}

              {/* Inline Expandable Diagnostic Section for this node */}
              {expandedNodeIds[node.id] && (
                <div 
                  className="mt-1 p-2.5 rounded-lg bg-[#020409] border border-cyan-500/40 space-y-2 text-xs font-mono-cyber animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                    <span className="text-[10px] font-bold text-cyan-300 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{lang === 'ar' ? 'تشخيص حي موسّع للعقدة' : 'Live Node Diagnostic Trends'}</span>
                    </span>
                    <span className="text-[9px] text-slate-500">
                      {node.ip}
                    </span>
                  </div>

                  {/* 1. CPU Utilization Sparkline */}
                  <div className="p-2 rounded bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-amber-400" />
                        {lang === 'ar' ? 'استهلاك المعالج (CPU)' : 'CPU Utilization Trend'}
                      </span>
                      <span className={`font-bold ${isCpuHigh ? 'text-red-400 animate-pulse' : 'text-amber-300'}`}>
                        {metric?.currentCpu ?? 20}%
                      </span>
                    </div>
                    <div className="py-1 flex justify-center">
                      <MiniSparkline
                        points={metric?.cpuPoints || [20, 20]}
                        width={210}
                        height={24}
                        minVal={0}
                        maxVal={100}
                        threshold={CPU_EXHAUSTION_THRESHOLD}
                        metricType="cpu"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>{lang === 'ar' ? 'الذروة:' : 'Peak:'} <strong className={isCpuHigh ? 'text-red-400' : 'text-slate-300'}>{metric?.peakCpu ?? 20}%</strong></span>
                      <span>{lang === 'ar' ? 'المتوسط:' : 'Avg:'} <strong className="text-slate-300">{metric?.avgCpu ?? 20}%</strong></span>
                      <span>{lang === 'ar' ? 'عتبة الإنهاك:' : 'Exhaustion Limit:'} <strong className="text-red-400">&ge; 80%</strong></span>
                    </div>
                  </div>

                  {/* 2. Memory (RAM) Sparkline */}
                  <div className="p-2 rounded bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-indigo-400" />
                        {lang === 'ar' ? 'استهلاك الذاكرة (RAM)' : 'Memory Allocation Trend'}
                      </span>
                      <span className={`font-bold ${metric?.isMemoryElevated ? 'text-amber-400 animate-pulse' : 'text-indigo-300'}`}>
                        {metric?.currentMemory ?? 35}%
                      </span>
                    </div>
                    <div className="py-1 flex justify-center">
                      <MiniSparkline
                        points={metric?.memoryPoints || [35, 35]}
                        width={210}
                        height={24}
                        minVal={0}
                        maxVal={100}
                        threshold={MEMORY_PRESSURE_THRESHOLD}
                        metricType="memory"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>{lang === 'ar' ? 'الذروة:' : 'Peak:'} <strong className={metric?.isMemoryElevated ? 'text-amber-400' : 'text-slate-300'}>{metric?.peakMemory ?? 35}%</strong></span>
                      <span>{lang === 'ar' ? 'المتوسط:' : 'Avg:'} <strong className="text-slate-300">{metric?.avgMemory ?? 35}%</strong></span>
                      <span>{lang === 'ar' ? 'ضغط الذاكرة:' : 'Pressure Limit:'} <strong className="text-amber-400">&ge; 80%</strong></span>
                    </div>
                  </div>

                  {/* 3. Packet Drop Rate Sparkline */}
                  <div className="p-2 rounded bg-slate-900/50 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-300 font-bold flex items-center gap-1">
                        <Activity className="w-3 h-3 text-rose-400" />
                        {lang === 'ar' ? 'معدل إسقاط الحزم (Drop Rate)' : 'Packet Drop Rate Trend'}
                      </span>
                      <span className={`font-bold ${metric?.isPacketDropSpike ? 'text-red-400 animate-pulse' : 'text-rose-300'}`}>
                        {metric?.currentPacketDropRate?.toFixed(1) ?? '0.1'}%
                      </span>
                    </div>
                    <div className="py-1 flex justify-center">
                      <MiniSparkline
                        points={metric?.packetDropPoints || [0.1, 0.1]}
                        width={210}
                        height={24}
                        minVal={0}
                        maxVal={25}
                        threshold={PACKET_DROP_THRESHOLD}
                        metricType="packet_drop"
                        unit="%"
                        interactiveHover={true}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-400">
                      <span>{lang === 'ar' ? 'الذروة:' : 'Peak:'} <strong className={metric?.isPacketDropSpike ? 'text-red-400' : 'text-slate-300'}>{metric?.peakPacketDropRate?.toFixed(1) ?? '0.1'}%</strong></span>
                      <span>{lang === 'ar' ? 'المتوسط:' : 'Avg:'} <strong className="text-slate-300">{metric?.avgPacketDropRate?.toFixed(1) ?? '0.1'}%</strong></span>
                      <span>{lang === 'ar' ? 'حد الإسقاط الحرج:' : 'Drop Threshold:'} <strong className="text-rose-400">&ge; 5.0%</strong></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Toggle Expand Diagnostic Button */}
              <button
                id={`btn-toggle-diag-${node.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setExpandedNodeIds(prev => ({
                    ...prev,
                    [node.id]: !prev[node.id]
                  }));
                  onSelectNode(node);
                }}
                className={`w-full py-1 px-2 rounded flex items-center justify-between text-[10px] font-mono-cyber font-bold border transition-all cursor-pointer ${
                  expandedNodeIds[node.id]
                    ? 'bg-cyan-950/70 border-cyan-500/60 text-cyan-300'
                    : 'bg-slate-900/60 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <span className="flex items-center gap-1">
                  <Activity className="w-3 h-3 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تشخيص موسّع' : 'Expandable Diagnostic'}</span>
                </span>
                <span className="flex items-center gap-1 text-[9px]">
                  <span className="text-slate-500">
                    {expandedNodeIds[node.id] ? (lang === 'ar' ? 'طي' : 'Collapse') : (lang === 'ar' ? 'عرض المخططات الحية' : 'Live Sparklines')}
                  </span>
                  {expandedNodeIds[node.id] ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </span>
              </button>

              {/* Bottom Row: Quick Status Summary */}
              <div className="flex items-center justify-between text-[9px] font-mono-cyber text-slate-400 pt-0.5">
                <span className="flex items-center gap-1">
                  <span className="text-slate-500">Resource Status:</span>
                  <strong className={
                    isExhausted ? 'text-red-400' : metric?.exhaustionLevel === 'ELEVATED' ? 'text-amber-400' : 'text-emerald-400'
                  }>
                    {metric?.exhaustionLevel || 'NOMINAL'}
                  </strong>
                </span>

                <span className="text-[8px] text-slate-500 group-hover:text-cyan-400 transition-colors">
                  {lang === 'ar' ? 'عرض السجلات &larr;' : 'Inspect Telemetry &rarr;'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Info & Instant Threshold Indicator */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono-cyber text-slate-400">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{lang === 'ar' ? 'معالج طبيعي (< 60%)' : 'Nominal CPU (< 60%)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{lang === 'ar' ? 'حمولة مرتفعة (60 - 79%)' : 'High Load (60 - 79%)'}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span>{lang === 'ar' ? 'استنزاف حرج (&ge; 80% CPU / &ge; 45ms Latency)' : 'Resource Exhaustion (&ge; 80% CPU / &ge; 45ms Latency)'}</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          {aggregateStats.highestCpuNode && aggregateStats.highestCpuNode.isCpuExhausted && (
            <span className="text-red-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-red-400" />
              {lang === 'ar' ? 'أعلى استنزاف معالج:' : 'Peak CPU Exhaustion:'}{' '}
              {nodes.find(n => n.id === aggregateStats.highestCpuNode.nodeId)?.label || aggregateStats.highestCpuNode.nodeId}{' '}
              ({aggregateStats.highestCpuNode.currentCpu}%)
            </span>
          )}
        </div>
      </div>

    </div>
  );
};
