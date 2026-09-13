import React, { useState, useMemo, useEffect } from 'react';
import { 
  GraduationCap, BookOpen, Terminal, Shield, ShieldCheck, Lock, 
  Cpu, Award, CheckCircle2, ChevronRight, Play, Sparkles, AlertTriangle,
  Zap, Search, HelpCircle, Code2, Globe, FileText, ArrowRight, X,
  Layers, Bookmark, Check, RefreshCw, Printer, Filter, Eye, Lightbulb,
  User, CheckCircle, Clock
} from 'lucide-react';
import { SovereignCyberBook } from './SovereignCyberBook';
import { soundEffects } from '../services/soundEffects';
import { 
  CURRICULUM_TRACKS, 
  COMPREHENSIVE_QA_BANK, 
  CLI_LAB_SCENARIOS, 
  SOVEREIGN_GLOSSARY,
  CurriculumTrack
} from '../data/academyExtendedData';
import { InteractiveQuizQuestion, CliLabScenario, GlossaryItem } from '../data/academyCurriculum';

interface AcademyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

type AcademyPage = 'CODEX_BOOK' | 'CURRICULUM' | 'QA_BANK' | 'CLI_LAB' | 'GLOSSARY' | 'CERTIFICATE';

export const SovereignCyberAcademyModal: React.FC<AcademyModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  // Navigation
  const [activePage, setActivePage] = useState<AcademyPage>('CODEX_BOOK');

  // Curriculum State
  const [activeModuleId, setActiveModuleId] = useState<string>('LEVEL_0');
  const [activeTopicIndex, setActiveTopicIndex] = useState<number>(0);
  const [moduleQuizIndex, setModuleQuizIndex] = useState<number>(0);
  const [moduleQuizAnswer, setModuleQuizAnswer] = useState<number | null>(null);
  const [isModuleQuizSubmitted, setIsModuleQuizSubmitted] = useState<boolean>(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);

  // Q&A Bank State
  const [qaSearchQuery, setQaSearchQuery] = useState<string>('');
  const [qaCategoryFilter, setQaCategoryFilter] = useState<string>('ALL');
  const [qaDifficultyFilter, setQaDifficultyFilter] = useState<string>('ALL');
  const [qaDisplayMode, setQaDisplayMode] = useState<'QUIZ' | 'STUDY'>('QUIZ');
  const [activeQaIndex, setActiveQaIndex] = useState<number>(0);
  const [selectedQaOption, setSelectedQaOption] = useState<number | null>(null);
  const [isQaSubmitted, setIsQaSubmitted] = useState<boolean>(false);
  const [solvedQuestions, setSolvedQuestions] = useState<Record<string, boolean>>({});
  const [showQaHint, setShowQaHint] = useState<boolean>(false);

  // CLI Lab State
  const [selectedLabId, setSelectedLabId] = useState<string>(CLI_LAB_SCENARIOS[0]?.id || 'lab_xdp_drop');
  const [runningLab, setRunningLab] = useState<boolean>(false);
  const [labOutput, setLabOutput] = useState<string | null>(null);
  const [completedLabs, setCompletedLabs] = useState<string[]>([]);

  // Glossary State
  const [glossarySearch, setGlossarySearch] = useState<string>('');
  const [glossaryCategory, setGlossaryCategory] = useState<string>('ALL');

  // Certificate / Comprehensive Exam State
  const [traineeName, setTraineeName] = useState<string>(lang === 'ar' ? 'مهندس دفاع سيبراني' : 'Sovereign Cyber Engineer');
  const [examStarted, setExamStarted] = useState<boolean>(false);
  const [examCurrentIndex, setExamCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);

  // General utility state
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Ensure speech synthesis is completely stopped and cancelled
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Selected curriculum track
  const currentTrack = CURRICULUM_TRACKS.find(m => m.id === activeModuleId) || CURRICULUM_TRACKS[0];
  const currentTopics = lang === 'ar' ? currentTrack.topicsAr : currentTrack.topicsEn;
  const currentTrackQuizzes = currentTrack.quizzes;
  const activeModuleQuiz = currentTrackQuizzes[moduleQuizIndex] || currentTrackQuizzes[0];

  // Copy command helper
  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    soundEffects.playRadarBlip(800, 50);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  // Filtered Q&A Bank
  const filteredQuestions = useMemo(() => {
    return COMPREHENSIVE_QA_BANK.filter(q => {
      const matchSearch = qaSearchQuery.trim() === '' || 
        q.questionAr.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
        q.questionEn.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
        q.explanationAr.toLowerCase().includes(qaSearchQuery.toLowerCase()) ||
        q.categoryAr.toLowerCase().includes(qaSearchQuery.toLowerCase());
      
      const matchCat = qaCategoryFilter === 'ALL' || q.categoryAr === qaCategoryFilter;
      const matchDiff = qaDifficultyFilter === 'ALL' || q.difficulty === qaDifficultyFilter;

      return matchSearch && matchCat && matchDiff;
    });
  }, [qaSearchQuery, qaCategoryFilter, qaDifficultyFilter]);

  const activeQuestion = filteredQuestions[activeQaIndex] || filteredQuestions[0] || COMPREHENSIVE_QA_BANK[0];

  // Q&A Categories
  const qaCategories = useMemo(() => {
    const cats = new Set<string>();
    COMPREHENSIVE_QA_BANK.forEach(q => cats.add(q.categoryAr));
    return Array.from(cats);
  }, []);

  // Filtered Glossary
  const filteredGlossary = useMemo(() => {
    return SOVEREIGN_GLOSSARY.filter(item => {
      const matchSearch = glossarySearch.trim() === '' ||
        item.termEn.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.termAr.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.definitionAr.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.definitionEn.toLowerCase().includes(glossarySearch.toLowerCase()) ||
        item.importanceAr.toLowerCase().includes(glossarySearch.toLowerCase());
      
      const matchCat = glossaryCategory === 'ALL' || item.categoryAr === glossaryCategory;
      return matchSearch && matchCat;
    });
  }, [glossarySearch, glossaryCategory]);

  const glossaryCategories = useMemo(() => {
    const cats = new Set<string>();
    SOVEREIGN_GLOSSARY.forEach(g => cats.add(g.categoryAr));
    return Array.from(cats);
  }, []);

  // Selected Lab Scenario
  const activeLab = CLI_LAB_SCENARIOS.find(s => s.id === selectedLabId) || CLI_LAB_SCENARIOS[0];

  // Run simulated lab command
  const handleRunLab = () => {
    setRunningLab(true);
    soundEffects.playRadarBlip(600, 50);
    setTimeout(() => {
      setRunningLab(false);
      setLabOutput(activeLab.expectedOutput);
      if (!completedLabs.includes(activeLab.id)) {
        setCompletedLabs(prev => [...prev, activeLab.id]);
        soundEffects.playMitigationChirp();
      }
    }, 900);
  };

  // Handle Q&A answer submit
  const handleSubmitQa = () => {
    if (selectedQaOption === null) return;
    setIsQaSubmitted(true);
    if (selectedQaOption === activeQuestion.correctIndex) {
      soundEffects.playMitigationChirp();
      setSolvedQuestions(prev => ({ ...prev, [activeQuestion.id]: true }));
    } else {
      soundEffects.playRadarBlip(240, 150);
    }
  };

  // Next Question in Q&A Bank
  const handleNextQa = () => {
    if (activeQaIndex < filteredQuestions.length - 1) {
      setActiveQaIndex(prev => prev + 1);
      setSelectedQaOption(null);
      setIsQaSubmitted(false);
      setShowQaHint(false);
    } else {
      setActiveQaIndex(0);
      setSelectedQaOption(null);
      setIsQaSubmitted(false);
      setShowQaHint(false);
    }
  };

  // Handle Curriculum Track Quiz Submit
  const handleModuleQuizSubmit = () => {
    if (moduleQuizAnswer === null) return;
    setIsModuleQuizSubmitted(true);
    if (moduleQuizAnswer === activeModuleQuiz.correctIndex) {
      soundEffects.playMitigationChirp();
      setSolvedQuestions(prev => ({ ...prev, [activeModuleQuiz.id]: true }));
      if (!completedModules.includes(currentTrack.id)) {
        setCompletedModules(prev => [...prev, currentTrack.id]);
      }
    } else {
      soundEffects.playRadarBlip(240, 150);
    }
  };

  // Exam 10 questions subset
  const examQuestions = useMemo(() => {
    return COMPREHENSIVE_QA_BANK.slice(0, 10);
  }, []);

  const handleStartExam = () => {
    setExamStarted(true);
    setExamCurrentIndex(0);
    setExamAnswers({});
    setExamSubmitted(false);
    setExamScore(0);
    soundEffects.playRadarBlip(750, 60);
  };

  const handleExamSubmit = () => {
    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (examAnswers[idx] === q.correctIndex) {
        score += 1;
      }
    });
    setExamScore(score);
    setExamSubmitted(true);
    if (score >= 7) {
      soundEffects.playMitigationChirp();
    } else {
      soundEffects.playRadarBlip(240, 150);
    }
  };

  // Academic rank calculation
  const solvedCount = Object.keys(solvedQuestions).length;
  const rankTitle = solvedCount >= 15 
    ? (lang === 'ar' ? 'مهندس سيادة وطنية معتمد 🛡️' : 'Certified Sovereign Engineer 🛡️')
    : solvedCount >= 6 
    ? (lang === 'ar' ? 'مدافع سيبراني متقدم ⚡' : 'Advanced Cyber Defender ⚡')
    : (lang === 'ar' ? 'طالب سيادي ناشئ 🇲🇦' : 'Sovereign Cyber Cadet 🇲🇦');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-[#090e1a] border border-slate-800 w-full max-w-7xl max-h-[96vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-mono">
        
        {/* Top Executive Sovereign Banner */}
        <div className="p-4 sm:p-5 bg-slate-900/95 border-b border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center shadow-inner shrink-0">
              <GraduationCap className="w-6 h-6 text-slate-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700 font-bold">
                  🇲🇦 الأكاديمية السيادية للأمن والدفاع الرقمي
                </span>
                <span className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'مؤسسة حماية البنى التحتية الحساسة' : 'Critical Infrastructure Cyber Defense'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black text-white mt-0.5">
                {lang === 'ar' ? 'أكاديمية السيادة السيبرانية وموسوعة القواعد الـ 3,250' : 'Sovereign Cyber Academy & Grand Codex 3,250'}
              </h2>
            </div>
          </div>

          {/* Academic Stats HUD & Close Button */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 text-xs">
              <div className="flex flex-col text-start">
                <span className="text-[10px] text-slate-400">{lang === 'ar' ? 'الرتبة الأكاديمية:' : 'Rank:'}</span>
                <span className="text-xs font-bold text-slate-200">{rankTitle}</span>
              </div>
              <div className="h-6 w-px bg-slate-800 mx-1"></div>
              <div className="flex flex-col text-start">
                <span className="text-[10px] text-slate-400">{lang === 'ar' ? 'الأسئلة المحلولة:' : 'Solved Qs:'}</span>
                <span className="text-xs font-bold text-emerald-400">{solvedCount} / {COMPREHENSIVE_QA_BANK.length}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2.5 rounded-xl bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-white cursor-pointer transition-all"
              title={lang === 'ar' ? 'إغلاق الأكاديمية' : 'Close Academy'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Organized Navigation Ribbon: 6 Distinct Automatic Pages */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center gap-2 overflow-x-auto select-none">
          {/* Page 1: Codex 3,250 */}
          <button
            onClick={() => setActivePage('CODEX_BOOK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'CODEX_BOOK'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'الموسوعة الكبرى (3,250 صفحة)' : 'Grand Codex (3,250 P.)'}</span>
          </button>

          {/* Page 2: Curriculum Tracks */}
          <button
            onClick={() => setActivePage('CURRICULUM')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'CURRICULUM'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'مسارات المنهج (Levels 00-04)' : 'Curriculum Tracks'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
              {completedModules.length}/5
            </span>
          </button>

          {/* Page 3: Comprehensive QA Bank */}
          <button
            onClick={() => setActivePage('QA_BANK')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'QA_BANK'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'بنك الأسئلة والأجوبة الشامل' : 'Q&A Sovereign Bank'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
              {COMPREHENSIVE_QA_BANK.length}
            </span>
          </button>

          {/* Page 4: Tactical CLI Lab */}
          <button
            onClick={() => setActivePage('CLI_LAB')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'CLI_LAB'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'المختبر التكتيكي وسيناريوهات النواة' : 'Kernel CLI Lab'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
              {completedLabs.length}/8
            </span>
          </button>

          {/* Page 5: Sovereign Glossary */}
          <button
            onClick={() => setActivePage('GLOSSARY')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'GLOSSARY'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'معجم المعايير والمصطلحات' : 'Standards Glossary'}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">
              {SOVEREIGN_GLOSSARY.length}
            </span>
          </button>

          {/* Page 6: Certificate */}
          <button
            onClick={() => setActivePage('CERTIFICATE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap cursor-pointer transition-all border ${
              activePage === 'CERTIFICATE'
                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-slate-300" />
            <span>{lang === 'ar' ? 'الامتحان والشهادة السيادية' : 'Exam & Certification'}</span>
          </button>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* ================= PAGE 1: CODEX 3,250 BOOK ================= */}
          {activePage === 'CODEX_BOOK' && (
            <div className="space-y-4">
              <SovereignCyberBook lang={lang} />
            </div>
          )}

          {/* ================= PAGE 2: CURRICULUM TRACKS ================= */}
          {activePage === 'CURRICULUM' && (
            <div className="space-y-6">
              {/* Level Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {CURRICULUM_TRACKS.map((track) => {
                  const isSelected = track.id === activeModuleId;
                  const isDone = completedModules.includes(track.id);

                  return (
                    <button
                      key={track.id}
                      onClick={() => {
                        setActiveModuleId(track.id);
                        setActiveTopicIndex(0);
                        setModuleQuizIndex(0);
                        setModuleQuizAnswer(null);
                        setIsModuleQuizSubmitted(false);
                      }}
                      className={`p-3 rounded-xl border text-start transition-all cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? 'bg-slate-800/90 border-slate-600 text-slate-100 shadow-md' 
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900/50 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                        <span className="font-bold text-white">{track.levelBadge}</span>
                        {isDone ? (
                          <span className="flex items-center gap-1 text-emerald-400 font-bold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{lang === 'ar' ? 'مكتمل' : 'Passed'}</span>
                          </span>
                        ) : (
                          <span>{track.duration}</span>
                        )}
                      </div>
                      <div className="text-xs font-bold line-clamp-1">
                        {lang === 'ar' ? track.titleAr : track.titleEn}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Module Header Card */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-300 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                    {lang === 'ar' ? currentTrack.levelAr : currentTrack.levelEn}
                  </span>
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{currentTrack.duration} ({currentTrack.estimatedHours}h)</span>
                    </span>
                    <span>•</span>
                    <span>{lang === 'ar' ? currentTrack.prerequisitesAr : currentTrack.prerequisitesEn}</span>
                  </div>
                </div>
                <h3 className="text-lg font-black text-white">
                  {lang === 'ar' ? currentTrack.titleAr : currentTrack.titleEn}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {lang === 'ar' ? currentTrack.descAr : currentTrack.descEn}
                </p>
              </div>

              {/* Curriculum Two-Column View */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Topics List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 px-1">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lang === 'ar' ? 'فهرس موضوعات المستوى:' : 'Module Topics:'}</span>
                  </div>
                  {currentTopics.map((top, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveTopicIndex(idx)}
                      className={`w-full p-3 rounded-xl text-start border transition-all cursor-pointer flex items-start gap-2.5 ${
                        activeTopicIndex === idx
                          ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-md bg-slate-800 text-[11px] font-bold flex items-center justify-center shrink-0 text-slate-300">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold leading-snug">{top.title}</span>
                    </button>
                  ))}

                  {/* Founder Note Card */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs mt-4">
                    <div className="flex items-center gap-2 text-slate-200 font-bold mb-1.5">
                      <Sparkles className="w-4 h-4 text-slate-300" />
                      <span>{lang === 'ar' ? 'توجيه هندسي من طه الستري' : 'Founder Advisory'}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">
                      {lang === 'ar'
                        ? '«تعلم الاختراق الأخلاقي لتبني ولتحمي، وليس لتهدم. المغرب يحتاج لمهندسين يحرسون بنوكه وسيادته الرقمية على مستوى النواة وبلا مساومة.»'
                        : '“Learn ethical offense to forge impenetrable defense. National sovereignty demands engineers who master the Linux kernel to protect critical assets.”'}
                    </p>
                  </div>
                </div>

                {/* Right: Detailed Topic & Level Quiz */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Topic Card */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {currentTrack.levelBadge} • {lang === 'ar' ? `الموضوع 0${activeTopicIndex + 1}` : `Topic 0${activeTopicIndex + 1}`}
                      </span>
                      <span className="text-xs text-slate-400">
                        {lang === 'ar' ? 'شرح تنفيذي تفصيلي' : 'Operational Guide'}
                      </span>
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-white">
                      {currentTopics[activeTopicIndex].title}
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-justify">
                      {currentTopics[activeTopicIndex].detail}
                    </p>

                    {/* Command Sample */}
                    {currentTopics[activeTopicIndex].command && (
                      <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                            <Terminal className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'الأمر التنفيذي العملي:' : 'Tactical Command:'}</span>
                          </span>
                          <button
                            onClick={() => copyCommand(currentTopics[activeTopicIndex].command!)}
                            className="text-slate-400 hover:text-white text-[10px] cursor-pointer"
                          >
                            {copiedCmd === currentTopics[activeTopicIndex].command ? (
                              <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                            ) : (
                              <span>{lang === 'ar' ? 'نسخ الأمر' : 'Copy'}</span>
                            )}
                          </button>
                        </div>
                        <pre className="text-xs font-mono text-slate-200 select-all overflow-x-auto" dir="ltr">
                          $ {currentTopics[activeTopicIndex].command}
                        </pre>
                      </div>
                    )}

                    {/* Field Secret Tip */}
                    <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 flex items-start gap-2.5">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-300">{lang === 'ar' ? 'نصيحة الميدان:' : 'Field Secret:'} </span>
                        <span>{currentTopics[activeTopicIndex].tips}</span>
                      </div>
                    </div>
                  </div>

                  {/* Level Evaluation Quiz */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-slate-300" />
                        <span>{lang === 'ar' ? `اختبار فهم المستوى (${moduleQuizIndex + 1} من ${currentTrackQuizzes.length})` : `Level Quiz (${moduleQuizIndex + 1} of ${currentTrackQuizzes.length})`}</span>
                      </span>
                      <div className="flex items-center gap-1.5">
                        {currentTrackQuizzes.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setModuleQuizIndex(idx);
                              setModuleQuizAnswer(null);
                              setIsModuleQuizSubmitted(false);
                            }}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold border cursor-pointer transition-all ${
                              idx === moduleQuizIndex
                                ? 'bg-slate-800 border-slate-600 text-slate-100'
                                : solvedQuestions[q.id]
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {solvedQuestions[q.id] ? '✓' : idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-xs sm:text-sm font-bold text-white leading-relaxed">
                      {lang === 'ar' ? activeModuleQuiz.questionAr : activeModuleQuiz.questionEn}
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {(lang === 'ar' ? activeModuleQuiz.optionsAr : activeModuleQuiz.optionsEn).map((opt, oIdx) => {
                        const isSelected = moduleQuizAnswer === oIdx;
                        let optStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isModuleQuizSubmitted) {
                          if (oIdx === activeModuleQuiz.correctIndex) {
                            optStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-bold';
                          } else if (isSelected) {
                            optStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-200';
                          }
                        } else if (isSelected) {
                          optStyle = 'bg-slate-800 border-slate-600 text-slate-100 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!isModuleQuizSubmitted) {
                                setModuleQuizAnswer(oIdx);
                                soundEffects.playRadarBlip(600, 40);
                              }
                            }}
                            className={`w-full p-3 rounded-xl border text-start text-xs transition-all cursor-pointer flex items-center justify-between gap-2.5 ${optStyle}`}
                          >
                            <span>{opt}</span>
                            <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit & Explanation */}
                    <div className="pt-2">
                      {!isModuleQuizSubmitted ? (
                        <button
                          onClick={handleModuleQuizSubmit}
                          disabled={moduleQuizAnswer === null}
                          className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                        >
                          {lang === 'ar' ? 'تأكيد الإجابة والتحقق ✓' : 'Verify Answer ✓'}
                        </button>
                      ) : (
                        <div className="space-y-3">
                          <div className={`p-3.5 rounded-xl text-xs border ${
                            moduleQuizAnswer === activeModuleQuiz.correctIndex
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          }`}>
                            <div className="font-bold mb-1 flex items-center gap-1.5">
                              {moduleQuizAnswer === activeModuleQuiz.correctIndex ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>{lang === 'ar' ? 'إجابة نموذجية صحيحة! 🛡️' : 'Outstanding! Correct Answer 🛡️'}</span>
                                </>
                              ) : (
                                <span>{lang === 'ar' ? 'إجابة غير صحيحة، طالع التفسير:' : 'Incorrect Answer. Review Explanation:'}</span>
                              )}
                            </div>
                            <p>{lang === 'ar' ? activeModuleQuiz.explanationAr : activeModuleQuiz.explanationEn}</p>
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => {
                                if (moduleQuizIndex < currentTrackQuizzes.length - 1) {
                                  setModuleQuizIndex(prev => prev + 1);
                                  setModuleQuizAnswer(null);
                                  setIsModuleQuizSubmitted(false);
                                } else {
                                  setModuleQuizIndex(0);
                                  setModuleQuizAnswer(null);
                                  setIsModuleQuizSubmitted(false);
                                }
                              }}
                              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <span>{lang === 'ar' ? 'السؤال التالي' : 'Next Question'}</span>
                              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 3: COMPREHENSIVE QA BANK ================= */}
          {activePage === 'QA_BANK' && (
            <div className="space-y-6">
              {/* Header & Filter Controls */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-slate-300" />
                      <span>{lang === 'ar' ? 'بنك الأسئلة والأجوبة السيادي الشامل' : 'Comprehensive Sovereign Q&A Repository'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'ar' ? `يحتوي البنك على ${COMPREHENSIVE_QA_BANK.length} سؤالاً تفصيلياً يغطي معايير DGSSI، النواة، وهندسة التشفير الحديثة` : `${COMPREHENSIVE_QA_BANK.length} in-depth questions on kernel defense, PQC, and national cyber law.`}
                    </p>
                  </div>

                  {/* Mode Selector: Quiz vs Study Bank */}
                  <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
                    <button
                      onClick={() => setQaDisplayMode('QUIZ')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        qaDisplayMode === 'QUIZ'
                          ? 'bg-slate-800 border border-slate-700 text-slate-100'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? '🎯 وضع الاختبار التفاعلي' : '🎯 Interactive Quiz Mode'}
                    </button>
                    <button
                      onClick={() => setQaDisplayMode('STUDY')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        qaDisplayMode === 'STUDY'
                          ? 'bg-slate-800 border border-slate-700 text-slate-100'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang === 'ar' ? '📖 بنك المطالعة والحلول' : '📖 Study Bank & Solutions'}
                    </button>
                  </div>
                </div>

                {/* Filters Ribbon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      value={qaSearchQuery}
                      onChange={(e) => {
                        setQaSearchQuery(e.target.value);
                        setActiveQaIndex(0);
                      }}
                      placeholder={lang === 'ar' ? 'ابحث في الأسئلة (مثال: SYN, Root, eBPF, PQC)...' : 'Search questions (e.g. SYN, Root, eBPF)...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>

                  {/* Category Filter */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={qaCategoryFilter}
                      onChange={(e) => {
                        setQaCategoryFilter(e.target.value);
                        setActiveQaIndex(0);
                      }}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL" className="bg-slate-900">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
                      {qaCategories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty Filter */}
                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                    <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={qaDifficultyFilter}
                      onChange={(e) => {
                        setQaDifficultyFilter(e.target.value);
                        setActiveQaIndex(0);
                      }}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL" className="bg-slate-900">{lang === 'ar' ? 'جميع المستويات' : 'All Difficulties'}</option>
                      <option value="مبتدئ" className="bg-slate-900">{lang === 'ar' ? 'مبتدئ' : 'Beginner'}</option>
                      <option value="متوسط" className="bg-slate-900">{lang === 'ar' ? 'متوسط' : 'Intermediate'}</option>
                      <option value="متقدم" className="bg-slate-900">{lang === 'ar' ? 'متقدم' : 'Advanced'}</option>
                      <option value="خبير سيادي" className="bg-slate-900">{lang === 'ar' ? 'خبير سيادي' : 'Sovereign Expert'}</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* QA MODE 1: INTERACTIVE QUIZ MODE */}
              {qaDisplayMode === 'QUIZ' && (
                filteredQuestions.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 bg-slate-900/60 border border-slate-800 rounded-2xl">
                    {lang === 'ar' ? 'لم يتم العثور على أسئلة مطابقة للبحث أو الفلتر.' : 'No questions matching search filter.'}
                  </div>
                ) : (
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
                    {/* Header bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-200 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                          {activeQuestion.categoryAr}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                          {activeQuestion.difficulty}
                        </span>
                        <span className="text-xs text-slate-400">
                          {lang === 'ar' ? `السؤال ${activeQaIndex + 1} من ${filteredQuestions.length}` : `Question ${activeQaIndex + 1} of ${filteredQuestions.length}`}
                        </span>
                      </div>

                      {/* Question numbers dots */}
                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs py-1">
                        {filteredQuestions.map((q, idx) => (
                          <button
                            key={q.id}
                            onClick={() => {
                              setActiveQaIndex(idx);
                              setSelectedQaOption(null);
                              setIsQaSubmitted(false);
                              setShowQaHint(false);
                            }}
                            className={`w-6 h-6 rounded-lg text-[10px] font-bold border cursor-pointer shrink-0 transition-all ${
                              idx === activeQaIndex
                                ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-sm'
                                : solvedQuestions[q.id]
                                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            {solvedQuestions[q.id] ? '✓' : idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Question text */}
                    <div className="text-base font-bold text-white leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800">
                      {lang === 'ar' ? activeQuestion.questionAr : activeQuestion.questionEn}
                    </div>

                    {/* Hint Box toggle */}
                    {activeQuestion.hintAr && (
                      <div>
                        <button
                          onClick={() => setShowQaHint(!showQaHint)}
                          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1.5 cursor-pointer"
                        >
                          <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                          <span>{showQaHint ? (lang === 'ar' ? 'إخفاء التلميح' : 'Hide Hint') : (lang === 'ar' ? 'عرض تلميح مساعد' : 'Show Tactical Hint')}</span>
                        </button>
                        {showQaHint && (
                          <div className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 animate-fadeIn">
                            💡 {lang === 'ar' ? activeQuestion.hintAr : activeQuestion.hintEn}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Options list */}
                    <div className="space-y-2.5">
                      {(lang === 'ar' ? activeQuestion.optionsAr : activeQuestion.optionsEn).map((opt, oIdx) => {
                        const isSelected = selectedQaOption === oIdx;
                        let optStyle = 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isQaSubmitted) {
                          if (oIdx === activeQuestion.correctIndex) {
                            optStyle = 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200 font-bold';
                          } else if (isSelected) {
                            optStyle = 'bg-rose-500/10 border-rose-500/40 text-rose-200';
                          }
                        } else if (isSelected) {
                          optStyle = 'bg-slate-800 border-slate-600 text-slate-100 font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => {
                              if (!isQaSubmitted) {
                                setSelectedQaOption(oIdx);
                                soundEffects.playRadarBlip(600, 40);
                              }
                            }}
                            className={`w-full p-3.5 rounded-xl border text-start text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${optStyle}`}
                          >
                            <span>{opt}</span>
                            <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                              {String.fromCharCode(65 + oIdx)}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Code Snippet if present */}
                    {activeQuestion.codeSnippet && (
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl space-y-1">
                        <span className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'ar' ? 'مخطط تدفق البروتوكول / الكود:' : 'Protocol Architecture Schema:'}</span>
                        <pre className="text-xs text-slate-300 font-mono overflow-x-auto whitespace-pre-wrap" dir="ltr">
                          {activeQuestion.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Submission and Explanations */}
                    <div className="pt-2">
                      {!isQaSubmitted ? (
                        <button
                          onClick={handleSubmitQa}
                          disabled={selectedQaOption === null}
                          className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-50 transition-all shadow-sm"
                        >
                          {lang === 'ar' ? 'تأكيد الإجابة والتحقق ✓' : 'Verify Answer ✓'}
                        </button>
                      ) : (
                        <div className="space-y-4">
                          <div className={`p-4 rounded-xl text-xs sm:text-sm leading-relaxed border ${
                            selectedQaOption === activeQuestion.correctIndex
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                          }`}>
                            <div className="font-bold mb-1.5 flex items-center gap-2">
                              {selectedQaOption === activeQuestion.correctIndex ? (
                                <>
                                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                  <span>{lang === 'ar' ? 'إجابة صحيحة ومتقنة! 🛡️' : 'Outstanding! Correct Answer 🛡️'}</span>
                                </>
                              ) : (
                                <span>{lang === 'ar' ? 'إجابة غير صحيحة، الشرح النموذجي أدناه:' : 'Incorrect. Model Explanation Below:'}</span>
                              )}
                            </div>
                            <p>{lang === 'ar' ? activeQuestion.explanationAr : activeQuestion.explanationEn}</p>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              onClick={() => {
                                if (activeQaIndex > 0) {
                                  setActiveQaIndex(prev => prev - 1);
                                  setSelectedQaOption(null);
                                  setIsQaSubmitted(false);
                                  setShowQaHint(false);
                                }
                              }}
                              disabled={activeQaIndex === 0}
                              className="text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                            >
                              {lang === 'ar' ? '← السؤال السابق' : '← Previous Question'}
                            </button>

                            <button
                              onClick={handleNextQa}
                              className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
                            >
                              <span>{lang === 'ar' ? 'السؤال التالي' : 'Next Question'}</span>
                              <ArrowRight className={`w-3.5 h-3.5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )
              )}

              {/* QA MODE 2: STUDY & SOLUTIONS BANK */}
              {qaDisplayMode === 'STUDY' && (
                <div className="space-y-4">
                  <div className="text-xs text-slate-400 font-bold px-1">
                    {lang === 'ar' ? `عرض ${filteredQuestions.length} سؤالاً محلولاً ومشروحاً بالكامل:` : `Displaying ${filteredQuestions.length} comprehensive solved answers:`}
                  </div>

                  <div className="space-y-4">
                    {filteredQuestions.map((q, idx) => (
                      <div key={q.id} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                              #{idx + 1} • {q.categoryAr}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-slate-400">
                              {q.difficulty}
                            </span>
                          </div>
                          {q.hintAr && (
                            <span className="text-[11px] text-slate-400 flex items-center gap-1">
                              <Lightbulb className="w-3 h-3 text-amber-400" />
                              <span>{lang === 'ar' ? q.hintAr : q.hintEn}</span>
                            </span>
                          )}
                        </div>

                        <h4 className="text-sm sm:text-base font-bold text-white">
                          {lang === 'ar' ? q.questionAr : q.questionEn}
                        </h4>

                        {/* Options with marked correct answer */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {(lang === 'ar' ? q.optionsAr : q.optionsEn).map((opt, oIdx) => {
                            const isCorrect = oIdx === q.correctIndex;
                            return (
                              <div
                                key={oIdx}
                                className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                                  isCorrect
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200 font-bold'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                                }`}
                              >
                                <span>{opt}</span>
                                {isCorrect && <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                              </div>
                            );
                          })}
                        </div>

                        {/* Explanation Box */}
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <span className="font-bold text-slate-200">{lang === 'ar' ? 'التفسير السيادي والتنفيذي: ' : 'Technical Explanation: '}</span>
                          <span>{lang === 'ar' ? q.explanationAr : q.explanationEn}</span>
                        </div>

                        {/* Code snippet if any */}
                        {q.codeSnippet && (
                          <pre className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono overflow-x-auto" dir="ltr">
                            {q.codeSnippet}
                          </pre>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= PAGE 4: TACTICAL CLI LAB ================= */}
          {activePage === 'CLI_LAB' && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-slate-300" />
                    <span>{lang === 'ar' ? 'مختبر الأوامر والعمليات السيادية (Linux Kernel CLI Labs)' : 'Sovereign Linux Kernel CLI Labs'}</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {lang === 'ar' ? 'سيناريوهات ميدانية عملية لتطبيق هندسة eBPF، فحص الذاكرة الحية LiME، وإنتروبيا التشفير مباشرة' : 'Operational terminal drills: eBPF XDP mitigations, Shannon entropy, RAM forensics.'}
                  </p>
                </div>
                <div className="text-xs font-bold text-slate-300 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800">
                  {lang === 'ar' ? `المختبرات المنجزة: ${completedLabs.length} من أصل ${CLI_LAB_SCENARIOS.length}` : `Completed Labs: ${completedLabs.length} of ${CLI_LAB_SCENARIOS.length}`}
                </div>
              </div>

              {/* Lab Interface: Scenarios on Left, Terminal Simulator on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Scenarios List */}
                <div className="space-y-2.5">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-1">
                    {lang === 'ar' ? 'سيناريوهات المهام الميدانية:' : 'Field Operational Scenarios:'}
                  </div>
                  {CLI_LAB_SCENARIOS.map((sc, idx) => {
                    const isSelected = sc.id === selectedLabId;
                    const isDone = completedLabs.includes(sc.id);

                    return (
                      <button
                        key={sc.id}
                        onClick={() => {
                          setSelectedLabId(sc.id);
                          setLabOutput(null);
                        }}
                        className={`w-full p-3.5 rounded-xl text-start border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-slate-800 border-slate-600 text-slate-100 shadow-md'
                            : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                          <span className="font-bold">#0{idx + 1} • {sc.categoryAr}</span>
                          {isDone ? (
                            <span className="text-emerald-400 font-bold flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              <span>{lang === 'ar' ? 'ناجح' : 'Passed'}</span>
                            </span>
                          ) : (
                            <span className="px-1.5 py-0.2 rounded bg-slate-900 text-slate-300">{sc.difficulty}</span>
                          )}
                        </div>
                        <div className="text-xs font-bold leading-snug">
                          {lang === 'ar' ? sc.titleAr : sc.titleEn}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right: Active Lab Drill & Terminal */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Scenario Info */}
                  <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300 px-2.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {activeLab.categoryAr} • {activeLab.difficulty}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        Rule: {activeLab.verificationRule}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white">
                      {lang === 'ar' ? activeLab.titleAr : activeLab.titleEn}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ar' ? activeLab.descriptionAr : activeLab.descriptionEn}
                    </p>

                    {/* Step Guidelines */}
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
                      <span className="font-bold text-slate-200">{lang === 'ar' ? 'التفسير والتحقق السيادي: ' : 'Sovereign Verification: '}</span>
                      <span>{lang === 'ar' ? activeLab.explanationAr : activeLab.explanationEn}</span>
                    </div>
                  </div>

                  {/* Terminal Canvas */}
                  <div className="bg-[#050812] border border-slate-800 rounded-2xl p-4 space-y-3 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2 text-xs text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                        </div>
                        <span className="font-mono text-slate-300 text-[11px]">root@sovereign-kernel-node: ~#</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyCommand(activeLab.command)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          {copiedCmd === activeLab.command ? (
                            <span className="text-emerald-400">{lang === 'ar' ? 'تم النسخ!' : 'Copied!'}</span>
                          ) : (
                            <span>{lang === 'ar' ? 'نسخ الأمر' : 'Copy'}</span>
                          )}
                        </button>

                        <button
                          onClick={handleRunLab}
                          disabled={runningLab}
                          className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                        >
                          <Play className="w-3 h-3 fill-slate-950" />
                          <span>{runningLab ? (lang === 'ar' ? 'جاري التنفيذ...' : 'Running...') : (lang === 'ar' ? 'تنفيذ الأمر' : 'Execute')}</span>
                        </button>
                      </div>
                    </div>

                    {/* Prompt & Command */}
                    <div className="font-mono text-xs space-y-2">
                      <div className="text-slate-300 flex items-center gap-2">
                        <span className="text-slate-500">root@sovereign-node:~#</span>
                        <span className="text-slate-100 font-bold select-all">{activeLab.command}</span>
                      </div>

                      {/* Output Window */}
                      {labOutput && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 font-mono whitespace-pre-wrap animate-fadeIn">
                          {labOutput}
                        </div>
                      )}

                      {/* Success / Rule Verification */}
                      {completedLabs.includes(activeLab.id) && (
                        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{lang === 'ar' ? `نجح التحقق السيادي: تم تطبيق الإجراء بنجاح وتأمين العقدة وفق القاعدة.` : `Sovereign Verification Passed: Rule successfully enforced.`}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PAGE 5: SOVEREIGN GLOSSARY ================= */}
          {activePage === 'GLOSSARY' && (
            <div className="space-y-6">
              {/* Header & Search */}
              <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
                      <Layers className="w-5 h-5 text-slate-300" />
                      <span>{lang === 'ar' ? 'معجم المعايير والمصطلحات السيادية (Glossary)' : 'Sovereign Cyber Standards Glossary'}</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'ar' ? 'قاموس دقيق للمصطلحات التقنية والتشريعية بالمملكة المغربية والمعايير العالمية (DGSSI, NIST, RFC)' : 'Comprehensive reference on eBPF, PQC, DGSSI regulations, and zero-trust primitives.'}
                    </p>
                  </div>
                  <span className="text-xs text-slate-300 font-mono px-3 py-1 rounded-xl bg-slate-950 border border-slate-800">
                    {filteredGlossary.length} {lang === 'ar' ? 'مصطلحاً' : 'Terms'}
                  </span>
                </div>

                {/* Filter Ribbon */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 rtl:left-auto rtl:right-3" />
                    <input
                      type="text"
                      value={glossarySearch}
                      onChange={(e) => setGlossarySearch(e.target.value)}
                      placeholder={lang === 'ar' ? 'ابحث في المعجم (eBPF, PQC, CNDP, Shannon)...' : 'Search glossary terms...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-9 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600"
                    />
                  </div>

                  <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <select
                      value={glossaryCategory}
                      onChange={(e) => setGlossaryCategory(e.target.value)}
                      className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
                    >
                      <option value="ALL" className="bg-slate-900">{lang === 'ar' ? 'جميع التصنيفات' : 'All Categories'}</option>
                      {glossaryCategories.map(cat => (
                        <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Terms Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredGlossary.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3 shadow-md">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-200 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {item.categoryAr}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {item.standard}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-black text-white flex items-center gap-2">
                        <span>{item.termEn}</span>
                        {item.acronym && (
                          <span className="text-xs px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 font-mono">
                            {item.acronym}
                          </span>
                        )}
                      </h4>
                      <h5 className="text-xs font-bold text-slate-300 mt-0.5">{item.termAr}</h5>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ar' ? item.definitionAr : item.definitionEn}
                    </p>

                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300">
                      <span className="font-bold text-slate-200">{lang === 'ar' ? 'الأهمية في السيادة الوطنية: ' : 'Sovereignty Relevance: '}</span>
                      <span>{lang === 'ar' ? item.importanceAr : item.importanceEn}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= PAGE 6: CERTIFICATE & EXAM ================= */}
          {activePage === 'CERTIFICATE' && (
            <div className="space-y-6 max-w-4xl mx-auto">
              {!examStarted && !examSubmitted ? (
                /* Exam Introduction */
                <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-950 border border-slate-700 flex items-center justify-center mx-auto shadow-inner">
                    <Award className="w-8 h-8 text-slate-200" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
                      🇲🇦 الامتحان الشامل والشهادة السيادية
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {lang === 'ar' ? 'شهادة الكفاءة والسيادة في الدفاع السيبراني' : 'National Sovereign Cyber Defense Certification'}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                      {lang === 'ar'
                        ? 'امتحان صارم مكون من 10 أسئلة متقدمة في النواة، بروتوكولات الشبكة، التشفير PQC، والقوانين الوطنية. اجتياز الامتحان بنسبة 70% يؤهلك للحصول على الشهادة الرسمية المشفرة بهاش SHA-256.'
                        : 'A 10-question advanced exam covering kernel telemetry, PQC lattice schemes, and critical infrastructure regulations. Attain 70%+ to mint your verified credential.'}
                    </p>
                  </div>

                  {/* Name Input */}
                  <div className="max-w-sm mx-auto space-y-1.5 text-start">
                    <label className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اسم المتدرب / المهندس (سيظهر على الشهادة):' : 'Candidate Name for Certificate:'}</span>
                    </label>
                    <input
                      type="text"
                      value={traineeName}
                      onChange={(e) => setTraineeName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-slate-500"
                    />
                  </div>

                  <button
                    onClick={handleStartExam}
                    className="px-8 py-3 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-black text-xs sm:text-sm cursor-pointer transition-all shadow-md inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4 fill-slate-950" />
                    <span>{lang === 'ar' ? 'بدء الامتحان الشامل الآن (10 أسئلة)' : 'Begin Certification Exam (10 Questions)'}</span>
                  </button>
                </div>
              ) : examStarted && !examSubmitted ? (
                /* Active Exam Stepper */
                <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold text-slate-200">
                      {lang === 'ar' ? `السؤال ${examCurrentIndex + 1} من أصل 10` : `Question ${examCurrentIndex + 1} of 10`}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {lang === 'ar' ? 'الدرجة المطلوبة للنجاح: 7/10' : 'Passing Threshold: 7/10'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-slate-200 transition-all duration-300"
                      style={{ width: `${((examCurrentIndex + 1) / 10) * 100}%` }}
                    ></div>
                  </div>

                  <div className="text-base font-bold text-white bg-slate-950 p-4 rounded-xl border border-slate-800">
                    {lang === 'ar' ? examQuestions[examCurrentIndex].questionAr : examQuestions[examCurrentIndex].questionEn}
                  </div>

                  {/* Options */}
                  <div className="space-y-2.5">
                    {(lang === 'ar' ? examQuestions[examCurrentIndex].optionsAr : examQuestions[examCurrentIndex].optionsEn).map((opt, optIdx) => {
                      const isChosen = examAnswers[examCurrentIndex] === optIdx;
                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            setExamAnswers(prev => ({ ...prev, [examCurrentIndex]: optIdx }));
                            soundEffects.playRadarBlip(600, 40);
                          }}
                          className={`w-full p-3.5 rounded-xl border text-start text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-between gap-3 ${
                            isChosen
                              ? 'bg-slate-800 border-slate-600 text-slate-100 font-bold'
                              : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{opt}</span>
                          <span className="w-5 h-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] font-mono shrink-0">
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Exam Navigation */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={() => setExamCurrentIndex(prev => Math.max(0, prev - 1))}
                      disabled={examCurrentIndex === 0}
                      className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      {lang === 'ar' ? 'السابق' : 'Previous'}
                    </button>

                    {examCurrentIndex < 9 ? (
                      <button
                        onClick={() => setExamCurrentIndex(prev => prev + 1)}
                        disabled={examAnswers[examCurrentIndex] === undefined}
                        className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs cursor-pointer disabled:opacity-40"
                      >
                        {lang === 'ar' ? 'التالي' : 'Next'}
                      </button>
                    ) : (
                      <button
                        onClick={handleExamSubmit}
                        disabled={Object.keys(examAnswers).length < 10}
                        className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-black text-xs cursor-pointer disabled:opacity-40 shadow-md"
                      >
                        {lang === 'ar' ? 'تسليم الامتحان واستخراج النتيجة' : 'Submit & Compute Result'}
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Exam Result and Certificate */
                <div className="space-y-6">
                  {/* Score Alert */}
                  <div className={`p-5 rounded-2xl border text-center space-y-2 ${
                    examScore >= 7
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-200'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  }`}>
                    <h4 className="text-lg font-black">
                      {examScore >= 7 
                        ? (lang === 'ar' ? '🎉 مبارك! لقد اجتزت الامتحان السيادي بنجاح' : '🎉 Outstanding! You Passed the Sovereign Exam') 
                        : (lang === 'ar' ? 'لم تبلغ درجة النجاح (7/10)' : 'Passing score not reached (7/10)')}
                    </h4>
                    <p className="text-xs sm:text-sm">
                      {lang === 'ar' ? `نتيجتك: ${examScore} من 10 (${examScore * 10}%)` : `Your Score: ${examScore} / 10 (${examScore * 10}%)`}
                    </p>
                    {examScore < 7 && (
                      <button
                        onClick={handleStartExam}
                        className="mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold cursor-pointer"
                      >
                        {lang === 'ar' ? 'إعادة المحاولة' : 'Retake Exam'}
                      </button>
                    )}
                  </div>

                  {/* Actual Minted Certificate if >= 7 */}
                  {examScore >= 7 && (
                    <div className="p-8 sm:p-12 rounded-3xl bg-[#070b14] border-2 border-slate-700 shadow-2xl relative space-y-8 print:border-black print:text-black">
                      {/* Watermark Seal */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center font-serif text-xl font-bold text-white">
                            🇲🇦
                          </div>
                          <div>
                            <div className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                              المملكة المغربية • السيادة الرقمية
                            </div>
                            <div className="text-xs font-bold text-white">
                              ROYAUME DU MAROC • SOUVERAINETÉ CYBERNÉTIQUE
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <div className="text-[10px] text-slate-400 font-mono">ID: SOV-2026-{Math.floor(Math.random() * 89999 + 10000)}</div>
                          <div className="text-[10px] text-emerald-400 font-bold">VERIFIED HASH ✓</div>
                        </div>
                      </div>

                      {/* Certificate Core Text */}
                      <div className="text-center space-y-4 my-6">
                        <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wide font-serif">
                          شهادة الكفاءة والسيادة في الدفاع السيبراني
                        </h3>
                        <p className="text-xs text-slate-400">
                          CERTIFICATE OF SOVEREIGN CYBERSECURITY MASTERY
                        </p>

                        <div className="py-2">
                          <p className="text-xs text-slate-400 mb-1">{lang === 'ar' ? 'تُمنح هذه الشهادة رسمياً إلى المهندس(ة):' : 'This credential is officially conferred upon:'}</p>
                          <div className="text-2xl sm:text-3xl font-black text-white font-serif underline decoration-slate-600 underline-offset-8">
                            {traineeName}
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed pt-2">
                          {lang === 'ar'
                            ? `تقديراً لاجتيازه(ا) بنجاح بنسبة ${examScore * 10}% لكافة محاور هندسة النواة، بروتوكولات eBPF/XDP، التشفير المقاوم للحوسبة الكمومية، والالتزام الصارم بتوجيهات المديرية العامة لأمن نظم المعلومات (DGSSI).`
                            : `In recognition of achieving ${examScore * 10}% in Linux Kernel Telemetry, eBPF XDP mitigations, Post-Quantum Cryptography, and national defense compliance.`}
                        </p>
                      </div>

                      {/* Signatures & Seal */}
                      <div className="pt-8 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-3 gap-6 items-end text-xs">
                        <div className="text-start space-y-1">
                          <div className="text-[10px] text-slate-500 font-mono">HASH: SHA-256</div>
                          <div className="text-[9px] font-mono text-slate-400 break-all">
                            e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                          </div>
                        </div>

                        <div className="text-center space-y-1">
                          <div className="w-14 h-14 rounded-full border-2 border-slate-700 bg-slate-950 mx-auto flex items-center justify-center text-xs font-bold text-slate-300">
                            SEAL
                          </div>
                          <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'الختم السيادي المعتمد' : 'Official Seal'}</div>
                        </div>

                        <div className="text-end space-y-1">
                          <div className="font-serif font-black text-white text-sm">Taha Essattiri</div>
                          <div className="text-[10px] text-slate-400">{lang === 'ar' ? 'المؤسس ورئيس الأكاديمية' : 'Founder & Lead Architect'}</div>
                        </div>
                      </div>

                      {/* Actions: Print and Retake */}
                      <div className="flex items-center justify-between pt-4 print:hidden">
                        <button
                          onClick={handleStartExam}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          {lang === 'ar' ? 'إعادة الاختبار' : 'Retake Exam'}
                        </button>

                        <button
                          onClick={() => window.print()}
                          className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-white text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>{lang === 'ar' ? 'طباعة / حفظ الشهادة (PDF)' : 'Print / Save Certificate'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
