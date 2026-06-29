let act = null;
let retryAt = 0;

function getCtx() {
  if (Date.now() < retryAt) return null;
  if (!act || act.state === 'closed') {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      ctx.addEventListener('error', () => { act = null; }, { once: true });
      act = ctx;
    } catch (e) { retryAt = Date.now() + 30000; return null; }
  }
  if (act.state === 'suspended') act.resume().catch(() => {});
  return act;
}

function osc(freq, type, dur, vol = 0.15) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(freq, ctx.currentTime);
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + dur);
  } catch (e) { act = null; }
}

function noise(dur, vol = 0.05) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const bufSize = ctx.sampleRate * dur;
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    g.gain.setValueAtTime(vol, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
    src.connect(g);
    g.connect(ctx.destination);
    src.start();
  } catch (e) { act = null; }
}

export function initAudio() { return !!getCtx(); }

export function playSpin() {
  osc(80, 'sawtooth', 0.15, 0.12);
  osc(60, 'sawtooth', 0.3, 0.08);
}

export function playReelTick() {
  osc(200, 'square', 0.05, 0.06);
}

export function playReelStop() {
  osc(100, 'triangle', 0.1, 0.1);
  noise(0.08, 0.04);
}

export function playWin() {
  const ctx = getCtx();
  if (!ctx) return;
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
  notes.forEach((f, i) => {
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'sine';
      o.frequency.setValueAtTime(f, ctx.currentTime + i * 0.1);
      g.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.1);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.25);
      const o2 = ctx.createOscillator();
      const g2 = ctx.createGain();
      o2.type = 'sine';
      o2.frequency.setValueAtTime(f * 2, ctx.currentTime + i * 0.1);
      g2.gain.setValueAtTime(0.06, ctx.currentTime + i * 0.1);
      g2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.2);
      o.connect(g); g.connect(ctx.destination);
      o2.connect(g2); g2.connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.1);
      o2.start(ctx.currentTime + i * 0.1);
      o.stop(ctx.currentTime + i * 0.1 + 0.25);
      o2.stop(ctx.currentTime + i * 0.1 + 0.2);
    } catch (e) { act = null; }
  });
}

export function playButton() {
  osc(600, 'sine', 0.06, 0.07);
}

export function playBetTick() {
  osc(800, 'sine', 0.04, 0.05);
}

export function playScatter() {
  [880, 1108, 1318.5].forEach((f, i) => {
    setTimeout(() => { osc(f, 'sine', 0.15, 0.1); }, i * 80);
  });
}

export function playLowFunds() {
  osc(200, 'square', 0.2, 0.08);
  setTimeout(() => osc(150, 'square', 0.3, 0.06), 150);
}

export function playStop() {
  osc(100, 'sawtooth', 0.08, 0.06);
}
