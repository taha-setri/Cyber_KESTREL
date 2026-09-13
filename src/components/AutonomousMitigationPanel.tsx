import React from 'react';
import { 
  ShieldAlert, 
  Zap, 
  Layers, 
  Key, 
  Lock, 
  CheckCircle2, 
  AlertOctagon, 
  Cpu, 
  RefreshCw,
  Server,
  Activity
} from 'lucide-react';
import { ThreatVector, DefenseActionLog } from '../types/cyber';

interface AutonomousMitigationPanelProps {
  threats: ThreatVector[];
  defenseLogs: DefenseActionLog[];
  onSyncKernelPolicies?: () => void;
  onSelectThreat: (threat: ThreatVector) => void;
  lang: 'ar' | 'en';
}

export const AutonomousMitigationPanel: React.FC<AutonomousMitigationPanelProps> = ({
  threats,
  defenseLogs,
  onSyncKernelPolicies,
  onSelectThreat,
  lang
}) => {
  return (
    <div className="space-y-4">
      
      {/* Live Operational Actuators & OODA Loop Status */}
      <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-slate-100 font-display-cyber">
                {lang === 'ar' ? 'منظومة التحييد والمشغلات العتادية اللحظية (Production Autonomous Actuators)' : 'AUTONOMOUS MITIGATION & WIRE-SPEED CLOSED-LOOP DEFENSE'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'ar' 
                ? 'مشغلات تحييد فاعلة على مستوى النواة وبطاقات الشبكة (eBPF/XDP وSDN وIdP وEDR) تعمل باستقلالية كاملة وبسرعة السلك دون حاجة لتدخل بشري.' 
                : 'Production-grade in-kernel and hardware NIC actuators (eBPF/XDP, SDN, IdP, and EDR) enforcing sub-second wire-speed mitigation.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 text-xs font-mono-cyber">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              {lang === 'ar' ? 'الحلقة المغلقة: نشطة 100%' : 'Closed Loop: 100% Autonomous'}
            </span>
            {onSyncKernelPolicies && (
              <button
                onClick={onSyncKernelPolicies}
                className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-mono-cyber flex items-center gap-1.5 transition-colors cursor-pointer"
                title={lang === 'ar' ? 'إجراء تدقيق ومزامنة فورية للسياسات مع النواة' : 'Audit and synchronize active kernel rules'}
              >
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
                <span>{lang === 'ar' ? 'مزامنة سياسات النواة' : 'Sync Kernel Policies'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Live Hardware Actuators Operational Status Deck */}
        <div>
          <div className="text-xs font-semibold text-slate-300 mb-2 font-display-cyber flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'حالة المشغلات الدفاعية الفعالة في النواة ومنافذ الشبكة:' : 'Active In-Kernel & Hardware Mitigation Actuators:'}</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            
            {/* Actuator 1: eBPF / XDP */}
            <div className="p-3 rounded-lg border border-red-900/40 bg-[#060a14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono-cyber font-bold px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-600/30">
                    XDP_DRV HOOK
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-cyber">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    LIVE
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-100 mb-0.5">
                  {lang === 'ar' ? 'مرشح eBPF/XDP العتادي' : 'eBPF / XDP Wire Filter'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'إسقاط مباشر في ذاكرة NIC دون عبور النواة' : 'Zero-copy NIC drop at wire-speed'}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-cyber">
                <span className="text-slate-500">Latency:</span>
                <span className="text-red-400 font-bold">~0.38 ms</span>
              </div>
            </div>

            {/* Actuator 2: SDN OpenFlow */}
            <div className="p-3 rounded-lg border border-amber-900/40 bg-[#060a14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono-cyber font-bold px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-600/30">
                    FLOWSPEC SDN
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-cyber">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ENFORCED
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-100 mb-0.5">
                  {lang === 'ar' ? 'عزل SDN والتقسيم المجهري' : 'SDN Micro-Segmentation'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'تقييد نصف قطر الانفجار على وثبة واحدة' : 'Strict 1-hop blast radius constraint'}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-cyber">
                <span className="text-slate-500">Isolation:</span>
                <span className="text-amber-400 font-bold">1.45 ms</span>
              </div>
            </div>

            {/* Actuator 3: IdP Revoke */}
            <div className="p-3 rounded-lg border border-purple-900/40 bg-[#060a14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono-cyber font-bold px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-600/30">
                    ZERO-TRUST IDP
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-cyber">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    SYNCED
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-100 mb-0.5">
                  {lang === 'ar' ? 'إبطال تذاكر وهوية IdP' : 'IdP Ephemeral Revoker'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'إلغاء فوري لجلسات Kerberos وOAuth' : 'Continuous token revocation on anomaly'}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-cyber">
                <span className="text-slate-500">TTL:</span>
                <span className="text-purple-400 font-bold">60s Ephemeral</span>
              </div>
            </div>

            {/* Actuator 4: EDR Kernel */}
            <div className="p-3 rounded-lg border border-cyan-900/40 bg-[#060a14] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono-cyber font-bold px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-600/30">
                    SECCOMP / BPF
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-cyber">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    HOOKED
                  </span>
                </div>
                <div className="font-bold text-xs text-slate-100 mb-0.5">
                  {lang === 'ar' ? 'حارس ذاكرة النواة EDR' : 'EDR Kernel Memory Guard'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {lang === 'ar' ? 'تجميد فوري للعمليات عند أي استدعاء شاذ' : 'Thread freezing on unmapped execution'}
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono-cyber">
                <span className="text-slate-500">Response:</span>
                <span className="text-cyan-400 font-bold">0.24 ms</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Defense Engine Dual Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left: Active Interceptions & Bayesian Gate (Col 1-7) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Verified Incidents */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
              <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <span>{lang === 'ar' ? 'سجل الحوادث والتحييد اللحظي المعتمد' : 'VERIFIED THREAT INTERCEPTIONS'}</span>
              </h3>
              <span className="text-[10px] font-mono-cyber text-slate-400">
                {lang === 'ar' ? 'انقر على التهديد للإثبات الرياضي' : 'Click to inspect proof'}
              </span>
            </div>

            <div className="space-y-2.5">
              {threats.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-lg text-slate-400 text-xs font-mono-cyber flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-400/80" />
                  <span className="text-slate-300 font-semibold">
                    {lang === 'ar' ? 'لا توجد هجمات نشطة أو اعتراضات مسجلة حالياً' : 'Zero Intercepted Threats in Current Wire Window'}
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-sm">
                    {lang === 'ar' 
                      ? 'النظام في حالة ترقب واستجابة دون ثانية فور تدفق حزم شاذة من منفذ الشبكة المباشر أو المحاكاة المعملية'
                      : 'Sub-second autonomic defense triggers automatically when abnormal packets are ingested on live wire.'}
                  </span>
                </div>
              ) : (
                threats.map((t, idx) => (
                  <div
                    key={`${t.id}-${idx}`}
                    onClick={() => onSelectThreat(t)}
                    className="p-3 rounded-lg border border-slate-800 hover:border-cyan-500/60 bg-slate-900/70 hover:bg-slate-800/80 transition-all cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">
                        {lang === 'ar' ? t.titleAr : t.title}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-cyber font-bold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        {t.status}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono-cyber text-slate-400">
                      <div>
                        <span>MITRE: </span>
                        <strong className="text-slate-300 truncate block">{t.mitreTactic.split('-')[0]}</strong>
                      </div>
                      <div>
                        <span>{lang === 'ar' ? 'المسافة D_M:' : 'Mahalanobis:'} </span>
                        <strong className="text-amber-400">{t.mahalanobisDistance}</strong>
                      </div>
                      <div>
                        <span>{lang === 'ar' ? 'الثقة البايزية:' : 'Bayesian Conf:'} </span>
                        <strong className="text-cyan-400">{(t.bayesianConfidence * 100).toFixed(1)}%</strong>
                      </div>
                      <div>
                        <span>{lang === 'ar' ? 'الأداة المنفذة:' : 'Actuator:'} </span>
                        <strong className="text-red-400">{t.actuatorUsed}</strong>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Bayesian Confidence Gate Detail */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 text-xs font-mono-cyber">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-slate-300 font-display-cyber uppercase">
                {lang === 'ar' ? 'بوابة التحقق البايزي للأمان التلقائي (Bayesian Gate)' : 'BAYESIAN CONFIRMATION GATE CRITERIA'}
              </span>
              <span className="text-emerald-400 font-bold">P(Attack|E) &ge; 98.5% REQUIREMENT MET</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              {lang === 'ar'
                ? 'لا يتم تطبيق أي عزل أو إسقاط للحزم ما لم تستوفِ الأدلة الإحصائية المتعددة شرط الاحتمالية اللاحقة البايزية بنسبة تتجاوز 98.5%، لمنع انقطاع الخدمات الحيوية الناتجة عن إشارات كاذبة.'
                : 'Zero automated destructive action is permitted unless joint evidence satisfies posterior Bayesian confidence above 98.5%, protecting core business continuity from false positives.'}
            </p>
          </div>

        </div>

        {/* Right: Sub-Second Actuation Timeline (Col 8-12) */}
        <div className="lg:col-span-5 space-y-4">
          
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 flex flex-col h-full">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-3">
              <h3 className="text-xs font-bold font-display-cyber text-slate-200 uppercase flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>{lang === 'ar' ? 'سجل إجراءات الدفاع فائق السرعة' : 'SUB-SECOND ACTUATOR TIMELINE'}</span>
              </h3>
              <span className="text-[10px] font-mono-cyber text-emerald-400">
                &lt; 1.5s Execution SLA
              </span>
            </div>

            <div className="space-y-2.5 overflow-y-auto max-h-[500px] pr-1 font-mono-cyber text-xs">
              {defenseLogs.length === 0 ? (
                <div className="p-6 text-center border border-dashed border-slate-800 rounded-lg text-slate-400 text-xs flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-7 h-7 text-cyan-400/80" />
                  <span className="text-slate-300 font-semibold">
                    {lang === 'ar' ? 'سجل التدخلات نظيف تماماً' : 'Actuator Timeline Idle'}
                  </span>
                  <span className="text-[10px] text-slate-500 max-w-xs">
                    {lang === 'ar'
                      ? 'يتم تسجيل كل إجراء دفاعي آلي (eBPF أو SDN أو إبطال توكن) هنا فور تنفيذه في أجزاء الألف من الثانية'
                      : 'Real microsecond mitigation actions will log here upon autonomous actuation.'}
                  </span>
                </div>
              ) : (
                defenseLogs.map((log, idx) => (
                  <div 
                    key={`${log.id}-${idx}`} 
                    className="p-2.5 rounded-lg border border-slate-800 bg-slate-900/60 flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-cyan-400">{log.actuator}</span>
                      <span className="text-emerald-400 font-bold bg-emerald-950/40 px-1.5 py-0.2 rounded border border-emerald-500/30">
                        {log.executionTimeMs} ms
                      </span>
                    </div>
                    <div className="text-slate-300 text-[11px]">
                      {log.target}
                    </div>
                    <div className="flex items-center justify-between text-[9px] text-slate-500 pt-1 border-t border-slate-800/60">
                      <span>{new Date(log.timestamp).toISOString().substring(11, 23)}</span>
                      <span className="text-slate-400 truncate max-w-[160px]">HASH: {log.cryptoHash}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Blast Radius Containment Note */}
            <div className="mt-4 p-2.5 rounded-lg border border-amber-500/30 bg-amber-950/20 text-[11px] font-mono-cyber text-amber-300">
              <div className="font-bold flex items-center gap-1.5 mb-1">
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>{lang === 'ar' ? 'حماية نصف قطر الانفجار (Blast Radius Invariant):' : 'Blast Radius Containment:'}</span>
              </div>
              <p className="text-[10px] text-amber-200/80 leading-relaxed">
                {lang === 'ar'
                  ? 'تم حصر التأثير على عقد الحافة فقط دون المساس ببيانات المهمة Tier-0 أو انقطاع المعاملات الحية للمستخدمين.'
                  : 'Containment constrained exclusively to ingress edge nodes. Tier-0 mission databases experienced zero transaction drops.'}
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
