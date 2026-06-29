let act = null;
let actInited = false;

export function initAudio() {
  if (!act && !actInited) {
    try { act = new (window.AudioContext || window.webkitAudioContext)(); actInited = true; }
    catch (e) { /* no audio */ }
  }
  return !!act;
}

function ensureResumed() {
  if (act && act.state === 'suspended') act.resume();
}

function osc(freq, type, dur, vol = 0.15) {
  if (!act) return;
  ensureResumed();
  const o = act.createOscillator();
  const g = act.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, act.currentTime);
  g.gain.setValueAtTime(vol, act.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, act.currentTime + dur);
  o.connect(g);
  g.connect(act.destination);
  o.start();
  o.stop(act.currentTime + dur);
}

function noise(dur, vol = 0.05) {
  if (!act) return;
  ensureResumed();
  const bufSize = act.sampleRate * dur;
  const buf = act.createBuffer(1, bufSize, act.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufSize, 2);
  const src = act.createBufferSource();
  src.buffer = buf;
  const g = act.createGain();
  g.gain.setValueAtTime(vol, act.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, act.currentTime + dur);
  src.connect(g);
  g.connect(act.destination);
  src.start();
}

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
  if (!act) return;
  ensureResumed();
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
  notes.forEach((f, i) => {
    const o = act.createOscillator();
    const g = act.createGain();
    o.type = 'sine';
    o.frequency.setValueAtTime(f, act.currentTime + i * 0.1);
    g.gain.setValueAtTime(0.18, act.currentTime + i * 0.1);
    g.gain.exponentialRampToValueAtTime(0.001, act.currentTime + i * 0.1 + 0.25);
    // harmonics
    const o2 = act.createOscillator();
    const g2 = act.createGain();
    o2.type = 'sine';
    o2.frequency.setValueAtTime(f * 2, act.currentTime + i * 0.1);
    g2.gain.setValueAtTime(0.06, act.currentTime + i * 0.1);
    g2.gain.exponentialRampToValueAtTime(0.001, act.currentTime + i * 0.1 + 0.2);
    o.connect(g); g.connect(act.destination);
    o2.connect(g2); g2.connect(act.destination);
    o.start(act.currentTime + i * 0.1);
    o2.start(act.currentTime + i * 0.1);
    o.stop(act.currentTime + i * 0.1 + 0.25);
    o2.stop(act.currentTime + i * 0.1 + 0.2);
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
