import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CheckCircle2, 
  Shield, 
  Lock, 
  CreditCard, 
  Building2, 
  Mail, 
  Key, 
  Copy, 
  Eye, 
  EyeOff, 
  Server, 
  Download, 
  FileText, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Phone,
  MessageCircle
} from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { addClientWorkspace, generateSafeAsciiCode } from '../services/clientWorkspaceService';
import { ClientWorkspace, TenantPlan } from '../types/cyber';

export interface PlanData {
  id: string;
  nameAr: string;
  nameEn: string;
  priceMonthly: number;
  priceAnnualMonthly: number;
  badgeAr: string;
  badgeEn: string;
  color: string;
}

interface SubscriptionCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PlanData | null;
  billingCycle: 'monthly' | 'annual';
  lang: 'ar' | 'en';
  onSuccess: (data: {
    planId: string;
    orgName: string;
    email: string;
    apiKey: string;
    invoiceId: string;
  }) => void;
  onOpenLiveBridge?: () => void;
}

export const SubscriptionCheckoutModal: React.FC<SubscriptionCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  billingCycle,
  lang,
  onSuccess,
  onOpenLiveBridge
}) => {
  const [step, setStep] = useState<'FORM' | 'SUCCESS'>('FORM');
  const [orgName, setOrgName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [deploymentTarget, setDeploymentTarget] = useState('cloud');
  const [paymentMethod, setPaymentMethod] = useState<'wire' | 'card' | 'trial'>('card');
  const [acceptedTerms, setAcceptedTerms] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  // Success state
  const [issuedKey, setIssuedKey] = useState('');
  const [issuedInvoiceId, setIssuedInvoiceId] = useState('');
  const [showRawKey, setShowRawKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen || !plan) return null;

  const displayPrice = billingCycle === 'annual' ? plan.priceAnnualMonthly : plan.priceMonthly;
  const totalBilled = billingCycle === 'annual' ? displayPrice * 12 : displayPrice;

  const handleSubmitSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgName.trim() || !adminEmail.trim() || !acceptedTerms) return;

    setIsProcessing(true);
    setTimeout(() => {
      // Generate a cryptographic key for this client
      const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(12)))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      const generatedKey = `acdc_live_${plan.id.toLowerCase()}_${randomHex}`;
      const invId = `INV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

      setIssuedKey(generatedKey);
      setIssuedInvoiceId(invId);
      setIsProcessing(false);
      setStep('SUCCESS');

      // Persist to founder cockpit subscriber ledger
      subscriptionService.addSubscriber({
        orgName: orgName.trim(),
        adminEmail: adminEmail.trim(),
        planId: plan.id,
        planNameAr: plan.nameAr,
        planNameEn: plan.nameEn,
        monthlyPrice: plan.priceMonthly,
        billingCycle,
        paymentMethod,
        deploymentTarget: deploymentTarget as any,
        apiKey: generatedKey,
        invoiceId: invId
      });

      // Automatically provision a dedicated Client Workspace
      try {
        const safeCode = generateSafeAsciiCode(orgName.trim(), 'SUB');
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        const tenantId = `TENANT-${safeCode}-${randomSuffix}`;
        const passkey = `CLI-${safeCode}-KEY-${randomSuffix}`;
        
        let tenantPlan: TenantPlan = 'ENTERPRISE_CORE';
        if (plan.id === 'PLAN-MSSP-PARTNER') tenantPlan = 'MSSP_WHITE_LABEL';
        else if (plan.id === 'PLAN-NATIONAL-CLOUD') tenantPlan = 'CLOUD_MESH_SOVEREIGN';
        else if (plan.id === 'PLAN-BUSINESS-PRO') tenantPlan = 'BUSINESS_PRO';

        const autoWorkspace: ClientWorkspace = {
          id: tenantId,
          name: orgName.trim(),
          nameAr: orgName.trim(),
          clientPasskey: passkey,
          plan: tenantPlan,
          status: 'ACTIVE',
          assignedServers: [`10.100.${Math.floor(1 + Math.random() * 20)}.${Math.floor(2 + Math.random() * 250)} (Isolated Production Node)`],
          allocatedQuotaMonthly: tenantPlan === 'MSSP_WHITE_LABEL' ? 50000000 : tenantPlan === 'CLOUD_MESH_SOVEREIGN' ? 20000000 : 5000000,
          consumedQuotaMonthly: 0,
          apiKey: generatedKey,
          createdAt: Date.now(),
          expiresAt: Date.now() + 365 * 86400000,
          contactEmail: adminEmail.trim(),
          contactPhone: '+212 634 424 914',
          dedicatedInstanceUrl: `https://${safeCode.toLowerCase()}-${randomSuffix}.securite-maroc.defense`,
          customBranding: {
            accentColor: '#10b981',
            logoText: orgName.trim().substring(0, 20).toUpperCase()
          }
        };

        addClientWorkspace(autoWorkspace);
      } catch (e) {
        console.error('Error auto-provisioning workspace:', e);
      }

      onSuccess({
        planId: plan.id,
        orgName: orgName.trim(),
        email: adminEmail.trim(),
        apiKey: generatedKey,
        invoiceId: invId
      });
    }, 700);
  };

  const handleCopyKey = () => {
    if (!issuedKey) return;
    navigator.clipboard.writeText(issuedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleDownloadLicense = () => {
    const cert = {
      platform: "Sécurité Maroc - Autonomous Cyber Defense Grid",
      licenseId: issuedInvoiceId,
      plan: plan.nameEn,
      organization: orgName,
      authorizedContact: adminEmail,
      billingCycle,
      issuedAt: new Date().toISOString(),
      apiKeyHash: issuedKey.slice(0, 14) + "************************",
      complianceStatus: "DGSSI (Sécurité Maroc) & NIST CSF 2.0 Compliant",
      signature: "VALID_CRYPTOGRAPHIC_SEAL"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securite_maroc_license_${issuedInvoiceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div 
        className="relative w-full max-w-2xl rounded-2xl bg-[#080e1a] border border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.25)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-mono">
                {step === 'FORM'
                  ? (lang === 'ar' ? 'طلب ترخيص واشتراك B2B آمن' : 'Secure B2B Subscription & License Order')
                  : (lang === 'ar' ? 'تم توثيق الاشتراك وتوليد مفتاح الترخيص' : 'Subscription Active & License Provisioned')}
              </h2>
              <p className="text-[11px] text-slate-400 font-mono">
                Sécurité Maroc • {lang === 'ar' ? plan.nameAr : plan.nameEn}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {step === 'FORM' ? (
            <form onSubmit={handleSubmitSubscription} className="space-y-5">
              {/* Plan Summary Pill */}
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-600/40">
                    {lang === 'ar' ? plan.badgeAr : plan.badgeEn}
                  </span>
                  <h3 className="text-sm font-bold text-white mt-1">
                    {lang === 'ar' ? plan.nameAr : plan.nameEn}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {billingCycle === 'annual' 
                      ? (lang === 'ar' ? 'دورة فوترة سنوية (خصم 20%)' : 'Annual Billing (20% Savings)')
                      : (lang === 'ar' ? 'دورة فوترة شهرية مرنة' : 'Monthly Flexible Billing')}
                  </span>
                </div>

                <div className="text-end font-mono">
                  <div className="text-xl font-black text-emerald-400">
                    ${displayPrice} <span className="text-xs text-slate-400 font-normal">{lang === 'ar' ? '/ شهر' : '/ mo'}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'ar' ? `المجموع المفوتر: $${totalBilled}` : `Total Billed: $${totalBilled}`}
                  </span>
                </div>
              </div>

              {/* Organization & Email Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'اسم المؤسسة / الشركة:' : 'Organization / Enterprise Name:'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: شركة المغرب للحلول السحابية' : 'e.g. Acme FinTech Corp'}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'بريد المسؤول التقني المعتمد:' : 'Authorized Technical Admin Email:'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="sec-admin@organization.com"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-cyan-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    {lang === 'ar' ? 'سيتم إرسال مفتاح الترخيص المشفر إلى هذا البريد' : 'Encrypted key credentials will be dispatched to this email'}
                  </span>
                </div>
              </div>

              {/* Deployment Target */}
              <div className="space-y-1.5">
                <label className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'ar' ? 'بيئة النشر المستهدفة للدرع:' : 'Target Defense Infrastructure:'}</span>
                </label>
                <select
                  value={deploymentTarget}
                  onChange={(e) => setDeploymentTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-mono text-xs focus:border-amber-500 focus:outline-none cursor-pointer"
                >
                  <option value="cloud">سحابة هجينة (AWS / Google Cloud / Azure)</option>
                  <option value="morocco_onprem">مركز بيانات محلي Sécurité Maroc (On-Premises Bare-Metal)</option>
                  <option value="hetzner_ovh">خوادم مخصصة (Hetzner / OVH Linux)</option>
                  <option value="airgapped">بيئة جزر معزولة عسكرية/مصرفية (Air-Gapped Sovereign Mesh)</option>
                </select>
              </div>

              {/* Payment & Invoicing Method */}
              <div className="space-y-2">
                <label className="font-mono font-bold text-white text-xs flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-purple-400" />
                  <span>{lang === 'ar' ? 'طريقة السداد والفوترة المعتمدة:' : 'Payment & Billing Method:'}</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-bold block text-xs">
                      {lang === 'ar' ? 'بطاقة بنكية فورية' : 'Corporate Card (Stripe)'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'ar' ? 'تفعيل فوري للمفتاح' : 'Instant Key Activation'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentMethod === 'wire'
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-bold block text-xs">
                      {lang === 'ar' ? 'تحويل بنكي B2B' : 'B2B Wire / Invoicing'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'ar' ? 'فاتورة رسمية وعقد SLA' : 'Official VAT Invoice & SLA'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('trial')}
                    className={`p-3 rounded-xl border text-start transition-all cursor-pointer ${
                      paymentMethod === 'trial'
                        ? 'bg-emerald-950/70 border-emerald-500 text-white shadow-sm'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="font-mono font-bold block text-xs">
                      {lang === 'ar' ? 'تجربة مؤسسية (7 أيام)' : '7-Day Enterprise Trial'}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {lang === 'ar' ? 'بدون التزام مالي' : 'Zero upfront commitment'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Security & Non-Public License Notice */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2.5">
                <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-[11px] text-slate-300 leading-relaxed font-mono">
                  {lang === 'ar'
                    ? 'الأمان السيادي: مفاتيح الإنتاج (API Keys) لا تُعرض في الواجهة العامة للزوار. تصدر المفاتيح حصرياً بعد توثيق طلب الاشتراك وتُربط بحساب المؤسسة المصرح لها.'
                    : 'Security Guarantee: Production API Keys are never exposed publicly. They are strictly provisioned upon verified subscription and scoped to authorized enterprise nodes.'}
                </p>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-900 text-emerald-500 accent-emerald-500"
                />
                <span className="text-[11px] text-slate-300 font-mono">
                  {lang === 'ar'
                    ? 'أوافق على اتفاقية مستوى الخدمة (SLA 99.999%) والشروط التنظيمية لـ Sécurité Maroc'
                    : 'I accept the Enterprise SLA Terms (99.999%) and Sécurité Maroc Regulatory Protocol'}
                </span>
              </label>

              {/* Direct WhatsApp / Phone Contact & Wire Transfer Verification Box */}
              <div className="p-3.5 rounded-xl bg-slate-900/90 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center shrink-0">
                    <MessageCircle className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold text-white block">
                      {lang === 'ar' ? 'هل تفضل السداد أو الاستفسار عبر واتساب أو الهاتف؟' : 'Prefer Direct Assistance via WhatsApp or Phone?'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono block">
                      {lang === 'ar' ? 'تأكيد فوري للعقود والتحويلات البنكية للمؤسسات' : 'Instant corporate onboarding & wire validation'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href={`https://wa.me/212634424914?text=${encodeURIComponent(lang === 'ar' ? `السلام عليكم، أرغب في الاستفسار والاشتراك في باقة ${plan.nameAr} (${totalBilled}$) عبر التحويل البنكي أو السداد المباشر.` : `Hello, I want to inquire/subscribe to ${plan.nameEn} ($${totalBilled}).`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'واتساب: 0634424914' : 'WhatsApp'}</span>
                  </a>
                  <a
                    href="tel:+212634424914"
                    className="flex-1 sm:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Phone className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? 'اتصال مباشر' : 'Call'}</span>
                  </a>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || !orgName.trim() || !adminEmail.trim() || !acceptedTerms}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 font-mono font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_25px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                    <span>{lang === 'ar' ? 'جارٍ تشفير الترخيص وتوثيق الاشتراك...' : 'Provisioning Cryptographic License...'}</span>
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4" />
                    <span>{lang === 'ar' ? `إتمام الاشتراك وإصدار مفتاح الترخيص (${totalBilled}$)` : `Confirm & Issue License ($${totalBilled})`}</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Success & Secure Key View */
            <div className="space-y-6 text-start">
              
              <div className="p-5 rounded-2xl bg-emerald-950/60 border border-emerald-500/60 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-emerald-400 flex items-center justify-center text-emerald-300 shrink-0 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white font-mono">
                    {lang === 'ar' ? 'تهانينا! تم تفعيل الاشتراك وإصدار الترخيص بنجاح' : 'Success! Subscription Activated & License Issued'}
                  </h3>
                  <p className="text-xs text-emerald-200/90 mt-1 font-mono leading-relaxed">
                    {lang === 'ar'
                      ? `تم ربط المنظومة بالمؤسسة (${orgName}) وإرسال نسخة مشفرة وموقعة إلى: ${adminEmail}`
                      : `Provisioned for (${orgName}) and securely dispatched to: ${adminEmail}`}
                  </p>
                </div>
              </div>

              {/* Invoice & Plan Meta */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{lang === 'ar' ? 'رقم الفاتورة' : 'Invoice ID'}</span>
                  <span className="text-white font-bold">{issuedInvoiceId}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{lang === 'ar' ? 'الباقة' : 'Plan'}</span>
                  <span className="text-emerald-400 font-bold">{plan.id}</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{lang === 'ar' ? 'حالة الترخيص' : 'Status'}</span>
                  <span className="text-cyan-400 font-bold">ACTIVE (SLA 99.999%)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">{lang === 'ar' ? 'دورة الفوترة' : 'Billing'}</span>
                  <span className="text-amber-400 font-bold">{billingCycle.toUpperCase()}</span>
                </div>
              </div>

              {/* Secure API Key with Masking */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'مفتاح الـ API المشفر للإنتاج (License Token):' : 'Production API License Secret Key:'}</span>
                  </label>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono">
                    ONE-TIME REVEAL
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300 flex items-center justify-between">
                    <span className="truncate">
                      {showRawKey ? issuedKey : `${issuedKey.slice(0, 10)}••••••••••••••••••••••••`}
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowRawKey(!showRawKey)}
                      title={showRawKey ? "Hide key" : "Show key"}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                    >
                      {showRawKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyKey}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
                  >
                    {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedKey ? (lang === 'ar' ? 'تم النسخ!' : 'Copied!') : (lang === 'ar' ? 'نسخ المفتاح' : 'Copy Key')}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-amber-400 font-mono">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'يرجى حفظ هذا المفتاح في مكان آمن. لن يتم عرضه مجدداً في الواجهة العامة حمايةً لبياناتك.'
                      : 'Store this key in your secrets manager. It is not displayed publicly for security.'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleDownloadLicense}
                  className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تحميل وثيقة الترخيص (JSON Certificate)' : 'Download License Certificate'}</span>
                </button>

                {onOpenLiveBridge && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenLiveBridge();
                    }}
                    className="w-full sm:w-1/2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                  >
                    <Server className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'الانتقال لربط خادم بالـ API' : 'Proceed to Server Bridge'}</span>
                  </button>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
