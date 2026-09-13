// Zero-dependency Cyber Synthesizer using Web Audio API
// Generates tactical audio feedback for the command center without external asset requests

class CyberSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isCriticalAlertEnabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedCrit = localStorage.getItem('acdc_crit_audio_enabled');
        if (savedCrit !== null) {
          this.isCriticalAlertEnabled = savedCrit === '1';
        }
        const savedMute = localStorage.getItem('acdc_master_muted');
        if (savedMute !== null) {
          this.isMuted = savedMute === '1';
        }
      } catch {}
    }
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('acdc_master_muted', muted ? '1' : '0');
      } catch {}
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public setCriticalAlertEnabled(enabled: boolean) {
    this.isCriticalAlertEnabled = enabled;
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem('acdc_crit_audio_enabled', enabled ? '1' : '0');
      } catch {}
    }
  }

  public getCriticalAlertEnabled(): boolean {
    return this.isCriticalAlertEnabled;
  }

  public toggleCriticalAlert(): boolean {
    this.setCriticalAlertEnabled(!this.isCriticalAlertEnabled);
    return this.isCriticalAlertEnabled;
  }

  // Radar ping on new packet or threat detected
  public playRadarBlip(frequency: number = 880, durationMs: number = 70) {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.8, ctx.currentTime + durationMs / 1000);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + durationMs / 1000);
    } catch {
      // Ignore audio failure
    }
  }

  // High-priority sub-second mitigation confirmation chime
  public playMitigationChirp() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      osc1.frequency.setValueAtTime(659.25, now + 0.05); // E5
      osc1.frequency.setValueAtTime(783.99, now + 0.10); // G5
      osc1.frequency.setValueAtTime(1046.50, now + 0.15); // C6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1046.50, now);
      osc2.frequency.exponentialRampToValueAtTime(1318.51, now + 0.22); // E6

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.25);
      osc2.stop(now + 0.25);
    } catch {
      // Ignore audio failure
    }
  }

  // Tactical DEFCON 1 / Critical Alarm Pulse
  public playTacticalAlarm() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      // Dual tone alternating warble
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.setValueAtTime(450, now + 0.12);
      osc.frequency.setValueAtTime(800, now + 0.24);
      osc.frequency.setValueAtTime(450, now + 0.36);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.linearRampToValueAtTime(0.15, now + 0.40);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.50);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.50);
    } catch {
      // Ignore audio failure
    }
  }

  // War Game Stage Advance notification
  public playStageAdvance() {
    if (this.isMuted) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Ignore audio failure
    }
  }
  // Distinct High-Urgency Tactical Siren for CRITICAL threat severity transitions
  // Designed so operators are instantly notified without visual monitoring
  public playCriticalSeverityAlert(force: boolean = false) {
    if ((this.isMuted || !this.isCriticalAlertEnabled) && !force) return;
    try {
      const ctx = this.getAudioContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Master limiter/gain node to prevent clipping
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.24, now);
      masterGain.connect(ctx.destination);

      // Phase 1: High warning pulse with rapid rising frequency sweep (0.00s -> 0.22s)
      const osc1 = ctx.createOscillator();
      const g1 = ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(740, now);
      osc1.frequency.exponentialRampToValueAtTime(1180, now + 0.14);
      osc1.frequency.setValueAtTime(1180, now + 0.18);
      osc1.frequency.exponentialRampToValueAtTime(800, now + 0.22);
      
      g1.gain.setValueAtTime(0.22, now);
      g1.gain.linearRampToValueAtTime(0.22, now + 0.18);
      g1.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      
      osc1.connect(g1);
      g1.connect(masterGain);
      osc1.start(now);
      osc1.stop(now + 0.22);

      // Phase 2: Dual harmonic piercing pulse (0.26s -> 0.48s)
      const osc2 = ctx.createOscillator();
      const osc2Harmonic = ctx.createOscillator();
      const g2 = ctx.createGain();
      
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(880, now + 0.26);
      osc2.frequency.exponentialRampToValueAtTime(1320, now + 0.38);
      osc2.frequency.setValueAtTime(1320, now + 0.42);
      osc2.frequency.exponentialRampToValueAtTime(920, now + 0.48);

      osc2Harmonic.type = 'square';
      osc2Harmonic.frequency.setValueAtTime(440, now + 0.26);
      osc2Harmonic.frequency.exponentialRampToValueAtTime(660, now + 0.38);

      g2.gain.setValueAtTime(0.24, now + 0.26);
      g2.gain.linearRampToValueAtTime(0.24, now + 0.42);
      g2.gain.exponentialRampToValueAtTime(0.001, now + 0.48);

      osc2.connect(g2);
      osc2Harmonic.connect(g2);
      g2.connect(masterGain);
      osc2.start(now + 0.26);
      osc2Harmonic.start(now + 0.26);
      osc2.stop(now + 0.48);
      osc2Harmonic.stop(now + 0.48);

      // Phase 3: Final authoritative tactical resolving siren (0.52s -> 0.88s)
      const osc3 = ctx.createOscillator();
      const g3 = ctx.createGain();
      osc3.type = 'sawtooth';
      osc3.frequency.setValueAtTime(1046.5, now + 0.52); // C6
      osc3.frequency.exponentialRampToValueAtTime(659.25, now + 0.72); // E5
      osc3.frequency.setValueAtTime(659.25, now + 0.80);
      osc3.frequency.exponentialRampToValueAtTime(440, now + 0.88); // A4

      g3.gain.setValueAtTime(0.26, now + 0.52);
      g3.gain.exponentialRampToValueAtTime(0.001, now + 0.88);

      osc3.connect(g3);
      g3.connect(masterGain);
      osc3.start(now + 0.52);
      osc3.stop(now + 0.88);

      // Sub-bass physical vibration punch (0.00s -> 0.80s)
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.75);
      subGain.gain.setValueAtTime(0.25, now);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.80);

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now);
      subOsc.stop(now + 0.80);
    } catch {
      // Ignore audio failure
    }
  }

  // Preview test method that triggers audio context resume & plays sound
  public testCriticalAlert() {
    try {
      const ctx = this.getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      this.playCriticalSeverityAlert(true);
    } catch {}
  }
}

export const soundEffects = new CyberSoundEngine();
