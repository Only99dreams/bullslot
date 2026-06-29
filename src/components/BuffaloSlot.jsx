import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { syncBalance, getSupabaseClient } from '../services/supabase';
import { initAudio, playSpin, playReelTick, playReelStop, playWin, playButton, playBetTick, playScatter, playLowFunds, playStop } from '../services/sound';
import PaytableModal from './Paytable';

const SVGS = {
  B: `<svg viewBox="0 0 100 100"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#6b4423"/><stop offset="50%" stop-color="#4a2f15"/><stop offset="100%" stop-color="#3a200a"/></linearGradient></defs><ellipse cx="50" cy="58" rx="32" ry="24" fill="url(#bg)"/><ellipse cx="50" cy="48" rx="28" ry="20" fill="#5a3a1a"/><ellipse cx="50" cy="35" rx="22" ry="18" fill="#6b4423"/><path d="M38 28 Q42 18 50 16 Q58 18 62 28" fill="#4a2f15" stroke="#8a6a3a" stroke-width="1.5"/><path d="M36 32 L30 12 L36 18 M64 32 L70 12 L64 18" fill="none" stroke="#4a2f15" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="43" cy="30" rx="3" ry="3.5" fill="#111"/><ellipse cx="57" cy="30" rx="3" ry="3.5" fill="#111"/><circle cx="43" cy="29" r="1.2" fill="#fff" opacity="0.6"/><circle cx="57" cy="29" r="1.2" fill="#fff" opacity="0.6"/><ellipse cx="50" cy="38" rx="6" ry="3" fill="#2a1a0a"/><ellipse cx="50" cy="37" rx="3" ry="1.5" fill="#1a0a00"/><path d="M44 44 Q50 48 56 44" fill="none" stroke="#8a6a3a" stroke-width="1" opacity="0.6"/><path d="M30 48 L28 58 L34 52 M70 48 L72 58 L66 52" fill="none" stroke="#4a2f15" stroke-width="2" stroke-linecap="round"/></svg>`,
  E: `<svg viewBox="0 0 100 100"><defs><linearGradient id="eg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#d4a050"/><stop offset="50%" stop-color="#b8863a"/><stop offset="100%" stop-color="#8a6020"/></linearGradient></defs><path d="M50 10 Q25 30 18 55 L30 48 Q20 65 28 72 L38 60 Q32 75 42 82 L50 65 Q58 82 68 75 L62 60 Q72 72 82 65 L70 48 Q82 55 75 30 Q50 10 50 10Z" fill="url(#eg)"/><path d="M50 20 L45 35 L42 30 L40 42 L47 38 L44 48 L55 55 L48 44 L54 48 L52 38 L60 42 L56 30 L54 35 Z" fill="#3a2010"/><path d="M38 58 Q50 65 62 58" fill="none" stroke="#fff" stroke-width="1.5" opacity="0.3"/><ellipse cx="43" cy="32" rx="2.5" ry="3" fill="#111"/><ellipse cx="57" cy="32" rx="2.5" ry="3" fill="#111"/><circle cx="43" cy="31" r="1" fill="#fff" opacity="0.5"/><circle cx="57" cy="31" r="1" fill="#fff" opacity="0.5"/><path d="M48 28 L50 22 L52 28" fill="#f0c040"/></svg>`,
  W: `<svg viewBox="0 0 100 100"><defs><radialGradient id="wg" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#808080"/><stop offset="60%" stop-color="#505050"/><stop offset="100%" stop-color="#303030"/></radialGradient></defs><ellipse cx="50" cy="55" rx="30" ry="25" fill="url(#wg)"/><ellipse cx="50" cy="48" rx="26" ry="20" fill="#606060"/><ellipse cx="50" cy="38" rx="22" ry="18" fill="#707070"/><path d="M34 38 Q36 28 42 22 L44 30 M66 38 Q64 28 58 22 L56 30" fill="none" stroke="#505050" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="41" cy="32" rx="3.5" ry="4" fill="#1a1a1a"/><ellipse cx="59" cy="32" rx="3.5" ry="4" fill="#1a1a1a"/><circle cx="41" cy="31" r="1.5" fill="#ffd700" opacity="0.8"/><circle cx="59" cy="31" r="1.5" fill="#ffd700" opacity="0.8"/><ellipse cx="50" cy="42" rx="7" ry="4" fill="#1a1a1a"/><ellipse cx="50" cy="40" rx="3.5" ry="2" fill="#000"/><path d="M50 44 L48 50 L52 50 Z" fill="#2a2a2a"/><path d="M36 52 L32 62 L38 56 M64 52 L68 62 L62 56" fill="none" stroke="#505050" stroke-width="2" stroke-linecap="round"/><path d="M42 56 Q50 60 58 56" fill="none" stroke="#909090" stroke-width="1.5" opacity="0.4"/></svg>`,
  C: `<svg viewBox="0 0 100 100"><defs><radialGradient id="cg2" cx="50%" cy="40%" r="50%"><stop offset="0%" stop-color="#d4a050"/><stop offset="50%" stop-color="#b8863a"/><stop offset="100%" stop-color="#8a6020"/></radialGradient></defs><ellipse cx="50" cy="58" rx="28" ry="22" fill="url(#cg2)"/><ellipse cx="50" cy="48" rx="24" ry="18" fill="#c49040"/><ellipse cx="50" cy="38" rx="20" ry="16" fill="#d4a050"/><path d="M36 34 Q40 24 50 20 Q60 24 64 34" fill="#b8863a"/><ellipse cx="42" cy="32" rx="3" ry="3.5" fill="#111"/><ellipse cx="58" cy="32" rx="3" ry="3.5" fill="#111"/><circle cx="42" cy="31" r="1.2" fill="#fff" opacity="0.6"/><circle cx="58" cy="31" r="1.2" fill="#fff" opacity="0.6"/><ellipse cx="50" cy="40" rx="5" ry="2.5" fill="#2a1a0a"/><ellipse cx="50" cy="39" rx="2.5" ry="1.2" fill="#1a0a00"/><path d="M32 46 L28 58 L36 52 M68 46 L72 58 L64 52" fill="none" stroke="#8a6020" stroke-width="2" stroke-linecap="round"/><path d="M46 48 Q50 52 54 48" fill="none" stroke="#a07030" stroke-width="1.2" opacity="0.6"/><path d="M34 52 L30 64 L38 58 M66 52 L70 64 L62 58" fill="none" stroke="#8a6020" stroke-width="1.5" stroke-linecap="round"/></svg>`,
  L: `<svg viewBox="0 0 100 100"><defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#a08060"/><stop offset="50%" stop-color="#806040"/><stop offset="100%" stop-color="#604030"/></linearGradient></defs><ellipse cx="50" cy="55" rx="30" ry="26" fill="url(#lg)"/><ellipse cx="50" cy="45" rx="26" ry="20" fill="#907050"/><ellipse cx="50" cy="35" rx="22" ry="18" fill="#a08060"/><path d="M36 30 Q38 18 44 14 L46 22 M64 30 Q62 18 56 14 L54 22" fill="none" stroke="#806040" stroke-width="2" stroke-linecap="round"/><path d="M28 28 L24 14 L30 24 M72 28 L76 14 L70 24" fill="none" stroke="#604030" stroke-width="2.5" stroke-linecap="round"/><ellipse cx="42" cy="30" rx="3" ry="3.5" fill="#111"/><ellipse cx="58" cy="30" rx="3" ry="3.5" fill="#111"/><circle cx="42" cy="29" r="1.2" fill="#fff" opacity="0.6"/><circle cx="58" cy="29" r="1.2" fill="#fff" opacity="0.6"/><ellipse cx="50" cy="38" rx="6" ry="3" fill="#2a1a0a"/><ellipse cx="50" cy="37" rx="3" ry="1.5" fill="#1a0a00"/><path d="M36 48 Q50 54 64 48" fill="none" stroke="#c0a080" stroke-width="1.5" opacity="0.4"/><path d="M30 52 L26 64 L34 58 M70 52 L74 64 L66 58" fill="none" stroke="#604030" stroke-width="2" stroke-linecap="round"/><path d="M20 32 L18 20 L24 28 M80 32 L82 20 L76 28" fill="none" stroke="#604030" stroke-width="2" stroke-linecap="round"/></svg>`,
  S: `<svg viewBox="0 0 100 100"><defs><radialGradient id="sg"><stop offset="0%" stop-color="#ffe060"/><stop offset="60%" stop-color="#ffd700"/><stop offset="100%" stop-color="#c49020"/></radialGradient></defs><circle cx="50" cy="50" r="40" fill="url(#sg)" stroke="#a07010" stroke-width="2.5"/><circle cx="50" cy="50" r="32" fill="none" stroke="#ffed8a" stroke-width="1" opacity="0.4"/><text x="50" y="66" text-anchor="middle" font-family="Georgia,serif" font-size="42" font-weight="900" fill="#8a5000" stroke="#6a3000" stroke-width="0.5">$</text><path d="M50 6 L53 20 L50 18 L47 20 Z" fill="#ffed8a" opacity="0.7"/><path d="M50 94 L53 80 L50 82 L47 80 Z" fill="#ffed8a" opacity="0.7"/><path d="M6 50 L20 47 L18 50 L20 53 Z" fill="#ffed8a" opacity="0.7"/><path d="M94 50 L80 47 L82 50 L80 53 Z" fill="#ffed8a" opacity="0.7"/></svg>`,
  card: (l) => `<svg viewBox="0 0 100 100"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#e8e8f0"/><stop offset="100%" stop-color="#9090b0"/></linearGradient></defs><rect x="10" y="10" width="80" height="80" rx="12" fill="none" stroke="url(#cg)" stroke-width="2.5" opacity="0.35"/><text x="50" y="68" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="54" font-weight="700" fill="url(#cg)">${l}</text></svg>`
};

const SYM = {
  B:{n:'Buffalo',p:[0,0,10,50,200]},E:{n:'Eagle',p:[0,0,8,40,150]},
  W:{n:'Wolf',p:[0,0,6,30,100]},C:{n:'Cougar',p:[0,0,5,25,75]},
  L:{n:'Elk',p:[0,0,4,20,60]},A:{n:'A',p:[0,0,3,15,40]},
  K:{n:'K',p:[0,0,2,12,30]},Q:{n:'Q',p:[0,0,2,10,25]},
  J:{n:'J',p:[0,0,1,8,20]},T:{n:'10',p:[0,0,1,6,15]},
  N:{n:'9',p:[0,0,1,5,10]},S:{n:'Scatter',p:[0,0,5,20,50]}
};
const ANIMALS = ['B','E','W','C','L'];
const CARDS = ['A','K','Q','J','T','N'];
const SC = 'S';
const ROWS = 4;
const COLS = 4;

const REEL_STRIPS = [
  ['A','K','B','Q','J','T','N','L','A','Q','K','J','W','T','N','A','K','Q','B','J','T','N','C','A','K','Q','J','T','N','E','A','K','Q','J','T','L','N','A','K','Q','J','T','N','A','K','W','Q','J','T','N','A','K','Q','B','J','T','N','C','A','K','Q','J','T','N','L','A','K','Q','J','T','N','A','K','Q','W','J','T','N','A','K','Q','J','T','N','E','A','K','Q','B','J','T','N','A','K','Q','J','T','L','N','A'],
  ['Q','J','B','K','T','N','A','L','Q','J','K','T','N','A','W','Q','J','K','T','N','A','C','Q','J','K','T','N','A','E','Q','J','B','K','T','N','A','L','Q','J','K','T','N','A','W','Q','J','K','T','N','A','C','Q','J','K','B','T','N','A','L','Q','J','K','T','N','A','W','Q','J','K','T','N','A','E','Q','J','K','T','N','A','L','Q','J','B','K','T','N','A','W','Q','J','K','T','N','A','C','Q','J','K','T','N'],
  ['K','T','B','Q','J','N','A','L','K','T','Q','J','N','A','W','K','T','Q','J','N','A','E','K','T','Q','B','J','N','A','C','K','T','Q','J','N','A','L','K','T','Q','J','N','A','W','K','T','Q','J','N','A','E','K','T','Q','B','J','N','A','C','K','T','Q','J','N','A','L','K','T','Q','J','N','A','W','K','T','Q','J','N','A','E','K','T','Q','J','B','N','A','C','K','T','Q','J','N','A','L','K','T','Q','J','N'],
  ['J','N','B','K','T','A','Q','L','J','N','K','T','A','Q','W','J','N','K','T','A','Q','E','J','N','K','B','T','A','Q','C','J','N','K','T','A','Q','L','J','N','K','T','A','Q','W','J','N','K','T','A','Q','E','J','N','K','T','A','B','Q','C','J','N','K','T','A','Q','L','J','N','K','T','A','Q','W','J','N','K','T','A','Q','E','J','N','K','T','A','Q','B','C','J','N','K','T','A','Q','L','J','N','K','T','A']
];

const BETS = [1,2,5,10,15,20,25,30,40,50,75,100,150,200,300,500];

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function getClass(sym) {
  const m = { B:'buffalo',E:'eagle',W:'wolf',C:'cougar',L:'elk',S:'scatter' };
  return m[sym] || 'card';
}

function renderSym(sym) {
  if (sym === SC) return `<div class="sym">${SVGS.S}</div>`;
  if (CARDS.includes(sym)) return `<div class="sym">${SVGS.card(sym)}</div>`;
  return `<div class="sym">${SVGS[sym]}</div>`;
}

function countScatter(grid) {
  let n = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (grid[r][c] === SC) n++;
  return n;
}

function calcWins(grid, mult) {
  const sc = countScatter(grid);
  let sw = 0;
  if (sc >= 3) sw = SYM[SC].p[sc] * betRef;

  const allKeys = [...ANIMALS, ...CARDS];
  const result = {};
  let total = sw;

  for (const k of allKeys) {
    let cnt = 0;
    for (let c = 0; c < COLS; c++) {
      let hit = false;
      for (let r = 0; r < ROWS; r++) {
        if (grid[r][c] === k) { hit = true; break; }
      }
      if (hit) cnt++;
      else break;
    }
    if (cnt >= 3) {
      let ww = 1;
      for (let c = 0; c < cnt; c++) {
        let n = 0;
        for (let r = 0; r < ROWS; r++) if (grid[r][c] === k) n++;
        ww *= n;
      }
      const win = SYM[k].p[cnt] * betRef * mult * ww;
      result[k] = { cnt, ww, win };
      total += win;
    }
  }

  if (sc >= 3) result[SC] = { cnt: sc, win: sw };

  const winKeys = Object.keys(result).filter(k => k !== SC);
  return { total, scatter: sw, result, winKeys, sc };
}

// Module-level bet reference for calcWins
let betRef = 20;

export default function BuffaloSlot({ balance: extBalance, setBalance: setExtBalance, addNotification, currentUser }) {
  const { currentProfile, refreshProfile } = useAuth();
  const [bet, setBet] = useState(20);
  const [spinning, setSpinning] = useState(false);
  const [freeSpins, setFreeSpins] = useState(0);
  const [grid, setGrid] = useState(() => {
    const g = [];
    for (let r = 0; r < ROWS; r++) { g[r] = []; for (let c = 0; c < COLS; c++) g[r][c] = 'A'; }
    return g;
  });
  const [wins, setWins] = useState({});
  const [lastWin, setLastWin] = useState(0);
  const [showMsg, setShowMsg] = useState(false);
  const [msgMain, setMsgMain] = useState('');
  const [msgSub, setMsgSub] = useState('');
  const [showPaytable, setShowPaytable] = useState(false);
  const [particles, setParticles] = useState([]);
  const [winFloats, setWinFloats] = useState([]);
  const [soundOn, setSoundOn] = useState(() => {
    try { return localStorage.getItem('buffalo_sound') !== 'off'; } catch { return true; }
  });
  const spinRef = useRef(false);
  const reelRefs = useRef([]);
  const humRef = useRef(null);
  const gridRef = useRef(grid);
  const freeSpinsRef = useRef(freeSpins);
  const betRef2 = useRef(bet);
  const extBalanceRef = useRef(extBalance);
  const soundOnRef = useRef(soundOn);

  gridRef.current = grid;
  freeSpinsRef.current = freeSpins;
  betRef2.current = bet;
  extBalanceRef.current = extBalance;
  soundOnRef.current = soundOn;

  useEffect(() => {
    if (currentProfile && currentProfile.balance !== undefined) {
      setExtBalance(parseFloat(currentProfile.balance));
    }
  }, [currentProfile]);

  const showMessage = useCallback((main, sub, dur) => {
    setMsgMain(main);
    setMsgSub(sub || '');
    setShowMsg(true);
    if (dur) setTimeout(() => setShowMsg(false), dur);
  }, []);

  const hideMessage = useCallback(() => setShowMsg(false), []);

  // Direct DOM reel animation using callback refs
  const reelCellRefs = useRef([]);
  const setCellRef = (c, r) => (el) => {
    if (!reelCellRefs.current[c]) reelCellRefs.current[c] = [];
    reelCellRefs.current[c][r] = el;
  };

  const animateReel = async (col, dur) => {
    const strip = REEL_STRIPS[col];
    const frames = 10 + col * 2;
    const frameDelay = dur / frames;
    const startPos = Math.floor(Math.random() * strip.length);
    const cells = reelCellRefs.current[col] || [];

    for (let f = 0; f < frames; f++) {
      const pos = (startPos + f * 4) % strip.length;
      for (let r = 0; r < ROWS; r++) {
        const k = strip[(pos + r) % strip.length];
        if (cells[r]) cells[r].innerHTML = renderSym(k);
      }
      if (f < frames - 1) { if (soundOnRef.current) playReelTick(); }
      await delay(frameDelay);
    }

    const finalPos = Math.floor(Math.random() * (strip.length - ROWS));
    const result = [];
    for (let r = 0; r < ROWS; r++) {
      const k = strip[(finalPos + r) % strip.length];
      if (cells[r]) cells[r].innerHTML = renderSym(k);
      result.push(k);
    }
    if (soundOnRef.current) playReelStop();
    return result;
  };

  const doSpin = useCallback(async () => {
    if (spinRef.current) return;
    const curBet = betRef2.current;
    const curFs = freeSpinsRef.current;
    const curBal = extBalanceRef.current;

    if (curFs === 0 && curBal < curBet) {
      showMessage('NO FUNDS', 'Increase your balance to continue', 2000);
      if (soundOnRef.current) playLowFunds();
      return;
    }

    spinRef.current = true;
    setSpinning(true);
    hideMessage();
    setWins({});
    setLastWin(0);
    setParticles([]);
    setWinFloats([]);

    if (soundOnRef.current) playSpin();

    const deduct = curFs === 0 ? curBet : 0;
    if (curFs === 0) {
      setExtBalance(prev => prev - curBet);
    } else {
      setFreeSpins(prev => prev - 1);
    }

    // Start ambient hum
    const humId = setInterval(() => {
      try {
        const act = new (window.AudioContext || window.webkitAudioContext)();
        if (act.state === 'suspended') act.resume();
        const o = act.createOscillator();
        const g = act.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(60 + Math.sin(Date.now() / 100) * 5, act.currentTime);
        g.gain.setValueAtTime(0.008, act.currentTime);
        g.gain.exponentialRampToValueAtTime(0.001, act.currentTime + 0.1);
        o.connect(g);
        g.connect(act.destination);
        o.start();
        o.stop(act.currentTime + 0.1);
      } catch(e) {}
    }, 100);
    humRef.current = humId;

    const durations = [280, 360, 440, 520, 600];
    const results = [];
    for (let c = 0; c < COLS; c++) {
      const r = await animateReel(c, durations[c]);
      results.push(r);
    }

    clearInterval(humRef.current);
    humRef.current = null;

    // Transpose results to grid and update React state
    const g = [];
    for (let r = 0; r < ROWS; r++) {
      g[r] = [];
      for (let c = 0; c < COLS; c++) g[r][c] = results[c][r];
    }
    setGrid(g);
    gridRef.current = g;

    const curFsNow = freeSpinsRef.current;
    const mult = (curFsNow > 0) ? 2 : 1;
    betRef = curBet;
    const { total, result: winResult, sc, winKeys } = calcWins(g, mult);

    if (sc >= 3) {
      const newFs = (curFsNow > 0 ? curFsNow : 0) + 8;
      setFreeSpins(newFs);
      freeSpinsRef.current = newFs;
      showMessage('FREE SPINS!', '8 Free Spins Awarded', 2500);
      if (soundOnRef.current) playScatter();
    }

    if (total > 0) {
      setWins(winResult);
      setLastWin(total);
      const msg = curFsNow > 0 ? 'Free Spins Active!' : (mult > 1 ? '2x Multiplier!' : '');
      showMessage('WIN ' + Math.floor(total), msg, 3000);
      if (soundOnRef.current) playWin();
      setExtBalance(prev => prev + total);

      // Particles
      const newP = [];
      for (let i = 0; i < 15; i++) {
        newP.push({
          id: Date.now() + i,
          x: 10 + Math.random() * 80, y: 20 + Math.random() * 60,
          tx: (Math.random() - 0.5) * 120, ty: -(30 + Math.random() * 100),
          color: ['#ffd700','#ff8c00','#fff4c0','#ffa500'][Math.floor(Math.random() * 4)],
          size: 2 + Math.random() * 4
        });
      }
      setParticles(newP);
      setTimeout(() => setParticles([]), 1000);
      const newF = [{ id: Date.now(), amt: Math.floor(total) }];
      setWinFloats(newF);
      setTimeout(() => setWinFloats([]), 1800);
    } else if (curFsNow > 0 && sc === 0) {
      showMessage('FREE SPIN', mult > 1 ? '2x Multiplier' : curFsNow + ' remaining', 1200);
    }

    // Sync balance
    const newBal = curBal - deduct + total;
    if (currentUser) {
      try {
        const client = getSupabaseClient();
        if (client) {
          await client.rpc('update_balance', { user_id: currentUser.id, new_balance: newBal });
        }
      } catch(e) {}
    }

    spinRef.current = false;
    setSpinning(false);
  }, [showMessage, hideMessage, currentUser, setExtBalance]);

  const changeBet = useCallback((dir) => {
    if (spinning) return;
    if (soundOnRef.current) playBetTick();
    setBet(prev => {
      let i = BETS.indexOf(prev);
      if (i === -1) i = BETS.indexOf(20);
      i = Math.max(0, Math.min(BETS.length - 1, i + dir));
      return BETS[i];
    });
  }, [spinning]);

  const setBetMin = useCallback(() => {
    if (spinning) return;
    if (soundOnRef.current) playButton();
    setBet(BETS[0]);
  }, [spinning]);

  const setBetMax = useCallback(() => {
    if (spinning) return;
    if (soundOnRef.current) playButton();
    setBet(BETS[BETS.length - 1]);
  }, [spinning]);

  const toggleSound = useCallback(() => {
    setSoundOn(prev => {
      const next = !prev;
      try { localStorage.setItem('buffalo_sound', next ? 'on' : 'off'); } catch {}
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (e.code === 'Space' && !spinRef.current) {
        e.preventDefault();
        initAudio();
        doSpin();
      }
      if (e.code === 'Escape') {
        setShowPaytable(false);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [doSpin]);

  return (
    <div className="buffalo-slot-wrap">
      <div className="game-wrapper">
        <div className="machine">
          <div className="machine-inner">
            <div className="top-sign">
              <h1>BUFFALO</h1>
              <div className="subtitle">ARISTOCRAT STYLE SLOTS</div>
            </div>
            <div className="gold-trim"></div>
            <div className="reel-window" id="reelWindow">
              <div className="reel-window-inner">
                <div className="reels">
                  {Array.from({ length: COLS }).map((_, c) => (
                    <div className="reel" key={c}>
                      {Array.from({ length: ROWS }).map((_, r) => {
                        const sym = grid[r]?.[c] || 'A';
                        const cls = 'sym-' + getClass(sym);
                        return (
                          <div key={r+'-'+c} ref={setCellRef(c, r)}
                            className={`symbol-cell ${cls} ${wins[sym]?.win > 0 ? 'win-highlight' : ''}`}
                            dangerouslySetInnerHTML={{__html: renderSym(sym)}}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div className="msg-overlay">
                  <div className={`msg-box ${showMsg ? 'show' : ''}`}>
                    <div className="msg-main">{msgMain}</div>
                    <div className="msg-sub">{msgSub}</div>
                  </div>
                </div>
                <div className={`fs-indicator ${freeSpins > 0 ? 'show' : ''}`}>
                  <div className="fs-bg">
                    <div className="fs-num">{freeSpins}</div>
                    <div className="fs-label">Free Spins</div>
                  </div>
                </div>
                {particles.map(p => (
                  <div
                    key={p.id}
                    className="particle"
                    style={{
                      left: p.x + '%', top: p.y + '%',
                      background: p.color,
                      width: p.size + 'px', height: p.size + 'px',
                      '--tx': p.tx + 'px', '--ty': p.ty + 'px'
                    }}
                  />
                ))}
                {winFloats.map(f => (
                  <div key={f.id} className="win-float" style={{ left: (30 + Math.random() * 40) + '%', top: (20 + Math.random() * 20) + '%' }}>
                    +{f.amt}
                  </div>
                ))}
              </div>
            </div>
            <div className="panel">
              <div className="displays">
                <div className="display-box">
                  <div className="label">Balance</div>
                  <div className="value credit">{Math.floor(extBalance).toLocaleString()}</div>
                </div>
                <div className="display-box">
                  <div className="label">Total Bet</div>
                  <div className="value bet">{bet}</div>
                </div>
                <div className="display-box">
                  <div className="label">Win</div>
                  <div className="value wins">{Math.floor(lastWin)}</div>
                </div>
              </div>
              <div className="btn-row">
                <button className="btn btn-sm" id="betMinBtn" onClick={setBetMin} disabled={spinning}>«</button>
                <button className="btn btn-sm" id="betDownBtn" onClick={() => changeBet(-1)} disabled={spinning}>−</button>
                <span className="btn-bet-label" id="betLabel">BET {bet}</span>
                <button className="btn btn-sm" id="betUpBtn" onClick={() => changeBet(1)} disabled={spinning}>+</button>
                <button className="btn btn-sm" id="betMaxBtn" onClick={setBetMax} disabled={spinning}>»</button>
                <button className="btn btn-spin" id="spinBtn" onClick={doSpin} disabled={spinning}>
                  {spinning ? 'SPINNING...' : freeSpins > 0 ? 'FREE SPIN' : 'SPIN'}
                </button>
                <button className={`btn btn-info ${soundOn ? '' : 'muted'}`} onClick={() => { if (soundOnRef.current) playButton(); toggleSound(); }} style={{minWidth:'40px'}}>♪</button>
                <button className="btn btn-info" id="paytableBtn" onClick={() => { if (soundOnRef.current) playButton(); setShowPaytable(true); }}>i</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {showPaytable && <PaytableModal onClose={() => setShowPaytable(false)} SVGS={SVGS} />}
    </div>
  );
}
