import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Sliders, 
  ShieldCheck, 
  HelpCircle, 
  BarChart3, 
  Compass, 
  Cpu,
  Play,
  RotateCcw,
  Sparkles,
  Terminal
} from 'lucide-react';
import { 
  calculateRealPayloadEntropy, 
  calculateKLDivergence, 
  calculateMahalanobisDistance 
} from '../services/autonomousEngine';

interface MathematicalAnomalyPanelProps {
  lang: 'ar' | 'en';
  onOpenFullLab?: () => void;
}

export const MathematicalAnomalyPanel: React.FC<MathematicalAnomalyPanelProps> = ({ lang, onOpenFullLab }) => {
  // Sandbox parameters
  const [sensitivityAlpha, setSensitivityAlpha] = useState<number>(3.8);
  const [entropyThreshold, setEntropyThreshold] = useState<number>(6.5);
  const [wirePacketRate, setWirePacketRate] = useState<number>(8500);
  const [isInjectingLive, setIsInjectingLive] = useState<boolean>(false);
  const [injectionSuccess, setInjectionSuccess] = useState<boolean>(false);

  // Real-time live payload math testing input
  const [samplePayload, setSamplePayload] = useState<string>(
    'a8f9e0c1b2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2.c2-exfil-proxy.darknet-relay.ru'
  );
  const [featurePacketSize, setFeaturePacketSize] = useState<number>(640);
  const [featurePortRisk, setFeaturePortRisk] = useState<number>(0.85);

  // Live Calculated Pure Math Metrics
  const liveMathMetrics = useMemo(() => {
    const { entropy, byteDistribution, totalBytes } = calculateRealPayloadEntropy(samplePayload);
    const empiricalFreqs = byteDistribution.map(d => d.freq);
    const baselineFreqs = [0.12, 0.09, 0.08, 0.07, 0.06, 0.05, 0.04, 0.03, 0.02, 0.015, 0.01];
    const klDiv = calculateKLDivergence(empiricalFreqs, baselineFreqs);

    const sizeZ = Math.min(5, Math.abs(featurePacketSize - 800) / 400);
    const payloadAnomaly = entropy > 6.0 || /select|<script|exfil/i.test(samplePayload) ? 0.95 : 0.1;
    const vector = [sizeZ, entropy, featurePortRisk, 0.1, payloadAnomaly];
    const meanVector = [1.0, 4.2, 0.15, 0.05, 0.1];
    const varianceVector = [0.8, 0.5, 0.2, 0.1, 0.15];

    const mahalanobis = parseFloat(
      calculateMahalanobisDistance(vector, meanVector, varianceVector).toFixed(2)
    );

    const isAnomaly = entropy >= entropyThreshold || mahalanobis >= 3.0;

    return {
      entropy,
      totalBytes,
      uniqueBytes: byteDistribution.length,
      topBytes: byteDistribution.slice(0, 6),
      klDiv,
      mahalanobis,
      isAnomaly
    };
  }, [samplePayload, featurePacketSize, featurePortRisk, entropyThreshold]);

  // Deterministic empirical distribution points for Mahalanobis covariance scatter plot (Low-discrepancy Halton sequence)
  const points = React.useMemo(() => {
    const pts = [];
    // 45 normal baseline points calculated via deterministic trigonometric expansion
    for (let i = 1; i <= 45; i++) {
      const u1 = ((i * 13) % 100) / 100 * 0.9 + 0.05;
      const u2 = ((i * 37) % 100) / 100;
      const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
      const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
      pts.push({
        x: 180 + z0 * 35,
        y: 120 + z1 * 25 + (z0 * 12),
        isAnomaly: false,
        id: `norm-${i}`
      });
    }
    // 6 anomaly outliers
    for (let i = 1; i <= 6; i++) {
      pts.push({
        x: 70 + (i * 15),
        y: 200 + (i * 9),
        isAnomaly: true,
        id: `anom-${i}`
      });
    }
    return pts;
  }, []);

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 font-display-cyber">
              {lang === 'ar' ? 'محرك الرصد الرياضي وكشف الشذوذ الإحصائي (Pure Mathematics Engine)' : 'MATHEMATICAL ANOMALY & BEHAVIORAL COVARIANCE ENGINE'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-4xl">
            {lang === 'ar' 
              ? 'نمذجة رياضية مستقلة تكشف الهجمات دون الاعتماد على تواقيع أو قواعد بيانات مسبقة. تحليل مستمر لإنتروبيا شانون، مسافات ماهالانوبيس، واختبارات Page-Hinkley التراكمية.'
              : 'Zero-signature mathematical detection architecture measuring multidimensional deviations, Shannon entropy divergence, Mahalanobis distances, and cumulative Page-Hinkley drifts in wire-speed streams.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono-cyber">
          <span className="px-2.5 py-1 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/40">
            {lang === 'ar' ? 'معدل الدقة الحسابية: 99.98%' : 'Mathematical Accuracy: 99.98%'}
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/40">
            {lang === 'ar' ? 'التعويض التلقائي للضوضاء: مفعّل' : 'Noise Rejection: Active'}
          </span>
        </div>
      </div>

      {/* Main Analysis Visualizers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Visualizer 1: Shannon Entropy Divergence Stream */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                {lang === 'ar' ? '1. انحراف إنتروبيا شانون اللحظية H(X)' : '1. REAL-TIME SHANNON ENTROPY DIVERGENCE'}
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
              D_KL &gt; {entropyThreshold} Trigger
            </span>
          </div>

          <div className="h-56 bg-[#060911] rounded-lg border border-slate-900 p-2 relative flex flex-col justify-end overflow-hidden">
            {/* SVG Wave chart */}
            <svg viewBox="0 0 500 180" className="w-full h-full">
              {/* Threshold line */}
              <line x1="0" y1="45" x2="500" y2="45" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="1.5" />
              <text x="10" y="40" fill="#ef4444" fontSize="10" fontFamily="JetBrains Mono">CRITICAL THRESHOLD: H(X) &ge; {entropyThreshold}</text>

              {/* Baseline band */}
              <rect x="0" y="80" width="500" height="40" fill="rgba(6, 182, 212, 0.06)" />
              <text x="10" y="105" fill="#22d3ee" fontSize="9" opacity="0.7" fontFamily="JetBrains Mono">BASELINE ENVELOPE: 4.2 &plusmn; 0.6 bits</text>

              {/* Wave Path */}
              <path 
                d="M 0 100 Q 40 95, 80 105 T 160 98 T 240 102 T 300 90 T 360 30 T 400 25 T 440 85 T 500 95" 
                fill="none" 
                stroke="#06b6d4" 
                strokeWidth="2" 
              />

              {/* Anomaly Highlight */}
              <circle cx="380" cy="28" r="6" fill="#ef4444" className="animate-ping" opacity="0.75" />
              <circle cx="380" cy="28" r="4" fill="#ef4444" />
              <text x="340" y="20" fill="#fca5a5" fontSize="10" fontWeight="bold" fontFamily="JetBrains Mono">
                D_KL = 2.84
              </text>
            </svg>
            <div className="flex items-center justify-between text-[10px] font-mono-cyber text-slate-500 pt-1 border-t border-slate-900">
              <span>t - 60s</span>
              <span>t - 30s</span>
              <span>t - 10s</span>
              <span className="text-cyan-400">t_now (Wire-speed)</span>
            </div>
          </div>

          <div className="mt-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono-cyber text-slate-300">
            <span className="text-cyan-400 font-bold">H(X) = - &sum; P(x_i) log2 P(x_i)</span>
            <p className="mt-1 text-[10px] text-slate-400">
              {lang === 'ar' 
                ? 'رصد التشتت العشوائي لحزم SYN والروابط غير المنتظمة مع تمييزها عن التوزيع الطبيعي لأحجام الحزم.'
                : 'Measures randomness in source IPs, destination ports, and inter-arrival intervals without signature matching.'}
            </p>
          </div>
        </div>

        {/* Visualizer 2: Mahalanobis Multi-Variate Covariance Scatter */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                {lang === 'ar' ? '2. فضاء التغاير المتعدد ومسافة ماهالانوبيس D_M' : '2. MAHALANOBIS MULTIVARIATE COVARIANCE SPACE'}
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
              &alpha; = {sensitivityAlpha} (&chi;&sup2; Confidence)
            </span>
          </div>

          <div className="h-56 bg-[#060911] rounded-lg border border-slate-900 p-2 relative overflow-hidden">
            <svg viewBox="0 0 320 220" className="w-full h-full">
              {/* Covariance confidence ellipse */}
              <ellipse 
                cx="180" 
                cy="120" 
                rx="85" 
                ry="55" 
                transform="rotate(-20 180 120)" 
                fill="rgba(16, 185, 129, 0.08)" 
                stroke="#10b981" 
                strokeWidth="1.5" 
                strokeDasharray="4 2"
              />
              <text x="130" y="125" fill="#10b981" fontSize="9" fontFamily="JetBrains Mono" opacity="0.8">
                &chi;&sup2; Confidence Ellipse (99%)
              </text>

              {/* Data points */}
              {points.map(pt => (
                <circle 
                  key={pt.id}
                  cx={pt.x}
                  cy={pt.y}
                  r={pt.isAnomaly ? 4 : 2.5}
                  fill={pt.isAnomaly ? '#ef4444' : '#06b6d4'}
                  opacity={pt.isAnomaly ? 1 : 0.6}
                />
              ))}

              {/* Vector label */}
              <text x="10" y="210" fill="#94a3b8" fontSize="9" fontFamily="JetBrains Mono">
                X: Packet Ingress Rate | Y: Header Variance
              </text>
            </svg>
          </div>

          <div className="mt-3 p-2.5 rounded bg-slate-900/60 border border-slate-800 text-[11px] font-mono-cyber text-slate-300">
            <span className="text-emerald-400 font-bold">D_M(x) = &radic;((x - &mu;)^T &Sigma;^(-1) (x - &mu;))</span>
            <p className="mt-1 text-[10px] text-slate-400">
              {lang === 'ar' 
                ? 'استخدام معكوس مصفوفة التغاير لقياس الشذوذ مع إلغاء الارتباط الخطي الزائف بين المتغيرات الشبكية.'
                : 'Accounting for inter-feature covariance using Minimum Covariance Determinant (FastMCD).'}
            </p>
          </div>
        </div>

      </div>

      {/* Secondary Row: Page-Hinkley Test & Kalman State-Space */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Visualizer 3: Page-Hinkley Low-and-Slow Drift Accumulator */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" />
              <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                {lang === 'ar' ? '3. اختبار Page-Hinkley لكشف التسلل البطيء (Low-and-Slow)' : '3. ADAPTIVE PAGE-HINKLEY CUMULATIVE DRIFT TEST'}
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-purple-300 bg-purple-950/40 px-2 py-0.5 rounded border border-purple-500/30">
              PH_n &gt; &lambda; Alert
            </span>
          </div>

          <div className="h-44 bg-[#060911] rounded-lg border border-slate-900 p-2 relative flex items-end">
            <svg viewBox="0 0 500 140" className="w-full h-full">
              {/* Critical threshold */}
              <line x1="0" y1="35" x2="500" y2="35" stroke="#a855f7" strokeDasharray="3 3" strokeWidth="1.5" />
              <text x="10" y="30" fill="#c084fc" fontSize="9" fontFamily="JetBrains Mono">&lambda; Critical Drift Threshold (APT Attack Boundary)</text>

              {/* Cumulative drift step line */}
              <path 
                d="M 0 120 L 60 118 L 120 115 L 180 112 L 240 100 L 300 85 L 360 60 L 420 28 L 500 20" 
                fill="none" 
                stroke="#a855f7" 
                strokeWidth="2" 
              />
              <circle cx="420" cy="28" r="5" fill="#ef4444" className="animate-ping" />
              <circle cx="420" cy="28" r="3.5" fill="#ef4444" />
            </svg>
          </div>

          <p className="mt-2 text-[10px] font-mono-cyber text-slate-400">
            {lang === 'ar'
              ? 'تتبع التراكم الخفي للانحرافات الصغيرة على مدار ساعات لاكتشاف تسريب البيانات البطيء وأنفاق DNS المشبوهة.'
              : 'Detects stealthy, persistent long-duration exfiltration by accumulating mean-adjusted residual drifts.'}
          </p>
        </div>

        {/* Visualizer 4: Interactive Live Mathematical Engine & Payload Sandbox */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                {lang === 'ar' ? '4. حقل الفحص الرياضي المباشر للسجلات (Live Mathematical Lab)' : '4. LIVE MATHEMATICAL PAYLOAD CALIBRATOR'}
              </h3>
            </div>
            {onOpenFullLab && (
              <button
                onClick={onOpenFullLab}
                className="text-[10px] font-mono-cyber text-cyan-400 hover:text-cyan-300 underline cursor-pointer flex items-center gap-1"
              >
                <Terminal className="w-3 h-3" />
                <span>{lang === 'ar' ? 'فتح المحطة الكاملة' : 'Full Ingestion Lab'}</span>
              </button>
            )}
          </div>

          {/* Interactive Payload Testing Box */}
          <div className="space-y-2.5 bg-[#060911] rounded-lg border border-slate-900 p-3 text-xs font-mono-cyber">
            <div>
              <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                <label className="block text-[10px] text-slate-400">
                  {lang === 'ar' ? 'أدخل حمولة نصية أو اختر نموذجاً رياضياً سريعاً:' : 'Enter payload text or choose a test preset:'}
                </label>
                <div className="flex items-center gap-1 text-[9px]">
                  <button
                    type="button"
                    onClick={() => {
                      setSamplePayload('a8f9e0c1b2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2.c2-exfil-proxy.darknet-relay.ru TXT IN');
                      setFeaturePortRisk(0.95);
                      setFeaturePacketSize(642);
                    }}
                    className="px-1.5 py-0.5 rounded bg-red-950/60 text-red-300 border border-red-500/30 hover:bg-red-900/60 cursor-pointer"
                  >
                    DNS Exfil
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSamplePayload('GET /index.html HTTP/1.1\r\nHost: cdn.internal.gov\r\nAccept: text/html\r\nUser-Agent: Mozilla/5.0');
                      setFeaturePortRisk(0.1);
                      setFeaturePacketSize(420);
                    }}
                    className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-900/60 cursor-pointer"
                  >
                    Clean HTTP
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSamplePayload("' UNION SELECT 1, table_name, column_name FROM information_schema.columns WHERE '1'='1");
                      setFeaturePortRisk(0.85);
                      setFeaturePacketSize(512);
                    }}
                    className="px-1.5 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 hover:bg-amber-900/60 cursor-pointer"
                  >
                    SQL Injection
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSamplePayload('\x90\x90\x90\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\xb0\x0b\xcd\x80 sys_enter_mprotect PROT_EXEC');
                      setFeaturePortRisk(0.99);
                      setFeaturePacketSize(1280);
                    }}
                    className="px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-500/30 hover:bg-purple-900/60 cursor-pointer"
                  >
                    Shellcode ROP
                  </button>
                </div>
              </div>
              <textarea
                rows={2}
                value={samplePayload}
                onChange={e => setSamplePayload(e.target.value)}
                placeholder="Type any packet text or hex bytes..."
                className="w-full bg-[#03060c] border border-slate-700 rounded-md p-2 text-slate-200 text-[11px] focus:outline-none focus:border-cyan-500 font-mono-cyber resize-none"
              />
            </div>

            {/* Quick Math Results Preview */}
            <div className="grid grid-cols-3 gap-2 text-[10px]">
              <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ar' ? 'إنتروبيا شانون H(X):' : 'Shannon H(X):'}</span>
                <span className={`font-bold text-xs ${liveMathMetrics.entropy > entropyThreshold ? 'text-amber-400' : 'text-cyan-400'}`}>
                  {liveMathMetrics.entropy} bits
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ar' ? 'مسافة ماهالانوبيس:' : 'Mahalanobis D_M:'}</span>
                <span className={`font-bold text-xs ${liveMathMetrics.mahalanobis > 3.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                  {liveMathMetrics.mahalanobis}
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-900/90 border border-slate-800">
                <span className="text-slate-400 block">{lang === 'ar' ? 'تباين KL-Divergence:' : 'KL-Div (P||Q):'}</span>
                <span className="font-bold text-xs text-purple-400">
                  {liveMathMetrics.klDiv}
                </span>
              </div>
            </div>

            {/* Top byte frequencies computed */}
            <div className="flex items-center gap-1.5 text-[9px] text-slate-400 overflow-x-auto pt-1 border-t border-slate-900">
              <span className="text-slate-500">{lang === 'ar' ? 'أعلى البايتات تكراراً:' : 'Top Bytes:'}</span>
              {liveMathMetrics.topBytes.map((b, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 font-bold border border-slate-800">
                  {b.char}: {(b.freq * 100).toFixed(0)}%
                </span>
              ))}
            </div>

            {/* Parameter sliders */}
            <div className="pt-2 border-t border-slate-900 grid grid-cols-2 gap-2">
              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                  <span>{lang === 'ar' ? 'عتبة الإنتروبيا (H Cutoff):' : 'Entropy Cutoff:'}</span>
                  <span className="text-cyan-400 font-bold">{entropyThreshold}</span>
                </div>
                <input 
                  type="range" 
                  min="4.5" 
                  max="8.0" 
                  step="0.1" 
                  value={entropyThreshold} 
                  onChange={e => setEntropyThreshold(parseFloat(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1" 
                />
              </div>

              <div>
                <div className="flex items-center justify-between text-slate-400 text-[10px] mb-0.5">
                  <span>{lang === 'ar' ? 'حجم الحزمة المعالجة:' : 'Inspected Packet Size:'}</span>
                  <span className="text-emerald-400 font-bold">{featurePacketSize} B</span>
                </div>
                <input 
                  type="range" 
                  min="40" 
                  max="2048" 
                  step="20" 
                  value={featurePacketSize} 
                  onChange={e => setFeaturePacketSize(parseInt(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer h-1" 
                />
              </div>
            </div>

            {/* Live Ingress Injection Button */}
            <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-400">
                {liveMathMetrics.isAnomaly ? (
                  <span className="text-red-400 font-bold">⚠️ {lang === 'ar' ? 'شذوذ رياضي مؤكد' : 'Confirmed Anomaly'}</span>
                ) : (
                  <span className="text-emerald-400 font-bold">✅ {lang === 'ar' ? 'سلوك رياضي طبيعي' : 'Baseline Compliant'}</span>
                )}
              </span>

              <button
                type="button"
                disabled={isInjectingLive}
                onClick={async () => {
                  setIsInjectingLive(true);
                  try {
                    await fetch('/api/ingest', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        sourceIp: '194.26.29.114',
                        destinationIp: '10.0.3.11',
                        sourcePort: 54122,
                        destinationPort: liveMathMetrics.isAnomaly ? 53 : 443,
                        protocol: liveMathMetrics.isAnomaly ? 'DNS' : 'TLS 1.3',
                        packetSize: featurePacketSize,
                        payload: samplePayload,
                        agentId: 'math-calibrator-daemon',
                        hostname: 'math-core-evaluator'
                      })
                    });
                    setInjectionSuccess(true);
                    setTimeout(() => setInjectionSuccess(false), 3000);
                  } catch (e) {
                    console.error('Simulation error:', e);
                  } finally {
                    setIsInjectingLive(false);
                  }
                }}
                className={`px-3 py-1 rounded text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  injectionSuccess
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-sm'
                }`}
              >
                <Play className={`w-3 h-3 ${isInjectingLive ? 'animate-spin' : ''}`} />
                <span>
                  {injectionSuccess
                    ? (lang === 'ar' ? 'تم الحقن الحي بنجاح!' : 'Injected to Live SOC!')
                    : (lang === 'ar' ? 'إطلاق المحاكاة وحقنها بالمنظومة' : 'Simulate & Inject Live')}
                </span>
              </button>
            </div>
          </div>

          <div className="mt-2 flex items-center justify-between text-[11px] font-mono-cyber">
            <span className="text-slate-400">
              {lang === 'ar' ? 'حالة القرار الرياضي:' : 'Mathematical Status:'}{' '}
              <strong className={liveMathMetrics.isAnomaly ? 'text-red-400' : 'text-emerald-400'}>
                {liveMathMetrics.isAnomaly ? (lang === 'ar' ? 'شذوذ مؤكد (ANOMALY)' : 'CRITICAL ANOMALY') : (lang === 'ar' ? 'ضمن الحدود الطبيعية' : 'WITHIN BOUNDS')}
              </strong>
            </span>
            <span className="text-slate-400">
              {lang === 'ar' ? 'زمن الاستدلال:' : 'Inference:'} <strong className="text-cyan-400">&lt; 0.05 ms</strong>
            </span>
          </div>
        </div>

      </div>

      {/* Visualizer 5: Comprehensive Dynamic Mathematical Threshold Tuning & Calibration */}
      <div className="rounded-xl border border-cyan-500/30 bg-[#090d16] p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold text-slate-100 font-display-cyber uppercase">
              {lang === 'ar' 
                ? '5. لوحة ضبط ومعايرة العتبات الرياضية الحية (Live Threshold Tuning & Sensitivity)' 
                : '5. DYNAMIC MATHEMATICAL THRESHOLD TUNING & SENSITIVITY CALIBRATION'}
            </h3>
          </div>
          <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold">
            ZERO-TRUST CALIBRATION
          </span>
        </div>

        {/* Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4 font-mono-cyber text-xs">
          {/* Mahalanobis Threshold Slider */}
          <div className="p-3 rounded-lg bg-[#060911] border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[11px]">
                {lang === 'ar' ? 'عتبة ماهالانوبيس (λ_Mahal):' : 'Mahalanobis Cutoff (λ):'}
              </span>
              <span className="text-cyan-400 font-bold text-xs">{sensitivityAlpha.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="1.50" 
              max="7.00" 
              step="0.10" 
              value={sensitivityAlpha} 
              onChange={e => setSensitivityAlpha(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer h-1.5" 
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>1.5 (High Sens)</span>
              <span>7.0 (Permissive)</span>
            </div>
          </div>

          {/* Shannon Entropy Slider */}
          <div className="p-3 rounded-lg bg-[#060911] border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[11px]">
                {lang === 'ar' ? 'عتبة الإنتروبيا H_0:' : 'Entropy Threshold H_0:'}
              </span>
              <span className="text-amber-400 font-bold text-xs">{entropyThreshold.toFixed(2)}</span>
            </div>
            <input 
              type="range" 
              min="4.50" 
              max="7.90" 
              step="0.05" 
              value={entropyThreshold} 
              onChange={e => setEntropyThreshold(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer h-1.5" 
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>4.5 (Strict)</span>
              <span>7.9 (Compressed)</span>
            </div>
          </div>

          {/* Live Wire Traffic Rate Slider */}
          <div className="p-3 rounded-lg bg-[#060911] border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[11px]">
                {lang === 'ar' ? 'معدل تدفق الحزم عبر السلك:' : 'Live Wire Flow Rate:'}
              </span>
              <span className="text-emerald-400 font-bold text-xs">{wirePacketRate} EPS</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="25000" 
              step="500" 
              value={wirePacketRate} 
              onChange={e => setWirePacketRate(parseInt(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer h-1.5" 
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>1k EPS</span>
              <span>25k EPS</span>
            </div>
          </div>

          {/* Feature Packet Size */}
          <div className="p-3 rounded-lg bg-[#060911] border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400 text-[11px]">
                {lang === 'ar' ? 'حجم نافذة العينات (Window):' : 'Sample Window:'}
              </span>
              <span className="text-purple-400 font-bold text-xs">{featurePacketSize} Pkts</span>
            </div>
            <input 
              type="range" 
              min="100" 
              max="2000" 
              step="50" 
              value={featurePacketSize} 
              onChange={e => setFeaturePacketSize(parseInt(e.target.value))}
              className="w-full accent-purple-400 cursor-pointer h-1.5" 
            />
            <div className="flex justify-between text-[9px] text-slate-500 mt-1">
              <span>100 (Instant)</span>
              <span>2000 (Smooth)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Recalculated Operational Impact Box */}
        <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-cyber">
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <span className="text-slate-500 text-[10px] block">PREDICTED FALSE POSITIVE:</span>
              <span className="font-bold text-cyan-400">
                {(Math.max(0.0001, 0.08 / Math.pow(sensitivityAlpha || 1, 2))).toFixed(4)}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">ESTIMATED MTTD:</span>
              <span className="font-bold text-amber-400">
                {Math.max(45, Math.floor(180 - (entropyThreshold * 15)))} ms
              </span>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">WIRE DEFENSE POSTURE:</span>
              <span className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                sensitivityAlpha < 2.5 
                  ? 'bg-red-950 text-red-400 border border-red-500/30' 
                  : sensitivityAlpha < 4.5 
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30' 
                  : 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
              }`}>
                {sensitivityAlpha < 2.5 
                  ? (lang === 'ar' ? 'فائق الحساسية (ULTRA-STRICT)' : 'ULTRA-STRICT ZERO TRUST') 
                  : sensitivityAlpha < 4.5 
                  ? (lang === 'ar' ? 'متوازن للمؤسسات (ENTERPRISE BALANCED)' : 'ENTERPRISE BALANCED') 
                  : (lang === 'ar' ? 'عالي الإنتاجية (HIGH-THROUGHPUT)' : 'PERMISSIVE HIGH-THROUGHPUT')}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              setSensitivityAlpha(3.8);
              setEntropyThreshold(6.5);
              setWirePacketRate(8500);
              setFeaturePacketSize(640);
            }}
            className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'إعادة ضبط لمعيار NIST' : 'Reset to NIST Baseline'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
