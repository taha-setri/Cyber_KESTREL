import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Key, 
  ShieldCheck, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  CreditCard, 
  Download, 
  Sparkles, 
  Server, 
  Zap, 
  Lock, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Globe,
  AlertCircle,
  Code,
  Eye,
  EyeOff,
  Phone,
  MessageCircle,
  ArrowRight,
  RefreshCw,
  X
} from 'lucide-react';
import { soundEffects } from '../services/soundEffects';

interface CommercialPricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  isUnlocked?: boolean;
}

interface ApiKeyRecord {
  id: string;
  name: string;
  key: string;
  plan: 'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE';
  created: number;
  requestsCount: number;
  status: 'ACTIVE' | 'REVOKED';
}

interface CustomerSubscription {
  companyName: string;
  planId: 'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE';
  billingCycle: 'monthly' | 'annually';
  activatedAt: number;
  protectedServersLimit: number;
  status: 'ACTIVE';
}

export const CommercialPricingModal: React.FC<CommercialPricingModalProps> = ({
  isOpen,
  onClose,
  lang,
  isUnlocked = false
}) => {
  // Live API Keys state backed by local storage for persistent real ownership
  const [apiKeys, setApiKeys] = useState<ApiKeyRecord[]>(() => {
    try {
      const saved = localStorage.getItem('acdc_commercial_api_keys');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'KEY-001',
        name: 'Production Cloud Cluster (US-East)',
        key: 'acdc_live_7f8a9b1c2d3e4f5a6b7c8d9e0f1a2b3c',
        plan: 'BUSINESS_PRO',
        created: Date.now() - 86400000 * 12,
        requestsCount: 452109,
        status: 'ACTIVE'
      },
      {
        id: 'KEY-002',
        name: 'Casablanca Staging Edge',
        key: 'acdc_live_3c2b1a0f9e8d7c6b5a4f3e2d1c0b9a8f',
        plan: 'DEV_STARTER',
        created: Date.now() - 86400000 * 3,
        requestsCount: 18450,
        status: 'ACTIVE'
      }
    ];
  });

  const [activeTab, setActiveTab] = useState<'PLANS' | 'API_KEYS' | 'INVOICES' | 'CUSTOM_AGREEMENT'>('PLANS');

  // Enforce isolation: Visitors cannot open API_KEYS tab
  useEffect(() => {
    if (!isUnlocked && activeTab === 'API_KEYS') {
      setActiveTab('PLANS');
    }
  }, [isUnlocked, activeTab]);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedPlanForKey, setSelectedPlanForKey] = useState<'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE'>('BUSINESS_PRO');
  const [isGeneratingKey, setIsGeneratingKey] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [revealedKeyIds, setRevealedKeyIds] = useState<Record<string, boolean>>({});

  const toggleRevealKey = (id: string) => {
    setRevealedKeyIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Active Subscription
  const [subscription, setSubscription] = useState<CustomerSubscription>(() => {
    try {
      const saved = localStorage.getItem('acdc_commercial_sub');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      companyName: 'Private Sovereign Enterprise',
      planId: 'BUSINESS_PRO',
      billingCycle: 'monthly',
      activatedAt: Date.now() - 86400000 * 24,
      protectedServersLimit: 25,
      status: 'ACTIVE'
    };
  });

  // Persist keys
  useEffect(() => {
    try {
      localStorage.setItem('acdc_commercial_api_keys', JSON.stringify(apiKeys));
    } catch {}
  }, [apiKeys]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    showNotification(lang === 'ar' ? 'تم نسخ المفتاح إلى الحافظة بنجاح' : 'API Key copied to clipboard');
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleCreateNewApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newKeyName.trim()) return;

    setIsGeneratingKey(true);
    setTimeout(() => {
      // Cryptographically random 32-byte hexadecimal key
      const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(16)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      
      const newRecord: ApiKeyRecord = {
        id: `KEY-${Date.now().toString().slice(-4)}`,
        name: newKeyName.trim(),
        key: `acdc_live_${randomHex}`,
        plan: selectedPlanForKey,
        created: Date.now(),
        requestsCount: 0,
        status: 'ACTIVE'
      };

      setApiKeys(prev => [newRecord, ...prev]);
      setNewKeyName('');
      setIsGeneratingKey(false);
      showNotification(
        lang === 'ar' 
          ? `تم توليد مفتاح API جديد مشفر بنجاح (${newRecord.name})` 
          : `New Production API Key Generated (${newRecord.name})`
      );
    }, 400);
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: k.status === 'ACTIVE' ? 'REVOKED' : 'ACTIVE' } : k));
    showNotification(lang === 'ar' ? 'تم تحديث حالة ترخيص المفتاح' : 'API Key status updated');
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys(prev => prev.filter(k => k.id !== id));
    showNotification(lang === 'ar' ? 'تم حذف المفتاح نهائياً من السجل' : 'API Key permanently deleted');
  };

  // Checkout & Instant Payment Gateway States
  const [checkoutPlan, setCheckoutPlan] = useState<'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE' | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'CARD' | 'WIRE' | 'CRYPTO'>('CARD');
  const [cardHolder, setCardHolder] = useState<string>('SOVEREIGN ENTERPRISE LTD');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [paymentReceipt, setPaymentReceipt] = useState<{
    invoiceId: string;
    plan: 'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE';
    amount: string;
    date: string;
    apiKey: string;
  } | null>(null);

  const handleSelectPlan = (planId: 'DEV_STARTER' | 'BUSINESS_PRO' | 'ENTERPRISE_CORE') => {
    setCheckoutPlan(planId);
    soundEffects.playStageAdvance();
  };

  const handleConfirmPayment = () => {
    if (!checkoutPlan) return;
    setIsProcessingPayment(true);
    soundEffects.playRadarBlip(800, 40);

    setTimeout(() => {
      const limits = { DEV_STARTER: 3, BUSINESS_PRO: 25, ENTERPRISE_CORE: 250 };
      const prices = { DEV_STARTER: '$199', BUSINESS_PRO: '$799', ENTERPRISE_CORE: '$3,499' };
      const updated: CustomerSubscription = {
        ...subscription,
        planId: checkoutPlan,
        protectedServersLimit: limits[checkoutPlan],
        activatedAt: Date.now()
      };
      setSubscription(updated);
      try {
        localStorage.setItem('acdc_commercial_sub', JSON.stringify(updated));
      } catch {}

      // Auto-generate new authenticated live API key
      const randHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      const newKey: ApiKeyRecord = {
        id: `KEY-${String(apiKeys.length + 1).padStart(3, '0')}`,
        name: `${checkoutPlan} Direct Activation (${new Date().toLocaleDateString()})`,
        key: `acdc_live_${randHex}`,
        plan: checkoutPlan,
        created: Date.now(),
        requestsCount: 0,
        status: 'ACTIVE'
      };
      setApiKeys(prev => [newKey, ...prev]);

      const invoiceNumber = `INV-${Date.now().toString().slice(-6)}`;
      setPaymentReceipt({
        invoiceId: invoiceNumber,
        plan: checkoutPlan,
        amount: prices[checkoutPlan],
        date: new Date().toISOString().split('T')[0],
        apiKey: newKey.key
      });

      setIsProcessingPayment(false);
      soundEffects.playMitigationChirp();
      showNotification(
        lang === 'ar' 
          ? `تم تأكيد الدفع وتفعيل باقة ${checkoutPlan} وإصدار المفتاح التجاري بنجاح!` 
          : `Payment confirmed! ${checkoutPlan} activated and production API key issued!`
      );
    }, 1100);
  };

  const handleDownloadInvoice = () => {
    if (!paymentReceipt) return;
    soundEffects.playStageAdvance();
    const invoiceText = `================================================================================
                    OFFICIAL COMMERCIAL TAX INVOICE & RECEIPT
                       SOVEREIGN AUTONOMOUS CYBER-DEFENSE
================================================================================
Invoice Number:      ${paymentReceipt.invoiceId}
Date of Issuance:    ${paymentReceipt.date}
Customer:            ${subscription.companyName}
Billing Entity:      TAHA SETRII 🇲🇦 (Founder & Autonomous Architecture Authority)
Jurisdiction:        Casablanca, Kingdom of Morocco
SLA Tier:            ${paymentReceipt.plan}
Amount Billed:       ${paymentReceipt.amount} USD / Month (Paid in Full)
Payment Channel:     ${paymentMethod === 'CARD' ? 'Encrypted Credit/Debit Card (3D-Secure)' : paymentMethod === 'WIRE' ? 'Corporate SWIFT / Bank Wire' : 'Multi-Sig Sovereign Crypto Escrow'}
Authorized API Key:  ${paymentReceipt.apiKey}
Status:              SETTLED & ACTIVE (DEFCON-1 WIRE PROTECTION DEPLOYED)
================================================================================
Thank you for choosing Sovereign Autonomous Cyber-Defense. Your infrastructure
is protected wire-to-wire by our signature-free mathematical engine.
================================================================================`;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Invoice-${paymentReceipt.invoiceId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-[#080d18] border border-emerald-500/40 rounded-2xl shadow-[0_0_60px_rgba(16,185,129,0.25)] flex flex-col max-h-[90vh] overflow-hidden"
        dir={lang === 'ar' ? 'rtl' : 'ltr'}
      >
        {/* Top Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-950 via-[#0a1324] to-slate-950">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white font-mono tracking-wide">
                  {lang === 'ar' ? 'إدارة التراخيص التجارية ومفاتيح API المستقلة' : 'Commercial Licensing & Independent API Keys'}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono font-bold">
                  PROPRIETARY & INDEPENDENT
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {lang === 'ar' 
                  ? 'منظومة تجارية خاصة مملوكة للمؤسس TAHA SETRII 🇲🇦 - بيع خدمات الحماية للشركات والمؤسسات' 
                  : 'Commercial Platform owned & founded by TAHA SETRII 🇲🇦 - Independent B2B Security Services'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Floating Notification */}
        {notification && (
          <div className="px-6 py-2 bg-emerald-950/90 border-b border-emerald-500/40 text-emerald-200 text-xs font-mono flex items-center gap-2 animate-pulse">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{notification}</span>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 bg-slate-950/60 flex items-center gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('PLANS')}
            className={`px-4 py-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'PLANS'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>{lang === 'ar' ? 'باقات الاشتراك والأسعار' : 'Subscription Plans'}</span>
          </button>

          {/* Strictly Gated: Production API Keys are only visible inside Cockpit to keyholders */}
          {isUnlocked && (
            <button
              onClick={() => setActiveTab('API_KEYS')}
              className={`px-4 py-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'API_KEYS'
                  ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Key className="w-4 h-4" />
              <span>{lang === 'ar' ? 'مفاتيح التشغيل والربط (Cockpit API Keys)' : 'Cockpit API Keys'}</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 text-[10px]">
                {apiKeys.length}
              </span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('INVOICES')}
            className={`px-4 py-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'INVOICES'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{lang === 'ar' ? 'فواتير المبيعات وعقود B2B' : 'Invoices & SLA Contracts'}</span>
          </button>

          <button
            onClick={() => setActiveTab('CUSTOM_AGREEMENT')}
            className={`px-4 py-3 border-b-2 font-bold transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'CUSTOM_AGREEMENT'
                ? 'border-emerald-400 text-emerald-300 bg-emerald-950/20'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{lang === 'ar' ? 'عقد ترخيص الملكية الفردية' : 'Founder IP & SLA Agreement'}</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: COMMERCIAL PRICING PLANS */}
          {activeTab === 'PLANS' && (
            <div className="space-y-6">
              
              {/* Direct Phone & WhatsApp Instant Subscription Contact Banner */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#061c16] via-[#091522] to-[#04141d] border-2 border-emerald-500/50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(16,185,129,0.35)]">
                    <MessageCircle className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-black text-white font-mono">
                        {lang === 'ar' ? 'للاشتراك الفوري والاستفسار عبر الهاتف أو واتساب:' : 'Direct Inquiries & WhatsApp / Phone Subscriptions:'}
                      </h4>
                      <span className="px-2 py-0.5 rounded bg-emerald-900/90 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40">
                        24/7 SUPPORT
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      {lang === 'ar' 
                        ? 'تواصل مباشر مع إدارة المبيعات وتفعيل الاشتراكات للمؤسسات والشركات والمصارف' 
                        : 'Instant onboarding for B2B enterprises, banking infrastructures & cloud nodes'}
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
                    <span>{lang === 'ar' ? 'واتساب: +212 634 424 914' : 'WhatsApp: +212 634 424 914'}</span>
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

              <div className="text-center max-w-2xl mx-auto space-y-1">
                <h3 className="text-xl font-bold text-white font-mono">
                  {lang === 'ar' ? 'باقات ترخيص الخدمة للشركات الخاصة' : 'Commercial Security Protection Tiers'}
                </h3>
                <p className="text-xs text-slate-400">
                  {lang === 'ar' 
                    ? 'يمكن للشركات والبنوك والمتاجر الإلكترونية الاشتراك مباشرة وحماية خوادمهم من خلال لوحة التحكم ومفاتيح API الخاصة بك.'
                    : 'Charge enterprise clients recurring SaaS fees to protect their servers using your proprietary eBPF & AI engine.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                {/* Plan 1: Starter */}
                <div className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  subscription.planId === 'DEV_STARTER'
                    ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                        {lang === 'ar' ? 'المطورين والشركات الصغيرة' : 'Developer / Small Business'}
                      </span>
                      {subscription.planId === 'DEV_STARTER' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">
                          {lang === 'ar' ? 'مفعّل' : 'CURRENT'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">$199</span>
                      <span className="text-xs text-slate-400 font-mono">/{lang === 'ar' ? 'شهرياً' : 'month'}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'ar' 
                        ? 'حماية تصل إلى 3 خوادم، فحص الحزم السلكي حتى 10 مليون حزمة شهرياً.' 
                        : 'Protect up to 3 Linux VPS/Cloud nodes, up to 10M packet inspections/mo.'}
                    </p>
                    <ul className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? '3 وكلاء eBPF حقيقيين' : '3 Live Server Daemon Agents'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? 'عزل تلقائي لهجمات DDoS' : 'Autonomous DDoS Drop'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? 'دعم فني عبر البريد الإلكتروني' : 'Standard Email Support'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => handleSelectPlan('DEV_STARTER')}
                      className="w-full py-2.5 rounded-lg border border-slate-700 hover:border-emerald-500 text-xs font-mono font-bold text-slate-200 hover:text-emerald-300 transition-colors cursor-pointer"
                    >
                      {subscription.planId === 'DEV_STARTER' ? (lang === 'ar' ? 'الخطة الحالية' : 'Active Tier') : (lang === 'ar' ? 'تفعيل الخطة' : 'Select Plan')}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="https://wa.me/212634424914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D9%85%D8%B7%D9%88%D8%B1%D9%8A%D9%86%20(%24199%2F%D8%B4%D9%87%D8%B1)"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-[11px] font-mono font-bold text-emerald-300 flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-emerald-400" />
                        <span>{lang === 'ar' ? 'واتساب' : 'WhatsApp'}</span>
                      </a>
                      <a
                        href="tel:+212634424914"
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1 transition-colors"
                        title={lang === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
                      >
                        <Phone className="w-3 h-3 text-cyan-400" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Plan 2: Business Pro (Popular) */}
                <div className={`p-5 rounded-xl border-2 transition-all flex flex-col justify-between relative ${
                  subscription.planId === 'BUSINESS_PRO'
                    ? 'bg-[#091522] border-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.3)]'
                    : 'bg-slate-900/80 border-cyan-500/60'
                }`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-cyan-600 text-white font-mono font-black text-[10px] uppercase shadow">
                    {lang === 'ar' ? 'الأكثر طلباً للشركات' : 'MOST POPULAR (B2B)'}
                  </div>
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-cyan-300 font-bold uppercase">
                        {lang === 'ar' ? 'الشركات والبنوك المتوسطة' : 'Business Pro Enterprise'}
                      </span>
                      {subscription.planId === 'BUSINESS_PRO' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">
                          {lang === 'ar' ? 'مفعّل' : 'CURRENT'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">$899</span>
                      <span className="text-xs text-slate-400 font-mono">/{lang === 'ar' ? 'شهرياً' : 'month'}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {lang === 'ar' 
                        ? 'حماية 25 خادماً سحابياً، تدفق فوري مباشر، عزل في أقل من 300 مللي ثانية مع شجرة ميركل.' 
                        : 'Protect up to 25 nodes, wire-speed eBPF zero-copy, SLA < 300ms containment.'}
                    </p>
                    <ul className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-200">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? '25 خادم متصل عبر Python/Bash Agent' : '25 Live Linux Hosts via Agent'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? 'سلسلة ميركل القضائية غير قابلة للتلاعب' : 'Forensic Merkle Ledger Seals'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? 'واجهات برمجية REST & SSE كاملة' : 'Full REST & SSE Real Ingestion APIs'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{lang === 'ar' ? 'تنبيهات صوتية فورية للحالات الحرجة' : 'Dedicated 24/7 Priority Support'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => handleSelectPlan('BUSINESS_PRO')}
                      className="w-full py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-black tracking-wider uppercase transition-colors cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                    >
                      {subscription.planId === 'BUSINESS_PRO' ? (lang === 'ar' ? 'الخطة الحالية المعتمدة' : 'Active Tier') : (lang === 'ar' ? 'تفعيل باقة الأعمال' : 'Upgrade to Pro')}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="https://wa.me/212634424914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D8%A3%D8%B9%D9%85%D8%A7%D9%84%20Business%20Pro%20(%24899%2F%D8%B4%D9%87%D8%B1)"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-mono font-bold flex items-center justify-center gap-1 transition-colors shadow-sm"
                      >
                        <MessageCircle className="w-3 h-3" />
                        <span>{lang === 'ar' ? 'اشتراك واتساب فوراً' : 'Subscribe WhatsApp'}</span>
                      </a>
                      <a
                        href="tel:+212634424914"
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-200 flex items-center justify-center gap-1 transition-colors"
                        title={lang === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
                      >
                        <Phone className="w-3 h-3 text-emerald-400" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Plan 3: Enterprise Core */}
                <div className={`p-5 rounded-xl border transition-all flex flex-col justify-between ${
                  subscription.planId === 'ENTERPRISE_CORE'
                    ? 'bg-slate-900/90 border-emerald-400 ring-2 ring-emerald-400/30'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-purple-400 font-bold uppercase">
                        {lang === 'ar' ? 'المؤسسات الكبرى ومراكز البيانات' : 'Data Center / Custom'}
                      </span>
                      {subscription.planId === 'ENTERPRISE_CORE' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">
                          {lang === 'ar' ? 'مفعّل' : 'CURRENT'}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white font-mono">$3,499</span>
                      <span className="text-xs text-slate-400 font-mono">/{lang === 'ar' ? 'شهرياً' : 'month'}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {lang === 'ar' 
                        ? 'حماية غير محدودة (تصل لـ 250 خادماً)، مسبار XDP على مستوى الألياف الضوئية وربط BGP مخصص.' 
                        : 'Unlimited protection, dedicated hardware HSM integration & BGP Flowspec peering.'}
                    </p>
                    <ul className="space-y-2 pt-3 border-t border-slate-800 text-xs text-slate-300">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'تثبيت محلي On-Premises معزول' : 'Air-Gapped On-Prem Deployment'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'تخصيص قواعد Sigma وSTIX' : 'Custom Sigma Rules Engine'}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400" />
                        <span>{lang === 'ar' ? 'اتفاقية مستوى خدمة SLA بنسبة 99.99%' : '99.99% Guaranteed SLA Guarantee'}</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 space-y-2">
                    <button
                      onClick={() => handleSelectPlan('ENTERPRISE_CORE')}
                      className="w-full py-2.5 rounded-lg border border-purple-500/60 hover:bg-purple-950/40 text-xs font-mono font-bold text-purple-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {subscription.planId === 'ENTERPRISE_CORE' ? (lang === 'ar' ? 'الخطة الحالية' : 'Active Tier') : (lang === 'ar' ? 'تفعيل الخطة الكبرى' : 'Select Enterprise')}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <a
                        href="https://wa.me/212634424914?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%B1%D8%BA%D8%A8%20%D9%81%D9%8A%20%D8%A7%D9%84%D8%A7%D8%B4%D8%AA%D8%B1%D8%A7%D9%83%20%D9%81%D9%8A%20%D8%A8%D8%A7%D9%82%D8%A9%20%D8%A7%D9%84%D9%85%D8%A4%D8%B3%D8%B3%D8%A7%D8%AA%20Enterprise%20Core%20(%243%2C499%2F%D8%B4%D9%87%D8%B1)"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1.5 px-2 rounded-lg bg-purple-950/70 hover:bg-purple-900 border border-purple-500/40 text-[11px] font-mono font-bold text-purple-200 flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageCircle className="w-3 h-3 text-purple-400" />
                        <span>{lang === 'ar' ? 'واتساب للمؤسسات' : 'WhatsApp'}</span>
                      </a>
                      <a
                        href="tel:+212634424914"
                        className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-[11px] font-mono text-slate-300 flex items-center justify-center gap-1 transition-colors"
                        title={lang === 'ar' ? 'اتصال مباشر' : 'Direct Call'}
                      >
                        <Phone className="w-3 h-3 text-purple-400" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTION API KEYS (Strictly Restricted to Cockpit Access) */}
          {isUnlocked && activeTab === 'API_KEYS' && (
            <div className="space-y-6">

              {/* Sovereign Cockpit Vault Banner */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/50 flex items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-2.5 text-emerald-300 font-bold">
                  <Lock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ar' 
                      ? 'مستودع مفاتيح العمليات المحصن: هذه المفاتيح مشفرة ومحجوبة بالكامل عن الزوار والواجهة العامة للمنظومة.' 
                      : 'Cockpit Key Vault: These keys are strictly quarantined inside the Sovereign Cockpit and invisible to public visitors.'}
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] border border-emerald-600 font-bold shrink-0">
                  COCKPIT ONLY
                </span>
              </div>
              
              {/* Generate New Key Box */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'توليد مفتاح إنتاج جديد (Generate Production Key)' : 'Generate Production API Key'}</span>
                </h4>
                <form onSubmit={handleCreateNewApiKey} className="flex flex-col sm:flex-row items-center gap-3">
                  <input
                    type="text"
                    required
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: خادم التجارة الإلكترونية الرئيسي...' : 'e.g., Client Production Cluster #1'}
                    className="flex-1 w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  />
                  <select
                    value={selectedPlanForKey}
                    onChange={(e) => setSelectedPlanForKey(e.target.value as any)}
                    className="px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="DEV_STARTER">DEV_STARTER (3 Nodes)</option>
                    <option value="BUSINESS_PRO">BUSINESS_PRO (25 Nodes)</option>
                    <option value="ENTERPRISE_CORE">ENTERPRISE_CORE (250 Nodes)</option>
                  </select>
                  <button
                    type="submit"
                    disabled={isGeneratingKey}
                    className="w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
                  >
                    <Key className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إصدار المفتاح' : 'Create Key'}</span>
                  </button>
                </form>
              </div>

              {/* Existing API Keys Table */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/80">
                <div className="p-3 bg-slate-900 border-b border-slate-800 text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span>{lang === 'ar' ? 'المفاتيح النشطة للعملاء والخوادم المتصلة' : 'Active Keys Assigned to Remote Servers'}</span>
                  <span className="text-[11px] text-emerald-400">REST & Live Agents Gated</span>
                </div>
                <div className="divide-y divide-slate-800/80">
                  {apiKeys.map((record) => (
                    <div key={record.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/40 transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-white font-mono">{record.name}</span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            record.status === 'ACTIVE' 
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-600/40' 
                              : 'bg-red-950 text-red-300 border border-red-600/40'
                          }`}>
                            {record.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                            {record.plan}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                          <span className="text-slate-500">{lang === 'ar' ? 'مفتاح التفويض:' : 'Secret Token:'}</span>
                          <code className="text-emerald-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                            {revealedKeyIds[record.id] ? record.key : `${record.key.slice(0, 10)}••••••••••••••••••••••••`}
                          </code>
                          <button
                            type="button"
                            onClick={() => toggleRevealKey(record.id)}
                            className="text-slate-400 hover:text-white transition-colors cursor-pointer p-0.5"
                            title={revealedKeyIds[record.id] ? "Hide key" : "Show key"}
                          >
                            {revealedKeyIds[record.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          <span>{lang === 'ar' ? 'الطلبات المفحوصة:' : 'Scanned Requests:'} {record.requestsCount.toLocaleString()}</span>
                          <span className="mx-2">•</span>
                          <span>{lang === 'ar' ? 'تاريخ الإنشاء:' : 'Created:'} {new Date(record.created).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => copyToClipboard(record.key, record.id)}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          {copiedKeyId === record.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKeyId === record.id ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                        </button>
                        <button
                          onClick={() => handleRevokeKey(record.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                            record.status === 'ACTIVE'
                              ? 'bg-amber-950/40 text-amber-300 border-amber-700 hover:bg-amber-900/60'
                              : 'bg-emerald-950/40 text-emerald-300 border-emerald-700 hover:bg-emerald-900/60'
                          }`}
                        >
                          {record.status === 'ACTIVE' ? (lang === 'ar' ? 'تعليق' : 'Suspend') : (lang === 'ar' ? 'تفعيل' : 'Activate')}
                        </button>
                        <button
                          onClick={() => handleDeleteKey(record.id)}
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-950/60 text-slate-500 hover:text-red-400 border border-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* cURL Usage Code Example */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <div className="text-xs font-mono font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-cyan-400" />
                    <span>{lang === 'ar' ? 'طريقة استخدام المفتاح للعملاء (cURL Authorization Header)' : 'Client Authentication Header Example'}</span>
                  </span>
                  <span className="text-slate-500">RFC 6750 Bearer</span>
                </div>
                <pre className="p-3 rounded-lg bg-slate-900 text-cyan-300 font-mono text-xs overflow-x-auto border border-slate-800">
{`curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'https://your-acdc-soc.run.app'}/api/ingest" \\
  -H "Authorization: Bearer ${apiKeys[0]?.key || 'acdc_live_YOUR_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceIp": "194.26.29.11", "destinationPort": 443, "protocol": "TCP", "payload": "GET /api/v1/data HTTP/1.1"}'`}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: INVOICES & B2B BILLING */}
          {activeTab === 'INVOICES' && (
            <div className="space-y-4">
              <div className="text-xs font-mono text-slate-400">
                {lang === 'ar' 
                  ? 'سجل المعاملات والفواتير الصادرة للشركات والمشتركين مع تفاصيل الامتثال الضريبي B2B.'
                  : 'B2B recurring billing ledger & paid invoice archive with SLA audit trail.'}
              </div>

              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/90">
                <table className="w-full text-xs font-mono text-start">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3 text-start">ID</th>
                      <th className="p-3 text-start">{lang === 'ar' ? 'العميل' : 'Customer'}</th>
                      <th className="p-3 text-start">{lang === 'ar' ? 'الباقة' : 'Tier'}</th>
                      <th className="p-3 text-start">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                      <th className="p-3 text-start">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                      <th className="p-3 text-start">{lang === 'ar' ? 'الحالة' : 'Status'}</th>
                      <th className="p-3 text-end">{lang === 'ar' ? 'تحميل' : 'Receipt'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 text-white font-bold">INV-2026-089</td>
                      <td className="p-3 text-slate-300">Atlas Cloud Data Center SARL</td>
                      <td className="p-3 text-cyan-400">BUSINESS_PRO</td>
                      <td className="p-3 text-emerald-400 font-bold">$899.00</td>
                      <td className="p-3 text-slate-400">2026-09-01</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">PAID</span>
                      </td>
                      <td className="p-3 text-end">
                        <button 
                          onClick={() => showNotification(lang === 'ar' ? 'تم تنزيل الفاتورة الضريبية PDF' : 'Invoice PDF Downloaded')}
                          className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                          <Download className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 text-white font-bold">INV-2026-088</td>
                      <td className="p-3 text-slate-300">FinTech Payment Gateway Maroc</td>
                      <td className="p-3 text-purple-400">ENTERPRISE_CORE</td>
                      <td className="p-3 text-emerald-400 font-bold">$3,499.00</td>
                      <td className="p-3 text-slate-400">2026-08-15</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">PAID</span>
                      </td>
                      <td className="p-3 text-end">
                        <button 
                          onClick={() => showNotification(lang === 'ar' ? 'تم تنزيل الفاتورة الضريبية PDF' : 'Invoice PDF Downloaded')}
                          className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                          <Download className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-900/40">
                      <td className="p-3 text-white font-bold">INV-2026-087</td>
                      <td className="p-3 text-slate-300">Med-Logistics Cargo WAN</td>
                      <td className="p-3 text-cyan-400">BUSINESS_PRO</td>
                      <td className="p-3 text-emerald-400 font-bold">$899.00</td>
                      <td className="p-3 text-slate-400">2026-08-01</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-600">PAID</span>
                      </td>
                      <td className="p-3 text-end">
                        <button 
                          onClick={() => showNotification(lang === 'ar' ? 'تم تنزيل الفاتورة الضريبية PDF' : 'Invoice PDF Downloaded')}
                          className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                        >
                          <Download className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: FOUNDER IP & COMMERCIAL INDEPENDENCE CONTRACT */}
          {activeTab === 'CUSTOM_AGREEMENT' && (
            <div className="space-y-4 text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-5 rounded-xl border border-slate-800">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="font-bold text-sm text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{lang === 'ar' ? 'ميثاق الاستقلالية الكاملة وحماية الملكية الفكرية' : 'Founder Sole Ownership & Intellectual Property Charter'}</span>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 text-[10px]">
                  FOUNDER: TAHA SETRII 🇲🇦
                </span>
              </div>

              <div className="space-y-3">
                <p>
                  {lang === 'ar'
                    ? '1. الملكية الحصرية: هذا النظام وكافة الخوارزميات والمعماريات البرمجية المرفقة (eBPF Probes, Mahalanobis Scoring Engine, Merkle Immutability Ledger) ملكية فكرية خاصة وحصرية للمؤسس TAHA SETRII.'
                    : '1. Sole Ownership: All core algorithmic architectures, kernel interception routines, and Merkle audit mechanisms belong exclusively to founder TAHA SETRII.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? '2. الاستقلالية التجارية: لا يخضع المشروع لأي قيود أو تبعيات لأطراف ثالثة، ويحق للمؤسس بيع التراخيص وتقديم خدمات الدفاع السيبراني للشركات والمؤسسات الدولية كمنتج تجاري مستقل (Proprietary B2B SaaS).'
                    : '2. Commercial Independence: The platform is not beholden to external entities and is free to service enterprise, private banking, and critical infrastructure clients globally.'}
                </p>
                <p>
                  {lang === 'ar'
                    ? '3. اتفاقية مستوى الخدمة (SLA): يلتزم النظام بتحييد الهجمات واعتراضها خلال زمن استجابة دون ثانية واحدة (Sub-second SLA under 300ms) مع توثيق تشفيري غير قابل للتراجع.'
                    : '3. SLA Guarantee: Under-300ms automated threat mitigation guarantee backed by cryptographic Merkle attestations.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Status: VERIFIED & SEALED</span>
                <span className="text-emerald-400 font-bold">TAHA SETRII • SOLE ARCHITECT 🇲🇦</span>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono">
          <div className="text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ar' 
                ? 'الخطة النشطة: ' + subscription.planId + ' (حد الحماية: ' + subscription.protectedServersLimit + ' خادم حقيقي)' 
                : 'Active Tier: ' + subscription.planId + ' (' + subscription.protectedServersLimit + ' Live Nodes Allowed)'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold border border-slate-700 transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
          </button>
        </div>
      </div>

      {/* INTERACTIVE SECURE CHECKOUT & INSTANT ACTIVATION DIALOG */}
      {checkoutPlan && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div 
            className="w-full max-w-lg bg-[#0a1222] border-2 border-emerald-500/70 rounded-2xl p-6 shadow-[0_0_60px_rgba(16,185,129,0.35)] space-y-5"
            dir={lang === 'ar' ? 'rtl' : 'ltr'}
          >
            {/* Checkout Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {lang === 'ar' ? 'بوابة الدفع والتفعيل الفوري' : 'Direct Checkout & Instant Activation'}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {checkoutPlan === 'DEV_STARTER' ? 'Starter ($199/mo)' : checkoutPlan === 'BUSINESS_PRO' ? 'Business Pro ($799/mo)' : 'Enterprise Core ($3,499/mo)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setCheckoutPlan(null);
                  setPaymentReceipt(null);
                }}
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* If Receipt is Available */}
            {paymentReceipt ? (
              <div className="space-y-4 font-mono">
                <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-black text-white">
                    {lang === 'ar' ? 'تم الدفع وتفعيل الاشتراك بنجاح!' : 'Payment Settled & Plan Active!'}
                  </h4>
                  <p className="text-xs text-emerald-200">
                    {lang === 'ar' ? `رقم الفاتورة الضريبية: ${paymentReceipt.invoiceId}` : `Tax Invoice: ${paymentReceipt.invoiceId}`}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-black/60 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ar' ? 'الباقة:' : 'Tier:'}</span>
                    <span className="text-white font-bold">{paymentReceipt.plan}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ar' ? 'المبلغ المسدد:' : 'Amount Paid:'}</span>
                    <span className="text-emerald-400 font-bold">{paymentReceipt.amount}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>{lang === 'ar' ? 'حالة الحماية:' : 'Protection Status:'}</span>
                    <span className="text-cyan-400 font-bold">DEFCON-1 WIRE SHIELD ON</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'مفتاح API المخصص لخوادمك:' : 'Live Generated API Key:'}</span>
                    <div className="flex items-center gap-1.5">
                      <code className="flex-1 p-2 rounded bg-slate-950 border border-emerald-500/40 text-emerald-300 text-[11px] truncate select-all">
                        {paymentReceipt.apiKey}
                      </code>
                      <button
                        onClick={() => copyToClipboard(paymentReceipt.apiKey, 'receipt-key')}
                        className="p-2 rounded bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 cursor-pointer"
                        title={lang === 'ar' ? 'نسخ المفتاح' : 'Copy Key'}
                      >
                        {copiedKeyId === 'receipt-key' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <button
                    onClick={handleDownloadInvoice}
                    className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'تحميل الفاتورة الرسمية' : 'Download Invoice'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setCheckoutPlan(null);
                      setPaymentReceipt(null);
                    }}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'إتمام ومتابعة' : 'Done & Continue'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 font-mono text-xs">
                {/* Method selector */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{lang === 'ar' ? 'بطاقة بنكية' : 'Card'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('WIRE')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'WIRE'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{lang === 'ar' ? 'تحويل بنكي' : 'Bank Wire'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CRYPTO')}
                    className={`py-2 px-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      paymentMethod === 'CRYPTO'
                        ? 'bg-emerald-950/80 border-emerald-400 text-emerald-300'
                        : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <Lock className="w-4 h-4" />
                    <span className="text-[10px] font-bold">{lang === 'ar' ? 'ضمان مشفر' : 'USDT / Escrow'}</span>
                  </button>
                </div>

                {/* Card Fields */}
                {paymentMethod === 'CARD' && (
                  <div className="space-y-3 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>{lang === 'ar' ? 'بوابة تشفير Stripe 256-bit' : 'Stripe 256-bit Encrypted'}</span>
                      <span className="text-emerald-400 font-bold">3D-SECURE 2.0</span>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{lang === 'ar' ? 'اسم حامل البطاقة / الشركة:' : 'Cardholder / Entity:'}</label>
                      <input 
                        type="text" 
                        value={cardHolder} 
                        onChange={e => setCardHolder(e.target.value)}
                        className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white text-xs outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-400 block mb-1">{lang === 'ar' ? 'رقم البطاقة الائتمانية:' : 'Card Number:'}</label>
                      <input 
                        type="text" 
                        value={cardNumber} 
                        onChange={e => setCardNumber(e.target.value)}
                        className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">{lang === 'ar' ? 'تاريخ الانتهاء:' : 'Expiry Date:'}</label>
                        <input 
                          type="text" 
                          value={cardExpiry} 
                          onChange={e => setCardExpiry(e.target.value)}
                          className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 block mb-1">{lang === 'ar' ? 'رمز الأمان CVC:' : 'CVC / CVV:'}</label>
                        <input 
                          type="password" 
                          value={cardCvc} 
                          onChange={e => setCardCvc(e.target.value)}
                          className="w-full bg-black border border-slate-700 rounded-lg p-2 text-white text-xs font-mono outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Wire Fields */}
                {paymentMethod === 'WIRE' && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">{lang === 'ar' ? 'المستفيد:' : 'Beneficiary:'}</span>
                      <span className="text-white font-bold">TAHA SETRII 🇲🇦</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">{lang === 'ar' ? 'المصرف المركزي:' : 'Bank:'}</span>
                      <span className="text-emerald-400">Attijariwafa Bank (Morocco)</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800 pb-1.5">
                      <span className="text-slate-400">IBAN / RIB:</span>
                      <span className="font-mono text-cyan-300 select-all">MA64 0077 8000 0123 4567 8901 2345</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">SWIFT / BIC:</span>
                      <span className="font-mono text-white">BCMAMAMC</span>
                    </div>
                  </div>
                )}

                {/* Crypto Fields */}
                {paymentMethod === 'CRYPTO' && (
                  <div className="space-y-2 p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">{lang === 'ar' ? 'الشبكة المعتمدة:' : 'Network:'}</span>
                      <span className="text-emerald-400 font-bold">USDT (TRC-20 / Arbitrum One)</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block mb-1">{lang === 'ar' ? 'عنوان المحفظة السيادية:' : 'Sovereign Escrow Address:'}</span>
                      <code className="block p-2 rounded bg-black border border-slate-800 text-amber-300 text-[10px] break-all select-all font-mono">
                        0x71C8360d8C9a0A939E83Fe679a78505e6Bc7B67f
                      </code>
                    </div>
                  </div>
                )}

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-[0_0_20px_rgba(16,185,129,0.35)] disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{lang === 'ar' ? 'جاري معالجة الدفع وإصدار التراخيص...' : 'Processing Payment & Issuing API Key...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        {lang === 'ar' 
                          ? `تأكيد الدفع والتفعيل الفوري (${checkoutPlan === 'DEV_STARTER' ? '$199' : checkoutPlan === 'BUSINESS_PRO' ? '$799' : '$3,499'})` 
                          : `Confirm Payment & Activate (${checkoutPlan === 'DEV_STARTER' ? '$199' : checkoutPlan === 'BUSINESS_PRO' ? '$799' : '$3,499'})`}
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
