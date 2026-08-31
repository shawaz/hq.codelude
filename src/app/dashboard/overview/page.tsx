import { getPageScopeNames } from '@/lib/page-scopes-server';
const ALL_VENTURE_CARDS = [
  { num: '01', name: 'Roborns',     sector: 'Coastal AI Infrastructure', color: '#5DCAA5', status: 'In Development', desc: 'Thermal engineering engaged. Site survey underway in Mangaluru.',         metrics: [{ k: 'Phase', v: '1 — Feasibility' }, { k: 'HoldCo', v: 'Dubai, UAE' }] },
  { num: '02', name: 'Franchiseen', sector: 'AI Business Assistant',       color: '#7F77DD', status: 'Alpha',          desc: 'Platform architecture complete. First franchise partner onboarding.',   metrics: [{ k: 'Stage', v: 'Alpha' }, { k: 'Payout cycle', v: 'Q3 2026' }] },
  { num: '03', name: 'HubCV',       sector: 'AI Career Assistant',     color: '#FAC775', status: 'In Development', desc: 'Matching engine in development. Recruiter outreach started.',           metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta target', v: 'Q4 2026' }] },
  { num: '04', name: 'Dextrip',     sector: 'AI Trading Assistant',      color: '#F0997B', status: 'Closed Beta',    desc: 'Strategy engine live with paying beta subscribers. Public beta and creator marketplace next.', metrics: [{ k: 'Stage', v: 'Closed beta' }, { k: 'Public beta', v: 'Q3 2026' }] },
  { num: '05', name: 'Llife',       sector: 'AI Life Assistant',         color: '#85B7EB', status: 'Planning',       desc: 'Five-domain model defined. HubCV, Dextrip and Franchiseen API integrations in build.',      metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Launch', v: '2027' }] },
];

const ACTIVITY = [
  { date: 'May 21', text: 'EMA Trend DOWN signal bug fixed. Previous 4 capped at 3 steps.' },
  { date: 'May 20', text: 'Codelude.com launched and live.' },
  { date: 'May 20', text: 'hq.codelude.com deployed.' },
  { date: 'May 19', text: 'Franchiseen payout architecture finalized.' },
  { date: 'May 15', text: 'Roborns thermal feasibility study commissioned.' },
  { date: 'May 10', text: 'HubCV matching engine development started.' },
];

export default async function OverviewPage() {
  // Server-rendered strip, filtered the same way the client ones are.
  const allowed = await getPageScopeNames('overview');
  const VENTURES = ALL_VENTURE_CARDS.filter(v => allowed.includes(v.name));

  return (
    <div>
      <div className="stats-row">
        <div className="stat-box"><div className="stat-box-num">4</div><div className="stat-box-label">Active ventures</div></div>
        <div className="stat-box"><div className="stat-box-num">1</div><div className="stat-box-label">Team members</div></div>
        <div className="stat-box"><div className="stat-box-num">DXB</div><div className="stat-box-label">HoldCo domicile</div></div>
        <div className="stat-box"><div className="stat-box-num hi">Live</div><div className="stat-box-label">codelude.com</div></div>
      </div>

      <div className="dashboard-grid">
        <div>
          <div className="section-label">Ventures</div>
          <div className="venture-cards">
            {VENTURES.map(v => (
              <div key={v.num} className="vc" style={{ borderLeft: `2px solid ${v.color}` }}>
                <div className="vc-top">
                  <div>
                    <div className="vc-num">{v.num} / {v.name.toUpperCase()}</div>
                    <div className="vc-name">{v.name}</div>
                    <div className="vc-sector">{v.sector}</div>
                  </div>
                  <div className="vc-status" style={{ color: v.color }}>{v.status}</div>
                </div>
                <p className="vc-desc">{v.desc}</p>
                <div className="vc-metrics">
                  {v.metrics.map(m => (
                    <div key={m.k} className="vc-metric">
                      <span className="vc-metric-key">{m.k}</span>
                      <span className="vc-metric-val">{m.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="section-label">Activity</div>
          <div className="activity-list">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="activity-item">
                <span className="activity-date">{a.date}</span>
                <span className="activity-text">{a.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
