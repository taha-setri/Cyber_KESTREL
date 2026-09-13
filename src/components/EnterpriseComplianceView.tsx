import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Lock, 
  Cpu, 
  CheckCircle2, 
  FileText, 
  Download, 
  AlertTriangle, 
  Zap, 
  Activity, 
  Server, 
  Award, 
  DollarSign, 
  TrendingUp, 
  ChevronRight,
  ExternalLink,
  Printer,
  Sparkles
} from 'lucide-react';

interface EnterpriseComplianceViewProps {
  lang: 'ar' | 'en';
  onOpenWhitepaper: () => void;
  onOpenCommercialPlans: () => void;
  onOpenPostQuantumShield: () => void;
}

export const EnterpriseComplianceView: React.FC<EnterpriseComplianceViewProps> = ({
  lang,
  onOpenWhitepaper,
  onOpenCommercialPlans,
  onOpenPostQuantumShield
}) => {
  const [selectedVector, setSelectedVector] = useState<number>(0);

  // Enterprise ROI Calculator State
  const [employeeCount, setEmployeeCount] = useState<number>(250);
  const [serverCount, setServerCount] = useState<number>(45);
  const [industrySector, setIndustrySector] = useState<'FINANCIAL' | 'HEALTHCARE' | 'TECH' | 'ENERGY' | 'GOV'>('FINANCIAL');

  const industryBreachCostMap = {
    FINANCIAL: 5900000,
    HEALTHCARE: 10930000,
    ENERGY: 4780000,
    TECH: 4660000,
    GOV: 3950000
  };

  const estimatedBreachRisk = Math.round(industryBreachCostMap[industrySector] * (employeeCount > 500 ? 1.4 : employeeCount > 100 ? 1.0 : 0.6));
  const estimatedSocAnalystCostYearly = Math.round(Math.max(2, Math.ceil(serverCount / 25)) * 85000);
  const acdcEstimatedYearlyPlan = 4999 * 12; // Enterprise Tier
  const netEstimatedSavings = estimatedSocAnalystCostYearly - acdcEstimatedYearlyPlan;

  const protectionVectors = [
    {
      titleAr: '1. تحييد برمجيات الفدية وعزل العقد المصابة (Ransomware Micro-Isolation)',
      titleEn: '1. Autonomous Ransomware Neutralization & Micro-Isolation',
      icon: Lock,
      color: 'from-rose-500/20 to-red-600/20 border-rose-500/50 text-rose-300',
      badgeAr: 'زمن العزل: 0.38 ميلي ثانية',
      badgeEn: 'Mitigation Time: 0.38 ms',
      summaryAr: 'منع الانتشار الجانبي لبرمجيات الفدية (Lateral Movement) فور محاولة التشفير أو فحص منافذ SMB/RDP المشبوهة.',
      summaryEn: 'Halts rapid lateral movement and credential harvesting within milliseconds of initial encryption activity.',
      challengeAr: 'في الهجمات العادية، تنتشر برمجية الفدية عبر شبكة الشركة في دقائق معدودة، بينما يتطلب الـ SOC البشري ساعات لاكتشاف التسلل.',
      challengeEn: 'Traditional SOCs detect ransomware after minutes or hours when Active Directory domain controllers are already compromised.',
      acdcSolutionAr: 'يقوم محرك ACDC برصد ارتفاع مفاجئ في إنتروبيا البيانات وتطبيق عزل فوري (SDN Micro-segmentation) للعقدة المصابة مع إسقاط حزمها عند كارت الشبكة XDP.',
      acdcSolutionEn: 'ACDC detects byte-entropy surges, triggers instantaneous SDN micro-segmentation, and drops kernel packets before encryption touches company databases.'
    },
    {
      titleAr: '2. منع تسريب البيانات والسرقة الحساسة (Wire-Speed Data Exfiltration Interception)',
      titleEn: '2. Wire-Speed Data Exfiltration & Covert Channel Interception',
      icon: Activity,
      color: 'from-amber-500/20 to-yellow-600/20 border-amber-500/50 text-amber-300',
      badgeAr: 'حظر أنفاق DNS في 0.22 ميلي ثانية',
      badgeEn: 'DNS Tunnel Drop: 0.22 ms',
      summaryAr: 'كشف وحظر محاولات تهريب أسرار الشركات وقواعد بيانات العملاء عبر أنفاق DNS و TLS الخفية.',
      summaryEn: 'Intercepts intellectual property and customer database theft attempted via covert DNS queries and encrypted tunnels.',
      challengeAr: 'يستغل القراصنة منافذ الـ DNS المفتوحة افتراضياً لتقسيم وتمرير البيانات المسروقة دون إثارة انتباه جدران الحماية العادية.',
      challengeEn: 'Attackers abuse standard DNS/HTTPS protocols to leak confidential intellectual property, evading basic perimeter firewalls.',
      acdcSolutionAr: 'تطبيق تحليل إحصائي فوري لتشتت استعلامات الـ DNS (Shannon Entropy > 6.8) وإسقاط النفق فوراً وتوليد قاعدة حظر تلقائية للآيبي المهاجم.',
      acdcSolutionEn: 'Real-time Shannon entropy scoring detects high-variance Base64 payloads inside DNS subdomains, severing the exfiltration pipe in wire-speed.'
    },
    {
      titleAr: '3. امتصاص هجمات حجب الخدمة الضخمة (Volumetric & L7 DDoS Kernel Absorption)',
      titleEn: '3. Volumetric & Layer-7 DDoS Kernel Absorption',
      icon: Zap,
      color: 'from-cyan-500/20 to-blue-600/20 border-cyan-500/50 text-cyan-300',
      badgeAr: 'قدرة استيعاب > 15M EPS',
      badgeEn: 'Throughput: > 15M EPS',
      summaryAr: 'إسقاط سيل الحزم المهاجمة مباشرة عند النواة (Kernel eBPF/XDP) دون أي استهلاك لمعالجات خوادم الشركة.',
      summaryEn: 'Drops millions of malicious packets at the network driver layer before reaching the Linux TCP/IP stack or web applications.',
      challengeAr: 'تؤدي هجمات DDoS إلى شلل تام في بوابات الدفع ومواقع التجارة الإلكترونية، مما يسبب خسائر مادية فادحة وفقدان العملاء.',
      challengeEn: 'Volumetric floods saturate servers and cloud billing, crashing customer checkout services and causing massive downtime losses.',
      acdcSolutionAr: 'يتم إسقاط الحزم (XDP_DROP) بأمر واحد في كارت الشبكة، مع المحافظة على سرعة تصفح العملاء الحقيقيين بنسبة 100%.',
      acdcSolutionEn: 'XDP driver hook terminates unauthorized UDP/SYN floods with zero context switches, ensuring uninterrupted 99.999% legitimate uptime.'
    },
    {
      titleAr: '4. رصد التهديدات الداخلية ورفع الصلاحيات (Insider Threat & Behavioral Baselines)',
      titleEn: '4. Insider Threat & Privilege Escalation Anomaly Profiling',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-teal-600/20 border-emerald-500/50 text-emerald-300',
      badgeAr: 'مسافة ماهالانوبيس D_M > 4.5',
      badgeEn: 'Mahalanobis D_M > 4.5',
      summaryAr: 'بناء بصمة سلوكية رياضية لكل خادم وموظف، ورصد أي استعلامات شاذة أو محاولات سرقة صلاحيات المسؤول (Root/Admin).',
      summaryEn: 'Establishes multivariate behavioral baselines to intercept rogue internal employees or compromised credentials.',
      challengeAr: 'يصعب كشف الموظف الذي يمتلك صلاحيات شرعية إذا قرر نسخ ملفات حساسة خارج نطاق مهامه اليومية.',
      challengeEn: 'Compromised administrative credentials appear legitimate to basic rule-based security tools, masking malicious internal activity.',
      acdcSolutionAr: 'حساب مسافة ماهالانوبيس متعددة المتغيرات لحجم الحركة وأوقات العمل، ورصد أي انحراف إحصائي وتنبيه قمرة القيادة فوراً.',
      acdcSolutionEn: 'Calculates the Mahalanobis distance against historic covariance matrices, catching deviations in data volumes and query rhythms instantaneously.'
    },
    {
      titleAr: '5. تأمين بوابات الـ API والتشفير ما بعد الكم (API Gateway & Post-Quantum Defense)',
      titleEn: '5. Enterprise API Gateways & Post-Quantum Shielding',
      icon: Cpu,
      color: 'from-purple-500/20 to-indigo-600/20 border-purple-500/50 text-purple-300',
      badgeAr: 'معيار NIST FIPS 203 / 204',
      badgeEn: 'NIST FIPS 203 / 204 Standard',
      summaryAr: 'حماية قنوات الاتصال بين الفروع والمراكز السحابية بخوارزميات الشبيكات المقاومة لحواسيب الكم وخوارزمية شور.',
      summaryEn: 'Protects enterprise inter-branch traffic and API microservices against quantum harvesting and unauthorized eavesdropping.',
      challengeAr: 'تقوم جهات خارجية باعتراض وتخزين البيانات المشفرة حالياً لفك تشفيرها لاحقاً بواسطة حواسيب الكم (HNDL).',
      challengeEn: 'Adversaries intercept corporate encrypted streams today to decrypt them when commercial quantum computers arrive.',
      acdcSolutionAr: 'تطبيق تبادل مفاتيح هجين (Kyber-768 + X25519) وتوقيع أوامر الحظر بـ Dilithium-65 المعتمد دولياً.',
      acdcSolutionEn: 'Natively enforces ML-KEM Kyber-768 encapsulation and ML-DSA Dilithium signatures across all active telemetry and mitigation paths.'
    }
  ];

  const complianceStandards = [
    {
      code: 'ISO/IEC 27001:2022',
      titleAr: 'نظام إدارة أمن المعلومات العالمي',
      titleEn: 'Information Security Management System (ISMS)',
      howWeComplyAr: 'إدارة متكاملة للمخاطر، سياسات وصول دقيقة، وسجلات تدقيق غير قابلة للتعديل تلبي متطلبات الملحق أ (Annex A).',
      howWeComplyEn: 'Comprehensive risk treatment, strict access governance, and immutable audit logs compliant with Annex A controls.',
      badge: 'ENTERPRISE GOLD',
      color: 'border-cyan-500/50 text-cyan-300'
    },
    {
      code: 'SOC 2 Type II',
      titleAr: 'معيار الثقة والسرية السحابية AICPA',
      titleEn: 'Trust Services Criteria (Security, Availability, Confidentiality)',
      howWeComplyAr: 'إثبات النزاهة التشغيلية المستمرة عبر شجرة ميركل المشفرة بختم زمني لكل إجراء دفاعي تم تنفيذه.',
      howWeComplyEn: 'Proof of operational integrity over extended audit periods via timestamped cryptographic Merkle verification.',
      badge: 'AUDIT READY',
      color: 'border-emerald-500/50 text-emerald-300'
    },
    {
      code: 'NIST SP 800-53 Rev 5',
      titleAr: 'المعايير الفيدرالية للأمن السيبراني',
      titleEn: 'Security and Privacy Controls for Federal Information Systems',
      howWeComplyAr: 'تغطية عائلات الضوابط الأساسية: الاستجابة للحوادث (IR)، سلامة الأنظمة والمعلومات (SI)، والتحكم في الوصول (AC).',
      howWeComplyEn: 'Addresses Incident Response (IR), System & Information Integrity (SI), and Access Control (AC) families.',
      badge: 'DEFENSE GRADE',
      color: 'border-purple-500/50 text-purple-300'
    },
    {
      code: 'PCI-DSS v4.0',
      titleAr: 'معيار أمان بيانات قطاع بطاقات الدفع والبنوك',
      titleEn: 'Payment Card Industry Data Security Standard',
      howWeComplyAr: 'عزل مسار بيانات حاملي البطاقات (CDE) عبر التجزئة الدقيقة SDN، مع مراقبة النواة لحظر أي تسلل.',
      howWeComplyEn: 'Micro-segmentation of the Cardholder Data Environment (CDE) with wire-speed intrusion blocking.',
      badge: 'BANKING CERT',
      color: 'border-amber-500/50 text-amber-300'
    },
    {
      code: 'القانون المغربي 09-08 / GDPR',
      titleAr: 'حماية المعطيات ذات الطابع الشخصي (CNDP)',
      titleEn: 'Moroccan CNDP Law 09-08 & EU GDPR Privacy Mandate',
      howWeComplyAr: 'السيادة الوطنية الكاملة على البيانات (Data Residency)، وتعمية عناوين IP لضمان عدم انتهاك خصوصية المستخدمين.',
      howWeComplyEn: 'Full sovereign data residency, automated IP pseudonymization, and zero cross-border commercial telemetry leakage.',
      badge: 'SOVEREIGN LAW',
      color: 'border-teal-500/50 text-teal-300'
    },
    {
      code: 'CMMC Level 3',
      titleAr: 'نموذج نضج الأمن السيبراني لقطاع الدفاع',
      titleEn: 'Cybersecurity Maturity Model Certification (DoD)',
      howWeComplyAr: 'حماية المعلومات غير المصنفة الخاضعة للرقابة (CUI) ومقاومة التهديدات المتقدمة المستمرة (APTs).',
      howWeComplyEn: 'Protects Controlled Unclassified Information (CUI) with advanced autonomous threat hunting.',
      badge: 'MILITARY COMPLIANT',
      color: 'border-indigo-500/50 text-indigo-300'
    }
  ];

  return (
    <div className="space-y-8 font-mono pb-12" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Hero Banner with Official Whitepaper Callout */}
      <div className="rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-r from-slate-950 via-[#0a1226] to-cyan-950/80 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-400 text-[10px] font-black uppercase tracking-wider">
                ENTERPRISE CYBER DEFENSE SPECIFICATION
              </span>
              <span className="px-2.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/60 text-[10px] font-bold">
                NIST FIPS 203/204 PQC
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold">
                ISO 27001 & SOC 2 READY
              </span>
            </div>
            
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-white font-sans tracking-wide">
              {lang === 'ar' 
                ? 'معايير المنظومة وكيف تحمي الشركات ومؤسسات الأعمال' 
                : 'ACDC Enterprise Protection Standards & Corporate Cyber Resilience'}
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? 'منظومة حماية سيادية تدمج استشعار النواة eBPF مع التحليل الرياضي متعدد المتغيرات، موجهة للبنوك والشركات الكبرى والجهات السيادية لتحييد التهديدات في أجزاء من الميلي ثانية وبدون تدخل بشري.'
                : 'Sovereign autonomous cyber defense platform integrating Linux kernel eBPF with multivariate mathematical telemetry to protect banks, critical infrastructure, and enterprises at wire-speed.'}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <div className="flex gap-2">
              <button
                onClick={onOpenCommercialPlans}
                className="flex-1 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md"
              >
                <DollarSign className="w-4 h-4" />
                <span>{lang === 'ar' ? 'باقات B2B للمؤسسات' : 'B2B Enterprise Plans'}</span>
              </button>

              <button
                onClick={onOpenPostQuantumShield}
                className="px-4 py-3 rounded-xl bg-purple-950/80 hover:bg-purple-900 border border-purple-500/60 text-purple-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title="Post-Quantum Cryptography"
              >
                <Cpu className="w-4 h-4 text-purple-400" />
                <span>PQC Shield</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: 5 CORPORATE PROTECTION PILLARS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">
              {lang === 'ar' ? 'ركائز حماية الشركات ومؤسسات الأعمال الحيوية' : 'The 5 Core Pillars of Corporate Cyber Defense'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? 'اختر الركيزة لاستعراض سيناريو الحماية الفعلي' : 'Select a pillar to view real-world defense mechanics'}
          </span>
        </div>

        {/* Pillar Selector Tabs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
          {protectionVectors.map((vector, idx) => {
            const Icon = vector.icon;
            const isSelected = selectedVector === idx;
            return (
              <button
                key={idx}
                onClick={() => setSelectedVector(idx)}
                className={`p-3 rounded-xl border text-left rtl:text-right transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                  isSelected
                    ? 'bg-slate-900 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400/50'
                    : 'bg-[#0a0f1d] border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg bg-slate-950 border border-slate-800 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400 font-mono">
                    0{idx + 1}
                  </span>
                </div>
                <span className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                  {lang === 'ar' ? vector.titleAr.split('(')[0] : vector.titleEn.split('(')[0]}
                </span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold truncate">
                  {lang === 'ar' ? vector.badgeAr : vector.badgeEn}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Detailed Showcase Box */}
        {protectionVectors[selectedVector] && (() => {
          const v = protectionVectors[selectedVector];
          const Icon = v.icon;
          return (
            <div className="p-5 sm:p-6 rounded-2xl bg-[#080d1a] border-2 border-slate-800 space-y-5 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                      {lang === 'ar' ? v.titleAr : v.titleEn}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {lang === 'ar' ? v.summaryAr : v.summaryEn}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-xs font-bold font-mono shrink-0">
                  {lang === 'ar' ? v.badgeAr : v.badgeEn}
                </span>
              </div>

              {/* Contrast: The Challenge vs ACDC Autonomous Superiority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    <span>{lang === 'ar' ? 'المعضلة ونقاط ضعف الدفاع التقليدي (Legacy SOC):' : 'The Challenge with Legacy Security Tools:'}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {lang === 'ar' ? v.challengeAr : v.challengeEn}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'حل منظومة ACDC السيادية التلقائي (Sub-Millisecond Wire Defense):' : 'ACDC Autonomous Solution & Outcome:'}</span>
                  </div>
                  <p className="text-slate-300 text-xs leading-relaxed">
                    {lang === 'ar' ? v.acdcSolutionAr : v.acdcSolutionEn}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* SECTION 2: STANDARDS & COMPLIANCE MATRIX */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base sm:text-lg font-bold text-white font-sans">
              {lang === 'ar' ? 'مصفوفة المعايير الدولية والسيادية الصارمة' : 'International & Sovereign Standards Matrix'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            {lang === 'ar' ? 'جاهزية الامتثال للمؤسسات المالية، الحكومية، والصناعية' : 'Readiness for Financial, Defense, and Healthcare Enterprises'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {complianceStandards.map((std, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-mono">{std.code}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded bg-slate-950 border font-bold ${std.color}`}>
                    {std.badge}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-300">
                  {lang === 'ar' ? std.titleAr : std.titleEn}
                </h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {lang === 'ar' ? std.howWeComplyAr : std.howWeComplyEn}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-emerald-400 font-mono">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'متوافق 100%' : '100% Compliant'}</span>
                </span>
                <span className="text-slate-400">ACDC Core Spec</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 3: ENTERPRISE ROI & RISK REDUCTION CALCULATOR */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0a1020] via-slate-900 to-[#0d162d] border-2 border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-400">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-sans">
                {lang === 'ar' ? 'حاسبة العائد الاستثماري وحماية أصول الشركات (Enterprise ROI Calculator)' : 'Enterprise Cyber ROI & Risk Reduction Calculator'}
              </h3>
              <p className="text-xs text-slate-400">
                {lang === 'ar' 
                  ? 'احسب الوفورات المالية ومقدار المخاطر المحمية عند استبدال الـ SOC البشري البطيء بمنظومة ACDC التلقائية' 
                  : 'Estimate financial risk reduction and operational cost savings by adopting ACDC autonomous defense.'}
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            IBM Breach Cost Index 2024
          </span>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-300 font-bold block">
              {lang === 'ar' ? 'عدد الموظفين في الشركة:' : 'Company Employee Count:'}
            </label>
            <div className="flex items-center justify-between text-cyan-300 font-bold text-sm">
              <span>{employeeCount} موظف</span>
            </div>
            <input 
              type="range" 
              min="20" 
              max="2500" 
              step="10"
              value={employeeCount}
              onChange={(e) => setEmployeeCount(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-300 font-bold block">
              {lang === 'ar' ? 'عدد الخوادم والأجهزة المحمية:' : 'Protected Servers & Nodes:'}
            </label>
            <div className="flex items-center justify-between text-cyan-300 font-bold text-sm">
              <span>{serverCount} خادم</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="500" 
              step="5"
              value={serverCount}
              onChange={(e) => setServerCount(parseInt(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div className="space-y-2 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <label className="text-slate-300 font-bold block">
              {lang === 'ar' ? 'قطاع الأعمال / الصناعة:' : 'Industry Sector:'}
            </label>
            <select
              value={industrySector}
              onChange={(e) => setIndustrySector(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              <option value="FINANCIAL">{lang === 'ar' ? 'القطاع المصرفي والمالي (Banking)' : 'Financial & Banking'}</option>
              <option value="HEALTHCARE">{lang === 'ar' ? 'الصحة والمستشفيات (Healthcare)' : 'Healthcare & Medical'}</option>
              <option value="ENERGY">{lang === 'ar' ? 'الطاقة والبنية التحتية (Energy)' : 'Energy & Critical Infra'}</option>
              <option value="TECH">{lang === 'ar' ? 'التكنولوجيا والاتصالات (Tech & Telco)' : 'Tech & Telecommunications'}</option>
              <option value="GOV">{lang === 'ar' ? 'القطاع الحكومي والسيادي (Government)' : 'Government & Sovereign'}</option>
            </select>
          </div>
        </div>

        {/* Calculated Results */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/40 text-center">
            <span className="text-[11px] text-slate-400 block font-bold">
              {lang === 'ar' ? 'متوسط الخسارة المحمية من الاختراق (Protected Breach Cost):' : 'Estimated Breach Risk Avoided:'}
            </span>
            <span className="text-lg sm:text-xl font-bold text-rose-300 font-mono mt-1 block">
              ${(estimatedBreachRisk / 1000000).toFixed(2)}M USD
            </span>
            <span className="text-[10px] text-rose-400 mt-1 block">حماية أصول الشركة من الشلل التام</span>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 text-center">
            <span className="text-[11px] text-slate-400 block font-bold">
              {lang === 'ar' ? 'تكلفة تشغيل SOC بشري تقليدي سنوياً:' : 'Legacy Manual SOC Operational Cost:'}
            </span>
            <span className="text-lg sm:text-xl font-bold text-cyan-300 font-mono mt-1 block">
              ${(estimatedSocAnalystCostYearly / 1000).toFixed(0)}K / Year
            </span>
            <span className="text-[10px] text-cyan-400 mt-1 block">رواتب مهندسي تحليل الحوادث Tier-1</span>
          </div>

          <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-center">
            <span className="text-[11px] text-slate-400 block font-bold">
              {lang === 'ar' ? 'صافي الوفورات السنوية مع ACDC:' : 'Net Annual Operational Savings:'}
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-300 font-mono mt-1 block">
              +${(Math.max(10000, netEstimatedSavings) / 1000).toFixed(0)}K USD
            </span>
            <span className="text-[10px] text-emerald-400 mt-1 block">عائد استثماري ROI يتجاوز 420%</span>
          </div>
        </div>
      </div>

    </div>
  );
};
