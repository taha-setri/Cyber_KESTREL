import { SessionSnapshot, CommandCenterKPIs, DefconLevel } from '../types/cyber';

const STORAGE_KEY = 'ACDC_SESSION_HISTORY_ARCHIVE_v1';

export function getStoredSessionSnapshots(): SessionSnapshot[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultSeedSnapshots();
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : getDefaultSeedSnapshots();
  } catch {
    return getDefaultSeedSnapshots();
  }
}

export function saveSessionSnapshot(
  kpis: CommandCenterKPIs,
  defconLevel: DefconLevel,
  merkleRoot: string,
  notes?: string
): SessionSnapshot {
  const currentSnapshots = getStoredSessionSnapshots();
  const newSnapshot: SessionSnapshot = {
    id: `SNAP-${Date.now().toString(36).toUpperCase()}`,
    timestamp: Date.now(),
    formattedDate: new Date().toLocaleString(),
    totalThreats: kpis.activeNodes + (kpis.mitigationsCount > 0 ? kpis.mitigationsCount : 4),
    neutralizedCount: kpis.mitigationsCount,
    totalMitigations: kpis.mitigationsCount,
    efficacyIndex: kpis.efficacyIndex,
    mttdMs: kpis.mttdMs,
    mttrSec: kpis.mttrSec,
    defconLevel,
    merkleRoot,
    notes: notes || 'Operational Snapshot'
  };

  const updated = [newSnapshot, ...currentSnapshots].slice(0, 25); // retain last 25 audits
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage quota or disabled
  }
  return newSnapshot;
}

export function clearSessionSnapshots(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

function getDefaultSeedSnapshots(): SessionSnapshot[] {
  return [];
}
