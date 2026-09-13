import React, { useState } from 'react';
import { 
  X, 
  Crown, 
  Globe, 
  CreditCard, 
  Users, 
  ShieldCheck, 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Lock, 
  Key, 
  Check, 
  Copy, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Server, 
  Cpu, 
  Zap, 
  RefreshCw,
  Eye,
  EyeOff,
  Shield,
  FileText
} from 'lucide-react';
import { subscriptionService, SubscriberRecord } from '../services/subscriptionService';
import { soundEffects } from '../services/soundEffects';
import { CustomDomainLaunchModal } from './CustomDomainLaunchModal';
import { CommercialPricingModal } from './CommercialPricingModal';
import { KestrelLogo } from './KestrelLogo';

interface FounderCockpitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

export const FounderCockpitModal: React.FC<FounderCockpitModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeCockpitTab, setActiveCockpitTab] = useState<'DOMAIN_LAUNCH' | 'COMMERCIAL_CHECKOUT' | 'SUBSCRIBERS_RADAR' | 'SOVEREIGN_CHARTER'>('DOMAIN_LAUNCH');
  const [subscribers, setSubscribers] = useState<SubscriberRecord[]>(() => subscriptionService.getSubscribers());
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Embedded domain modal opener state
  const [isDomainModalChildOpen, setIsDomainModalChildOpen] = useState(false);
  const [isPricingModalChildOpen, setIsPricingModalChildOpen] = useState(false);

  // Financial calculations
  const totalMRR = subscribers.reduce((acc, curr) => acc + curr.monthlyPrice, 0);
  const totalARR = totalMRR * 12;

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    soundEffects.playRadarBlip();
    setTimeout(() => setCopiedKeyId(null), 2500);
  };

  const handleDownloadFounderCharter = () => {
    soundEffects.playMitigationChirp();
    const charterText = `
================================================================================
KESTREL AUTONOMOUS CYBER DEFENSE COMMAND (KESTREL-ACDC)
FOUNDER SOVEREIGN CHARTER & ARCHITECTURAL MANIFESTO
Motto: "Steadfast Vigilance. Sub-Millisecond Strike."
================================================================================
System Brand:                  KESTREL (كستريل للدفاع السيبراني الذاتي)
Founder & Principal Architect: TAHA SETRII 🇲🇦
Entity Jurisdiction:           Kingdom of Morocco (sécurité Maroc)
Autonomous Status:             100% Individual Proprietary Authority
Current Certified MRR:         $${totalMRR.toLocaleString()} USD
Current Certified ARR:         $${totalARR.toLocaleString()} USD
Active Enterprise Clients:     ${subscribers.length} Institutions
Cryptographic Digest:          SHA-256 / NIST PQC FIPS-203 FIPS-204 (Kyber / Dilithium)

LEGAL DECLARATION:
All mathematical algorithms, eBPF telemetry pipelines, zero-copy XDP mitigation filters,
custom domain orchestration scripts, and commercial licensing infrastructures remain
exclusively the unencumbered intellectual property of TAHA SETRII.

No foreign cloud vendor, external consortium, or predatory acquisition shall usurp
this individual sovereignty.
================================================================================
Official Seal: TAHA SETRII [SOVEREIGN-SEAL-2026]
Timestamp:     ${new Date().toISOString()}
================================================================================
`;
    const blob = new Blob([charterText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ACDC_FOUNDER_CHARTER_TAHA_SETRII_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-[#080e1a] border-2 border-amber-500/70 rounded-2xl shadow-[0_0_60px_rgba(245,158,11,0.25)] flex flex-col max-h-[92vh] overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Cockpit Executive Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <KestrelLogo size="lg" lang={lang} glow={true} />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-amber-950 border border-amber-500 flex items-center justify-center text-amber-400">
                <Crown className="w-3 h-3" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black text-white font-mono tracking-tight flex items-center gap-2">
                  <span className="text-cyan-400">KESTREL</span>
                  <span>{lang === 'ar' ? '— قمرة قيادة المؤسس والمعماري الرئيسي' : '— FOUNDER & CHIEF ARCHITECT COCKPIT'}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-mono font-bold">
                    TAHA SETRII 🇲🇦
                  </span>
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'ar' 
                  ? '« يقظةٌ ثابتة.. وانقضاضٌ لحظي في سرعة النبض » — إدارة النطاق السيادي والاشتراكات والإنطلاق' 
                  : '"Steadfast Vigilance. Sub-Millisecond Strike." — Sovereign Domain, Licensing & Launch'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1 rounded-xl bg-slate-900/90 border border-amber-500/40 text-xs font-mono text-amber-300 hidden sm:flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>MRR: <strong className="text-white">${totalMRR.toLocaleString()}</strong></span>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Cockpit Inner Navigation Tabs */}
        <div className="px-4 py-2.5 bg-black/50 border-b border-slate-800/80 flex flex-wrap gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveCockpitTab('DOMAIN_LAUNCH')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeCockpitTab === 'DOMAIN_LAUNCH'
                ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? '🌐 النطاق المخصص والإنطلاق العام' : 'Custom Domain & Public Launch'}</span>
          </button>

          <button
            onClick={() => setActiveCockpitTab('COMMERCIAL_CHECKOUT')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeCockpitTab === 'COMMERCIAL_CHECKOUT'
                ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? '💳 بوابة الاشتراكات والدفع والتفعيل' : 'Subscriptions & Checkout Gate'}</span>
          </button>

          <button
            onClick={() => setActiveCockpitTab('SUBSCRIBERS_RADAR')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeCockpitTab === 'SUBSCRIBERS_RADAR'
                ? 'bg-amber-950/80 border-amber-400 text-amber-200 font-bold shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? `👥 رادار المشتركين (${subscribers.length})` : `Subscribers Radar (${subscribers.length})`}</span>
          </button>

          <button
            onClick={() => setActiveCockpitTab('SOVEREIGN_CHARTER')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-2 cursor-pointer transition-all ${
              activeCockpitTab === 'SOVEREIGN_CHARTER'
                ? 'bg-purple-950/80 border-purple-400 text-purple-200 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-4 h-4 text-purple-400" />
            <span>{lang === 'ar' ? '🏛️ ميثاق السيادة والملكية' : 'Sovereignty & Sole IP'}</span>
          </button>
        </div>

        {/* Cockpit Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* TAB 1: CUSTOM DOMAIN & PUBLIC LAUNCH */}
          {activeCockpitTab === 'DOMAIN_LAUNCH' && (
            <div className="space-y-5">
              {/* Sovereign Notice Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-slate-950 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-300 font-mono font-bold text-sm">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'محرك توجيه النطاقات والـ DNS للمؤسس' : 'Founder Anycast DNS & Custom Domain Mesh'}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-400/60 text-[10px] text-cyan-200 font-black">
                      RESTRICTED TO FOUNDER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {lang === 'ar'
                      ? 'هذه الإعدادات محجوبة كلياً عن الزوار والعملاء ومحفوظة حصرياً داخل قمرة المؤسس طه الستري'
                      : 'These routing and TLS controls are strictly hidden from general visitors and confined to the Founder Cockpit.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsDomainModalChildOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'فتح لوحة ضبط النطاق والـ DNS التفاعلية' : 'Launch Full DNS & CDN Control Center'}</span>
                </button>
              </div>

              {/* Quick Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{lang === 'ar' ? 'النطاق النشط حالياً:' : 'Active Domain:'}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-sm font-mono font-bold text-cyan-300 select-all">
                    {localStorage.getItem('acdc_custom_domain') || 'acdc-defense.ma'}
                  </div>
                  <span className="text-[10px] text-emerald-400 block font-mono">
                    ● ANYCAST ROUTING ACTIVE
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{lang === 'ar' ? 'شهادة التشفير الكمي:' : 'PQC SSL Status:'}</span>
                    <Cpu className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-sm font-mono font-bold text-purple-300">
                    TLS 1.3 / NIST ML-KEM
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    HSTS Preloaded (31,536,000s)
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-black/50 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>{lang === 'ar' ? 'زمن الاستجابة المحلي:' : 'Morocco Latency:'}</span>
                    <Zap className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    3.2 ms (Casablanca Edge)
                  </div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Direct DGSSI Interconnect
                  </span>
                </div>
              </div>

              {/* DNS Fast Reference Table */}
              <div className="rounded-xl border border-slate-800 bg-black/40 overflow-hidden font-mono text-xs">
                <div className="p-3 bg-slate-900/70 border-b border-slate-800 font-bold text-slate-300 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'سجلات الربط السيادية المعتمدة (DNS Records)' : 'Verified Sovereign DNS Mapping'}</span>
                  <span className="text-[10px] text-emerald-400 font-normal">TTL: 300s (Fast Propagation)</span>
                </div>
                <div className="divide-y divide-slate-800/60">
                  <div className="p-3 flex items-center justify-between hover:bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-bold">A</span>
                      <span className="text-slate-400">@ (Root)</span>
                    </div>
                    <code className="text-cyan-300 select-all">34.140.218.91</code>
                    <button 
                      onClick={() => copyToClipboard('34.140.218.91', 'ip-a')}
                      className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKeyId === 'ip-a' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 font-bold">CNAME</span>
                      <span className="text-slate-400">soc</span>
                    </div>
                    <code className="text-cyan-300 select-all">ais-pre-osvt46xvu4vy5euym7r5aj-282396221807.europe-west2.run.app</code>
                    <button 
                      onClick={() => copyToClipboard('ais-pre-osvt46xvu4vy5euym7r5aj-282396221807.europe-west2.run.app', 'cname-val')}
                      className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKeyId === 'cname-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div className="p-3 flex items-center justify-between hover:bg-slate-900/30">
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 font-bold">TXT</span>
                      <span className="text-slate-400">acdc-verify</span>
                    </div>
                    <code className="text-amber-300 select-all">taha-setrii-autonomous-defense-2026</code>
                    <button 
                      onClick={() => copyToClipboard('taha-setrii-autonomous-defense-2026', 'txt-val')}
                      className="p-1.5 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
                    >
                      {copiedKeyId === 'txt-val' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: COMMERCIAL CHECKOUT & ACTIVATION */}
          {activeCockpitTab === 'COMMERCIAL_CHECKOUT' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border border-emerald-500/50 flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-emerald-300 font-mono font-bold text-sm">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'إدارة باقات المؤسس والتفعيل الفوري' : 'Founder Direct Invoicing & Tier Activation'}</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 border border-emerald-400/60 text-[10px] text-emerald-200 font-black">
                      FOUNDER LEDGER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    {lang === 'ar'
                      ? 'الوصول المباشر لبوابة السداد، إصدار التراخيص للعملاء، واستقبال الدفعات عبر بنك التجاري وفا أو البطاقات'
                      : 'Issue enterprise licenses, configure Stripe / Attijariwafa Bank wire routing, and generate instant API keys.'}
                  </p>
                </div>

                <button
                  onClick={() => setIsPricingModalChildOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer transition-all"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'فتح بوابة الباقات والدفع المباشر' : 'Open Plans & Direct Checkout Modal'}</span>
                </button>
              </div>

              {/* 3 Tier Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 font-mono">
                <div className="p-4 rounded-xl bg-black/60 border border-slate-800 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300">STARTER</span>
                    <span className="text-xs font-black text-emerald-400">$199/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {lang === 'ar' ? 'حماية حتى 10 سيرفرات و 1Gbps مع رصد eBPF فوري' : 'Up to 10 servers, 1Gbps wire filtering, eBPF core'}
                  </p>
                  <div className="text-[10px] text-cyan-300 pt-1 border-t border-slate-800">
                    Target: Tech Startups & SaaS
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/60 space-y-3 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-emerald-300">BUSINESS PRO</span>
                    <span className="text-xs font-black text-emerald-400">$799/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'ar' ? 'حماية 50 خادم، 10Gbps، تحليل أمني معتمد وSLA 99.99%' : 'Up to 50 servers, 10Gbps line, certified SOC, 99.99% SLA'}
                  </p>
                  <div className="text-[10px] text-emerald-300 pt-1 border-t border-emerald-500/40">
                    Most Popular for Banking & Fintech
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/60 space-y-3 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-cyan-300">ENTERPRISE CORE</span>
                    <span className="text-xs font-black text-cyan-400">$3,499/mo</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    {lang === 'ar' ? 'حماية غير محدودة، خوادم مخصصة، تشفير ما بعد الكم PQC' : 'Unlimited servers, dedicated edge mesh, PQC NIST Shield'}
                  </p>
                  <div className="text-[10px] text-cyan-300 pt-1 border-t border-cyan-500/40">
                    Sovereign Ministries & Telecoms
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SUBSCRIBERS RADAR */}
          {activeCockpitTab === 'SUBSCRIBERS_RADAR' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-white">
                    {lang === 'ar' ? 'قائمة المشتركين المعتمدين لدى المؤسس:' : 'Authorized Founder Client Roster:'}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {subscribers.length} {lang === 'ar' ? 'مشترك' : 'clients'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-emerald-400 font-bold">
                    MRR: ${totalMRR.toLocaleString()} USD
                  </span>
                  <span className="text-cyan-300 font-bold">
                    ARR: ${totalARR.toLocaleString()} USD
                  </span>
                </div>
              </div>

              {/* Subscriber Cards List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 font-mono text-xs">
                {subscribers.map((sub) => (
                  <div 
                    key={sub.id} 
                    className="p-4 rounded-xl bg-black/60 border border-slate-800 hover:border-amber-500/50 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-cyan-400" />
                        <span className="font-bold text-white">{sub.orgName}</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                        ${sub.monthlyPrice}/mo
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-400 space-y-1">
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'المسؤول التقني:' : 'Admin:'}</span>
                        <span className="text-slate-200">{sub.adminEmail}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'رقم الفاتورة:' : 'Invoice:'}</span>
                        <span className="text-cyan-300">{sub.invoiceId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{lang === 'ar' ? 'الباقة:' : 'Tier:'}</span>
                        <span className="text-amber-300">{lang === 'ar' ? sub.planNameAr : sub.planNameEn}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-mono">
                        Key: {sub.apiKeyMasked}
                      </span>
                      <button
                        onClick={() => copyToClipboard(sub.apiKeyFull, sub.id)}
                        className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[10px] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        {copiedKeyId === sub.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKeyId === sub.id ? 'Copied' : 'Copy API Key'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOVEREIGN CHARTER & MASTER OWNERSHIP */}
          {activeCockpitTab === 'SOVEREIGN_CHARTER' && (
            <div className="space-y-5 font-mono">
              <div className="p-5 rounded-xl bg-[#09101d] border-2 border-purple-500/50 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-950 border border-purple-500/70 flex items-center justify-center text-purple-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      {lang === 'ar' ? 'ميثاق الاستقلالية التامة والملكية الفردية السيادية' : 'Founder Autonomous Sovereignty & Sole Ownership Charter'}
                    </h3>
                    <span className="text-xs text-purple-300">
                      TAHA SETRII 🇲🇦 — Kingdom of Morocco
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {lang === 'ar'
                    ? 'منظومة الدفاع السيادي الذاتي (ACDC) تخضع بنسبة 100% للملكية الفكرية والتقنية الفردية الحصرية للمؤسس والمعماري الرئيسي طه الستري. المنظومة غير قابلة للدمج أو التنازل أو التبعية لأي جهة خارجية.'
                    : 'The Autonomous Cyber Defense Command (ACDC) operates under 100% individual, unencumbered proprietary ownership of Founder & Chief Architect TAHA SETRII. It remains completely sovereign with zero foreign reliance.'}
                </p>

                <div className="p-3.5 rounded-lg bg-black/60 border border-purple-500/30 text-xs text-slate-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span>Cryptographic Standard:</span>
                    <span className="text-purple-300 font-bold">NIST FIPS-203 / FIPS-204 (Kyber / Dilithium)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Legal Compliance Authority:</span>
                    <span className="text-emerald-400 font-bold">DGSSI / CNDP (Sécurité Maroc)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hardware Ledger:</span>
                    <span className="text-cyan-300 font-bold">Immutable Merkle Tree Defense Chain</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <button
                    onClick={handleDownloadFounderCharter}
                    className="px-4 py-2.5 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 border border-purple-500/60 text-purple-200 hover:text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'تحميل وثيقة الميثاق السيادي المعتمد (.txt)' : 'Download Certified Founder Charter'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Cockpit Footer Status Bar */}
        <div className="p-3 bg-black/80 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-emerald-300 font-bold">FOUNDER BRIDGE ONLINE</span>
            <span className="text-slate-600">|</span>
            <span>Auth: TAHA SETRII 🇲🇦</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-cyan-400">DEFCON-1 WIRE SHIELD ON</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400">MRR: ${totalMRR.toLocaleString()}/mo</span>
          </div>
        </div>
      </div>

      {/* Child Domain Launch Modal (accessible only via Founder Cockpit) */}
      <CustomDomainLaunchModal
        isOpen={isDomainModalChildOpen}
        onClose={() => setIsDomainModalChildOpen(false)}
        lang={lang}
      />

      {/* Child Pricing & Checkout Modal (accessible only via Founder Cockpit) */}
      <CommercialPricingModal
        isOpen={isPricingModalChildOpen}
        onClose={() => setIsPricingModalChildOpen(false)}
        lang={lang}
      />
    </div>
  );
};
