import React, { useState, useMemo } from 'react';
import { 
  CreditCard, 
  Check, 
  CheckCircle2, 
  Zap, 
  Shield, 
  ShieldAlert, 
  Building2, 
  Server, 
  Key, 
  Copy, 
  Sparkles, 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Award, 
  Lock, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw, 
  Sliders, 
  Globe, 
  Percent,
  FileText,
  ShieldCheck,
  Download,
  Phone,
  MessageCircle
} from 'lucide-react';
import { SubscriptionCheckoutModal, PlanData } from './SubscriptionCheckoutModal';

interface CommercialPlansViewProps {
  lang: 'ar' | 'en';
  onSelectPlanModal?: () => void;
  onOpenLiveBridge?: () => void;
}

export const CommercialPlansView: React.FC<CommercialPlansViewProps> = ({ 
  lang, 
  onSelectPlanModal,
  onOpenLiveBridge 
}) => {
  // Billing cycle toggle
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  
  // Interactive MSSP Revenue Calculator state
  const [clientCount, setClientCount] = useState<number>(8);
  const [avgClientFee, setAvgClientFee] = useState<number>(899);

  // Active verified subscription state
  const [activeSubscription, setActiveSubscription] = useState<{
    planId: string;
    orgName: string;
    email: string;
    invoiceId: string;
    activeSince: number;
    billingCycle: 'monthly' | 'annual';
  }>(() => {
    try {
      const saved = localStorage.getItem('acdc_verified_subscription');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      planId: 'BUSINESS_PRO',
      orgName: 'Banque d\'Affaires / Cloud Enterprise Node',
      email: 'sec-admin@enterprise-grid.ma',
      invoiceId: 'INV-2026-849102',
      activeSince: Date.now() - 14 * 86400000,
      billingCycle: 'annual'
    };
  });

  // Modal checkout state
  const [checkoutModalOpen, setCheckoutModalOpen] = useState<boolean>(false);
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<PlanData | null>(null);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 4000);
  };

  const handleOpenCheckout = (plan: typeof plans[0]) => {
    setSelectedPlanForCheckout({
      id: plan.id,
      nameAr: plan.nameAr,
      nameEn: plan.nameEn,
      priceMonthly: plan.priceMonthly,
      priceAnnualMonthly: plan.priceAnnualMonthly,
      badgeAr: plan.badgeAr,
      badgeEn: plan.badgeEn,
      color: plan.color
    });
    setCheckoutModalOpen(true);
  };

  const handleSubscriptionSuccess = (data: {
    planId: string;
    orgName: string;
    email: string;
    apiKey: string;
    invoiceId: string;
  }) => {
    const updated = {
      planId: data.planId,
      orgName: data.orgName,
      email: data.email,
      invoiceId: data.invoiceId,
      activeSince: Date.now(),
      billingCycle
    };
    setActiveSubscription(updated);
    try {
      localStorage.setItem('acdc_verified_subscription', JSON.stringify(updated));
      localStorage.setItem('acdc_commercial_sub', JSON.stringify({ planId: data.planId, timestamp: Date.now() }));
    } catch {}
    showNotification(
      lang === 'ar' 
        ? `تم توثيق اشتراك [${data.orgName}] وتأكيد الترخيص بنجاح! تم إرسال المفتاح المشفر إلى ${data.email}` 
        : `Subscription confirmed for [${data.orgName}]! Encrypted key dispatched to ${data.email}`
    );
  };

  const handleDownloadActiveCert = () => {
    const cert = {
      platform: "Sécurité Maroc - Autonomous Cyber Defense Grid",
      licenseId: activeSubscription.invoiceId,
      plan: activeSubscription.planId,
      organization: activeSubscription.orgName,
      authorizedContact: activeSubscription.email,
      billingCycle: activeSubscription.billingCycle,
      complianceStatus: "DGSSI (Sécurité Maroc) & NIST CSF 2.0 Compliant",
      keyProtection: "AES-256 HSM Cryptographic Isolation - Kept in Vault",
      signature: "VALID_CRYPTOGRAPHIC_SEAL"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securite_maroc_license_${activeSubscription.invoiceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Calculator calculations
  const monthlyRevenue = useMemo(() => clientCount * avgClientFee, [clientCount, avgClientFee]);
  const annualRevenue = useMemo(() => monthlyRevenue * 12, [monthlyRevenue]);
  const estimatedNetProfit = useMemo(() => Math.round(annualRevenue * 0.88), [annualRevenue]);

  const plans = [
    {
      id: 'STARTER',
      nameAr: 'حزمة البداية للمطورين',
      nameEn: 'Starter Node Shield',
      taglineAr: 'حماية أساسية فائقة السرعة للمشاريع الصاعدة وخوادم الويب',
      taglineEn: 'High-speed autonomous baseline defense for modern web servers',
      priceMonthly: 199,
      priceAnnualMonthly: 159,
      badgeAr: 'للمشاريع الصاعدة',
      badgeEn: 'STARTUPS',
      color: 'cyan',
      borderColor: 'border-cyan-500/40',
      accentBg: 'bg-cyan-500/10',
      featuresAr: [
        'حماية حتى 3 خوادم لينكس/سحابية نشطة',
        'فحص حتى 10 مليون حزمة شبكية شهرياً',
        'استجابة واحتواء الشذوذ في أقل من 300ms',
        'محرك إنتروبيا شانون التلقائي لكشف التشفير',
        'تنبيهات فورية عبر Webhooks و Telegram',
        'تحديث قواعد جدار الحماية iptables آلياً'
      ],
      featuresEn: [
        'Protect up to 3 live Linux / Cloud nodes',
        'Ingest & inspect up to 10M packets/month',
        'Sub-300ms autonomous threat containment',
        'Shannon Entropy engine for covert channel detection',
        'Instant alerts via Webhooks & Telegram',
        'Automated iptables firewall rule generation'
      ]
    },
    {
      id: 'BUSINESS_PRO',
      nameAr: 'درع الشركات المتقدم (SOC)',
      nameEn: 'Business Pro Enterprise SOC',
      taglineAr: 'منظومة دفاع متكاملة للمصارف والمتاجر والشركات المتوسطة',
      taglineEn: 'Complete autonomous defense grid for fintech, e-com & enterprises',
      priceMonthly: 899,
      priceAnnualMonthly: 719,
      badgeAr: 'الأكثر اختياراً وطلباً 🔥',
      badgeEn: 'MOST POPULAR 🔥',
      popular: true,
      color: 'emerald',
      borderColor: 'border-emerald-500',
      accentBg: 'bg-emerald-500/15',
      featuresAr: [
        'حماية حتى 25 خادماً مع توزيع جغرافي متعدد',
        'فحص حزم غير محدود عبر خط أنابيب eBPF/XDP',
        'كشف الشذوذ الإحصائي بمسافة ماهالانوبيس (Zero-Day)',
        'سلسلة تدقيق ميركل المشفرة (Tamper-Proof Audit)',
        'تدفق بيانات لحظي عبر بروتوكول SSE فائق الدقة',
        'أرشفة جنائية كاملة وتصدير تقارير تنفيذية PDF/JSON',
        'مفاتيح API إنتاجية متعددة مع ضوابط صلاحيات دقيقة',
        'دعم تقني أولوي مخصص على مدار 24/7'
      ],
      featuresEn: [
        'Protect up to 25 nodes with multi-region cluster',
        'Unlimited packet telemetry via eBPF/XDP pipeline',
        'Mahalanobis multivariate statistical anomaly detection',
        'Cryptographic Merkle block audit ledger (Tamper-Proof)',
        'Wire-speed real-time SSE telemetry stream',
        'Forensic PCAP export & Executive Reports (PDF/JSON)',
        'Multiple production API keys with RBAC scoping',
        'Priority 24/7 enterprise technical support'
      ]
    },
    {
      id: 'ENTERPRISE_CORE',
      nameAr: 'النواة السيادية لمراكز البيانات',
      nameEn: 'Sovereign Data-Center Core',
      taglineAr: 'حماية البنى التحتية الحرجة، المنشآت الحيوية والبيئات المعزولة',
      taglineEn: 'Mission-critical defense for banks, data centers & government mesh',
      priceMonthly: 3499,
      priceAnnualMonthly: 2799,
      badgeAr: 'بنية سيادية TIER-4',
      badgeEn: 'SOVEREIGN TIER-4',
      color: 'amber',
      borderColor: 'border-amber-500/60',
      accentBg: 'bg-amber-500/10',
      featuresAr: [
        'خوادم غير محدودة وبنية تحتية موزعة بالكامل',
        'دعم كامل لنشر بيئات الجزر المعزولة (Air-Gapped)',
        'تشفير عتادي متوافق مع وحدات HSM FIPS 140-3',
        'مطابقة تلقائية لمعايير DGSSI / DNSSI و NIST CSF 2.0',
        'مفتاح أمان مخصص (Dead-Man Switch) لعزل الكوارث',
        'ضمان استمرارية الخدمة بنسبة 99.999% SLA موثق',
        'مهندس أمني ومستشار دفاع سيبراني سيادي مخصص',
        'نشر محلي On-Premises مع تدريب كامل للفريق'
      ],
      featuresEn: [
        'Unlimited nodes with full distributed cluster support',
        'Full support for Air-Gapped isolated deployments',
        'Hardware-sealed cryptography with HSM FIPS 140-3',
        'Native compliance with DGSSI/DNSSI & NIST CSF 2.0',
        'Dedicated Dead-Man Switch hardware override',
        '99.999% uptime SLA contractually guaranteed',
        'Dedicated sovereign cyber-defense engineer',
        'On-Premises deployment & comprehensive staff onboarding'
      ]
    },
    {
      id: 'MSSP_PARTNER',
      nameAr: 'شريك خدمات الأمان (MSSP White-Label)',
      nameEn: 'MSSP White-Label Partner',
      taglineAr: 'أعد بيع الخدمة لعملائك بعلامتك التجارية وحقق أرباحاً شهرية متكررة',
      taglineEn: 'Resell cybersecurity as a service under your brand & earn recurring MRR',
      priceMonthly: 6999,
      priceAnnualMonthly: 5599,
      badgeAr: 'أعلى عائد استثماري 💰',
      badgeEn: 'MAX REVENUE 💰',
      color: 'purple',
      borderColor: 'border-purple-500/60',
      accentBg: 'bg-purple-500/10',
      featuresAr: [
        'إعادة تسمية المنظومة بالكامل بعلامتك التجارية (White-Label)',
        'لوحة تحكم مركزية متعددة المستأجرين (Multi-Tenant SOC)',
        'أرباح متكررة 100% لك دون تقاسم رسوم الاشتراك مع أحد',
        'توليد تراخيص غير محدودة لعملائك وإدارتهم بسهولة',
        'تكامل كامل للـ API و SDK مخصص للفوترة السحابية',
        'أدوات تسويقية وعقود نموذجية قانونية جاهزة للاستخدام',
        'دعم مباشر على مدار الساعة للشركاء وكبار العملاء'
      ],
      featuresEn: [
        '100% White-Label: customized with your brand & domain',
        'Multi-Tenant centralized SOC management dashboard',
        'Keep 100% of your customer subscription revenue (MRR)',
        'Generate unlimited client licenses & automated provisioning',
        'Full REST API & SDK access for automated billing/metering',
        'Turnkey legal contracts, SLA templates & marketing kit',
        'Direct 24/7 priority escalation for partner networks'
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fadeIn pb-12 font-sans" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1324] via-[#09101e] to-[#060a12] border border-emerald-500/40 p-6 sm:p-10 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold mb-4 shadow-[0_0_15px_rgba(16,185,129,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-spin-slow" />
            <span>{lang === 'ar' ? 'نموذج الأعمال والاشتراكات الشهرية B2B SaaS' : 'Independent B2B SaaS Monetization & Subscriptions'}</span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-900 text-emerald-200 text-[10px]">RECURRING REVENUE</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight font-sans leading-tight">
            {lang === 'ar' ? (
              <>
                الباقات التجارية وتراخيص الحماية الشهرية <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">للشركات والمصارف</span>
              </>
            ) : (
              <>
                Commercial Licensing & Monthly Subscriptions for <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Enterprises & Cloud Fleets</span>
              </>
            )}
          </h1>

          <p className="mt-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
            {lang === 'ar'
              ? 'تتيح هذه المنظومة بيع خدمات الدفاع السيبراني الذاتي المستقل باشتراكات دورية (MRR) للمصارف والشركات السحابية ومراكز البيانات. توفر المنظومة حماية لحظية في مستوى النواة مع عقود مستوى خدمة (SLA) ملزمة وأرباح تجارية مرتفعة.'
              : 'Empower your cybersecurity business with recurring B2B subscription revenue (MRR). Provide enterprise-grade kernel-level defense, automated anomaly mitigation, and cryptographic audit ledgers to global cloud fleets.'}
          </p>

          {/* Quick Stats Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'متوسط هامش الربح' : 'Gross Margin'}</span>
              <span className="text-lg font-bold text-emerald-400 flex items-center gap-1 mt-0.5">
                <Percent className="w-4 h-4" /> 88% - 92%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'توفير تكلفة الاختراق' : 'Avg Breach Saved'}</span>
              <span className="text-lg font-bold text-cyan-400 flex items-center gap-1 mt-0.5">
                <DollarSign className="w-4 h-4" /> $4.45M
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'سرعة التحييد الذاتي' : 'Mitigation Speed'}</span>
              <span className="text-lg font-bold text-amber-400 flex items-center gap-1 mt-0.5">
                <Zap className="w-4 h-4" /> &lt; 300 ms
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800">
              <span className="text-slate-400 block text-[11px]">{lang === 'ar' ? 'نوع التراخيص' : 'License Type'}</span>
              <span className="text-lg font-bold text-purple-400 flex items-center gap-1 mt-0.5">
                <Shield className="w-4 h-4" /> B2B Proprietary
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Direct WhatsApp & Phone Contact Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950/90 via-[#071322] to-teal-950/90 border-2 border-emerald-500/50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
            <MessageCircle className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm sm:text-base font-black text-white font-mono">
                {lang === 'ar' ? 'تواصل فوري للاشتراك وتفعيل التراخيص عبر واتساب أو الهاتف:' : 'Instant B2B Onboarding via WhatsApp & Phone:'}
              </h4>
              <span className="px-2 py-0.5 rounded bg-emerald-900 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                24/7 DIRECT LINE
              </span>
            </div>
            <p className="text-xs text-slate-300 font-mono mt-0.5">
              {lang === 'ar' 
                ? 'فريق المبيعات والاشتراكات متاح للمؤسسات والمصارف والشركات السحابية' 
                : 'Direct support & custom enterprise contracts for financial & cloud institutions'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <a
            href="https://wa.me/212634424914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1%20%D9%88%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%A7%D9%82%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D9%86%D8%B8%D9%88%D9%85%D8%A9%20%D8%A7%D9%84%D8%B3%D9%8A%D8%A7%D8%AF%D9%8A%D8%A9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'ar' ? 'واتساب: +212 634 424 914' : 'WhatsApp (+212 634 424 914)'}</span>
          </a>

          <a
            href="tel:+212634424914"
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-emerald-300 hover:text-white border border-emerald-500/50 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
          >
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'اتصال: 0634424914' : 'Call: +212 634 424 914'}</span>
          </a>
        </div>
      </div>

      {/* Floating Notification */}
      {notification && (
        <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-200 text-sm font-mono flex items-center gap-3 shadow-[0_0_25px_rgba(16,185,129,0.3)] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Billing Cycle Switcher */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'دورة الفوترة والتسعير' : 'Billing Cycle & Volume Discounts'}
            </h3>
            <p className="text-xs text-slate-400">
              {lang === 'ar' ? 'اختر الخطة السنوية للحصول على خصم 20% إضافي' : 'Select annual commitment for 20% upfront discount'}
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-700">
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              billingCycle === 'monthly'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {lang === 'ar' ? 'دفع شهري (Monthly)' : 'Monthly Billing'}
          </button>
          <button
            onClick={() => setBillingCycle('annual')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              billingCycle === 'annual'
                ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>{lang === 'ar' ? 'دفع سنوي (Annual)' : 'Annual Billing'}</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-400/40">
              {lang === 'ar' ? 'وفر 20%' : 'SAVE 20%'}
            </span>
          </button>
        </div>
      </div>

      {/* 4 Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isSelected = activeSubscription.planId === plan.id;
          const displayPrice = billingCycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl bg-[#080d18] border-2 transition-all flex flex-col justify-between relative overflow-hidden group ${
                plan.popular 
                  ? 'border-emerald-500 shadow-[0_0_35px_rgba(16,185,129,0.25)] scale-[1.02] z-10' 
                  : `${plan.borderColor} hover:border-slate-500`
              }`}
            >
              {/* Popular Glowing Ribbon */}
              {plan.popular && (
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 text-[11px] font-mono font-black text-center py-1.5 tracking-wider uppercase shadow-md">
                  {lang === 'ar' ? plan.badgeAr : plan.badgeEn}
                </div>
              )}

              <div className="p-6">
                {/* Plan Header */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                    plan.color === 'cyan' ? 'bg-cyan-950 text-cyan-300 border-cyan-700/50' :
                    plan.color === 'emerald' ? 'bg-emerald-950 text-emerald-300 border-emerald-700/50' :
                    plan.color === 'amber' ? 'bg-amber-950 text-amber-300 border-amber-700/50' :
                    'bg-purple-950 text-purple-300 border-purple-700/50'
                  }`}>
                    {lang === 'ar' ? plan.badgeAr : plan.badgeEn}
                  </span>

                  {isSelected && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 text-[10px] font-mono font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> {lang === 'ar' ? 'الترخيص النشط' : 'CURRENT'}
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-white tracking-wide">
                  {lang === 'ar' ? plan.nameAr : plan.nameEn}
                </h3>
                <p className="text-xs text-slate-400 mt-1 min-h-[34px] leading-relaxed">
                  {lang === 'ar' ? plan.taglineAr : plan.taglineEn}
                </p>

                {/* Price Display */}
                <div className="mt-5 mb-6 pb-5 border-b border-slate-800">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                      ${displayPrice}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {lang === 'ar' ? '/ شهر' : '/ month'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono block mt-1">
                    {billingCycle === 'annual'
                      ? (lang === 'ar' ? `يُدفع سنوياً ($${displayPrice * 12})` : `Billed annually ($${displayPrice * 12}/yr)`)
                      : (lang === 'ar' ? 'يُدفع شهرياً بدون التزام' : 'Billed monthly, cancel anytime')}
                  </span>
                </div>

                {/* Feature List */}
                <div className="space-y-2.5 text-xs text-slate-300">
                  <span className="font-mono text-[11px] text-slate-400 font-bold block mb-2">
                    {lang === 'ar' ? 'المزايا والقدرات التشغيلية:' : 'Included Capabilities:'}
                  </span>
                  {(lang === 'ar' ? plan.featuresAr : plan.featuresEn).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.color === 'emerald' ? 'text-emerald-400' :
                        plan.color === 'cyan' ? 'text-cyan-400' :
                        plan.color === 'amber' ? 'text-amber-400' : 'text-purple-400'
                      }`} />
                      <span className="leading-tight">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0 space-y-2">
                <button
                  onClick={() => handleOpenCheckout(plan)}
                  className={`w-full py-3 px-4 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500 hover:bg-emerald-500/30'
                      : plan.popular
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'الترخيص قيد التشغيل (Active)' : 'Active Subscription'}</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>{lang === 'ar' ? `طلب اشتراك وتفعيل ${plan.nameAr}` : `Subscribe to ${plan.nameEn}`}</span>
                    </>
                  )}
                </button>

                {/* Direct WhatsApp & Call for specific plan */}
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/212634424914?text=${encodeURIComponent(lang === 'ar' ? `السلام عليكم، أرغب في الاشتراك في باقة ${plan.nameAr} (${displayPrice}$/شهرياً) عبر المنظومة السيادية.` : `Hello, I want to subscribe to ${plan.nameEn} ($${displayPrice}/mo).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2 px-2.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'طلب عبر واتساب' : 'WhatsApp'}</span>
                  </a>
                  <a
                    href="tel:+212634424914"
                    className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-mono text-slate-300 hover:text-white flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    title={lang === 'ar' ? 'اتصال هاتفي مباشر' : 'Direct Call'}
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="hidden sm:inline">{lang === 'ar' ? 'اتصال' : 'Call'}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secure Subscription & Protected Licensing Vault Center */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-950 via-[#0a1424] to-slate-950 border border-emerald-500/40 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white font-mono">
                {lang === 'ar' ? 'مركز إدارة الاشتراكات وتراخيص Sécurité Maroc' : 'Sécurité Maroc Subscriptions & Licensing Vault'}
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-bold">
                VAULT SECURED
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {lang === 'ar'
                ? `الترخيص الحالي مسجل للمؤسسة: [${activeSubscription.orgName}] ومربوط بالبريد التقني: [${activeSubscription.email}]. مفاتيح الإنتاج (API Keys) مشفرة ومحمية بالكامل ولا تُعرض في الواجهات العامة لضمان أمان النظام.`
                : `Active license provisioned for: [${activeSubscription.orgName}] (Admin: ${activeSubscription.email}). API keys are cryptographically guarded in server vault and never exposed publicly.`}
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{lang === 'ar' ? 'حالة المفتاح: مشفر في النواة (AES-256 Vault)' : 'Key Status: Secured in AES-256 Vault'}</span>
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{activeSubscription.invoiceId}</span>
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
            <button
              onClick={handleDownloadActiveCert}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'تحميل وثيقة الترخيص (JSON)' : 'Download License Certificate'}</span>
            </button>

            {onOpenLiveBridge && (
              <button
                onClick={onOpenLiveBridge}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
              >
                <Server className="w-4 h-4" />
                <span>{lang === 'ar' ? 'ربط خادم بالـ API' : 'Connect Server via API'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive MSSP Profitability & Revenue Calculator */}
      <div className="p-6 sm:p-10 rounded-2xl bg-[#090e1a] border border-cyan-500/40 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white font-sans">
              {lang === 'ar' ? 'حاسبة أرباح بيع الخدمة (MSSP Recurring Revenue Calculator)' : 'Managed Security Provider (MSSP) Revenue Calculator'}
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {lang === 'ar' 
                ? 'شاهد كم يمكنك أن تجني شهرياً وسنوياً عند إعادة بيع هذه المنظومة كخدمة سحابية (SaaS) لعملائك' 
                : 'Calculate your monthly and annual recurring income if you resell this autonomous platform to enterprise clients'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Slider 1: Number of Clients */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  {lang === 'ar' ? 'عدد الشركات / العملاء المشتركين لديك:' : 'Protected Enterprise Clients:'}
                </label>
                <span className="text-sm font-bold text-cyan-400 font-mono px-2.5 py-0.5 rounded bg-cyan-950 border border-cyan-700/50">
                  {clientCount} {lang === 'ar' ? 'عميل' : 'Clients'}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={50}
                step={1}
                value={clientCount}
                onChange={(e) => setClientCount(parseInt(e.target.value, 10))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>1 عميل</span>
                <span>25 عميل</span>
                <span>50 عميل</span>
              </div>
            </div>

            {/* Slider 2: Monthly Fee Charged per Client */}
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-mono font-bold text-slate-300">
                  {lang === 'ar' ? 'قيمة الاشتراك الشهري للعميل الواحد:' : 'Monthly Retainer per Client:'}
                </label>
                <span className="text-sm font-bold text-emerald-400 font-mono px-2.5 py-0.5 rounded bg-emerald-950 border border-emerald-700/50">
                  ${avgClientFee.toLocaleString()} / mo
                </span>
              </div>
              <input
                type="range"
                min={200}
                max={3000}
                step={50}
                value={avgClientFee}
                onChange={(e) => setAvgClientFee(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>$200 (Starter)</span>
                <span>$899 (Business)</span>
                <span>$3,000 (VIP Core)</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              💡 {lang === 'ar' 
                ? 'تكاليف تشغيل المنظومة منخفضة للغاية لأنها تعتمد على خوارزميات رياضية نواتية eBPF تعمل دون استهلاك عتادي ضخم، مما يجعل هامش الربح يتجاوز 85%.' 
                : 'Operational overhead is remarkably low due to kernel-level eBPF & deterministic mathematical models, ensuring profit margins exceed 85%.'}
            </p>
          </div>

          {/* Revenue Output Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* MRR Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#0c1a2e] to-[#08101e] border border-cyan-500/50 shadow-lg text-start">
              <span className="text-xs text-slate-400 font-mono block">
                {lang === 'ar' ? 'الدخل الشهري المتكرر (MRR)' : 'Monthly Recurring Revenue (MRR)'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 font-mono mt-2 flex items-center">
                ${monthlyRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-cyan-200/80 font-mono mt-1 block">
                {lang === 'ar' ? `يدخل حسابك كل شهر من ${clientCount} عميل` : `Recurring every month from ${clientCount} accounts`}
              </span>
            </div>

            {/* ARR Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-[#081f18] to-[#051410] border border-emerald-500/50 shadow-lg text-start">
              <span className="text-xs text-slate-400 font-mono block">
                {lang === 'ar' ? 'الدخل السنوي المتكرر (ARR)' : 'Annual Run Rate (ARR)'}
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono mt-2 flex items-center">
                ${annualRevenue.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-200/80 font-mono mt-1 block">
                {lang === 'ar' ? 'إجمالي الإيرادات السنوية المتوقعة' : 'Projected gross annual billings'}
              </span>
            </div>

            {/* Net Estimated Profit */}
            <div className="sm:col-span-2 p-5 rounded-2xl bg-gradient-to-r from-purple-950/60 to-slate-900 border border-purple-500/40 flex items-center justify-between gap-4">
              <div>
                <span className="text-xs text-purple-300 font-mono font-bold block">
                  {lang === 'ar' ? 'صافي الربح السنوي التقديري (Net Profit ~88% Margin):' : 'Estimated Net Annual Profit (~88% Margin):'}
                </span>
                <span className="text-2xl sm:text-3xl font-black text-white font-mono mt-1 block">
                  ${estimatedNetProfit.toLocaleString()} / سنة
                </span>
              </div>
              <TrendingUp className="w-10 h-10 text-emerald-400 shrink-0" />
            </div>

          </div>
        </div>
      </div>

      {/* Comprehensive Feature Comparison Matrix */}
      <div className="rounded-2xl bg-[#080d18] border border-slate-800 p-6 overflow-x-auto">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <span>{lang === 'ar' ? 'مقارنة الميزات الفنية بين الباقات الأربعة' : 'Comprehensive Feature Comparison Matrix'}</span>
        </h3>

        <table className="w-full text-xs text-start border-collapse min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-mono">
              <th className="py-3 px-4 text-start font-bold">{lang === 'ar' ? 'الميزة / القدرة الدفاعية' : 'Feature / Capability'}</th>
              <th className="py-3 px-4 text-center">Starter ($199)</th>
              <th className="py-3 px-4 text-center text-emerald-400 font-bold">Business Pro ($899)</th>
              <th className="py-3 px-4 text-center text-amber-400">Enterprise ($3,499)</th>
              <th className="py-3 px-4 text-center text-purple-400">MSSP ($6,999)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono">
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'عدد الخوادم المدعومة' : 'Supported Servers'}</td>
              <td className="py-3 px-4 text-center text-slate-300">3 Nodes</td>
              <td className="py-3 px-4 text-center text-emerald-300 font-bold">25 Nodes</td>
              <td className="py-3 px-4 text-center text-amber-300 font-bold">غير محدود (Unlimited)</td>
              <td className="py-3 px-4 text-center text-purple-300 font-bold">غير محدود (Multi-Tenant)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'زمن الاستجابة والعزل في النواة' : 'Kernel Mitigation Speed'}</td>
              <td className="py-3 px-4 text-center text-slate-300">&lt; 300ms</td>
              <td className="py-3 px-4 text-center text-emerald-300 font-bold">&lt; 150ms</td>
              <td className="py-3 px-4 text-center text-amber-300 font-bold">&lt; 15ms (Wire-Speed)</td>
              <td className="py-3 px-4 text-center text-purple-300 font-bold">&lt; 15ms (Wire-Speed)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'إنتروبيا شانون ومسافة ماهالانوبيس' : 'Entropy & Mahalanobis Math'}</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'سلسلة تدقيق ميركل المشفرة (SHA-256)' : 'Cryptographic Merkle Audit'}</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
              <td className="py-3 px-4 text-center text-emerald-400">✓</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'دعم البيئات المعزولة (Air-Gapped)' : 'Air-Gapped Island Support'}</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-amber-400 font-bold">✓ (Full Hardware)</td>
              <td className="py-3 px-4 text-center text-purple-400 font-bold">✓ (Full Hardware)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'إعادة التسمية بالعلامة التجارية الخاصة (White-Label)' : 'White-Label Branding'}</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-slate-600">—</td>
              <td className="py-3 px-4 text-center text-purple-400 font-bold">✓ (100% White-Label)</td>
            </tr>
            <tr>
              <td className="py-3 px-4 text-white font-sans font-medium">{lang === 'ar' ? 'اتفاقية مستوى الخدمة والدعم الفني' : 'SLA & Technical Support'}</td>
              <td className="py-3 px-4 text-center text-slate-400">Email (48h)</td>
              <td className="py-3 px-4 text-center text-emerald-300">24/7 Priority</td>
              <td className="py-3 px-4 text-center text-amber-300 font-bold">99.999% SLA + المهندس</td>
              <td className="py-3 px-4 text-center text-purple-300 font-bold">VIP Dedicated Desk</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* FAQ: Business & Monetization */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'كيف تبيع هذه الخدمة وتحصل أموال الاشتراكات؟' : 'How do you collect subscription payments?'}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ar' 
              ? 'يمكنك ربط المنظومة ببوابات دفع مثل Stripe أو Lemon Squeezy، أو إصدار فواتير شهرية مباشرة (B2B Wire Invoicing) مع إعطاء العميل مفتاح API مشفر ينتهي بنهاية فترة الاشتراك.' 
              : 'Integrate via Stripe / Lemon Squeezy or issue direct B2B corporate bank invoices. Each client receives a cryptographically provisioned API key linked to their active billing term.'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-slate-900/60 border border-slate-800">
          <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
            <HelpCircle className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'لماذا تدفع الشركات مبالغ مرتفعة في هذا المجال؟' : 'Why do enterprises pay high retainers for cybersecurity?'}</span>
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {lang === 'ar'
              ? 'لأن تكلفة اختراق واحد أو تسريب بيانات قد تكلف الشركة ملايين الدولارات وغرامات امتثال قانونية. دفع $899 أو $3,500 شهرياً لحماية خوادمهم يعتبر استثماراً ضرورياً وموفراً للغاية.'
              : 'A single breach costs an average of $4.45M plus regulatory penalties. Paying $899 or $3,500/month for automated, kernel-level zero-day defense is viewed as an essential insurance policy.'}
          </p>
        </div>
      </div>

      {/* Subscription & Secure Licensing Checkout Modal */}
      <SubscriptionCheckoutModal
        isOpen={checkoutModalOpen}
        onClose={() => setCheckoutModalOpen(false)}
        plan={selectedPlanForCheckout}
        billingCycle={billingCycle}
        lang={lang}
        onSuccess={handleSubscriptionSuccess}
        onOpenLiveBridge={onOpenLiveBridge}
      />

    </div>
  );
};
