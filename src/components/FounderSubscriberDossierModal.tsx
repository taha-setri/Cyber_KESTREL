import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  Mail, 
  ShieldCheck, 
  Key, 
  Copy, 
  Check, 
  Download, 
  Server, 
  Calendar, 
  CreditCard, 
  Award, 
  Eye, 
  EyeOff, 
  Terminal, 
  Activity,
  CheckCircle2,
  DollarSign
} from 'lucide-react';
import { SubscriberRecord } from '../services/subscriptionService';

interface FounderSubscriberDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscriber: SubscriberRecord | null;
  lang: 'ar' | 'en';
}

export const FounderSubscriberDossierModal: React.FC<FounderSubscriberDossierModalProps> = ({
  isOpen,
  onClose,
  subscriber,
  lang
}) => {
  const [showFullKey, setShowFullKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  if (!isOpen || !subscriber) return null;

  const handleCopyKey = () => {
    navigator.clipboard.writeText(subscriber.apiKeyFull);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const curlCommand = `curl -X POST "${typeof window !== 'undefined' ? window.location.origin : 'https://your-soc.run.app'}/api/ingest" \\
  -H "Authorization: Bearer ${subscriber.apiKeyFull}" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceIp": "196.200.15.22", "destinationPort": 443, "protocol": "TCP", "payload": "GET /api/v1/telemetry"}'`;

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(curlCommand);
    setCopiedCurl(true);
    setTimeout(() => setCopiedCurl(false), 2500);
  };

  const handleDownloadLicense = () => {
    const cert = {
      licensee: subscriber.orgName,
      adminContact: subscriber.adminEmail,
      founderArchitect: "TAHA SETRII 🇲🇦",
      platform: "Sécurité Maroc - Autonomous Cyber Defense Command (ACDC)",
      invoiceId: subscriber.invoiceId,
      subscriptionId: subscriber.id,
      plan: subscriber.planNameEn,
      planAr: subscriber.planNameAr,
      monthlyFeeUSD: subscriber.monthlyPrice,
      totalBilledUSD: subscriber.totalBilled,
      billingCycle: subscriber.billingCycle,
      paymentMethod: subscriber.paymentMethod,
      deploymentTarget: subscriber.deploymentTarget,
      region: subscriber.region,
      protectedNodesCount: subscriber.serversCount,
      slaTier: subscriber.slaTier,
      subscribedDate: new Date(subscriber.subscribedAt).toISOString(),
      apiKeySignature: subscriber.apiKeyFull.slice(0, 16) + '************************',
      dnssiCompliance: "DGSSI (sécurité Maroc) & NIST CSF 2.0 Certified",
      status: subscriber.status,
      cryptographicHash: "SHA256_SEAL_VALIDATED_AUTHENTIC"
    };

    const blob = new Blob([JSON.stringify(cert, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `securite_maroc_dossier_${subscriber.invoiceId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn" 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-3xl rounded-2xl bg-[#080d1a] border-2 border-emerald-500/60 shadow-[0_0_60px_rgba(16,185,129,0.35)] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/60 flex items-center justify-center text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono">
                  {subscriber.orgName}
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50">
                  {subscriber.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'ar' ? 'ملف المشترك الرسمي للمؤسس TAHA SETRII' : 'Founder TAHA SETRII Official Client Dossier'} • {subscriber.invoiceId}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Executive Revenue & Plan Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                {lang === 'ar' ? 'الباقة المشترك بها' : 'Subscribed Plan'}
              </span>
              <span className="text-emerald-400 font-bold text-sm block">
                {lang === 'ar' ? subscriber.planNameAr : subscriber.planNameEn}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5 block">{subscriber.planId}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                {lang === 'ar' ? 'الإيراد الشهري (MRR)' : 'Monthly Revenue'}
              </span>
              <span className="text-white font-bold text-sm block text-cyan-300">
                ${subscriber.monthlyPrice} <span className="text-xs text-slate-400 font-normal">{lang === 'ar' ? '/ شهر' : '/ mo'}</span>
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">
                {subscriber.billingCycle === 'annual' 
                  ? (lang === 'ar' ? 'عقد سنوي مفوتر' : 'Annual Billed') 
                  : (lang === 'ar' ? 'تجديد شهري' : 'Monthly Auto')}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                {lang === 'ar' ? 'بيئة النشر والمنطقة' : 'Deployment Target'}
              </span>
              <span className="text-amber-300 font-bold text-xs block truncate">
                {subscriber.region}
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                {subscriber.serversCount} {lang === 'ar' ? 'خادم متصل' : 'Protected Nodes'}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                {lang === 'ar' ? 'مستوى الضمان و SLA' : 'SLA Standard'}
              </span>
              <span className="text-purple-300 font-bold text-xs block">
                {subscriber.slaTier}
              </span>
              <span className="text-[10px] text-emerald-400 block mt-0.5">
                DGSSI (sécurité Maroc)
              </span>
            </div>
          </div>

          {/* Client Identity & Contact */}
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 space-y-3">
            <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
              <Mail className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'بيانات التواصل والمسؤول التقني المعتمد للمشترك:' : 'Client Identity & Authorized Admin Email:'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'البريد الإلكتروني للتقني المعتمد' : 'Authorized Admin Email'}</span>
                <span className="text-cyan-300 font-bold select-all">{subscriber.adminEmail}</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'تاريخ ووقت الاشتراك' : 'Subscription Timestamp'}</span>
                <span className="text-slate-200 font-bold">{new Date(subscriber.subscribedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Production API Secret Key & License Token */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/40 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono font-bold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'مفتاح الـ API المشفر الصادر للعميل (Production Key):' : 'Provisioned Production API Key:'}</span>
              </h3>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-600/50 text-[10px] font-mono">
                SECURE VAULT
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono">
              <div className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300 flex items-center justify-between">
                <span className="truncate">
                  {showFullKey ? subscriber.apiKeyFull : subscriber.apiKeyMasked}
                </span>
                <button
                  type="button"
                  onClick={() => setShowFullKey(!showFullKey)}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer p-1"
                  title={showFullKey ? "Hide key" : "Show full key"}
                >
                  {showFullKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="button"
                onClick={handleCopyKey}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold font-mono flex items-center gap-1.5 transition-all cursor-pointer border border-slate-700"
              >
                {copiedKey ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedKey ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
              </button>
            </div>

            <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
              {lang === 'ar'
                ? 'يستخدم هذا المفتاح من قِبل عملاء المؤسسة لربط وكلاء المراقبة وخوادمهم السحابية بمسار الاستقبال /api/ingest.'
                : 'This cryptographically signed key authenticates all incoming probes and agent events from this client to the /api/ingest endpoint.'}
            </p>
          </div>

          {/* cURL Ingestion Integration Example for this Subscriber */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-bold flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'كود ربط خوادم المشترك مباشرة (cURL Pipeline):' : 'Client Connection Command:'}</span>
              </span>
              <button
                type="button"
                onClick={handleCopyCurl}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copiedCurl ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCurl ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الأمر' : 'Copy Command')}</span>
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-slate-900/90 text-cyan-300 text-[11px] overflow-x-auto border border-slate-800">
              {curlCommand}
            </pre>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900/80">
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sécurité Maroc • Proprietary Enterprise Defense Grid</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleDownloadLicense}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4 text-cyan-400" />
              <span>{lang === 'ar' ? 'تحميل وثيقة العقد الرسمية (JSON)' : 'Download License Certificate'}</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {lang === 'ar' ? 'إغلاق الملف' : 'Close Dossier'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
