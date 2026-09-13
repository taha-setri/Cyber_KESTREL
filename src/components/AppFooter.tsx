import React from 'react';
import { 
  ShieldCheck, 
  Scale, 
  Cookie, 
  FileText, 
  Lock, 
  Award, 
  Building2, 
  CheckCircle2, 
  ExternalLink,
  Cpu,
  Globe,
  GraduationCap
} from 'lucide-react';
import { KestrelLogo } from './KestrelLogo';

interface AppFooterProps {
  lang: 'ar' | 'en';
  onOpenLegalModal: (tab: 'DISCLAIMER' | 'PRIVACY_COOKIES' | 'ENGAGEMENT_RULES' | 'CNDP_GDPR') => void;
  onOpenWhitepaper: () => void;
  onNavigateToEnterpriseStandards: () => void;
  onOpenCyberAcademy?: () => void;
}

export const AppFooter: React.FC<AppFooterProps> = ({
  lang,
  onOpenLegalModal,
  onOpenWhitepaper,
  onNavigateToEnterpriseStandards,
  onOpenCyberAcademy
}) => {
  return (
    <footer 
      className="mt-16 border-t-2 border-slate-800/90 bg-[#050811] text-slate-400 font-mono text-xs"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      id="app-sovereign-footer"
    >
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 py-10 space-y-8">
        
        {/* Top Tier: Sovereign Identity & Quick Nav */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Col 1: Platform & Founder */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <KestrelLogo size="sm" withText={true} withSlogan={false} lang={lang} glow={true} />
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lang === 'ar'
                ? '« يقظةٌ ثابتة.. وانقضاضٌ لحظي في سرعة النبض » — المنظومة السيادية للرصد الرياضي متعدد المتغيرات والتحييد اللحظي عند النواة (eBPF/XDP).'
                : '“Steadfast Vigilance. Sub-Millisecond Strike.” — Sovereign command center for wire-speed kernel telemetry and autonomous mathematical mitigation.'}
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-0.5">
              <div className="text-slate-400 text-[10px] uppercase font-bold">
                {lang === 'ar' ? 'المؤسس والمعماري الرئيسي:' : 'Founder & Principal Architect:'}
              </div>
              <div className="text-white font-bold text-xs">
                TAHA SETRII 🇲🇦
              </div>
              <div className="text-cyan-400 text-[10px]">
                {lang === 'ar' ? 'المملكة المغربية (sécurité Maroc)' : 'Kingdom of Morocco (sécurité Maroc)'}
              </div>
            </div>
          </div>

          {/* Col 2: Legal & Governance Links */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'الحوكمة والميثاق القانوني' : 'Governance & Legal Mandate'}</span>
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={() => onOpenLegalModal('DISCLAIMER')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                  <span>{lang === 'ar' ? 'إخلاء المسؤولية والضمان التشغيلي' : 'Limitation of Liability & SLA'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('PRIVACY_COOKIES')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                  <span>{lang === 'ar' ? 'سياسة الكوكيز والتليمترية الصفرية' : 'Zero-Tracking Cookies Policy'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('CNDP_GDPR')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  <span>{lang === 'ar' ? 'حماية البيانات (القانون 09-08 و GDPR)' : 'Data Privacy (CNDP & GDPR)'}</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenLegalModal('ENGAGEMENT_RULES')}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400"></span>
                  <span>{lang === 'ar' ? 'قواعد الاشتباك السيبراني المشروع' : 'Lawful Rules of Engagement'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Enterprise Standards & Architecture */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'حماية الشركات ومؤسسات الأعمال' : 'Corporate Defense & Standards'}</span>
            </div>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button
                  onClick={onNavigateToEnterpriseStandards}
                  className="hover:text-cyan-300 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right font-bold text-emerald-400"
                >
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{lang === 'ar' ? 'معايير المنصة وكيف تحمي الشركات' : 'Enterprise Standards & Matrix'}</span>
                </button>
              </li>
              {onOpenCyberAcademy && (
                <li>
                  <button
                    onClick={onOpenCyberAcademy}
                    id="footer-cyber-academy-btn"
                    className="hover:text-cyan-200 transition-colors flex items-center gap-1.5 cursor-pointer text-left rtl:text-right font-bold text-cyan-300"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'أكاديمية طه الستري وموسوعة الـ 3,250 صفحة 📖🎓' : 'TAHA SETRII Academy & 3,250p Codex 📖🎓'}</span>
                  </button>
                </li>
              )}
              <li>
                <div className="text-slate-400 text-[10px] leading-relaxed pt-1">
                  {lang === 'ar'
                    ? 'جاهزة للاعتماد الفوري من قِبل لجان التدقيق ومسؤولي أمن المعلومات (CISOs) والبنوك والمؤسسات الحيوية.'
                    : 'Audit-ready for board members, CISOs, and national regulatory agencies.'}
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Sovereign Compliance Certs */}
          <div className="space-y-3">
            <div className="text-white font-bold text-xs flex items-center gap-1.5 uppercase tracking-wider">
              <Award className="w-4 h-4 text-purple-400" />
              <span>{lang === 'ar' ? 'شهادات الاعتماد والامتثال' : 'Compliance & Standard Seals'}</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px]">
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-cyan-300 font-bold block">ISO 27001</span>
                <span className="text-slate-400">ISMS Certified</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-emerald-300 font-bold block">SOC 2 Type II</span>
                <span className="text-slate-400">Trust Compliant</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-purple-300 font-bold block">NIST FIPS 203</span>
                <span className="text-slate-400">ML-KEM Kyber</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-center">
                <span className="text-amber-300 font-bold block">CNDP 09-08</span>
                <span className="text-slate-400">Sovereign Privacy</span>
              </div>
            </div>
          </div>

        </div>

        {/* Disclaimer Warning Box */}
        <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 text-[11px] leading-relaxed text-slate-400 space-y-1">
          <div className="flex items-center gap-2 text-slate-300 font-bold text-xs">
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'ar' ? 'تنبيه إخلاء المسؤولية القانونية والتشغيلية (Legal & Operational Disclaimer):' : 'Legal & Operational Disclaimer Notice:'}</span>
          </div>
          <p>
            {lang === 'ar'
              ? 'هذه المنظومة مصممة لتقديم دفاع سيبراني تلقائي وحماية استباقية عند مستوى النواة (eBPF/XDP) بناءً على قواعد التحليل الإحصائي والإنتروبيا. لا تتحمل إدارة المنصة أو المؤسس أي مسؤولية عن أضرار ناتجة عن انقطاع مزودي الاتصالات العالميين، أو الاستخدام الخاطئ للصلاحيات من قِبل مسؤولي الشركات العميلة. تخضع كافة آليات الدفاع للتشريعات الوطنية والدولية ذات الصلة، وهي مخصصة للأغراض الدفاعية حصراً.'
              : 'This platform provides autonomous cyber defense and proactive kernel-layer mitigation (eBPF/XDP) based on stochastic statistical analysis and entropy metrics. The platform management and founder assume no liability for damages arising from upstream telecommunication disruptions or administrative misconfigurations executed by client personnel. All defensive actions adhere strictly to sovereign and international laws and are dedicated solely to defensive protection.'}
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} KESTREL Autonomous Cyber Defense (KESTREL-ACDC).</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-slate-300">
              {lang === 'ar' ? 'حقوق التطوير والملكية الفكرية محفوظة: طه ستري (TAHA SETRII)' : 'All Sovereign Intellectual Rights Reserved: TAHA SETRII'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => onOpenLegalModal('PRIVACY_COOKIES')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'ملفات الارتباط (Cookies)' : 'Cookie Policy'}
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenLegalModal('DISCLAIMER')}
              className="hover:text-cyan-300 transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'إخلاء المسؤولية' : 'Disclaimer'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
