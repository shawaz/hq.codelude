import { sc, scBorder } from '@/lib/status-colors';
type Status = 'live' | 'stopped' | 'static' | 'building';
type Kind   = 'Web' | 'Bot' | 'API' | 'Static' | 'Mobile';

interface Platform {
  name: string;
  domain?: string;
  port?: number | string;
  pm2?: string;
  stack: string;
  kind: Kind;
  status: Status;
  note?: string;
}

const GROUPS: { title: string; color: string; platforms: Platform[] }[] = [
  {
    title: 'Codelude',
    color: '#eeeeee',
    platforms: [
      {
        name: 'Codelude Web',
        domain: 'codelude.com',
        port: 3004,
        pm2: 'codelude-web',
        stack: 'Next.js 16 · Outfit + DM Mono',
        kind: 'Web',
        status: 'live',
        note: 'Public company website — ventures, token, news, contact',
      },
      {
        name: 'Codelude HQ',
        domain: 'hq.codelude.com',
        port: 3005,
        pm2: 'hq-codelude',
        stack: 'Next.js 16 · Convex Auth (Google OAuth)',
        kind: 'Web',
        status: 'live',
        note: 'Internal company dashboard with Google sign-in',
      },
    ],
  },
  {
    title: 'Franchiseen',
    color: '#c8c8c8',
    platforms: [
      {
        name: 'Franchiseen',
        domain: 'franchiseen.com',
        stack: 'Next.js · Crossmint · Solana / Jupiter · Convex',
        kind: 'Web',
        status: 'building',
        note: 'AI Business Assistant — fractional ownership platform. Code on server, deployment in progress.',
      },
    ],
  },
  {
    title: 'HubCV',
    color: '#b5b5b5',
    platforms: [
      {
        name: 'HubCV Web',
        domain: 'hubcv.pro',
        stack: 'Next.js 16 · React 19 · Convex · Convex Auth · Tailwind 4',
        kind: 'Web',
        status: 'live',
        note: 'AI Career Assistant — skill-verified profiles, hubs, rooms and feed. 121 routes across marketing, platform and hub surfaces. Deployed on Vercel.',
      },
      {
        name: 'HubCV Backend',
        domain: 'savory-marmot-392.convex.site',
        stack: 'Convex · 72 tables · 70 function modules',
        kind: 'API',
        status: 'live',
        note: 'Reactive backend — auth, feed, rooms, scoring, enrolment, billing. Dev deployment jovial-anaconda-656.',
      },
      {
        name: 'HubCV Company',
        domain: 'hubcv.pro/company',
        stack: 'Next.js 16 · Convex — internal console',
        kind: 'Web',
        status: 'live',
        note: 'HubCV\'s own internal ops console — 45 modules (hubs, leads, verifications, resumes, payroll, tickets).',
      },
      {
        name: 'HubCV Mobile',
        domain: 'pro.hubcv.app',
        stack: 'Capacitor 8 · Android + iOS shells',
        kind: 'Mobile',
        status: 'building',
        note: 'Native wrappers with push notifications, haptics, network and preferences plugins. Android project scaffolded; not yet published to stores.',
      },
    ],
  },
  {
    title: 'Llife',
    color: '#a5a5a5',
    platforms: [
      {
        name: 'Llife',
        domain: 'llife.ai',
        stack: 'Next.js · Convex · LLM assistant · Ecosystem APIs',
        kind: 'Web',
        status: 'building',
        note: 'AI Life Assistant — five-domain daily tracker (Finances, Education, Earnings, Mind, Body). Pulls from the HubCV, Dextrip and Franchiseen APIs. In development.',
      },
    ],
  },
  {
    title: 'Roborns',
    color: '#dbdbdb',
    platforms: [
      {
        name: 'Roborns Web',
        domain: 'roborns.com',
        stack: 'Apache · Static / PHP',
        kind: 'Static',
        status: 'live',
        note: 'Public venture website — Roborns coastal AI and desalination',
      },
    ],
  },
  {
    title: 'Dextrip',
    color: '#adadad',
    platforms: [
      {
        name: 'Dextrip Web',
        domain: 'bot.dextrip.com',
        port: 3000,
        pm2: 'dextrip-web',
        stack: 'Next.js',
        kind: 'Web',
        status: 'live',
        note: 'Main Dextrip dashboard — strategies and account management',
      },
      {
        name: 'Dextrip TV',
        domain: 'tv.dextrip.com',
        port: 3002,
        pm2: 'dextrip-tv-dashboard',
        stack: 'Next.js',
        kind: 'Web',
        status: 'live',
        note: 'Live market TV dashboard — real-time charts and signals',
      },
      {
        name: 'Spot Dashboard',
        domain: 'spot.dextrip.com',
        port: 3003,
        pm2: 'spot-dashboard',
        stack: 'Next.js',
        kind: 'Web',
        status: 'live',
        note: 'Spot trading dashboard',
      },
      {
        name: 'Dextrip Multi-Bot',
        port: 8081,
        pm2: 'dextrip-multi-bot',
        stack: 'Node.js v0.40.3',
        kind: 'API',
        status: 'live',
        note: 'Core trading automation — multi-exchange execution engine',
      },
      {
        name: 'Strategy Bot',
        pm2: 'dextrip-bot-strategies',
        stack: 'Node.js v0.1.0',
        kind: 'Bot',
        status: 'live',
        note: 'Strategy evaluation and signal generation',
      },
      {
        name: 'TV Bot',
        port: 8787,
        pm2: 'dextrip-tv-bot',
        stack: 'Python 3',
        kind: 'Bot',
        status: 'live',
        note: 'Live feed processing for TV dashboard — webhook on /webhook/5m and /webhook/15m',
      },
      {
        name: 'TV Bot Live',
        pm2: 'dextrip-tv-bot-live',
        stack: 'Node.js v0.1.0',
        kind: 'Bot',
        status: 'live',
        note: 'Live signal stream — restored after server restart',
      },
      {
        name: 'Dextrip Client Portal',
        domain: 'client.dextrip.com',
        port: 3006,
        pm2: 'client-dextrip',
        stack: 'Next.js · Manrope · Geist Mono',
        kind: 'Web',
        status: 'live',
        note: 'Client-facing investment portal — track trades, deposits, and profits',
      },
      {
        name: 'Spot Bot',
        port: 8788,
        pm2: 'spot-bot',
        stack: 'Python 3',
        kind: 'Bot',
        status: 'live',
        note: 'Automated spot trade execution',
      },
      {
        name: 'Div14',
        domain: 'div14.sawabtech.com',
        stack: 'Apache · Static / PHP',
        kind: 'Static',
        status: 'live',
        note: 'Sawabtech Div14 property',
      },
      {
        name: 'PolyWorld',
        domain: 'polyworld.sawabtech.com',
        stack: 'Apache · Static / PHP',
        kind: 'Static',
        status: 'live',
        note: 'PolyWorld — Sawabtech platform',
      },
    ],
  },
];

const STATUS_COLOR: Record<Status, string> = {
  live:     '#dbdbdb',
  stopped:  '#9d9d9d',
  static:   '#b5b5b5',
  building: '#eeeeee',
};

const KIND_COLOR: Record<Kind, string> = {
  Web:    '#c8c8c8',
  Bot:    '#adadad',
  API:    '#eeeeee',
  Static: '#a5a5a5',
  Mobile: '#b5b5b5',
};

export default function PlatformPage() {
  const total   = GROUPS.flatMap(g => g.platforms).length;
  const live    = GROUPS.flatMap(g => g.platforms).filter(p => p.status === 'live').length;
  const stopped = GROUPS.flatMap(g => g.platforms).filter(p => p.status === 'stopped').length;

  return (
    <div>
      <h1 className="page-title">Platform</h1>
      <p className="page-sub">All platforms and services running on 64.227.160.224 — Apache + PM2 stack.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '2rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{total}</div>
          <div className="tasks-count-label">Total platforms</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: sc('#dbdbdb') }}>{live}</div>
          <div className="tasks-count-label">Live</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: sc('#9d9d9d') }}>{stopped}</div>
          <div className="tasks-count-label">Stopped</div>
        </div>
      </div>

      {GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: '2rem' }}>
          <div className="section-label" style={{ color: group.color }}>{group.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {group.platforms.map(p => (
              <div key={p.name} style={{
                background: 'var(--card-bg)', padding: '1.1rem 1.5rem',
                display: 'grid', gridTemplateColumns: '200px 140px 1fr auto',
                gap: '1.5rem', alignItems: 'center',
                borderLeft: `2px solid ${group.color}`,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{p.name}</div>
                  {p.domain && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{p.domain}</div>
                  )}
                  {p.pm2 && (
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', opacity: 0.6, marginTop: '0.1rem' }}>pm2: {p.pm2}</div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                  <span style={{
                    fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
                    textTransform: 'uppercase', padding: '0.15rem 0.5rem',
                    border: `1px solid ${scBorder(KIND_COLOR[p.kind])}`, color: sc(KIND_COLOR[p.kind]),
                    display: 'inline-block', alignSelf: 'flex-start',
                  }}>{p.kind}</span>
                  {p.port && (
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>:{p.port}</span>
                  )}
                </div>

                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '0.25rem' }}>{p.stack}</div>
                  {p.note && <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.6, lineHeight: 1.5 }}>{p.note}</div>}
                </div>

                <span style={{
                  fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
                  textTransform: 'uppercase', padding: '0.15rem 0.55rem',
                  border: `1px solid ${scBorder(STATUS_COLOR[p.status])}`, color: sc(STATUS_COLOR[p.status]),
                  whiteSpace: 'nowrap',
                }}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
