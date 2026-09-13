import React, { useState, useEffect } from 'react';
import { 
  Tv, Play, Pause, RotateCcw, Volume2, VolumeX, Shield, 
  Cpu, Lock, Sparkles, UserCheck, CheckCircle2, ChevronRight,
  Eye, Radio, Building2
} from 'lucide-react';

interface FounderBroadcastScreenProps {
  lang: 'ar' | 'en';
}

interface BroadcastSlide {
  id: number;
  badgeAr: string;
  badgeEn: string;
  titleAr: string;
  titleEn: string;
  speakerAr: string;
  speakerEn: string;
  quoteAr: string;
  quoteEn: string;
  pointsAr: string[];
  pointsEn: string[];
  visualIcon: string;
  color: string;
}

export const FounderBroadcastScreen: React.FC<FounderBroadcastScreenProps> = ({ lang }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [scanlineEffect, setScanlineEffect] = useState<boolean>(true);

  const slides: BroadcastSlide[] = [
    {
      id: 1,
      badgeAr: 'رؤية المؤسس • TAHA SETRII',
      badgeEn: 'Founder Vision • TAHA SETRII',
      titleAr: 'لماذا أنشأنا منظومة الدفاع السيبراني السيادية ؟',
      titleEn: 'Why We Built the Sovereign Cyber Defense Mesh',
      speakerAr: 'طه الستري (TAHA SETRII) — المؤسس ورئيس المعمارية السيادية',
      speakerEn: 'TAHA SETRII — Founder & Chief Sovereign Architect',
      quoteAr: '«السيادة الرقمية ليست رفاهية، بل هي خط الدفاع الأول للأمن القومي وللمؤسسات الحيوية. لا يمكن أن نعتمد على حلول أجنبية قد تخضع لعقوبات أو تسريب؛ بنينا منظومة مغربية مستقلة تحسم الهجمات في النواة في أقل من 300 جزء من الثانية.»',
      quoteEn: '“Digital sovereignty is not an option; it is the cornerstone of national security and critical corporate resilience. We built an independent sovereign architecture neutralizing nation-state attacks inside the kernel in sub-300ms.”',
      pointsAr: [
        'عزل بيانات المؤسسات بنسبة 100% داخل حدود السيادة الوطنية.',
        'تشفير ما بعد الكم (PQC) لحماية الشركات والبنوك من فك التشفير المستقبلي.',
        'تحييد تلقائي للتهديدات دون الاعتماد على خوادم سحابية أجنبية.'
      ],
      pointsEn: [
        '100% Data residency strictly confined to national borders.',
        'Post-quantum cryptography (ML-KEM/FIPS 203) shielding financial assets.',
        'Deterministic hardware-speed mitigation without foreign dependency.'
      ],
      visualIcon: '🇲🇦',
      color: '#10b981'
    },
    {
      id: 2,
      badgeAr: 'رأي الخبير السيبراني • Cyber Expert Analysis',
      badgeEn: 'Cyber Defense Expert Perspective',
      titleAr: 'كيف تحمي المنظومة بيانات الشركات والبنوك عملياً ؟',
      titleEn: 'How the Mesh Concretely Protects Corporate Data',
      speakerAr: 'مستشار الأمن السيبراني والتحليل الجنائي المتقدم',
      speakerEn: 'Principal Cybersecurity & Advanced Forensics Advisor',
      quoteAr: '«الشركات اليوم تتعرض لبرمجيات الفدية وهجمات يوم الصفر (Zero-Day). المنظومة هنا لا تعتمد على تواقيع قديمة، بل تقيس الفوضى الرياضية (Shannon Entropy) وتوقف تسريب البيانات في كابل الشبكة فوراً قبل وصولها لقاعدة البيانات.»',
      quoteEn: '“Modern enterprises face stealthy ransomware and zero-day memory exploits. This mesh uses Shannon entropy and multivariate Mahalanobis mathematics to halt data exfiltration at wire-speed before databases are touched.”',
      pointsAr: [
        'اعتراض حزم التجسس عبر eBPF/XDP بسرعة السلك (Wire-speed).',
        'عزل الخوادم المصابة خلال 0.2 ثانية (Micro-segmentation).',
        'توثيق غير قابل للتزوير عبر شجرة ميركل المشفرة (Immutable Ledger).'
      ],
      pointsEn: [
        'Wire-speed eBPF packet dropping discarding malicious payloads.',
        'Zero-trust micro-segmentation isolating infected hosts in <0.2s.',
        'Immutable forensic Merkle chain ensuring regulatory auditability.'
      ],
      visualIcon: '🛡️',
      color: '#06b6d4'
    },
    {
      id: 3,
      badgeAr: 'الحصانة المؤسسية • Corporate Immunity',
      badgeEn: 'Enterprise Data Isolation & Trust',
      titleAr: 'ماذا يربح المشترك والعميل عند تشغيل المنظومة ؟',
      titleEn: 'What Corporate Subscribers Gain Instantly',
      speakerAr: 'ضمانات مستوى الخدمة والامتثال القانوني CNDP / DGSSI',
      speakerEn: 'Sovereign SLA & DGSSI / NIST Compliance Assurance',
      quoteAr: '«يحصل كل مشترك على بيئة عمل معزولة بالكامل، ومفتاح API مخصص، وضمان عدم توقف العمليات بنسبة 99.999%، مع امتثال كامل لقوانين حماية المعطيات الشخصية المغربية والدولية.»',
      quoteEn: '“Every subscriber receives a strictly isolated tenant environment, dedicated API credentials, 99.999% uptime guarantee, and full alignment with national data sovereignty mandates.”',
      pointsAr: [
        'بيئة عمل معزولة تماماً لكل شركة (Zero Cross-Tenant Leakage).',
        'لوحة قيادة فورية لمراقبة الخوادم وحظر الهجمات لحظياً.',
        'خط تواصل ودعم مباشر على مدار الساعة لحالات الطوارئ.'
      ],
      pointsEn: [
        'Completely isolated tenant workspace with customized security controls.',
        'Real-time situational awareness monitoring dedicated corporate nodes.',
        'Direct 24/7 sovereign rapid-response desk for critical escalations.'
      ],
      visualIcon: '⚡',
      color: '#a855f7'
    }
  ];

  // Auto-play timer for TV slides
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % slides.length);
    }, 7500);
    return () => clearInterval(timer);
  }, [isPlaying, slides.length]);

  const currentSlide = slides[currentSlideIndex];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      {/* Retro-Futuristic TV Chassis / Bezel */}
      <div className="bg-[#0b101c] border-2 border-slate-700/80 rounded-2xl p-3.5 sm:p-5 shadow-[0_0_40px_rgba(0,0,0,0.8)] relative overflow-hidden ring-1 ring-emerald-500/30">
        
        {/* Top TV Bar: Antenna, Channel Label, Live Indicator */}
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-400">
              <Tv className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <span className="font-bold text-white flex items-center gap-1.5">
                <span>{lang === 'ar' ? 'شاشة البث السيادي' : 'Sovereign Broadcast TV'}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-950 text-red-300 border border-red-500/50 animate-pulse font-bold">
                  ● LIVE BROADCAST
                </span>
              </span>
              <div className="text-[10px] text-slate-400 font-mono">
                {lang === 'ar' ? 'رؤية المؤسس وخبرات حماية بيانات الشركات' : 'Founder Vision & Enterprise Defense Briefing'}
              </div>
            </div>
          </div>

          {/* TV Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer transition-all"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5 text-amber-400" /> : <Play className="w-3.5 h-3.5 text-emerald-400" />}
            </button>
            <button
              onClick={() => setCurrentSlideIndex(prev => (prev + 1) % slides.length)}
              className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-cyan-300 text-[11px] font-mono cursor-pointer transition-all flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'القناة التالية' : 'Next'}</span>
              <ChevronRight className={`w-3 h-3 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* TV Screen Glass (CRT Scanline & Glow Effect) */}
        <div className="relative bg-[#02050b] border-2 border-emerald-500/40 rounded-xl p-4 sm:p-6 shadow-inner overflow-hidden min-h-[260px] flex flex-col justify-between">
          
          {/* CRT Scanline Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[size:100%_4px] pointer-events-none z-10 opacity-60"></div>
          
          {/* Ambient Glow */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[90px] pointer-events-none opacity-20"
            style={{ backgroundColor: currentSlide.color }}
          ></div>

          {/* Screen Content */}
          <div className="relative z-20 space-y-3">
            {/* Header Badge & Channel Tag */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span 
                className="px-2.5 py-0.5 rounded-md text-xs font-mono font-bold border flex items-center gap-1.5 shadow-sm"
                style={{
                  backgroundColor: `${currentSlide.color}15`,
                  borderColor: `${currentSlide.color}60`,
                  color: currentSlide.color
                }}
              >
                <span>{currentSlide.visualIcon}</span>
                <span>{lang === 'ar' ? currentSlide.badgeAr : currentSlide.badgeEn}</span>
              </span>

              <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                CH 0{currentSlide.id} / 03 • 1080p Wire-Speed
              </span>
            </div>

            {/* Slide Title */}
            <h3 className="text-base sm:text-lg font-black text-white font-mono leading-snug">
              {lang === 'ar' ? currentSlide.titleAr : currentSlide.titleEn}
            </h3>

            {/* Speaker Name */}
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-300">
              <UserCheck className="w-4 h-4 text-cyan-400 shrink-0" />
              <span className="font-bold">{lang === 'ar' ? currentSlide.speakerAr : currentSlide.speakerEn}</span>
            </div>

            {/* Quote Box */}
            <div className="bg-[#070e1b]/90 border-r-2 sm:border-r-4 border-emerald-400 p-3 sm:p-3.5 rounded-lg text-xs sm:text-sm font-mono text-slate-200 leading-relaxed italic">
              {lang === 'ar' ? currentSlide.quoteAr : currentSlide.quoteEn}
            </div>

            {/* Key Protective Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
              {(lang === 'ar' ? currentSlide.pointsAr : currentSlide.pointsEn).map((pt, i) => (
                <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-lg p-2 text-[11px] font-mono text-slate-300 flex items-start gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{pt}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TV Bottom Footer: Channel Indicators & Ticker */}
          <div className="relative z-20 flex items-center justify-between pt-4 mt-3 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'ar' ? 'البث المشفر السيادي (Sécurité Maroc)' : 'Sovereign Encrypted Signal'}</span>
            </div>

            {/* Channel Indicator Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentSlideIndex(idx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlideIndex === idx 
                      ? 'bg-emerald-400 ring-2 ring-emerald-400/40 w-5' 
                      : 'bg-slate-700 hover:bg-slate-500'
                  }`}
                  title={`Channel ${s.id}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* TV Base Stand Feet */}
        <div className="flex justify-between px-8 -mb-2 mt-1">
          <div className="w-8 h-2 bg-slate-800 rounded-b"></div>
          <div className="w-8 h-2 bg-slate-800 rounded-b"></div>
        </div>
      </div>
    </div>
  );
};
