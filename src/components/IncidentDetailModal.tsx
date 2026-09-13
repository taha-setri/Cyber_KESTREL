import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  TrendingUp, 
  Cpu, 
  Terminal, 
  Clock,
  Layers,
  FileCheck,
  Download,
  FileDown,
  Check,
  BellRing,
  BellOff,
  AlertTriangle
} from 'lucide-react';
import { ThreatVector } from '../types/cyber';
import { downloadThreatPcap } from '../services/pcapGenerator';

interface IncidentDetailModalProps {
  threat: ThreatVector | null;
  onClose: () => void;
  lang: 'ar' | 'en';
  onUpdateThreatSeverity?: (threatId: string, newSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => void;
  isCriticalAudioEnabled?: boolean;
  onToggleCriticalAudio?: () => void;
}

export const IncidentDetailModal: React.FC<IncidentDetailModalProps> = ({
  threat,
  onClose,
  lang,
  onUpdateThreatSeverity,
  isCriticalAudioEnabled = true,
  onToggleCriticalAudio
}) => {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [downloadedFileName, setDownloadedFileName] = useState<string | null>(null);

  if (!threat) return null;

  const handleDownloadPcap = () => {
    if (!threat) return;
    const fileName = downloadThreatPcap(threat);
    setDownloadedFileName(fileName);
    setIsDownloaded(true);
    setTimeout(() => {
      setIsDownloaded(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-xl border border-cyan-500/40 bg-[#090d16] p-6 shadow-[0_0_50px_rgba(6,182,212,0.15)] font-mono-cyber text-xs">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100 font-display-cyber">
                  {lang === 'ar' ? threat.titleAr : threat.title}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] border font-bold ${
                  threat.severity === 'CRITICAL'
                    ? 'bg-red-500/30 text-red-300 border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]'
                    : threat.severity === 'HIGH'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40'
                }`}>
                  {threat.severity}
                </span>
              </div>
              <div className="text-[10px] text-slate-400">
                ID: <strong className="text-cyan-400">{threat.id}</strong> | {new Date(threat.timestamp).toISOString()}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Severity Classification & Audio Notification Control Bar */}
        <div className="p-2.5 rounded-lg border border-slate-800/80 bg-slate-900/90 mb-3 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 text-[10px] font-semibold">
              {lang === 'ar' ? 'تصعيد مستوى الخطورة:' : 'Escalate Severity:'}
            </span>
            <div className="flex items-center gap-1">
              {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const).map((sev) => {
                const isActive = threat.severity === sev;
                let colorClasses = 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-600';
                if (isActive) {
                  if (sev === 'CRITICAL') colorClasses = 'bg-red-950 border-red-500 text-red-300 shadow-[0_0_10px_rgba(239,68,68,0.4)] font-bold';
                  else if (sev === 'HIGH') colorClasses = 'bg-amber-950 border-amber-500 text-amber-300 font-bold';
                  else if (sev === 'MEDIUM') colorClasses = 'bg-yellow-950 border-yellow-500 text-yellow-300 font-bold';
                  else colorClasses = 'bg-emerald-950 border-emerald-500 text-emerald-300 font-bold';
                }
                return (
                  <button
                    key={sev}
                    onClick={() => onUpdateThreatSeverity && onUpdateThreatSeverity(threat.id, sev)}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono-cyber border transition-all cursor-pointer ${colorClasses}`}
                    title={
                      sev === 'CRITICAL' 
                        ? (lang === 'ar' ? 'تصعيد الحالة إلى حرج (CRITICAL) - يطلق صفارة الإنذار التكتيكية' : 'Set severity to CRITICAL - Dispatches distinct tactical audio alarm') 
                        : undefined
                    }
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Audio Alert Status & Toggle */}
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-slate-400">
              {lang === 'ar' ? 'الإنذار الصوتي للحرج:' : 'Critical Siren Alert:'}
            </span>
            {onToggleCriticalAudio ? (
              <button
                onClick={onToggleCriticalAudio}
                title={
                  isCriticalAudioEnabled 
                    ? (lang === 'ar' ? 'انقر لكتم صوت الإنذار للحالات الحرجة' : 'Click to mute CRITICAL audio alerts')
                    : (lang === 'ar' ? 'انقر لتفعيل صوت الإنذار للحالات الحرجة' : 'Click to enable CRITICAL audio alerts')
                }
                className={`px-2 py-0.5 rounded border flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCriticalAudioEnabled
                    ? 'bg-red-950/80 border-red-500/70 text-red-300'
                    : 'bg-slate-900 border-slate-700 text-slate-500'
                }`}
              >
                {isCriticalAudioEnabled ? <BellRing className="w-3 h-3 text-red-400 animate-pulse" /> : <BellOff className="w-3 h-3 text-slate-500" />}
                <span className="font-bold">{isCriticalAudioEnabled ? (lang === 'ar' ? 'مفعّل' : 'ACTIVE') : (lang === 'ar' ? 'صامت' : 'MUTED')}</span>
              </button>
            ) : (
              <span className="px-1.5 py-0.2 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-bold">
                {isCriticalAudioEnabled ? 'ACTIVE' : 'MUTED'}
              </span>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'مصدر الهجوم:' : 'Source Ingress:'}</span>
              <p className="font-bold text-slate-200 mt-0.5">{threat.sourceIp}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'الأصل المستهدف:' : 'Targeted Asset:'}</span>
              <p className="font-bold text-slate-200 mt-0.5">{threat.targetAsset}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'التحييد الذاتي:' : 'Actuator Used:'}</span>
              <p className="font-bold text-emerald-400 mt-0.5">{threat.actuatorUsed}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/90 border border-slate-800">
              <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'الثقة البايزية:' : 'Bayesian Posterior:'}</span>
              <p className="font-bold text-cyan-400 mt-0.5">{(threat.bayesianConfidence * 100).toFixed(2)}%</p>
            </div>
          </div>

          {/* Mathematical Proof Box */}
          <div className="p-4 rounded-lg bg-[#060911] border border-cyan-500/30">
            <div className="flex items-center gap-2 mb-2 text-cyan-300 font-bold font-display-cyber text-xs">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'الإثبات الرياضي للشذوذ السلوكي (Mathematical Proof)' : 'MATHEMATICAL ANOMALY PROOF (SIGNATURE-FREE)'}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px]">
              <div>
                <span className="text-slate-400">{lang === 'ar' ? 'إنتروبيا شانون المرصودة:' : 'Observed Shannon Entropy H(X):'}</span>
                <p className="text-slate-200 font-bold">{threat.mathematicalProof.shannonEntropy} bits (Baseline: {threat.mathematicalProof.baselineEntropy} bits)</p>
              </div>
              <div>
                <span className="text-slate-400">{lang === 'ar' ? 'تباين كولباك-ليبلير (KL Divergence):' : 'Kullback-Leibler Divergence:'}</span>
                <p className="text-amber-400 font-bold">{threat.mathematicalProof.klDivergence} (Threshold &gt; 1.8)</p>
              </div>
              <div>
                <span className="text-slate-400">{lang === 'ar' ? 'مسافة ماهالانوبيس متعددة الأبعاد:' : 'Mahalanobis Covariance Distance D_M:'}</span>
                <p className="text-red-400 font-bold">{threat.mahalanobisDistance} (Critical &gt; 3.0)</p>
              </div>
              <div>
                <span className="text-slate-400">{lang === 'ar' ? 'بواقي مرشح كالمان (Innovation Residual):' : 'Kalman State-Space Residual:'}</span>
                <p className="text-purple-400 font-bold">{threat.mathematicalProof.kalmanResidual} &sigma;</p>
              </div>
            </div>
          </div>

          {/* Forensic Packet Capture (PCAP) Banner */}
          <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/40 flex items-center justify-between flex-wrap gap-2 text-[11px]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                <FileDown className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-slate-100 flex items-center gap-1.5">
                  {lang === 'ar' ? 'ملف التقاط الحزم الخام (PCAP Snippet):' : 'Raw Wire Packet Capture (PCAP Snippet):'}
                  <span className="text-[9px] font-mono px-1 py-0.2 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
                    libpcap 2.4
                  </span>
                </span>
                <p className="text-[10px] text-slate-400">
                  {lang === 'ar'
                    ? 'لقطة جنائية تتضمن ترويسات Ethernet وIPv4 وحمولة التهديد، جاهزة للتحليل في Wireshark أو tcpdump.'
                    : 'Downloadable raw binary capture with Ethernet/IP headers and threat payload for deep Wireshark analysis.'}
                </p>
                {downloadedFileName && (
                  <p className="text-[10px] text-emerald-400 font-mono mt-0.5">
                    {lang === 'ar' ? `تم التنزيل كملف: ${downloadedFileName}` : `Saved as: ${downloadedFileName}`}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleDownloadPcap}
              id="download-pcap-body-btn"
              className="px-3 py-1.5 rounded-lg bg-cyan-950/90 hover:bg-cyan-900 border border-cyan-500/60 text-cyan-300 hover:text-white flex items-center gap-1.5 transition-all font-bold cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.25)] active:scale-95 shrink-0"
            >
              {isDownloaded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">{lang === 'ar' ? 'تم التنزيل بنجاح' : 'Downloaded (.pcap)'}</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تنزيل مقتطف PCAP' : 'Download PCAP Snippet'}</span>
                </>
              )}
            </button>
          </div>

          {/* MITRE ATT&CK & Blast Radius Analysis */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">MITRE ATT&CK Tactic & Technique:</span>
              <p className="font-bold text-slate-200 mt-1">{threat.mitreTactic}</p>
              <p className="text-slate-400 text-[10px] mt-1">
                {lang === 'ar' ? 'تم الاعتراض في مرحلة النفاذ الأولى قبل التوسع الأفقي.' : 'Intercepted during initial ingress phase prior to horizontal propagation.'}
              </p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-slate-500 text-[10px]">{lang === 'ar' ? 'احتواء نصف قطر الانفجار:' : 'Blast Radius Containment:'}</span>
              <p className="font-bold text-emerald-400 mt-1">{threat.blastRadiusNodes} {lang === 'ar' ? 'عقدة متأثرة محصورة فقط' : 'Nodes Confined'}</p>
              <p className="text-slate-400 text-[10px] mt-1">
                {lang === 'ar' ? 'قواعد بيانات المهام الحرجة Tier-0 تعمل بنسبة 100% دون انقطاع.' : 'Zero downtime to core operational databases.'}
              </p>
            </div>
          </div>

          {/* Actuator Execution & Forensic Fingerprint */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[10px] text-slate-400">
            <div className="flex items-center justify-between text-slate-300 font-bold mb-1">
              <span>{lang === 'ar' ? 'حالة التحييد الميكانيكي الفوري:' : 'Wire-Speed Actuation Status:'}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CLOSED & AUDITED
              </span>
            </div>
            <p>
              {lang === 'ar'
                ? 'تم إسقاط الحزم المشبوهة عند بطاقة الشبكة وتطبيق قواعد العزل الشبكي الفوري خلال أقل من 1.2 ميلي ثانية. تم توثيق الحادثة في كتلة ميركل المشفرة.'
                : 'Traffic dropped at NIC driver layer via eBPF XDP filter. Zero packets reached user-space application memory.'}
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
          {/* Download PCAP Snippet Button */}
          <button
            onClick={handleDownloadPcap}
            id="download-pcap-snippet-btn"
            className="px-3.5 py-1.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-900 border border-cyan-500/50 text-cyan-300 hover:text-cyan-100 flex items-center gap-2 text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.15)] active:scale-95"
          >
            {isDownloaded ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">{lang === 'ar' ? 'تم تنزيل ملف PCAP' : 'PCAP Saved'}</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'تنزيل مقتطف PCAP' : 'Download PCAP Snippet'}</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            id="close-incident-modal-btn"
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق نافذة التفاصيل' : 'Close Details'}
          </button>
        </div>

      </div>
    </div>
  );
};
