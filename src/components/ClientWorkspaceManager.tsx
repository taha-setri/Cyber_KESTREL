import React, { useState, useEffect } from 'react';
import { 
  Building2, Users, Key, Plus, Shield, Globe, HardDrive, CheckCircle2, 
  ExternalLink, Copy, Check, Trash2, Edit3, ShieldAlert, Cpu, Sparkles,
  Search, ArrowRight, RefreshCw, Layers, Phone, MessageCircle, Lock, AlertCircle, Share2
} from 'lucide-react';
import { ClientWorkspace, TenantPlan } from '../types/cyber';
import { 
  getClientWorkspaces, 
  addClientWorkspace, 
  updateClientWorkspace, 
  deleteClientWorkspace,
  generateSafeAsciiCode,
  formatClientHandoverDossier
} from '../services/clientWorkspaceService';
import { soundEffects } from '../services/soundEffects';

interface ClientWorkspaceManagerProps {
  lang: 'ar' | 'en';
  onSwitchToClientView?: (tenant: ClientWorkspace) => void;
}

export const ClientWorkspaceManager: React.FC<ClientWorkspaceManagerProps> = ({
  lang,
  onSwitchToClientView
}) => {
  const [workspaces, setWorkspaces] = useState<ClientWorkspace[]>(() => getClientWorkspaces());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<string>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copiedDossierId, setCopiedDossierId] = useState<string | null>(null);
  const [isCreatingModal, setIsCreatingModal] = useState(false);
  const [createdResult, setCreatedResult] = useState<ClientWorkspace | null>(null);
  const [formError, setFormError] = useState('');

  // Auto-sync workspaces when updated across tabs or components
  useEffect(() => {
    const handleSync = () => setWorkspaces(getClientWorkspaces());
    window.addEventListener('acdc_workspaces_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('acdc_workspaces_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  // Form State for new Workspace
  const [newOrgName, setNewOrgName] = useState('');
  const [newOrgNameAr, setNewOrgNameAr] = useState('');
  const [newPlan, setNewPlan] = useState<TenantPlan>('ENTERPRISE_CORE');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('+212 6');
  const [newServers, setNewServers] = useState('10.0.1.10 (Production Server), 10.0.1.20 (Database Gateway)');
  const [newCustomDomain, setNewCustomDomain] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    soundEffects.playRadarBlip(850, 30);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const copyDossier = (workspace: ClientWorkspace) => {
    const dossierText = formatClientHandoverDossier(workspace, lang);
    navigator.clipboard.writeText(dossierText);
    setCopiedDossierId(workspace.id);
    soundEffects.playMitigationChirp();
    setTimeout(() => setCopiedDossierId(null), 2500);
  };

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    const trimmedEn = newOrgName.trim();
    const trimmedAr = newOrgNameAr.trim();

    if (!trimmedEn && !trimmedAr) {
      setFormError(
        lang === 'ar' 
          ? 'يرجى إدخال اسم المؤسسة أو العميل بالعربية أو الإنجليزية للمتابعة!' 
          : 'Please provide the client or organization name to proceed!'
      );
      return;
    }

    const timestamp = Date.now();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    
    // Generate clean safe ASCII slug and codes
    const safeSeed = trimmedEn || trimmedAr;
    const safeCode = generateSafeAsciiCode(safeSeed, 'CLI');
    const tenantId = `TENANT-${safeCode}-${randomSuffix}`;
    const clientPasskey = `CLI-${safeCode}-KEY-${randomSuffix}`;
    const randomHex = Math.random().toString(36).substring(2, 8).toUpperCase();
    const apiKey = `SOV-PROD-${safeCode}-${randomHex}`;

    // Ensure non-empty bilingual names
    const finalNameEn = trimmedEn || (trimmedAr ? `${trimmedAr} (Secure Node)` : `Client Node ${randomSuffix}`);
    const finalNameAr = trimmedAr || trimmedEn || `عقدة عميل سيادية ${randomSuffix}`;

    let quota = 5000000;
    if (newPlan === 'CLOUD_MESH_SOVEREIGN') quota = 20000000;
    if (newPlan === 'MSSP_WHITE_LABEL') quota = 50000000;
    if (newPlan === 'BUSINESS_PRO') quota = 2500000;

    const parsedServers = newServers
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const safeServers = parsedServers.length > 0
      ? parsedServers
      : [`10.100.1.${Math.floor(2 + Math.random() * 250)} (Isolated Sovereign Server)`];

    const safeDomain = newCustomDomain.trim()
      ? (newCustomDomain.trim().startsWith('http') ? newCustomDomain.trim() : `https://${newCustomDomain.trim()}`)
      : `https://${safeCode.toLowerCase()}-${randomSuffix}.securite-maroc.defense`;

    const newWorkspace: ClientWorkspace = {
      id: tenantId,
      name: finalNameEn,
      nameAr: finalNameAr,
      clientPasskey,
      plan: newPlan,
      status: 'ACTIVE',
      assignedServers: safeServers,
      allocatedQuotaMonthly: quota,
      consumedQuotaMonthly: 0,
      apiKey,
      createdAt: timestamp,
      expiresAt: timestamp + 365 * 86400000,
      contactEmail: newContactEmail.trim() || 'security@client-corp.ma',
      contactPhone: newContactPhone.trim() || '+212 634 424 914',
      dedicatedInstanceUrl: safeDomain,
      customBranding: {
        accentColor: newPlan === 'MSSP_WHITE_LABEL' ? '#a855f7' : newPlan === 'CLOUD_MESH_SOVEREIGN' ? '#06b6d4' : '#10b981',
        logoText: (finalNameEn || finalNameAr).substring(0, 20).toUpperCase(),
        customDomain: newCustomDomain.trim() || undefined
      }
    };

    // Save and update state
    const updated = addClientWorkspace(newWorkspace);
    setWorkspaces(updated);
    soundEffects.playMitigationChirp();

    // Show creation success result inside modal for immediate launch and handover
    setCreatedResult(newWorkspace);

    // Reset input fields
    setNewOrgName('');
    setNewOrgNameAr('');
    setNewContactEmail('');
    setNewCustomDomain('');
  };

  const handleCloseModal = () => {
    setIsCreatingModal(false);
    setCreatedResult(null);
    setFormError('');
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(lang === 'ar' ? `هل أنت متأكد من حذف بيئة العميل [${name}]؟` : `Delete client workspace [${name}]?`)) {
      const updated = deleteClientWorkspace(id);
      setWorkspaces(updated);
      soundEffects.playRadarBlip(600, 40);
    }
  };

  const filteredWorkspaces = workspaces.filter(w => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = (w.name || '').toLowerCase().includes(q) ||
                          (w.nameAr || '').includes(searchQuery) ||
                          (w.id || '').toLowerCase().includes(q) ||
                          (w.clientPasskey || '').toLowerCase().includes(q) ||
                          (w.apiKey || '').toLowerCase().includes(q);
    const matchesPlan = selectedPlanFilter === 'ALL' || w.plan === selectedPlanFilter;
    return matchesSearch && matchesPlan;
  });

  const getPlanBadge = (plan: TenantPlan) => {
    switch(plan) {
      case 'ENTERPRISE_CORE':
        return { labelAr: 'مؤسسي سيادي Core', labelEn: 'Enterprise Core', bg: 'bg-emerald-950 border-emerald-500/50 text-emerald-400' };
      case 'CLOUD_MESH_SOVEREIGN':
        return { labelAr: 'شبكة سحابية Mesh', labelEn: 'Cloud Mesh', bg: 'bg-cyan-950 border-cyan-500/50 text-cyan-400' };
      case 'MSSP_WHITE_LABEL':
        return { labelAr: 'مزود أمن MSSP', labelEn: 'MSSP White-Label', bg: 'bg-purple-950 border-purple-500/50 text-purple-400' };
      case 'BUSINESS_PRO':
        return { labelAr: 'أعمال احترافي Pro', labelEn: 'Business Pro', bg: 'bg-blue-950 border-blue-500/50 text-blue-400' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="bg-gradient-to-r from-[#0d1525] via-[#091122] to-[#0d1525] border border-cyan-500/30 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
                {lang === 'ar' ? 'إدارة بيئات ومساحات عمل العملاء (Multi-Tenant Hub)' : 'Multi-Tenant Client Workspace Controller'}
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-black text-white font-mono flex items-center gap-2">
              <Building2 className="w-6 h-6 text-cyan-400" />
              <span>{lang === 'ar' ? 'تخصيص وعزل بيئات العمل للمشتركين' : 'Sovereign Client Workspaces & Isolation'}</span>
            </h2>
            <p className="text-xs text-slate-400 max-w-3xl mt-1 leading-relaxed">
              {lang === 'ar' 
                ? 'لكل عميل مساحة عمل معزولة تماماً (Isolated Workspace)، مفتاح تشفيري خاص للدخول، خوادم مخصصة للفحص، وسقف استهلاك محدد. تمنح العميل مفتاحه ليدخل بيئته دون أن يرى بيانات العملاء الآخرين.'
                : 'Each subscriber receives an isolated workspace, dedicated client passkey, scoped node inspection assets, and quota limits. Clients only access their own organization data.'}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsCreatingModal(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-mono font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{lang === 'ar' ? 'إضافة عميل / بيئة جديدة ＋' : 'Provision Client Workspace ＋'}</span>
            </button>
          </div>
        </div>

        {/* Global Aggregate KPI metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800">
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400">{lang === 'ar' ? 'إجمالي العملاء النشطين' : 'Active Client Workspaces'}</div>
            <div className="text-xl font-black text-white font-mono mt-1">{workspaces.length} <span className="text-xs text-emerald-400 font-normal">Tenants</span></div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400">{lang === 'ar' ? 'الخوادم المعزولة المحمية' : 'Assigned Dedicated Nodes'}</div>
            <div className="text-xl font-black text-cyan-300 font-mono mt-1">
              {workspaces.reduce((acc, w) => acc + w.assignedServers.length, 0)} <span className="text-xs text-slate-400 font-normal">Nodes</span>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400">{lang === 'ar' ? 'إجمالي الحصص المخصصة' : 'Total Allocated Quota'}</div>
            <div className="text-xl font-black text-purple-300 font-mono mt-1">
              {(workspaces.reduce((acc, w) => acc + w.allocatedQuotaMonthly, 0) / 1000000).toFixed(1)}M <span className="text-xs text-slate-400 font-normal">req/mo</span>
            </div>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3">
            <div className="text-[10px] font-mono text-slate-400">{lang === 'ar' ? 'درجة العزل السيادي' : 'Isolation Assurance'}</div>
            <div className="text-xl font-black text-emerald-400 font-mono mt-1">100% <span className="text-xs text-slate-400 font-normal">Zero-Leak</span></div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/60 border border-slate-800/80 p-3 rounded-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={lang === 'ar' ? 'بحث عن عميل، مؤسسة، مفتاح...' : 'Search workspace, key, tenant...'}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg py-2 pr-9 pl-3 text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'ENTERPRISE_CORE', 'CLOUD_MESH_SOVEREIGN', 'MSSP_WHITE_LABEL', 'BUSINESS_PRO'].map((plan) => (
            <button
              key={plan}
              onClick={() => setSelectedPlanFilter(plan)}
              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedPlanFilter === plan
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {plan === 'ALL' ? (lang === 'ar' ? 'الكل' : 'All') : plan.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Workspaces Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredWorkspaces.map((workspace) => {
          const badge = getPlanBadge(workspace.plan);
          const percentUsed = Math.min(100, Math.round((workspace.consumedQuotaMonthly / workspace.allocatedQuotaMonthly) * 100));
          const isExpiringSoon = (workspace.expiresAt - Date.now()) < 30 * 86400000;

          return (
            <div 
              key={workspace.id}
              className="bg-[#0b101c] border border-slate-800 hover:border-cyan-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between shadow-lg relative group"
            >
              {/* Card Header */}
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-black font-mono text-sm border"
                      style={{ 
                        backgroundColor: `${workspace.customBranding?.accentColor || '#10b981'}15`,
                        borderColor: `${workspace.customBranding?.accentColor || '#10b981'}40`,
                        color: workspace.customBranding?.accentColor || '#10b981'
                      }}
                    >
                      {workspace.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white font-mono leading-tight">
                        {lang === 'ar' ? workspace.nameAr : workspace.name}
                      </h4>
                      <div className="text-[10px] font-mono text-slate-400">
                        {workspace.id}
                      </div>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${badge.bg}`}>
                    {lang === 'ar' ? badge.labelAr : badge.labelEn}
                  </span>
                </div>

                {/* Client Passkey Box (Given to Client) */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2.5 mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Key className="w-3 h-3" />
                      <span>{lang === 'ar' ? 'مفتاح دخول العميل السري:' : 'Client Access Passkey:'}</span>
                    </span>
                    <button
                      onClick={() => copyToClipboard(workspace.clientPasskey, `pass-${workspace.id}`)}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      title={lang === 'ar' ? 'نسخ المفتاح' : 'Copy Key'}
                    >
                      {copiedKey === `pass-${workspace.id}` ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>{lang === 'ar' ? 'نسخ للعميل' : 'Copy'}</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-amber-300 bg-slate-900/90 py-1 px-2 rounded border border-amber-500/20 font-bold select-all overflow-x-auto">
                    {workspace.clientPasskey}
                  </div>
                </div>

                {/* API Key */}
                <div className="bg-slate-950/40 border border-slate-800/60 rounded-lg p-2 mt-2 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate max-w-[190px]">
                    API: <span className="text-slate-300 font-mono">{workspace.apiKey.slice(0, 18)}...</span>
                  </span>
                  <button
                    onClick={() => copyToClipboard(workspace.apiKey, `api-${workspace.id}`)}
                    className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                  >
                    {copiedKey === `api-${workspace.id}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  </button>
                </div>

                {/* Assigned Dedicated Servers */}
                <div className="mt-3">
                  <div className="text-[10px] font-mono text-slate-400 mb-1 flex items-center gap-1">
                    <Cpu className="w-3 h-3 text-cyan-400" />
                    <span>{lang === 'ar' ? 'الخوادم والبنى التحتية المعزولة للعميل:' : 'Assigned Client Assets:'}</span>
                  </div>
                  <div className="space-y-1">
                    {workspace.assignedServers.map((srv, idx) => (
                      <div key={idx} className="text-[10px] font-mono bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800/60 text-slate-300 truncate">
                        • {srv}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quota Usage Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                    <span>{lang === 'ar' ? 'الاستهلاك الشهري' : 'Monthly Quota'}</span>
                    <span className="text-white font-bold">{percentUsed}% ({(workspace.consumedQuotaMonthly / 1000).toFixed(0)}k / {(workspace.allocatedQuotaMonthly / 1000).toFixed(0)}k)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className={`h-full transition-all duration-300 ${percentUsed > 80 ? 'bg-rose-500' : percentUsed > 50 ? 'bg-amber-400' : 'bg-emerald-400'}`}
                      style={{ width: `${percentUsed}%` }}
                    ></div>
                  </div>
                </div>

                {/* Contact & Subdomain */}
                <div className="mt-3 pt-2 border-t border-slate-800/70 text-[10px] font-mono text-slate-400 space-y-0.5">
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'المسؤول:' : 'Contact:'}</span>
                    <span className="text-slate-300 truncate max-w-[160px]">{workspace.contactEmail}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{lang === 'ar' ? 'الهاتف:' : 'Phone:'}</span>
                    <span className="text-slate-300">{workspace.contactPhone}</span>
                  </div>
                  {workspace.customBranding?.customDomain && (
                    <div className="flex justify-between text-cyan-400">
                      <span>{lang === 'ar' ? 'النطاق المخصص:' : 'Domain:'}</span>
                      <span className="font-bold">{workspace.customBranding.customDomain}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSwitchToClientView && onSwitchToClientView(workspace)}
                    className="flex-1 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-950 via-cyan-900 to-emerald-950 hover:from-cyan-900 hover:to-emerald-900 border border-cyan-500/60 hover:border-cyan-400 text-cyan-200 font-mono text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all shadow-md active:scale-95"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{lang === 'ar' ? '🚀 دخول بيئة العميل' : '🚀 Open Workspace'}</span>
                  </button>

                  <button
                    onClick={() => copyDossier(workspace)}
                    className="py-2 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-500/50 text-amber-300 font-mono text-xs flex items-center gap-1 cursor-pointer transition-all"
                    title={lang === 'ar' ? 'نسخ بطاقة التسليم للعميل (واتساب / بريد)' : 'Copy Client Handover Dossier'}
                  >
                    {copiedDossierId === workspace.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[10px] text-emerald-400 font-bold">{lang === 'ar' ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="text-[10px]">{lang === 'ar' ? 'بطاقة العميل' : 'Dossier'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => handleDelete(workspace.id, workspace.name)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-rose-950/80 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 cursor-pointer transition-all"
                    title={lang === 'ar' ? 'حذف البيئة' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create / Provision New Client Workspace */}
      {isCreatingModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="bg-[#0b101c] border-2 border-cyan-500/60 rounded-2xl w-full max-w-xl max-h-[92vh] overflow-y-auto p-5 sm:p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-cyan-950 border border-cyan-500/50">
                  <Building2 className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white font-mono">
                    {createdResult
                      ? (lang === 'ar' ? '✅ تم تدشين بيئة العميل بنجاح!' : '✅ Client Workspace Provisioned!')
                      : (lang === 'ar' ? 'تجهيز بيئة عمل خاصة لعميل جديد' : 'Provision Dedicated Client Workspace')}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {createdResult
                      ? (lang === 'ar' ? 'تم إنشاء المفاتيح وتخصيص البنية التحتية فورياً' : 'Keys generated and isolated nodes allocated')
                      : (lang === 'ar' ? 'توليد مفاتيح الدخول، تعيين الأصول، وتحديد الباقة' : 'Generate client credentials & isolate operational telemetry')}
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseModal}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            {createdResult ? (
              /* Success & Handover Screen */
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-emerald-300 font-mono">
                      {lang === 'ar' ? 'البيئة جاهزة ونشطة للعمل فوراً' : 'Workspace Ready & Fully Active'}
                    </h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      {createdResult.nameAr} ({createdResult.name}) — ID: {createdResult.id}
                    </p>
                  </div>
                </div>

                {/* Key Handover Box */}
                <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-amber-300 font-bold mb-1">
                      <span className="flex items-center gap-1.5">
                        <Key className="w-3.5 h-3.5 text-amber-400" />
                        <span>{lang === 'ar' ? 'مفتاح دخول العميل السري (Client Passkey):' : 'Client Access Passkey:'}</span>
                      </span>
                      <button
                        onClick={() => copyToClipboard(createdResult.clientPasskey, 'created-pass')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'created-pass' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{copiedKey === 'created-pass' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-900 border border-amber-500/20 text-amber-300 font-mono text-xs font-bold select-all break-all">
                      {createdResult.clientPasskey}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300 font-bold mb-1">
                      <span>{lang === 'ar' ? 'مفتاح الترخيص البرمجي (API Token):' : 'Production API Token:'}</span>
                      <button
                        onClick={() => copyToClipboard(createdResult.apiKey, 'created-api')}
                        className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                      >
                        {copiedKey === 'created-api' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span className="text-[11px]">{copiedKey === 'created-api' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                      </button>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 font-mono text-[11px] select-all break-all">
                      {createdResult.apiKey}
                    </div>
                  </div>

                  <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                    <span>{lang === 'ar' ? 'رابط البيئة المستقلة:' : 'Dedicated Endpoint:'}</span>
                    <span className="text-cyan-300 font-bold">{createdResult.dedicatedInstanceUrl}</span>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => {
                      if (onSwitchToClientView) {
                        onSwitchToClientView(createdResult);
                      }
                      handleCloseModal();
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black font-mono font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30 cursor-pointer active:scale-95 transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{lang === 'ar' ? '🚀 الدخول المباشر إلى بيئة العميل الآن' : '🚀 Launch Client Workspace Now'}</span>
                  </button>

                  <button
                    onClick={() => copyDossier(createdResult)}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    {copiedDossierId === createdResult.id ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400">{lang === 'ar' ? 'تم نسخ بطاقة التسليم بنجاح!' : 'Handover Dossier Copied!'}</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>{lang === 'ar' ? '📋 نسخ بطاقة التسليم الرسمية للعميل (واتساب / بريد)' : '📋 Copy Official Client Handover Dossier'}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2 rounded-xl bg-slate-900/60 hover:bg-slate-800 text-slate-400 text-xs font-mono cursor-pointer transition-all"
                  >
                    {lang === 'ar' ? 'إغلاق والعودة لقائمة البيئات' : 'Close and Return to Workspaces'}
                  </button>
                </div>
              </div>
            ) : (
              /* Create Form */
              <form onSubmit={handleCreateWorkspace} className="space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-mono flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Quick Presets for 1-click test */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  <span className="text-[10px] font-mono text-slate-400 shrink-0">{lang === 'ar' ? 'نماذج سريعة:' : 'Quick Presets:'}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOrgName('Attijariwafa Bank SOC');
                      setNewOrgNameAr('مركز العمليات السيادية - التجاري وفا بنك');
                      setNewPlan('CLOUD_MESH_SOVEREIGN');
                      setNewServers('10.200.1.10 (Core Banking), 10.200.1.20 (Swift Gateway)');
                      setNewContactEmail('soc@attijariwafa.ma');
                      setFormError('');
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 hover:bg-cyan-900 cursor-pointer shrink-0"
                  >
                    🏦 Attijariwafa Bank
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOrgName('Maroc Telecom Datacenter');
                      setNewOrgNameAr('مركز بيانات اتصالات المغرب');
                      setNewPlan('ENTERPRISE_CORE');
                      setNewServers('10.150.0.1 (Carrier Gateway), 10.150.0.2 (DNS Shield)');
                      setNewContactEmail('datacenter@iam.ma');
                      setFormError('');
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 cursor-pointer shrink-0"
                  >
                    📡 Maroc Telecom
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewOrgName('Ministry Sovereign Cloud Node');
                      setNewOrgNameAr('العقدة السحابية السيادية لوزارة الانتقال الرقمي');
                      setNewPlan('MSSP_WHITE_LABEL');
                      setNewServers('10.50.1.1 (Gov Portal Shield), 10.50.1.2 (Identity Hub)');
                      setNewContactEmail('ciso@gov.ma');
                      setFormError('');
                    }}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-950/70 border border-purple-700/50 text-purple-300 hover:bg-purple-900 cursor-pointer shrink-0"
                  >
                    🇲🇦 Gov Sovereign Node
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                      {lang === 'ar' ? 'اسم المؤسسة / العميل (EN):' : 'Organization Name (EN):'}
                    </label>
                    <input
                      type="text"
                      value={newOrgName}
                      onChange={e => {
                        setNewOrgName(e.target.value);
                        setFormError('');
                      }}
                      placeholder="e.g. Attijariwafa Bank Security Hub"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                      {lang === 'ar' ? 'اسم المؤسسة بالعربية:' : 'Organization Name (AR):'}
                    </label>
                    <input
                      type="text"
                      value={newOrgNameAr}
                      onChange={e => {
                        setNewOrgNameAr(e.target.value);
                        setFormError('');
                      }}
                      placeholder="مثال: مركز العمليات الأمنية - التجاري وفا بنك"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                    {lang === 'ar' ? 'باقة الاشتراك المخصصة:' : 'Assigned Subscription Plan:'}
                  </label>
                  <select
                    value={newPlan}
                    onChange={e => setNewPlan(e.target.value as TenantPlan)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                  >
                    <option value="ENTERPRISE_CORE">{lang === 'ar' ? 'Enterprise Core (مؤسسي سيادي - 5M طلب شهرياً)' : 'Enterprise Core (5M req/mo)'}</option>
                    <option value="CLOUD_MESH_SOVEREIGN">{lang === 'ar' ? 'Cloud Mesh Sovereign (شبكة سحابية وطنية - 20M طلب)' : 'Cloud Mesh Sovereign (20M req/mo)'}</option>
                    <option value="MSSP_WHITE_LABEL">{lang === 'ar' ? 'MSSP White-Label (شريك أمني مع علامة تجارية - 50M طلب)' : 'MSSP White-Label (50M req/mo)'}</option>
                    <option value="BUSINESS_PRO">{lang === 'ar' ? 'Business Pro (أعمال احترافي - 2.5M طلب)' : 'Business Pro (2.5M req/mo)'}</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                      {lang === 'ar' ? 'البريد الإلكتروني للتواصل:' : 'Contact Email:'}
                    </label>
                    <input
                      type="email"
                      value={newContactEmail}
                      onChange={e => setNewContactEmail(e.target.value)}
                      placeholder="ciso@client-domain.ma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                      {lang === 'ar' ? 'هاتف التواصل / واتساب:' : 'Contact Phone / WhatsApp:'}
                    </label>
                    <input
                      type="text"
                      value={newContactPhone}
                      onChange={e => setNewContactPhone(e.target.value)}
                      placeholder="+212 634 424 914"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                    {lang === 'ar' ? 'الخوادم والأصول المعزولة (مفصولة بفاصلة):' : 'Assigned Dedicated Nodes / IPs:'}
                  </label>
                  <textarea
                    rows={2}
                    value={newServers}
                    onChange={e => setNewServers(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-300 mb-1 font-bold">
                    {lang === 'ar' ? 'نطاق فرعي مخصص (اختياري):' : 'Custom Subdomain (Optional):'}
                  </label>
                  <input
                    type="text"
                    value={newCustomDomain}
                    onChange={e => setNewCustomDomain(e.target.value)}
                    placeholder="e.g. soc.client-domain.ma"
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white font-mono focus:border-cyan-500 outline-none"
                  />
                </div>

                <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-[11px] font-mono text-emerald-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    {lang === 'ar'
                      ? 'سيتم توليد مفتاح دخول فريد (Passkey) وترخيص API مشفر فوراً لتسليمه للعميل بعد التدشين.'
                      : 'A unique client passkey and cryptographically sealed API token will be generated immediately.'}
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white text-xs font-mono cursor-pointer"
                  >
                    {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-black text-xs font-mono font-black cursor-pointer shadow-lg shadow-emerald-500/20"
                  >
                    {lang === 'ar' ? 'تأكيد وتدشين البيئة فوراً' : 'Provision Workspace Now'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
