import React, { useState, useCallback, useEffect, useRef } from 'react';
import BuffaloSlot from './BuffaloSlot';

const GAMES = [
  { name:'Cleos Heart', prov:'NetGame', icon:'📜', bg:'linear-gradient(135deg,#1a1a3e,#2a1a5e)' },
  { name:'MMA Legends', prov:'NetGame', icon:'🥊', bg:'linear-gradient(135deg,#1a2a2e,#2a3a4e)' },
  { name:'Book Of Nile', prov:'NetGame', icon:'📖', bg:'linear-gradient(135deg,#1a2a1e,#2a3a2e)' },
  { name:'Corrida Romance', prov:'Wazdan', icon:'🐂', bg:'linear-gradient(135deg,#2a1a1e,#3a2a2e)' },
  { name:'Captain Shark', prov:'Wazdan', icon:'🦈', bg:'linear-gradient(135deg,#1a2a3e,#2a3a4e)' },
  { name:'Highway To Hell', prov:'Wazdan', icon:'🔥', bg:'linear-gradient(135deg,#2a1a2e,#3a2a3e)' },
  { name:'Fruit Fiesta', prov:'Wazdan', icon:'🍉', bg:'linear-gradient(135deg,#2a2a1e,#3a3a2e)' },
  { name:'Demon Jack 27', prov:'Wazdan', icon:'😈', bg:'linear-gradient(135deg,#1a1a2e,#2a1a3e)' },
  { name:'Triple Monkey', prov:'Skywind', icon:'🐒', bg:'linear-gradient(135deg,#1a3a2e,#2a4a3e)' },
  { name:'Lepry Bunny Patrick', prov:'Skywind', icon:'🐰', bg:'linear-gradient(135deg,#2a1a3e,#3a2a4e)' },
  { name:'Monopoly Megaways', prov:'Skywind', icon:'🎩', bg:'linear-gradient(135deg,#1a2a2e,#2a3a3e)' },
  { name:'Queen of Wands', prov:'Skywind', icon:'👑', badge:'new', bg:'linear-gradient(135deg,#2a1a1e,#3a2a2e)' },
  { name:'Fruit Shop', prov:'NetEnt', icon:'🍒', badge:'new', bg:'linear-gradient(135deg,#1a3a1e,#2a4a2e)' },
  { name:'Narcos', prov:'NetEnt', icon:'💊', bg:'linear-gradient(135deg,#1a1a2e,#2a1a3e)' },
  { name:'Santa vs Rudolph', prov:'NetEnt', icon:'🎅', bg:'linear-gradient(135deg,#2a2a1e,#3a3a2e)' },
  { name:'Space Wars', prov:'NetEnt', icon:'🚀', bg:'linear-gradient(135deg,#1a2a3e,#2a3a4e)' },
  { name:'Star Burst', prov:'NetEnt', icon:'⭐', bg:'linear-gradient(135deg,#2a1a2e,#3a2a3e)' },
  { name:'Go Bananas', prov:'NetEnt', icon:'🍌', bg:'linear-gradient(135deg,#1a2a1e,#2a3a2e)' },
  { name:'The Wolfs Bane', prov:'NetEnt', icon:'🐺', bg:'linear-gradient(135deg,#2a2a3e,#3a3a4e)' },
  { name:'Book of Aztec King', prov:'Pragmatic', icon:'🏛️', badge:'new', bg:'linear-gradient(135deg,#1a1a2e,#2a1a4e)' },
  { name:'Day of Dead', prov:'Pragmatic', icon:'💀', bg:'linear-gradient(135deg,#2a1a1e,#3a2a2e)' },
  { name:'Striking Hot 5', prov:'Pragmatic', icon:'🔥', bg:'linear-gradient(135deg,#1a2a1e,#2a3a2e)' },
  { name:'Miss Kitty', prov:'Aristocrat', icon:'🐱', bg:'linear-gradient(135deg,#1a2a2e,#2a3a3e)' },
  { name:'LuckyNewYearTigerTreasures', prov:'Pragmatic', icon:'🐯', bg:'linear-gradient(135deg,#2a1a2e,#3a2a3e)' },
  { name:'Primeval Rainforest', prov:'Ka-Gaming', icon:'🌴', badge:'new', bg:'linear-gradient(135deg,#1a3a2e,#2a4a3e)' },
  { name:'Hoodvswoolf', prov:'PGSoft', icon:'🐺', badge:'exclusive', bg:'linear-gradient(135deg,#2a1a1e,#3a2a2e)' },
  { name:'Bikini Paradise', prov:'PGSoft', icon:'🌺', badge:'exclusive', bg:'linear-gradient(135deg,#1a2a3e,#2a3a4e)' },
  { name:'Game of Luck', prov:'Egt', icon:'🎲', bg:'linear-gradient(135deg,#2a2a1e,#3a3a2e)' },
  { name:'Green Shamrock', prov:'GD Games', icon:'🍀', bg:'linear-gradient(135deg,#1a3a1e,#2a4a2e)' },
  { name:'Funky Monkey JP', prov:'Playtech', icon:'🐒', bg:'linear-gradient(135deg,#2a1a3e,#3a2a4e)' },
  { name:'Great Book Of Magic', prov:'Wazdan', icon:'📖', badge:'new', bg:'linear-gradient(135deg,#1a1a2e,#2a1a3e)' },
  { name:'RiseOfSamurai3', prov:'Pragmatic', icon:'⚔️', badge:'new', bg:'linear-gradient(135deg,#2a1a2e,#3a2a3e)' },
  { name:'Crystal 7s', prov:'GD Games', icon:'💎', bg:'linear-gradient(135deg,#1a2a2e,#2a3a3e)' },
  { name:'Egyptian Fortunes', prov:'Pragmatic', icon:'🏺', bg:'linear-gradient(135deg,#2a2a1e,#3a3a2e)' },
  { name:'Bird Hunter', prov:'Arcade', icon:'🎯', badge:'new', bg:'linear-gradient(135deg,#1a3a2e,#2a4a3e)' },
  { name:'Hercules Son Of Zeus', prov:'Pragmatic', icon:'⚡', badge:'new', bg:'linear-gradient(135deg,#2a1a1e,#3a2a2e)' },
];

const GAME_TABS = ['All Providers','All Games','Slots','Live Casino','Table Games','Crash','Popular','New'];

const LAST_WINS = [
  { game:'Book of Aztec King', amount:'USD 486.53', user:'b*******@list.ru' },
  { game:'Fruit Shop', amount:'USD 219.27', user:'k*******@yahoo.com' },
  { game:'MMA Legends', amount:'USD 214.70', user:'k*******@yahoo.com' },
  { game:'Day of Dead', amount:'USD 505.35', user:'d*******@yandex.ru' },
  { game:'Funky Monkey JP', amount:'USD 373.70', user:'d*******@yandex.ru' },
  { game:'Corrida Romance', amount:'USD 128.04', user:'j*******@gmail.com' },
  { game:'Day of Dead', amount:'USD 234.90', user:'s*******@inbox.ru' },
  { game:'Funky Monkey JP', amount:'USD 217.69', user:'x*******@proton.me' },
  { game:'Primeval Rainforest', amount:'USD 347.54', user:'m*******@mail.ru' },
  { game:'Highway To Hell', amount:'USD 109.96', user:'m*******@mail.ru' },
  { game:'Santa vs Rudolph', amount:'USD 489.27', user:'x*******@proton.me' },
  { game:'Green Shamrock', amount:'USD 273.42', user:'a*******@hotmail.com' },
  { game:'Cleos Heart', amount:'USD 251.73', user:'k*******@yahoo.com' },
  { game:'Captain Shark', amount:'USD 383.13', user:'x*******@proton.me' },
  { game:'Great Book Of Magic', amount:'USD 207.85', user:'s*******@inbox.ru' },
];

const LW_DUPLICATE = [...LAST_WINS];

const INITIAL_BETS = [
  { game:'Money Train 3', user:'Dr_Spin', time:'2:25 AM', bet:'1,413.00', mult:'0.00x', payout:'1,413.00', plus:false },
  { game:'LuckyNewYearTigerTreasures', user:'HighRoller', time:'2:25 AM', bet:'3,272.00', mult:'0.00x', payout:'3,272.00', plus:false },
  { game:'LuckyNewYearTigerTreasures', user:'HighRoller', time:'2:25 AM', bet:'4,349.00', mult:'5.63x', payout:'+24,498.65', plus:true },
  { game:'Hoodvswoolf', user:'LuckyLola', time:'2:25 AM', bet:'3,264.00', mult:'0.00x', payout:'3,264.00', plus:false },
  { game:'Funky Monkey JP', user:'Alex_K', time:'2:25 AM', bet:'4,312.00', mult:'0.00x', payout:'4,312.00', plus:false },
  { game:'Buffalo King', user:'LuckyStar', time:'2:25 AM', bet:'2,292.00', mult:'0.00x', payout:'2,292.00', plus:false },
  { game:'Narcos', user:'LuckyLola', time:'2:25 AM', bet:'1,991.00', mult:'4.07x', payout:'+8,108.26', plus:true },
  { game:'Egyptian Fortunes', user:'WinWin_88', time:'2:25 AM', bet:'3,130.00', mult:'0.00x', payout:'3,130.00', plus:false },
  { game:'MMA Legends', user:'LuckyStar', time:'2:24 AM', bet:'1,638.00', mult:'0.00x', payout:'1,638.00', plus:false },
  { game:'The Wolfs Bane', user:'VeveiPro', time:'2:24 AM', bet:'959.00', mult:'5.82x', payout:'+5,583.51', plus:true },
];

const BET_GAMES = ['Money Train 3','LuckyNewYearTigerTreasures','Hoodvswoolf','Funky Monkey JP','Buffalo King','Narcos','Egyptian Fortunes','MMA Legends','The Wolfs Bane','Book of Aztec King','Fruit Shop','Day of Dead','Corrida Romance','Captain Shark','Highway To Hell'];
const BET_USERS = ['Dr_Spin','HighRoller','LuckyLola','Alex_K','LuckyStar','WinWin_88','VeveiPro','MegaBet99','SlotKing','CryptoWin','LunaRose','AlphaGambler'];

export default function CasinoLobby({ balance, setBalance, addNotification, currentUser, onRequireAuth }) {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All Providers');
  const [liveBets, setLiveBets] = useState(INITIAL_BETS);
  const [betCount, setBetCount] = useState(INITIAL_BETS.length);
  const [progressPct, setProgressPct] = useState(3);
  const [flashRow, setFlashRow] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const game = BET_GAMES[Math.floor(Math.random() * BET_GAMES.length)];
      const user = BET_USERS[Math.floor(Math.random() * BET_USERS.length)];
      const hrs = Math.floor(Math.random() * 12) + 1;
      const mins = String(Math.floor(Math.random() * 60)).padStart(2, '0');
      const ampm = Math.random() > 0.5 ? 'AM' : 'PM';
      const bet = (Math.random() * 5000 + 100).toFixed(2);
      const mult = (Math.random() * 8).toFixed(2);
      const isWin = Math.random() > 0.6;
      const payout = isWin ? (parseFloat(bet) * parseFloat(mult)).toFixed(2) : parseFloat(bet).toFixed(2);
      const newBet = {
        game,
        user,
        time: `${hrs}:${mins} ${ampm}`,
        bet: Number(bet).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        mult: mult + 'x',
        payout: isWin && parseFloat(mult) > 1 ? '+' + Number(payout).toLocaleString('en-US', { minimumFractionDigits: 2 }) : Number(payout).toLocaleString('en-US', { minimumFractionDigits: 2 }),
        plus: isWin && parseFloat(mult) > 1,
      };
      setLiveBets(prev => [newBet, ...prev].slice(0, 15));
      setBetCount(prev => prev + 1);
      setFlashRow(newBet);
      setTimeout(() => setFlashRow(null), 800);
    }, 4000 + Math.random() * 3000);
    return () => clearInterval(interval);
  }, []);

  const filtered = GAMES.filter(g => {
    const q = search.toLowerCase();
    if (q && !g.name.toLowerCase().includes(q) && !g.prov.toLowerCase().includes(q)) return false;
    const c = cat.toLowerCase();
    if (c === 'all providers' || c === 'all games' || c === 'slots') return true;
    if (c === 'new' && g.badge === 'new') return true;
    if (c === 'popular') return true;
    if (['live casino', 'table games', 'crash'].includes(c)) return false;
    return g.prov.toLowerCase().includes(c);
  });

  const handleGameClick = useCallback((name, prov) => {
    if (name.toLowerCase().includes('buffalo')) {
      document.querySelector('.featured-wrap')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      addNotification(`🎰 ${name} by ${prov} launched`);
      addNotification(`ℹ️ ${name} — demo coming soon`);
    }
  }, [addNotification]);

  const handleLoadMore = useCallback(() => {
    setProgressPct(prev => Math.min(prev + 3, 100));
  }, []);

  const badgeClass = (badge) => {
    if (badge === 'new') return 'new';
    if (badge === 'exclusive' || badge === 'EXCLUSIVE') return 'excl';
    return '';
  };

  const badgeLabel = (badge) => {
    if (badge === 'exclusive') return 'EXCLUSIVE';
    return badge ? badge.toUpperCase() : '';
  };

  return (
    <>
      <div className="top-bar">
        <div className="search-wrap">
          <i className='bx bx-search'></i>
          <input type="text" placeholder="Search games..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="stat-badge"><i className='bx bx-globe'></i><span className="num">69,930</span> Players online</div>
      </div>

      <div className="last-wins-wrap">
        <div className="lw-label">Last wins <span>⟳</span></div>
        <div className="lw-scroll">
          <div className="lw-scroll-inner">
            {[...LAST_WINS, ...LW_DUPLICATE].map((w, i) => (
              <div className="lw-item" key={i}>
                <span className="game">{w.game}</span>
                <span className="amount">{w.amount}</span>
                <span className="user">{w.user}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="featured-wrap">
        <div className="featured-label">Featured Game</div>
        <BuffaloSlot
          balance={balance}
          setBalance={setBalance}
          addNotification={addNotification}
          currentUser={currentUser}
        />
      </div>

      <div className="game-type-tabs">
        {GAME_TABS.map(t => (
          <span key={t} className={`game-type-tab ${cat === t ? 'active' : ''}`} onClick={() => setCat(t)}>
            {t}
          </span>
        ))}
      </div>

      <div className="section-hdr">
        <h2>Games</h2>
      </div>
      <div className="game-grid" id="gameGrid">
        {filtered.map((g, i) => (
          <div key={i} className="game-card" data-provider={g.prov} onClick={() => handleGameClick(g.name, g.prov)}>
            <div className="thumb" style={{ background: g.bg }}>
              <div className="glare"></div>
              <span className="icon-wrap">{g.icon}</span>
              {g.badge && (
                <div className={`badge ${g.badge === 'exclusive' ? '' : badgeClass(g.badge)}`}
                  style={g.badge === 'exclusive' ? { background: 'linear-gradient(135deg,#f59e0b,#f97316)' } : {}}
                >
                  {badgeLabel(g.badge)}
                </div>
              )}
              <div className="overlay">
                <div className="play-icon"><i className='bx bx-play'></i></div>
              </div>
            </div>
            <div className="info">
              <div className="name">{g.name}</div>
              <div className="provider">
                {g.prov}
                {g.badge && <span className={`provider-badge ${badgeClass(g.badge)}`}>{badgeLabel(g.badge)}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="load-more-wrap">
        <div className="progress-bar">
          <div className="fill" style={{ width: progressPct + '%' }}></div>
        </div>
        <div className="progress-text">
          Displaying <b>{GAMES.length}</b> of <b>1,030</b> games · {progressPct}%
        </div>
        <button className="load-btn" onClick={handleLoadMore}>
          {progressPct >= 100 ? 'All Games Loaded' : 'Load More Games'}
        </button>
      </div>

      <div className="live-bets-wrap">
        <div className="lb-header">
          <h3><span className="live-dot"></span>Live Bets</h3>
          <span className="lb-count">{betCount} bets</span>
        </div>
        <div className="lb-scroll">
          <table>
            <thead>
              <tr><th>Game</th><th>User</th><th>Time</th><th>Bet Amount</th><th>Multiplier</th><th>Payout</th></tr>
            </thead>
            <tbody>
              {liveBets.map((b, i) => (
                <tr key={i} className={flashRow === b ? 'lb-new-row' : ''}>
                  <td><span className="game-name">{b.game}</span></td>
                  <td>{b.user}</td>
                  <td>{b.time}</td>
                  <td>{b.bet}</td>
                  <td>{b.mult}</td>
                  <td><span className={`payout ${b.plus ? 'plus' : ''}`}>{b.payout}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
