import { getUserScopeNames } from '@/lib/page-scopes-server';
const ALL_VENTURE_CARDS = [
  {
    num: '01', name: 'Roborns', sector: 'Coastal AI Infrastructure', color: '#dbdbdb',
    url: 'roborns.com', holdco: 'Dubai, UAE', status: 'In Development',
    desc: 'AI data center co-located with seawater desalination and mineral extraction on a 1-acre coastal site in Mangaluru. Waste heat from compute powers desalination.',
    milestones: ['Thermal engineering partner engaged', 'Site survey in progress', 'Phase 1 feasibility Q3 2026', 'Groundbreaking target Q4 2026'],
  },
  {
    num: '02', name: 'Franchiseen', sector: 'AI Business Assistant', color: '#c8c8c8',
    url: 'franchiseen.com', holdco: '—', status: 'Alpha',
    desc: 'Fractional ownership of franchise businesses with daily and monthly payout infrastructure. Platform handles entire ownership OS from onboarding to distribution.',
    milestones: ['Payout architecture finalized', 'First franchise partner onboarding', 'Alpha testing in progress', 'First payout cycle Q3 2026'],
  },
  {
    num: '03', name: 'HubCV', sector: 'AI Career Assistant', color: '#b5b5b5',
    url: 'hubcv.pro', holdco: '—', status: 'In Development',
    desc: 'Dynamic, AI-curated profiles that reflect real skills — verified by humans, enriched by AI. Connects professionals to upskilling pathways before the market prices them in.',
    milestones: ['Matching engine in development', 'Recruiter partnership outreach started', 'Beta target Q4 2026', 'Full launch 2027'],
  },
  {
    num: '04', name: 'Nanotrade', sector: 'AI Trading Assistant', color: '#adadad',
    url: 'nanotrade.com', holdco: '—', status: 'Closed Beta',
    desc: 'Algorithmic trading without coding or custodial risk. Build or subscribe to strategies and let Nanotrade execute across exchanges — your keys, your funds, automated.',
    milestones: ['Strategy engine — closed beta live', 'Multi-exchange connector in build', 'Public beta Q3 2026', 'Strategy marketplace opens to creators'],
  },
  {
    num: '05', name: 'Llife', sector: 'AI Life Assistant', color: '#a5a5a5',
    url: 'llife.ai', holdco: '—', status: 'Planning',
    desc: 'An AI personal assistant for day-to-day life across five domains — Finances, Education, Earnings, Mind and Body — on a daily time-block board. Education is fed by the HubCV API, Earnings by the Nanotrade (job, crypto, stocks) and Franchiseen (franchise) APIs, so the board arrives already populated.',
    milestones: ['Five-domain model defined', 'HubCV Education API integration in build', 'Nanotrade + Franchiseen Earnings integration Q4 2026', 'Private beta Q4 2026'],
  },
];

export default async function VenturesPage() {
  const allowed = await getUserScopeNames();
  const VENTURES = ALL_VENTURE_CARDS.filter(v => allowed.includes(v.name));

  return (
    <div>
      <div className="venture-cards" style={{ gap: 0 }}>
        {VENTURES.map(v => (
          <div key={v.num} className="vc" style={{ borderLeft: `2px solid ${v.color}`, marginBottom: '1px', background: 'var(--card-bg)' }}>
            <div className="vc-top">
              <div>
                <div className="vc-num">{v.num} / {v.name.toUpperCase()}</div>
                <div className="vc-name">{v.name}</div>
                <div className="vc-sector">{v.sector}</div>
              </div>
              <div className="vc-status" style={{ color: v.color }}>{v.status}</div>
            </div>
            <p className="vc-desc">{v.desc}</p>
            <div className="vc-metrics" style={{ marginBottom: '1rem' }}>
              <div className="vc-metric">
                <span className="vc-metric-key">Website</span>
                <span className="vc-metric-val">{v.url}</span>
              </div>
              {v.holdco !== '—' && (
                <div className="vc-metric">
                  <span className="vc-metric-key">HoldCo</span>
                  <span className="vc-metric-val" style={{ color: 'var(--accent-text)' }}>{v.holdco}</span>
                </div>
              )}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '0.5rem' }}>
              {v.milestones.map((m, i) => (
                <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.08em', padding: '0.25rem 0.65rem', border: '1px solid var(--card-border)', color: 'var(--muted)' }}>{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
