import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  ShieldCheck, 
  FileText, 
  Award, 
  CheckCircle2, 
  Lock,
  Zap,
  FileCode,
  FileSpreadsheet,
  FileDown
} from 'lucide-react';
import { CommandCenterKPIs, ThreatVector, DefenseActionLog } from '../types/cyber';
import { 
  exportExecutiveHtmlReport, 
  exportExecutiveJsonReport, 
  exportExecutiveCsvReport, 
  exportExecutiveMarkdownReport,
  exportOfflineIncidentReviewJson,
  ReportExportFormat
} from '../services/executiveReportExporter';
import { exportExecutiveReportPdf } from '../services/pdfReportGenerator';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kpis: CommandCenterKPIs;
  threats: ThreatVector[];
  defenseLogs?: DefenseActionLog[];
  lang: 'ar' | 'en';
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({
  isOpen,
  onClose,
  kpis,
  threats,
  defenseLogs = [],
  lang
}) => {
  const [exportedType, setExportedType] = useState<ReportExportFormat | 'pdf' | null>(null);
  const [lastExportedFilename, setLastExportedFilename] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleExportPdf = () => {
    const filename = exportExecutiveReportPdf(kpis, threats, defenseLogs, lang);
    setLastExportedFilename(filename);
    setExportedType('pdf');
    setTimeout(() => setExportedType(null), 3500);
  };

  const handleDownloadReport = () => {
    const filename = exportOfflineIncidentReviewJson(kpis, threats, defenseLogs);
    setLastExportedFilename(filename);
    setExportedType('json');
    setTimeout(() => setExportedType(null), 3500);
  };

  const handleExportHtml = () => {
    const filename = exportExecutiveHtmlReport(kpis, threats, defenseLogs, lang);
    setLastExportedFilename(filename);
    setExportedType('html');
    setTimeout(() => setExportedType(null), 3500);
  };

  const handleExportJson = () => {
    handleDownloadReport();
  };

  const handleExportCsv = () => {
    const filename = exportExecutiveCsvReport(kpis, threats, defenseLogs);
    setLastExportedFilename(filename);
    setExportedType('csv');
    setTimeout(() => setExportedType(null), 3500);
  };

  const handleExportMarkdown = () => {
    const filename = exportExecutiveMarkdownReport(kpis, threats, defenseLogs);
    setLastExportedFilename(filename);
    setExportedType('md');
    setTimeout(() => setExportedType(null), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md font-mono-cyber text-xs">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-xl border border-cyan-500/40 bg-[#090d16] p-6 shadow-2xl overflow-y-auto">
        
        {/* Modal Controls Top */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 mb-4 gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            <h2 className="font-bold text-sm text-slate-100 font-display-cyber uppercase">
              {lang === 'ar' ? 'تقرير العمليات والمرونة السيبرانية التنفيذي' : 'EXECUTIVE RESILIENCE & AUTONOMOUS DEFENSE AUDIT REPORT'}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {/* Primary Sovereign PDF Report Export Button */}
            <button
              id="top-export-pdf-btn"
              data-testid="top-export-pdf-btn"
              onClick={handleExportPdf}
              className={`px-3 py-1 rounded-lg border text-[11px] font-mono-cyber font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                exportedType === 'pdf'
                  ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-red-500 text-white shadow-[0_0_12px_rgba(225,29,72,0.35)]'
              }`}
              title={lang === 'ar' ? 'تصدير التقرير التنفيذي فورياً بصيغة PDF احترافي معتمد' : 'Export official Sovereign Executive Report directly as formatted PDF'}
            >
              <FileDown className="w-3.5 h-3.5 text-white" />
              <span>{exportedType === 'pdf' ? (lang === 'ar' ? 'تم تنزيل PDF!' : 'PDF Downloaded!') : (lang === 'ar' ? 'تصدير وثيقة PDF الرسمية' : 'Export Official PDF')}</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-black/40 text-red-200 uppercase font-mono">
                PDF
              </span>
            </button>

            {/* Download Report Button (Primary Offline JSON Incident Review) */}
            <button
              id="top-download-report-btn"
              data-testid="top-download-report-btn"
              onClick={handleDownloadReport}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
                exportedType === 'json'
                  ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white shadow-[0_0_10px_rgba(37,99,235,0.3)]'
              }`}
              title={lang === 'ar' ? 'تنزيل ملخص JSON لجميع سجلات الدفاع والتهديدات للمراجعة في وضع عدم الاتصال' : 'Download JSON summary of all current defenseLogs and threats for offline incident review'}
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>{exportedType === 'json' ? (lang === 'ar' ? 'تم التنزيل!' : 'Report Downloaded!') : (lang === 'ar' ? 'سجل JSON' : 'JSON')}</span>
            </button>

            {/* HTML Dossier Export (Auditing Format) */}
            <button
              id="top-export-html-btn"
              onClick={handleExportHtml}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono-cyber flex items-center gap-1 transition-all cursor-pointer shadow-sm ${
                exportedType === 'html'
                  ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-cyan-950/90 hover:bg-cyan-900 border-cyan-500/60 text-cyan-300 hover:text-white'
              }`}
              title={lang === 'ar' ? 'تنزيل ملف HTML التفاعلي للتدقيق التنفيذي وحفظ PDF' : 'Download Executive HTML Dossier (Self-contained, PDF-ready)'}
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>{exportedType === 'html' ? (lang === 'ar' ? 'تم HTML!' : 'HTML OK!') : (lang === 'ar' ? 'ملف HTML التنفيذي' : 'HTML Dossier')}</span>
            </button>

            {/* CSV Export */}
            <button
              id="top-export-csv-btn"
              onClick={handleExportCsv}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono-cyber flex items-center gap-1 transition-all cursor-pointer ${
                exportedType === 'csv'
                  ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Download CSV spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>{exportedType === 'csv' ? (lang === 'ar' ? 'تم CSV!' : 'CSV OK!') : 'CSV'}</span>
            </button>

            {/* Markdown Export */}
            <button
              id="top-export-md-btn"
              onClick={handleExportMarkdown}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-mono-cyber flex items-center gap-1 transition-all cursor-pointer ${
                exportedType === 'md'
                  ? 'bg-emerald-600/30 border-emerald-500/60 text-emerald-300 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Download Markdown Executive Briefing"
            >
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>{exportedType === 'md' ? (lang === 'ar' ? 'تم MD!' : 'MD OK!') : 'MD'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Print / Save as PDF"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Download Success Banner */}
        {exportedType && lastExportedFilename && (
          <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-300 font-mono-cyber animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'ar'
                  ? `تم تصدير تقرير التدقيق بنجاح: `
                  : `Audit report exported successfully: `}
                <strong className="text-white font-mono">{lastExportedFilename}</strong>
              </span>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold">VERIFIED HASH</span>
          </div>
        )}

        {/* Printable Report Sheet */}
        <div className="p-6 rounded-lg bg-[#060911] border border-slate-800 text-slate-300 space-y-6">
          
          {/* Report Header */}
          <div className="flex flex-wrap items-center justify-between border-b border-slate-800/80 pb-4">
            <div>
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">
                CLASSIFICATION: TOP SECRET // OPERATIONAL COMMAND
              </span>
              <h1 className="text-base font-bold text-slate-100 font-display-cyber mt-1">
                {lang === 'ar' ? 'تقرير الفعالية الدفاعية اللحظية للمؤسسة' : 'Autonomous Cyber-Defense Executive Audit Briefing'}
              </h1>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Target Architecture: Autonomous Cyber-Defense & Command Center (ACDC v4.2)
              </p>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
              <div>Time: <strong>{new Date().toLocaleTimeString()}</strong></div>
              <div>Signer: <strong className="text-purple-300">HSM-TIER4-MASTER-SIGNER</strong></div>
            </div>
          </div>

          {/* Offline Incident Review Summary Banner */}
          <div className="p-3.5 rounded-lg bg-blue-950/40 border border-blue-500/40 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-cyber">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <FileCode className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-blue-200 text-xs flex items-center gap-2">
                  <span>{lang === 'ar' ? 'حزمة مراجعة الحوادث في وضع عدم الاتصال' : 'Offline Incident Review Package'}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/80 text-blue-300 border border-blue-600/60 font-mono">
                    JSON SUMMARY
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {lang === 'ar'
                    ? `توليد تقرير JSON متكامل يشمل ${threats.length} تهديداً و ${defenseLogs.length} سجلاً دفاعياً للمراجعة الجنائية خارج الشبكة`
                    : `Encapsulates all ${threats.length} current threats and ${defenseLogs.length} autonomous defense logs for forensic incident review`}
                </p>
              </div>
            </div>
            <button
              id="inline-download-report-btn"
              onClick={handleDownloadReport}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[11px] flex items-center gap-1.5 transition-all cursor-pointer shadow-md hover:shadow-[0_0_12px_rgba(59,130,246,0.5)]"
              title="Download JSON summary of current defenseLogs and threats"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'تنزيل التقرير (JSON)' : 'Download Report'}</span>
            </button>
          </div>

          {/* KPI Dashboard Highlights */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase mb-2">
              {lang === 'ar' ? 'مؤشرات الأداء التشغيلي والزمني الحرج (Performance Metrics)' : '1. Operational Performance & Latency Metrics'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">MTTD (Detection):</div>
                <div className="text-amber-400 text-sm font-bold mt-1">{kpis.mttdMs} ms</div>
                <div className="text-[9px] text-slate-500">Benchmark: &lt; 250ms</div>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">MTTR (Mitigation):</div>
                <div className="text-emerald-400 text-sm font-bold mt-1">{kpis.mttrSec}s</div>
                <div className="text-[9px] text-slate-500">Benchmark: &lt; 1.5s</div>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">Efficacy (AEI):</div>
                <div className="text-cyan-400 text-sm font-bold mt-1">{kpis.efficacyIndex}%</div>
                <div className="text-[9px] text-slate-500">Target: &gt; 99.8%</div>
              </div>
              <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                <div className="text-slate-400 text-[10px]">False Positive Rate:</div>
                <div className="text-slate-200 text-sm font-bold mt-1">{kpis.falsePositiveRate}%</div>
                <div className="text-[9px] text-slate-500">Target: &lt; 0.001%</div>
              </div>
            </div>
          </div>

          {/* Threat Interception Log Table */}
          <div>
            <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase mb-2">
              {lang === 'ar' ? 'الحوادث والتهديدات التي تم تحييدها آلياً' : '2. Neutralized Threats & Containment Trace'}
            </h3>
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900 text-slate-400 text-[10px] border-b border-slate-800">
                  <tr>
                    <th className="p-2">Incident ID</th>
                    <th className="p-2">Threat Vector</th>
                    <th className="p-2">Ingress Source</th>
                    <th className="p-2">Actuator</th>
                    <th className="p-2">Confidence</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {threats.map((t, idx) => (
                    <tr key={`${t.id}-${idx}`} className="hover:bg-slate-900/40">
                      <td className="p-2 font-bold text-cyan-400">{t.id}</td>
                      <td className="p-2 text-slate-200">{lang === 'ar' ? t.titleAr : t.title}</td>
                      <td className="p-2 text-slate-400">{t.sourceIp}</td>
                      <td className="p-2 text-red-400">{t.actuatorUsed}</td>
                      <td className="p-2 text-emerald-400">{(t.bayesianConfidence * 100).toFixed(1)}%</td>
                      <td className="p-2 text-emerald-400 font-bold">{t.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Autonomous Mitigation Action Logs Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {lang === 'ar' 
                    ? `3. سجلات إجراءات التحييد الآلي فائق السرعة (${defenseLogs.length} إجراء)` 
                    : `3. Autonomous Sub-Second Mitigation Action Logs (${defenseLogs.length} Events)`}
                </span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono-cyber">
                {lang === 'ar' ? 'استجابة هاردوير eBPF/XDP' : 'Hardware Wire-Speed eBPF/XDP'}
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-800 rounded-lg max-h-48 overflow-y-auto">
              <table className="w-full text-left text-[11px]">
                <thead className="bg-slate-900 text-slate-400 text-[10px] border-b border-slate-800 sticky top-0">
                  <tr>
                    <th className="p-2">Action ID</th>
                    <th className="p-2">Threat Ref</th>
                    <th className="p-2">Actuator</th>
                    <th className="p-2">Target Filter</th>
                    <th className="p-2">Latency</th>
                    <th className="p-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {defenseLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-3 text-center text-slate-500">
                        {lang === 'ar' ? 'لم تُسجل إجراءات تحييد بعد' : 'No autonomous mitigation actions logged yet'}
                      </td>
                    </tr>
                  ) : (
                    defenseLogs.map((log, idx) => (
                      <tr key={`${log.id}-${idx}`} className="hover:bg-slate-900/40">
                        <td className="p-2 font-bold text-amber-400 font-mono-cyber">{log.id}</td>
                        <td className="p-2 text-cyan-400 font-mono-cyber">{log.threatId}</td>
                        <td className="p-2 text-slate-200">{log.actuator}</td>
                        <td className="p-2 text-slate-400 font-mono-cyber text-[10px] truncate max-w-xs">{log.target}</td>
                        <td className="p-2 text-emerald-400 font-bold font-mono-cyber">{log.executionTimeMs} ms</td>
                        <td className="p-2 text-emerald-400 font-bold text-[10px]">
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/30">
                            {log.status === 'EXECUTED_SUB_SECOND' ? 'SUB-SECOND' : log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Cryptographic Compliance Seal */}
          <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-300 text-xs">
                  {lang === 'ar' ? 'ختم التحقق المشفر وسلسلة ميركل الرسمية' : 'CRYPTOGRAPHIC MERKLE ROOT AUDIT SEAL'}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Root Hash: <span className="text-emerald-400 font-mono-cyber">0x9a8f4c2b1e0d3a776c5b4a39281726f5e4d3c2b1</span>
                </p>
                <p className="text-[10px] text-slate-400">
                  Standards Compliance: NIST SP 800-207 (Zero Trust), ISO 27001 (A.12), SOC 2 Type II
                </p>
              </div>
            </div>
            <div className="text-right text-[10px] text-slate-400">
              <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 font-bold">
                AUDITED & SECURE
              </span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono-cyber">
            <span className="text-cyan-400 font-bold">{threats.length} Threats</span>
            <span>&bull;</span>
            <span className="text-emerald-400 font-bold">{kpis.efficacyIndex}% AEI</span>
            <span>&bull;</span>
            <span className="text-amber-400 font-bold">{defenseLogs.length} Mitigations</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Primary Action: Official PDF Report Export */}
            <button
              id="footer-export-pdf-btn"
              data-testid="footer-export-pdf-btn"
              onClick={handleExportPdf}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono-cyber flex items-center gap-2 transition-all cursor-pointer border shadow-md ${
                exportedType === 'pdf'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 border-red-500 text-white shadow-[0_0_15px_rgba(225,29,72,0.4)]'
              }`}
              title={lang === 'ar' ? 'تصدير وثيقة التوثيق والتدقيق فورياً كملف PDF معتمد' : 'Export official executive audit report as formatted PDF'}
            >
              {exportedType === 'pdf' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>{lang === 'ar' ? 'تم تنزيل ملف PDF بنجاح!' : 'PDF Downloaded!'}</span>
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 text-white" />
                  <span>{lang === 'ar' ? 'تصدير وثيقة PDF الرسمية' : 'Export Official PDF Report'}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-rose-200 uppercase font-mono">
                    PDF (A4)
                  </span>
                </>
              )}
            </button>

            {/* Primary Action: 'Download Report' button triggering generation of JSON summary of defenseLogs and threats for offline review */}
            <button
              id="download-report-btn"
              data-testid="download-report-btn"
              onClick={handleDownloadReport}
              className={`px-4 py-2 rounded-lg text-xs font-bold font-mono-cyber flex items-center gap-2 transition-all cursor-pointer border shadow-md ${
                exportedType === 'json'
                  ? 'bg-emerald-600 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 border-blue-400 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
              }`}
              title={lang === 'ar' ? 'تنزيل ملخص JSON لجميع سجلات الدفاع والتهديدات للمراجعة في وضع عدم الاتصال' : 'Download JSON summary of all current defenseLogs and threats for offline incident review'}
            >
              {exportedType === 'json' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>{lang === 'ar' ? 'تم تنزيل التقرير!' : 'Report Downloaded!'}</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-white" />
                  <span>{lang === 'ar' ? 'تنزيل التقرير' : 'Download Report'}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/40 border border-white/20 text-cyan-200 uppercase font-mono">
                    JSON
                  </span>
                </>
              )}
            </button>

            {/* Action: HTML Executive Audit Dossier */}
            <button
              id="export-current-session-report-html-btn"
              onClick={handleExportHtml}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer shadow-md ${
                exportedType === 'html'
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : 'bg-slate-800 hover:bg-slate-700 border border-slate-700 text-cyan-300 hover:text-white'
              }`}
              title={lang === 'ar' ? 'تصدير وثيقة HTML التدقيقية وحفظ PDF' : 'Export Executive HTML Dossier'}
            >
              {exportedType === 'html' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-100" />
                  <span>{lang === 'ar' ? 'تم تنزيل HTML!' : 'Exported HTML!'}</span>
                </>
              ) : (
                <>
                  <FileCode className="w-4 h-4 text-cyan-400" />
                  <span>{lang === 'ar' ? 'تصدير وثيقة HTML التدقيقية' : 'Export HTML Dossier'}</span>
                </>
              )}
            </button>

            {/* CSV Button */}
            <button
              id="footer-export-csv-btn"
              onClick={handleExportCsv}
              className={`px-3 py-2 rounded-lg text-xs font-bold font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer border ${
                exportedType === 'csv'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>{exportedType === 'csv' ? (lang === 'ar' ? 'تم CSV!' : 'Exported CSV!') : (lang === 'ar' ? 'تصدير CSV' : 'Export CSV')}</span>
            </button>

            {/* Markdown Button */}
            <button
              id="footer-export-md-btn"
              onClick={handleExportMarkdown}
              className={`px-3 py-2 rounded-lg text-xs font-bold font-mono-cyber flex items-center gap-1.5 transition-all cursor-pointer border ${
                exportedType === 'md'
                  ? 'bg-emerald-600 border-emerald-500 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-200 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4 text-purple-400" />
              <span>{exportedType === 'md' ? (lang === 'ar' ? 'تم MD!' : 'Exported MD!') : (lang === 'ar' ? 'تقرير Markdown' : 'Export MD')}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer"
            >
              {lang === 'ar' ? 'إغلاق التقرير' : 'Close Report'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
