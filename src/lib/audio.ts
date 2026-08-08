// Simple Web Audio API synthesizer for game sounds

let audioCtx: AudioContext | null = null;
let soundEnabled = true;
let backgroundMusicTimer: number | null = null;
let backgroundMusicStartPending = false;
const activeBackgroundOscillators = new Set<OscillatorNode>();

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
  if (!enabled) stopBackgroundMusic();
};

const getAudioContext = () => {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
};

// `resume()` must be requested as part of a user gesture.  Do not schedule
// notes until it has actually completed, otherwise the first measure can be
// discarded by browsers that block autoplay.
const ensureAudioContextIsRunning = async () => {
  const ctx = getAudioContext();
  if (!ctx) return null;

  if (ctx.state !== "running") {
    try {
      await ctx.resume();
    } catch {
      return null;
    }
  }

  return ctx.state === "running" ? ctx : null;
};

const scheduleBackgroundNote = (
  ctx: AudioContext,
  frequency: number,
  startTime: number,
  duration: number,
  volume: number,
  type: OscillatorType = "triangle"
) => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startTime);
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.025);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  activeBackgroundOscillators.add(oscillator);
  oscillator.onended = () => activeBackgroundOscillators.delete(oscillator);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
};

const scheduleKick = (ctx: AudioContext, startTime: number) => {
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(150, startTime);
  oscillator.frequency.exponentialRampToValueAtTime(48, startTime + 0.16);
  gain.gain.setValueAtTime(0.001, startTime);
  gain.gain.linearRampToValueAtTime(0.075, startTime + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  activeBackgroundOscillators.add(oscillator);
  oscillator.onended = () => activeBackgroundOscillators.delete(oscillator);
  oscillator.start(startTime);
  oscillator.stop(startTime + 0.2);
};

const playBackgroundMeasure = (ctx: AudioContext) => {
  if (!soundEnabled || ctx.state !== "running") return;

  const stepDuration = 0.32;
  const startTime = ctx.currentTime + 0.05;
  const melody = [659.25, 783.99, 880, 783.99, 659.25, 587.33, 659.25, 523.25, 587.33, 659.25, 783.99, 659.25, 587.33, 523.25, 493.88, 523.25];
  const bass = [130.81, 146.83, 164.81, 130.81];
  const chords = [
    [261.63, 329.63, 392],
    [293.66, 349.23, 440],
    [329.63, 392, 493.88],
    [261.63, 329.63, 392],
  ];

  melody.forEach((frequency, step) => {
    scheduleBackgroundNote(ctx, frequency, startTime + step * stepDuration, 0.26, 0.06);
  });

  bass.forEach((frequency, index) => {
    const beatStart = startTime + index * stepDuration * 4;
    scheduleBackgroundNote(ctx, frequency, beatStart, 1.1, 0.045, "sine");
    scheduleKick(ctx, beatStart);
  });

  chords.forEach((chord, index) => {
    const chordStart = startTime + index * stepDuration * 4;
    chord.forEach((frequency) => scheduleBackgroundNote(ctx, frequency, chordStart, 1.15, 0.013, "sine"));
  });
};

export const startBackgroundMusic = () => {
  if (!soundEnabled || backgroundMusicTimer || backgroundMusicStartPending) return;

  backgroundMusicStartPending = true;
  void ensureAudioContextIsRunning().then((ctx) => {
    backgroundMusicStartPending = false;
    if (!ctx || !soundEnabled || backgroundMusicTimer) return;

    playBackgroundMeasure(ctx);
    backgroundMusicTimer = window.setInterval(() => playBackgroundMeasure(ctx), 5120);
  });
};

export const stopBackgroundMusic = () => {
  backgroundMusicStartPending = false;
  if (backgroundMusicTimer) {
    window.clearInterval(backgroundMusicTimer);
    backgroundMusicTimer = null;
  }

  activeBackgroundOscillators.forEach((oscillator) => {
    try {
      oscillator.stop();
    } catch {}
  });
  activeBackgroundOscillators.clear();
};

export const playCorrect = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
  osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1); // C6

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

export const playWrong = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === "suspended") ctx.resume();

  const osc = ctx.createOscillator();
  const gainNode = ctx.createGain();

  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(150, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.2);

  gainNode.gain.setValueAtTime(0, ctx.currentTime);
  gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

  osc.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + 0.3);
};

export const playWin = () => {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;
  
  if (ctx.state === "suspended") ctx.resume();

  // Play a simple arpeggio for winning
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
  
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    osc.type = "triangle";
    osc.frequency.value = freq;
    
    const startTime = ctx.currentTime + (i * 0.1);
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
    
    osc.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    osc.start(startTime);
    osc.stop(startTime + 0.4);
  });
};
