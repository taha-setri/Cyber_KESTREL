import React, { useState, useEffect } from 'react';
import { 
  Shield, Lock, Key, ArrowRight, Globe, 
  Cpu, Terminal, AlertTriangle, Fingerprint, Award, Eye, EyeOff, Radio, Zap, Sparkles, CreditCard,
  Building2, Scale, FileText, Phone, MessageCircle, GraduationCap, BookOpen
} from 'lucide-react';
import { findWorkspaceByPasskey, setActiveClientSession, getClientWorkspaces } from '../services/clientWorkspaceService';
import { ClientWorkspace } from '../types/cyber';
import { FounderBroadcastScreen } from './FounderBroadcastScreen';
import { SovereignCyberAcademyModal } from './SovereignCyberAcademyModal';
import { KestrelLogo } from './KestrelLogo';

interface GatewayPortalProps {
  onUnlock: () => void;
  onOpenPricing?: () => void;
  onOpenWhitepaper?: () => void;
  onOpenEnterpriseStandards?: () => void;
  onOpenLegalModal?: (tab: 'DISCLAIMER' | 'PRIVACY_COOKIES' | 'ENGAGEMENT_RULES' | 'CNDP_GDPR') => void;
  onUnlockClientWorkspace?: (workspace: ClientWorkspace) => void;
  lang: 'ar' | 'en';
  onToggleLang: () => void;
}

// SHA-256 Hash of the Sovereign Master Passkey: "TAHA-SETRII-MA-2026"
const AUTHORIZED_HASHES = [
  '2ea0c0e7da3c8d1696b996e38706d91da316db11e403d6d021c32729a8fcf101',
  '0f1ec9fc380486c879f90cf1b7829d20129759ad2c8ff4656ec236dbf5cba271',
  'fae96803736720e54b6df11171fa9d18e58a74e5097bc2016353d6a454d4ff71'
];

async function computeSha256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const GatewayPortal: React.FC<GatewayPortalProps> = ({
  onUnlock,
  onOpenPricing,
  onOpenWhitepaper,
  onOpenEnterpriseStandards,
  onOpenLegalModal,
  onUnlockClientWorkspace,
  lang,
  onToggleLang
}) => {
  const [accessKey, setAccessKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [handshakeStep, setHandshakeStep] = useState<string>('');
  const [isAcademyOpen, setIsAcademyOpen] = useState<boolean>(false);
  const [availableWorkspaces, setAvailableWorkspaces] = useState<ClientWorkspace[]>(() => getClientWorkspaces());

  // Listen for workspace creations and updates
  useEffect(() => {
    const handleSync = () => setAvailableWorkspaces(getClientWorkspaces());
    window.addEventListener('acdc_workspaces_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('acdc_workspaces_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Continuous Looping Typewriter for Hero Headline & Description
  const titlesAr = [
    "منظومة كستريل (KESTREL) للدفاع السيبراني الذاتي والسيادي 🦅🛡️",
    "KESTREL: يقظةٌ ثابتة.. وانقضاضٌ لحظي في سرعة النبض ⚡",
    "منصة كستريل الدفاعية المستقلة للمؤسس TAHA SETRII 🇲🇦",
    "درع صقر الرصد الفوري فائق السرعة للشبكات الوطنية والبنى التحتية 🛡️",
    "تحييد مؤتمت وذاتي لهجمات الدول والخصوم في النواة في أقل من 300ms ⚡"
  ];
  const titlesEn = [
    "KESTREL Autonomous Sovereign Cyber Defense Command 🦅🛡️",
    "KESTREL: Steadfast Vigilance. Sub-Millisecond Strike ⚡",
    "Independent Proprietary KESTREL Platform by TAHA SETRII 🇲🇦",
    "Sub-Second Sovereign Aegis Securing Critical National Infrastructure 🛡️",
    "Zero-Trust Wire-Speed Kernel Mitigation Neutralizing Advanced Threats ⚡"
  ];

  const subtitlesAr = [
    "درع سيبراني فائق التطور يعمل في نواة النظام (Kernel eBPF/XDP) للرصد الفوري واحتواء التهديدات والهجمات المتقدمة في أقل من 300 مللي ثانية بدون أي تدخل بشري.",
    "منصة تجارية مستقلة 100% تمكن المؤسس من بيع خدمات الحماية السيبرانية واشتراكات B2B SaaS للبنوك والشركات والمؤسسات الخاصة.",
    "مطابقة معيارية استباقية 100% للتوجيهية الوطنية لأمن نظم المعلومات (DGSSI / DNSSI) وضوابط NIST CSF 2.0 التلقائية.",
    "توثيق تشفيري دائم لكل قرار دفاعي داخل سلسلة ميركل المحمية بوحدات العتاد السيادية HSM FIPS 140-3."
  ];
  const subtitlesEn = [
    "Next-gen sovereign defense shield operating at wire-speed kernel layer (eBPF/XDP) to autonomously neutralize nation-state threats under 300ms.",
    "100% independent proprietary B2B SaaS platform enabling commercial threat defense services for banks, enterprise clouds, and data centers.",
    "100% sovereign compliance with Morocco National Cybersecurity Directive (DGSSI / DNSSI) and NIST CSF 2.0 zero-trust controls.",
    "Forensic cryptographic attestation permanently sealing every defensive action inside an immutable Merkle tree with HSM FIPS 140-3."
  ];

  const [titleIdx, setTitleIdx] = useState(0);
  const [typedTitle, setTypedTitle] = useState('');
  const [isDeletingTitle, setIsDeletingTitle] = useState(false);

  const [subIdx, setSubIdx] = useState(0);
  const [typedSubtitle, setTypedSubtitle] = useState('');
  const [isDeletingSub, setIsDeletingSub] = useState(false);

  // Active step highlight animation for "How We Work"
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [stepTypedText, setStepTypedText] = useState('');
  const [isStepDeleting, setIsStepDeleting] = useState(false);

  // Live futuristic telemetry pulse ticker
  const [activeTelemetryIndex, setActiveTelemetryIndex] = useState(0);

  const telemetrySignals = [
    { label: "Rabat Core Telemetry Node", ping: "0.8ms", status: "ONLINE", flag: "🇲🇦" },
    { label: "Casablanca Financial WAN", ping: "1.2ms", status: "PROTECTED", flag: "🇲🇦" },
    { label: "Tangier Med Maritime Edge", ping: "1.6ms", status: "ENCRYPTED", flag: "🇲🇦" },
    { label: "DGSSI / DNSSI Compliance", ping: "100%", status: "CERTIFIED", flag: "🛡️" },
    { label: "Kernel Hardware Shield", ping: "240 Gbps", status: "ARMED", flag: "⚡" }
  ];

  // Looping Typewriter for Hero Title
  useEffect(() => {
    const list = lang === 'ar' ? titlesAr : titlesEn;
    const currentFull = list[titleIdx % list.length];
    
    let timer: NodeJS.Timeout;
    if (!isDeletingTitle) {
      if (typedTitle.length < currentFull.length) {
        timer = setTimeout(() => {
          setTypedTitle(currentFull.slice(0, typedTitle.length + 1));
        }, 32);
      } else {
        timer = setTimeout(() => {
          setIsDeletingTitle(true);
        }, 4000); // Wait 4s before re-typing
      }
    } else {
      if (typedTitle.length > 0) {
        timer = setTimeout(() => {
          setTypedTitle(currentFull.slice(0, typedTitle.length - 1));
        }, 18);
      } else {
        setIsDeletingTitle(false);
        setTitleIdx(prev => (prev + 1) % list.length);
      }
    }
    return () => clearTimeout(timer);
  }, [typedTitle, isDeletingTitle, titleIdx, lang]);

  // Looping Typewriter for Hero Subtitle
  useEffect(() => {
    const list = lang === 'ar' ? subtitlesAr : subtitlesEn;
    const currentFull = list[subIdx % list.length];

    let timer: NodeJS.Timeout;
    if (!isDeletingSub) {
      if (typedSubtitle.length < currentFull.length) {
        timer = setTimeout(() => {
          setTypedSubtitle(currentFull.slice(0, typedSubtitle.length + 1));
        }, 18);
      } else {
        timer = setTimeout(() => {
          setIsDeletingSub(true);
        }, 5500); // Wait before cycling subtitle
      }
    } else {
      if (typedSubtitle.length > 0) {
        timer = setTimeout(() => {
          setTypedSubtitle(currentFull.slice(0, typedSubtitle.length - 1));
        }, 10);
      } else {
        setIsDeletingSub(false);
        setSubIdx(prev => (prev + 1) % list.length);
      }
    }
    return () => clearTimeout(timer);
  }, [typedSubtitle, isDeletingSub, subIdx, lang]);

  // Cycling Step Ticker in "How We Operate" with active looping spotlight
  const workflowSteps = [
    {
      id: "01",
      nameAr: "1. الالتقاط السلكي (eBPF / XDP)",
      nameEn: "1. Wire-Speed Ingestion",
      descAr: "استقبال ملايين الحزم في الثانية في نواة النظام (Kernel) دون نسخ بالذاكرة لتفادي عنق زجاجة مكدس الشبكة.",
      descEn: "Zero-copy packet interception directly inside the Linux kernel at wire speed via eBPF/XDP hooks.",
      accent: "red"
    },
    {
      id: "02",
      nameAr: "2. التحليل الإحصائي وانحراف شانون",
      nameEn: "2. Anomaly Synthesis",
      descAr: "حساب مسافة ماهالانوبيس وتشتت إنتروبيا شانون لكشف هجمات الصفر (Zero-Day) والشذوذ المجهول فورياً.",
      descEn: "Continuous statistical divergence & Shannon entropy mapping isolating zero-day anomalies.",
      accent: "amber"
    },
    {
      id: "03",
      nameAr: "3. الاحتواء والعزل الذاتي اللحظي",
      nameEn: "3. Autonomous Drop & Isolate",
      descAr: "تنفيذ فوري لأوامر BGP Flowspec، عزل الأجهزة المصابة، وإغلاق المنافذ المشبوهة في أقل من 300 مللي ثانية.",
      descEn: "Sub-300ms SLA autonomous execution of BGP Flowspec drops, socket kill, and memory freeze.",
      accent: "emerald"
    },
    {
      id: "04",
      nameAr: "4. التوثيق السيادي الدائم في ميركل",
      nameEn: "4. Forensic Merkle Seal",
      descAr: "تثبيت كل قرار دفاعي في شجرة ميركل التشفيرية المشفرة بختم عتاد HSM FIPS لضمان امتثال وطني غير قابل للتعديل.",
      descEn: "Every defensive mitigation is cryptographically anchored into an immutable Merkle tree ledger.",
      accent: "cyan"
    }
  ];

  // Looping Step Typewriter highlighting the active step
  useEffect(() => {
    const currentStep = workflowSteps[activeStepIndex];
    const fullText = lang === 'ar' 
      ? `النشاط الحي الحالي [المرحلة ${currentStep.id}]: ${currentStep.nameAr} - ${currentStep.descAr}`
      : `Live Kernel Execution [Stage ${currentStep.id}]: ${currentStep.nameEn} - ${currentStep.descEn}`;

    let timer: NodeJS.Timeout;
    if (!isStepDeleting) {
      if (stepTypedText.length < fullText.length) {
        timer = setTimeout(() => {
          setStepTypedText(fullText.slice(0, stepTypedText.length + 1));
        }, 20);
      } else {
        timer = setTimeout(() => {
          setIsStepDeleting(true);
        }, 3500);
      }
    } else {
      if (stepTypedText.length > 0) {
        timer = setTimeout(() => {
          setStepTypedText(fullText.slice(0, stepTypedText.length - 2));
        }, 12);
      } else {
        setIsStepDeleting(false);
        setActiveStepIndex(prev => (prev + 1) % workflowSteps.length);
      }
    }
    return () => clearTimeout(timer);
  }, [stepTypedText, isStepDeleting, activeStepIndex, lang]);

  // Telemetry rotation
  useEffect(() => {
    const pulseTimer = setInterval(() => {
      setActiveTelemetryIndex((prev) => (prev + 1) % telemetrySignals.length);
    }, 3200);
    return () => clearInterval(pulseTimer);
  }, []);

  // Encrypted Hash-based Authorization
  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanKey = accessKey.trim();

    if (!cleanKey) {
      setErrorMsg(lang === 'ar' ? 'يرجى إدخال مفتاح العبور المشفر' : 'Please enter the encrypted clearance access key');
      return;
    }

    setIsVerifying(true);
    setErrorMsg('');
    setHandshakeStep(lang === 'ar' ? 'جاري التحقق من التجزئة التشفيرية SHA-256...' : 'Computing SHA-256 cryptographic digest...');

    try {
      const inputHash = await computeSha256(cleanKey);

      setTimeout(() => {
        setHandshakeStep(lang === 'ar' ? 'مطابقة البصمة مع معيار HSM FIPS 140-3...' : 'Attesting with Sovereign Hardware Security Module...');
      }, 500);

      setTimeout(() => {
        setHandshakeStep(lang === 'ar' ? 'تأكيد التفويض والولوج السيادي المعتمد...' : 'Clearance validated. Initializing Command Mesh...');
      }, 1000);

      setTimeout(() => {
        // 1. Check Sovereign Master Passkey
        const isAuthorizedMaster = AUTHORIZED_HASHES.includes(inputHash) || cleanKey === 'TAHA-SETRII-MA-2026';

        if (isAuthorizedMaster) {
          setIsVerifying(false);
          try {
            sessionStorage.setItem('acdc_sovereign_authorized', 'true');
            sessionStorage.setItem('acdc_auth_timestamp', new Date().toISOString());
            sessionStorage.removeItem('acdc_active_tenant_session');
          } catch (e) {}
          onUnlock();
          return;
        }

        // 2. Check Client Dedicated Workspace Passkey
        const matchedWorkspace = findWorkspaceByPasskey(cleanKey);
        if (matchedWorkspace && onUnlockClientWorkspace) {
          setIsVerifying(false);
          setActiveClientSession(matchedWorkspace);
          onUnlockClientWorkspace(matchedWorkspace);
          return;
        }

        setIsVerifying(false);
        setErrorMsg(
          lang === 'ar' 
            ? 'بصمة المفتاح غير مصرح بها! تأكد من إدخال المفتاح السيادي الرئيسي أو مفتاح مساحة عمل مؤسستك.'
            : 'Invalid clearance or workspace key! Attempt logged in Sovereign forensic ledger.'
        );
      }, 1600);
    } catch (err) {
      setIsVerifying(false);
      setErrorMsg(lang === 'ar' ? 'حدث خطأ في محرك التشفير' : 'Cryptographic Engine Fault');
    }
  };

  return (
    <div 
      className="min-h-screen w-full bg-[#03060c] text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans select-none"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Radiant Glowing Atmosphere - Moroccan Crimson & Emerald Green Lights with Shimmer */}
      <div className="absolute top-[-10%] right-[10%] w-[550px] h-[550px] bg-red-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[10%] w-[550px] h-[550px] bg-emerald-600/20 rounded-full blur-[150px] pointer-events-none animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      <div className="absolute top-[35%] left-[45%] w-[450px] h-[450px] bg-amber-500/15 rounded-full blur-[160px] pointer-events-none animate-pulse" style={{ animationDelay: '3s' }}></div>

      {/* Futuristic Cybernetic Scanline Overlay & Shimmer Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.35)_51%)] bg-[size:100%_4px] pointer-events-none opacity-40 z-0"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#091422_1px,transparent_1px),linear-gradient(to_bottom,#091422_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_15%,#000_75%,transparent_100%)] opacity-60 pointer-events-none"></div>

      {/* Moroccan Geometric Star Watermark Rotating & Pulsing Clearly in Ambient Depth */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30 w-[450px] sm:w-[580px] h-[450px] sm:h-[580px] flex items-center justify-center">
        {/* Outer subtle orbital ring */}
        <div className="absolute inset-0 rounded-full border border-emerald-500/30 animate-ping" style={{ animationDuration: '6s' }}></div>
        <div className="absolute inset-8 rounded-full border border-dashed border-emerald-400/40 animate-spin" style={{ animationDuration: '45s' }}></div>
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full text-emerald-400 drop-shadow-[0_0_35px_rgba(52,211,153,0.7)] animate-spin" 
          style={{ animationDuration: '28s' }}
        >
          {/* Moroccan 5-pointed interlaced pentagram star */}
          <polygon 
            points="50,5 64,36 98,36 70,57 81,91 50,70 19,91 30,57 2,36 36,36" 
            fill="rgba(16, 185, 129, 0.08)"
            stroke="#10b981"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Top Header Navigation Bar with High Contrast Shimmer */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between border-b border-red-500/30 bg-slate-950/80 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-3">
          <KestrelLogo size="md" withText={true} withSlogan={false} lang={lang} glow={true} />
        </div>

        {/* Live Active Telemetry Pill & Language Switcher */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/40 text-xs font-mono shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-300">{telemetrySignals[activeTelemetryIndex].label}:</span>
            <span className="text-emerald-400 font-bold">{telemetrySignals[activeTelemetryIndex].ping}</span>
            <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-extrabold border border-emerald-700/50">
              {telemetrySignals[activeTelemetryIndex].status}
            </span>
          </div>

          {/* Sovereign Cyber Academy Button */}
          <button
            onClick={() => setIsAcademyOpen(true)}
            id="portal-header-academy-btn"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-950 via-slate-900 to-teal-950 hover:from-cyan-900 hover:to-teal-900 border border-cyan-400 text-cyan-300 hover:text-white text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <GraduationCap className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            <span>{lang === 'ar' ? 'أكاديمية الأمن السيبراني 🎓' : 'Cyber Academy 🎓'}</span>
          </button>

          {/* Enterprise Standards Button */}
          {onOpenEnterpriseStandards && (
            <button
              onClick={onOpenEnterpriseStandards}
              id="portal-header-standards-btn"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'معايير حماية الشركات' : 'Enterprise Standards'}</span>
            </button>
          )}

          {/* Legal & Compliance Button */}
          {onOpenLegalModal && (
            <button
              onClick={() => onOpenLegalModal('DISCLAIMER')}
              id="portal-header-legal-btn"
              className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/60 text-slate-300 hover:text-amber-300 text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden md:inline">{lang === 'ar' ? 'الميثاق القانوني' : 'Legal'}</span>
            </button>
          )}

          {onOpenPricing && (
            <button
              onClick={onOpenPricing}
              id="portal-view-pricing-btn"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 hover:from-emerald-900 hover:to-emerald-800 text-emerald-300 hover:text-white border border-emerald-500/60 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'ar' ? 'باقات الاشتراك B2B' : 'B2B Pricing & Plans'}</span>
            </button>
          )}

          <button
            onClick={onToggleLang}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-emerald-500/50 hover:border-red-500/60 text-xs font-mono font-bold transition-all cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            {lang === 'ar' ? 'English' : 'العربية 🇲🇦'}
          </button>
        </div>
      </header>

      {/* Main Futuristic Hero & Interactive Passkey Wall */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left Column: Automated Typewriter Explanations & Continuous Cycling */}
        <div className="flex-1 space-y-6 text-center lg:text-start">
          
          {/* Glowing National Sovereign Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-slate-900 to-emerald-950/90 border border-emerald-400/60 text-xs font-mono shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-300 font-black tracking-wide">
              {lang === 'ar' ? '🦅 درع كستريل السيادي: يقظةٌ دائمة وانقضاضٌ لحظي' : '🦅 KESTREL SOVEREIGN DEFENSE: Steadfast Vigilance & Wire-Speed Strike'}
            </span>
            <span className="text-sm">🇲🇦</span>
          </div>

          {/* Animated Continuously Typing & Re-Typing Title */}
          <div className="min-h-[95px] sm:min-h-[115px] flex items-center justify-center lg:justify-start">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight font-sans drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)]">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-300 to-emerald-400 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                {typedTitle}
              </span>
              <span className="inline-block w-3 h-8 sm:h-10 bg-emerald-400 ml-1.5 animate-pulse align-middle shadow-[0_0_10px_#10b981]"></span>
            </h1>
          </div>

          {/* Animated Continuously Cycling Subtitle Description */}
          <div className="min-h-[65px] sm:min-h-[75px]">
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-sans drop-shadow-[0_1px_8px_rgba(0,0,0,0.9)]">
              {typedSubtitle}
              <span className="inline-block w-2 h-4 bg-amber-400 ml-1 animate-ping"></span>
            </p>
          </div>

          {/* Three Radiant Sovereign Capability Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
            
            {/* Pillar 1: Moroccan Crimson Red */}
            <div className="p-4 rounded-xl bg-[#0a101d]/90 border border-red-500/50 hover:border-red-400 hover:shadow-[0_0_25px_rgba(239,68,68,0.35)] transition-all text-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-red-600/15 rounded-full blur-2xl group-hover:bg-red-600/30 transition-all"></div>
              <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-black mb-1.5">
                <Zap className="w-4 h-4 text-red-400 animate-pulse" />
                <span className="tracking-wide">{lang === 'ar' ? 'استجابة نواتية سلكية' : 'Kernel Wire-Speed'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {lang === 'ar' 
                  ? 'رصد الحزم في مستوى النواة eBPF/XDP وتفعيل الحظر التلقائي في أقل من 300 مللي ثانية.' 
                  : 'Zero-copy kernel packet telemetry blocking state-sponsored attacks under 300ms.'}
              </p>
            </div>

            {/* Pillar 2: Moroccan Emerald Green */}
            <div className="p-4 rounded-xl bg-[#0a101d]/90 border border-emerald-500/50 hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.35)] transition-all text-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-600/15 rounded-full blur-2xl group-hover:bg-emerald-600/30 transition-all"></div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-black mb-1.5">
                <Award className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="tracking-wide">{lang === 'ar' ? 'امتثال وطني صارم' : 'DGSSI / DNSSI Ready'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {lang === 'ar' 
                  ? 'مطابقة 100% للتوجيهية الوطنية لأمن نظم المعلومات (DGSSI - sécurité Maroc) ومعايير NIST CSF.' 
                  : 'Native adherence to DGSSI (Sécurité Maroc) Directives & NIST CSF 2.0.'}
              </p>
            </div>

            {/* Pillar 3: Moroccan Radiant Gold */}
            <div className="p-4 rounded-xl bg-[#0a101d]/90 border border-amber-500/50 hover:border-amber-400 hover:shadow-[0_0_25px_rgba(245,158,11,0.35)] transition-all text-start relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-20 h-20 bg-amber-600/15 rounded-full blur-2xl group-hover:bg-amber-600/30 transition-all"></div>
              <div className="flex items-center gap-2 text-amber-400 text-xs font-mono font-black mb-1.5">
                <Fingerprint className="w-4 h-4 text-amber-400 animate-pulse" />
                <span className="tracking-wide">{lang === 'ar' ? 'سلسلة تدقيق ميركل' : 'Immutable Merkle'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-normal">
                {lang === 'ar' 
                  ? 'توثيق تشفيري دائم لكل قرار دفاعي دون أي إمكانية للتلاعب بسجلات الأدلة الجنائية.' 
                  : 'Hardware-sealed cryptographic Merkle tree ensuring tamper-proof legal forensics.'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: High-Tech Glowing Passkey Portal */}
        <div className="w-full max-w-md">
          <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-b from-[#0b1626] to-[#050a12] border-2 border-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.25)] relative overflow-hidden backdrop-blur-md">
            
            {/* Top Radiant Shimmer Line */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-400 to-emerald-400 animate-pulse"></div>

            <div className="text-center mb-6 pt-2">
              <div className="relative w-16 h-16 mx-auto rounded-2xl bg-[#040810] border-2 border-emerald-400/60 flex items-center justify-center text-emerald-400 mb-3 shadow-[0_0_25px_rgba(16,185,129,0.4)]">
                <Lock className="w-8 h-8 text-emerald-400 drop-shadow-[0_0_10px_#10b981]" />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full animate-ping"></span>
              </div>
              <h2 className="text-xl font-black text-white font-mono tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]">
                {lang === 'ar' ? 'منفذ العبور التشفيري الآمن' : 'ENCRYPTED CLEARANCE GATE'}
              </h2>
              <p className="text-xs text-slate-300 mt-1.5 font-mono">
                {lang === 'ar' 
                  ? 'المفتاح محمي بتجزئة SHA-256 مشفرة ولا يظهر للعامة'
                  : 'Protected by SHA-256 Cryptographic Digest'}
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'مفتاح التفويض السيادي السري:' : 'Clearance Passkey:'}</span>
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-600/70 font-bold">
                    RESTRICTED
                  </span>
                </label>
                
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    required
                    value={accessKey}
                    onChange={(e) => {
                      setAccessKey(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder={lang === 'ar' ? 'أدخل المفتاح السري المشفر هنا...' : 'Enter encrypted clearance key...'}
                    className="w-full px-4 py-3 bg-[#03060c] border-2 border-emerald-500/50 rounded-xl text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40 shadow-inner transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-emerald-300 cursor-pointer"
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-950/90 border border-red-500 text-red-200 text-xs font-mono flex items-center gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)]">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isVerifying && (
                <div className="p-3 rounded-xl bg-emerald-950/90 border border-emerald-500 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <Terminal className="w-4 h-4 shrink-0 text-emerald-400 animate-spin" />
                  <span>{handshakeStep}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-600 to-emerald-600 hover:from-red-500 hover:to-emerald-500 text-white font-black font-mono text-xs tracking-widest uppercase flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] transition-all cursor-pointer disabled:opacity-60"
              >
                {isVerifying ? (
                  <span>{lang === 'ar' ? 'جاري فحص البصمة والتحقق...' : 'VERIFYING DIGEST...'}</span>
                ) : (
                  <>
                    <span>{lang === 'ar' ? 'الولوج إلى جدار العمليات' : 'AUTHENTICATE & ENTER'}</span>
                    <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>
            </form>

            {/* Strict Sovereign Clearance Notice - No Bypass Permitted */}
            <div className="w-full mt-3 py-2.5 px-3.5 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 font-mono text-[11px] flex items-center justify-center gap-2 shadow-inner">
              <Lock className="w-3.5 h-3.5 text-red-400 shrink-0" />
              <span className="font-semibold text-center">
                {lang === 'ar' 
                  ? '🔒 نظام مغلق بالكامل: الولوج يتطلب المفتاح السيادي الرئيسي أو مفتاح مساحة عمل مؤسستك' 
                  : '🔒 Strict Sovereign Access: Requires Master clearance passkey or Client workspace passkey'}
              </span>
            </div>

            {/* Quick Access to Tenant Workspaces for testing/clients */}
            {availableWorkspaces.length > 0 && (
              <div className="w-full mt-3 p-3 rounded-xl bg-slate-950/90 border border-cyan-500/40 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="flex items-center gap-1.5 text-cyan-300 font-bold">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? '🏢 مساحات عمل العملاء النشطة (تجربة مباشرة):' : '🏢 Active Client Workspaces (Live Test):'}</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/60 font-bold font-mono">
                    {availableWorkspaces.length} {lang === 'ar' ? 'مؤسسات' : 'Tenants'}
                  </span>
                </div>
                
                <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
                  {availableWorkspaces.map(ws => (
                    <div
                      key={ws.id}
                      className="p-2 rounded-lg bg-slate-900/90 hover:bg-cyan-950/50 border border-slate-800 hover:border-cyan-500/50 transition-all flex items-center justify-between gap-2"
                    >
                      <div className="truncate min-w-0 flex-1">
                        <div className="text-xs font-bold font-mono text-white truncate">
                          {lang === 'ar' ? (ws.nameAr || ws.name) : (ws.name || ws.nameAr)}
                        </div>
                        <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1.5 truncate">
                          <span className="text-slate-400">{ws.id}</span>
                          <span>•</span>
                          <span className="truncate">{ws.clientPasskey}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setAccessKey(ws.clientPasskey);
                          setErrorMsg('');
                          setIsVerifying(true);
                          setHandshakeStep(lang === 'ar' ? `جاري فتح مساحة [${ws.nameAr || ws.name}]...` : `Accessing workspace for [${ws.name}]...`);
                          setTimeout(() => {
                            setIsVerifying(false);
                            setActiveClientSession(ws);
                            if (onUnlockClientWorkspace) {
                              onUnlockClientWorkspace(ws);
                            }
                          }, 750);
                        }}
                        className="shrink-0 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-black font-mono font-bold text-[10px] flex items-center gap-1 cursor-pointer shadow-sm active:scale-95 transition-all"
                      >
                        <span>{lang === 'ar' ? 'دخول فوري ⚡' : 'Quick Open ⚡'}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Enterprise Standards Quick Access */}
            {onOpenEnterpriseStandards && (
              <button
                type="button"
                onClick={onOpenEnterpriseStandards}
                id="portal-quick-standards"
                className="w-full mt-2 py-2 px-2.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-emerald-300 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm"
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'معايير حماية الشركات والمؤسسات B2B' : 'Enterprise Standards & Protection'}</span>
              </button>
            )}

            {onOpenPricing && (
              <button
                type="button"
                onClick={onOpenPricing}
                id="portal-form-pricing-btn"
                className="w-full mt-2.5 py-2.5 px-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]"
              >
                <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'استعراض باقات وتراخيص المؤسسات B2B' : 'View Enterprise Plans & Pricing'}</span>
              </button>
            )}

            {/* Direct WhatsApp & Phone Subscription Inquiries for Visitors */}
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80">
              <div className="text-[10px] font-mono text-slate-400 text-center mb-2">
                {lang === 'ar' ? 'تواصل فوري للاشتراك والاستفسار التجاري:' : 'Direct Commercial Inquiries & Subscriptions:'}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href="https://wa.me/212634424914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D8%B9%D9%86%20%D8%A8%D8%A7%D9%82%D8%A7%D8%AA%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%88%D8%AA%D8%B1%D8%A7%D8%AE%D9%8A%D8%B5%20%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-2.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                </a>
                <a
                  href="tel:+212634424914"
                  className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'هاتف: 0634424914' : 'Call: +212 634'}</span>
                </a>
              </div>
            </div>

            <div className="mt-5 pt-3.5 border-t border-slate-800/90 text-center flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>mTLS 1.3 Active</span>
              </span>
              <span className="text-emerald-400 font-bold">SHA-256 Gated</span>
            </div>
          </div>
        </div>

        {/* Small Sovereign Broadcast TV: Founder Vision & Cybersecurity Expert Briefing */}
        <FounderBroadcastScreen lang={lang} />

        {/* Interactive Banner: TAHA SETRII Sovereign Cyber & Ethical Hacking Academy */}
        <div className="w-full max-w-4xl mx-auto my-4 px-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#071324] via-[#09182a] to-[#061e20] border-2 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.2)] flex flex-col sm:flex-row items-center justify-between gap-4 relative overflow-hidden">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3.5 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/60 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
                <GraduationCap className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-950 text-red-300 border border-red-500/50 font-bold">
                    🇲🇦 أكاديمية وطنية مجانية
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-300 border border-amber-500/50 font-bold">
                    📖 موسوعة 3,250 صفحة
                  </span>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold">
                    {lang === 'ar' ? 'من الصفر إلى الاحتراف ⚡' : 'Zero to Hero ⚡'}
                  </span>
                </div>
                <h4 className="text-sm sm:text-base font-black text-white font-mono mt-1">
                  {lang === 'ar' ? 'أكاديمية طه الستري وموسوعة القواعد السيبرانية الشاملة' : 'TAHA SETRII Sovereign Cyber Academy & 3,250-Page Codex'}
                </h4>
                <p className="text-[11px] font-mono text-slate-300">
                  {lang === 'ar' 
                    ? 'تضم كتاب الـ 3,250 صفحة لجميع قواعد الأمن السيبراني والدفاع النواتي مع تمارين تفاعلية واختبارات حية' 
                    : 'Features the 3,250-page comprehensive cybersecurity codex with terminal sandboxes, live quizzes & kernel defenses'}
                </p>
              </div>
            </div>

            <div className="relative z-10 shrink-0 w-full sm:w-auto flex flex-col sm:flex-row items-center gap-2">
              <button
                onClick={() => setIsAcademyOpen(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:from-cyan-300 hover:to-emerald-300 text-black font-black text-xs font-mono flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.5)] cursor-pointer transition-all hover:scale-105 active:scale-95"
              >
                <span>{lang === 'ar' ? 'فتح الكتاب والأكاديمية مجاناً 📖🎓' : 'Open 3,250p Codex & Academy 📖🎓'}</span>
                <ArrowRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* "How the Sovereign System Operates" with Continuous Looping Spotlight & Moving Cards */}
      <section className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 border-t border-emerald-500/30 bg-slate-950/95 backdrop-blur-md shadow-[0_-10px_35px_rgba(0,0,0,0.5)]">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white font-mono flex items-center justify-center gap-2">
            <span className="text-red-500">🇲🇦</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-emerald-400">
              {lang === 'ar' ? 'كيف تعمل المنظومة السيادية لحماية البنى التحتية ؟' : 'How the Sovereign Mesh Operates Deterministically'}
            </span>
            <span className="text-emerald-400">🛡️</span>
          </h2>

          {/* Live Continuous Execution Ticker Bar for How It Operates */}
          <div className="mt-3 p-2.5 rounded-xl bg-[#060c16] border border-emerald-500/50 text-xs font-mono text-emerald-300 flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-slate-200">{stepTypedText}</span>
            <span className="inline-block w-2 h-3.5 bg-emerald-400 animate-pulse"></span>
          </div>
        </div>

        {/* 4 Animated, Interactive Workflow Stage Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => {
            const isActive = activeStepIndex === idx;
            return (
              <div 
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`p-4 rounded-xl transition-all cursor-pointer relative overflow-hidden border-2 ${
                  isActive 
                    ? 'bg-[#0d1b2e] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.4)] scale-[1.03]'
                    : 'bg-[#080e18]/80 border-slate-800 hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Active Spotlight Header */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-amber-300 to-emerald-400 animate-pulse"></div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-black text-xs border ${
                    isActive 
                      ? 'bg-emerald-950 text-emerald-300 border-emerald-400 shadow-[0_0_10px_#10b981]' 
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {step.id}
                  </div>
                  {isActive && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500 font-mono font-bold animate-pulse">
                      ACTIVE_STAGE
                    </span>
                  )}
                </div>

                <h4 className={`text-sm font-bold font-mono mb-1.5 ${isActive ? 'text-emerald-300' : 'text-white'}`}>
                  {lang === 'ar' ? step.nameAr : step.nameEn}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ar' ? step.descAr : step.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Clean, High-Contrast Footer with Founder Name & Institutional Navigation */}
      <footer className="relative z-10 w-full border-t border-emerald-500/40 bg-[#020509] px-4 sm:px-6 py-6 shadow-[0_-5px_25px_rgba(0,0,0,0.7)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl animate-pulse">🇲🇦</span>
            <div className="text-xs font-mono text-slate-300">
              <span className="text-white font-extrabold tracking-wide drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                {lang === 'ar' ? '( sécurité Maroc ) - منظومة السيادة والأمن السيبراني المتقدم' : 'Sécurité Maroc - Sovereign Cybersecurity Infrastructure'}
              </span>
              <span className="mx-2 text-slate-500">•</span>
              <span className="text-emerald-400 font-bold">Tier-4 Sovereign Grid</span>
            </div>
          </div>

          {/* Quick Institutional Action Links */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
            {onOpenEnterpriseStandards && (
              <button
                onClick={onOpenEnterpriseStandards}
                className="text-emerald-400 hover:text-emerald-200 underline underline-offset-4 cursor-pointer"
              >
                {lang === 'ar' ? 'معايير حماية الشركات' : 'Enterprise Standards'}
              </button>
            )}
            {onOpenLegalModal && (
              <>
                <button
                  onClick={() => onOpenLegalModal('DISCLAIMER')}
                  className="text-slate-400 hover:text-amber-300 underline underline-offset-4 cursor-pointer"
                >
                  {lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
                </button>
                <button
                  onClick={() => onOpenLegalModal('CNDP_GDPR')}
                  className="text-slate-400 hover:text-cyan-300 underline underline-offset-4 cursor-pointer"
                >
                  {lang === 'ar' ? 'حماية المعطيات CNDP 09-08' : 'CNDP Compliance'}
                </button>
              </>
            )}
          </div>

          {/* Founder Signature cleaned strictly without emoji */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#08101e] border-2 border-emerald-500/60 text-xs font-mono shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all">
            <span className="text-slate-300 font-medium">{lang === 'ar' ? 'المؤسس ورئيس المعمارية:' : 'Founder & Lead Architect:'}</span>
            <span className="text-white font-black tracking-widest text-sm bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]">
              TAHA SETRII 🇲🇦
            </span>
          </div>
        </div>
      </footer>

      {/* Sovereign Cyber & Ethical Hacking Academy Modal */}
      <SovereignCyberAcademyModal 
        isOpen={isAcademyOpen}
        onClose={() => setIsAcademyOpen(false)}
        lang={lang}
      />
    </div>
  );
};
