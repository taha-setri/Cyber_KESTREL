import React, { useState } from 'react';
import { 
  Building2, Shield, Key, Copy, Check, ExternalLink, Cpu, Activity, 
  Server, AlertTriangle, CheckCircle2, Lock, ArrowLeft, Globe, Zap,
  Download, FileText, Phone, MessageCircle, RefreshCw
} from 'lucide-react';
import { ClientWorkspace } from '../types/cyber';

interface ClientDedicatedPortalProps {
  tenant: ClientWorkspace;
  lang: 'ar' | 'en';
  onExitWorkspace: () => void;
  onOpenPricing?: () => void;
}

export const ClientDedicatedPortal: React.FC<ClientDedicatedPortalProps> = ({
  tenant,
  lang,
  onExitWorkspace,
  onOpenPricing
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'NODES' | 'API_ACCESS' | 'COMPLIANCE'>('OVERVIEW');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2500);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const percentQuota = (tenant.allocatedQuotaMonthly && tenant.allocatedQuotaMonthly > 0)
    ? Math.min(100, Math.round(((tenant.consumedQuotaMonthly || 0) / tenant.allocatedQuotaMonthly) * 100))
    : 0;
  const daysLeft = Math.max(0, Math.ceil(((tenant.expiresAt || Date.now() + 365 * 86400000) - Date.now()) / (1000 * 60 * 60 * 24)));
  const tenantInitials = ((tenant.name || tenant.nameAr || tenant.id || 'CL').slice(0, 2)).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Top Banner: Client Workspace Identification */}
      <div 
        className="rounded-2xl border p-6 relative overflow-hidden shadow-2xl"
        style={{
          background: `linear-gradient(135deg, #090e1a 0%, #0d1525 50%, #080d18 100%)`,
          borderColor: `${tenant.customBranding?.accentColor || '#10b981'}50`
        }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center font-black font-mono text-xl border shadow-lg"
              style={{
                backgroundColor: `${tenant.customBranding?.accentColor || '#10b981'}20`,
                borderColor: `${tenant.customBranding?.accentColor || '#10b981'}60`,
                color: tenant.customBranding?.accentColor || '#10b981'
              }}
            >
              {tenantInitials}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                  {lang === 'ar' ? 'مساحة العمل السيادية المعزولة للمؤسسة' : 'Isolated Sovereign Enterprise Workspace'}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-[10px] font-mono text-slate-300">
                  ID: {tenant.id}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white font-mono">
                {lang === 'ar' ? (tenant.nameAr || tenant.name) : (tenant.name || tenant.nameAr)}
              </h1>
              <p className="text-xs text-slate-400 font-mono mt-1 flex items-center gap-3">
                <span>{lang === 'ar' ? 'الباقة المفعلة:' : 'Plan:'} <b className="text-cyan-300">{(tenant.plan || 'ENTERPRISE_CORE').replace('_', ' ')}</b></span>
                <span>•</span>
                <span>{lang === 'ar' ? 'الصلاحية المتبقية:' : 'Remaining:'} <b className="text-emerald-400">{daysLeft} {lang === 'ar' ? 'يوم' : 'days'}</b></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white cursor-pointer"
              title={lang === 'ar' ? 'تحديث القياسات' : 'Refresh Telemetry'}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
            </button>
            <button
              onClick={onExitWorkspace}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500 text-slate-300 hover:text-white text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الرجوع للوحة الإدارة العامة' : 'Exit to Master Cockpit'}</span>
            </button>
          </div>
        </div>

        {/* Quick Nav Tabs for Client */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          {[
            { id: 'OVERVIEW', labelAr: 'نظرة عامة والتحصين', labelEn: 'Overview & Telemetry', icon: Activity },
            { id: 'NODES', labelAr: 'الخوادم والأصول المعزولة', labelEn: 'Assigned Nodes', icon: Server },
            { id: 'API_ACCESS', labelAr: 'تكامل الـ API والتراخيص', labelEn: 'API Integration', icon: Key },
            { id: 'COMPLIANCE', labelAr: 'شهادة الامتثال والضمان', labelEn: 'Sovereign Compliance', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                  isActive 
                    ? 'bg-cyan-500/20 border border-cyan-400 text-cyan-300 shadow-sm'
                    : 'bg-slate-900/60 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-slate-400 mb-1">{lang === 'ar' ? 'حالة الحماية السيادية' : 'Defense Status'}</div>
              <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>{lang === 'ar' ? 'مؤمن بنسبة 100%' : '100% PROTECTED'}</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">eBPF / XDP Sub-second Active</div>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-slate-400 mb-1">{lang === 'ar' ? 'الخوادم المحمية للمؤسسة' : 'Assigned Dedicated Nodes'}</div>
              <div className="text-xl font-black text-cyan-300 font-mono">
                {tenant.assignedServers.length} <span className="text-xs text-slate-400 font-normal">Active Instances</span>
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">Zero-Trust Network Perimeter</div>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-slate-400 mb-1">{lang === 'ar' ? 'سقف الاستهلاك الشهري' : 'Monthly Scanned Volume'}</div>
              <div className="text-xl font-black text-purple-300 font-mono">
                {(tenant.consumedQuotaMonthly / 1000).toFixed(0)}k / {(tenant.allocatedQuotaMonthly / 1000).toFixed(0)}k
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-2">
                <div className="bg-purple-500 h-full" style={{ width: `${percentQuota}%` }}></div>
              </div>
            </div>

            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-4">
              <div className="text-xs font-mono text-slate-400 mb-1">{lang === 'ar' ? 'تشفير البيانات' : 'Cryptographic Grade'}</div>
              <div className="text-xl font-black text-amber-300 font-mono">
                ML-KEM-1024
              </div>
              <div className="text-[10px] font-mono text-slate-500 mt-1">Post-Quantum NIST FIPS 203</div>
            </div>
          </div>

          {/* Client Dedicated Instance & Direct Support Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-black text-white font-mono flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'عنوان النسخة المستقلة للعميل' : 'Dedicated Instance Endpoint'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {lang === 'ar'
                  ? 'تم تخصيص هذه البوابة الحصرية لمهندسي الأمن ومسؤولي الأنظمة في مؤسستك فقط، مع عزل كامل لحركة المرور.'
                  : 'This isolated endpoint is provisioned exclusively for your organization security operations center.'}
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex items-center justify-between">
                <span className="text-xs font-mono text-cyan-300 truncate">{tenant.dedicatedInstanceUrl || 'https://soc.enterprise-node.ma'}</span>
                <button
                  onClick={() => copyText(tenant.dedicatedInstanceUrl || '', 'inst-url')}
                  className="text-slate-400 hover:text-cyan-400 text-xs font-mono flex items-center gap-1 cursor-pointer"
                >
                  {copied === 'inst-url' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="bg-[#0b101c] border border-emerald-500/30 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-black text-emerald-300 font-mono flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'ar' ? 'قنوات الدعم السيادي والمساعدة المباشرة' : 'Direct SLA & Executive Support'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono leading-relaxed">
                {lang === 'ar'
                  ? 'يتوفر فريق المهندسين ومسؤول المنظومة على مدار الساعة (24/7) لتلبية أي متطلبات فنية أو رفع سقف التراخيص.'
                  : 'Direct 24/7 technical hotline and executive desk for incident escalations and capacity upgrades.'}
              </p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`https://wa.me/212634424914?text=${encodeURIComponent(`السلام عليكم، تواصل من العميل [${tenant.name}] - معرف [${tenant.id}] بخصوص بيئة العمل والدعم الفني.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-lg bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>{lang === 'ar' ? 'واتساب الدعم' : 'WhatsApp Desk'}</span>
                </a>
                <a
                  href="tel:+212634424914"
                  className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <Phone className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'ar' ? 'هاتف الطوارئ' : 'Hotline'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Assigned Dedicated Nodes */}
      {activeTab === 'NODES' && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-black text-white font-mono flex items-center gap-2">
                <Server className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'الأصول والخوادم المعزولة التابعة لمؤسستك' : 'Scoped Infrastructure Assets'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {lang === 'ar' ? 'هذه العقد يتم فحصها حصرياً ولا تتداخل سجلاتها مع أي عميل آخر' : 'Dedicated network perimeter isolated from other tenants'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold">
              {(tenant.assignedServers || []).length} {lang === 'ar' ? 'خوادم مخصصة' : 'Isolated Nodes'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(tenant.assignedServers && tenant.assignedServers.length > 0 ? tenant.assignedServers : ['10.100.1.1 (Sovereign Node)']).map((srv, idx) => (
              <div key={idx} className="bg-slate-950/80 border border-slate-800 rounded-lg p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-mono text-white font-bold">{srv}</div>
                    <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>{lang === 'ar' ? 'محمي بواسطة eBPF Filter' : 'eBPF Filter Active'}</span>
                    </div>
                  </div>
                </div>

                <span className="text-[10px] font-mono bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  DEFCON 1
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: API Integration & License Key */}
      {activeTab === 'API_ACCESS' && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 space-y-5">
          <div>
            <h3 className="text-sm font-black text-white font-mono flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>{lang === 'ar' ? 'مفتاح الـ API والربط البرمجي' : 'API License Credentials & SDK'}</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {lang === 'ar' ? 'استخدم هذا المفتاح للربط مع أنظمتكم وتطبيقاتكم عبر الـ REST API' : 'Authenticate your internal workloads against the Sovereign Inspection Engine'}
            </p>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold">{lang === 'ar' ? 'مفتاح الترخيص البرمجي (Production API Key):' : 'Production API Token:'}</span>
              <button
                onClick={() => copyText(tenant.apiKey, 'prod-api-key')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {copied === 'prod-api-key' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>{lang === 'ar' ? 'نسخ المفتاح' : 'Copy Key'}</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-mono text-xs text-emerald-300 select-all overflow-x-auto">
              {tenant.apiKey}
            </div>
          </div>

          {/* Quick cURL Example for Client */}
          <div className="space-y-2">
            <div className="text-xs font-mono text-slate-300 font-bold">{lang === 'ar' ? 'نموذج فحص الحزم والاتصالات برمجياً:' : 'Sample Telemetry Ingestion Request (cURL):'}</div>
            <pre className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed" dir="ltr">
{`curl -X POST https://api.securite-maroc.defense/v1/telemetry \\
  -H "Authorization: Bearer ${tenant.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sourceIp": "196.200.14.88",
    "destinationIp": "${tenant.assignedServers[0]?.split(' ')[0] || '10.100.1.5'}",
    "sourcePort": 443,
    "destinationPort": 443,
    "protocol": "TLS 1.3",
    "payloadEntropy": 4.15
  }'`}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 4: Compliance & SLA */}
      {activeTab === 'COMPLIANCE' && (
        <div className="bg-[#0b101c] border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-black text-white font-mono flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>{lang === 'ar' ? 'شهادة التوثيق السيادي واتفاقية الخدمة (SLA)' : 'Sovereign Compliance & SLA'}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs font-mono text-slate-400">{lang === 'ar' ? 'جاهزية الخدمة المضمونة' : 'Guaranteed Uptime'}</div>
              <div className="text-lg font-black text-emerald-400 font-mono mt-1">99.999%</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs font-mono text-slate-400">{lang === 'ar' ? 'زمن الاستجابة للتهديد' : 'Mitigation Latency'}</div>
              <div className="text-lg font-black text-cyan-300 font-mono mt-1">&lt; 300 ms</div>
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-center">
              <div className="text-xs font-mono text-slate-400">{lang === 'ar' ? 'السيادة الوطنية للبيانات' : 'Data Residency'}</div>
              <div className="text-lg font-black text-purple-300 font-mono mt-1">100% On-Prem / Local</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
