import React, { useState, useEffect } from 'react';
import { NetworkNode, TelemetryEvent } from '../types/cyber';
import { NodeMetricHistory } from '../services/nodeResourceTelemetry';
import { MiniSparkline } from './MiniSparkline';
import { 
  Cpu, 
  Database, 
  Activity, 
  ChevronDown, 
  ChevronUp, 
  Radio, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Filter, 
  Zap, 
  Maximize2, 
  Layers,
  HardDrive,
  Server,
  ArrowRightLeft,
  Flame,
  Shield
} from 'lucide-react';

interface ExpandableNodeDiagnosticProps {
  node: NetworkNode;
  metrics: NodeMetricHistory;
  telemetryStream: TelemetryEvent[];
  lang: 'ar' | 'en';
  isExpandedDefault?: boolean;
  onFilterByNodeIp?: (ip: string) => void;
  allNodes?: NetworkNode[];
  onSelectNode?: (node: NetworkNode) => void;
}

export const ExpandableNodeDiagnostic: React.FC<ExpandableNodeDiagnosticProps> = ({
  node,
  metrics,
  telemetryStream,
  lang,
  isExpandedDefault = true,
  onFilterByNodeIp,
  allNodes,
  onSelectNode
}) => {
  const [isExpanded, setIsExpanded] = useState(isExpandedDefault);

  // Automatically expand diagnostic when switching nodes
  useEffect(() => {
    setIsExpanded(true);
  }, [node.id, isExpandedDefault]);

  // Filter matching telemetry events for this specific node
  const matchingEvents = telemetryStream.filter(evt =>
    evt.destinationIp === node.ip || evt.sourceIp === node.ip
  );
  const droppedEvents = matchingEvents.filter(evt =>
    evt.actionTaken === 'XDP_DROPPED' || evt.actionTaken === 'RATE_LIMITED'
  );

  // Compute estimated RAM footprint based on node role & current memory %
  const totalSystemRamGb = node.type === 'DATABASE' || node.type === 'CORE_SWITCH' ? 64 : 32;
  const usedRamGb = ((metrics.currentMemory / 100) * totalSystemRamGb).toFixed(1);

  // Memory status determination
  const isMemoryHigh = metrics.currentMemory >= 80;
  const isDropSpike = metrics.currentPacketDropRate >= 5.0;

  return (
    <div 
      id={`expandable-diagnostic-node-${node.id}`}
      className="mt-3 rounded-xl border border-cyan-500/40 bg-[#060b14] overflow-hidden transition-all duration-200 shadow-[0_6px_24px_rgba(0,0,0,0.6)] ring-1 ring-cyan-500/20"
    >
      {/* Expandable Diagnostic Header Bar */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="px-4 py-3 bg-gradient-to-r from-cyan-950/60 via-slate-900/80 to-slate-900/50 border-b border-cyan-500/25 flex flex-wrap items-center justify-between gap-3 cursor-pointer hover:bg-cyan-950/80 transition-colors select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]">
            <Zap className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-xs font-bold font-display-cyber text-slate-100 tracking-wide uppercase flex items-center gap-1.5">
                <span>{lang === 'ar' ? 'التشخيص الموسّع للعقدة' : 'Expandable Diagnostic'}</span>
              </h4>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono-cyber font-bold bg-cyan-500/25 text-cyan-200 border border-cyan-500/40">
                {lang === 'ar' ? node.labelAr : node.label}
              </span>
              <span className="text-[11px] font-mono-cyber text-cyan-400 font-semibold">
                ({node.ip})
              </span>
              {node.status === 'ISOLATED' && (
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-cyber font-bold bg-red-500/30 text-red-300 border border-red-500/50 animate-pulse">
                  {lang === 'ar' ? 'معزولة ذاتياً' : 'QUARANTINED'}
                </span>
              )}
            </div>
            <p className="text-[10px] font-mono-cyber text-slate-400 flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="inline-flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 animate-pulse" />
                {lang === 'ar' ? 'مجسّات النواة اللحظية (eBPF Probes)' : 'Kernel Ring Buffer & Hardware Telemetry'}
              </span>
              <span>•</span>
              <span>{lang === 'ar' ? 'نافذة 60 ثانية متدرجة (30 عينة)' : '60s Sliding Window (30 samples @ 2s)'}</span>
            </p>
          </div>
        </div>

        {/* Status Indicators & Expand Toggle */}
        <div className="flex items-center gap-3">
          {/* Quick Metrics Summary Badges */}
          <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono-cyber">
            <span className={`px-2 py-0.5 rounded border ${
              metrics.isCpuExhausted 
                ? 'bg-red-500/20 border-red-500/40 text-red-300 font-bold animate-pulse' 
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}>
              CPU: {metrics.currentCpu}%
            </span>
            <span className={`px-2 py-0.5 rounded border ${
              isMemoryHigh 
                ? 'bg-amber-500/20 border-amber-500/40 text-amber-300 font-bold' 
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}>
              MEM: {metrics.currentMemory}%
            </span>
            <span className={`px-2 py-0.5 rounded border ${
              isDropSpike 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-bold animate-pulse' 
                : 'bg-slate-800/60 border-slate-700 text-slate-300'
            }`}>
              DROP: {metrics.currentPacketDropRate}%
            </span>
          </div>

          <button
            id={`btn-toggle-expand-${node.id}`}
            aria-label={isExpanded ? 'Collapse Diagnostic' : 'Expand Diagnostic'}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40 text-[11px] font-mono-cyber font-bold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span>{isExpanded ? (lang === 'ar' ? 'طي التشخيص' : 'Collapse Diagnostic') : (lang === 'ar' ? 'توسيع التشخيص' : 'Expand Diagnostic')}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quick Node Switcher Pill Bar */}
      {allNodes && allNodes.length > 0 && onSelectNode && (
        <div className="px-4 py-2 bg-[#04070e] border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto select-none">
          <span className="text-[10px] font-mono-cyber text-slate-400 whitespace-nowrap flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'ar' ? 'تبديل العقدة:' : 'Switch Node:'}</span>
          </span>
          <div className="flex items-center gap-1.5 flex-nowrap">
            {allNodes.map(n => {
              const isCurr = n.id === node.id;
              return (
                <button
                  key={n.id}
                  id={`diagnostic-select-node-${n.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectNode(n);
                  }}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono-cyber transition-all cursor-pointer whitespace-nowrap border ${
                    isCurr
                      ? 'bg-cyan-500/30 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_8px_rgba(6,182,212,0.3)]'
                      : n.status === 'ISOLATED'
                      ? 'bg-red-950/50 border-red-800/60 text-red-300 hover:border-red-600'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={`${n.label} (${n.ip})`}
                >
                  <span>{lang === 'ar' ? n.labelAr : n.label}</span>
                  {n.status === 'ISOLATED' && <span className="ml-1 text-[8px] text-red-400 font-bold">!</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Expanded Live Sparklines Diagnostic Grid */}
      {isExpanded && (
        <div className="p-4 space-y-4 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            
            {/* 1. CPU Trend Sparkline Card */}
            <div 
              id={`diagnostic-card-cpu-${node.id}`}
              className="bg-[#03060c] p-3.5 rounded-xl border border-slate-800/90 hover:border-amber-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-display-cyber text-slate-200">
                      {lang === 'ar' ? 'اتجاه استهلاك المعالج' : 'CPU Utilization Trend'}
                    </h5>
                    <span className="text-[9px] font-mono-cyber text-slate-400">
                      {lang === 'ar' ? 'نوى المعالجة وعتاد التشفير' : 'eBPF Kernel Compute Cores'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono-cyber font-bold border ${
                  metrics.isCpuExhausted
                    ? 'bg-red-500/30 text-red-200 border-red-500/50 animate-pulse'
                    : metrics.currentCpu >= 60
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {metrics.isCpuExhausted ? 'EXHAUSTED' : metrics.currentCpu >= 60 ? 'ELEVATED' : 'NOMINAL'}
                </span>
              </div>

              {/* Current Value & Peak Stats */}
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <span className={`text-3xl font-bold font-mono-cyber ${
                    metrics.isCpuExhausted ? 'text-red-400 animate-pulse' : metrics.currentCpu >= 60 ? 'text-amber-300' : 'text-slate-100'
                  }`}>
                    {metrics.currentCpu}%
                  </span>
                  <span className="ml-2 text-[10px] font-mono-cyber text-slate-400">
                    (Avg: {metrics.avgCpu}%)
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono-cyber text-slate-400">
                  <span>Peak 60s: </span>
                  <strong className={metrics.peakCpu >= 80 ? 'text-red-400 font-bold' : 'text-slate-200'}>
                    {metrics.peakCpu}%
                  </strong>
                </div>
              </div>

              {/* Live CPU Sparkline */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>0%</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <MiniSparkline
                    points={metrics.cpuPoints}
                    width={220}
                    height={40}
                    minVal={0}
                    maxVal={100}
                    threshold={80}
                    metricType="cpu"
                    className="w-full max-w-[240px]"
                    interactiveHover={true}
                    unit="%"
                  />
                </div>
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>100%</span>
                </div>
              </div>

              {/* Threshold Note */}
              <div className="mt-2 text-[9px] font-mono-cyber text-slate-400 flex items-center justify-between">
                <span>{lang === 'ar' ? 'عتبة التحذير: 80%' : 'Exhaustion mark: 80%'}</span>
                <span className={metrics.currentCpu >= 80 ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  {metrics.isCpuExhausted ? (lang === 'ar' ? 'تجاوز العتبة الحرجة' : 'Threshold Breach') : (lang === 'ar' ? 'حالة مستقرة' : 'Within Budget')}
                </span>
              </div>
            </div>

            {/* 2. Memory Trend Sparkline Card */}
            <div 
              id={`diagnostic-card-memory-${node.id}`}
              className="bg-[#03060c] p-3.5 rounded-xl border border-slate-800/90 hover:border-purple-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-display-cyber text-slate-200">
                      {lang === 'ar' ? 'اتجاه استهلاك الذاكرة' : 'Memory (RAM) Trend'}
                    </h5>
                    <span className="text-[9px] font-mono-cyber text-slate-400">
                      {lang === 'ar' ? 'ذاكرة الوصول العشوائي ومخازن الحزم' : 'TCAM / Conntrack / Buffer Pools'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono-cyber font-bold border ${
                  isMemoryHigh
                    ? 'bg-red-500/30 text-red-200 border-red-500/50 animate-pulse'
                    : metrics.currentMemory >= 70
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                }`}>
                  {isMemoryHigh ? 'OOM RISK' : metrics.currentMemory >= 70 ? 'PRESSURE' : 'OPTIMAL'}
                </span>
              </div>

              {/* Current Value & Allocation Stats */}
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <span className={`text-3xl font-bold font-mono-cyber ${
                    isMemoryHigh ? 'text-red-400' : metrics.currentMemory >= 70 ? 'text-amber-300' : 'text-purple-300'
                  }`}>
                    {metrics.currentMemory}%
                  </span>
                  <span className="ml-2 text-[10px] font-mono-cyber text-slate-400">
                    ({usedRamGb} / {totalSystemRamGb} GB)
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono-cyber text-slate-400">
                  <span>Peak 60s: </span>
                  <strong className={metrics.peakMemory >= 80 ? 'text-amber-300 font-bold' : 'text-slate-200'}>
                    {metrics.peakMemory}%
                  </strong>
                </div>
              </div>

              {/* Live Memory Sparkline */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>0%</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <MiniSparkline
                    points={metrics.memoryPoints}
                    width={220}
                    height={40}
                    minVal={0}
                    maxVal={100}
                    threshold={80}
                    metricType="memory"
                    className="w-full max-w-[240px]"
                    interactiveHover={true}
                    unit="%"
                  />
                </div>
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>100%</span>
                </div>
              </div>

              {/* Threshold Note */}
              <div className="mt-2 text-[9px] font-mono-cyber text-slate-400 flex items-center justify-between">
                <span>{lang === 'ar' ? 'سقف الذاكرة الآمن: 80%' : 'Safe ceiling: 80%'}</span>
                <span className={isMemoryHigh ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  {isMemoryHigh ? (lang === 'ar' ? 'ضغط عالي على الرام' : 'High Memory Pressure') : (lang === 'ar' ? 'مخزن الحزم متوازن' : 'Pools Balanced')}
                </span>
              </div>
            </div>

            {/* 3. Packet Drop Rate Trend Sparkline Card */}
            <div 
              id={`diagnostic-card-packet-drop-${node.id}`}
              className="bg-[#03060c] p-3.5 rounded-xl border border-slate-800/90 hover:border-rose-500/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-inner"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                    <ShieldAlert className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold font-display-cyber text-slate-200">
                      {lang === 'ar' ? 'اتجاه معدل إسقاط الحزم' : 'Packet Drop Rate Trend'}
                    </h5>
                    <span className="text-[9px] font-mono-cyber text-slate-400">
                      {lang === 'ar' ? 'مرشحات eBPF/XDP وتفريغ الرتل' : 'eBPF/XDP Filtering & Tail Drops'}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono-cyber font-bold border ${
                  node.status === 'ISOLATED'
                    ? 'bg-red-500/30 text-red-200 border-red-500/50'
                    : isDropSpike
                    ? 'bg-rose-500/30 text-rose-200 border-rose-500/50 animate-pulse'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                }`}>
                  {node.status === 'ISOLATED' ? 'QUARANTINE 100%' : isDropSpike ? 'ACTIVE SHEDDING' : 'LINE CLEAR'}
                </span>
              </div>

              {/* Current Value & Drop Stats */}
              <div className="my-3 flex items-baseline justify-between">
                <div>
                  <span className={`text-3xl font-bold font-mono-cyber ${
                    node.status === 'ISOLATED' ? 'text-red-400' : isDropSpike ? 'text-rose-400 animate-pulse' : 'text-emerald-300'
                  }`}>
                    {metrics.currentPacketDropRate}%
                  </span>
                  <span className="ml-2 text-[10px] font-mono-cyber text-slate-400">
                    (Avg: {metrics.avgPacketDropRate}%)
                  </span>
                </div>
                <div className="text-right text-[10px] font-mono-cyber text-slate-400">
                  <span>Peak 60s: </span>
                  <strong className={metrics.peakPacketDropRate >= 5.0 ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                    {metrics.peakPacketDropRate}%
                  </strong>
                </div>
              </div>

              {/* Live Packet Drop Sparkline */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>0%</span>
                </div>
                <div className="flex-1 flex justify-center">
                  <MiniSparkline
                    points={metrics.packetDropPoints}
                    width={220}
                    height={40}
                    minVal={0}
                    maxVal={Math.max(15, metrics.peakPacketDropRate * 1.2)}
                    threshold={5.0}
                    metricType="packet_drop"
                    className="w-full max-w-[240px]"
                    interactiveHover={true}
                    unit="%"
                  />
                </div>
                <div className="text-[9px] font-mono-cyber text-slate-400">
                  <span>{Math.round(Math.max(15, metrics.peakPacketDropRate * 1.2))}%</span>
                </div>
              </div>

              {/* Threshold Note */}
              <div className="mt-2 text-[9px] font-mono-cyber text-slate-400 flex items-center justify-between">
                <span>{lang === 'ar' ? 'حد الإنذار: 5.0%' : 'Drop threshold: 5.0%'}</span>
                <span className="text-slate-400 font-semibold">
                  {droppedEvents.length > 0 
                    ? `${droppedEvents.length} ${lang === 'ar' ? 'حزمة مسقطة في النافذة' : 'dropped in window'}`
                    : (lang === 'ar' ? 'تمرير كامل دون إسقاط' : 'Zero wire drops')}
                </span>
              </div>
            </div>

          </div>

          {/* Diagnostic Context & Quick Operational Actions */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px] font-mono-cyber">
            <div className="flex flex-wrap items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>eBPF XDP Driver: <strong className="text-slate-200">NATIVE_AVX2</strong></span>
              </span>
              <span className="text-slate-600">•</span>
              <span>
                {lang === 'ar' ? 'الحزم المطابقة في النافذة:' : 'Matching Ingress Events:'}{' '}
                <strong className="text-cyan-300">{matchingEvents.length}</strong>
              </span>
              <span className="text-slate-600">•</span>
              <span>
                {lang === 'ar' ? 'حالة العزل (SDN):' : 'SDN Isolation State:'}{' '}
                <strong className={node.status === 'ISOLATED' ? 'text-red-400' : 'text-emerald-400'}>
                  {node.status === 'ISOLATED' ? 'QUARANTINED' : 'ACTIVE_FABRIC'}
                </strong>
              </span>
            </div>

            {onFilterByNodeIp && (
              <button
                id={`btn-filter-diagnostic-${node.id}`}
                onClick={() => onFilterByNodeIp(node.ip)}
                className="px-3 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
              >
                <Filter className="w-3 h-3" />
                <span>{lang === 'ar' ? 'تصفية تدفق السجلات لهذه العقدة' : 'Filter Telemetry for this Node'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

