import React, { useState, useMemo } from 'react';
import { TelemetryEvent, ThreatVector } from '../types/cyber';
import { 
  Globe, 
  Layers, 
  Flame, 
  ShieldAlert, 
  Server, 
  Database, 
  Radio, 
  Activity, 
  Key, 
  Archive, 
  Shield, 
  SlidersHorizontal,
  TrendingUp,
  X,
  Crosshair,
  Target,
  Navigation,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  MapPin,
  Compass
} from 'lucide-react';

export type HeatmapMode = 'COORDINATE_MAP' | 'SEGMENTS';

interface ThreatDensityHeatmapProps {
  telemetryStream: TelemetryEvent[];
  activeThreats: ThreatVector[];
  lang: 'ar' | 'en';
  onSelectFilter: (query: string, type?: 'ip' | 'search') => void;
  activeSearchQuery?: string;
  activeSourceIp?: string;
}

export interface ThreatCoordinatePoint {
  threat: ThreatVector;
  lat: number;
  lon: number;
  x: number;
  y: number;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  regionCode: string;
  heatRadius: number;
  intensityScore: number;
}

// Convert geographic coordinates (Lat, Lon) to canvas/SVG (x, y) coordinates
// Standard Equirectangular Projection for width=800, height=380
export function latLonToXY(lat: number, lon: number, width: number = 800, height: number = 380): { x: number; y: number } {
  const clampedLat = Math.max(-80, Math.min(80, lat));
  const clampedLon = Math.max(-180, Math.min(180, lon));

  const x = ((clampedLon + 180) / 360) * width;
  const y = ((90 - clampedLat) / 180) * height;

  return { 
    x: parseFloat(x.toFixed(1)), 
    y: parseFloat(y.toFixed(1)) 
  };
}

// Deterministically resolve IP address to physical geographic coordinates & tactical region
export function resolveIpToCoordinates(sourceIp: string): {
  lat: number;
  lon: number;
  city: string;
  cityAr: string;
  country: string;
  countryAr: string;
  regionCode: string;
  flag: string;
} {
  const cleanIp = sourceIp.split('/')[0].trim();
  const parts = cleanIp.split('.').map(Number);
  const o1 = parts[0] || 0;
  const o2 = parts[1] || 0;
  const o3 = parts[2] || 0;

  // Specific canonical initial threats
  if (cleanIp.startsWith('194.26.29')) {
    return {
      lat: 55.75,
      lon: 37.61,
      city: 'Moscow Region',
      cityAr: 'إقليم موسكو وأوراسيا',
      country: 'Eurasia / Eastern Europe',
      countryAr: 'أوراسيا / أوروبا الشرقية',
      regionCode: 'EEU',
      flag: '🛰️'
    };
  }

  if (cleanIp.startsWith('185.191.171')) {
    return {
      lat: 25.20,
      lon: 55.27,
      city: 'Gulf Ingress / Dubai',
      cityAr: 'ساحل الخليج / دبي',
      country: 'Middle East & GCC (MENA)',
      countryAr: 'الشرق الأوسط والخليج العربي',
      regionCode: 'MENA',
      flag: '🌐'
    };
  }

  if (cleanIp.startsWith('10.0.3')) {
    return {
      lat: 24.71,
      lon: 46.67,
      city: 'Local Mesh / App Node 01',
      cityAr: 'النسيج المحلي / عقدة التطبيقات 01',
      country: 'Internal Fabric (RFC1918)',
      countryAr: 'الشبكة الداخلية المحمية (RFC1918)',
      regionCode: 'LAN',
      flag: '🛡️'
    };
  }

  // RFC1918 Internal Private
  if (o1 === 10 || (o1 === 172 && o2 >= 16 && o2 <= 31) || (o1 === 192 && o2 === 168)) {
    return {
      lat: 24.68,
      lon: 46.72,
      city: 'Zero-Trust Internal DC',
      cityAr: 'مركز البيانات الداخلي المحمي',
      country: 'Airgap & Zero-Trust Fabric',
      countryAr: 'شبكة الثقة الصفرية الداخلية',
      regionCode: 'LAN',
      flag: '🛡️'
    };
  }

  // Eastern Europe / Eurasia (e.g. 194.x, 45.142, 195.x, 185.220)
  if (o1 === 194 || o1 === 45 || (o1 === 185 && o2 >= 200) || o1 === 195 || (o1 >= 176 && o1 <= 178)) {
    const lat = 52.0 + (o2 % 10);
    const lon = 30.0 + (o3 % 30);
    return {
      lat,
      lon,
      city: 'Eastern Europe / Black Sea Corridor',
      cityAr: 'ممر أوروبا الشرقية والبحر الأسود',
      country: 'Eurasia Node',
      countryAr: 'عقدة أوراسيا',
      regionCode: 'EEU',
      flag: '🛰️'
    };
  }

  // Middle East & GCC (e.g. 212.x, 82.x, 188.x, 185.191)
  if (o1 === 212 || o1 === 82 || (o1 === 188 && o2 >= 130) || (o1 === 185 && o2 === 191)) {
    const lat = 24.0 + (o2 % 8);
    const lon = 45.0 + (o3 % 15);
    return {
      lat,
      lon,
      city: 'MENA Gateway / GCC',
      cityAr: 'بوابة الشرق الأوسط والخليج',
      country: 'MENA Regional Ingress',
      countryAr: 'منطقة الشرق الأوسط وشمال أفريقيا',
      regionCode: 'MENA',
      flag: '🌐'
    };
  }

  // North America (US-East/West e.g. 198.51, 204.x, 208.x, 64.x)
  if (o1 === 198 || o1 === 204 || o1 === 208 || o1 === 64 || (o1 >= 50 && o1 <= 74)) {
    const lat = 37.0 + (o2 % 10);
    const lon = -77.0 - (o3 % 40);
    return {
      lat,
      lon,
      city: lon < -100 ? 'US-West (Silicon Valley)' : 'US-East (Virginia)',
      cityAr: lon < -100 ? 'غرب أمريكا (سيليكون فالي)' : 'شرق أمريكا (فرجينيا)',
      country: 'North America',
      countryAr: 'أمريكا الشمالية',
      regionCode: 'NAM',
      flag: '⚡'
    };
  }

  // Asia-Pacific (APAC e.g. 203.0, 103.x, 114.x, 210.x)
  if (o1 === 203 || o1 === 103 || o1 === 114 || o1 === 210 || (o1 >= 110 && o1 <= 125)) {
    const lat = 31.0 + (o2 % 10);
    const lon = 121.0 + (o3 % 20);
    return {
      lat,
      lon,
      city: 'APAC (Tokyo / Singapore Hub)',
      cityAr: 'محور آسيا والمحيط الهادئ (طوكيو/سنغافورة)',
      country: 'Asia-Pacific',
      countryAr: 'آسيا والمحيط الهادئ',
      regionCode: 'APAC',
      flag: '📡'
    };
  }

  // Western Europe (EU-West e.g. 141.x, 193.x, 151.x)
  const lat = 50.1 + (o2 % 6);
  const lon = 8.6 + (o3 % 10);
  return {
    lat,
    lon,
    city: 'Western Europe (Frankfurt / London)',
    cityAr: 'غرب أوروبا (فرانكفورت/لندن)',
    country: 'Western Europe',
    countryAr: 'غرب أوروبا',
    regionCode: 'WEU',
    flag: '🌍'
  };
}

// Protected Target Infrastructure Coordinates (Central Protected SOC / Cloud Data Center)
const TARGET_SOC_COORDS = {
  lat: 24.71,
  lon: 46.67,
  label: 'Protected Core / National Tier-0 Enclave',
  labelAr: 'المعقل الوطني المحمي / المستوى 0'
};

interface NetworkSegmentDef {
  id: string;
  code: string;
  name: string;
  nameAr: string;
  subnet: string;
  tier: string;
  tierAr: string;
  targetPrefix: string;
  iconType: 'edge' | 'core' | 'compute' | 'database' | 'iam' | 'airgap';
}

const NETWORK_SEGMENTS: NetworkSegmentDef[] = [
  {
    id: 'dmz',
    code: 'DMZ-01',
    name: 'Edge Ingress & DMZ',
    nameAr: 'بوابة الدخول والمنطقة المعزولة',
    subnet: '10.0.1.0/24',
    tier: 'Tier-3 Ingress',
    tierAr: 'المستوى 3: البوابة الخارجية',
    targetPrefix: '10.0.1',
    iconType: 'edge'
  },
  {
    id: 'core',
    code: 'SPINE-02',
    name: 'Core Routing & SDN Mesh',
    nameAr: 'النسيج المركزي والمحولات',
    subnet: '10.0.2.0/24',
    tier: 'Tier-2 SDN Core',
    tierAr: 'المستوى 2: النسيج الشبكي',
    targetPrefix: '10.0.2',
    iconType: 'core'
  },
  {
    id: 'compute',
    code: 'K8S-03',
    name: 'Compute & App Cluster',
    nameAr: 'عنقود التطبيقات والحاويات',
    subnet: '10.0.3.0/24',
    tier: 'Tier-1 Microservices',
    tierAr: 'المستوى 1: الخدمات المصغرة',
    targetPrefix: '10.0.3',
    iconType: 'compute'
  },
  {
    id: 'data',
    code: 'VAULT-04',
    name: 'Tier-0 Mission Database',
    nameAr: 'مستودع قواعد البيانات الحساسة',
    subnet: '10.0.4.0/24',
    tier: 'Tier-0 Data Core',
    tierAr: 'المستوى 0: قواعد البيانات',
    targetPrefix: '10.0.4',
    iconType: 'database'
  },
  {
    id: 'iam',
    code: 'IDP-05',
    name: 'Zero-Trust IAM & KMS',
    nameAr: 'إدارة الهوية ومفاتيح التشفير',
    subnet: '10.0.5.0/24',
    tier: 'Zero-Trust Identity',
    tierAr: 'المستوى الحساس: الهوية والتشفير',
    targetPrefix: '10.0.5',
    iconType: 'iam'
  },
  {
    id: 'airgap',
    code: 'COLD-06',
    name: 'Airgap Archive & Cold Backup',
    nameAr: 'الأرشيف المعزول والنسخ الاحتياطية',
    subnet: '10.0.6.0/24',
    tier: 'Physically Isolated',
    tierAr: 'المستوى المعزول فيزيائياً',
    targetPrefix: '10.0.6',
    iconType: 'airgap'
  }
];

function matchNetworkSegment(dstIp: string, targetAsset?: string): string {
  const ip = dstIp || '';
  const asset = (targetAsset || '').toLowerCase();

  for (const seg of NETWORK_SEGMENTS) {
    if (ip.startsWith(seg.targetPrefix)) return seg.id;
  }
  if (asset.includes('edge') || asset.includes('router') || asset.includes('alpha') || ip.startsWith('10.0.0.')) return 'dmz';
  if (asset.includes('core') || asset.includes('switch') || asset.includes('spine')) return 'core';
  if (asset.includes('app') || asset.includes('cluster')) return 'compute';
  if (asset.includes('data') || asset.includes('db') || asset.includes('tier-0') || ip.includes('10.0.4.5')) return 'data';
  if (asset.includes('iam') || asset.includes('key') || asset.includes('idp')) return 'iam';
  if (asset.includes('backup') || asset.includes('airgap')) return 'airgap';
  return 'dmz';
}

export const ThreatDensityHeatmap: React.FC<ThreatDensityHeatmapProps> = ({
  telemetryStream,
  activeThreats,
  lang,
  onSelectFilter,
  activeSearchQuery = '',
  activeSourceIp = ''
}) => {
  const [mode, setMode] = useState<HeatmapMode>('COORDINATE_MAP');
  const [hoveredThreatId, setHoveredThreatId] = useState<string | null>(null);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [showGridLines, setShowGridLines] = useState(true);
  const [showTrajectories, setShowTrajectories] = useState(true);
  const [showHeatHalos, setShowHeatHalos] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  // Map canvas dimensions
  const MAP_W = 800;
  const MAP_H = 360;

  // Target coordinates in SVG space
  const targetXY = useMemo(() => {
    return latLonToXY(TARGET_SOC_COORDS.lat, TARGET_SOC_COORDS.lon, MAP_W, MAP_H);
  }, []);

  // Map activeThreats to coordinate points with real-time heat intensity
  const coordinateThreats: ThreatCoordinatePoint[] = useMemo(() => {
    // Deduplicate activeThreats by id
    const seenIds = new Set<string>();
    const uniqueThreats = activeThreats.filter(threat => {
      if (!threat.id || seenIds.has(threat.id)) return false;
      seenIds.add(threat.id);
      return true;
    });

    return uniqueThreats.map(threat => {
      const geo = resolveIpToCoordinates(threat.sourceIp);
      const xy = latLonToXY(geo.lat, geo.lon, MAP_W, MAP_H);

      // Intensity score calculated from severity, entropy delta, and blast radius
      let baseScore = 40;
      if (threat.severity === 'CRITICAL') baseScore = 95;
      else if (threat.severity === 'HIGH') baseScore = 75;
      else if (threat.severity === 'MEDIUM') baseScore = 50;

      const entropyBonus = Math.min(30, threat.entropyDelta * 8);
      const radiusBonus = threat.blastRadiusNodes * 12;
      const intensityScore = Math.min(100, Math.round(baseScore + entropyBonus));

      // Radius in SVG coordinates
      const heatRadius = Math.max(35, Math.min(95, 30 + radiusBonus + (intensityScore * 0.35)));

      return {
        threat,
        lat: geo.lat,
        lon: geo.lon,
        x: xy.x,
        y: xy.y,
        city: geo.city,
        cityAr: geo.cityAr,
        country: geo.country,
        countryAr: geo.countryAr,
        regionCode: geo.regionCode,
        heatRadius,
        intensityScore
      };
    });
  }, [activeThreats]);

  // Aggregate telemetry events into regional density counters
  const regionalEventCounts = useMemo(() => {
    const counts: Record<string, { total: number; dropped: number }> = {
      EEU: { total: 0, dropped: 0 },
      MENA: { total: 0, dropped: 0 },
      LAN: { total: 0, dropped: 0 },
      NAM: { total: 0, dropped: 0 },
      APAC: { total: 0, dropped: 0 },
      WEU: { total: 0, dropped: 0 }
    };

    telemetryStream.forEach(evt => {
      const geo = resolveIpToCoordinates(evt.sourceIp);
      if (counts[geo.regionCode]) {
        counts[geo.regionCode].total += 1;
        if (evt.actionTaken === 'XDP_DROPPED' || evt.actionTaken === 'SDN_ISOLATED') {
          counts[geo.regionCode].dropped += 1;
        }
      }
    });

    return counts;
  }, [telemetryStream]);

  // Segment stats for the alternate Segment view
  const segmentStats = useMemo(() => {
    const map: Record<string, { totalLogs: number; droppedLogs: number; threatCount: number; criticalCount: number }> = {};
    NETWORK_SEGMENTS.forEach(s => {
      map[s.id] = { totalLogs: 0, droppedLogs: 0, threatCount: 0, criticalCount: 0 };
    });

    telemetryStream.forEach(evt => {
      const segId = matchNetworkSegment(evt.destinationIp);
      if (map[segId]) {
        map[segId].totalLogs += 1;
        if (evt.actionTaken === 'XDP_DROPPED' || evt.actionTaken === 'SDN_ISOLATED') {
          map[segId].droppedLogs += 1;
        }
      }
    });

    activeThreats.forEach(t => {
      const segId = matchNetworkSegment('', t.targetAsset);
      if (map[segId]) {
        map[segId].threatCount += 1;
        if (t.severity === 'CRITICAL') map[segId].criticalCount += 1;
      }
    });

    return NETWORK_SEGMENTS.map(s => {
      const st = map[s.id];
      const density = Math.min(98, Math.max(8, Math.round((st.totalLogs * 1.5) + (st.droppedLogs * 4) + (st.threatCount * 28))));
      return { ...s, ...st, density };
    });
  }, [telemetryStream, activeThreats]);

  // Active threat selected or hovered
  const activeDetailPoint = useMemo(() => {
    const id = hoveredThreatId || selectedPointId;
    if (!id) return null;
    return coordinateThreats.find(p => p.threat.id === id) || null;
  }, [hoveredThreatId, selectedPointId, coordinateThreats]);

  const handlePointClick = (point: ThreatCoordinatePoint) => {
    if (selectedPointId === point.threat.id) {
      setSelectedPointId(null);
      onSelectFilter('');
    } else {
      setSelectedPointId(point.threat.id);
      const cleanIp = point.threat.sourceIp.split('/')[0];
      onSelectFilter(cleanIp, 'ip');
    }
  };

  const getSegmentIcon = (type: string) => {
    switch (type) {
      case 'edge': return <Radio className="w-3.5 h-3.5 text-cyan-400" />;
      case 'core': return <Layers className="w-3.5 h-3.5 text-blue-400" />;
      case 'compute': return <Server className="w-3.5 h-3.5 text-indigo-400" />;
      case 'database': return <Database className="w-3.5 h-3.5 text-purple-400" />;
      case 'iam': return <Key className="w-3.5 h-3.5 text-amber-400" />;
      case 'airgap': return <Archive className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Activity className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  return (
    <div className={`rounded-xl border border-slate-800 bg-[#090d16] shadow-xl transition-all duration-300 ${
      isExpanded ? 'p-5 space-y-4' : 'p-3.5 space-y-3'
    }`}>
      
      {/* Header with Mode Switcher and Coordinate Display Toggles */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 border-b border-slate-800/80 pb-2.5">
        
        {/* Title and High-Level Status */}
        <div className="flex items-center gap-2.5">
          <div className="relative p-1.5 rounded-lg bg-red-950/40 border border-red-500/40">
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-[#090d16]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold font-display-cyber text-slate-100 uppercase tracking-wide">
                {lang === 'ar' ? 'خريطة الكثافة التهديدية بإسقاط الإحداثيات' : 'COORDINATE-MAPPED THREAT HEATMAP'}
              </h3>
              <span className="text-[9px] font-mono-cyber px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                {coordinateThreats.length} {lang === 'ar' ? 'بؤر نشطة' : 'HOTSPOTS'}
              </span>
            </div>
            <p className="text-[10px] font-mono-cyber text-slate-400 flex items-center gap-1.5">
              <Compass className="w-3 h-3 text-cyan-400" />
              <span>
                {lang === 'ar' 
                  ? 'إسقاط جغرافي لحظي لمصادر الهجمات والمتجهات الحركية' 
                  : 'WGS-84 coordinate projection of inbound attack vectors & heat density'}
              </span>
            </p>
          </div>
        </div>

        {/* View Mode & Overlay Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          
          {/* Overlay Features Toggle (Only in Coordinate Map Mode) */}
          {mode === 'COORDINATE_MAP' && (
            <div className="hidden md:flex items-center gap-1 bg-[#04060a] p-0.5 rounded-lg border border-slate-800 text-[9px] font-mono-cyber text-slate-400">
              <button
                onClick={() => setShowGridLines(!showGridLines)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  showGridLines ? 'bg-cyan-950 text-cyan-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Lat/Lon Graticule Lines"
              >
                {lang === 'ar' ? 'الشبكة' : 'Graticule'}
              </button>
              <button
                onClick={() => setShowTrajectories(!showTrajectories)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  showTrajectories ? 'bg-amber-950 text-amber-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Attack Vector Trajectories"
              >
                {lang === 'ar' ? 'المسارات' : 'Vectors'}
              </button>
              <button
                onClick={() => setShowHeatHalos(!showHeatHalos)}
                className={`px-2 py-0.5 rounded transition-all cursor-pointer ${
                  showHeatHalos ? 'bg-red-950 text-red-300 font-semibold' : 'text-slate-500 hover:text-slate-300'
                }`}
                title="Toggle Radial Heat Density Halos"
              >
                {lang === 'ar' ? 'الهالات الحرارية' : 'Halos'}
              </button>
            </div>
          )}

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#04060a] p-0.5 rounded-lg border border-slate-800 text-[10px] font-mono-cyber">
            <button
              onClick={() => setMode('COORDINATE_MAP')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'COORDINATE_MAP'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Coordinate-Mapped World Heatmap"
            >
              <Globe className="w-3 h-3" />
              <span>{lang === 'ar' ? 'إسقاط الإحداثيات' : 'Geo Coordinates'}</span>
            </button>
            
            <button
              onClick={() => setMode('SEGMENTS')}
              className={`px-2.5 py-1 rounded-md flex items-center gap-1.5 transition-all cursor-pointer ${
                mode === 'SEGMENTS'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Zero-Trust Infrastructure Segments"
            >
              <Layers className="w-3 h-3" />
              <span>{lang === 'ar' ? 'قطاعات الشبكة' : 'Segments'}</span>
            </button>
          </div>

          {/* Expand / Minimize Toggle */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            title={isExpanded ? 'Collapse widget view' : 'Expand widget view'}
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

      </div>

      {/* Main Display: COORDINATE MAP MODE */}
      {mode === 'COORDINATE_MAP' ? (
        <div className="space-y-2.5">
          
          {/* Tactical SVG Map Canvas */}
          <div className="relative w-full rounded-xl border border-slate-900 bg-[#04060a] overflow-hidden shadow-inner group">
            
            <svg 
              viewBox={`0 0 ${MAP_W} ${MAP_H}`} 
              className={`w-full h-auto transition-all ${isExpanded ? 'max-h-[500px]' : 'max-h-[290px]'}`}
              style={{ display: 'block' }}
            >
              <defs>
                {/* Heat density glow filter */}
                <filter id="heat-blur" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="9" result="blur" />
                  <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" />
                </filter>

                {/* Trajectory Attack Vector Linear Gradient */}
                <linearGradient id="trajectory-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.9" />
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.9" />
                </linearGradient>

                {/* Dynamic Radial Gradients for Each Threat Hotspot */}
                {coordinateThreats.map(pt => {
                  const isCrit = pt.threat.severity === 'CRITICAL';
                  const isHigh = pt.threat.severity === 'HIGH';
                  const innerColor = isCrit ? '#ef4444' : isHigh ? '#f59e0b' : '#38bdf8';
                  const midColor = isCrit ? '#dc2626' : isHigh ? '#d97706' : '#0284c7';
                  const outerColor = isCrit ? '#7f1d1d' : isHigh ? '#78350f' : '#0369a1';

                  return (
                    <radialGradient key={pt.threat.id} id={`radial-heat-${pt.threat.id}`} cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor={innerColor} stopOpacity="0.85" />
                      <stop offset="30%" stopColor={midColor} stopOpacity="0.55" />
                      <stop offset="70%" stopColor={outerColor} stopOpacity="0.22" />
                      <stop offset="100%" stopColor={outerColor} stopOpacity="0" />
                    </radialGradient>
                  );
                })}
              </defs>

              {/* Background Cyber Grid */}
              <rect x="0" y="0" width={MAP_W} height={MAP_H} fill="#040711" />

              {/* Lat/Lon Graticule Lines */}
              {showGridLines && (
                <g className="graticule-grid opacity-35" stroke="#1e293b" strokeWidth="0.75" strokeDasharray="3 4">
                  {/* Latitude Lines */}
                  <line x1="0" y1={MAP_H * 0.166} x2={MAP_W} y2={MAP_H * 0.166} /> {/* 60° N */}
                  <line x1="0" y1={MAP_H * 0.333} x2={MAP_W} y2={MAP_H * 0.333} /> {/* 30° N */}
                  <line x1="0" y1={MAP_H * 0.500} x2={MAP_W} y2={MAP_H * 0.500} stroke="#0e7490" strokeWidth="1" /> {/* 0° Equator */}
                  <line x1="0" y1={MAP_H * 0.666} x2={MAP_W} y2={MAP_H * 0.666} /> {/* 30° S */}
                  <line x1="0" y1={MAP_H * 0.833} x2={MAP_W} y2={MAP_H * 0.833} /> {/* 60° S */}

                  {/* Longitude Lines */}
                  <line x1={MAP_W * 0.166} y1="0" x2={MAP_W * 0.166} y2={MAP_H} /> {/* 120° W */}
                  <line x1={MAP_W * 0.333} y1="0" x2={MAP_W * 0.333} y2={MAP_H} /> {/* 60° W */}
                  <line x1={MAP_W * 0.500} y1="0" x2={MAP_W * 0.500} y2={MAP_H} stroke="#0e7490" strokeWidth="1" /> {/* 0° Meridian */}
                  <line x1={MAP_W * 0.666} y1="0" x2={MAP_W * 0.666} y2={MAP_H} /> {/* 60° E */}
                  <line x1={MAP_W * 0.833} y1="0" x2={MAP_W * 0.833} y2={MAP_H} /> {/* 120° E */}
                </g>
              )}

              {/* Stylized Continental Landmass Outlines */}
              <g className="continents opacity-75" fill="#0c1322" stroke="#1e293b" strokeWidth="0.8">
                {/* North America */}
                <path d="M 120 45 L 210 50 L 260 85 L 240 140 L 205 165 L 180 140 L 150 170 L 130 130 L 95 100 L 105 60 Z" />
                <path d="M 220 25 L 265 30 L 255 55 L 215 50 Z" /> {/* Greenland */}
                
                {/* Central & South America */}
                <path d="M 195 170 L 225 185 L 255 220 L 285 240 L 270 300 L 240 330 L 220 270 L 205 200 Z" />

                {/* Europe */}
                <path d="M 370 70 L 430 65 L 450 90 L 435 120 L 390 125 L 365 105 L 360 85 Z" />
                <path d="M 365 50 L 400 45 L 395 70 L 375 75 Z" /> {/* Scandinavia */}
                <path d="M 350 75 L 365 72 L 360 92 L 345 85 Z" /> {/* UK & Ireland */}

                {/* Eurasia & Eastern Corridor */}
                <path d="M 440 65 L 560 55 L 670 65 L 720 90 L 690 140 L 610 130 L 520 125 L 460 100 Z" />

                {/* Asia & East Asia */}
                <path d="M 540 120 L 630 115 L 690 135 L 705 180 L 640 210 L 570 190 L 525 160 Z" />
                <path d="M 700 120 L 725 135 L 715 175 L 695 155 Z" /> {/* Japan */}

                {/* Middle East & GCC Corridor */}
                <path d="M 465 125 L 520 125 L 535 160 L 515 185 L 485 180 L 465 155 Z" />

                {/* Africa */}
                <path d="M 370 135 L 455 130 L 500 170 L 490 230 L 440 290 L 405 270 L 375 210 L 355 160 Z" />

                {/* Australia & Oceania */}
                <path d="M 640 240 L 730 235 L 750 285 L 695 320 L 645 290 Z" />
              </g>

              {/* Coordinate System Labels */}
              {showGridLines && (
                <g className="text-coordinate-labels opacity-40 font-mono-cyber text-[8px] fill-slate-400 select-none pointer-events-none">
                  <text x="8" y="65">60°N</text>
                  <text x="8" y="125">30°N</text>
                  <text x="8" y="185">0° EQ</text>
                  <text x="8" y="245">30°S</text>
                  <text x="8" y="305">60°S</text>

                  <text x="135" y={MAP_H - 8}>120°W</text>
                  <text x="270" y={MAP_H - 8}>60°W</text>
                  <text x="405" y={MAP_H - 8}>0° UTC</text>
                  <text x="535" y={MAP_H - 8}>60°E</text>
                  <text x="670" y={MAP_H - 8}>120°E</text>
                </g>
              )}

              {/* Kinetic Trajectory Attack Vectors (from Source Coordinates to Protected Target SOC) */}
              {showTrajectories && coordinateThreats.map(pt => {
                const isCrit = pt.threat.severity === 'CRITICAL';
                // Calculate quadratic bezier curve
                const midX = (pt.x + targetXY.x) / 2;
                const arcLift = Math.max(30, Math.abs(pt.x - targetXY.x) * 0.25);
                const midY = Math.min(pt.y, targetXY.y) - arcLift;
                const curvePath = `M ${pt.x} ${pt.y} Q ${midX} ${midY} ${targetXY.x} ${targetXY.y}`;

                return (
                  <g key={`traj-${pt.threat.id}`} className="trajectory-vector">
                    {/* Shadow ambient arc */}
                    <path
                      d={curvePath}
                      fill="none"
                      stroke={isCrit ? '#ef4444' : '#f59e0b'}
                      strokeWidth="3"
                      strokeOpacity="0.15"
                    />
                    {/* Animated dashed kinetic arc */}
                    <path
                      d={curvePath}
                      fill="none"
                      stroke="url(#trajectory-grad)"
                      strokeWidth={isCrit ? '1.8' : '1.2'}
                      strokeDasharray="6 4"
                      className="animate-pulse"
                      strokeOpacity="0.85"
                    />
                  </g>
                );
              })}

              {/* Coordinate-Mapped Heat Halos (Radial Density Overlays) */}
              {showHeatHalos && (
                <g className="heat-density-halos" style={{ mixBlendMode: 'screen' }}>
                  {coordinateThreats.map(pt => (
                    <circle
                      key={`halo-${pt.threat.id}`}
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.heatRadius}
                      fill={`url(#radial-heat-${pt.threat.id})`}
                      filter="url(#heat-blur)"
                      opacity={pt.threat.severity === 'CRITICAL' ? '0.95' : '0.8'}
                    />
                  ))}
                </g>
              )}

              {/* Central Protected Asset (Target SOC Infrastructure) */}
              <g 
                className="target-soc-node cursor-pointer group/soc"
                transform={`translate(${targetXY.x}, ${targetXY.y})`}
                onClick={() => onSelectFilter('10.0.4.5', 'ip')}
              >
                {/* Concentric radar rings */}
                <circle r="22" stroke="#06b6d4" strokeWidth="1" strokeDasharray="3 3" fill="none" opacity="0.4" className="animate-spin" />
                <circle r="14" stroke="#06b6d4" strokeWidth="1.2" fill="#083344" fillOpacity="0.8" />
                <circle r="4" fill="#22d3ee" className="animate-ping" />
                <circle r="3" fill="#ffffff" />
                
                {/* Target Pin Label */}
                <g transform="translate(18, -12)" className="pointer-events-none">
                  <rect x="0" y="0" width="130" height="18" rx="3" fill="#040d1a" stroke="#0891b2" strokeWidth="0.8" opacity="0.9" />
                  <text x="6" y="12" fill="#38bdf8" fontSize="8" fontWeight="bold" fontFamily="monospace">
                    DEFENDED CORE · SOC
                  </text>
                </g>
              </g>

              {/* Coordinate Threat Hotspot Markers & Beacons */}
              {coordinateThreats.map(pt => {
                const isSelected = selectedPointId === pt.threat.id || activeSearchQuery.includes(pt.threat.sourceIp.split('/')[0]);
                const isHovered = hoveredThreatId === pt.threat.id;
                const isCrit = pt.threat.severity === 'CRITICAL';
                const markerColor = isCrit ? '#ef4444' : '#f59e0b';

                return (
                  <g 
                    key={`point-${pt.threat.id}`}
                    transform={`translate(${pt.x}, ${pt.y})`}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoveredThreatId(pt.threat.id)}
                    onMouseLeave={() => setHoveredThreatId(null)}
                    onClick={() => handlePointClick(pt)}
                  >
                    {/* Animated Radar Pulse Wave */}
                    <circle 
                      r={isCrit ? '22' : '16'} 
                      stroke={markerColor} 
                      strokeWidth="1.2" 
                      fill="none" 
                      className="animate-ping" 
                      opacity="0.75" 
                    />

                    {/* Crosshair Reticle Brackets */}
                    <path
                      d="M -10 -4 L -10 -10 L -4 -10 M 4 -10 L 10 -10 L 10 -4 M 10 4 L 10 10 L 4 10 M -4 10 L -10 10 L -10 4"
                      stroke={isSelected ? '#22d3ee' : markerColor}
                      strokeWidth="1.2"
                      fill="none"
                      opacity={isSelected || isHovered ? '1' : '0.7'}
                    />

                    {/* Solid Core Beacon */}
                    <circle 
                      r={isSelected ? '6' : '5'} 
                      fill={markerColor} 
                      stroke="#ffffff" 
                      strokeWidth="1.5"
                      className="shadow-lg"
                    />

                    {/* Hotspot Floating Tag */}
                    <g transform="translate(12, -10)" className="pointer-events-none">
                      <rect 
                        x="0" 
                        y="0" 
                        width="80" 
                        height="16" 
                        rx="3" 
                        fill="#030712" 
                        stroke={isSelected ? '#22d3ee' : markerColor} 
                        strokeWidth="0.8" 
                        opacity="0.92" 
                      />
                      <text x="5" y="11" fill={isCrit ? '#fca5a5' : '#fde68a'} fontSize="8" fontWeight="bold" fontFamily="monospace">
                        {pt.regionCode} [{pt.lat.toFixed(1)}°, {pt.lon.toFixed(1)}°]
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>

            {/* Bottom Coordinate Bar & Radar Telemetry Overlay */}
            <div className="absolute bottom-2 left-3 right-3 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono-cyber text-slate-400 bg-[#090d16]/85 backdrop-blur-md px-3 py-1 rounded-lg border border-slate-800 pointer-events-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  CRS: <strong className="text-cyan-300">WGS-84 / EPSG:4326</strong>
                </span>
                <span className="hidden sm:inline text-slate-500">|</span>
                <span className="hidden sm:inline">
                  PROJECTION: <strong className="text-slate-300">EQUIRECTANGULAR</strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">
                  {lang === 'ar' ? 'البؤرة المستهدفة:' : 'Target Anchor:'}{' '}
                  <strong className="text-emerald-400">24.71° N, 46.67° E (SOC)</strong>
                </span>
              </div>
            </div>

          </div>

          {/* Interactive Tactical Detail Card on Hover / Selection */}
          {activeDetailPoint ? (
            <div className="p-3 rounded-lg border border-cyan-500/40 bg-cyan-950/20 backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs font-mono-cyber">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 font-bold text-[10px]">
                    {activeDetailPoint.threat.severity}
                  </span>
                  <span className="font-bold text-slate-100">
                    {lang === 'ar' ? activeDetailPoint.threat.titleAr : activeDetailPoint.threat.title}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                  <span className="flex items-center gap-1 text-cyan-300">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {lang === 'ar' ? activeDetailPoint.cityAr : activeDetailPoint.city} ({activeDetailPoint.lat.toFixed(2)}°N, {activeDetailPoint.lon.toFixed(2)}°E)
                  </span>
                  <span>SRC: <strong className="text-slate-200">{activeDetailPoint.threat.sourceIp}</strong></span>
                  <span>TACTIC: <strong className="text-purple-300">{activeDetailPoint.threat.mitreTactic.split(' - ')[0]}</strong></span>
                  <span>H(x) &Delta;: <strong className="text-amber-300">+{activeDetailPoint.threat.entropyDelta}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handlePointClick(activeDetailPoint)}
                  className="px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <Target className="w-3 h-3 text-cyan-400" />
                  <span>
                    {selectedPointId === activeDetailPoint.threat.id 
                      ? (lang === 'ar' ? 'إلغاء الترشيح' : 'Clear Hotspot Filter') 
                      : (lang === 'ar' ? 'ترشيح هذا الإحداثي' : 'Filter by Coordinates')}
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1">
              {[
                { code: 'EEU', name: 'Eastern Europe', nameAr: 'أوروبا الشرقية', coords: '55.8°N, 37.6°E', prefix: '194.26' },
                { code: 'MENA', name: 'Middle East', nameAr: 'الشرق الأوسط', coords: '25.2°N, 55.3°E', prefix: '185.191' },
                { code: 'LAN', name: 'Internal Mesh', nameAr: 'الشبكة المركزية', coords: '24.7°N, 46.7°E', prefix: '10.0.3' },
                { code: 'NAM', name: 'North America', nameAr: 'أمريكا الشمالية', coords: '37.5°N, 77.0°W', prefix: '198.51' },
                { code: 'APAC', name: 'Asia-Pacific', nameAr: 'آسيا والمحيط الهادئ', coords: '31.2°N, 121.5°E', prefix: '203.0' },
                { code: 'WEU', name: 'Western Europe', nameAr: 'غرب أوروبا', coords: '50.1°N, 8.6°E', prefix: '141.0' }
              ].map(r => {
                const activeInRegion = coordinateThreats.filter(t => t.regionCode === r.code);
                const isCrit = activeInRegion.some(t => t.threat.severity === 'CRITICAL');
                const isSelected = activeSourceIp.includes(r.prefix) || activeSearchQuery.includes(r.prefix);

                return (
                  <button
                    key={r.code}
                    onClick={() => {
                      if (isSelected) {
                        onSelectFilter('');
                      } else {
                        onSelectFilter(r.prefix, 'ip');
                      }
                    }}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-950/60 border-cyan-400 ring-1 ring-cyan-400'
                        : isCrit
                        ? 'bg-red-950/30 border-red-800/40 hover:border-red-500'
                        : activeInRegion.length > 0
                        ? 'bg-amber-950/30 border-amber-800/40 hover:border-amber-500'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono-cyber">
                      <span className="font-bold text-slate-200">{r.code}</span>
                      {activeInRegion.length > 0 ? (
                        <span className={`text-[8px] px-1 rounded font-bold ${
                          isCrit ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {activeInRegion.length} {lang === 'ar' ? 'هجوم' : 'atk'}
                        </span>
                      ) : (
                        <span className="text-[8px] text-emerald-400">clean</span>
                      )}
                    </div>
                    <div className="text-[9px] font-mono-cyber text-slate-400 mt-1 truncate">
                      {lang === 'ar' ? r.nameAr : r.name}
                    </div>
                    <div className="text-[8px] font-mono-cyber text-slate-500 truncate">
                      {r.coords}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

        </div>
      ) : (
        /* Alternate Display: ZERO-TRUST NETWORK SEGMENT MATRIX */
        <div className="space-y-2.5">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {segmentStats.map(seg => {
              const isSelected = activeSearchQuery.includes(seg.targetPrefix);
              let borderClass = 'border-slate-800 bg-[#070b13] text-slate-300';
              if (isSelected) {
                borderClass = 'border-cyan-400 bg-cyan-950/40 ring-1 ring-cyan-400 shadow-lg';
              } else if (seg.criticalCount > 0) {
                borderClass = 'border-red-600/50 bg-red-950/40 text-red-200';
              } else if (seg.threatCount > 0) {
                borderClass = 'border-amber-600/50 bg-amber-950/40 text-amber-200';
              }

              return (
                <div
                  key={seg.id}
                  onClick={() => onSelectFilter(isSelected ? '' : seg.targetPrefix)}
                  className={`p-2.5 rounded-lg border flex flex-col justify-between cursor-pointer transition-all duration-200 ${borderClass}`}
                  title={`Click to filter logs for ${seg.subnet}`}
                >
                  <div className="flex items-center justify-between gap-1 text-[10px] font-mono-cyber">
                    <div className="flex items-center gap-1.5 truncate">
                      {getSegmentIcon(seg.iconType)}
                      <span className="font-bold text-slate-200 truncate">{seg.code}</span>
                    </div>
                    <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                      seg.criticalCount > 0 ? 'bg-red-500/30 text-red-300' :
                      seg.threatCount > 0 ? 'bg-amber-500/30 text-amber-300' :
                      'bg-slate-800 text-slate-400'
                    }`}>
                      {seg.density}%
                    </span>
                  </div>

                  <div className="my-1.5">
                    <div className="text-[10px] font-semibold text-slate-200 truncate leading-tight">
                      {lang === 'ar' ? seg.nameAr : seg.name}
                    </div>
                    <div className="text-[9px] font-mono-cyber text-slate-400 opacity-80 truncate">
                      {seg.subnet}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[8px] font-mono-cyber text-slate-400 pt-1 border-t border-slate-800/40">
                    <span>{seg.totalLogs} logs</span>
                    {seg.threatCount > 0 ? (
                      <span className="text-red-400 font-bold">{seg.threatCount} threats</span>
                    ) : (
                      <span className="text-emerald-400">clean</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Proportional Density Bar & Reset Indicator */}
      <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[10px] font-mono-cyber">
        <div className="flex-1 w-full flex items-center gap-2">
          <span className="text-slate-400 shrink-0 flex items-center gap-1 text-[9px]">
            <Activity className="w-3 h-3 text-cyan-400" />
            {lang === 'ar' ? 'طيف الكثافة العالمي:' : 'Global Heat Distribution:'}
          </span>
          <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden flex border border-slate-800">
            {coordinateThreats.map((pt, idx) => {
              const isCrit = pt.threat.severity === 'CRITICAL';
              const color = isCrit ? 'bg-red-500' : 'bg-amber-400';
              return (
                <div
                  key={idx}
                  style={{ width: `${Math.max(15, pt.intensityScore)}%` }}
                  className={`h-full ${color} transition-all hover:opacity-80`}
                  title={`${pt.city}: ${pt.intensityScore}% heat`}
                />
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[10px]">
          <span className="text-slate-400">
            {lang === 'ar' ? 'البؤرة القصوى:' : 'Peak Origin:'}{' '}
            <strong className="text-red-400 font-bold">
              {coordinateThreats[0]?.city || 'Eurasia'} ({coordinateThreats[0]?.threat.severity || 'CRITICAL'})
            </strong>
          </span>

          {selectedPointId && (
            <button
              onClick={() => { setSelectedPointId(null); onSelectFilter(''); }}
              className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-600/40 hover:bg-cyan-900 flex items-center gap-1 text-[9px] cursor-pointer"
            >
              <span>{lang === 'ar' ? 'إلغاء الترشيح' : 'Reset Filter'}</span>
              <X className="w-2.5 h-2.5" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
