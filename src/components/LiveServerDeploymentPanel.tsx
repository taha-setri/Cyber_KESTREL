import React, { useState, useEffect } from 'react';
import { 
  Server, 
  Terminal, 
  Copy, 
  Check, 
  Send, 
  ShieldAlert, 
  Activity, 
  Globe, 
  Wifi, 
  RefreshCw, 
  Lock, 
  Cpu,
  ChevronRight,
  ExternalLink,
  Code
} from 'lucide-react';

interface LiveServerDeploymentPanelProps {
  lang: 'ar' | 'en';
  parentConnectedAgents?: RemoteAgent[];
  parentTelemetryStream?: any[];
  onRefreshParentAgents?: () => void;
}

export interface RemoteAgent {
  id: string;
  hostname: string;
  ip: string;
  os: string;
  firstSeen: number;
  lastSeen: number;
  packetsCount: number;
  threatsCount: number;
  status: 'ONLINE' | 'IDLE' | 'OFFLINE';
}

export interface IngestedEvent {
  id: string;
  timestamp: number;
  sourceIp: string;
  destinationIp: string;
  sourcePort: number;
  destinationPort: number;
  protocol: string;
  packetSize: number;
  entropyValue: number;
  mahalanobisDistance: number;
  actionTaken: string;
  severity: string;
  threatName?: string;
  generatedFirewallRule: string;
  hostname?: string;
}

export const LiveServerDeploymentPanel: React.FC<LiveServerDeploymentPanelProps> = ({ 
  lang,
  parentConnectedAgents,
  parentTelemetryStream,
  onRefreshParentAgents
}) => {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedTermux, setCopiedTermux] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [localAgents, setLocalAgents] = useState<RemoteAgent[]>([]);
  const [localEvents, setLocalEvents] = useState<IngestedEvent[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const [testPayloadText, setTestPayloadText] = useState('a8f9c1b2d3.c2-exfil-proxy.darknet-relay.ru');
  const [testTargetPort, setTestTargetPort] = useState('53');
  const [isSendingPacket, setIsSendingPacket] = useState(false);
  const [lastInjectionResult, setLastInjectionResult] = useState<any>(null);
  const [activeInstructionTab, setActiveInstructionTab] = useState<'LINUX' | 'TERMUX' | 'CURL'>('TERMUX');

  // Derive current absolute origin
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://your-acdc-soc.run.app';
  const bashInstallCommand = `curl -sSL "${origin}/api/agent-install.sh" | sudo bash`;
  const termuxInstallCommand = `pkg install -y python curl && curl -sSL "${origin}/api/agent-termux.sh" | bash`;
  const curlInjectCommand = `curl -X POST "${origin}/api/ingest" \\
  -H "Content-Type: application/json" \\
  -d '{"sourceIp": "194.26.29.11", "destinationIp": "10.0.0.1", "destinationPort": 53, "protocol": "DNS", "payload": "a8f9c1b2d3.exfil.darknet.ru", "packetSize": 512, "agentId": "termux-node", "hostname": "android-termux"}'`;

  // Fetch agents list
  const refreshAgents = async () => {
    setIsLoadingAgents(true);
    try {
      if (onRefreshParentAgents) {
        onRefreshParentAgents();
      }
      const [res, evRes] = await Promise.all([
        fetch('/api/agents', { cache: 'no-store' }),
        fetch('/api/events', { cache: 'no-store' })
      ]);
      if (res.ok) {
        const data = await res.json();
        setLocalAgents(data.agents || []);
      }
      if (evRes.ok) {
        const evData = await evRes.json();
        setLocalEvents(evData.events || []);
      }
    } catch {
      // Backend warming up
    } finally {
      setIsLoadingAgents(false);
    }
  };

  // Poll agents periodically
  useEffect(() => {
    refreshAgents();
    const interval = setInterval(refreshAgents, 5000);
    return () => clearInterval(interval);
  }, []);

  // Compute merged agents
  const displayAgents = (parentConnectedAgents && parentConnectedAgents.length > 0) 
    ? parentConnectedAgents 
    : localAgents;

  // Compute merged events
  const displayEvents: IngestedEvent[] = (parentTelemetryStream && parentTelemetryStream.length > 0)
    ? parentTelemetryStream.map(e => ({
        id: e.id,
        timestamp: e.timestamp,
        sourceIp: e.sourceIp,
        destinationIp: e.destinationIp,
        sourcePort: e.sourcePort,
        destinationPort: e.destinationPort,
        protocol: e.protocol,
        packetSize: e.packetSize,
        entropyValue: e.entropyValue,
        mahalanobisDistance: (e.signatureFreeScore || 0) / 10,
        actionTaken: e.actionTaken,
        severity: e.severity,
        generatedFirewallRule: e.actionTaken === 'XDP_DROPPED' 
          ? `sudo iptables -I INPUT 1 -s ${e.sourceIp} -j DROP`
          : `sudo ip route add blackhole ${e.sourceIp}/32`,
        hostname: e.sourceIp?.includes('192.168') ? 'termux-android-node' : 'external-agent'
      }))
    : localEvents;

  const copyToClipboard = (text: string, type: 'bash' | 'termux' | 'curl') => {
    navigator.clipboard.writeText(text);
    if (type === 'bash') {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    } else if (type === 'termux') {
      setCopiedTermux(true);
      setTimeout(() => setCopiedTermux(false), 2500);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2500);
    }
  };

  const handleSendTestPacket = async (presetType?: 'CUSTOM' | 'TERMUX' | 'LINUX_SERVER') => {
    setIsSendingPacket(true);
    try {
      let payload;
      if (presetType === 'TERMUX') {
        payload = {
          sourceIp: '192.168.1.188',
          destinationIp: '10.0.0.1',
          sourcePort: 48921,
          destinationPort: 53,
          protocol: 'DNS',
          payload: '9bf8a7c6e5d4.termux-phone.c2-beacon.darknet.ru TXT IN',
          packetSize: 580,
          agentId: 'termux-android-01',
          hostname: 'android-termux-node',
          platform: 'termux',
          os: 'Android Linux (Termux / Bionic)'
        };
      } else if (presetType === 'LINUX_SERVER') {
        payload = {
          sourceIp: '185.220.101.5',
          destinationIp: '10.0.3.11',
          sourcePort: 44122,
          destinationPort: 443,
          protocol: 'TCP',
          payload: 'GET /api/v1/admin/secrets HTTP/1.1\r\nAuthorization: Bearer high-entropy-token-8f9e0c1b2d4\r\n\r\n',
          packetSize: 1024,
          agentId: 'vps-edge-frankfurt',
          hostname: 'srv-prod-edge-01',
          os: 'Linux Ubuntu 24.04 LTS (x86_64)'
        };
      } else {
        payload = {
          sourceIp: '194.26.29.114',
          destinationIp: '10.0.0.1',
          sourcePort: 54321,
          destinationPort: parseInt(testTargetPort, 10) || 53,
          protocol: testTargetPort === '53' ? 'DNS' : 'TCP',
          payload: testPayloadText,
          packetSize: testPayloadText.length + 64,
          agentId: 'browser-manual-probe',
          hostname: 'interactive-operator-console'
        };
      }

      const res = await fetch('/api/ingest', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'User-Agent': presetType === 'TERMUX' ? 'Termux/0.118 (Android)' : 'ACDC-Probe/1.0'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      setLastInjectionResult(data);
      await refreshAgents();
    } catch (e: any) {
      setLastInjectionResult({ error: e.toString() });
    } finally {
      setIsSendingPacket(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-200">
      
      {/* Top Banner Explaining the Field Architecture */}
      <div className="rounded-xl border border-cyan-500/40 bg-[#090d16] p-5 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-cyan-400" />
              <h2 className="text-base font-bold font-display-cyber text-slate-100">
                {lang === 'ar' 
                  ? 'بوابة الربط الميداني مع السيرفرات الحقيقية وتطبيق Termux (Real Server & Termux Bridge)' 
                  : 'LIVE FIELD PRODUCTION SERVER & TERMUX BRIDGE'}
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                ACTIVE REST & SSE API
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
              {lang === 'ar'
                ? 'المنظومة مزودة الآن بمخدم خلفي حقيقي (Full-Stack Backend) يستقبل السجلات من أي سيرفر خارجي أو هاتف أندرويد عبر تطبيق Termux، عبر مسار `/api/ingest`، ويطبق الحسابات الرياضية الجنائية لحظياً مع بث فوري عبر SSE دون الحاجة لتحديث الصفحة.'
                : 'Full-stack REST and SSE ingestion engine receiving telemetry from external servers, Linux hosts, and Android Termux terminals via `/api/ingest`.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshAgents}
              id="refresh-server-bridge-btn"
              className="px-3.5 py-1.5 rounded-lg border border-slate-700 hover:border-cyan-500 bg-slate-900 text-xs font-mono-cyber flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isLoadingAgents ? 'animate-spin' : ''}`} />
              <span>{lang === 'ar' ? 'تحديث السيرفرات اللحظي' : 'Refresh State'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Launch & Simulation Toolbar */}
      <div className="rounded-xl border border-slate-800 bg-[#060a14] p-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span>{lang === 'ar' ? 'أزرار إطلاق المحاكاة الميدانية الحية (One-Click Ingestion Testers):' : 'Live Wire Simulation Injectors:'}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleSendTestPacket('TERMUX')}
            disabled={isSendingPacket}
            id="simulate-termux-btn"
            className="px-3 py-1 rounded bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/40 text-emerald-300 text-xs font-mono-cyber flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(16,185,129,0.2)]"
          >
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'ar' ? '📱 محاكاة تدفق من Termux (Android)' : '📱 Simulate Termux Agent'}</span>
          </button>

          <button
            onClick={() => handleSendTestPacket('LINUX_SERVER')}
            disabled={isSendingPacket}
            id="simulate-vps-btn"
            className="px-3 py-1 rounded bg-blue-950/80 hover:bg-blue-900 border border-blue-600/40 text-blue-300 text-xs font-mono-cyber flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shadow-[0_0_10px_rgba(59,130,246,0.2)]"
          >
            <Server className="w-3.5 h-3.5 text-blue-400" />
            <span>{lang === 'ar' ? '🖥️ محاكاة سيرفر Linux سحابي' : '🖥️ Simulate Linux Node'}</span>
          </button>
        </div>
      </div>

      {/* 3 Step Integration Cards with Tab Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        
        {/* Step 1: Real Agent Installer (Termux / Linux Switcher) */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold">
                {lang === 'ar' ? 'الخطوة 1: وكيل السيرفر / Termux' : 'STEP 1: AGENT DEPLOYMENT'}
              </span>
              <Terminal className="w-4 h-4 text-slate-400" />
            </div>

            {/* Platform Selector Buttons */}
            <div className="flex gap-1.5 mb-2.5">
              <button
                type="button"
                onClick={() => setActiveInstructionTab('TERMUX')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono-cyber transition-all cursor-pointer ${
                  activeInstructionTab === 'TERMUX' 
                    ? 'bg-emerald-600 text-slate-950 shadow-[0_0_8px_rgba(16,185,129,0.4)]' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                📱 Termux (Android)
              </button>
              <button
                type="button"
                onClick={() => setActiveInstructionTab('LINUX')}
                className={`px-2.5 py-1 rounded text-[11px] font-bold font-mono-cyber transition-all cursor-pointer ${
                  activeInstructionTab === 'LINUX' 
                    ? 'bg-cyan-600 text-slate-950 shadow-[0_0_8px_rgba(6,182,212,0.4)]' 
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                🖥️ Linux / VPS (Ubuntu)
              </button>
            </div>

            <h3 className="text-xs font-bold font-display-cyber text-slate-200 mb-1">
              {activeInstructionTab === 'TERMUX' 
                ? (lang === 'ar' ? 'أمر التثبيت المباشر داخل تطبيق Termux' : 'Run in Termux App on Android')
                : (lang === 'ar' ? 'أمر التثبيت المباشر على خوادم Linux' : 'Run on Remote Linux Host')}
            </h3>
            <p className="text-[11px] text-slate-400 mb-2 leading-relaxed">
              {activeInstructionTab === 'TERMUX'
                ? (lang === 'ar' 
                    ? 'افتح تطبيق Termux على هاتفك، ثم الصق هذا السطر البرمجي الواحد لتثبيت متطلبات Python والاتصال بمركز KESTREL فورياً:' 
                    : 'Paste this command in your Android Termux app to install dependencies and begin real-time streaming:')
                : (lang === 'ar'
                    ? 'انسخ الأمر التالي ونفّذه على أي سيرفر Linux؛ سيقوم الوكيل بقراءة الحزم وإرسالها فوراً لمركز العمليات:'
                    : 'Execute this one-liner on your Linux VPS/Server to establish zero-config real-time streaming:')}
            </p>
          </div>

          <div className="bg-[#04060a] rounded-lg border border-slate-800 p-2.5 font-mono-cyber text-[11px] relative group">
            <div className="text-cyan-300 break-all select-all pr-8">
              {activeInstructionTab === 'TERMUX' ? termuxInstallCommand : bashInstallCommand}
            </div>
            <button
              onClick={() => copyToClipboard(activeInstructionTab === 'TERMUX' ? termuxInstallCommand : bashInstallCommand, activeInstructionTab === 'TERMUX' ? 'termux' : 'bash')}
              className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Copy command"
            >
              {(activeInstructionTab === 'TERMUX' ? copiedTermux : copiedScript) 
                ? <Check className="w-3.5 h-3.5 text-emerald-400" /> 
                : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
            </button>
          </div>
        </div>

        {/* Step 2: REST Ingestion via curl */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 font-bold">
                {lang === 'ar' ? 'الخطوة 2: استدعاء cURL / API' : 'STEP 2: cURL / REST API'}
              </span>
              <Code className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold font-display-cyber text-slate-200 mb-1">
              {lang === 'ar' ? 'إرسال حزم حقيقية من طرفية جهازك أو Termux' : 'Send Real Packets via cURL / Terminal'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {lang === 'ar'
                ? 'يمكنك إرسال أي حزمة أو سجل شبكي من سطر الأوامر (Terminal أو Termux) مباشرة إلى نقطة `/api/ingest`:'
                : 'Send real packet payloads or syslog lines using standard cURL from anywhere on the internet:'}
            </p>
          </div>

          <div className="bg-[#04060a] rounded-lg border border-slate-800 p-2.5 font-mono-cyber text-[10px] relative group">
            <div className="text-amber-300/90 whitespace-pre-wrap select-all pr-8 overflow-x-auto max-h-[70px]">
              {curlInjectCommand}
            </div>
            <button
              onClick={() => copyToClipboard(curlInjectCommand, 'curl')}
              className="absolute top-2 right-2 p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
              title="Copy cURL"
            >
              {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Step 3: Direct In-Browser Live Packet Sender */}
        <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                {lang === 'ar' ? 'الخطوة 3: إرسال فوري حي' : 'STEP 3: LIVE INGESTION'}
              </span>
              <Send className="w-4 h-4 text-slate-400" />
            </div>
            <h3 className="text-sm font-bold font-display-cyber text-slate-200 mb-1">
              {lang === 'ar' ? 'إرسال حزمة مخصصة إلى مسار الاستيعاب الفعلي' : 'Dispatch Custom Telemetry to Backend Ingestion'}
            </h3>
            <p className="text-xs text-slate-400 mb-2">
              {lang === 'ar'
                ? 'إرسال حزمة بيانات مخصصة إلى مسار الاستيعاب الحقيقي (`/api/ingest`) لتنفيذ الفحص الرياضي وتحديث السجل فورياً:'
                : 'Trigger a real HTTP POST request to stream telemetry into the backend calculation engine:'}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={testPayloadText} 
                onChange={e => setTestPayloadText(e.target.value)}
                placeholder="Payload content..."
                className="flex-1 bg-[#04060a] border border-slate-700 rounded px-2 py-1 text-[11px] font-mono-cyber text-slate-200 focus:outline-none focus:border-cyan-500"
              />
              <select 
                value={testTargetPort} 
                onChange={e => setTestTargetPort(e.target.value)}
                className="bg-[#04060a] border border-slate-700 rounded px-2 py-1 text-[11px] font-mono-cyber text-cyan-300"
              >
                <option value="53">Port 53 (DNS)</option>
                <option value="443">Port 443 (HTTPS)</option>
                <option value="22">Port 22 (SSH)</option>
                <option value="8080">Port 8080 (HTTP)</option>
              </select>
            </div>
            
            <button
              onClick={() => handleSendTestPacket('CUSTOM')}
              disabled={isSendingPacket}
              id="dispatch-custom-packet-btn"
              className="w-full py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSendingPacket ? (lang === 'ar' ? 'جارِ المعالجة في الخادم...' : 'Processing...') : (lang === 'ar' ? 'إرسال عبر POST /api/ingest' : 'Dispatch via POST /api/ingest')}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Last Injection Result Banner if available */}
      {lastInjectionResult && (
        <div className="rounded-xl border border-slate-800 bg-[#060a14] p-4 font-mono-cyber text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-200 font-bold">{lang === 'ar' ? 'نتيجة الفحص الحقيقي من المخدم الخلفي:' : 'Backend Ingestion Result:'}</span>
              <span className="text-[10px] text-cyan-400">ID: {lastInjectionResult.id}</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              lastInjectionResult.forensics?.isAnomaly ? 'bg-red-950 text-red-300 border border-red-500/40' : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
            }`}>
              {lastInjectionResult.forensics?.verdict}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mb-2">
            <div>
              <span className="text-slate-500 block">Shannon Entropy:</span>
              <strong className="text-cyan-400">{lastInjectionResult.forensics?.shannonEntropy} bits</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Mahalanobis Distance:</span>
              <strong className="text-emerald-400">{lastInjectionResult.forensics?.mahalanobisDistance}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Bayesian Posterior:</span>
              <strong className="text-purple-400">{lastInjectionResult.forensics?.bayesianPosterior}</strong>
            </div>
            <div>
              <span className="text-slate-500 block">Severity:</span>
              <strong className="text-amber-400">{lastInjectionResult.forensics?.severity}</strong>
            </div>
          </div>

          <div className="bg-[#020408] rounded p-2 text-[10px] text-emerald-400 border border-slate-800 overflow-x-auto">
            <span className="text-slate-500 mr-2">Dispatched Rule:</span>
            <code>{lastInjectionResult.mitigation?.command}</code>
          </div>
        </div>
      )}

      {/* Two Columns: Registered Remote Servers (Left) & Real Ingested Telemetry Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Registered Remote Servers (Col 5) */}
        <div className="lg:col-span-5 rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-emerald-400" />
              <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase">
                {lang === 'ar' ? 'الخوادم الحقيقية المتصلة حالياً' : 'CONNECTED REAL LINUX SERVERS'}
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
              {displayAgents.length} {lang === 'ar' ? 'سيرفر نشط' : 'Registered'}
            </span>
          </div>

          {displayAgents.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs font-mono-cyber space-y-2">
              <Server className="w-8 h-8 text-slate-700 mx-auto" />
              <p>{lang === 'ar' ? 'لا يوجد سيرفر متصل حالياً عبر الوكيل.' : 'No remote Linux server registered yet.'}</p>
              <p className="text-[10px] text-slate-600">
                {lang === 'ar' 
                  ? 'قم بتشغيل أمر التثبيت على أي سيرفر أو تطبيق Termux، أو انقر على أزرار المحاكاة أعلاه لتسجيل الخادم فوراً.' 
                  : 'Execute the installer command on any VPS/Termux, or click the simulation buttons above to register instantly.'}
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
              {displayAgents.map(ag => (
                <div key={ag.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-200 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      {ag.hostname}
                    </span>
                    <span className="text-[10px] font-mono-cyber text-slate-400">{ag.ip}</span>
                  </div>
                  <div className="text-[10px] font-mono-cyber text-slate-400 flex items-center justify-between">
                    <span className="truncate max-w-[200px]" title={ag.os}>OS: {ag.os}</span>
                    <span>Packets: <strong className="text-cyan-400">{ag.packetsCount}</strong></span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[10px] font-mono-cyber pt-1 border-t border-slate-800/60">
                    <span className="text-slate-500">Last Ping: {new Date(ag.lastSeen).toISOString().substring(11, 19)}</span>
                    <span className={ag.threatsCount > 0 ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                      {ag.threatsCount} Intercepted Threats
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Real Live Ingested Telemetry Feed (Col 7) */}
        <div className="lg:col-span-7 rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase">
                {lang === 'ar' ? 'سجل الحزم الواردة فعلياً عبر مسار API الحي' : 'INCOMING TELEMETRY LOGS (SERVER REST STREAM)'}
              </h3>
            </div>
            <span className="text-[10px] font-mono-cyber text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              LIVE SSE
            </span>
          </div>

          <div className="space-y-1.5 max-h-[360px] overflow-y-auto pr-1 font-mono-cyber text-xs">
            {displayEvents.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                {lang === 'ar' ? 'في انتظار أول حزمة واردة من السيرفرات...' : 'Awaiting incoming packet stream from external servers...'}
              </div>
            ) : (
              displayEvents.map((ev, idx) => {
                const isThreat = ev.actionTaken !== 'PERMITTED';
                return (
                  <div 
                    key={`${ev.id}-${ev.timestamp || ''}-${idx}`} 
                    className={`p-2 rounded border transition-colors ${
                      isThreat 
                        ? 'bg-red-950/20 border-red-500/40 text-red-300' 
                        : 'bg-slate-900/50 border-slate-800/80 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-0.5">
                      <span className="text-cyan-400">{new Date(ev.timestamp).toLocaleTimeString()}</span>
                      <span className="text-slate-400">{ev.protocol} | Port {ev.destinationPort}</span>
                      <span className={`px-1.5 py-0.2 rounded font-bold text-[9px] ${
                        isThreat ? 'bg-red-950 text-red-300 border border-red-600/40' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {ev.actionTaken}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span>{ev.sourceIp}:{ev.sourcePort} &rarr; {ev.destinationIp}:{ev.destinationPort}</span>
                      <span className="text-slate-400">{ev.packetSize} B</span>
                    </div>

                    <div className="mt-1 flex items-center justify-between text-[9px] opacity-80 pt-1 border-t border-slate-800/50">
                      <span>H(x): <strong className="text-cyan-300">{ev.entropyValue}</strong></span>
                      <span>D_M: <strong className="text-emerald-300">{ev.mahalanobisDistance}</strong></span>
                      <span className="text-slate-400 truncate max-w-[200px]">{ev.hostname || 'external-agent'}</span>
                    </div>

                    {isThreat && ev.generatedFirewallRule && (
                      <div className="mt-1 text-[9px] font-mono-cyber bg-black/40 text-amber-300 p-1 rounded border border-amber-900/40 truncate">
                        {ev.generatedFirewallRule}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
