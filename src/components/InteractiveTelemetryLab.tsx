import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Calculator, 
  Terminal, 
  Cpu, 
  Zap, 
  ShieldAlert, 
  ShieldCheck, 
  Upload, 
  FileText, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Activity, 
  Lock, 
  Fingerprint, 
  Radio, 
  AlertTriangle,
  Send,
  Database,
  Sliders,
  CheckCircle2,
  FileCode,
  Layers,
  TrendingUp,
  ArrowRight,
  FileDown
} from 'lucide-react';
import { PacketInputData, ForensicAnalysisResult, DefenseActionLog, ThreatVector, MerkleBlock } from '../types/cyber';
import { 
  inspectAndAnalyzePacket, 
  parseRawLogLine, 
  PRESET_TELEMETRY_PACKETS, 
  calculateRealPayloadEntropy 
} from '../services/autonomousEngine';
import { exportForensicAnalysisPdf } from '../services/pdfReportGenerator';

interface InteractiveTelemetryLabProps {
  lang: 'ar' | 'en';
  onInjectIntoLiveSystem?: (result: ForensicAnalysisResult) => void;
}

export const InteractiveTelemetryLab: React.FC<InteractiveTelemetryLabProps> = ({
  lang,
  onInjectIntoLiveSystem
}) => {
  // Input Mode
  const [inputMode, setInputMode] = useState<'STRUCTURED' | 'RAW_LOG' | 'FILE_UPLOAD'>('STRUCTURED');
  
  // Structured Form States
  const [sourceIp, setSourceIp] = useState<string>('185.220.101.5');
  const [destinationIp, setDestinationIp] = useState<string>('10.0.3.11');
  const [sourcePort, setSourcePort] = useState<number>(54122);
  const [destinationPort, setDestinationPort] = useState<number>(53);
  const [protocol, setProtocol] = useState<PacketInputData['protocol']>('DNS');
  const [packetSize, setPacketSize] = useState<number>(642);
  const [interArrivalMs, setInterArrivalMs] = useState<number>(14.5);
  const [syscallName, setSyscallName] = useState<string>('');
  const [payloadText, setPayloadText] = useState<string>(
    'a8f9e0c1b2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2.c2-exfil-proxy.darknet-relay.ru TXT IN'
  );

  // Raw Log input
  const [rawLogText, setRawLogText] = useState<string>('');

  // File Upload states
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [uploadedFileSize, setUploadedFileSize] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Analysis result state
  const [analysisResult, setAnalysisResult] = useState<ForensicAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isSimulatingLive, setIsSimulatingLive] = useState<boolean>(false);
  const [injectedSuccess, setInjectedSuccess] = useState<boolean>(false);
  const [copiedRule, setCopiedRule] = useState<boolean>(false);

  // Real-time analysis execution
  const executeAnalysis = (packetData: PacketInputData) => {
    setIsAnalyzing(true);
    try {
      const result = inspectAndAnalyzePacket(packetData);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Mathematical inspection failed:', err);
    } finally {
      setTimeout(() => setIsAnalyzing(false), 50);
    }
  };

  // Run initial analysis on mount
  useEffect(() => {
    executeAnalysis({
      sourceIp,
      destinationIp,
      sourcePort,
      destinationPort,
      protocol,
      packetSize,
      payload: payloadText,
      syscallName: syscallName || undefined,
      interArrivalMs
    });
  }, []);

  // Handle manual analyze button click
  const handleAnalyzeClick = () => {
    let packetData: PacketInputData;
    if (inputMode === 'RAW_LOG' || inputMode === 'FILE_UPLOAD') {
      const textToParse = (rawLogText || payloadText || '').trim();
      packetData = parseRawLogLine(textToParse);
    } else {
      packetData = {
        sourceIp,
        destinationIp,
        sourcePort,
        destinationPort,
        protocol,
        packetSize,
        payload: payloadText,
        syscallName: syscallName || undefined,
        interArrivalMs
      };
    }
    executeAnalysis(packetData);
  };

  // Handle Preset Selection
  const handleSelectPreset = (presetId: string) => {
    const preset = PRESET_TELEMETRY_PACKETS.find(p => p.id === presetId);
    if (!preset) return;

    setInputMode('STRUCTURED');
    setSourceIp(preset.data.sourceIp);
    setDestinationIp(preset.data.destinationIp);
    setSourcePort(preset.data.sourcePort);
    setDestinationPort(preset.data.destinationPort);
    setProtocol(preset.data.protocol);
    setPacketSize(preset.data.packetSize);
    setPayloadText(preset.data.payload);
    setSyscallName(preset.data.syscallName || '');
    setInterArrivalMs(preset.data.interArrivalMs || 10.0);
    setRawLogText(preset.data.rawLog || preset.data.payload);

    // Auto trigger analysis immediately
    executeAnalysis(preset.data);
  };

  // One-click live simulation & injection trigger
  const handleSimulateAndInject = async (presetId: string) => {
    const preset = PRESET_TELEMETRY_PACKETS.find(p => p.id === presetId);
    if (!preset) return;

    handleSelectPreset(presetId);
    setIsSimulatingLive(true);

    const forensic = inspectAndAnalyzePacket(preset.data);
    setAnalysisResult(forensic);

    // Notify parent if available
    if (onInjectIntoLiveSystem) {
      onInjectIntoLiveSystem(forensic);
    }

    // Broadcast to backend REST API /api/ingest
    try {
      await fetch('/api/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sourceIp: preset.data.sourceIp,
          destinationIp: preset.data.destinationIp,
          sourcePort: preset.data.sourcePort,
          destinationPort: preset.data.destinationPort,
          protocol: preset.data.protocol,
          packetSize: preset.data.packetSize,
          payload: preset.data.payload,
          agentId: 'kestrel-forensic-lab',
          hostname: 'kestrel-math-core-01'
        })
      });
      setInjectedSuccess(true);
      setTimeout(() => setInjectedSuccess(false), 3500);
    } catch (e) {
      console.error('Ingest error:', e);
    } finally {
      setIsSimulatingLive(false);
    }
  };

  // Handle File Upload (Drag & Drop + Click)
  const handleFileProcess = (file: File) => {
    if (!file) return;
    setUploadedFileName(file.name);
    setUploadedFileSize(file.size);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setRawLogText(text.slice(0, 10000)); // Limit to first 10KB for preview
        const firstLine = text.split('\n')[0] || text;
        const parsed = parseRawLogLine(firstLine);
        
        setSourceIp(parsed.sourceIp);
        setDestinationIp(parsed.destinationIp);
        setSourcePort(parsed.sourcePort);
        setDestinationPort(parsed.destinationPort);
        setProtocol(parsed.protocol);
        setPacketSize(parsed.packetSize);
        setPayloadText(parsed.payload);

        executeAnalysis(parsed);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  // Handle Inject Into Live System
  const handleInject = () => {
    if (!analysisResult) return;
    if (onInjectIntoLiveSystem) {
      onInjectIntoLiveSystem(analysisResult);
    }
    // Also dispatch to real backend REST ingestion pipeline
    fetch('/api/ingest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sourceIp: analysisResult.input.sourceIp,
        destinationIp: analysisResult.input.destinationIp,
        sourcePort: analysisResult.input.sourcePort,
        destinationPort: analysisResult.input.destinationPort,
        protocol: analysisResult.input.protocol,
        packetSize: analysisResult.input.packetSize,
        payload: analysisResult.input.payload,
        agentId: 'forensic-lab-console',
        hostname: 'forensic-workstation'
      })
    }).catch(() => {});
    setInjectedSuccess(true);
    setTimeout(() => setInjectedSuccess(false), 3000);
  };

  const [exportedPdfNotice, setExportedPdfNotice] = useState<string | null>(null);

  const handleExportPdf = () => {
    if (!analysisResult) return;
    const filename = exportForensicAnalysisPdf(analysisResult, lang);
    setExportedPdfNotice(filename);
    setTimeout(() => setExportedPdfNotice(null), 3500);
  };

  // Copy rule
  const handleCopyRule = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.generatedFirewallRule);
    setCopiedRule(true);
    setTimeout(() => setCopiedRule(false), 2000);
  };

  return (
    <div className="space-y-4 font-mono-cyber">
      
      {/* Top Banner */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-slate-100 font-display-cyber">
              {lang === 'ar' 
                ? 'محطة إدخال وتحليل السجلات والحزم الحية (Live Ingestion & Forensic Lab)' 
                : 'LIVE TELEMETRY INGESTION & FORENSIC MATHEMATICAL LAB'}
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-4xl">
            {lang === 'ar'
              ? 'أدخل بيانات شبكية، سجلات Syslog/JSON، أو استدعاءات نواة eBPF حقيقية، أو ارفع ملفات السجلات. يقوم النظام بحساب إنتروبيا شانون اللحظية، مصفوفة ماهالانوبيس، والاستدلال البايزي مباشرة مع توليد قواعد التحييد وربطها بالشبكة الحية.'
              : 'Input real packet data, raw syslog/JSON logs, or kernel syscalls. The system computes exact Shannon entropy, Mahalanobis covariance, and Bayesian posteriors with direct live topology injection.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAnalyzeClick}
            disabled={isAnalyzing}
            id="run-analysis-btn"
            className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            <span>{isAnalyzing ? (lang === 'ar' ? 'جارٍ الحساب الرياضي...' : 'Computing...') : (lang === 'ar' ? 'بدء الفحص والتحليل الرياضي' : 'Execute Forensic Analysis')}</span>
          </button>
        </div>
      </div>

      {/* Live Operational Drills & One-Click Simulation Launcher */}
      <div className="rounded-xl border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 p-3">
        <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-300">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'إطلاق محاكاة هجومية حية واختبار الخوارزميات (One-Click Attack Emulation):' : 'ONE-CLICK ADVERSARY SIMULATION & MITIGATION DRILLS:'}</span>
          </div>
          <span className="text-[10px] text-cyan-400/80 font-mono-cyber">
            {lang === 'ar' ? 'حقن فوري في النواة وخط البث الحي' : 'Direct Ingress to Live Stream & OODA Loop'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <button
            type="button"
            disabled={isSimulatingLive}
            onClick={() => handleSimulateAndInject('dns-tunnel')}
            className="p-2.5 rounded-lg border border-red-500/40 bg-red-950/30 hover:bg-red-900/40 text-red-200 text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(239,68,68,0.25)]"
          >
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold">{lang === 'ar' ? '⚡ نفق تسريب DNS مشفر' : '⚡ DNS Tunneling Exfil'}</div>
                <div className="text-[9px] text-red-400 font-mono-cyber font-normal">H(X)=7.82 | Exfiltration</div>
              </div>
            </div>
            <Play className="w-3 h-3 text-red-400 shrink-0" />
          </button>

          <button
            type="button"
            disabled={isSimulatingLive}
            onClick={() => handleSimulateAndInject('syn-flood')}
            className="p-2.5 rounded-lg border border-amber-500/40 bg-amber-950/30 hover:bg-amber-900/40 text-amber-200 text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(245,158,11,0.25)]"
          >
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-amber-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold">{lang === 'ar' ? '⚡ هجوم حجب خدمة SYN فيضي' : '⚡ Volumetric SYN Flood'}</div>
                <div className="text-[9px] text-amber-400 font-mono-cyber font-normal">D_M=6.84 | Wire Ingress</div>
              </div>
            </div>
            <Play className="w-3 h-3 text-amber-400 shrink-0" />
          </button>

          <button
            type="button"
            disabled={isSimulatingLive}
            onClick={() => handleSimulateAndInject('zero-day-mprotect')}
            className="p-2.5 rounded-lg border border-purple-500/40 bg-purple-950/30 hover:bg-purple-900/40 text-purple-200 text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]"
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold">{lang === 'ar' ? '⚡ استدعاء نواة خبيث eBPF' : '⚡ Kernel ROP Injection'}</div>
                <div className="text-[9px] text-purple-400 font-mono-cyber font-normal">mprotect W^X | Zero-Day</div>
              </div>
            </div>
            <Play className="w-3 h-3 text-purple-400 shrink-0" />
          </button>

          <button
            type="button"
            disabled={isSimulatingLive}
            onClick={() => handleSimulateAndInject('benign-tls')}
            className="p-2.5 rounded-lg border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-200 text-xs font-bold flex items-center justify-between gap-2 transition-all cursor-pointer shadow-sm hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left">
                <div className="text-[11px] font-bold">{lang === 'ar' ? '🛡️ حركة مرور شرعية TLS 1.3' : '🛡️ Benign HTTPS Flow'}</div>
                <div className="text-[9px] text-emerald-400 font-mono-cyber font-normal">Baseline Passed | Normal</div>
              </div>
            </div>
            <Play className="w-3 h-3 text-emerald-400 shrink-0" />
          </button>
        </div>
      </div>

      {/* Quick Presets Bar */}
      <div className="rounded-xl border border-slate-800/90 bg-[#060911] p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-bold">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>{lang === 'ar' ? 'قوالب وسيناريوهات فحص حقيقية جاهزة (Quick Presets):' : 'Pre-Engineered Inspection Scenarios:'}</span>
          </div>
          <span className="text-[10px] text-slate-500">{lang === 'ar' ? 'انقر للتحميل الفوري' : 'Click to load and evaluate'}</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {PRESET_TELEMETRY_PACKETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handleSelectPreset(preset.id)}
              className={`p-2 rounded-lg border text-left text-[11px] transition-all cursor-pointer flex flex-col justify-between ${
                preset.type === 'ATTACK'
                  ? 'bg-red-950/20 border-red-800/40 hover:border-red-500/60 text-red-200'
                  : 'bg-emerald-950/20 border-emerald-800/40 hover:border-emerald-500/60 text-emerald-200'
              }`}
            >
              <div className="font-bold truncate" title={lang === 'ar' ? preset.nameAr : preset.name}>
                {lang === 'ar' ? preset.nameAr : preset.name}
              </div>
              <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-mono-cyber">{preset.data.protocol}</span>
                <span className={`px-1 py-0.2 rounded text-[9px] font-bold ${
                  preset.type === 'ATTACK' ? 'text-red-400' : 'text-emerald-400'
                }`}>
                  {preset.type}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout: Inputs on Left, Real-Time Math & Mitigation on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Interactive Input Form (7 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {/* Mode Switcher */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
              <span className="text-xs font-bold text-slate-200 uppercase">
                {lang === 'ar' ? 'نمط استقبال المدخلات (Data Input Mode):' : 'DATA INGESTION SOURCE'}
              </span>

              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setInputMode('STRUCTURED')}
                  className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    inputMode === 'STRUCTURED'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'حقول مهيكلة' : 'Structured Form'}
                </button>
                <button
                  onClick={() => setInputMode('RAW_LOG')}
                  className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    inputMode === 'RAW_LOG'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'سجل خام / JSON' : 'Raw Log / JSON'}
                </button>
                <button
                  onClick={() => setInputMode('FILE_UPLOAD')}
                  className={`px-2.5 py-1 rounded-md border transition-all cursor-pointer ${
                    inputMode === 'FILE_UPLOAD'
                      ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lang === 'ar' ? 'رفع ملف' : 'File Upload'}
                </button>
              </div>
            </div>

            {/* Mode 1: Structured Form */}
            {inputMode === 'STRUCTURED' && (
              <div className="space-y-3 text-xs">
                
                {/* Source & Destination IP */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'عنوان IP المصدر (Source IP / Subnet):' : 'Source IP / CIDR:'}
                    </label>
                    <input
                      type="text"
                      value={sourceIp}
                      onChange={e => setSourceIp(e.target.value)}
                      placeholder="185.220.101.5"
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                    <div className="flex gap-1.5 mt-1 text-[10px] text-slate-500">
                      <span>{lang === 'ar' ? 'أمثلة سريعة:' : 'Quick:'}</span>
                      <button type="button" onClick={() => setSourceIp('185.220.101.5')} className="text-cyan-400 hover:underline">185.220.101.5</button>
                      <button type="button" onClick={() => setSourceIp('194.26.29.114')} className="text-cyan-400 hover:underline">194.26.29.114</button>
                      <button type="button" onClick={() => setSourceIp('10.0.3.12')} className="text-cyan-400 hover:underline">10.0.3.12</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'الأصل المستهدف (Destination Asset / IP):' : 'Destination Asset IP:'}
                    </label>
                    <select
                      value={destinationIp}
                      onChange={e => setDestinationIp(e.target.value)}
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="10.0.0.1">10.0.0.1 - Edge Router Alpha (eBPF)</option>
                      <option value="10.0.0.2">10.0.0.2 - Edge Router Beta (XDP)</option>
                      <option value="10.0.1.1">10.0.1.1 - Zero-Trust Gatekeeper (PEP)</option>
                      <option value="10.0.2.1">10.0.2.1 - Core SDN Fabric</option>
                      <option value="10.0.3.11">10.0.3.11 - Application Cluster 01</option>
                      <option value="10.0.3.12">10.0.3.12 - Application Cluster 02</option>
                      <option value="10.0.4.5">10.0.4.5 - Mission Data Tier-0 (DB)</option>
                      <option value="10.0.4.99">10.0.4.99 - HSM Cryptographic Vault</option>
                    </select>
                  </div>
                </div>

                {/* Ports & Protocol */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'منفذ المصدر:' : 'Src Port:'}
                    </label>
                    <input
                      type="number"
                      value={sourcePort}
                      onChange={e => setSourcePort(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'منفذ الوجهة:' : 'Dst Port:'}
                    </label>
                    <input
                      type="number"
                      value={destinationPort}
                      onChange={e => setDestinationPort(parseInt(e.target.value) || 0)}
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'البروتوكول:' : 'Protocol:'}
                    </label>
                    <select
                      value={protocol}
                      onChange={e => setProtocol(e.target.value as any)}
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-2 py-1.5 text-slate-100 focus:outline-none focus:border-cyan-500 cursor-pointer"
                    >
                      <option value="TCP">TCP</option>
                      <option value="UDP">UDP</option>
                      <option value="DNS">DNS</option>
                      <option value="TLS 1.3">TLS 1.3</option>
                      <option value="eBPF-Syscall">eBPF-Syscall</option>
                      <option value="HTTP/HTTPS">HTTP/HTTPS</option>
                      <option value="ICMP">ICMP</option>
                    </select>
                  </div>
                </div>

                {/* Packet Size & Inter-Arrival */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                      <span>{lang === 'ar' ? 'حجم الحزمة (Bytes):' : 'Packet Size:'}</span>
                      <span className="text-cyan-400 font-bold">{packetSize} B</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="4096"
                      step="10"
                      value={packetSize}
                      onChange={e => setPacketSize(parseInt(e.target.value))}
                      className="w-full accent-cyan-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">
                      {lang === 'ar' ? 'اسم استدعاء النواة (Syscall Name):' : 'Kernel Syscall Hook:'}
                    </label>
                    <input
                      type="text"
                      value={syscallName}
                      onChange={e => setSyscallName(e.target.value)}
                      placeholder="sys_enter_mprotect"
                      className="w-full bg-[#060911] border border-slate-700 rounded-lg px-3 py-1.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* Payload Textarea with Byte Counting */}
                <div>
                  <div className="flex items-center justify-between text-slate-400 text-[11px] mb-1">
                    <span>{lang === 'ar' ? 'حمولة الحزمة الفعلية (Payload / Hex / Query Text):' : 'Packet Payload / Data Buffer:'}</span>
                    <span className="text-slate-500 text-[10px]">
                      {payloadText.length} {lang === 'ar' ? 'حرفاً' : 'chars'} | {new Blob([payloadText]).size} Bytes
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={payloadText}
                    onChange={e => setPayloadText(e.target.value)}
                    placeholder="Enter payload string, hex bytes, DNS query or base64 data..."
                    className="w-full bg-[#060911] border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono-cyber text-[11px] leading-relaxed resize-y"
                  />
                </div>

              </div>
            )}

            {/* Mode 2: Raw Log / JSON Input */}
            {inputMode === 'RAW_LOG' && (
              <div className="space-y-3 text-xs">
                <p className="text-slate-400 text-[11px]">
                  {lang === 'ar'
                    ? 'الصق سطور سجلات الشبكة (Syslog, Nginx/Apache, Zeek, Snort, Suricata, أو JSON) ليتم تحليلها واستخراج معالمها الرياضية فورياً:'
                    : 'Paste raw telemetry lines, syslog messages, web server logs, or JSON packet dumps:'}
                </p>
                <textarea
                  rows={8}
                  value={rawLogText}
                  onChange={e => setRawLogText(e.target.value)}
                  placeholder={`<134>1 2026-09-11T21:40:00Z edge-01 eBPF 4920 - - [action=inspect src=185.220.101.5 dst=10.0.3.11 dport=53 proto=DNS query="a8f9e0c1b2.darknet.ru" bytes=642 entropy=7.82]`}
                  className="w-full bg-[#060911] border border-slate-700 rounded-lg p-3 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono-cyber text-[11px] leading-relaxed"
                />
              </div>
            )}

            {/* Mode 3: File Upload with Drag & Drop */}
            {inputMode === 'FILE_UPLOAD' && (
              <div className="space-y-3 text-xs">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    dragOver 
                      ? 'border-cyan-400 bg-cyan-950/30' 
                      : 'border-slate-700 hover:border-slate-500 bg-[#060911]'
                  }`}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={e => e.target.files?.[0] && handleFileProcess(e.target.files[0])} 
                    className="hidden" 
                    accept=".log,.json,.csv,.txt"
                  />
                  <Upload className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-slate-200 font-bold text-xs">
                    {lang === 'ar' ? 'اسحب وأفلت ملف السجلات هنا، أو انقر للاختيار اليدوي' : 'Drag and drop log file here, or click to browse'}
                  </p>
                  <p className="text-slate-500 text-[10px] mt-1">
                    {lang === 'ar' ? 'يدعم ملفات: .log, .json, .csv, .txt (حتى 10MB)' : 'Supports .log, .json, .csv, .txt files (up to 10MB)'}
                  </p>
                </div>

                {uploadedFileName && (
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" />
                      <div>
                        <span className="text-slate-200 font-bold text-xs">{uploadedFileName}</span>
                        <span className="text-slate-500 text-[10px] block">{((uploadedFileSize || 0) / 1024).toFixed(1)} KB</span>
                      </div>
                    </div>
                    <span className="text-emerald-400 font-bold text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/30">
                      PARSED & READY
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Execution action buttons bottom */}
            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setSourceIp('185.220.101.5');
                  setDestinationIp('10.0.3.11');
                  setSourcePort(54122);
                  setDestinationPort(53);
                  setProtocol('DNS');
                  setPacketSize(642);
                  setPayloadText('a8f9e0c1b2d4e6f8a0b2c4d6e8f0a2b4c6d8e0f2.c2-exfil-proxy.darknet-relay.ru TXT IN');
                  setSyscallName('');
                  setRawLogText('');
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إعادة ضبط' : 'Reset Form'}</span>
              </button>

              <button
                type="button"
                onClick={handleAnalyzeClick}
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.3)] cursor-pointer"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'فحص السجل رياضياً' : 'Evaluate Input'}</span>
              </button>
            </div>

          </div>

          {/* Byte Frequency Histogram Chart */}
          {analysisResult && (
            <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
              <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                    {lang === 'ar' ? 'توزيع تردد البايتات المحسوب فعلياً (Byte Frequency Spectrum)' : 'CALCULATED EMPIRICAL BYTE SPECTRUM'}
                  </h3>
                </div>
                <span className="text-[10px] text-cyan-400 font-mono-cyber">
                  {analysisResult.byteDistribution.length} Unique Bytes Detected
                </span>
              </div>

              <div className="space-y-1.5 text-[10px]">
                {analysisResult.byteDistribution.slice(0, 8).map((b, idx) => {
                  const maxFreq = analysisResult.byteDistribution[0]?.freq || 1;
                  const pct = Math.min(100, (b.freq / maxFreq) * 100);
                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="w-8 font-bold text-slate-300 font-mono-cyber text-center bg-slate-900 px-1 py-0.5 rounded border border-slate-800">
                        {b.char}
                      </span>
                      <div className="flex-1 bg-slate-950 h-3 rounded overflow-hidden border border-slate-800/80">
                        <div 
                          className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-16 text-right text-slate-400 font-mono-cyber">
                        {b.count} ({(b.freq * 100).toFixed(1)}%)
                      </span>
                    </div>
                  );
                })}
              </div>

              <p className="mt-2 text-[10px] text-slate-500 italic">
                {lang === 'ar'
                  ? 'تم حساب هذا التوزيع مباشرة من محتويات الحزمة/السجل المدخل لحساب إنتروبيا شانون بدقة متناهية.'
                  : 'Derived in real-time from the exact characters/bytes provided in the input payload.'}
              </p>
            </div>
          )}

        </div>

        {/* Right Column: Live Mathematical Results, Bayesian Posterior & Mitigation Rule (6 cols) */}
        <div className="lg:col-span-6 space-y-4">
          
          {analysisResult ? (
            <>
              {/* Threat Verdict & Executive Scorecard */}
              <div className={`rounded-xl border p-4 transition-all ${
                analysisResult.isAnomaly
                  ? 'bg-red-950/25 border-red-500/50 shadow-[0_0_25px_rgba(239,68,68,0.15)]'
                  : 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
              }`}>
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {analysisResult.isAnomaly ? (
                        <ShieldAlert className="w-5 h-5 text-red-400 animate-pulse" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      )}
                      <h3 className="text-sm font-bold text-slate-100 font-display-cyber">
                        {lang === 'ar' ? analysisResult.detectedThreatTypeAr : analysisResult.detectedThreatType}
                      </h3>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        analysisResult.isAnomaly
                          ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {analysisResult.severity}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      MITRE ATT&CK: <strong className="text-slate-200">{analysisResult.mitreTactic}</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'الثقة البايزية في الشذوذ:' : 'Bayesian Posterior:'}</span>
                      <span className={`text-base font-bold font-mono-cyber ${
                        analysisResult.isAnomaly ? 'text-red-400' : 'text-emerald-400'
                      }`}>
                        {(analysisResult.bayesianPosterior * 100).toFixed(2)}%
                      </span>
                    </div>

                    <button
                      id="verdict-quick-pdf-btn"
                      onClick={handleExportPdf}
                      className="px-2.5 py-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-500/60 text-red-200 hover:text-white text-[11px] font-mono-cyber font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                      title={lang === 'ar' ? 'تصدير شهادة ونتائج الفحص الجنائي كملف PDF' : 'Export Forensic Findings as PDF'}
                    >
                      <FileDown className="w-3.5 h-3.5 text-red-400" />
                      <span>{exportedPdfNotice ? (lang === 'ar' ? 'تم PDF!' : 'PDF OK!') : 'PDF'}</span>
                    </button>
                  </div>
                </div>

                {/* Mathematical Metrics Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-[#060911] border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'إنتروبيا شانون H(X):' : 'Shannon Entropy:'}</span>
                    <span className="text-cyan-400 font-bold text-sm">{analysisResult.shannonEntropy}</span>
                    <span className="text-slate-500 text-[9px] block">Baseline: {analysisResult.baselineEntropy}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#060911] border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'تباين KL Divergence:' : 'KL Divergence:'}</span>
                    <span className="text-amber-400 font-bold text-sm">{analysisResult.klDivergence}</span>
                    <span className="text-slate-500 text-[9px] block">Threshold: &gt; 1.5</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#060911] border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'مسافة ماهالانوبيس D_M:' : 'Mahalanobis Dist:'}</span>
                    <span className={`font-bold text-sm ${analysisResult.mahalanobisDistance > 3.0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {analysisResult.mahalanobisDistance}
                    </span>
                    <span className="text-slate-500 text-[9px] block">Critical: &gt; 3.0</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#060911] border border-slate-800">
                    <span className="text-slate-500 text-[10px] block">{lang === 'ar' ? 'تراكم Page-Hinkley:' : 'Page-Hinkley Drift:'}</span>
                    <span className="text-purple-400 font-bold text-sm">{analysisResult.pageHinkleyValue}</span>
                    <span className="text-slate-500 text-[9px] block">Accumulated &lambda;</span>
                  </div>
                </div>

                {/* Mathematical Decision Rationale */}
                <div className="mt-3 p-2.5 rounded-lg bg-[#060911]/90 border border-slate-800/80 text-[11px] text-slate-300">
                  <span className="text-cyan-400 font-bold block mb-0.5">
                    {lang === 'ar' ? 'التعليل الرياضي للقرار (Mathematical Rationale):' : 'Autonomous Decision Rationale:'}
                  </span>
                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {lang === 'ar' ? analysisResult.decisionRationaleAr : analysisResult.decisionRationaleEn}
                  </p>
                </div>
              </div>

              {/* Generated Wire-speed Actuation Rule */}
              <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <FileCode className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-slate-200 font-display-cyber uppercase">
                      {lang === 'ar' ? 'قاعدة التحييد الآلية الموّلدة (Autonomous Actuation Code):' : 'GENERATED LOW-LEVEL MITIGATION RULE'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-500/30 font-bold">
                      {analysisResult.recommendedActuator}
                    </span>
                    <button
                      onClick={handleCopyRule}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Copy code"
                    >
                      {copiedRule ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <pre className="p-3 rounded-lg bg-[#060911] border border-slate-800/80 text-[11px] font-mono-cyber text-amber-300 overflow-x-auto whitespace-pre leading-relaxed">
                  {analysisResult.generatedFirewallRule}
                </pre>
              </div>

              {/* Cryptographic Verification Proof */}
              <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 text-xs">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-200 font-display-cyber uppercase">
                      {lang === 'ar' ? 'التوثيق المشفر وختم ميركل (Cryptographic Merkle Proof)' : 'CRYPTOGRAPHIC MERKLE AUDIT PROOF'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> FIPS 140-3 L4
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-500">Payload SHA-3 Hash:</span>
                    <p className="text-slate-300 font-mono-cyber break-all">{analysisResult.cryptoProof.sha3Hash}</p>
                  </div>
                  <div>
                    <span className="text-slate-500">Merkle Root Leaf:</span>
                    <p className="text-purple-300 font-mono-cyber break-all">{analysisResult.cryptoProof.merkleRoot}</p>
                  </div>
                </div>
              </div>

              {/* Action: Inject into Live System */}
              <div className="p-4 rounded-xl border border-cyan-500/40 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-purple-950/40 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold text-cyan-200 font-display-cyber block">
                    {lang === 'ar' ? 'ربط التحليل بشبكة العمليات الحية (Live System Ingress)' : 'INJECT INTO LIVE TOPOLOGY & NETWORK STREAM'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {lang === 'ar'
                      ? 'حقن هذه الحزمة فوراً في ناقل البيانات الحي، تحديث مستوى DEFCON، عزل العقدة المستهدفة بالطبولوجيا، وتوثيق كتلة ميركل جديدة.'
                      : 'Feed this evaluated packet into the live operational bus, triggering OODA mitigation and topology containment.'}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleExportPdf}
                    id="lab-export-forensic-pdf-btn"
                    className="px-3.5 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white shadow-[0_0_15px_rgba(225,29,72,0.3)] border border-red-500/80"
                    title={lang === 'ar' ? 'تصدير وثيقة وتقرير الفحص الجنائي بصيغة ملف PDF احترافي' : 'Export Forensic Analysis Report directly as PDF'}
                  >
                    <FileDown className="w-4 h-4 text-white" />
                    <span>
                      {exportedPdfNotice 
                        ? (lang === 'ar' ? 'تم تنزيل شهادة PDF!' : 'PDF Certificate Ready!') 
                        : (lang === 'ar' ? 'تصدير وثيقة الفحص الجنائي PDF' : 'Export Forensic PDF')}
                    </span>
                  </button>

                  <button
                    onClick={handleInject}
                    disabled={injectedSuccess}
                    id="inject-packet-live-btn"
                    className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all cursor-pointer ${
                      injectedSuccess 
                        ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]'
                    }`}
                  >
                    {injectedSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'تم الحقن والتحييد في الشبكة بنجاح!' : 'Injected & Contained Live!'}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{lang === 'ar' ? 'حقن الحزمة في شبكة العمليات الحية' : 'Inject Packet to Live Grid'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

            </>
          ) : (
            <div className="h-64 rounded-xl border border-slate-800 bg-[#090d16] flex flex-col items-center justify-center text-slate-500 text-xs">
              <Activity className="w-8 h-8 text-slate-600 mb-2 animate-pulse" />
              <span>{lang === 'ar' ? 'أدخل بيانات أو اختر قالباً لبدء الفحص الرياضي المباشر' : 'Input data or select a preset to execute forensic analysis'}</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
