import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  AlertTriangle, 
  Radio, 
  Lock, 
  FileText, 
  RefreshCw, 
  Zap, 
  Activity, 
  Languages, 
  HardDrive,
  History,
  Volume2,
  VolumeX,
  Bell,
  BellRing,
  BellOff,
  Trash2,
  Sliders,
  CheckCircle2,
  Cpu,
  Globe,
  LogOut,
  Building2,
  CreditCard,
  Key,
  Award,
  GraduationCap,
  Crown
} from 'lucide-react';
import { DefconLevel, CommandCenterKPIs } from '../types/cyber';
import { subscriptionService } from '../services/subscriptionService';
import { KestrelLogo } from './KestrelLogo';

interface TopBarProps {
  defconLevel: DefconLevel;
  airGappedMode: boolean;
  onToggleAirGap: () => void;
  onTriggerDeadManSwitch: () => void;
  onOpenReportModal: () => void;
  onOpenSessionHistoryModal?: () => void;
  onOpenGlobalEnterpriseHub?: () => void;
  onOpenCommercialPricing?: () => void;
  onOpenCustomDomainLaunch?: () => void;
  onOpenFounderCockpit?: () => void;
  onOpenPostQuantumShield?: () => void;
  onOpenWhitepaper?: () => void;
  onOpenEnterpriseStandards?: () => void;
  onOpenCyberAcademy?: () => void;
  onLockToPortal?: () => void;
  isMuted?: boolean;
  onToggleMute?: () => void;
  isCriticalAudioEnabled?: boolean;
  onToggleCriticalAudio?: () => void;
  onTestCriticalAudio?: () => void;
  kpis: CommandCenterKPIs;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
  isDeadManActive: boolean;
  onPurgeLogCache: () => void;
  onReindexMerkleTree: () => void;
  onBaselineCalibration: () => void;
  lastMacroMessage?: string | null;
}

export const TopBar: React.FC<TopBarProps> = ({
  defconLevel,
  airGappedMode,
  onToggleAirGap,
  onTriggerDeadManSwitch,
  onOpenReportModal,
  onOpenSessionHistoryModal,
  onOpenGlobalEnterpriseHub,
  onOpenCommercialPricing,
  onOpenCustomDomainLaunch,
  onOpenFounderCockpit,
  onOpenPostQuantumShield,
  onOpenWhitepaper,
  onOpenEnterpriseStandards,
  onOpenCyberAcademy,
  onLockToPortal,
  isMuted = false,
  onToggleMute,
  isCriticalAudioEnabled = true,
  onToggleCriticalAudio,
  onTestCriticalAudio,
  kpis,
  lang,
  onToggleLang,
  isDeadManActive,
  onPurgeLogCache,
  onReindexMerkleTree,
  onBaselineCalibration,
  lastMacroMessage
}) => {
  const [subscriberCount, setSubscriberCount] = useState(() => subscriptionService.getSubscribers().length);
  const [totalMRR, setTotalMRR] = useState(() => subscriptionService.getTotalMRR());

  useEffect(() => {
    return subscriptionService.subscribe((subs) => {
      setSubscriberCount(subs.length);
      setTotalMRR(subs.reduce((sum, s) => sum + s.monthlyPrice, 0));
    });
  }, []);

  const getDefconBadge = (level: DefconLevel) => {
    switch (level) {
      case 0:
        return { label: lang === 'ar' ? 'المستوى 0: مستقر' : 'DEFCON 0: NORMAL', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
      case 1:
        return { label: lang === 'ar' ? 'المستوى 1: استطلاع' : 'DEFCON 1: RECON', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
      case 2:
        return { label: lang === 'ar' ? 'المستوى 2: شذوذ مرتفع' : 'DEFCON 2: ANOMALOUS', color: 'bg-amber-500/20 text-amber-400 border-amber-500/40' };
      case 3:
        return { label: lang === 'ar' ? 'المستوى 3: هجوم مؤكد' : 'DEFCON 3: ATTACK CONFIRMED', color: 'bg-orange-500/20 text-orange-400 border-orange-500/40' };
      case 4:
        return { label: lang === 'ar' ? 'المستوى 4: هجوم منسق' : 'DEFCON 4: COORDINATED BLITZ', color: 'bg-red-500/20 text-red-400 border-red-500/40' };
      case 5:
        return { label: lang === 'ar' ? 'المستوى 5: حظر تام' : 'DEFCON 5: BLACKOUT LOCKDOWN', color: 'bg-purple-500/30 text-purple-300 border-purple-500/50' };
      default:
        return { label: 'DEFCON', color: 'bg-slate-700 text-slate-300' };
    }
  };

  const defcon = getDefconBadge(defconLevel);

  return (
    <header className="border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
      <div className="flex flex-wrap items-center justify-between gap-3 max-w-[1920px] mx-auto">
        
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div title={lang === 'ar' ? 'شعار كستريل: يقظةٌ ثابتة.. وانقضاضٌ لحظي في سرعة النبض' : 'KESTREL: Steadfast Vigilance. Sub-Millisecond Strike.'}>
            <KestrelLogo size="md" lang={lang} glow={true} />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-wide text-white font-mono flex items-center gap-1.5">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-emerald-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.4)]">
                  KESTREL
                </span>
                <span className="text-slate-200 font-bold text-xs sm:text-sm">
                  {lang === 'ar' ? '— منظومة الدفاع السيبراني الذاتي' : '— Autonomous Cyber-Defense'}
                </span>
              </h1>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 font-bold hidden sm:inline">
                KESTREL-OS v4.2.8
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-emerald-300 font-bold">
                  {lang === 'ar' ? 'رادار الصقر: نشط 🦅' : 'Falcon Radar: Armed 🦅'}
                </span>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                {lang === 'ar' ? 'معدل المعالجة:' : 'Stream:'} <strong className="text-cyan-400">{(kpis.ingestionEps / 1000000).toFixed(2)}M EPS</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-300">
                {lang === 'ar' ? 'زمن الطابور:' : 'Queue:'} <strong className="text-emerald-400">{kpis.queueLatencyMs.toFixed(2)} ms</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Tactical Badges & Real-time Metrics */}
        <div className="flex items-center flex-wrap gap-2 text-xs font-mono-cyber">
          {/* DEFCON Badge */}
          <div className={`px-2.5 py-1 rounded-md border text-xs font-bold flex items-center gap-1.5 ${defcon.color}`}>
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>{defcon.label}</span>
          </div>

          {/* MTTD KPI */}
          <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>MTTD:</span>
            <span className="font-bold text-amber-400">{kpis.mttdMs} ms</span>
          </div>

          {/* MTTR KPI */}
          <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>MTTR:</span>
            <span className="font-bold text-emerald-400">{kpis.mttrSec}s</span>
          </div>

          {/* Efficacy */}
          <div className="px-2.5 py-1 rounded-md bg-slate-900/90 border border-slate-800 text-slate-300 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>AEI:</span>
            <span className="font-bold text-cyan-400">{kpis.efficacyIndex}%</span>
          </div>
        </div>

        {/* Global Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Critical Threat Severity Audio Alert Toggle (Allows Operators to be notified without visual monitoring) */}
          {onToggleCriticalAudio && (
            <div className="flex items-center rounded-lg border border-slate-800 bg-slate-900/90 p-0.5 shadow-sm">
              <button
                onClick={onToggleCriticalAudio}
                id="critical-audio-toggle-btn"
                title={
                  isCriticalAudioEnabled
                    ? (lang === 'ar' ? 'تنبيه صوتي للحالات الحرجة مفعّل (إشعار صوتي عند تحول التهديد إلى CRITICAL)' : 'Critical Threat Audio Alert: ACTIVE (Plays siren when threat severity changes to CRITICAL)')
                    : (lang === 'ar' ? 'تنبيه صوتي للحالات الحرجة معطل (انقر للتفعيل للمراقبة دون شاشة)' : 'Critical Threat Audio Alert: MUTED (Click to enable audio notification for CRITICAL threats)')
                }
                className={`px-2.5 py-1 rounded text-xs font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer ${
                  isCriticalAudioEnabled && !isMuted
                    ? 'bg-gradient-to-r from-red-950/90 via-rose-900/60 to-red-900/80 border border-red-500/80 text-red-200 shadow-[0_0_12px_rgba(239,68,68,0.35)]'
                    : 'bg-transparent border border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                {isCriticalAudioEnabled && !isMuted ? (
                  <BellRing className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                ) : (
                  <BellOff className="w-3.5 h-3.5 text-slate-500" />
                )}
                <span className="font-bold">
                  {lang === 'ar' ? 'تنبيه حرج' : 'Crit Audio'}
                </span>
                <span
                  className={`text-[9px] px-1 py-0.2 rounded font-mono-cyber font-bold ${
                    isCriticalAudioEnabled && !isMuted
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCriticalAudioEnabled && !isMuted ? 'ON' : 'OFF'}
                </span>
              </button>

              {onTestCriticalAudio && (
                <button
                  onClick={onTestCriticalAudio}
                  id="test-critical-audio-btn"
                  title={lang === 'ar' ? 'اختبار صوت صفارة الإنذار الحرج (تأكد من عمل الصوت)' : 'Test Critical Threat Siren (Verify volume and speaker output)'}
                  className="px-1.5 py-1 text-[10px] text-slate-400 hover:text-red-300 hover:bg-red-950/40 rounded transition-colors cursor-pointer border-l border-slate-800"
                >
                  {lang === 'ar' ? 'تجربة' : 'Test'}
                </button>
              )}
            </div>
          )}

          {/* Master Audio Tactical Feedback Toggle */}
          {onToggleMute && (
            <button
              onClick={onToggleMute}
              id="audio-mute-toggle-btn"
              title={isMuted ? (lang === 'ar' ? 'تشغيل الصوت العام' : 'Unmute Master Audio') : (lang === 'ar' ? 'كتم الصوت العام' : 'Mute Master Audio')}
              className={`p-1.5 rounded text-xs border transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300' 
                  : 'bg-cyan-950/80 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
              }`}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse-subtle" />}
            </button>
          )}

          {/* Session History Archive */}
          {onOpenSessionHistoryModal && (
            <button
              onClick={onOpenSessionHistoryModal}
              id="session-history-btn"
              title={lang === 'ar' ? 'أرشيف وتاريخ الجلسات السابقة' : 'View Stored Session Snapshots'}
              className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <History className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'الأرشيف' : 'History'}</span>
            </button>
          )}

          {/* Air-gap Toggle */}
          <button
            onClick={onToggleAirGap}
            id="airgap-toggle-btn"
            title={lang === 'ar' ? 'تبديل وضع الجزيرة السيبرانية المعزولة (Air-Gapped)' : 'Toggle Air-Gapped Islanding Mode'}
            className={`px-2.5 py-1.5 rounded text-xs font-medium flex items-center gap-1.5 border transition-all cursor-pointer ${
              airGappedMode 
                ? 'bg-purple-900/50 border-purple-500 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            <span>{airGappedMode ? (lang === 'ar' ? 'الجزيرة: معزولة' : 'Air-Gap: ON') : (lang === 'ar' ? 'نمط الجزيرة' : 'Air-Gap')}</span>
          </button>

          {/* Emergency Dead-Man Switch */}
          <button
            onClick={onTriggerDeadManSwitch}
            id="deadman-switch-btn"
            className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              isDeadManActive
                ? 'bg-amber-600/30 text-amber-300 border-amber-500 ring-2 ring-amber-500/50'
                : 'bg-red-950/70 border-red-700/80 text-red-300 hover:bg-red-900/80 hover:text-red-100 shadow-[0_0_12px_rgba(239,68,68,0.25)]'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
            <span>{isDeadManActive ? (lang === 'ar' ? 'تعليق مشرف' : 'OVERRIDE ON') : (lang === 'ar' ? 'مفتاح الطوارئ' : 'DEAD-MAN OVERRIDE')}</span>
          </button>

          {/* Forensic Executive Report */}
          <button
            onClick={onOpenReportModal}
            id="export-report-btn"
            className="px-2.5 py-1.5 rounded text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{lang === 'ar' ? 'تقرير العمليات' : 'Exec Report'}</span>
          </button>

          {/* Global Sovereign & Enterprise Mesh Hub */}
          {onOpenGlobalEnterpriseHub && (
            <button
              onClick={onOpenGlobalEnterpriseHub}
              id="global-enterprise-hub-btn"
              data-testid="global-enterprise-hub-btn"
              title={lang === 'ar' ? 'منظومة السيادة والأمن السيبراني العالمية (STIX / Connectors / Compliance)' : 'Sovereign & Global Enterprise Command Mesh'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-blue-900/60 to-cyan-900/60 hover:from-blue-800/80 hover:to-cyan-800/80 border border-cyan-500/50 text-cyan-200 hover:text-white flex items-center gap-1.5 shadow-[0_0_12px_rgba(6,182,212,0.25)] transition-all cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400 animate-spin-slow" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'المنظومة العالمية' : 'Global Hub'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-400/40 font-mono">
                TIER-4
              </span>
            </button>
          )}

          {/* Post-Quantum Cryptography Shield Button (NIST FIPS 203/204) */}
          {onOpenPostQuantumShield && (
            <button
              onClick={onOpenPostQuantumShield}
              id="post-quantum-shield-btn"
              data-testid="post-quantum-shield-btn"
              title={lang === 'ar' ? 'درع التشفير المقاوم للحوسبة الكمومية (NIST PQC FIPS 203 Kyber / Dilithium)' : 'Post-Quantum Cryptography Shield (NIST PQC FIPS 203/204)'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-purple-950 via-indigo-950/80 to-purple-950 hover:from-purple-900 hover:to-indigo-900 border border-purple-500/60 text-purple-200 hover:text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(168,85,247,0.3)] transition-all cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'درع ما بعد الكم' : 'PQC Shield'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-400/50 font-mono font-black">
                FIPS-203
              </span>
            </button>
          )}

          {/* Commercial Licensing & API Keys Button (Founder Ownership) */}
          {onOpenCommercialPricing && (
            <button
              onClick={onOpenCommercialPricing}
              id="commercial-pricing-btn"
              data-testid="commercial-pricing-btn"
              title={lang === 'ar' ? 'الباقات الشهرية وتفاصيل اشتراكات العملاء للمؤسس TAHA SETRII' : 'Founder TAHA SETRII Client Subscriptions & MRR Ledger'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-emerald-950 via-emerald-900/60 to-emerald-950 hover:from-emerald-900 hover:to-emerald-800 border border-emerald-500/70 text-emerald-200 hover:text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] transition-all cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">
                {lang === 'ar' ? `مشتركو المؤسس (${subscriberCount})` : `Clients (${subscriberCount})`}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 font-mono font-black">
                ${totalMRR.toLocaleString()}/mo
              </span>
            </button>
          )}

          {/* Founder Executive Cockpit Button (Private Sovereignty & Controls) */}
          {onOpenFounderCockpit && (
            <button
              onClick={onOpenFounderCockpit}
              id="founder-cockpit-topbar-btn"
              data-testid="founder-cockpit-topbar-btn"
              title={lang === 'ar' ? 'قمرة قيادة المؤسس TAHA SETRII — إدارة النطاق السيادي والاشتراكات والإنطلاق العام' : 'Founder TAHA SETRII Executive Cockpit — Domain, Subscriptions & Sovereign Controls'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-amber-950 via-slate-900 to-emerald-950 hover:from-amber-900 hover:to-emerald-900 border border-amber-500/70 text-amber-200 hover:text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.3)] transition-all cursor-pointer"
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono font-bold">
                {lang === 'ar' ? 'قمرة المؤسس 🇲🇦' : 'Founder Cockpit 🇲🇦'}
              </span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-black hidden sm:inline">
                ${totalMRR.toLocaleString()}/mo
              </span>
            </button>
          )}

          {/* Enterprise Protection Standards Button */}
          {onOpenEnterpriseStandards && (
            <button
              onClick={onOpenEnterpriseStandards}
              id="topbar-standards-btn"
              data-testid="topbar-standards-btn"
              title={lang === 'ar' ? 'معايير المنصة وكيف تحمي الشركات ومؤسسات الأعمال' : 'Enterprise Protection Standards & Corporate Shield'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">{lang === 'ar' ? 'معايير الشركات' : 'Standards'}</span>
            </button>
          )}

          {/* Sovereign Cyber Academy Button */}
          {onOpenCyberAcademy && (
            <button
              onClick={onOpenCyberAcademy}
              id="topbar-cyber-academy-btn"
              data-testid="topbar-cyber-academy-btn"
              title={lang === 'ar' ? 'أكاديمية طه الستري للأمن السيبراني والاختراق الأخلاقي من الصفر إلى الاحتراف' : 'TAHA SETRII Sovereign Cyber & Ethical Hacking Academy'}
              className="px-2.5 py-1.5 rounded text-xs font-bold bg-gradient-to-r from-cyan-950 via-teal-950 to-cyan-950 hover:from-cyan-900 hover:to-teal-900 border border-cyan-400/80 text-cyan-300 hover:text-white flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all cursor-pointer"
            >
              <GraduationCap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'كتاب الـ 3,250 صفحة والأكاديمية 📖' : '3,250p Codex & Academy 📖'}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-900 text-cyan-200 border border-cyan-400/40 font-mono font-bold">
                3,250p
              </span>
            </button>
          )}

          {/* Language Switch */}
          <button
            onClick={onToggleLang}
            id="lang-toggle-btn"
            className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title={lang === 'ar' ? 'Switch to English' : 'التحويل للعربية'}
          >
            <Languages className="w-4 h-4" />
          </button>

          {/* Lock & Return to Sovereign Portal */}
          {onLockToPortal && (
            <button
              onClick={onLockToPortal}
              id="lock-portal-btn"
              data-testid="lock-portal-btn"
              title={lang === 'ar' ? 'قفل الجلسة والعودة للواجهة الرئيسية (Sovereign Gate)' : 'Lock Session & Return to Sovereign Gate'}
              className="px-2 py-1.5 rounded bg-red-950/70 hover:bg-red-900/90 border border-red-500/50 text-red-200 hover:text-white flex items-center gap-1 text-xs font-mono transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">{lang === 'ar' ? 'قفل البوابة' : 'Lock Gate'}</span>
            </button>
          )}
        </div>

      </div>

      {/* Quick Macros Shortcut Bar */}
      <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-xs font-mono-cyber">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Quick Macros Label */}
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 font-bold text-[11px]">
            <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{lang === 'ar' ? 'إجراءات ماكرو سريعة:' : 'Quick Macros:'}</span>
          </div>

          {/* Macro 1: Purge Log Cache */}
          <button
            onClick={onPurgeLogCache}
            id="macro-purge-cache-btn"
            title={lang === 'ar' ? 'إفراغ ذاكرة التخزين المؤقت للسجلات وتصفير طابور الحزم الفورية' : 'Purge transient telemetry logs and flush wire cache queue'}
            className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-red-950/60 border border-slate-700 hover:border-red-500/60 text-slate-300 hover:text-red-300 flex items-center gap-1.5 transition-all text-[11px] font-medium cursor-pointer shadow-sm active:scale-95"
          >
            <Trash2 className="w-3 h-3 text-red-400" />
            <span>{lang === 'ar' ? 'إفراغ ذاكرة السجلات' : 'Purge Log Cache'}</span>
          </button>

          {/* Macro 2: Re-index Merkle Tree */}
          <button
            onClick={onReindexMerkleTree}
            id="macro-reindex-merkle-btn"
            title={lang === 'ar' ? 'إعادة حساب وتوثيق جذور شجرة ميركل المشفرة وتوقيع كتلة تدقيق جديدة' : 'Re-compute cryptographic hashes and seal verified Merkle block'}
            className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-cyan-950/60 border border-slate-700 hover:border-cyan-500/60 text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-all text-[11px] font-medium cursor-pointer shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3 h-3 text-cyan-400" />
            <span>{lang === 'ar' ? 'إعادة فهرسة شجرة ميركل' : 'Re-index Merkle Tree'}</span>
          </button>

          {/* Macro 3: Baseline Calibration */}
          <button
            onClick={onBaselineCalibration}
            id="macro-baseline-calibration-btn"
            title={lang === 'ar' ? 'معايرة خط الأساس الرياضي متعدد المتغيرات وتصفير انحرافات Page-Hinkley' : 'Recalibrate multivariate Gaussian baseline and tune covariance matrix'}
            className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-emerald-950/60 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 flex items-center gap-1.5 transition-all text-[11px] font-medium cursor-pointer shadow-sm active:scale-95"
          >
            <Sliders className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'ar' ? 'معايرة خط الأساس' : 'Baseline Calibration'}</span>
          </button>
        </div>

        {/* Operational State & Feedback Notification */}
        <div className="flex items-center gap-2">
          {lastMacroMessage ? (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-[10px] animate-pulse">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              <span className="font-semibold">{lastMacroMessage}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>{lang === 'ar' ? 'نظام تحييد سلكي فوري (Zero-Trust Live Engine)' : 'Wire-Speed Zero-Trust Engine'}</span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
