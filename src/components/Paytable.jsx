import React from 'react';

const ALL_KEYS = ['B','E','W','C','L','A','K','Q','J','T','N'];
const SYM_DATA = {
  B:{n:'Buffalo',p:[0,0,10,50,200]},E:{n:'Eagle',p:[0,0,8,40,150]},
  W:{n:'Wolf',p:[0,0,6,30,100]},C:{n:'Cougar',p:[0,0,5,25,75]},
  L:{n:'Elk',p:[0,0,4,20,60]},A:{n:'A',p:[0,0,3,15,40]},
  K:{n:'K',p:[0,0,2,12,30]},Q:{n:'Q',p:[0,0,2,10,25]},
  J:{n:'J',p:[0,0,1,8,20]},T:{n:'10',p:[0,0,1,6,15]},
  N:{n:'9',p:[0,0,1,5,10]},S:{n:'Scatter',p:[0,0,5,20,50]}
};
const CARDS = ['A','K','Q','J','T','N'];
const ANIMALS = ['B','E','W','C','L'];

export default function PaytableModal({ onClose, SVGS }) {
  return (
    <div className="modal-overlay show" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <h2>PAYTABLE</h2>
        <div className="paytable-section">
          <div className="section-label"><span>HIGH</span> PAYING</div>
          <table>
            <thead>
              <tr><th>Symbol</th><th>3</th><th>4</th><th>5</th></tr>
            </thead>
            <tbody>
              {ANIMALS.map(k => {
                const s = SYM_DATA[k];
                return (
                  <tr key={k}>
                    <td>
                      <span className={'sym-cell-table sym-' + ({B:'buffalo',E:'eagle',W:'wolf',C:'cougar',L:'elk'}[k])}
                        dangerouslySetInnerHTML={{ __html: SVGS[k] }}
                      />
                      {s.n}
                    </td>
                    <td>{s.p[2] || 0}</td>
                    <td>{s.p[3] || 0}</td>
                    <td>{s.p[4] || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="paytable-divider"></div>
        <div className="paytable-section">
          <div className="section-label"><span>LOW</span> PAYING</div>
          <table>
            <thead>
              <tr><th>Symbol</th><th>3</th><th>4</th><th>5</th></tr>
            </thead>
            <tbody>
              {CARDS.map(k => {
                const s = SYM_DATA[k];
                return (
                  <tr key={k}>
                    <td>
                      <span className="sym-cell-table sym-card"
                        dangerouslySetInnerHTML={{ __html: SVGS.card(k) }}
                      />
                      {s.n}
                    </td>
                    <td>{s.p[2] || 0}</td>
                    <td>{s.p[3] || 0}</td>
                    <td>{s.p[4] || 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="paytable-divider"></div>
        <div className="paytable-section">
          <div className="section-label"><span>SCATTER</span></div>
          <table>
            <thead>
              <tr><th>Symbol</th><th>3</th><th>4</th><th>5</th></tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="sym-cell-table sym-scatter"
                    dangerouslySetInnerHTML={{ __html: SVGS.S }}
                  />
                  Scatter
                </td>
                <td>{SYM_DATA.S.p[2]}</td>
                <td>{SYM_DATA.S.p[3]}</td>
                <td>{SYM_DATA.S.p[4]}</td>
              </tr>
            </tbody>
          </table>
          <div className="note">Scatter pays <b>ANY</b> reel position &amp; awards <b>8 Free Spins</b> for 3 or more</div>
        </div>
        <button className="modal-close" onClick={onClose}>CLOSE</button>
      </div>
    </div>
  );
}
