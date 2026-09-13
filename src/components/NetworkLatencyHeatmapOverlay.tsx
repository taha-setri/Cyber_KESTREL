import React, { useState, useMemo } from 'react';
import { NetworkNode, TelemetryEvent } from '../types/cyber';
import { NodeMetricHistory } from '../services/nodeResourceTelemetry';
import { 
  NetworkSegmentDef, 
  SegmentAggregate, 
  PropagationLink, 
  LatencyNetworkSummary, 
  LatencyHeatmapMode, 
  LatencyMetricType,
  NETWORK_SEGMENTS,
  getLatencyColor,
  getLatencyIntensity,
  calculatePropagationLinks,
  calculateSegmentAggregates,
  calculateNetworkWideLatencyKPIs
} from '../services/networkLatencyModel';
import { 
  Activity, 
  Layers, 
  Globe, 
  Sliders, 
  Flame, 
  Info, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  ArrowRight, 
  Radio, 
  X, 
  AlertTriangle, 
  Zap, 
  Maximize2,
  Table,
  Gauge
} from 'lucide-react';

interface NetworkLatencyHeatmapOverlayProps {
  nodes: NetworkNode[];
  selectedNode: NetworkNode | null;
  onSelectNode: (node: NetworkNode) => void;
  nodeResourceMetrics: Record<string, NodeMetricHistory>;
  telemetryStream: TelemetryEvent[];
  lang: 'ar' | 'en';
  overlayEnabled: boolean;
  onToggleOverlay: (enabled: boolean) => void;
  heatmapMode: LatencyHeatmapMode;
  onChangeMode: (mode: LatencyHeatmapMode) => void;
  metricType: LatencyMetricType;
  onChangeMetricType: (type: LatencyMetricType) => void;
  heatIntensityGain: number;
  onChangeHeatIntensityGain: (gain: number) => void;
  showLinkDelayLabels: boolean;
  onToggleLinkDelayLabels: (show: boolean) => void;
}

/**
 * Canvas renderer function for drawing the Latency Heatmap onto the Tactical Canvas
 * Called inside requestAnimationFrame of TacticalCommandWall
 */
export function drawLatencyHeatmapCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  nodes: NetworkNode[],
  nodeMetrics: Record<string, NodeMetricHistory>,
  links: PropagationLink[],
  segments: SegmentAggregate[],
  mode: LatencyHeatmapMode,
  metricType: LatencyMetricType,
  gain: number,
  showLinkLabels: boolean,
  particleTime: number
) {
  ctx.save();

  // 1. Draw Segment / Geo Bounding Enclosures (Soft Ambient Heat Zones)
  segments.forEach(segAgg => {
    const seg = segAgg.segment;
    const segNodes = nodes.filter(n => seg.nodeIds.includes(n.id));
    if (segNodes.length === 0) return;

    // Calculate bounding box for segment
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    segNodes.forEach(n => {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x);
      maxY = Math.max(maxY, n.y);
    });

    const pad = 38 * gain;
    const boxX = Math.max(8, minX - pad);
    const boxY = Math.max(8, minY - pad);
    const boxW = Math.min(width - 16, maxX - minX + pad * 2);
    const boxH = Math.min(height - 16, maxY - minY + pad * 2);
    const radius = 18;

    // Soft glowing segment background
    const segColor = getLatencyColor(segAgg.avgLatencyMs, 0.07 * gain);
    const segBorderColor = getLatencyColor(segAgg.avgLatencyMs, 0.28 * gain);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(boxX, boxY, boxW, boxH, radius);
    ctx.fillStyle = segColor;
    ctx.fill();

    ctx.lineWidth = 1.2;
    ctx.strokeStyle = segBorderColor;
    ctx.setLineDash([4, 4]);
    ctx.stroke();
    ctx.restore();
  });

  // 2. Draw Multi-Ring Radial Gaussian Heat Halo around each node
  nodes.forEach(node => {
    const metrics = nodeMetrics[node.id];
    const latency = metrics?.currentLatency ?? 3.2;
    const intensity = getLatencyIntensity(latency);
    
    // Scale halo radius with latency and user intensity gain
    const baseRadius = (35 + intensity * 65) * gain;

    // Radial gradient: bright hot core -> soft falloff -> transparent
    const radialGrad = ctx.createRadialGradient(
      node.x, node.y, 4,
      node.x, node.y, baseRadius
    );

    const coreColor = getLatencyColor(latency, 0.55 * gain);
    const midColor = getLatencyColor(latency, 0.22 * gain);
    const edgeColor = getLatencyColor(latency, 0.0);

    radialGrad.addColorStop(0, coreColor);
    radialGrad.addColorStop(0.45, midColor);
    radialGrad.addColorStop(1, edgeColor);

    ctx.save();
    ctx.beginPath();
    ctx.arc(node.x, node.y, baseRadius, 0, Math.PI * 2);
    ctx.fillStyle = radialGrad;
    ctx.fill();

    // Concentric propagating pulse wave (represents RTT ping radiating outward)
    if (latency > 15 || node.status === 'TARGETED') {
      const wavePhase = ((particleTime * 0.04) % 1);
      const waveRadius = 15 + wavePhase * (baseRadius * 0.9);
      const waveAlpha = (1 - wavePhase) * (latency > 40 ? 0.8 : 0.4);

      ctx.beginPath();
      ctx.arc(node.x, node.y, waveRadius, 0, Math.PI * 2);
      ctx.strokeStyle = getLatencyColor(latency, waveAlpha);
      ctx.lineWidth = latency > 40 ? 2 : 1;
      ctx.stroke();
    }
    ctx.restore();
  });

  // 3. Draw Latency Heatmap Inter-Node Links with Colored Propagation Gradients
  links.forEach(link => {
    const src = link.sourceNode;
    const dst = link.targetNode;
    const isIsolated = src.status === 'ISOLATED' || dst.status === 'ISOLATED';

    ctx.save();
    // Create linear gradient along the link reflecting both nodes' latencies
    const linkGrad = ctx.createLinearGradient(src.x, src.y, dst.x, dst.y);
    const srcLat = nodeMetrics[src.id]?.currentLatency || 3.0;
    const dstLat = nodeMetrics[dst.id]?.currentLatency || 3.0;

    linkGrad.addColorStop(0, getLatencyColor(srcLat, isIsolated ? 0.2 : 0.85));
    linkGrad.addColorStop(1, getLatencyColor(dstLat, isIsolated ? 0.2 : 0.85));

    ctx.beginPath();
    ctx.moveTo(src.x, src.y);
    ctx.lineTo(dst.x, dst.y);

    if (isIsolated) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
      ctx.lineWidth = 1;
      ctx.setLineDash([3, 3]);
    } else if (link.isBottleneck) {
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.lineWidth = 3.5;
      ctx.setLineDash([8, 4]);
    } else if (link.status === 'ELEVATED') {
      ctx.strokeStyle = linkGrad;
      ctx.lineWidth = 2.2;
      ctx.setLineDash([]);
    } else {
      ctx.strokeStyle = linkGrad;
      ctx.lineWidth = 1.6;
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.restore();

    // Animated Propagation Packet Markers modulated by link propagation delay
    if (!isIsolated) {
      const dx = dst.x - src.x;
      const dy = dst.y - src.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const packetCount = Math.max(1, Math.floor(dist / 80));

      // Propagation speed: lower latency = faster transit; high latency = slow/sluggish
      const speedFactor = Math.max(0.2, Math.min(2.5, 35 / (link.rttMs + 8)));

      for (let i = 0; i < packetCount; i++) {
        const offset = ((particleTime * speedFactor * 0.015) + (i / packetCount)) % 1;
        const px = src.x + dx * offset;
        const py = src.y + dy * offset;

        ctx.save();
        ctx.beginPath();
        const pRadius = link.isBottleneck ? 3.5 : 2.5;
        ctx.arc(px, py, pRadius, 0, Math.PI * 2);
        ctx.fillStyle = link.color;
        ctx.shadowColor = link.color;
        ctx.shadowBlur = link.isBottleneck ? 10 : 5;
        ctx.fill();
        ctx.restore();
      }
    }

    // 4. Link Propagation Delay Badges (Hop Delay Labels)
    if (showLinkLabels && !isIsolated) {
      const midX = (src.x + dst.x) / 2;
      const midY = (src.y + dst.y) / 2;

      ctx.save();
      const labelText = `${link.rttMs}ms`;
      ctx.font = 'bold 9px "JetBrains Mono", monospace';
      const textWidth = ctx.measureText(labelText).width;
      const padX = 4;
      const badgeW = textWidth + padX * 2;
      const badgeH = 14;

      // Label background pill
      ctx.fillStyle = link.isBottleneck 
        ? 'rgba(153, 27, 27, 0.92)' 
        : link.status === 'ELEVATED' 
        ? 'rgba(120, 53, 15, 0.9)' 
        : 'rgba(9, 13, 22, 0.88)';
      ctx.strokeStyle = getLatencyColor(link.rttMs, 0.8);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(midX - badgeW / 2, midY - badgeH / 2, badgeW, badgeH, 4);
      ctx.fill();
      ctx.stroke();

      // Label text
      ctx.fillStyle = link.isBottleneck ? '#fecaca' : link.status === 'ELEVATED' ? '#fde68a' : '#a5f3fc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(labelText, midX, midY + 0.5);
      ctx.restore();
    }
  });

  ctx.restore();
}

export const NetworkLatencyHeatmapOverlay: React.FC<NetworkLatencyHeatmapOverlayProps> = ({
  nodes,
  selectedNode,
  onSelectNode,
  nodeResourceMetrics,
  telemetryStream,
  lang,
  overlayEnabled,
  onToggleOverlay,
  heatmapMode,
  onChangeMode,
  metricType,
  onChangeMetricType,
  heatIntensityGain,
  onChangeHeatIntensityGain,
  showLinkDelayLabels,
  onToggleLinkDelayLabels
}) => {
  const [isMatrixModalOpen, setIsMatrixModalOpen] = useState(false);
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);

  // Compute live propagation links & segment aggregates
  const propagationLinks = useMemo(() => {
    return calculatePropagationLinks(nodes, nodeResourceMetrics, telemetryStream.slice(0, 20));
  }, [nodes, nodeResourceMetrics, telemetryStream]);

  const segmentAggregates = useMemo(() => {
    return calculateSegmentAggregates(nodes, nodeResourceMetrics);
  }, [nodes, nodeResourceMetrics]);

  const networkSummary: LatencyNetworkSummary = useMemo(() => {
    return calculateNetworkWideLatencyKPIs(propagationLinks, segmentAggregates, 0.38);
  }, [propagationLinks, segmentAggregates]);

  return (
    <div className="space-y-3">
      {/* Top Heatmap Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 p-2.5 rounded-lg border border-slate-800 bg-[#060911]/90 backdrop-blur-md">
        
        {/* Left: Master Toggle and Active Status */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="toggle-latency-heatmap-btn"
            onClick={() => onToggleOverlay(!overlayEnabled)}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono-cyber font-bold flex items-center gap-2 transition-all cursor-pointer ${
              overlayEnabled
                ? 'bg-gradient-to-r from-amber-500/30 to-rose-500/30 border border-amber-400 text-amber-200 shadow-[0_0_15px_rgba(245,158,11,0.35)]'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
            title={overlayEnabled 
              ? (lang === 'ar' ? 'إيقاف طبقة خريطة حرارة زمن استجابة الشبكة' : 'Disable Network Latency Heatmap Overlay') 
              : (lang === 'ar' ? 'تفعيل طبقة خريطة حرارة زمن استجابة الشبكة' : 'Enable Network Latency Heatmap Overlay')}
          >
            <Flame className={`w-3.5 h-3.5 ${overlayEnabled ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
            <span>
              {lang === 'ar' ? 'طبقة حرارة زمن الاستجابة' : 'Latency Heatmap Overlay'}
            </span>
            <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
              overlayEnabled ? 'bg-amber-400 text-black' : 'bg-slate-800 text-slate-400'
            }`}>
              {overlayEnabled ? (lang === 'ar' ? 'نشط' : 'ON') : (lang === 'ar' ? 'معطل' : 'OFF')}
            </span>
          </button>

          {/* Mode Switcher: Segment-Based vs Geographical */}
          {overlayEnabled && (
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono-cyber">
              <button
                onClick={() => onChangeMode('SEGMENT_BASED')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  heatmapMode === 'SEGMENT_BASED'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={lang === 'ar' ? 'تجميع حسب الشرائح الأمنية والوظيفية' : 'Group by security & functional segments'}
              >
                <Layers className="w-3 h-3 text-cyan-400" />
                <span>{lang === 'ar' ? 'شرائح الشبكة' : 'Segment-Based'}</span>
              </button>

              <button
                onClick={() => onChangeMode('GEOGRAPHICAL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1.5 ${
                  heatmapMode === 'GEOGRAPHICAL'
                    ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={lang === 'ar' ? 'عرض التأخيرات الجغرافية والمسافات البصرية' : 'View geographical WAN delays & optical distances'}
              >
                <Globe className="w-3 h-3 text-purple-400" />
                <span>{lang === 'ar' ? 'توزيع جغرافي' : 'Geographical'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Controls: Metric Type, Gain & Matrix Drawer */}
        <div className="flex items-center gap-2 flex-wrap">
          {overlayEnabled && (
            <>
              {/* Metric Type Selector */}
              <div className="flex items-center gap-1 text-[11px] font-mono-cyber">
                <span className="text-slate-500 hidden sm:inline text-[10px]">
                  {lang === 'ar' ? 'المقياس:' : 'Metric:'}
                </span>
                <select
                  value={metricType}
                  onChange={(e) => onChangeMetricType(e.target.value as LatencyMetricType)}
                  className="bg-slate-950 border border-slate-800 rounded-md px-2 py-1 text-xs text-cyan-300 font-mono-cyber focus:outline-none focus:border-cyan-500 cursor-pointer"
                >
                  <option value="RTT_PROPAGATION">RTT Delay (ms)</option>
                  <option value="QUEUE_BUFFERBLOAT">Bufferbloat & Queue</option>
                  <option value="JITTER_VARIANCE">Jitter Variance (σ)</option>
                </select>
              </div>

              {/* Hop Labels Toggle */}
              <button
                onClick={() => onToggleLinkDelayLabels(!showLinkDelayLabels)}
                className={`px-2 py-1 rounded text-[10px] font-mono-cyber border cursor-pointer transition-colors ${
                  showLinkDelayLabels
                    ? 'bg-cyan-950/60 border-cyan-500/50 text-cyan-300 font-bold'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
                title={lang === 'ar' ? 'إظهار/إخفاء أرقام التأخير على الوصلات' : 'Toggle hop delay values on links'}
              >
                {lang === 'ar' ? 'أرقام الوصلات' : 'Hop Labels'}
              </button>

              {/* Intensity Gain Slider */}
              <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded border border-slate-800 text-[10px] font-mono-cyber">
                <span className="text-slate-400">{lang === 'ar' ? 'الوهج:' : 'Gain:'}</span>
                {[0.75, 1.0, 1.5].map((g) => (
                  <button
                    key={g}
                    onClick={() => onChangeHeatIntensityGain(g)}
                    className={`px-1.5 py-0.5 rounded cursor-pointer ${
                      heatIntensityGain === g
                        ? 'bg-amber-500/30 text-amber-300 font-bold border border-amber-500/50'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {g}x
                  </button>
                ))}
              </div>

              {/* Pairwise Matrix Modal Trigger */}
              <button
                onClick={() => setIsMatrixModalOpen(true)}
                className="px-2.5 py-1 rounded-md bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 text-[11px] font-mono-cyber font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title={lang === 'ar' ? 'فتح مصفوفة تأخير انتشار الحزم بين الشرائح' : 'Open Segment-to-Segment Propagation Delay Matrix'}
              >
                <Table className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'مصفوفة التأخير' : 'Delay Matrix'}</span>
              </button>
            </>
          )}

          {/* Collapsible Details Toggle */}
          <button
            onClick={() => setIsDetailsExpanded(!isDetailsExpanded)}
            className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 cursor-pointer"
            title={isDetailsExpanded ? 'Collapse latency stats' : 'Expand latency stats'}
          >
            {isDetailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>

      </div>

      {/* Latency Network KPI Summary Strip & Color Scale Bar */}
      {overlayEnabled && (
        <div className="p-2.5 rounded-lg border border-slate-800/90 bg-[#080d19]/90 text-xs font-mono-cyber space-y-2">
          
          {/* Real-Time KPIs Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'متوسط التأخير (Mean RTT)' : 'Mean RTT'}</span>
              <span className="text-sm font-bold text-cyan-300 flex items-baseline gap-1 mt-0.5">
                {networkSummary.meanRttMs} <span className="text-[10px] text-slate-400 font-normal">ms</span>
              </span>
            </div>

            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'أقصى تأخير (Peak Delay)' : 'Peak Node Delay'}</span>
              <span className={`text-sm font-bold flex items-baseline gap-1 mt-0.5 ${
                networkSummary.peakRttMs > 40 ? 'text-rose-400 animate-pulse' : 'text-amber-300'
              }`}>
                {networkSummary.peakRttMs} <span className="text-[10px] text-slate-400 font-normal">ms</span>
              </span>
            </div>

            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'تذبذب الشبكة (Jitter σ)' : 'Jitter Variance'}</span>
              <span className="text-sm font-bold text-slate-200 flex items-baseline gap-1 mt-0.5">
                ±{networkSummary.avgJitterMs} <span className="text-[10px] text-slate-400 font-normal">ms</span>
              </span>
            </div>

            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'كفاءة الانتشار السلكي' : 'Propagation Efficiency'}</span>
              <span className="text-sm font-bold text-emerald-400 flex items-baseline gap-1 mt-0.5">
                {networkSummary.globalPropagationEfficiency}%
              </span>
            </div>

            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'نقاط الاختناق النشطة' : 'Active Hotspots'}</span>
              <span className={`text-sm font-bold flex items-baseline gap-1 mt-0.5 ${
                networkSummary.totalHotspots > 0 ? 'text-amber-400 font-bold' : 'text-slate-300'
              }`}>
                {networkSummary.totalHotspots} {lang === 'ar' ? 'روابط' : 'Links'}
              </span>
            </div>

            <div className="p-2 rounded bg-[#03060c] border border-slate-800 flex flex-col justify-between">
              <span className="text-[10px] text-slate-500 uppercase">{lang === 'ar' ? 'عبور نواة eBPF الخاطف' : 'eBPF Kernel Transit'}</span>
              <span className="text-sm font-bold text-emerald-300 flex items-baseline gap-1 mt-0.5">
                0.38 <span className="text-[10px] text-slate-400 font-normal">ms</span>
              </span>
            </div>
          </div>

          {/* Color-Coded Intensity Mapping Legend Bar */}
          <div className="pt-1.5 border-t border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[10px]">
            <div className="flex items-center gap-1.5 text-slate-400">
              <Flame className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="font-bold">{lang === 'ar' ? 'مقياس شدة التأخير الحراري (Propagation Delay Scale):' : 'Heat Intensity Scale:'}</span>
            </div>

            {/* Gradient Bar with Threshold Stops */}
            <div className="flex-1 max-w-xl flex items-center gap-1 w-full">
              <div className="flex-1 h-3 rounded-full overflow-hidden bg-gradient-to-r from-emerald-500 via-cyan-500 via-blue-500 via-amber-500 to-rose-600 shadow-inner" />
            </div>

            {/* Discrete Color Stop Indicators */}
            <div className="flex items-center gap-3 text-[9px] font-mono-cyber">
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]" />
                &lt; 5ms {lang === 'ar' ? '(ألياف مثالية)' : '(Fiber)'}
              </span>
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                5-15ms {lang === 'ar' ? '(محول)' : '(LAN)'}
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                15-40ms {lang === 'ar' ? '(تأخير شبكة)' : '(WAN)'}
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)] animate-pulse" />
                &gt; 40ms {lang === 'ar' ? '(احتقان / هجوم)' : '(Congestion)'}
              </span>
            </div>
          </div>

        </div>
      )}

      {/* Expanded Segment Delay Status Cards */}
      {overlayEnabled && isDetailsExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1 animate-in fade-in duration-200">
          {segmentAggregates.map(segAgg => {
            const seg = segAgg.segment;
            const isCongested = segAgg.status === 'CONGESTED';
            const isElevated = segAgg.status === 'ELEVATED';

            return (
              <div 
                key={seg.id}
                className={`p-3 rounded-xl border transition-all text-xs font-mono-cyber flex flex-col justify-between ${
                  isCongested 
                    ? 'border-rose-500/50 bg-rose-950/20 text-rose-200 shadow-[0_0_12px_rgba(239,68,68,0.2)]'
                    : isElevated
                    ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
                    : 'border-slate-800 bg-[#060a14] text-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span 
                        className="w-2.5 h-2.5 rounded-full" 
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="font-bold font-display-cyber text-slate-100">
                        {lang === 'ar' ? seg.nameAr : seg.name}
                      </span>
                    </div>

                    <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                      isCongested 
                        ? 'bg-rose-500/30 text-rose-300 border border-rose-500/50 animate-pulse'
                        : isElevated 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {segAgg.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                    <span className="truncate">{lang === 'ar' ? seg.geoRegionAr : seg.geoRegion}</span>
                  </div>

                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'ar' ? seg.descriptionAr : seg.description}
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase">{lang === 'ar' ? 'متوسط التأخير' : 'Avg RTT'}</span>
                    <span className={`font-bold ${isCongested ? 'text-rose-400' : 'text-slate-100'}`}>
                      {segAgg.avgLatencyMs} ms
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase">{lang === 'ar' ? 'الذروة' : 'Peak'}</span>
                    <span className="text-slate-200 font-bold">
                      {segAgg.peakLatencyMs} ms
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 text-[9px] block uppercase">{lang === 'ar' ? 'مسافة الألياف' : 'Fiber Dist'}</span>
                    <span className="text-cyan-300 font-bold">
                      {seg.approxDistanceKm} km
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pairwise Segment Propagation Delay Matrix Modal */}
      {isMatrixModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsMatrixModalOpen(false)}
        >
          <div 
            className="bg-[#080d1a] border border-cyan-500/40 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-200 font-mono-cyber text-xs"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3.5 border-b border-slate-800 bg-[#0a1122] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table className="w-4 h-4 text-cyan-400" />
                <div>
                  <h3 className="font-bold text-sm text-slate-100 font-display-cyber flex items-center gap-2">
                    <span>{lang === 'ar' ? 'مصفوفة تأخير انتشار الحزم بين شرائح الشبكة' : 'CROSS-SEGMENT PACKET PROPAGATION DELAY MATRIX'}</span>
                    <span className="text-xs text-cyan-400 font-mono-cyber">(RTT &amp; Transit Mesh)</span>
                  </h3>
                  <p className="text-[10px] text-slate-400">
                    {lang === 'ar' 
                      ? 'حساب رياضي لحظي لزمن انتقال الحزم السلكية، تأخير الألياف الضوئية، واحتقان رتل النواة' 
                      : 'Live mathematical breakdown of wire propagation delays, fiber time-of-flight, and queue depth.'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-100 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: Pairwise Delay Matrix Table */}
            <div className="p-4 overflow-y-auto space-y-4">
              
              <div className="overflow-x-auto rounded-lg border border-slate-800 bg-[#04070f]">
                <table className="w-full text-left border-collapse text-[11px] font-mono-cyber">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400">
                      <th className="p-2.5">{lang === 'ar' ? 'الشريحة المصدر / الهدف' : 'Segment Origin \\ Target'}</th>
                      {NETWORK_SEGMENTS.map(s => (
                        <th key={s.id} className="p-2.5 text-center whitespace-nowrap">
                          {s.shortLabel}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {NETWORK_SEGMENTS.map((rowSeg, rIdx) => (
                      <tr key={rowSeg.id} className="border-b border-slate-800/60 hover:bg-slate-900/40 transition-colors">
                        <td className="p-2.5 font-bold flex items-center gap-2 text-slate-200 whitespace-nowrap">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: rowSeg.color }} />
                          <span>{lang === 'ar' ? rowSeg.nameAr : rowSeg.name}</span>
                        </td>

                        {NETWORK_SEGMENTS.map((colSeg, cIdx) => {
                          if (rIdx === cIdx) {
                            // Intra-segment latency
                            return (
                              <td key={colSeg.id} className="p-2.5 text-center text-slate-500 font-bold bg-slate-950/60">
                                0.4 ms
                              </td>
                            );
                          }

                          // Look for propagation link between these segments
                          const matchingLink = propagationLinks.find(l => {
                            const s1 = NETWORK_SEGMENTS.find(s => s.nodeIds.includes(l.sourceId));
                            const s2 = NETWORK_SEGMENTS.find(s => s.nodeIds.includes(l.targetId));
                            return (s1?.id === rowSeg.id && s2?.id === colSeg.id) || (s1?.id === colSeg.id && s2?.id === rowSeg.id);
                          });

                          const delay = matchingLink 
                            ? matchingLink.rttMs 
                            : parseFloat((Math.abs(rowSeg.nominalFiberDelayMs - colSeg.nominalFiberDelayMs) + 4.2).toFixed(1));

                          const isHigh = delay > 35;
                          const isMed = delay > 15;

                          return (
                            <td key={colSeg.id} className="p-2.5 text-center">
                              <span className={`px-2 py-0.5 rounded font-bold inline-block ${
                                isHigh 
                                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                                  : isMed
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              }`}>
                                {delay} ms
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Hop-by-Hop Propagation Path Diagnostics */}
              <div className="p-3 rounded-lg bg-[#04070f] border border-slate-800 space-y-2">
                <h4 className="font-bold text-slate-300 text-xs flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'مسار حزمة نموذجي عبر البنية التحتية (End-to-End Hop Trace)' : 'Synthetic Packet Propagation Hop-by-Hop Breakdown'}</span>
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[10px]">
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Hop 1: Ingress WAN</span>
                    <span className="font-bold text-cyan-300">198.51.100.12</span>
                    <div className="mt-1 text-slate-400">t_prop: 31.0ms</div>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Hop 2: eBPF Router</span>
                    <span className="font-bold text-emerald-300">10.0.0.1</span>
                    <div className="mt-1 text-slate-400">t_ebpf: 0.38ms</div>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Hop 3: Zero-Trust PEP</span>
                    <span className="font-bold text-amber-300">10.0.1.1</span>
                    <div className="mt-1 text-slate-400">t_dpi: 1.2ms</div>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Hop 4: SDN Core</span>
                    <span className="font-bold text-indigo-300">10.0.2.1</span>
                    <div className="mt-1 text-slate-400">t_switch: 0.15ms</div>
                  </div>

                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                    <span className="text-slate-500 block">Hop 5: Mission DB Tier</span>
                    <span className="font-bold text-pink-300">10.0.4.5</span>
                    <div className="mt-1 text-slate-400">t_service: 2.1ms</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-[#0a1122] flex items-center justify-between">
              <span className="text-[10px] text-slate-400">
                {lang === 'ar' ? 'القيم تُحدّث لحظياً كل 1.8 ثانية بناءً على تدفق حركة الشبكة' : 'Values update continuously every 1.8s based on wire telemetry flow'}
              </span>
              <button
                onClick={() => setIsMatrixModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer transition-colors"
              >
                {lang === 'ar' ? 'إغلاق المصفوفة' : 'Close Matrix'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
