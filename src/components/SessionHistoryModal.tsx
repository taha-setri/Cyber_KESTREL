import React, { useState, useEffect } from 'react';
import { 
  X, 
  History, 
  Download, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  Save, 
  Clock, 
  TrendingUp, 
  FileText 
} from 'lucide-react';
import { SessionSnapshot, CommandCenterKPIs, DefconLevel } from '../types/cyber';
import { 
  getStoredSessionSnapshots, 
  saveSessionSnapshot, 
  clearSessionSnapshots 
} from '../services/sessionHistory';
import { generateCryptoHash } from '../services/autonomousEngine';

interface SessionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
  kpis: CommandCenterKPIs;
  defconLevel: DefconLevel;
}

export const SessionHistoryModal: React.FC<SessionHistoryModalProps> = ({
  isOpen,
  onClose,
  lang,
  kpis,
  defconLevel
}) => {
  const [snapshots, setSnapshots] = useState<SessionSnapshot[]>([]);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      loadSnapshots();
    }
  }, [isOpen]);

  const loadSnapshots = () => {
    const list = getStoredSessionSnapshots();
    setSnapshots(list);
  };

  const handleManualSave = () => {
    const merkleRoot = generateCryptoHash('SESSION_ROOT', `${Date.now()}_${kpis.mitigationsCount}`);
    saveSessionSnapshot(kpis, defconLevel, merkleRoot, `Operator Audit Snapshot @ ${new Date().toLocaleTimeString()}`);
    loadSnapshots();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleClear = () => {
    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من مسح جميع السجلات التاريخية المحفوظة؟' : 'Are you sure you want to clear all historical session snapshots?')) {
      clearSessionSnapshots();
      setSnapshots([]);
    }
  };

  const handleExportAllHistory = () => {
    const blob = new Blob([JSON.stringify(snapshots, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ACDC-Historical-Audit-Ledger-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-cyber text-xs">
      <div className="relative w-full max-w-4xl max-h-[85vh] rounded-xl border border-cyan-500/40 bg-[#090d16] p-6 shadow-2xl overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-slate-100 font-display-cyber uppercase">
                {lang === 'ar' ? 'أرشيف وتاريخ الجلسات السابقة (Session Audit Archive)' : 'PERSISTENT SESSION AUDIT ARCHIVE'}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {lang === 'ar' 
                  ? 'سجلات تاريخية محفوظة محلياً لمقارنة كفاءة وسرعة التحييد عبر الزمن'
                  : 'Immutable session records stored in browser storage for longitudinal resilience tracking'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSave}
              className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-bold transition-all cursor-pointer ${
                savedSuccess
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-cyan-950/80 border-cyan-500/50 hover:bg-cyan-900 text-cyan-300 hover:text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'تم الحفظ!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'حفظ لقطة حالية' : 'Save Current Snapshot'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleExportAllHistory}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Download all history as JSON"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={handleClear}
              className="p-1.5 rounded bg-slate-800 hover:bg-red-900/50 text-slate-400 hover:text-red-400 transition-colors cursor-pointer"
              title="Clear all saved snapshots"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Current Live Session Quick Card */}
        <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[10px] text-cyan-400 font-bold uppercase">LIVE SESSION IN PROGRESS</span>
            <div className="text-xs text-slate-200 font-bold mt-0.5">
              Active Defense Engine &bull; {kpis.efficacyIndex}% AEI
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono-cyber">
            <div>
              <span className="text-slate-500 text-[10px]">MTTD: </span>
              <strong className="text-amber-400">{kpis.mttdMs}ms</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">MTTR: </span>
              <strong className="text-emerald-400">{kpis.mttrSec}s</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px]">Mitigations: </span>
              <strong className="text-cyan-400">{kpis.mitigationsCount}</strong>
            </div>
          </div>
        </div>

        {/* Snapshots Table */}
        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-left text-[11px]">
            <thead className="bg-slate-900 text-slate-400 text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-2.5">Snapshot ID</th>
                <th className="p-2.5">Recorded Date/Time</th>
                <th className="p-2.5">AEI Efficacy</th>
                <th className="p-2.5">MTTD (ms)</th>
                <th className="p-2.5">MTTR (sec)</th>
                <th className="p-2.5">Mitigations</th>
                <th className="p-2.5">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {snapshots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    {lang === 'ar' 
                      ? 'لا توجد لقطات تاريخية محفوظة. اضغط على "حفظ لقطة حالية" لأرشفة وضع النظام الحالي.' 
                      : 'No historical session snapshots stored yet. Click "Save Current Snapshot" above to create an audit record.'}
                  </td>
                </tr>
              ) : (
                snapshots.map((snap, idx) => (
                  <tr key={`${snap.id}-${idx}`} className="hover:bg-slate-900/40">
                    <td className="p-2.5 font-bold text-cyan-400 font-mono-cyber">{snap.id}</td>
                    <td className="p-2.5 text-slate-300">{snap.formattedDate}</td>
                    <td className="p-2.5 text-emerald-400 font-bold">{snap.efficacyIndex}%</td>
                    <td className="p-2.5 text-amber-400">{snap.mttdMs} ms</td>
                    <td className="p-2.5 text-slate-300">{snap.mttrSec}s</td>
                    <td className="p-2.5 text-purple-300 font-bold">{snap.totalMitigations}</td>
                    <td className="p-2.5 text-slate-400 max-w-xs truncate">{snap.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-[10px] text-slate-500">
            Total Stored Records: {snapshots.length}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
          >
            {lang === 'ar' ? 'إغلاق الأرشيف' : 'Close Archive'}
          </button>
        </div>

      </div>
    </div>
  );
};
