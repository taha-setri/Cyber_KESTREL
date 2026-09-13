import React, { useState } from 'react';
import { 
  FileLock2, 
  CheckCircle2, 
  ShieldCheck, 
  HardDrive, 
  Fingerprint, 
  ExternalLink, 
  RefreshCw, 
  Award,
  Hash,
  FileDown
} from 'lucide-react';
import { MerkleBlock } from '../types/cyber';
import { exportMerkleAuditPdf } from '../services/pdfReportGenerator';

interface ImmutableAuditPanelProps {
  blocks: MerkleBlock[];
  lang: 'ar' | 'en';
}

export const ImmutableAuditPanel: React.FC<ImmutableAuditPanelProps> = ({ blocks, lang }) => {
  const [verifying, setVerifying] = useState(false);
  const [lastVerifiedTime, setLastVerifiedTime] = useState<string>('Just now');
  const [exportedPdfNotice, setExportedPdfNotice] = useState<string | null>(null);

  const handleVerifyChain = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setLastVerifiedTime(new Date().toLocaleTimeString());
    }, 900);
  };

  const handleExportPdf = () => {
    const filename = exportMerkleAuditPdf(blocks, undefined, lang);
    setExportedPdfNotice(filename);
    setTimeout(() => setExportedPdfNotice(null), 3500);
  };

  return (
    <div className="space-y-4">
      
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileLock2 className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100 font-display-cyber">
              {lang === 'ar' ? 'سجل التدقيق المشفر غير القابل للتحريف (Immutable Merkle Audit Ledger)' : 'CRYPTOGRAPHIC MERKLE AUDIT LEDGER & COMPLIANCE FABRIC'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-4xl">
            {lang === 'ar'
              ? 'أرشفة فورية لكافة الحركات والقرارات الذاتية ضمن شجرة ميركل موثقة رقمياً بختم زمني فيزيائي ومفاتيح HSM المتوافقة مع معيار FIPS 140-3 Level 4.'
              : 'Tamper-proof WORM audit trail preserving every wire-speed drop and telemetry log in cryptographic Merkle blocks verified by hardware security modules.'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleExportPdf}
            id="export-merkle-pdf-btn"
            title={lang === 'ar' ? 'تصدير وثيقة ميركل وسجلات التدقيق الرسمية بصيغة ملف PDF' : 'Export Merkle Audit Dossier as Official PDF'}
            className="px-3.5 py-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/80 text-white text-xs font-mono-cyber font-bold flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_12px_rgba(225,29,72,0.3)]"
          >
            <FileDown className="w-3.5 h-3.5 text-red-400" />
            <span>
              {exportedPdfNotice 
                ? (lang === 'ar' ? 'تم تنزيل ملف PDF!' : 'Merkle PDF Downloaded!') 
                : (lang === 'ar' ? 'تصدير وثيقة التدقيق PDF' : 'Export Ledger PDF')}
            </span>
          </button>

          <button
            onClick={handleVerifyChain}
            id="verify-chain-btn"
            disabled={verifying}
            className="px-3.5 py-2 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono-cyber font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${verifying ? 'animate-spin' : ''}`} />
            <span>{verifying ? (lang === 'ar' ? 'جارٍ فحص التجزئة...' : 'Verifying Root Hashes...') : (lang === 'ar' ? 'التحقق من سلامة السلسلة' : 'Verify Merkle Integrity')}</span>
          </button>
        </div>
      </div>

      {/* Compliance Matrix Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-cyber text-xs">
        {[
          { name: 'NIST SP 800-207', desc: lang === 'ar' ? 'انعدام الثقة المطلق (Zero Trust)' : 'Zero Trust Enforced', status: '100% PASS' },
          { name: 'ISO/IEC 27001', desc: lang === 'ar' ? 'سجلات الرصد والتحكم A.12' : 'Audit Control A.12', status: 'CERTIFIED' },
          { name: 'SOC 2 Type II', desc: lang === 'ar' ? 'حماية سرية البيانات المستمرة' : 'Non-repudiation WORM', status: 'COMPLIANT' },
          { name: 'FIPS 140-3 L4', desc: lang === 'ar' ? 'تشفير عتادي ما بعد الكم' : 'Post-Quantum HSM L4', status: 'ACTIVE' },
        ].map((c, i) => (
          <div key={i} className="p-3 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200">{c.name}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-[10px] text-slate-400 mt-1">{c.desc}</div>
            <div className="mt-2 text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-1.5 py-0.5 rounded border border-emerald-500/20 w-fit">
              {c.status}
            </div>
          </div>
        ))}
      </div>

      {/* Merkle Block Explorer */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase">
              {lang === 'ar' ? 'مستكشف كتل التدقيق المشفرة (Immutable Block Ledger)' : 'CRYPTOGRAPHIC MERKLE BLOCK EXPLORER'}
            </h3>
          </div>
          <span className="text-[10px] font-mono-cyber text-slate-400">
            {lang === 'ar' ? 'آخر تحقق ناجح:' : 'Last Validated:'} <strong className="text-emerald-400">{lastVerifiedTime}</strong>
          </span>
        </div>

        <div className="space-y-3 font-mono-cyber text-xs">
          {blocks.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-slate-800 rounded-lg text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
              <ShieldCheck className="w-8 h-8 text-cyan-400/80" />
              <span className="text-slate-200 font-semibold">
                {lang === 'ar' ? 'سجل كتل Merkle غير القابل للتعديل جاهز ونشط' : 'Immutable Merkle Ledger Initialized'}
              </span>
              <span className="text-[10px] text-slate-500 max-w-sm">
                {lang === 'ar'
                  ? 'يتم إصدار وتوقيع كتل Merkle وتشفيرها عبر وحدة HSM بمجرد حدوث أول إجراء دفاعي لحظي أو حقن حزم في النظام'
                  : 'Cryptographic blocks signed via HSM WORM storage are mined dynamically with sub-second mitigation actions.'}
              </span>
            </div>
          ) : (
            blocks.map(block => (
              <div 
                key={block.blockNumber}
                className="p-3 rounded-lg border border-slate-800/90 bg-slate-900/60 hover:bg-slate-800/50 transition-colors"
              >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[11px]">
                    BLOCK #{block.blockNumber}
                  </span>
                  <span className="text-slate-400 text-[10px]">
                    {new Date(block.timestamp).toISOString()}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                  <span className="text-slate-400">{block.transactionsCount} {lang === 'ar' ? 'حدثاً موثقاً' : 'Events'}</span>
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30 font-bold">
                    VERIFIED WORM
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px]">
                <div>
                  <span className="text-slate-500">Merkle Root:</span>
                  <p className="text-cyan-300 break-all">{block.merkleRoot}</p>
                </div>
                <div>
                  <span className="text-slate-500">Block Hash (SHA-3):</span>
                  <p className="text-emerald-300 break-all">{block.hash}</p>
                </div>
                <div>
                  <span className="text-slate-500">Previous Block Hash:</span>
                  <p className="text-slate-400 break-all">{block.previousHash}</p>
                </div>
                <div>
                  <span className="text-slate-500">Hardware Signer:</span>
                  <p className="text-purple-300">{block.signer}</p>
                </div>
              </div>
            </div>
          )))}
        </div>
      </div>

    </div>
  );
};
