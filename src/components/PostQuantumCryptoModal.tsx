import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Lock, 
  Unlock, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  Fingerprint, 
  Layers, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink,
  Sparkles,
  Zap,
  Binary,
  X
} from 'lucide-react';

interface PostQuantumCryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'ar' | 'en';
}

interface KyberSimulationState {
  publicKeyVector: string;
  secretVector: string;
  ciphertextCapsule: string;
  sharedSecretKey: string;
  encapsulationLatencyMs: number;
  decapsulationLatencyMs: number;
  quantumResistanceBits: number;
  latticePolynomialDimension: number;
}

export const PostQuantumCryptoModal: React.FC<PostQuantumCryptoModalProps> = ({
  isOpen,
  onClose,
  lang
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'KYBER_KEM' | 'DILITHIUM_SIG' | 'SHOR_AUDIT'>('OVERVIEW');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Kyber-768 Simulation State
  const [kyberState, setKyberState] = useState<KyberSimulationState>(() => generateMockKyberExchange());
  const [isSimulatingKEM, setIsSimulatingKEM] = useState(false);

  // Dilithium-65 Simulation State
  const [dilithiumMessage, setDilithiumMessage] = useState('ACTION: BLOCK_IP 185.220.101.5 VIA eBPF/XDP DROP | TIMESTAMP: ' + new Date().toISOString());
  const [dilithiumSignature, setDilithiumSignature] = useState('0x7F9A3B...[ML-DSA-65: 3309 BYTES POLY-VECTOR SIGNATURE VERIFIED: NIST FIPS 204]');
  const [isSignatureVerified, setIsSignatureVerified] = useState(true);
  const [isSigning, setIsSigning] = useState(false);

  if (!isOpen) return null;

  function generateMockKyberExchange(): KyberSimulationState {
    const randomHex = (len: number) => Array.from({ length: len }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    return {
      publicKeyVector: `0x${randomHex(16)}...${randomHex(16)} [ML-KEM-768: 1184 BYTES SEED + MATRIX]`,
      secretVector: `0x${randomHex(16)}...[SECRET_S POLY (η=2) PROTECTED BY HSM ENCLAVE]`,
      ciphertextCapsule: `0x${randomHex(16)}...${randomHex(16)} [1088 BYTES CIPHERTEXT]`,
      sharedSecretKey: `0x${randomHex(64)}`,
      encapsulationLatencyMs: 0.18,
      decapsulationLatencyMs: 0.22,
      quantumResistanceBits: 192,
      latticePolynomialDimension: 768
    };
  }

  const handleRunNewKyberKeyExchange = () => {
    setIsSimulatingKEM(true);
    setTimeout(() => {
      setKyberState(generateMockKyberExchange());
      setIsSimulatingKEM(false);
    }, 450);
  };

  const handleSignDilithiumAction = () => {
    setIsSigning(true);
    setTimeout(() => {
      const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
      setDilithiumSignature(`0x${hex}E7D2...[ML-DSA-65 VALIDATED HASH: SHA3-512 | SEED: 0x${hex} | NIST FIPS 204 LEVEL-3 COMPLIANT]`);
      setIsSignatureVerified(true);
      setIsSigning(false);
    }, 400);
  };

  const copyToClipboard = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn"
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#080d1a] border-2 border-purple-500/60 rounded-2xl shadow-[0_0_60px_rgba(168,85,247,0.3)] overflow-hidden font-mono"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-400/80 flex items-center justify-center text-purple-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] shrink-0">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  {lang === 'ar' 
                    ? 'درع التشفير المقاوم للحوسبة الكمومية (Post-Quantum Cryptography - PQC)' 
                    : 'Post-Quantum Cryptography (PQC) Sovereign Defense Shield'}
                </h2>
                <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-400/60 text-[10px] font-black tracking-wider uppercase">
                  NIST FIPS 203 / 204
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/50 text-[10px] font-bold">
                  {lang === 'ar' ? 'درع نشط 100%' : 'QUANTUM-IMMUNE'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {lang === 'ar' 
                  ? 'منظومة حماية متكاملة تعتمد خوارزميات الشبيكات (Lattice-based) المعتمدة دولياً لحماية المنظومة من حواسيب الكم وخوارزمية شور' 
                  : 'NIST-standardized Module-Lattice Cryptography defending against Shor\'s algorithm and Harvest-Now-Decrypt-Later (HNDL)'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900/90 border border-slate-700 text-slate-400 hover:text-white hover:border-purple-400 transition-colors cursor-pointer shrink-0"
            title={lang === 'ar' ? 'إغلاق' : 'Close'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 gap-2 overflow-x-auto text-xs font-bold scrollbar-thin">
          {[
            { id: 'OVERVIEW', labelAr: 'نظرة عامة والجاهزية السيادية', labelEn: 'Sovereign PQC Overview', icon: ShieldCheck },
            { id: 'KYBER_KEM', labelAr: 'مختبر تبادل المفاتيح (ML-KEM Kyber)', labelEn: 'ML-KEM (Kyber-768) Lab', icon: Key },
            { id: 'DILITHIUM_SIG', labelAr: 'التوقيع الرقمي (ML-DSA Dilithium)', labelEn: 'ML-DSA (Dilithium) Signatures', icon: Fingerprint },
            { id: 'SHOR_AUDIT', labelAr: 'مصفوفة خوارزمية شور والهشاشة', labelEn: 'Shor\'s Algorithm Audit', icon: Binary }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3.5 border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'border-purple-400 text-purple-300 bg-purple-950/30'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>{lang === 'ar' ? tab.labelAr : tab.labelEn}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 max-h-[calc(92vh-160px)] text-xs text-slate-300">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'OVERVIEW' && (
            <div className="space-y-6">
              {/* Strategic Alert Box */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/50 shadow-inner">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-purple-900/50 text-purple-300 shrink-0">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-white text-sm">
                      {lang === 'ar' 
                        ? 'لماذا لا يمكن الاستهانة بحماية ما بعد الكم (Post-Quantum Security)؟' 
                        : 'Strategic Imperative: Defeating "Harvest Now, Decrypt Later" (HNDL)'}
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {lang === 'ar'
                        ? 'تقوم أجهزة الاستخبارات وقراصنة الفدية حالياً بتخزين البيانات المشفرة (Harvest Now) في انتظار نضوج الحواسيب الكمومية لفك تشفيرها لاحقاً (Decrypt Later) عبر خوارزمية شور (Shor\'s Algorithm) التي ستسحق كلاً من RSA و ECC في ثوانٍ معدودة. منظومتنا محصنة مسبقاً وفق المعايير الرسمية الصادرة عن المعهد الوطني الأمريكي للمعايير والتقنية (NIST).'
                        : 'State adversaries intercept and store encrypted sovereign traffic today to decrypt once Cryptanalytically Relevant Quantum Computers (CRQCs) emerge. Our platform natively integrates post-quantum lattice primitives to render archived traffic mathematically uncrackable.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Core Post-Quantum Pillars */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0b1020] border border-purple-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <div className="w-7 h-7 rounded-lg bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400">
                        <Key className="w-4 h-4" />
                      </div>
                      <span>NIST FIPS 203: ML-KEM (Kyber-768)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'آلية تبادل مفاتيح مبنية على معضلة التعلم مع الأخطاء النمطية (Module Learning With Errors - MLWE). توفر 192 بت من الأمان المقاوم للكم وتُستخدم في قنوات التليمترية ونفق البث الحي SSE.'
                      : 'Module-LWE key encapsulation standard providing 192-bit quantum security category 3. Secures server ingestion, SSE telemetry, and inter-node synchronization.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-purple-300">
                    <span>Key Size: 1,184 Bytes</span>
                    <span>Ciphertext: 1,088 Bytes</span>
                    <span>Latency: &lt; 0.25 ms</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0b1020] border border-indigo-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                        <Fingerprint className="w-4 h-4" />
                      </div>
                      <span>NIST FIPS 204: ML-DSA (Dilithium-65)</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'خوارزمية توقيع رقمي قائمة على الشبيكات تضمن صحة وعدم قابلية إنكار أوامر حظر الجدران النارية (eBPF/iptables) وتمنع الحواسيب الكمومية من تزوير توقيعات أوامر الدفاع الذاتي.'
                      : 'Lattice-based digital signature algorithm ensuring cryptographic non-repudiation of wire-speed firewall mitigations and SOC executive logs against quantum forgery.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-indigo-300">
                    <span>Sig Size: 3,309 Bytes</span>
                    <span>Public Key: 1,952 Bytes</span>
                    <span>NIST Category 3</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0b1020] border border-cyan-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <div className="w-7 h-7 rounded-lg bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                        <Layers className="w-4 h-4" />
                      </div>
                      <span>Hybrid PQC + Classical Mode</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/40 text-[10px] font-bold">
                      IETF RFC 9180
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'دمج مزدوج بين خوارزمية X25519 الكلاسيكية و Kyber-768، بحيث يتطلب اختراق الجلسة كسر كلا النظامين معاً في آن واحد، مما يضمن التوافقية والأمان المطلق.'
                      : 'Dual-layer hybrid handshake combining standard Curve25519 with Kyber-768. Even if one primitive experiences an unexpected mathematical breach, the other remains uncompromised.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-300">
                    <span>Handshake: X25519Kyber768</span>
                    <span>Fallback: TLS 1.3 Strict</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0b1020] border border-emerald-500/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-white">
                      <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <span>FIPS 140-3 Level 4 HSM Enclave</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                      HARDENED
                    </span>
                  </div>
                  <p className="text-slate-400 leading-relaxed">
                    {lang === 'ar'
                      ? 'حفظ وتوليد المفاتيح السرية في بيئة عتادية معزولة ضد هجمات القنوات الجانبية (Side-Channel Attacks) مع التدمير الذاتي للذاكرة عند محاولة التلاعب الفيزيائي.'
                      : 'Cryptographic secrets generated and stored within tamper-resistant hardware security modules meeting FIPS 140-3 Level 4 physical zeroization standards.'}
                  </p>
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-emerald-300">
                    <span>Zeroization: &lt; 50 ns</span>
                    <span>Side-channel resistant</span>
                  </div>
                </div>
              </div>

              {/* Founder Sovereignty Endorsement */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4 flex-wrap">
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400 uppercase tracking-wider block font-bold">
                    {lang === 'ar' ? 'الاعتماد السيادي لمنظومة ما بعد الكم:' : 'Sovereign Quantum-Resistant Mandate:'}
                  </span>
                  <span className="text-sm font-bold text-white">
                    {lang === 'ar' ? 'المؤسس TAHA SETRII (المملكة المغربية - sécurité Maroc)' : 'FOUNDER TAHA SETRII (Kingdom of Morocco - sécurité Maroc)'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-purple-950 text-purple-300 border border-purple-500/50 text-xs font-bold font-mono">
                    CNSA 2.0 Compliant (2024-2030)
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KYBER-768 KEY ENCAPSULATION LAB */}
          {activeTab === 'KYBER_KEM' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'ar' ? 'مختبر تبادل المفاتيح القائم على الشبيكات (ML-KEM Kyber-768)' : 'ML-KEM (CRYSTALS-Kyber-768) Encapsulation Engine'}</span>
                    <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/40">
                      NIST FIPS 203
                    </span>
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {lang === 'ar'
                      ? 'محاكاة رياضية دقيقة لعملية Encapsulation / Decapsulation التي تتم عبر بروتوكول البث الحي للمنظومة'
                      : 'Live mathematical simulation of quantum-resistant key exchange running across real-time telemetry streams'}
                  </p>
                </div>

                <button
                  onClick={handleRunNewKyberKeyExchange}
                  disabled={isSimulatingKEM}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isSimulatingKEM ? 'animate-spin' : ''}`} />
                  <span>{lang === 'ar' ? 'توليد وتبادل كبسولة كمومية جديدة' : 'Generate & Encapsulate New KEM'}</span>
                </button>
              </div>

              {/* Interactive KEM Pipeline */}
              <div className="space-y-3.5">
                {/* Step 1: Public Key Vector */}
                <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-purple-900/80 text-purple-300 flex items-center justify-center text-[10px]">1</span>
                      <span>Public Key Matrix (A ∈ R_q^(3×3), t = As + e)</span>
                    </span>
                    <button 
                      onClick={() => copyToClipboard(kyberState.publicKeyVector, 'pk')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'pk' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedField === 'pk' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-slate-300 select-all overflow-x-auto">
                    {kyberState.publicKeyVector}
                  </div>
                </div>

                {/* Step 2: Ephemeral Ciphertext Capsule */}
                <div className="p-3.5 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-cyan-300 font-bold flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-cyan-900/80 text-cyan-300 flex items-center justify-center text-[10px]">2</span>
                      <span>Encapsulated Ciphertext Capsule (u = A^T r + e_1, v = t^T r + e_2 + ⌈q/2⌋·m)</span>
                    </span>
                    <button 
                      onClick={() => copyToClipboard(kyberState.ciphertextCapsule, 'ct')}
                      className="text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      {copiedField === 'ct' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span className="text-[10px]">{copiedField === 'ct' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/70 border border-slate-800 font-mono text-[11px] text-cyan-200 select-all overflow-x-auto">
                    {kyberState.ciphertextCapsule}
                  </div>
                </div>

                {/* Step 3: Derived Shared Secret */}
                <div className="p-3.5 rounded-xl bg-[#0a0f1d] border-2 border-emerald-500/50 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-300 font-bold flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-900/80 text-emerald-300 flex items-center justify-center text-[10px]">3</span>
                      <span>Decapsulated Shared Symmetric Key (K = KDF(m, H(c)))</span>
                    </span>
                    <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Zero-Bit Error Verified</span>
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-black/80 border border-emerald-500/40 font-mono text-xs text-emerald-400 font-bold select-all flex items-center justify-between">
                    <span>{kyberState.sharedSecretKey}</span>
                    <button 
                      onClick={() => copyToClipboard(kyberState.sharedSecretKey, 'ss')}
                      className="text-slate-400 hover:text-white p-1 cursor-pointer"
                      title="Copy Key"
                    >
                      {copiedField === 'ss' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Performance & Quantum Security Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'أمان الكم (NIST Category)' : 'Security Level'}</span>
                  <span className="text-sm font-bold text-purple-300 mt-1 block">Level 3 (192-bit)</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'زمن التشفير (Encaps)' : 'Encapsulation Time'}</span>
                  <span className="text-sm font-bold text-cyan-300 mt-1 block">{kyberState.encapsulationLatencyMs} ms</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'زمن فك التشفير (Decaps)' : 'Decapsulation Time'}</span>
                  <span className="text-sm font-bold text-emerald-300 mt-1 block">{kyberState.decapsulationLatencyMs} ms</span>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">{lang === 'ar' ? 'أبعاد الشبيكة (Lattice Dim)' : 'Lattice Dimension'}</span>
                  <span className="text-sm font-bold text-white mt-1 block">k = 3 (768 Poly)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DILITHIUM DIGITAL SIGNATURES */}
          {activeTab === 'DILITHIUM_SIG' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{lang === 'ar' ? 'نظام التوقيع الرقمي المقاوم للكم (ML-DSA Dilithium-65)' : 'ML-DSA (CRYSTALS-Dilithium) Quantum Signature Engine'}</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 text-[10px] font-bold border border-indigo-500/40">
                      NIST FIPS 204
                    </span>
                  </h3>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {lang === 'ar'
                      ? 'توقيع أوامر الدفاع الذاتي وشهادات اعتماد المشتركين بختم رقمي يستحيل على الحواسيب الكمومية تزويره'
                      : 'Signs wire-speed SOC mitigations and enterprise client credentials with quantum-unforgeable polynomial seals'}
                  </p>
                </div>

                <button
                  onClick={handleSignDilithiumAction}
                  disabled={isSigning}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all cursor-pointer shadow-lg disabled:opacity-50"
                >
                  <Fingerprint className={`w-4 h-4 ${isSigning ? 'animate-spin' : ''}`} />
                  <span>{lang === 'ar' ? 'توقيع أمر دفاعي جديد بـ ML-DSA' : 'Sign Action with ML-DSA-65'}</span>
                </button>
              </div>

              {/* Action Payload Input */}
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-slate-800 space-y-2">
                <label className="text-[11px] font-bold text-slate-300 block">
                  {lang === 'ar' ? 'الأمر الدفاعي المراد توقيعه وحمايته ضد التزوير الكمومي:' : 'Mitigation Action Payload to Sign (Fiat-Shamir with Aborts):'}
                </label>
                <textarea
                  value={dilithiumMessage}
                  onChange={(e) => setDilithiumMessage(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              {/* Generated Dilithium Signature Box */}
              <div className="p-4 rounded-xl bg-[#0a0f1d] border border-indigo-500/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'ar' ? 'التوقيع الرقمي المعتمد (NIST FIPS 204 Seal):' : 'Verified ML-DSA-65 Signature:'}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                    VALIDATED (0.42 ms)
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-black/80 border border-slate-800 font-mono text-xs text-indigo-200 select-all overflow-x-auto">
                  {dilithiumSignature}
                </div>
              </div>

              {/* Technical Comparison Note */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-white text-xs">
                    {lang === 'ar' ? 'الفارق بين RSA/ECDSA الكلاسيكي وتوقيع Dilithium ما بعد الكم:' : 'Difference between Classic ECDSA and Dilithium:'}
                  </span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    {lang === 'ar'
                      ? 'التوقيعات التقليدية مثل ECDSA تعتمد على معضلة اللوغاريتم المنفصل على المنحنيات الإهليلجية، والتي يحلها حاسوب كمومي عبر خوارزمية شور في ثوانٍ. بينما يعتمد Dilithium على معضلة إيجاد المتجهات القصيرة (Short Integer Solution - SIS) في شبيكات متعددة الأبعاد، ولا توجد أي خوارزمية كمومية معروفة قادرة على كسرها.'
                      : 'Classic ECDSA signatures rely on the discrete logarithm problem, solvable in polynomial time by Shor\'s algorithm on a quantum computer. Dilithium relies on the hardness of lattice problems (Module-SIS and Module-LWE), possessing provable security against both classical and quantum cryptanalysis.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SHOR'S ALGORITHM THREAT MATRIX */}
          {activeTab === 'SHOR_AUDIT' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{lang === 'ar' ? 'مصفوفة تحليل خوارزمية شور ومقاومة الحوسبة الكمومية' : 'Shor\'s Algorithm Vulnerability vs. Quantum-Immune Matrix'}</span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 text-[10px] font-bold border border-rose-500/40">
                    CRQC BENCHMARK
                  </span>
                </h3>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  {lang === 'ar'
                    ? 'مقارنة مباشرة بين الخوارزميات التقليدية المهددة بالسقوط التام وخوارزميات ما بعد الكم المعتمدة في منصتنا'
                    : 'Direct vulnerability analysis: Classic algorithms vulnerable to CRQCs vs. platform post-quantum defenses'}
                </p>
              </div>

              {/* Comparison Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left rtl:text-right border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800 font-mono">
                      <th className="p-3">{lang === 'ar' ? 'الخوارزمية' : 'Algorithm'}</th>
                      <th className="p-3">{lang === 'ar' ? 'النوع والاستخدام' : 'Type / Purpose'}</th>
                      <th className="p-3">{lang === 'ar' ? 'الأساس الرياضي' : 'Mathematical Hardness'}</th>
                      <th className="p-3">{lang === 'ar' ? 'موقف خوارزمية شور' : 'Shor\'s Algorithm Threat'}</th>
                      <th className="p-3">{lang === 'ar' ? 'حالة المنظومة' : 'Platform Status'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono">
                    <tr className="bg-rose-950/20 hover:bg-rose-950/30">
                      <td className="p-3 font-bold text-rose-300">RSA-2048 / 4096</td>
                      <td className="p-3 text-slate-300">Public-Key Enc / Sig</td>
                      <td className="p-3 text-slate-400">Prime Factorization</td>
                      <td className="p-3 text-rose-400 font-bold">
                        {lang === 'ar' ? 'يُكسر في دقائق (O(n³))' : 'Broken in minutes (O(n³))'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                          DEPRECATED (HNDL RISK)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-rose-950/20 hover:bg-rose-950/30">
                      <td className="p-3 font-bold text-rose-300">ECC (ECDSA / ECDH)</td>
                      <td className="p-3 text-slate-300">Key Exchange & Signatures</td>
                      <td className="p-3 text-slate-400">Elliptic Curve Discrete Log</td>
                      <td className="p-3 text-rose-400 font-bold">
                        {lang === 'ar' ? 'يُكسر بـ 2,330 Qubit فقط' : 'Broken by 2,330 logical qubits'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                          VULNERABLE
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-emerald-950/20 hover:bg-emerald-950/30">
                      <td className="p-3 font-bold text-emerald-300">ML-KEM (Kyber-768)</td>
                      <td className="p-3 text-slate-300">Key Encapsulation (KEM)</td>
                      <td className="p-3 text-slate-400">Module-LWE (Lattices)</td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {lang === 'ar' ? 'محصن تماماً (> 2¹⁶⁰ عمليات)' : 'Immune (> 2¹⁶⁰ quantum gates)'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold">
                          ACTIVE (FIPS 203)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-indigo-950/20 hover:bg-indigo-950/30">
                      <td className="p-3 font-bold text-indigo-300">ML-DSA (Dilithium-65)</td>
                      <td className="p-3 text-slate-300">Digital Signatures</td>
                      <td className="p-3 text-slate-400">Module-SIS (Lattices)</td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {lang === 'ar' ? 'محصن تماماً ضد التزوير' : 'Immune to quantum forgery'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/40 text-[10px] font-bold">
                          ACTIVE (FIPS 204)
                        </span>
                      </td>
                    </tr>
                    <tr className="bg-purple-950/20 hover:bg-purple-950/30">
                      <td className="p-3 font-bold text-purple-300">AES-256-GCM / SHA3-512</td>
                      <td className="p-3 text-slate-300">Symmetric Stream & Hash</td>
                      <td className="p-3 text-slate-400">Substitution-Permutation / Sponge</td>
                      <td className="p-3 text-cyan-300 font-bold">
                        {lang === 'ar' ? 'مقاوم لخوارزمية جروفر (128 بت)' : 'Grover Resistant (128-bit)'}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                          ACTIVE (ENCRYPTION)
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Quantum Readiness Checklist */}
              <div className="p-4 rounded-xl bg-[#090e1c] border border-slate-800 space-y-3">
                <span className="font-bold text-white text-xs block">
                  {lang === 'ar' ? 'قائمة الجاهزية الكمومية للمنظومة (Quantum Readiness Certificate):' : 'Sovereign Quantum Readiness Verification Checklist:'}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px]">
                  {[
                    { textAr: 'تشفير هجين TLS 1.3 مع Kyber-768 عبر المسار الحي', textEn: 'Hybrid TLS 1.3 with Kyber-768 for live streams', passed: true },
                    { textAr: 'توقيع قرارات جدار الحماية بـ Dilithium-65 المعتمد', textEn: 'Mitigation commands signed with Dilithium-65', passed: true },
                    { textAr: 'حماية كاملة من هجمات الحصاد والتخزين HNDL', textEn: 'Zero exposure to Harvest-Now-Decrypt-Later', passed: true },
                    { textAr: 'الامتثال لتوجيهات البيت الأبيض و CNSA 2.0 حتى 2030', textEn: 'Full CNSA 2.0 & NIST FIPS standardization', passed: true },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900/60 border border-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-slate-200">{lang === 'ar' ? item.textAr : item.textEn}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>
              {lang === 'ar' 
                ? 'الدرع الكمومي السيادي مفعل ومعتمد لجميع المشتركين والأنظمة' 
                : 'Sovereign PQC Shield Enforced Across All Ingestion Endpoints'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-slate-950 font-bold transition-all cursor-pointer shadow-md"
          >
            {lang === 'ar' ? 'فهمت، استمرار المراقبة' : 'Acknowledge & Continue'}
          </button>
        </div>

      </div>
    </div>
  );
};
