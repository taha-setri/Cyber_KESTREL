import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  Scale, 
  AlertTriangle, 
  Cookie, 
  CheckCircle2, 
  X, 
  Download, 
  ExternalLink,
  Building2,
  Cpu
} from 'lucide-react';

interface LegalComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  defaultTab?: 'DISCLAIMER' | 'PRIVACY_COOKIES' | 'ENGAGEMENT_RULES' | 'CNDP_GDPR';
}

export const LegalComplianceModal: React.FC<LegalComplianceModalProps> = ({
  isOpen,
  onClose,
  lang,
  defaultTab = 'DISCLAIMER'
}) => {
  const [activeTab, setActiveTab] = useState<'DISCLAIMER' | 'PRIVACY_COOKIES' | 'ENGAGEMENT_RULES' | 'CNDP_GDPR'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#070b16] border-2 border-slate-700/80 rounded-2xl shadow-[0_0_50px_rgba(15,23,42,0.8)] overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-cyan-400 shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white">
                  {lang === 'ar' 
                    ? 'الميثاق القانوني، إخلاء المسؤولية وسياسة الكوكيز والبيانات' 
                    : 'Legal Governance, Disclaimer & Cookie Telemetry Policy'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                  LEGAL DEPT
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {lang === 'ar' 
                  ? 'الأطر التشريعية، حدود المسؤولية التشغيلية، والامتثال لقوانين حماية المعطيات (CNDP 09-08 / GDPR)' 
                  : 'Operational liability boundaries, engagement rules, and personal data protection compliance.'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-600 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/90 px-4 gap-2 overflow-x-auto text-xs font-bold scrollbar-thin">
          {[
            { id: 'DISCLAIMER', labelAr: 'إخلاء المسؤولية القانونية', labelEn: 'Legal Disclaimer', icon: AlertTriangle },
            { id: 'PRIVACY_COOKIES', labelAr: 'سياسة الكوكيز والتليمترية', labelEn: 'Cookies & Telemetry Policy', icon: Cookie },
            { id: 'CNDP_GDPR', labelAr: 'حماية البيانات (القانون 09-08 و GDPR)', labelEn: 'Data Privacy (CNDP & GDPR)', icon: ShieldCheck },
            { id: 'ENGAGEMENT_RULES', labelAr: 'قواعد الاشتباك السيبراني المشروع', labelEn: 'Rules of Cyber Engagement', icon: Lock }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 bg-cyan-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 max-h-[calc(92vh-160px)] text-xs text-slate-300 leading-relaxed">

          {/* TAB 1: DISCLAIMER */}
          {activeTab === 'DISCLAIMER' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>{lang === 'ar' ? 'بيان إخلاء المسؤولية وحدود الضمان التشغيلي (SLA)' : 'Operational SLA & Limitation of Liability Notice'}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'تُقدّم هذه المنظومة السيادية للدفاع السيبراني الذاتي كحل تقني عالي الحصانة للمؤسسات والشركات. إن جميع عمليات الرصد، العزل التلقائي، وتطبيق قواعد الجدار الناري (eBPF/XDP) تتم بناءً على سياسات الدفاع المحددة وخوارزميات الكشف الإحصائي والرياضي.'
                    : 'This Autonomous Cyber Defense Platform is provided as an enterprise-grade hardened security solution. All detection, autonomous containment, and wire-speed packet filtering (eBPF/XDP) operate strictly under configured defensive parameters and mathematical algorithms.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">
                  {lang === 'ar' ? '1. حدود المسؤولية والظروف القاهرة (Force Majeure)' : '1. Limitation of Liability & Force Majeure'}
                </h4>
                <p>
                  {lang === 'ar'
                    ? 'لا تتحمل المنصة أو إدارتها أو المؤسس أي مسؤولية قانونية مباشرة أو غير مباشرة ناتجة عن انقطاعات شبكة الإنترنت العامة، الأعطال المادية على خوادم العميل الخارجية، أو التكوين الخاطئ لقواعد الاستبعاد التي يقوم بها مسؤولو النظام لدى الشركة العميلة.'
                    : 'Neither the platform, its executive management, nor the founder shall be held liable for indirect, incidental, or consequential damages resulting from global upstream Tier-1 transit failures, external on-premises hardware malfunctions, or misconfigurations committed by client-side administrators.'}
                </p>

                <h4 className="font-bold text-white text-sm pt-2">
                  {lang === 'ar' ? '2. الدفاع الذاتي المشروع وعدم التعدي الهجومي' : '2. Exclusively Defensive Mandate (No Offensive Cyberactions)'}
                </h4>
                <p>
                  {lang === 'ar'
                    ? 'المنظومة مصممة حصرياً للدفاع والتحييد الداخلي (Defensive Containment). يحظر استخدام المنظومة في أي أنشطة استطلاع هجومي أو اختراق مضاد ضد أطراف ثالثة دون إذن قضائي أو ترخيص سيادي رسمي.'
                    : 'The platform is engineered strictly for internal defensive mitigation and micro-segmentation. Utilization of the software for counter-offensive strikes or unauthorized external reconnaissance is strictly prohibited under sovereign international cyber treaties.'}
                </p>

                <h4 className="font-bold text-white text-sm pt-2">
                  {lang === 'ar' ? '3. دقة الخوارزميات والإنذارات الإيجابية الكاذبة (False Positives)' : '3. Algorithmic False Positive Thresholds'}
                </h4>
                <p>
                  {lang === 'ar'
                    ? 'تعتمد المنصة محركات رياضية دقيقة (Shannon Entropy & Mahalanobis Distance) لتقليص الإنذارات الخاطئة إلى ما دون 0.001%. ومع ذلك، يجب على فريق الـ SOC مراجعة سجلات التدقيق المشفرة بشكل دوري لضمان استمرارية سلاسة الأعمال التجارية.'
                    : 'The anomaly engine implements Shannon Entropy and Mahalanobis statistical metrics to suppress false-positive alarms to under 0.001%. However, enterprise SOC teams retain operational authority to audit logs and fine-tune threshold sensitivities.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PRIVACY & COOKIES */}
          {activeTab === 'PRIVACY_COOKIES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40 space-y-2">
                <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                  <Cookie className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'سياسة ملفات تعريف الارتباط الصفرية (Zero Third-Party Cookies Policy)' : 'Strict Zero-Advertising Cookie Architecture'}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'نحن نلتزم بأعلى معايير النزاهة الرقمية: لا نستخدم أي ملفات تعريف ارتباط تتبعية، ولا نضع أي كود إعلاني، ولا نشارك أي بيانات تصفح مع أي طرف ثالث تجاري على الإطلاق.'
                    : 'We adhere to absolute operational purity: No third-party tracking cookies, zero advertising beacons, and no behavioral profiling data is ever monetized or shared with commercial entities.'}
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-white text-sm">
                  {lang === 'ar' ? 'أنواع ملفات تعريف الارتباط والبيانات المخزنة محلياً:' : 'Categories of Locally Stored Data:'}
                </h4>
                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left rtl:text-right border-collapse text-[11px]">
                    <thead>
                      <tr className="bg-slate-900 text-slate-300 border-b border-slate-800">
                        <th className="p-2.5">{lang === 'ar' ? 'العنصر' : 'Key'}</th>
                        <th className="p-2.5">{lang === 'ar' ? 'النوع والمدة' : 'Type & Expiry'}</th>
                        <th className="p-2.5">{lang === 'ar' ? 'الغرض والوظيفة' : 'Purpose & Function'}</th>
                        <th className="p-2.5">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/70">
                      <tr>
                        <td className="p-2.5 font-bold text-cyan-300">acdc_cookie_consent</td>
                        <td className="p-2.5 text-slate-400">LocalStorage (1 Year)</td>
                        <td className="p-2.5">{lang === 'ar' ? 'حفظ قرار المستخدم بشأن موافقة التليمترية' : 'Stores user preference for operational cookies'}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">ESSENTIAL</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-cyan-300">acdc_sovereign_authorized</td>
                        <td className="p-2.5 text-slate-400">SessionStorage (Session)</td>
                        <td className="p-2.5">{lang === 'ar' ? 'رمز المصادقة الحية لجلسة قمرة القيادة' : 'Active cryptographic authentication token for SOC session'}</td>
                        <td className="p-2.5 text-emerald-400 font-bold">SECURITY</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-cyan-300">acdc_session_history</td>
                        <td className="p-2.5 text-slate-400">LocalStorage (90 Days)</td>
                        <td className="p-2.5">{lang === 'ar' ? 'أرشيف محلي مشفر للجلسات وتقارير التدخلات' : 'Local encrypted cache of incident mitigations'}</td>
                        <td className="p-2.5 text-cyan-400 font-bold">OPERATIONAL</td>
                      </tr>
                      <tr>
                        <td className="p-2.5 font-bold text-rose-300">Third-Party Tracking</td>
                        <td className="p-2.5 text-slate-500">None</td>
                        <td className="p-2.5 text-rose-400">{lang === 'ar' ? 'محظور تماماً بموجب المعمارية الصفرية' : 'Strictly Banned & Non-Existent'}</td>
                        <td className="p-2.5 text-rose-400 font-bold">BLOCKED</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CNDP LAW 09-08 & GDPR */}
          {activeTab === 'CNDP_GDPR' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-2">
                <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>
                    {lang === 'ar' 
                      ? 'الامتثال لقانون حماية المعطيات الشخصية المغربي 09-08 واللائحة الأوروبية GDPR' 
                      : 'Moroccan CNDP Law 09-08 & EU GDPR Sovereign Compliance'}
                  </span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'تتوافق منظومة الدفاع السيبراني مع مقتضيات الظهير الشريف رقم 1.09.15 الصادر بتنفيذ القانون رقم 09-08 المتعلق بحماية الأشخاص الذاتيين تجاه معالجة المعطيات ذات الطابع الشخصي في المملكة المغربية، وكذا المعايير الدولية الصارمة للائحة الأوروبية العامة لحماية البيانات (GDPR).'
                    : 'The platform strictly adheres to the Kingdom of Morocco’s Dahir No. 1-09-15 enacting Law No. 09-08 on the protection of individuals with regard to the processing of personal data (supervised by the CNDP), as well as the EU General Data Protection Regulation (GDPR).'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'إخفاء وتشفير الهويات (Data Pseudonymization)' : 'IP & Identity Pseudonymization'}</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    {lang === 'ar'
                      ? 'يتم تعمية وتشفير كافة عناوين IP وسجلات الحركة عبر دوال SHA3-512 قبل إدراجها في سجلات التدقيق لتفادي كشف أي هوية شخصية للمستخدمين العاديين.'
                      : 'Network telemetry and packet payloads undergo immediate irreversible SHA3-512 hashing to prevent deanonymization of non-malicious civilian users.'}
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'السيادة الوطنية على البيانات (Sovereign Data Residency)' : 'Sovereign Data Residency'}</span>
                  </span>
                  <p className="text-slate-400 text-[11px]">
                    {lang === 'ar'
                      ? 'لا تغادر أي بيانات شبكية أو سجلات تدقيق سرية الحدود السيادية للدولة أو البيئة السحابية الخاصة للشركة دون تشفير معتمد.'
                      : 'Sensitive internal enterprise telemetry never exits the client’s designated sovereign perimeter without end-to-end post-quantum cryptographic encapsulation.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: RULES OF ENGAGEMENT */}
          {activeTab === 'ENGAGEMENT_RULES' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/40 space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
                  <Lock className="w-4 h-4 text-purple-400" />
                  <span>{lang === 'ar' ? 'ميثاق الاشتباك السيبراني وقواعد الدفاع التلقائي' : 'Lawful Rules of Cyber Defense Engagement'}</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  {lang === 'ar'
                    ? 'تحدد هذه الوثيقة الشروط التي يباشر فيها محرك الدفاع الذاتي (Autonomous Engine) عزل وإسقاط الحزم المشبوهة عند رصد شذوذ يتجاوز عتبات ماهالانوبيس وإنتروبيا شانون المعتمدة.'
                    : 'Establishes the autonomous decision criteria under which the OODA engine executes wire-speed packet termination without requiring manual human intervention.'}
                </p>
              </div>

              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">1</span>
                  <p className="text-slate-300 text-xs">
                    {lang === 'ar'
                      ? 'يتم تنفيذ الحظر عند النواة (eBPF XDP DROP) حصرياً ضد الحزم التي تتطابق مع توقيعات هجومية مؤكدة أو تتجاوز مسافة ماهالانوبيس الحرجة D_M > 4.5.'
                      : 'XDP kernel drops trigger strictly when telemetry matches high-confidence signatures or statistical Mahalanobis distance D_M > 4.5.'}
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-800 text-cyan-400 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">2</span>
                  <p className="text-slate-300 text-xs">
                    {lang === 'ar'
                      ? 'جميع إجراءات التحييد تدون تلقائياً في شجرة ميركل المشفرة (Merkle Ledger) غير القابلة للتلاعب لتوفير أدلة جنائية رقمية صالحة للإثبات القضائي.'
                      : 'Every mitigation event is cryptographically anchored into an immutable Merkle tree ensuring forensic non-repudiation in court audits.'}
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>
              {lang === 'ar' 
                ? 'المؤسس: TAHA SETRII - المملكة المغربية | سيادة قانونية وتقنية تامة' 
                : 'Founder: TAHA SETRII - Kingdom of Morocco | Full Sovereign & Legal Compliance'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition-all cursor-pointer border border-slate-700"
          >
            {lang === 'ar' ? 'إغلاق الميثاق' : 'Close Document'}
          </button>
        </div>

      </div>
    </div>
  );
};
