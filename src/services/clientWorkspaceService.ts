import { ClientWorkspace } from '../types/cyber';

const STORAGE_KEY = 'acdc_client_workspaces_v1';
const ACTIVE_TENANT_KEY = 'acdc_active_tenant_session';

export const INITIAL_CLIENT_WORKSPACES: ClientWorkspace[] = [
  {
    id: 'TENANT-BM-9421',
    name: 'Bank Al-Maghrib Core Banking Node',
    nameAr: 'العقدة المصرفية السيادية - بنك المغرب',
    clientPasskey: 'CLI-BM-SEC-889',
    plan: 'ENTERPRISE_CORE',
    status: 'ACTIVE',
    assignedServers: ['10.100.1.5 (Core Banking Ledger)', '10.100.1.12 (SWIFT Sovereign Gateway)'],
    allocatedQuotaMonthly: 5000000,
    consumedQuotaMonthly: 842190,
    apiKey: 'SOV-LIVE-BM-8849-KEY-PROD',
    createdAt: Date.now() - 30 * 86400000,
    expiresAt: Date.now() + 335 * 86400000,
    contactEmail: 'security-operations@bankalmaghrib.ma',
    contactPhone: '+212 537 81 81 81',
    dedicatedInstanceUrl: 'https://bm-core.securite-maroc.defense',
    customBranding: {
      accentColor: '#10b981',
      logoText: 'BANK AL-MAGHRIB DEFENSE',
      customDomain: 'soc.bankalmaghrib.ma'
    }
  },
  {
    id: 'TENANT-CLOUD-7712',
    name: 'Atlas Cloud Telecom Mesh',
    nameAr: 'شبكة أطلس للاتصالات السحابية',
    clientPasskey: 'CLI-ATLAS-NET-402',
    plan: 'CLOUD_MESH_SOVEREIGN',
    status: 'ACTIVE',
    assignedServers: ['192.168.10.1 (BGP Border)', '192.168.20.5 (Kubernetes Cluster Edge)'],
    allocatedQuotaMonthly: 20000000,
    consumedQuotaMonthly: 4120800,
    apiKey: 'SOV-MESH-ATLAS-7710-PROD',
    createdAt: Date.now() - 15 * 86400000,
    expiresAt: Date.now() + 350 * 86400000,
    contactEmail: 'cloud-infra@atlas-telecom.ma',
    contactPhone: '+212 634 424 914',
    dedicatedInstanceUrl: 'https://atlas-mesh.securite-maroc.defense',
    customBranding: {
      accentColor: '#06b6d4',
      logoText: 'ATLAS TELCO SHIELD',
      customDomain: 'cyber.atlas-telecom.ma'
    }
  },
  {
    id: 'TENANT-MSSP-2026',
    name: 'CyberShield Africa MSSP Partner',
    nameAr: 'شريك الأمن المدار - سايبر شيلد أفريقيا',
    clientPasskey: 'CLI-MSSP-AFR-991',
    plan: 'MSSP_WHITE_LABEL',
    status: 'ACTIVE',
    assignedServers: ['172.16.4.10 (Multi-Tenant Hub)', '172.16.4.11 (Analytics Ingestion Node)'],
    allocatedQuotaMonthly: 50000000,
    consumedQuotaMonthly: 12890000,
    apiKey: 'SOV-MSSP-AFRICA-991-LIC',
    createdAt: Date.now() - 60 * 86400000,
    expiresAt: Date.now() + 305 * 86400000,
    contactEmail: 'mssp-core@cybershield-africa.com',
    contactPhone: '+212 634 424 914',
    dedicatedInstanceUrl: 'https://white-label.cybershield-africa.com',
    customBranding: {
      accentColor: '#a855f7',
      logoText: 'CYBERSHIELD DEFENSE MESH',
      customDomain: 'portal.cybershield-africa.com'
    }
  }
];

export function generateSafeAsciiCode(input: string, fallbackPrefix: string = 'NODE'): string {
  const asciiLetters = (input || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  if (asciiLetters.length >= 2) {
    return asciiLetters.slice(0, 5);
  }
  let hash = 0;
  for (let i = 0; i < (input || '').length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  const hashStr = Math.abs(hash).toString(36).toUpperCase().padStart(3, 'X');
  return `${fallbackPrefix.slice(0, 3)}${hashStr.slice(0, 3)}`;
}

export function getClientWorkspaces(): ClientWorkspace[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return INITIAL_CLIENT_WORKSPACES;
}

export function saveClientWorkspaces(workspaces: ClientWorkspace[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaces));
    window.dispatchEvent(new CustomEvent('acdc_workspaces_updated'));
  } catch {}
}

export function addClientWorkspace(workspace: ClientWorkspace): ClientWorkspace[] {
  const current = getClientWorkspaces();
  const existingFiltered = current.filter(w => w.id !== workspace.id);
  const updated = [workspace, ...existingFiltered];
  saveClientWorkspaces(updated);
  return updated;
}

export function updateClientWorkspace(id: string, updates: Partial<ClientWorkspace>): ClientWorkspace[] {
  const current = getClientWorkspaces();
  const updated = current.map(w => w.id === id ? { ...w, ...updates } : w);
  saveClientWorkspaces(updated);
  return updated;
}

export function deleteClientWorkspace(id: string): ClientWorkspace[] {
  const current = getClientWorkspaces();
  const updated = current.filter(w => w.id !== id);
  saveClientWorkspaces(updated);
  return updated;
}

export function getActiveClientSession(): ClientWorkspace | null {
  try {
    const saved = sessionStorage.getItem(ACTIVE_TENANT_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export function setActiveClientSession(tenant: ClientWorkspace | null): void {
  try {
    if (tenant) {
      sessionStorage.setItem(ACTIVE_TENANT_KEY, JSON.stringify(tenant));
      sessionStorage.setItem('acdc_client_authorized', 'true');
    } else {
      sessionStorage.removeItem(ACTIVE_TENANT_KEY);
      sessionStorage.removeItem('acdc_client_authorized');
    }
  } catch {}
}

export function findWorkspaceByPasskey(passkey: string): ClientWorkspace | null {
  const trimmed = passkey.trim();
  if (!trimmed) return null;
  const workspaces = getClientWorkspaces();
  const lower = trimmed.toLowerCase();
  const cleanAlpha = trimmed.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();

  return workspaces.find(w => {
    const passkeyLower = (w.clientPasskey || '').toLowerCase();
    const passkeyAlpha = passkeyLower.replace(/[^a-zA-Z0-9]/g, '');
    const apiLower = (w.apiKey || '').toLowerCase();
    const idLower = (w.id || '').toLowerCase();
    const nameLower = (w.name || '').toLowerCase();
    const nameArLower = (w.nameAr || '').toLowerCase();

    return (
      passkeyLower === lower ||
      apiLower === lower ||
      idLower === lower ||
      (passkeyAlpha.length > 3 && passkeyAlpha === cleanAlpha) ||
      nameLower === lower ||
      nameArLower === lower
    );
  }) || null;
}

export function formatClientHandoverDossier(workspace: ClientWorkspace, lang: 'ar' | 'en'): string {
  if (lang === 'ar') {
    return `=====================================================
🦅 منظومة كستريل (KESTREL-ACDC) للدفاع السيبراني الذاتي
بطاقة تسليم وتفعيل بيئة العمل السيادية للمؤسسة
=====================================================
المؤسسة: ${workspace.nameAr} (${workspace.name})
معرف العميل (Tenant ID): ${workspace.id}
باقة الحماية: ${workspace.plan}
حالة البيئة: نشطة وجاهزة (ACTIVE)
-----------------------------------------------------
🔑 مفتاح الولوج السري لمساحة العمل (Client Passkey):
${workspace.clientPasskey}

🛡️ مفتاح الترخيص البرمجي (Production API Key):
${workspace.apiKey}

🌐 رابط البوابة المستقلة للمؤسسة:
${workspace.dedicatedInstanceUrl || 'https://soc.securite-maroc.defense'}

خوادم الفحص المعزولة:
${workspace.assignedServers.join(' | ')}
-----------------------------------------------------
طريقة الدخول:
1. افتح بوابة النظام أو الرابط المخصص لمؤسستك.
2. أدخل مفتاح الولوج (Client Passkey) أعلاه لتسجيل الدخول المباشر.
3. للدعم الفني المباشر (24/7): +212 634 424 914
=====================================================`;
  }

  return `=====================================================
🦅 KESTREL-ACDC SOVEREIGN CYBER DEFENSE GRID
Client Dedicated Workspace Handover Certificate
=====================================================
Organization: ${workspace.name}
Tenant Identifier: ${workspace.id}
Service Plan: ${workspace.plan}
Status: ACTIVE & FULLY ISOLATED
-----------------------------------------------------
🔑 Secret Client Passkey (Login Key):
${workspace.clientPasskey}

🛡️ Production API Key:
${workspace.apiKey}

🌐 Dedicated Endpoint:
${workspace.dedicatedInstanceUrl || 'https://soc.securite-maroc.defense'}

Assigned Scoped Nodes:
${workspace.assignedServers.join(' | ')}
-----------------------------------------------------
Access Instructions:
1. Open the Sovereign Gateway Portal or your dedicated endpoint.
2. Enter your Secret Client Passkey to unlock your isolated workspace.
3. 24/7 Executive Engineering Hotline: +212 634 424 914
=====================================================`;
}
