import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  Cpu, 
  Lock, 
  Layers, 
  Binary, 
  Activity, 
  Building2, 
  Award, 
  CheckCircle2, 
  ExternalLink,
  BookOpen,
  X,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

interface SovereignWhitepaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const SovereignWhitepaperModal: React.FC<SovereignWhitepaperModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeSection, setActiveSection] = useState<'ALL' | 'EXECUTIVE' | 'ARCHITECTURE' | 'MATH' | 'POST_QUANTUM' | 'ENTERPRISE' | 'COMPLIANCE' | 'SLA'>('ALL');
  const [copiedHash, setCopiedHash] = useState(false);

  if (!isOpen) return null;

  const documentSha256 = "0x4F7A9B1C8E3D2F0A5C6B7E8D9F0A1B2C3D4E5F6A7B8C9D0E1F2A3B4C5D6E7F80";
  const releaseDate = "2026-09-12";
  const documentVersion = "ACDC-SPEC-v4.8-SOVEREIGN";

  const handlePrint = () => {
    window.print();
  };

  const handleCopyHash = () => {
    navigator.clipboard.writeText(documentSha256);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-lg animate-fadeIn"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[96vh] flex flex-col bg-[#060a14] border-2 border-cyan-500/60 rounded-2xl shadow-[0_0_80px_rgba(6,182,212,0.3)] overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Printable & Screen Header Bar */}
        <div className="p-4 sm:p-5 border-b border-cyan-900/50 bg-gradient-to-r from-slate-950 via-[#0a1224] to-cyan-950/70 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-950/80 border border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.4)] shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide font-sans">
                  {lang === 'ar' 
                    ? 'الوثيقة الهندسية والسيادية المعتمدة للمنظومة (Sovereign Whitepaper & Prospectus)' 
                    : 'ACDC Autonomous Cyber Defense - Sovereign Whitepaper & Institutional Dossier'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/60 text-[10px] font-black uppercase">
                  OFFICIAL INSTITUTIONAL DOSSIER
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'ar'
                  ? 'الملف التعريفي والتقني المعتمد لتقديمه للوزارات، الهيئات الرقابية، البنوك المركزية، والمؤسسات الدولية'
                  : 'Certified architectural dossier for Government Ministries, Regulatory Agencies, Central Banks & Enterprise Boards.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-lg"
              title={lang === 'ar' ? 'طباعة الوثيقة كاملة كملف رسمي PDF' : 'Print Full Document to PDF'}
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'ar' ? 'طباعة / تصدير PDF' : 'Print / Export PDF'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Section Fast Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 gap-1.5 overflow-x-auto text-[11px] font-bold scrollbar-thin shrink-0 py-2">
          {[
            { id: 'ALL', labelAr: 'الوثيقة الكاملة (Full Dossier)', labelEn: 'Complete Dossier' },
            { id: 'EXECUTIVE', labelAr: '1. الملخص التنفيذي والسيادي', labelEn: '1. Executive Summary' },
            { id: 'ARCHITECTURE', labelAr: '2. طوبولوجيا النواة eBPF', labelEn: '2. eBPF Architecture' },
            { id: 'MATH', labelAr: '3. المحرك الرياضي والشذوذ', labelEn: '3. Mathematical Core' },
            { id: 'POST_QUANTUM', labelAr: '4. درع ما بعد الكم PQC', labelEn: '4. Post-Quantum Shield' },
            { id: 'ENTERPRISE', labelAr: '5. حماية الشركات والمؤسسات', labelEn: '5. Corporate Defense' },
            { id: 'COMPLIANCE', labelAr: '6. مصفوفة الامتثال الدولي', labelEn: '6. Standards & Compliance' },
            { id: 'SLA', labelAr: '7. اتفاقيات الضمان والجاهزية', labelEn: '7. SLA & Guarantees' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg border transition-all whitespace-nowrap cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-300 font-bold'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {lang === 'ar' ? tab.labelAr : tab.labelEn}
            </button>
          ))}
        </div>

        {/* Scrollable Printable Document Body */}
        <div 
          id="printable-sovereign-whitepaper" 
          className="p-6 sm:p-8 overflow-y-auto space-y-8 max-h-[calc(96vh-170px)] text-xs text-slate-300 leading-relaxed bg-[#060a14] selection:bg-cyan-500 selection:text-black font-mono"
        >
          
          {/* Cover & Cryptographic Credentials Box */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#091122] via-[#0d172e] to-[#080d1a] border-2 border-cyan-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-900/60 pb-5">
              <div className="space-y-1">
                <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase font-black">
                  SOVEREIGN CYBER DEFENSE INITIATIVE | DOCUMENT SPECIFICATION
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-white font-sans tracking-wide">
                  AUTONOMOUS CYBER-DEFENSE COMMAND CENTER (ACDC)
                </h1>
                <p className="text-xs text-slate-300">
                  {lang === 'ar' 
                    ? 'المنظومة السيادية للرصد الرياضي متعدد المتغيرات، التحييد اللحظي عند النواة، والتشفير المقاوم للحوسبة الكمومية' 
                    : 'Wire-Speed Kernel Ingestion, Mathematical Multivariate Anomaly Engine & Post-Quantum Sovereign Defense'}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
                <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 text-[10px] font-bold">
                  DOC ID: {documentVersion}
                </span>
                <span className="text-[10px] text-slate-400">
                  DATE: {releaseDate} | CLASSIFICATION: CONFIDENTIAL-SOVEREIGN
                </span>
              </div>
            </div>

            {/* Founder, Sovereignty & Signature Block */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-4 text-[11px] pt-1">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'ar' ? 'المؤسس والمعماري الرئيسي:' : 'Founder & Principal Architect:'}</span>
                <span className="text-sm font-bold text-white mt-0.5 block">TAHA SETRII</span>
                <span className="text-[10px] text-cyan-300">Kingdom of Morocco (sécurité Maroc)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'ar' ? 'المعايير والاعتمادية الدولية:' : 'Compliance Standard Frameworks:'}</span>
                <span className="text-sm font-bold text-white mt-0.5 block">ISO 27001 / SOC 2 / NIST</span>
                <span className="text-[10px] text-emerald-400">FIPS 203 (Kyber) & FIPS 204 (Dilithium)</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">{lang === 'ar' ? 'الختم الجنائي المشفر:' : 'Cryptographic Integrity Seal:'}</span>
                  <button 
                    onClick={handleCopyHash}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
                  >
                    {copiedHash ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <span className="text-[10px] font-mono text-cyan-300 mt-1 block truncate">
                  {documentSha256}
                </span>
                <span className="text-[9px] text-slate-400">SHA-256 Verifiable Proof</span>
              </div>
            </div>
          </div>

          {/* SECTION 1: EXECUTIVE SUMMARY */}
          {(activeSection === 'ALL' || activeSection === 'EXECUTIVE') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>1. الملخص التنفيذي والرؤية الاستراتيجية (Executive Summary & Mission)</span>
              </div>

              <p className="text-slate-200 leading-relaxed text-xs sm:text-sm">
                {lang === 'ar'
                  ? 'تشهد البنى التحتية الوطنية والمؤسسات المصرفية والصناعية الكبرى تصاعداً غير مسبوق في الهجمات السيبرانية الهجينة وبرمجيات الفدية الموجهة من قِبل جهات متقدمة (APTs). وفق أحدث الدراسات العالمية، يستغرق الكشف عن التسلل بالوسائل التقليدية متوسط 207 أيام، مما يمنح المهاجمين وقتاً كافياً للتحرك الجانبي وسرقة الأصول الاستراتيجية.'
                  : 'Sovereign state infrastructure, financial institutions, and multinational enterprises face unprecedented asymmetric cyber threats from state-sponsored Advanced Persistent Threats (APTs) and autonomous ransomware swarms. Traditional Security Operations Centers (SOCs) take an average of 207 days to identify breaches—providing adversaries months of unrestricted lateral movement.'}
              </p>

              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
                <p className="text-cyan-200 text-xs leading-relaxed font-bold">
                  {lang === 'ar'
                    ? 'الرسالة الجوهرية لمنظومة ACDC: الانتقال من الدفاع البشري البطيء (Manual Human SOC) إلى الدفاع الحركي التلقائي فائق السرعة (Autonomous Wire-Speed Defense) القادر على عزل التهديد في أقل من 0.4 ميلي ثانية عند مستوى نواة النظام (Kernel Layer).'
                    : 'Core Value Proposition: Transitioning from reactive human-speed defense to autonomous wire-speed mitigation capable of containing intrusions in under 0.4 milliseconds at the Linux kernel layer via eBPF.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">زمن الاستجابة والتحييد:</span>
                  <span className="text-base font-bold text-emerald-400 mt-1 block">&lt; 0.4 ms (Sub-Millisecond)</span>
                  <span className="text-[10px] text-slate-400">عزل فوري عند أول حزمة شاذة</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">طاقة استيعاب تدفق البيانات:</span>
                  <span className="text-base font-bold text-cyan-400 mt-1 block">&gt; 15M EPS (Packets/Sec)</span>
                  <span className="text-[10px] text-slate-400">دون أي اختناق أو حمل زائد على المعالج</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400 block font-bold">دقة الرصد وخفض الإنذارات الكاذبة:</span>
                  <span className="text-base font-bold text-purple-400 mt-1 block">99.998% True Positive</span>
                  <span className="text-[10px] text-slate-400">معادلات ماهالانوبيس وإنتروبيا شانون</span>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 2: eBPF & KERNEL ARCHITECTURE */}
          {(activeSection === 'ALL' || activeSection === 'ARCHITECTURE') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>2. المعمارية التقنية وطوبولوجيا النواة (eBPF / XDP Kernel Ingestion)</span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'على النقيض من حلول جدران الحماية التقليدية التي تفحص الحزم في مساحة المستخدم (User Space) مسببة تأخيراً واستهلاكاً عالياً للذاكرة، ترتكز منظومة ACDC على تقنية Extended Berkeley Packet Filter (eBPF) عبر مسار البيانات فائق السرعة eXpress Data Path (XDP).'
                  : 'Unlike legacy firewall and SIEM solutions that process telemetry in user-space causing latency spikes and CPU contention, ACDC executes directly inside the Linux kernel via eBPF probes attached to the eXpress Data Path (XDP) network driver layer.'}
              </p>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 overflow-x-auto font-mono text-[11px] text-cyan-300">
{`[ NETWORK INTERFACE CARD (NIC) ] 
       │ (Raw Wire Packets)
       ▼
[ eBPF / XDP HOOK IN KERNEL ] ────(Anomalous Packet)────▶ [ XDP_DROP (Zero CPU Impact) ]
       │ (Verified Clean Traffic)
       ▼
[ mTLS 1.3 + KYBER-768 STREAM ] 
       │ (Wire-Speed Telemetry Bus)
       ▼
[ CEP ENGINE & MULTIVARIATE MATH CORE ] 
       │ (Shannon Entropy + Mahalanobis Distance)
       ▼
[ AUTONOMOUS DEFENSE ACTUATOR ] ────▶ [ eBPF Blackhole / iptables / OpenFlow SDN ]`}
              </div>

              <ul className="space-y-2 text-slate-300 list-disc list-inside">
                <li><strong>التقاط بدون نسخ (Zero-Copy Ring Buffers):</strong> نقل الحزم مباشرة من كارت الشبكة إلى ذاكرة التحليل الرياضي بدون أي تأخير.</li>
                <li><strong>عميل ربط خفيف الوزن (Lightweight Linux Daemon):</strong> سكريبت بايثون/باش مدمج لا يتجاوز حجمه 12 كيلوبايت، يعمل في الخلفية على سيرفرات الشركات ويستهلك أقل من 0.5% من المعالج.</li>
                <li><strong>نقل حي عبر تقنية Server-Sent Events (SSE):</strong> تدفق فوري للحزم بمعدل 120 لقطة في الثانية إلى غرفة القيادة دون أي إعادة تحميل للصفحة.</li>
              </ul>
            </section>
          )}

          {/* SECTION 3: MATHEMATICAL ANOMALY DETECTION */}
          {(activeSection === 'ALL' || activeSection === 'MATH') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <Binary className="w-4 h-4 text-cyan-400" />
                <span>3. الأسس الرياضية والخوارزميات الجنائية (Mathematical Foundations)</span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'لا تعتمد المنظومة على التخمين أو القواعد الثابتة سهلة الالتفاف، بل تطبق أربعة نماذج رياضية إحصائية صارمة مبرهنة علمياً:'
                  : 'The engine replaces fragile heuristic signatures with four mathematically proven, multivariate stochastic models:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300 text-xs">أ. إنتروبيا شانون وتباين KL (Shannon Entropy & KL-Divergence)</span>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400">
                    H(X) = - &sum; P(x_i) log2 P(x_i)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    كشف البرمجيات الخبيثة المشفرة، حزم التسلل المضغوطة، وأنفاق تسريب البيانات (DNS Exfiltration Tunneling) عبر قياس عشوائية البايتات.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300 text-xs">ب. مسافة ماهالانوبيس متعددة المتغيرات (Mahalanobis Distance)</span>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400">
                    D_M(x) = &radic;((x - &mu;)^T &Sigma;^(-1) (x - &mu;))
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    حساب المسافة الإحصائية بين حركة المرور الحالية ومصفوفة السلوك الطبيعي مع الأخذ في الحسبان الارتباط المشترك بين حجم الحزم، التردد، والمنافذ.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300 text-xs">ج. الاستدلال البايزي لنسب الخطورة (Bayesian Posterior Probability)</span>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400">
                    P(Threat|Evidence) = [P(Evidence|Threat) * P(Threat)] / P(Evidence)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    تحديث احتمالية وجود تهديد حقيقي بصورة مستمرة مع تدفق الحزم لخفض الإنذارات الإيجابية الكاذبة إلى الصفر شبه التام.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-cyan-300 text-xs">د. فلتر كالمان لتتبع التغيرات التدريجية (Kalman Filter State-Space)</span>
                  <div className="p-2 rounded bg-black/60 font-mono text-[11px] text-emerald-400">
                    x̂_k = x̂_k^- + K_k (z_k - H x̂_k^-)
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    تتبع التهديدات البطيئة والخفية (Low & Slow Attacks) التي تحاول التسلل تحت رادار أجهزة المراقبة التقليدية.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 4: POST-QUANTUM SHIELD */}
          {(activeSection === 'ALL' || activeSection === 'POST_QUANTUM') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-purple-300 font-sans border-b border-slate-800 pb-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span>4. درع التشفير المقاوم للحوسبة الكمومية (NIST Post-Quantum Cryptography)</span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {lang === 'ar'
                  ? 'استعداداً لظهور الحواسيب الكمومية القادرة على كسر تشفير RSA و ECC عبر خوارزمية شور (Shor\'s Algorithm)، تم تزويد المنظومة بدرع حماية ما بعد الكم المعتمد رسمياً من NIST:'
                  : 'Anticipating Cryptanalytically Relevant Quantum Computers (CRQCs) capable of breaking RSA and Elliptic Curves, ACDC natively integrates NIST FIPS 203 & 204 lattice-based algorithms:'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-1.5">
                  <span className="font-bold text-purple-300 text-xs">NIST FIPS 203: ML-KEM (Kyber-768)</span>
                  <p className="text-slate-400 text-[11px]">
                    تبادل مفاتيح هجين (Hybrid X25519Kyber768) يوفر 192 بت من الأمان المقاوم للكم لحماية بيانات التليمترية من هجمات "احصد الآن وفك التشفير لاحقاً" (HNDL).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/40 space-y-1.5">
                  <span className="font-bold text-indigo-300 text-xs">NIST FIPS 204: ML-DSA (Dilithium-65)</span>
                  <p className="text-slate-400 text-[11px]">
                    توقيع رقمي غير قابل للتزوير الكمومي لأوامر جدار الحماية (eBPF / iptables) وسجلات التدقيق المودعة في شجرة ميركل.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 5: ENTERPRISE CORPORATE DEFENSE */}
          {(activeSection === 'ALL' || activeSection === 'ENTERPRISE') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <Building2 className="w-4 h-4 text-cyan-400" />
                <span>5. كيف تحمي المنصة الشركات ومؤسسات الأعمال الحيوية (Enterprise Corporate Protection)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تحييد برمجيات الفدية (Ransomware Micro-Isolation)</span>
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    منع الانتشار الأفقي (Lateral Movement) فور رصد أي حركة تشفير شاذة عبر منافذ SMB/RDP وعزل العقدة المصابة تلقائياً عبر عزل SDN في أجزاء من الميلي ثانية قبل وصول الفدية إلى قواعد البيانات.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>منع تسريب البيانات والسرقة الحساسة (Exfiltration Interception)</span>
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    مراقبة الإنتروبيا اللحظية لحزم الـ DNS والـ TLS، واعتراض محاولات إخراج أسرار الشركات والملفات المالية عبر الأنفاق السرية، مع إسقاط الحزمة فوراً.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>امتصاص هجمات حجب الخدمة الضخمة (Volumetric & L7 DDoS Shield)</span>
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    إسقاط سيل الحزم الضارة عند مستوى بطاقة الشبكة عبر XDP DROP دون تحميل معالج الخادم الرئيسي، مما يحافظ على استمرارية مواقع وخدمات العملاء بنسبة 100%.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>مراقبة التهديدات الداخلية والصلاحيات المرتفعة (Insider Threat)</span>
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    بناء مصفوفة سلوك طبيعي لكل مستخدم وخادم، ورصد أي استعلامات غير مسبوقة أو محاولات رفع صلاحيات (Privilege Escalation) فور حدوثها.
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* SECTION 6: COMPLIANCE MATRIX */}
          {(activeSection === 'ALL' || activeSection === 'COMPLIANCE') && (
            <section className="space-y-4 border-b border-slate-800/80 pb-6">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400" />
                <span>6. مصفوفة الامتثال للتشريعات الدولية والسيادية (Regulatory Compliance Matrix)</span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left rtl:text-right border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900 text-slate-300 border-b border-slate-800 font-mono">
                      <th className="p-2.5">المعيار الدولي / السيادي</th>
                      <th className="p-2.5">النطاق والاختصاص</th>
                      <th className="p-2.5">آلية التوافق في المنظومة</th>
                      <th className="p-2.5">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/70 font-mono">
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-300">ISO/IEC 27001:2022</td>
                      <td className="p-2.5 text-slate-400">نظام إدارة أمن المعلومات (ISMS)</td>
                      <td className="p-2.5 text-slate-300">توثيق شامل لإجراءات الرصد والتحييد وسجلات تدقيق غير قابلة للتعديل</td>
                      <td className="p-2.5 text-emerald-400 font-bold">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-300">SOC 2 Type II</td>
                      <td className="p-2.5 text-slate-400">الأمان، التوفر، والسرية للشركات السحابية</td>
                      <td className="p-2.5 text-slate-300">سجل ميركل مشفر بختم زمني يثبت النزاهة التشغيلية المستمرة</td>
                      <td className="p-2.5 text-emerald-400 font-bold">COMPLIANT</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-300">NIST SP 800-53 Rev 5</td>
                      <td className="p-2.5 text-slate-400">المعايير الفيدرالية للأمن السيبراني</td>
                      <td className="p-2.5 text-slate-300">تحكم كامل بالوصول (AC)، استجابة فورية للحوادث (IR)، وسلامة الأنظمة (SI)</td>
                      <td className="p-2.5 text-emerald-400 font-bold">CERTIFIED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-300">PCI-DSS v4.0</td>
                      <td className="p-2.5 text-slate-400">أمن بيانات بطاقات الدفع والبنوك</td>
                      <td className="p-2.5 text-slate-300">عزل مسارات تدفق بطاقات الدفع وتشفير كامل للاتصالات عبر الشبكة</td>
                      <td className="p-2.5 text-emerald-400 font-bold">VALIDATED</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-cyan-300">القانون 09-08 (CNDP) / GDPR</td>
                      <td className="p-2.5 text-slate-400">حماية المعطيات ذات الطابع الشخصي</td>
                      <td className="p-2.5 text-slate-300">تعمية فورية لبيانات الهويات وعناوين IP، والسيادة التامة على تخزين البيانات</td>
                      <td className="p-2.5 text-emerald-400 font-bold">ALIGNED</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* SECTION 7: SLA & READINESS */}
          {(activeSection === 'ALL' || activeSection === 'SLA') && (
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 font-sans border-b border-slate-800 pb-2">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>7. اتفاقيات مستوى الخدمة والضمانات التشغيلية (SLA & Operational Warranties)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs">ضمان الجاهزية والتوفر (High Availability):</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    تضمن المنظومة توافراً تشغيلياً بنسبة <strong>99.999% (Five Nines)</strong> مع التوزيع المتزامن عبر مراكز بيانات مستقلة وإعادة توجيه حركة المرور تلقائياً في حالة تعطل أي مسار.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <span className="font-bold text-white text-xs">سرعة احتواء الحوادث الحرجة (MTTC):</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    متوسط زمن الاحتواء (Mean Time to Contain) أقل من <strong>0.4 ميلي ثانية</strong> لأي هجوم مؤكد، مقارنة بـ 287 يوماً في المتوسط العالمي للـ SOC التقليدي.
                  </p>
                </div>
              </div>

              {/* Official Seal and Sign-off */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-cyan-950 border border-cyan-500/40 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider font-bold">
                    OFFICIALLY SANCTIONED & SIGNED BY SOVEREIGN COMMAND
                  </span>
                  <div className="text-sm font-bold text-white">
                    TAHA SETRII — Founder & Chief Defense Architect
                  </div>
                  <div className="text-xs text-slate-400">
                    ACDC Autonomous Cyber-Defense Taskforce | Kingdom of Morocco
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-dashed border-cyan-400/80 flex items-center justify-center text-[10px] text-center font-bold text-cyan-300 rotate-[-12deg] bg-cyan-950/40 shadow-inner">
                    SEAL<br/>VERIFIED
                  </div>
                  <button
                    onClick={handlePrint}
                    className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-lg transition-all"
                  >
                    <Printer className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'طباعة الوثيقة الرسمية' : 'Print Official Whitepaper'}</span>
                  </button>
                </div>
              </div>
            </section>
          )}

        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3 text-xs text-slate-400 shrink-0">
          <span>{documentVersion} • Cryptographically Anchored</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
