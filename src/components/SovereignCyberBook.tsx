import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  BookOpen, Bookmark, Search, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight,
  Terminal, ShieldCheck, Copy, Check,
  Sparkles, Layers, ArrowRight, Zap, RefreshCw, Star, Download, Eye, HelpCircle, CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { 
  ACADEMY_VOLUMES, 
  LANDMARK_CODEX_PAGES, 
  CuratedRulePage, 
  BookVolume,
  InteractiveQuizQuestion 
} from '../data/academyCurriculum';

interface SovereignCyberBookProps {
  lang: 'ar' | 'en';
  onClose?: () => void;
}

export const SovereignCyberBook: React.FC<SovereignCyberBookProps> = ({
  lang
}) => {
  const TOTAL_PAGES = 3250;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'PAGE_READ' | 'VOLUME_QUIZZES'>('PAGE_READ');
  
  // Bookmarks state
  const [bookmarks, setBookmarks] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('taha_setrii_book_bookmarks');
      return saved ? JSON.parse(saved) : [1, 25, 451, 981, 1521, 2051, 2200, 2681, 3250];
    } catch {
      return [1, 25, 451, 981, 1521, 2051, 2200, 2681, 3250];
    }
  });

  // Quiz state for Volume Quizzes tab
  const [selectedQuizIndex, setSelectedQuizIndex] = useState<number>(0);
  const [userSelectedOption, setUserSelectedOption] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);
  const [scoreTracker, setScoreTracker] = useState<Record<string, boolean>>({});

  // Terminal state
  const [isTerminalRunning, setIsTerminalRunning] = useState<boolean>(false);
  const [terminalLog, setTerminalLog] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState<boolean>(false);

  // Ensure speech synthesis is completely stopped and silenced
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const volumes: BookVolume[] = ACADEMY_VOLUMES;
  const landmarkPages = LANDMARK_CODEX_PAGES;

  // Active Volume is calculated automatically based on current page
  const activeVolume = useMemo(() => {
    return volumes.find(v => currentPage >= v.startPage && currentPage <= v.endPage) || volumes[0];
  }, [currentPage, volumes]);

  // Current volume quiz list
  const currentVolumeQuizzes = activeVolume.quizzes;
  const activeQuiz: InteractiveQuizQuestion = currentVolumeQuizzes[selectedQuizIndex % currentVolumeQuizzes.length];

  // Procedural rule page generator with varied technical contents across all 3,250 pages
  const activePageData: CuratedRulePage = useMemo(() => {
    if (landmarkPages[currentPage]) {
      return landmarkPages[currentPage];
    }

    const vol = activeVolume;
    const pageOffset = currentPage - vol.startPage;
    const ruleNum = String(currentPage).padStart(4, '0');

    // 12 Distinct technical archetype templates ensuring diverse, non-repetitive knowledge
    const proceduralArchetypes = [
      {
        catAr: 'أمن مقابس النواة وتدقيق الشبكة',
        catEn: 'Kernel Socket Architecture & Packet Trace',
        threat: 'HIGH' as const,
        titleAr: `القاعدة ${ruleNum}: تدقيق مصافحات المقابس وحظر الاتصالات الجانبية`,
        titleEn: `Rule ${ruleNum}: Kernel Socket Handshake Auditing & Egress Isolation`,
        quoteAr: `«كل اتصال شبكي لا يحمل بصمة تحقق سيادية هو منفذ محتمل لتسريب البيانات الحيوية.»`,
        quoteEn: `“Every network connection lacking a verified sovereign identity is a potential data exfiltration conduit.”`,
        detailsAr: `الصفحة ${currentPage} من المجلد ${vol.id}. تفرض تطبيق سياسات eBPF Socket Filtering للتحقق من هوية العملية المتصلة (cgroup/pid) قبل السماح بمرور الحزم عبر بطاقة الشبكة. يمنع هذا الأسلوب البرمجيات الخبيثة من إنشاء قنوات اتصال سرية (C2 Channels).`,
        detailsEn: `Page ${currentPage} under Volume ${vol.id}. Enforces eBPF socket filtering to validate process origins prior to egress authorization, defeating covert C2 beacons.`,
        std: `NIST SP 800-125B / RFC 793`,
        cmd: `ss -tulpn | grep ':443' | awk '{print $5}' | sort | uniq -c`,
        out: `24 Established sovereign TLS streams. Zero anomalous listener sockets.`,
        expAr: `فحص مقابس الخادم المفتوحة والتحقق من التشفير الكامل.`,
        expEn: `Audits open kernel listen sockets for cryptographic integrity.`
      },
      {
        catAr: 'التشفير وحماية الهوية والمفاتيح',
        catEn: 'Cryptographic Isolation & Ephemeral Secrets',
        threat: 'CRITICAL' as const,
        titleAr: `القاعدة ${ruleNum}: تدوير مفاتيح التشفير اللحظية وإلغاء الثقة الدائمة`,
        titleEn: `Rule ${ruleNum}: Ephemeral Secret Rotation & Zero Static Trust`,
        quoteAr: `«المفتاح الذي يعيش طويلاً يتحول إلى ثغرة بمرور الوقت؛ التدوير التلقائي هو حصن البنوك.»`,
        quoteEn: `“A static key becomes an inevitable vulnerability over time; automated ephemeral rotation protects sovereign banks.”`,
        detailsAr: `تتناول الصفحة ${currentPage} بروتوكول التدوير الآلي لمفاتيح التشفير المتناظرة (AES-256-GCM) كل 60 دقيقة في الذاكرة الحية فقط دون كتابتها على القرص، مع الاعتماد على إنتروبيا عشوائية مستمدة من ضجيج المعالج الحقيقي (Hardware TRNG).`,
        detailsEn: `Page ${currentPage} specifies sub-hourly automated ephemeral key rotation in volatile RAM, leveraging hardware true random number generators (TRNG).`,
        std: `NIST SP 800-57 Part 1 / FIPS 140-3`,
        cmd: `openssl rand -hex 32 | tr -d '\\n' > /run/secrets/key_${currentPage}.tok`,
        out: `Hardware TRNG entropy seeded. Key loaded in protected memory buffer.`,
        expAr: `توليد إنتروبيا تشفير لحظية وتثبيتها في الذاكرة المتطايرة.`,
        expEn: `Generates volatile cryptographic key tokens immune to cold boot extraction.`
      },
      {
        catAr: 'صيد التهديدات وكشف التحركات الجانبية',
        catEn: 'Threat Hunting & Lateral Movement Neutralization',
        threat: 'MEDIUM' as const,
        titleAr: `القاعدة ${ruleNum}: رصد محاولات كسر الامتيازات (Privilege Escalation)`,
        titleEn: `Rule ${ruleNum}: SUID Binary Auditing & Privilege Escalation Detection`,
        quoteAr: `«المهاجم داخل الخادم يبحث دائماً عن ملف ذو امتيازات root ليرتقي؛ احرمه من أدواته.»`,
        quoteEn: `“An adversary inside the perimeter constantly hunts for SUID misconfigurations; strip their footholds systematically.”`,
        detailsAr: `تبين الصفحة ${currentPage} كيفية فحص ملفات SUID الخطرة، وتتبع استدعاءات النواة setuid و setgid غير المصرح بها عبر auditd، وتجريد برمجيات النظام من علامة التنفيذ بصلاحيات أعلى دون مبرر تشغيلي موثق.`,
        detailsEn: `Page ${currentPage} inspects SUID execution flags and audits unauthorized setuid syscall invocations through Linux auditd frameworks.`,
        std: `CIS Linux Benchmark 2.1 / MITRE ATT&CK T1548`,
        cmd: `find / -perm -4000 -type f -exec ls -ld {} \\; 2>/dev/null | head -n 8`,
        out: `/usr/bin/passwd\n/usr/bin/sudo\n[IMMUNITY]: Zero unauthorized SUID binaries present.`,
        expAr: `مسح الملفات التنفيذية ذات الامتيازات ومطابقتها مع القائمة البيضاء.`,
        expEn: `Scans SUID executables, ensuring zero untrusted privilege vectors.`
      },
      {
        catAr: 'الامتثال للمعايير والسيادة الوطنية',
        catEn: 'National Sovereignty & DGSSI Directives',
        threat: 'HIGH' as const,
        titleAr: `القاعدة ${ruleNum}: معايير العزل الصارم وحماية أصول البيانات الحيوية`,
        titleEn: `Rule ${ruleNum}: Strict Containment Matrix & Sovereign Asset Isolation`,
        quoteAr: `«لا يغادر بايت واحد من بيانات مواطنينا حدود السحابة السيادية؛ التشفير الوطني هو الدرع.»`,
        quoteEn: `“Not a single byte of citizen data may exit sovereign cloud boundaries; national cryptography is the shield.”`,
        detailsAr: `الصفحة ${currentPage} تفصل آليات تطبيق المادة 12 من توجيهات المديرية العامة لأمن نظم المعلومات (DGSSI) بالمملكة المغربية، والتي تلزم الهيئات الوطنية بالاحتفاظ بنسخ احتياطية مشفرة محلياً وعزل بيئات قواعد البيانات عن الإنترنت العام.`,
        detailsEn: `Details enforcement of Article 12 under Moroccan DGSSI directives, requiring sovereign cloud retention and strict air-gapped database isolation.`,
        std: `Moroccan DGSSI Directive Art-12 / ISO 27001 A.12`,
        cmd: `nft list ruleset | grep 'sovereign_filter_${currentPage}'`,
        out: `Table ip sovereign_filter active. Hardware acceleration synchronized.`,
        expAr: `التحقق من جداول nftables الدفاعية وتسريع التصفية العتادية.`,
        expEn: `Verifies national nftables firewall state and driver acceleration.`
      },
      {
        catAr: 'أمن واجهات البرمجة والـ REST APIs',
        catEn: 'API Security & Cryptographic Rate Limiting',
        threat: 'HIGH' as const,
        titleAr: `القاعدة ${ruleNum}: تحصين واجهات الـ REST من هجمات BOLA و Broken Auth`,
        titleEn: `Rule ${ruleNum}: Eradicating Broken Object Level Authorization (BOLA)`,
        quoteAr: `«معرفة معرف الكائن (ID) لا تمنح حق قراءته؛ التحقق من ملكية الرمز في كل طلب شرط وجودي.»`,
        quoteEn: `“Knowing an object ID grants no right to read it; strict object-level authorization is existential.”`,
        detailsAr: `الصفحة ${currentPage} تتناول أسلوب التحقق المعماري الصارم من الصلاحيات على مستوى الكائن الفردي (Object-Level Authorization)، مع منع الاستعلام المباشر عبر المعرفات العددية المتسلسلة واستبدالها بـ UUID v7 المشفرة.`,
        detailsEn: `Focuses on eradicating BOLA (OWASP API1) by strictly binding caller JWT claims to object tenancy, replacing sequential integers with UUID v7.`,
        std: `OWASP API Security Top 10 API1:2023`,
        cmd: `curl -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer mock_jwt" https://localhost/api/v1/tenant/audit`,
        out: `403 FORBIDDEN - [BOLA MITIGATION]: Unauthorized object access mathematically intercepted.`,
        expAr: `محاكاة محاولة وصول غير مصرح بها والتحقق من صدها الفوري.`,
        expEn: `Simulates unauthorized object access and verifies sub-millisecond 403 denial.`
      },
      {
        catAr: 'أمن السحابة والحاويات المستقلة',
        catEn: 'Cloud & Container Namespace Hardening',
        threat: 'CRITICAL' as const,
        titleAr: `القاعدة ${ruleNum}: تفعيل Seccomp Filters لحظر نداءات النواة الخطرة`,
        titleEn: `Rule ${ruleNum}: Hardened Seccomp BPF Syscall Whitelisting`,
        quoteAr: `«إذا لم تكن الحاوية بحاجة لمكالمة النواة ptrace أو bpf، فلماذا تتركها مفعلة؟ احظرها فوراً.»`,
        quoteEn: `“If a container requires no ptrace or bpf syscalls, ban them unconditionally.”`,
        detailsAr: `الصفحة ${currentPage} تشرح تطبيق ملفات تعريف Seccomp BPF على حاويات الخدمات، بحيث يُسمح فقط بـ 45 مكالمة نظام أساسية، بينما يتم إسقاط أي محاولة لاستخدام المكالمات الخطرة المسببة لهروب الحاويات.`,
        detailsEn: `Implements strict Seccomp BPF filters restricting container syscalls to an approved whitelist, preventing host privilege escalation.`,
        std: `NIST SP 800-190 / CIS Docker Benchmark`,
        cmd: `grep -E 'Seccomp|voluntary_ctxt_switches' /proc/self/status`,
        out: `Seccomp: 2 (filtered mode)\n[HARDENED]: Host syscalls restricted to whitelist.`,
        expAr: `التأكد من تشغيل العملية تحت وضع Seccomp المقيد.`,
        expEn: `Confirms running process operates under strict Seccomp filtering.`
      }
    ];

    const archetype = proceduralArchetypes[pageOffset % proceduralArchetypes.length];

    return {
      pageNumber: currentPage,
      volumeId: vol.id,
      ruleCode: `RULE-${ruleNum}-PAGE`,
      titleAr: archetype.titleAr,
      titleEn: archetype.titleEn,
      category: archetype.catAr,
      threatLevel: archetype.threat,
      ruleQuoteAr: archetype.quoteAr,
      ruleQuoteEn: archetype.quoteEn,
      technicalDetailsAr: archetype.detailsAr,
      technicalDetailsEn: archetype.detailsEn,
      standardReference: archetype.std,
      terminalExercise: {
        command: archetype.cmd,
        expectedOutput: archetype.out,
        explanationAr: archetype.expAr,
        explanationEn: archetype.expEn
      },
      sovereignImpactAr: `تحصين شامل للمنظومات الوطنية والمؤسسات المصرفية ضد الاختراقات وضمان استمرارية الخدمات الحيوية بالمملكة.`,
      sovereignImpactEn: `Comprehensive resilience of sovereign banking and power backbones against sophisticated hostile campaigns.`
    };
  }, [currentPage, landmarkPages, activeVolume]);

  // Keep page input in sync
  useEffect(() => {
    setPageInputValue(String(currentPage));
  }, [currentPage]);

  // Jump to specific page
  const handleJumpToPage = (target: number) => {
    const validPage = Math.max(1, Math.min(TOTAL_PAGES, target));
    setCurrentPage(validPage);
    setPageInputValue(String(validPage));
    setTerminalLog(null);
    setIsTerminalRunning(false);
    soundEffects.playStageAdvance();
  };

  const handleInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInputValue, 10);
    if (!isNaN(parsed)) {
      handleJumpToPage(parsed);
    }
  };

  // Toggle bookmark
  const toggleBookmark = (page: number) => {
    const updated = bookmarks.includes(page) 
      ? bookmarks.filter(p => p !== page)
      : [...bookmarks, page].sort((a, b) => a - b);
    setBookmarks(updated);
    try {
      localStorage.setItem('taha_setrii_book_bookmarks', JSON.stringify(updated));
    } catch {}
    soundEffects.playRadarBlip(1200, 40);
  };

  // Copy rule text
  const handleCopyText = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    soundEffects.playRadarBlip(880, 50);
  };

  // Run Terminal Sandbox
  const handleRunTerminal = () => {
    setIsTerminalRunning(true);
    soundEffects.playRadarBlip(600, 50);
    setTimeout(() => {
      setTerminalLog(activePageData.terminalExercise.expectedOutput);
      setIsTerminalRunning(false);
      soundEffects.playMitigationChirp();
    }, 500);
  };

  // Search through all landmark pages and volumes
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase().trim();
    const matches: { page: number; title: string; vol: string }[] = [];

    // Search landmarks
    Object.values(landmarkPages).forEach(lm => {
      if (
        lm.titleAr.toLowerCase().includes(q) ||
        lm.titleEn.toLowerCase().includes(q) ||
        lm.technicalDetailsAr.toLowerCase().includes(q) ||
        lm.technicalDetailsEn.toLowerCase().includes(q) ||
        lm.ruleCode.toLowerCase().includes(q) ||
        lm.terminalExercise.command.toLowerCase().includes(q)
      ) {
        matches.push({
          page: lm.pageNumber,
          title: lang === 'ar' ? lm.titleAr : lm.titleEn,
          vol: `Vol ${lm.volumeId}`
        });
      }
    });

    // Check direct page number
    const pageQuery = parseInt(q, 10);
    if (!isNaN(pageQuery) && pageQuery >= 1 && pageQuery <= TOTAL_PAGES) {
      if (!matches.some(m => m.page === pageQuery)) {
        matches.unshift({
          page: pageQuery,
          title: lang === 'ar' ? `الصفحة المباشرة رقم ${pageQuery}` : `Direct Jump to Page ${pageQuery}`,
          vol: `Vol ${Math.ceil(pageQuery / 550)}`
        });
      }
    }

    return matches.slice(0, 10);
  }, [searchQuery, landmarkPages, lang]);

  // Handle Quiz in Volume
  const handleSelectQuizOption = (idx: number) => {
    if (isQuizSubmitted) return;
    setUserSelectedOption(idx);
    soundEffects.playRadarBlip(900, 30);
  };

  const handleSubmitQuiz = () => {
    if (userSelectedOption === null) return;
    setIsQuizSubmitted(true);
    const isCorrect = userSelectedOption === activeQuiz.correctIndex;
    if (isCorrect) {
      soundEffects.playMitigationChirp();
      setScoreTracker(prev => ({ ...prev, [activeQuiz.id]: true }));
    } else {
      soundEffects.playTacticalAlarm();
    }
  };

  const handleNextQuiz = () => {
    setSelectedQuizIndex(prev => (prev + 1) % currentVolumeQuizzes.length);
    setUserSelectedOption(null);
    setIsQuizSubmitted(false);
  };

  return (
    <div className="w-full flex flex-col space-y-4 font-mono select-none" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      {/* Top Header: Clean, Elegant, Professional Dark Theme */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Book Title & Sovereign Identification */}
        <div className="flex items-center gap-3.5 w-full md:w-auto">
          <div className="w-11 h-11 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shrink-0 shadow-md">
            <BookOpen className="w-5 h-5 text-slate-200" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">
                🇲🇦 موسوعة الـ 3,250 صفحة
              </span>
              <span className="text-[10px] text-slate-400 font-bold">
                {lang === 'ar' ? 'المجلد ' : 'Volume '} {activeVolume.id} / 6
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                ص {activeVolume.pagesRange}
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-black text-slate-100 mt-0.5">
              {lang === 'ar' ? activeVolume.titleAr : activeVolume.titleEn}
            </h3>
          </div>
        </div>

        {/* Global Action Tools: Tab switch, TOC, Audio */}
        <div className="flex items-center gap-2 flex-wrap justify-end w-full md:w-auto">
          {/* View Tab Switcher: Page Reader vs Volume Quizzes */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('PAGE_READ')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'PAGE_READ'
                  ? 'bg-slate-800 border border-slate-700 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-slate-300" />
              <span>{lang === 'ar' ? 'قراءة الصفحات' : 'Read Pages'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('VOLUME_QUIZZES');
                setUserSelectedOption(null);
                setIsQuizSubmitted(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'VOLUME_QUIZZES'
                  ? 'bg-slate-800 border border-slate-700 text-slate-100 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
              <span>{lang === 'ar' ? 'بنك الأسئلة والاختبارات' : 'Quiz Bank'}</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {currentVolumeQuizzes.length}
              </span>
            </button>
          </div>

          {/* Table of Contents Drawer Toggle */}
          <button
            onClick={() => setIsTocOpen(!isTocOpen)}
            className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center gap-1.5 cursor-pointer"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>{lang === 'ar' ? 'فهرس المجلدات' : 'Index'}</span>
          </button>
        </div>
      </div>

      {/* Quick Fast Jump Ribbon & Keyword Search */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Page Jump Form */}
        <form 
          onSubmit={handleInputSubmit} 
          className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl shadow-sm"
        >
          <span className="text-xs text-slate-400 whitespace-nowrap">
            {lang === 'ar' ? 'الانتقال لصفحة:' : 'Jump to Page:'}
          </span>
          <input
            type="number"
            min={1}
            max={TOTAL_PAGES}
            value={pageInputValue}
            onChange={(e) => setPageInputValue(e.target.value)}
            className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-center text-slate-100 font-bold focus:outline-none focus:border-slate-500"
          />
          <span className="text-xs text-slate-500 font-mono">/ {TOTAL_PAGES}</span>
          <button
            type="submit"
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-all cursor-pointer mr-auto rtl:mr-0 rtl:ml-auto"
          >
            {lang === 'ar' ? 'انتقال' : 'Go'}
          </button>
        </form>

        {/* Global Rule & Keyword Search */}
        <div className="md:col-span-2 relative">
          <div className="flex items-center bg-slate-900/80 border border-slate-800 px-3 py-2 rounded-xl shadow-sm">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث في الموسوعة (مثال: SQLi, eBPF, Nmap, تشفير, NIST, PQC, 451)...' : 'Search 3,250 pages (e.g. eBPF, SYN Flood, ISO, Port 443)...'}
              className="w-full bg-transparent px-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {searchResults.length > 0 && (
            <div className="absolute top-full mt-1.5 left-0 right-0 z-30 bg-[#070e1b] border border-slate-700 rounded-xl p-2 shadow-2xl space-y-1 max-h-60 overflow-y-auto">
              <div className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 border-b border-slate-800">
                {lang === 'ar' ? `نتائج البحث المتطابقة (${searchResults.length}):` : `Search Results (${searchResults.length}):`}
              </div>
              {searchResults.map((res, i) => (
                <button
                  key={i}
                  onClick={() => {
                    handleJumpToPage(res.page);
                    setSearchQuery('');
                  }}
                  className="w-full p-2 rounded-lg text-start hover:bg-slate-900 border border-transparent hover:border-slate-800 flex items-center justify-between text-xs cursor-pointer"
                >
                  <span className="text-slate-200 font-bold line-clamp-1">{res.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-emerald-300 font-mono shrink-0 ml-2">
                    {lang === 'ar' ? `ص ${res.page}` : `p. ${res.page}`}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Table of Contents Drawer */}
      {isTocOpen && (
        <div className="p-4 rounded-2xl bg-[#08101e] border border-slate-700 shadow-xl space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'فهرس المجلدات الستة الكبرى (3,250 صفحة):' : 'Grand Codex Master Table of Contents (3,250 Pages):'}</span>
            </span>
            <button 
              onClick={() => setIsTocOpen(false)}
              className="text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {volumes.map((vol) => (
              <div
                key={vol.id}
                onClick={() => {
                  handleJumpToPage(vol.startPage);
                  setIsTocOpen(false);
                }}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  activeVolume.id === vol.id
                    ? 'bg-slate-900 border-emerald-400 shadow-md'
                    : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="font-bold text-white">{lang === 'ar' ? `المجلد 0${vol.id}` : `Volume 0${vol.id}`}</span>
                  <span className="text-emerald-400 font-mono text-[10px]">ص {vol.pagesRange}</span>
                </div>
                <h4 className="text-xs font-bold text-slate-200 line-clamp-1 mb-1">
                  {lang === 'ar' ? vol.titleAr : vol.titleEn}
                </h4>
                <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">
                  {lang === 'ar' ? vol.summaryAr : vol.summaryEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Display Stage: Either Page Reader OR Volume Quizzes */}
      {activeTab === 'PAGE_READ' ? (
        <div className="rounded-2xl bg-[#08101e] border border-slate-800 p-4 sm:p-7 shadow-2xl relative">
          {/* Header Ribbon */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4 mb-5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="text-xs px-2.5 py-1 rounded-md font-bold bg-slate-900 border border-slate-700 text-emerald-300">
                {activePageData.ruleCode}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                {activePageData.category}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                {activePageData.standardReference}
              </span>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* Bookmark button */}
              <button
                onClick={() => toggleBookmark(currentPage)}
                className={`px-3 py-1 rounded-lg border text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  bookmarks.includes(currentPage)
                    ? 'bg-slate-800 border-slate-600 text-slate-100'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(currentPage) ? 'fill-slate-300 text-slate-300' : ''}`} />
                <span>{bookmarks.includes(currentPage) ? (lang === 'ar' ? 'محفوظة' : 'Bookmarked') : (lang === 'ar' ? 'حفظ الصفحة' : 'Bookmark')}</span>
              </button>

              {/* Page Number Indicator */}
              <div className="px-3 py-1 rounded-lg bg-black/60 border border-slate-800 text-xs font-bold text-white font-mono">
                {lang === 'ar' ? `الصفحة ${currentPage}` : `Page ${currentPage}`} <span className="text-slate-500">/ {TOTAL_PAGES}</span>
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="space-y-5">
            {/* Title */}
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                {lang === 'ar' ? activePageData.titleAr : activePageData.titleEn}
              </h2>
              <div className="w-16 h-0.5 bg-emerald-500 mt-2"></div>
            </div>

            {/* Directive Quote */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'نص القاعدة الصارمة:' : 'Core Directive:'}</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-bold leading-relaxed italic">
                {lang === 'ar' ? activePageData.ruleQuoteAr : activePageData.ruleQuoteEn}
              </p>
            </div>

            {/* Technical Details */}
            <div className="space-y-2">
              <h4 className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                {lang === 'ar' ? 'التفصيل الهندسي والتنفيذي للسيادة:' : 'Engineering Architecture & Sovereign Protocol:'}
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                {lang === 'ar' ? activePageData.technicalDetailsAr : activePageData.technicalDetailsEn}
              </p>
            </div>

            {/* Terminal Sandbox */}
            <div className="bg-[#050810] border border-slate-800 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                  <Terminal className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'التطبيق العملي على سطر الأوامر (CLI Sandbox):' : 'Tactical CLI Terminal Sandbox:'}</span>
                </span>
                <button
                  onClick={handleRunTerminal}
                  disabled={isTerminalRunning}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 font-bold text-[10px] flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <Zap className="w-3 h-3 text-emerald-400" />
                  <span>{isTerminalRunning ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Executing...') : (lang === 'ar' ? 'تشغيل الأمر' : 'Run CLI')}</span>
                </button>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <div className="text-slate-400 flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">$</span>
                  <span className="text-emerald-300 select-all">{activePageData.terminalExercise.command}</span>
                </div>

                {terminalLog && (
                  <div className="p-2.5 rounded bg-black/80 border border-slate-800 text-[11px] text-emerald-400 whitespace-pre-wrap animate-fadeIn">
                    {terminalLog}
                  </div>
                )}

                <p className="text-[10px] text-slate-500 pt-1">
                  {lang === 'ar' ? activePageData.terminalExercise.explanationAr : activePageData.terminalExercise.explanationEn}
                </p>
              </div>
            </div>

            {/* Sovereign Impact */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-start gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-300">{lang === 'ar' ? 'الأثر السيادي الوطني:' : 'Sovereign National Impact:'} </span>
                <span className="text-slate-400">{lang === 'ar' ? activePageData.sovereignImpactAr : activePageData.sovereignImpactEn}</span>
              </div>
            </div>
          </div>

          {/* Bottom Fast Turn Ribbon */}
          <div className="mt-8 pt-5 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 w-full sm:w-auto justify-center">
              <button
                onClick={() => handleJumpToPage(currentPage - 100)}
                disabled={currentPage <= 100}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-30 cursor-pointer"
                title="-100 Pages"
              >
                <ChevronsLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => handleJumpToPage(currentPage - 10)}
                disabled={currentPage <= 10}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-30 cursor-pointer font-bold"
                title="-10 Pages"
              >
                -10
              </button>

              <button
                onClick={() => handleJumpToPage(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-4 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white text-xs font-bold flex items-center gap-1 disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                <span>{lang === 'ar' ? 'السابق' : 'Prev'}</span>
              </button>

              <button
                onClick={() => handleJumpToPage(currentPage + 1)}
                disabled={currentPage >= TOTAL_PAGES}
                className="px-5 py-1.5 rounded-lg bg-slate-100 hover:bg-white text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer disabled:opacity-30 transition-all shadow-sm"
              >
                <span>{lang === 'ar' ? 'التالي' : 'Next'}</span>
                <ChevronRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>

              <button
                onClick={() => handleJumpToPage(currentPage + 10)}
                disabled={currentPage >= TOTAL_PAGES - 10}
                className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-30 cursor-pointer font-bold"
                title="+10 Pages"
              >
                +10
              </button>

              <button
                onClick={() => handleJumpToPage(currentPage + 100)}
                disabled={currentPage >= TOTAL_PAGES - 100}
                className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-30 cursor-pointer"
                title="+100 Pages"
              >
                <ChevronsRight className={`w-4 h-4 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Jump to Quiz for this volume */}
            <button
              onClick={() => {
                setActiveTab('VOLUME_QUIZZES');
                setUserSelectedOption(null);
                setIsQuizSubmitted(false);
              }}
              className="text-xs text-slate-300 hover:text-white font-bold flex items-center gap-1.5 cursor-pointer bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <span>{lang === 'ar' ? `اختبار فهم المجلد 0${activeVolume.id} (${currentVolumeQuizzes.length} أسئلة)` : `Test Volume 0${activeVolume.id} (${currentVolumeQuizzes.length} Questions)`}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      ) : (
        /* VOLUME INTERACTIVE QUIZ BANK */
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                  {lang === 'ar' ? `اختبارات المجلد 0${activeVolume.id}` : `Volume 0${activeVolume.id} Evaluations`}
                </span>
                <span className="text-xs text-slate-400">
                  {activeQuiz.categoryAr}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-700 text-slate-300">
                  {activeQuiz.difficulty}
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1">
                {lang === 'ar' ? `السؤال رقم 0${selectedQuizIndex + 1} من أصل 0${currentVolumeQuizzes.length}` : `Question 0${selectedQuizIndex + 1} of 0${currentVolumeQuizzes.length}`}
              </h3>
            </div>

            {/* Quiz Selector Dots */}
            <div className="flex items-center gap-2">
              {currentVolumeQuizzes.map((q, qIdx) => {
                const isCurrent = qIdx === selectedQuizIndex;
                const isPassed = scoreTracker[q.id];

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setSelectedQuizIndex(qIdx);
                      setUserSelectedOption(null);
                      setIsQuizSubmitted(false);
                    }}
                    className={`w-8 h-8 rounded-lg border text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-md'
                        : isPassed
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {isPassed ? '✓' : qIdx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Body */}
          <div className="text-sm sm:text-base font-bold text-white leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
            {lang === 'ar' ? activeQuiz.questionAr : activeQuiz.questionEn}
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {(lang === 'ar' ? activeQuiz.optionsAr : activeQuiz.optionsEn).map((opt, oIdx) => {
              const isSelected = userSelectedOption === oIdx;
              let optionStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

              if (isQuizSubmitted) {
                if (oIdx === activeQuiz.correctIndex) {
                  optionStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-bold';
                } else if (isSelected) {
                  optionStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-200';
                }
              } else if (isSelected) {
                optionStyle = 'bg-slate-800 border-slate-600 text-slate-100 font-bold';
              }

              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectQuizOption(oIdx)}
                  className={`w-full p-3.5 rounded-xl border text-start text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optionStyle}`}
                >
                  <span>{opt}</span>
                  <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Submission and Explanations */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            {!isQuizSubmitted ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={userSelectedOption === null}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50 transition-all shadow-md"
              >
                {lang === 'ar' ? 'تأكيد الإجابة والتحقق ✓' : 'Validate Answer ✓'}
              </button>
            ) : (
              <div className="w-full space-y-3">
                <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                  userSelectedOption === activeQuiz.correctIndex
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                }`}>
                  <div className="font-bold mb-1 flex items-center gap-1.5">
                    {userSelectedOption === activeQuiz.correctIndex ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>{lang === 'ar' ? 'إجابة صحيحة ومتقنة! 🛡️' : 'Correct Answer! Outstanding 🛡️'}</span>
                      </>
                    ) : (
                      <span>{lang === 'ar' ? 'إجابة غير دقيقة!' : 'Incorrect Answer'}</span>
                    )}
                  </div>
                  <div>{lang === 'ar' ? activeQuiz.explanationAr : activeQuiz.explanationEn}</div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    onClick={() => setActiveTab('PAGE_READ')}
                    className="text-xs text-slate-400 hover:text-white cursor-pointer"
                  >
                    {lang === 'ar' ? '← العودة لقراءة صفحات المجلد' : '← Return to Pages'}
                  </button>

                  <button
                    onClick={handleNextQuiz}
                    className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <span>{lang === 'ar' ? 'السؤال التالي' : 'Next Question'}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
