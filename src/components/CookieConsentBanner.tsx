import React, { useState, useEffect } from 'react';
import { 
  Cookie, 
  ShieldCheck, 
  Lock, 
  Check, 
  X, 
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface CookieConsentBannerProps {
  lang: 'ar' | 'en';
  onOpenLegalModal: (tab: 'DISCLAIMER' | 'PRIVACY_COOKIES' | 'ENGAGEMENT_RULES' | 'CNDP_GDPR') => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  lang,
  onOpenLegalModal
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const consent = localStorage.getItem('acdc_cookie_consent');
    if (!consent) {
      // Small delay for smooth entry
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('acdc_cookie_consent', 'FULL_OPERATIONAL');
    setIsVisible(false);
  };

  const handleStrictZeroTrust = () => {
    localStorage.setItem('acdc_cookie_consent', 'STRICT_ZERO_TRUST');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-40 p-3 sm:p-4 bg-[#080d1a]/95 backdrop-blur-lg border-t-2 border-cyan-500/40 shadow-[0_-10px_30px_rgba(0,0,0,0.8)] font-mono text-xs animate-slideUp"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      id="cookie-consent-banner"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        
        {/* Notice Info */}
        <div className="flex items-start gap-3 text-slate-300 max-w-4xl">
          <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
            <Cookie className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-white text-sm">
                {lang === 'ar' 
                  ? 'ميثاق النزاهة الرقمية وملفات الارتباط التشغيلية (Zero Third-Party Tracking)' 
                  : 'Sovereign Telemetry & Zero-Tracking Cookie Architecture'}
              </span>
              <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[9px] font-bold">
                CNDP 09-08 & GDPR COMPLIANT
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lang === 'ar'
                ? 'تستخدم هذه المنظومة حصرياً ملفات تعريف ارتباط مشفرة محلياً (Session Tokens & Telemetry Cache) لتشغيل قمرة القيادة ومحرك الرصد الذاتي. لا نستخدم أي ملفات تتبع إعلانية أو تجارية إطلاقاً.'
                : 'This platform strictly uses local encrypted session tokens and telemetry cache to operate the SOC dashboard and autonomous mitigation engine. Zero commercial or advertising tracking cookies are utilized.'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2.5 flex-wrap shrink-0 w-full md:w-auto justify-end">
          <button
            onClick={() => onOpenLegalModal('PRIVACY_COOKIES')}
            className="text-slate-400 hover:text-cyan-300 text-[11px] underline underline-offset-4 px-2 py-1 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'سياسة الخصوصية والكوكيز' : 'Privacy & Cookie Terms'}
          </button>

          <button
            onClick={handleStrictZeroTrust}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 hover:border-slate-600 transition-all text-xs font-bold cursor-pointer"
          >
            {lang === 'ar' ? 'الوضع الصارم (Zero-Trust)' : 'Strict Zero-Trust'}
          </button>

          <button
            onClick={handleAcceptAll}
            className="px-4 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-all text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'ar' ? 'موافقة واعتماد التشفير' : 'Accept & Proceed'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
