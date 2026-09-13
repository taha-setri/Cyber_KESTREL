import React, { useState, useId } from 'react';

interface MiniSparklineProps {
  points: number[];
  width?: number;
  height?: number;
  minVal?: number;
  maxVal?: number;
  threshold?: number;
  metricType?: 'cpu' | 'memory' | 'packet_drop' | 'latency' | 'entropy' | 'custom';
  colorOverride?: string;
  className?: string;
  showHeadDot?: boolean;
  interactiveHover?: boolean;
  unit?: string;
}

export const MiniSparkline: React.FC<MiniSparklineProps> = ({
  points,
  width = 72,
  height = 20,
  minVal,
  maxVal,
  threshold,
  metricType = 'custom',
  colorOverride,
  className = '',
  showHeadDot = true,
  interactiveHover = true,
  unit
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const reactId = useId();
  const gradId = `spark-grad-${metricType}-${reactId.replace(/[^a-zA-Z0-9]/g, '')}`;

  if (!points || points.length < 2) {
    return (
      <div 
        style={{ width, height }} 
        className={`flex items-center justify-center bg-slate-900/60 rounded border border-slate-800 text-[8px] font-mono-cyber text-slate-500 ${className}`}
      >
        --
      </div>
    );
  }

  const latestVal = points[points.length - 1];
  const activeVal = hoverIdx !== null && hoverIdx >= 0 && hoverIdx < points.length ? points[hoverIdx] : latestVal;

  // Derive min/max if not explicitly supplied
  const effectiveMin = minVal !== undefined ? minVal : 0;
  let effectiveMax = maxVal !== undefined ? maxVal : 100;
  if (metricType === 'latency' && maxVal === undefined) {
    effectiveMax = Math.max(80, Math.max(...points) * 1.15);
  } else if (metricType === 'entropy' && maxVal === undefined) {
    effectiveMax = 8.0;
  } else if (metricType === 'packet_drop' && maxVal === undefined) {
    effectiveMax = Math.max(15, Math.max(...points) * 1.25);
  }

  const range = (effectiveMax - effectiveMin) || 1;
  const effectiveThreshold = threshold !== undefined 
    ? threshold 
    : metricType === 'cpu' 
      ? 80 
      : metricType === 'memory'
        ? 80
        : metricType === 'packet_drop'
          ? 5
          : metricType === 'latency' 
            ? 45 
            : 6.45;

  const isExhausted = activeVal >= effectiveThreshold;

  // Determine color based on metric semantics
  let strokeColor = '#06b6d4'; // default cyan
  let gradColor = '#06b6d4';
  let stopOpacity = 0.25;

  if (colorOverride) {
    strokeColor = colorOverride;
    gradColor = colorOverride;
  } else if (metricType === 'cpu') {
    if (activeVal >= 80) {
      strokeColor = '#ef4444'; // Red: CPU Exhaustion
      gradColor = '#ef4444';
      stopOpacity = 0.45;
    } else if (activeVal >= 60) {
      strokeColor = '#f59e0b'; // Amber: High load
      gradColor = '#f59e0b';
      stopOpacity = 0.35;
    } else {
      strokeColor = '#10b981'; // Emerald: Healthy
      gradColor = '#10b981';
      stopOpacity = 0.25;
    }
  } else if (metricType === 'memory') {
    if (activeVal >= 85) {
      strokeColor = '#ef4444'; // Red: Memory Saturation / OOM
      gradColor = '#ef4444';
      stopOpacity = 0.45;
    } else if (activeVal >= 70) {
      strokeColor = '#f59e0b'; // Amber: Elevated buffer usage
      gradColor = '#f59e0b';
      stopOpacity = 0.35;
    } else {
      strokeColor = '#a855f7'; // Purple: Nominal memory allocation
      gradColor = '#a855f7';
      stopOpacity = 0.25;
    }
  } else if (metricType === 'packet_drop') {
    if (activeVal >= 15) {
      strokeColor = '#ef4444'; // Red: Severe packet drop rate / eBPF-XDP drop active
      gradColor = '#ef4444';
      stopOpacity = 0.45;
    } else if (activeVal >= 3) {
      strokeColor = '#f59e0b'; // Amber: Moderate packet shedding
      gradColor = '#f59e0b';
      stopOpacity = 0.35;
    } else {
      strokeColor = '#10b981'; // Emerald: Nominal wire delivery (<3% drops)
      gradColor = '#10b981';
      stopOpacity = 0.25;
    }
  } else if (metricType === 'latency') {
    if (activeVal >= 45) {
      strokeColor = '#f43f5e'; // Rose-Red: Latency Spike / Queue Bloat
      gradColor = '#f43f5e';
      stopOpacity = 0.45;
    } else if (activeVal >= 20) {
      strokeColor = '#eab308'; // Yellow: Elevated jitter
      gradColor = '#eab308';
      stopOpacity = 0.35;
    } else {
      strokeColor = '#06b6d4'; // Cyan: Ultra-low SDN latency
      gradColor = '#06b6d4';
      stopOpacity = 0.25;
    }
  } else if (metricType === 'entropy') {
    if (isExhausted) {
      strokeColor = '#ef4444';
      gradColor = '#ef4444';
      stopOpacity = 0.45;
    } else if (activeVal >= 5.5) {
      strokeColor = '#f59e0b';
      gradColor = '#f59e0b';
      stopOpacity = 0.35;
    } else {
      strokeColor = '#10b981';
      gradColor = '#10b981';
      stopOpacity = 0.25;
    }
  }

  // Calculate coordinates
  const stepX = width / (points.length - 1);
  const coords = points.map((val, idx) => {
    const clamped = Math.max(effectiveMin, Math.min(effectiveMax, val));
    const x = idx * stepX;
    const y = height - ((clamped - effectiveMin) / range) * (height - 4) - 2;
    return { x: parseFloat(x.toFixed(1)), y: parseFloat(y.toFixed(1)) };
  });

  const pathD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${pathD} L ${width} ${height} L 0 ${height} Z`;

  // Threshold reference line Y
  const thresholdY = height - ((effectiveThreshold - effectiveMin) / range) * (height - 4) - 2;
  const lastPoint = coords[coords.length - 1];
  const activePoint = hoverIdx !== null && hoverIdx >= 0 && hoverIdx < coords.length ? coords[hoverIdx] : lastPoint;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!interactiveHover) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = Math.max(0, Math.min(width, (e.clientX - rect.left) * (width / rect.width)));
    const idx = Math.round(relX / stepX);
    if (idx >= 0 && idx < points.length) {
      setHoverIdx(idx);
    }
  };

  const handleMouseLeave = () => {
    setHoverIdx(null);
  };

  const unitSuffix = unit || (metricType === 'cpu' || metricType === 'memory' || metricType === 'packet_drop' ? '%' : metricType === 'latency' ? 'ms' : metricType === 'entropy' ? ' b/B' : '');

  return (
    <div 
      className={`relative inline-flex items-center group ${className}`}
      onMouseLeave={handleMouseLeave}
    >
      <svg 
        width={width} 
        height={height} 
        viewBox={`0 0 ${width} ${height}`} 
        className="overflow-visible select-none cursor-crosshair"
        onMouseMove={handleMouseMove}
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradColor} stopOpacity={stopOpacity} />
            <stop offset="100%" stopColor={gradColor} stopOpacity={0.0} />
          </linearGradient>
        </defs>

        {/* Warning / Threshold subtle dashed line */}
        {thresholdY >= 0 && thresholdY <= height && (
          <line 
            x1="0" 
            y1={thresholdY} 
            x2={width} 
            y2={thresholdY} 
            stroke={metricType === 'cpu' || metricType === 'memory' ? '#ef4444' : '#f43f5e'} 
            strokeWidth="0.6" 
            strokeDasharray="2 2" 
            strokeOpacity="0.35" 
          />
        )}

        {/* Shaded Area Fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Core Trend Stroke */}
        <path 
          d={pathD} 
          fill="none" 
          stroke={strokeColor} 
          strokeWidth={isExhausted ? '1.5' : '1.1'} 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Real-time Head Tracker Dot or Hover Scrubber */}
        {showHeadDot && activePoint && (
          <g>
            {isExhausted && (
              <circle 
                cx={activePoint.x} 
                cy={activePoint.y} 
                r="3.5" 
                fill={strokeColor} 
                opacity="0.6" 
                className="animate-ping" 
              />
            )}
            <circle 
              cx={activePoint.x} 
              cy={activePoint.y} 
              r={hoverIdx !== null ? '2.5' : isExhausted ? '2' : '1.5'} 
              fill={hoverIdx !== null ? '#ffffff' : strokeColor} 
              stroke="#070b13" 
              strokeWidth="0.8" 
            />
          </g>
        )}
      </svg>

      {/* Floating Hover Value Tooltip */}
      {hoverIdx !== null && (
        <div 
          className="absolute -top-7 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 rounded bg-slate-900/95 border border-cyan-500/50 text-[9px] font-mono-cyber font-bold shadow-lg pointer-events-none whitespace-nowrap text-cyan-200"
        >
          {activeVal}{unitSuffix}
          <span className="text-[7px] text-slate-400 ml-1">
            (T-{(points.length - 1 - hoverIdx) * 2}s)
          </span>
        </div>
      )}
    </div>
  );
};
