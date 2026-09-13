import React, { useState } from 'react';
import { 
  BookOpen, 
  FileText, 
  Search, 
  Copy, 
  Check, 
  Download, 
  ChevronRight, 
  Shield, 
  Cpu, 
  Zap, 
  Activity, 
  Lock,
  Server,
  Building2
} from 'lucide-react';

interface BlueprintDocumentViewerProps {
  lang: 'ar' | 'en';
}

export const BlueprintDocumentViewer: React.FC<BlueprintDocumentViewerProps> = ({ lang }) => {
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<'TOPOLOGY' | 'MATH' | 'MITIGATION' | 'UX' | 'GOVERNANCE' | 'DEPLOYMENT'>('TOPOLOGY');

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      
      {/* Header Bar */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          <div>
            <h2 className="text-base font-bold text-slate-100 font-display-cyber">
              {lang === 'ar' ? 'الدستور الهندسي الشامل والمعمارية المرجعية (Blueprint Specifications)' : 'AUTONOMOUS COMMAND CENTER ARCHITECTURAL BLUEPRINT (ACDC-v4.0)'}
            </h2>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'الوثيقة الهندسية الصارمة لكافة مكونات البنية التحتية، الرياضيات، والمصفوفات التشغيلية.' : 'Comprehensive engineering specifications, topology pipelines, mathematical proofs, and governance protocols.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono-cyber text-slate-300 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'طباعة / تصدير PDF' : 'Print / Export PDF'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs for Blueprint Sections */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2 text-xs font-mono-cyber">
        {[
          { id: 'TOPOLOGY', label: lang === 'ar' ? '1. طوبولوجيا الأنظمة وتدفق البيانات' : '1. System Topology & Data Flow', icon: <Cpu className="w-3.5 h-3.5" /> },
          { id: 'MATH', label: lang === 'ar' ? '2. محرك الرصد الرياضي وكشف الشذوذ' : '2. Mathematical Anomaly Detection', icon: <Activity className="w-3.5 h-3.5" /> },
          { id: 'MITIGATION', label: lang === 'ar' ? '3. محرك الدفاع والرد والتحييد الذاتي' : '3. Autonomous Mitigation Engine', icon: <Zap className="w-3.5 h-3.5" /> },
          { id: 'UX', label: lang === 'ar' ? '4. استوديو العرض وهندسة الواجهات' : '4. Command Center UX & Ergonomics', icon: <Shield className="w-3.5 h-3.5" /> },
          { id: 'GOVERNANCE', label: lang === 'ar' ? '5. الحوكمة والتشفير وسجل ميركل' : '5. Zero-Trust & Cryptographic Ledger', icon: <Lock className="w-3.5 h-3.5" /> },
          { id: 'DEPLOYMENT', label: lang === 'ar' ? '6. دليل النشر التجاري والإنتاج الحقيقي' : '6. Production VPS & SaaS Deployment Guide', icon: <Server className="w-3.5 h-3.5" /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeSection === tab.id
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 font-bold shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Blueprint Content Sheet */}
      <div className="rounded-xl border border-slate-800 bg-[#060911] p-6 font-mono-cyber text-xs leading-relaxed text-slate-300 max-h-[700px] overflow-y-auto space-y-6">
        
        {activeSection === 'TOPOLOGY' && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-display-cyber border-b border-slate-800 pb-2">
              1. المعمارية العامة للأنظمة وتدفق البيانات (System Topology & Data Flow Pipeline)
            </h3>
            
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 overflow-x-auto whitespace-pre">
{`[Edge Sensors / eBPF] ──▶ [Encrypted Pipeline] ──▶ [Stream Bus] ──▶ [CEP Analytics Engine] ──▶ [Command Center]
  • Wire-speed capture      • Mutual TLS 1.3        • Micro-batching   • Entropy/Mahalanobis       • Sub-second render
  • Zero-copy packet ring   • Hardware HMAC-SHA256  • Distributed log  • State-space tracking      • Dynamic visual wall`}
            </div>

            <div className="space-y-2 text-slate-300">
              <p>
                <strong>طبقة الاستشعار والالتقاط الحرج:</strong> استشعار نواة النظام (Kernel-space Sensors) المبنية على تقنية eBPF في مسار XDP (eXpress Data Path) قبل وصول الحزمة لمكدس الشبكة، مع التقاط سجلات IPFIX وNetFlow v9 من كافة المحولات المركزية عبر قنوات مخصصة ذات أولوية خدمة (QoS DSCP CS6).
              </p>
              <p>
                <strong>طبقة النقل والاصطفاف فائق السرعة:</strong> نفق نقل مشفر بتقنية mTLS (Mutual TLS 1.3) باستخدام خوارزميات ما بعد الكم (Hybrid Kyber-768)، وناقل رسائل موزع (Distributed Streaming Bus) مقسم وفق Consistent Hashing Partitioning لتحمل معدلات تتجاوز 15M EPS بزمن تأخير يقل عن 1.2 ميلي ثانية.
              </p>
              <p>
                <strong>التخزين المتدرج متعدد السرعات:</strong> Hot Tier معتمد على الذاكرة العشوائية لآخر 72 ساعة، Warm Tier عمودي مضغوط بـ Zstandard لـ 90 يوماً، وCold Tier غير قابل للتعديل (WORM) موثق بمفاتيح عتادية HSM.
              </p>
            </div>
          </section>
        )}

        {activeSection === 'MATH' && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-display-cyber border-b border-slate-800 pb-2">
              2. هندسة محرك الرصد الرياضي وكشف الشذوذ (Mathematical Anomaly Architecture)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <h4 className="font-bold text-cyan-300 mb-1">أ. إنتروبيا شانون وتباين KL</h4>
                <p className="text-slate-400 text-[10px]">H(X) = - &sum; P(x_i) log2 P(x_i)</p>
                <p className="mt-2 text-slate-300 text-[11px]">
                  قياس تشتت الحزم ومنافذ المصدر والوجهة. يُطلق شرط الشذوذ عندما يتجاوز تباعد كولباك-ليبلير (Kullback-Leibler) العتبة الديناميكية الدورية.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <h4 className="font-bold text-emerald-300 mb-1">ب. مسافة ماهالانوبيس متعدّدة التغاير</h4>
                <p className="text-slate-400 text-[10px]">D_M(x) = &radic;((x - &mu;)^T &Sigma;^(-1) (x - &mu;))</p>
                <p className="mt-2 text-slate-300 text-[11px]">
                  حساب المسافة الإحصائية في فضاء الخصائص متعدد الأبعاد بالاعتماد على محدد الحد الأدنى للتغاير (FastMCD) لإلغاء الارتباط الخطي الزائف.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <h4 className="font-bold text-purple-300 mb-1">ج. اختبار Page-Hinkley & CUSUM</h4>
                <p className="text-slate-400 text-[10px]">PH_n = U_n - min(U_i) &gt; &lambda;</p>
                <p className="mt-2 text-slate-300 text-[11px]">
                  تراكم الانحرافات المتناهية الصغر عبر نوافذ زمنية ممتدة لكشف هجمات التسلل البطيء (Low-and-Slow) وتسريب البيانات الصامت.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800">
                <h4 className="font-bold text-amber-300 mb-1">د. مرشح كالمان التكيفي (EKF)</h4>
                <p className="text-slate-400 text-[10px]">Residual = z_k - H_k * x_hat</p>
                <p className="mt-2 text-slate-300 text-[11px]">
                  تتبع فضاء الحالة اللحظي وتصفية ضوضاء الشبكة الطبيعية، واكتشاف محاولات تضليل وتسميم الخط الأساسي المعياري (Baseline Poisoning).
                </p>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'MITIGATION' && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-display-cyber border-b border-slate-800 pb-2">
              3. محرك الدفاع والرد والتحييد الذاتي (Autonomous Mitigation & Response)
            </h3>

            <div className="space-y-2">
              <p>
                <strong>بوابة الثقة البايزية (Bayesian Confidence Gate):</strong> اشتراط تحقيق احتمالية لاحقة P(Attack | E1...Em) &ge; 0.985 قبل أي تحييد آلي لمنع الإيجابيات الكاذبة.
              </p>
              <p>
                <strong>معيار أمان نصف قطر الانفجار (Blast Radius Invariant):</strong> استعلام فوري لخريطة التبعيات الطبولوجية للتأكد من عدم قطع أي خدمة ذات تصنيف تشغيلي حرج (Tier-0 Infrastructure).
              </p>
              <p>
                <strong>أدوات التحييد المباشر:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-400">
                <li><strong className="text-slate-200">eBPF / XDP Dropping:</strong> إسقاط الحزم عند مستوى بطاقة الشبكة بزمن يقل عن 500 نانو ثانية.</li>
                <li><strong className="text-slate-200">BGP Flowspec:</strong> تشتيت وإعادة توجيه الفيضانات الضخمة إلى مراكز التصفية.</li>
                <li><strong className="text-slate-200">SDN Micro-Segmentation:</strong> فرض عزل تام للأصل المخترق ضمن شبكة افتراضية معزولة فورياً.</li>
                <li><strong className="text-slate-200">IdP Token Nullification:</strong> إبطال فوري لشهادات OAuth وتذاكر Kerberos وتجميد الذاكرة الحية.</li>
              </ul>
            </div>
          </section>
        )}

        {activeSection === 'UX' && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-display-cyber border-b border-slate-800 pb-2">
              4. استوديو العرض وهندسة الواجهات (Command Center UX & Ergonomics)
            </h3>

            <div className="space-y-2">
              <p>
                <strong>معايير ISO 11064 لتصميم غرف العمليات:</strong> شاشات عرض عريضة (Matrix 32:9 Aspect Ratio)، ألوان داكنة عالية التباين (#0A0D14) مطابقة لمعيار WCAG AAA لتقليل الإجهاد البصري للضباط والمحللين.
              </p>
              <p>
                <strong>مؤشرات الأداء التشغيلية الحرجة:</strong>
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-[11px]">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">MTTD الحسابي:</div>
                  <div className="text-amber-400 font-bold">&lt; 250 Milliseconds</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">MTTR التحييدي:</div>
                  <div className="text-emerald-400 font-bold">&lt; 1.5 Seconds</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">كفاءة الاستجابة AEI:</div>
                  <div className="text-cyan-400 font-bold">&gt; 99.8%</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-slate-400">نسبة الإيجابيات الكاذبة:</div>
                  <div className="text-slate-200 font-bold">&lt; 0.001%</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'GOVERNANCE' && (
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 font-display-cyber border-b border-slate-800 pb-2">
              5. الحوكمة والتشفير وسجل ميركل والامتثال (Zero-Trust & Cryptographic Ledger)
            </h3>

            <div className="space-y-2">
              <p>
                <strong>نموذج انعدام الثقة (NIST SP 800-207):</strong> انعدام الثقة الضمنية، بوابات سيطرة PEP/PDP مشروطة بالسياق والسمات (ABAC)، وقاعدة التحكم المشرف المزدوج (Two-Man Rule / Dual-Custody) عبر مفاتيح فيزيائية FIDO2.
              </p>
              <p>
                <strong>التشفير في كافة الأطوار:</strong> TLS 1.3 مع حزم التشفير ما بعد الكم (Kyber-768)، وتشفير الذاكرة الحية في وحدات الحوسبة السرية (AMD SEV-SNP / Intel SGX)، وتأمين المفاتيح في عتاد HSM FIPS 140-3 Level 4.
              </p>
              <p>
                <strong>سجل ميركل غير القابل للتحريف (Immutable WORM):</strong> ربط تسلسلي رياضي يمنع التلاعب أو حذف السجلات الجنائية بأي وسيلة.
              </p>
              <p>
                <strong>استمرارية العمليات ونمط الجزيرة (Air-Gapped Islanding):</strong> هدف زمن تعافي RTO=0 للعمليات الحرجة، واستقلالية دفاعية كاملة 100% حتى في حال الانقطاع التام لكابلات الاتصال الخارجية.
              </p>
            </div>
          </section>
        )}

        {activeSection === 'DEPLOYMENT' && (
          <section className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-sm font-bold text-emerald-400 font-display-cyber flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? '6. دليل النشر التجاري والتشغيل الحقيقي على خوادم الإنتاج (Bare-Metal & VPS)' : '6. Commercial B2B Production Deployment Guide'}</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-mono border border-emerald-600/40">
                100% INDEPENDENT PRODUCTION
              </span>
            </div>

            <div className="space-y-4 text-slate-300">
              <div className="p-3.5 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-xs">
                <p className="font-bold text-emerald-300 mb-1">
                  {lang === 'ar' ? 'التحول من النموذج التجريبي إلى منتج تجاري حقيقي مملوك لك بالكامل:' : 'Running this SaaS platform in real production under your private ownership:'}
                </p>
                <p className="text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'الكود البرمجي الحالي مبني بالكامل ليعمل كـ منصة متكاملة (Full-Stack Express + React). يمكنك تنزيل هذا الكود ونشره على أي خادم سحابي حقيقي (Hetzner, OVH, AWS, DigitalOcean, أو خوادمك الخاصة Sécurité Maroc) دون أدنى ارتباط بأي جهة.'
                    : 'The codebase is fully structured as an enterprise Express + React microservice. You can host this repository on any physical server or cloud VPS with complete independence.'}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-cyan-400">1</span>
                  <span>{lang === 'ar' ? 'تجهيز خادم الإنتاج (Ubuntu 22.04 LTS / Debian 12)' : 'Step 1: Production Server Provisioning'}</span>
                </h4>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-cyan-300 overflow-x-auto">
{`# 1. تحديث النظام وتثبيت بيئة Node.js 20 و Python3
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git iptables python3-pip

# 2. تنزيل المنظومة وتثبيت الحزم
git clone https://github.com/your-username/acdc-cyber-platform.git
cd acdc-cyber-platform
npm install
npm run build`}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-cyan-400">2</span>
                  <span>{lang === 'ar' ? 'تشغيل الخادم كخدمة نظام دائمة (Systemd Daemon)' : 'Step 2: Continuous Systemd Service Setup'}</span>
                </h4>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 overflow-x-auto">
{`# إنشاء ملف الخدمة /etc/systemd/system/acdc-soc.service
[Unit]
Description=ACDC Autonomous Cyber-Defense Production Platform
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/acdc-platform
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target

# تفعيل وتشغيل الخدمة
sudo systemctl daemon-reload
sudo systemctl enable --now acdc-soc`}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-[10px] text-cyan-400">3</span>
                  <span>{lang === 'ar' ? 'ربط الخوادم الخارجية للعملاء (B2B Client Server Agents)' : 'Step 3: Connecting Client Linux Servers'}</span>
                </h4>
                <p className="text-xs text-slate-400">
                  {lang === 'ar'
                    ? 'يقوم العميل بتنفيذ أمر واحد فقط على خادمه الحقيقي لتنزيل الوكيل وربطه بلوحتك:'
                    : 'The client executes one command on their real VPS to stream live network packets to your SOC:'}
                </p>
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-emerald-400 overflow-x-auto">
{`curl -sSfL "https://soc.yourdomain.com/api/agent-install.sh" | sudo bash`}
                </div>
              </div>
            </div>
          </section>
        )}

      </div>

    </div>
  );
};
