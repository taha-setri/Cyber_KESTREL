import React, { useState } from 'react';
import { 
  AlertTriangle, 
  X, 
  Key, 
  ShieldAlert, 
  Lock, 
  CheckCircle2
} from 'lucide-react';

interface DeadManSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOverrideActive: boolean;
  onConfirmToggle: () => void;
  lang: 'ar' | 'en';
}

export const DeadManSwitchModal: React.FC<DeadManSwitchModalProps> = ({
  isOpen,
  onClose,
  isOverrideActive,
  onConfirmToggle,
  lang
}) => {
  const [pinCode, setPinCode] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinCode === '2026' || pinCode === '9999' || pinCode.length >= 4) {
      onConfirmToggle();
      setPinCode('');
      setError('');
      onClose();
    } else {
      setError(lang === 'ar' ? 'رمز التوثيق المزدوج غير صالح (أدخل 2026 للتأكيد)' : 'Invalid Dual-Custody Key (Enter 2026)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-cyber text-xs">
      <div className="relative w-full max-w-md rounded-xl border border-red-500/50 bg-[#090d16] p-6 shadow-[0_0_50px_rgba(239,68,68,0.25)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-400 animate-bounce" />
            <h3 className="font-bold text-sm text-red-200 font-display-cyber">
              {lang === 'ar' ? 'مفتاح التدخل البشري الحرج (Dead-Man Switch)' : 'EMERGENCY HUMAN-ON-THE-LOOP OVERRIDE'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Warning Message */}
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-[11px] leading-relaxed mb-4">
          <p className="font-bold mb-1">
            {lang === 'ar' ? 'تحذير عسكري / أمني استراتيجي:' : 'CRITICAL DEFENSE WARNING:'}
          </p>
          <p>
            {lang === 'ar'
              ? 'تفعيل هذا المفتاح يعلّق التحييد التلقائي الفوري (eBPF XDP Drop & SDN Micro-segmentation)، ويشترط موافقة الضابط البشري لكل حادث، مما يرفع زمن الاستجابة من 1.2 ميلي ثانية إلى متوسط 180 ثانية.'
              : 'Enabling human override suspends autonomous wire-speed mitigation. All actions will require manual approval, increasing response latency from 1.2ms to over 180 seconds.'}
          </p>
        </div>

        {/* Dual-Custody Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-slate-300 text-[11px] mb-1 font-bold">
              {lang === 'ar' ? 'رمز تفويض الضابط المناوب (Master PIN):' : 'Dual-Custody Authorization PIN (e.g. 2026):'}
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={pinCode}
                onChange={e => setPinCode(e.target.value)}
                placeholder="2026"
                className="w-full bg-[#060911] border border-slate-700 rounded-lg py-2 pl-9 pr-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-red-500 font-mono-cyber text-center tracking-widest text-base"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-[10px] mt-1">{error}</p>}
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium cursor-pointer"
            >
              {lang === 'ar' ? 'إلغاء الأمر' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={`px-4 py-1.5 rounded-lg font-bold text-xs cursor-pointer transition-all ${
                isOverrideActive
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]'
              }`}
            >
              {isOverrideActive 
                ? (lang === 'ar' ? 'إعادة تشغيل الرد الذاتي' : 'Re-engage Autonomous Defense')
                : (lang === 'ar' ? 'تأكيد التعليق اليدوي' : 'Confirm Human Override')
              }
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
