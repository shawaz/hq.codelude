const VENTURES = [
  {
    num: '01', name: 'Roborns', sector: 'Coastal AI Infrastructure',
    color: '#5DCAA5', status: 'In Development',
    desc: 'Thermal engineering engaged. Site survey underway in Mangaluru.',
    metrics: [{ k: 'Phase', v: '1 — Feasibility' }, { k: 'HoldCo', v: 'Dubai, UAE' }],
  },
  {
    num: '02', name: 'Franchiseen', sector: 'Franchise Finance OS',
    color: '#7F77DD', status: 'Alpha',
    desc: 'Platform architecture complete. First franchise partner onboarding.',
    metrics: [{ k: 'Stage', v: 'Alpha' }, { k: 'Payout cycle', v: 'Q3 2026' }],
  },
  {
    num: '03', name: 'HubCV', sector: 'AI Career Intelligence',
    color: '#FAC775', status: 'In Development',
    desc: 'Matching engine in development. Recruiter outreach started.',
    metrics: [{ k: 'Stage', v: 'Build' }, { k: 'Beta target', v: 'Q4 2026' }],
  },
  {
    num: '04', name: 'Cuestay', sector: 'Home AI Automation',
    color: '#85B7EB', status: 'Planning',
    desc: 'Protocol spec complete. Hardware partner conversations underway.',
    metrics: [{ k: 'Stage', v: 'Planning' }, { k: 'Launch', v: '2027' }],
  },
];

const ACTIVITY = [
  { date: 'May 20', text: 'Codelude.com launched and live.' },
  { date: 'May 20', text: 'hq.codelude.com deployed.' },
  { date: 'May 19', text: 'Franchiseen payout architecture finalized.' },
  { date: 'May 15', text: 'Roborns thermal feasibility study commissioned.' },
  { date: 'May 10', text: 'HubCV matching engine development started.' },
  { date: 'Mar 2026', text: 'Cuestay smart-home protocol spec published internally.' },
];

export default function OverviewPage() {
  return (
    <div>
      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-box-num">4</div>
          <div className="stat-box-label">Active ventures</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-num">1</div>
          <div className="stat-box-label">Team members</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-num">DXB</div>
          <div className="stat-box-label">HoldCo domicile</div>
        </div>
        <div className="stat-box">
          <div className="stat-box-num hi">Live</div>
          <div className="stat-box-label">codelude.com</div>
        </div>
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
