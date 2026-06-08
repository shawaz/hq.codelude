import Link from 'next/link';

type Status = 'live' | 'stopped' | 'static' | 'building';
type Kind   = 'Web' | 'Bot' | 'API' | 'Static';

interface Platform {
  name: string;
  domain?: string;
  port?: number | string;
  pm2?: string;
  stack: string;
  kind: Kind;
  status: Status;
  note?: string;
  featuresId?: string;
}

const GROUPS: { title: string; color: string; platforms: Platform[] }[] = [
  {
    title: 'Codelude',
    color: '#c8f53a',
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
        featuresId: 'codelude-web',
      },
      {
        name: 'Codelude HQ',
        domain: 'hq.codelude.com',
        port: 3005,
        pm2: 'hq-codelude',
        stack: 'Next.js 16 · iron-session',
        kind: 'Web',
        status: 'live',
        note: 'Internal company dashboard with team login',
        featuresId: 'codelude-hq',
      },
    ],
  },
  {
    title: 'Franchiseen',
    color: '#7F77DD',
    platforms: [
      {
        name: 'Franchiseen',
        domain: 'franchiseen.com',
        stack: 'Next.js · Crossmint · Solana / Jupiter · Convex',
        kind: 'Web',
        status: 'building',
        note: 'Franchise Finance OS — fractional ownership platform. Code on server, deployment in progress.',
        featuresId: 'franchiseen',
      },
    ],
  },
  {
    title: 'HubCV',
    color: '#FAC775',
    platforms: [
      {
        name: 'HubCV',
        domain: 'hubcv.com',
        stack: 'Next.js · NextAuth · Drizzle ORM · Anthropic SDK · PostgreSQL',
        kind: 'Web',
        status: 'building',
        note: 'AI Career Intelligence — dynamic verified profiles. Code on server, deployment in progress.',
        featuresId: 'hubcv',
      },
    ],
  },
  {
    title: 'Cuestay',
    color: '#85B7EB',
    platforms: [
      {
        name: 'Cuestay',
        domain: 'cuestay.com',
        stack: 'Next.js · Matter Protocol · AI / IoT',
        kind: 'Web',
        status: 'building',
        note: 'Home AI Automation — ambient intelligence layer. Platform in development.',
        featuresId: 'cuestay',
      },
    ],
  },
  {
    title: 'Roborns',
    color: '#5DCAA5',
    platforms: [
      {
        name: 'Roborns Web',
        domain: 'roborns.com',
        stack: 'Apache · Static / PHP',
        kind: 'Static',
        status: 'live',
        note: 'Public venture website — Roborns coastal AI and desalination',
        featuresId: 'roborns',
      },
    ],
  },
  {
    title: 'Dextrip',
    color: '#F0997B',
    platforms: [
      {
        name: 'Dextrip Marketplace',
        domain: 'dextrip.com',
        port: 3007,
        pm2: 'dextrip-com',
        stack: 'Next.js 16 · SQLite · Drizzle ORM',
        kind: 'Web',
        status: 'live',
        note: 'Public strategy marketplace — browse, publish, and subscribe to trading strategies',
        featuresId: 'dextrip-marketplace',
      },
      {
        name: 'Dextrip Bot',
        domain: 'bot.dextrip.com',
        port: 3000,
        pm2: 'dextrip-web',
        stack: 'Next.js',
        kind: 'Web',
        status: 'live',
        note: 'Investment platform — strategy dashboard, P&L tracking, and investor strategy cards',
        featuresId: 'dextrip-bot',
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
    ],
  },
];

const STATUS_COLOR: Record<Status, string> = {
  live:     '#5DCAA5',
  stopped:  '#ff8080',
  static:   '#FAC775',
  building: '#c8f53a',
};

const KIND_COLOR: Record<Kind, string> = {
  Web:    '#7F77DD',
  Bot:    '#F0997B',
  API:    '#c8f53a',
  Static: '#85B7EB',
};

function PlatformRow({ p, color }: { p: Platform; color: string }) {
  const inner = (
    <div style={{
      background: 'var(--card-bg)', padding: '1.1rem 1.5rem',
      display: 'grid', gridTemplateColumns: '200px 140px 1fr auto',
      gap: '1.5rem', alignItems: 'center',
      borderLeft: `2px solid ${color}`,
      transition: p.featuresId ? 'background 0.15s' : undefined,
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
          border: `1px solid ${KIND_COLOR[p.kind]}40`, color: KIND_COLOR[p.kind],
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

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', padding: '0.15rem 0.55rem',
          border: `1px solid ${STATUS_COLOR[p.status]}40`, color: STATUS_COLOR[p.status],
          whiteSpace: 'nowrap',
        }}>{p.status}</span>
        {p.featuresId && (
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: color, opacity: 0.7,
            whiteSpace: 'nowrap',
          }}>Features →</span>
        )}
      </div>
    </div>
  );

  if (p.featuresId) {
    return (
      <Link key={p.name} href={`/dashboard/features#${p.featuresId}`} style={{ textDecoration: 'none', display: 'block' }}>
        {inner}
      </Link>
    );
  }
  return <div key={p.name}>{inner}</div>;
}

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
          <div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{live}</div>
          <div className="tasks-count-label">Live</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#ff8080' }}>{stopped}</div>
          <div className="tasks-count-label">Stopped</div>
        </div>
      </div>

      {GROUPS.map(group => (
        <div key={group.title} style={{ marginBottom: '2rem' }}>
          <div className="section-label" style={{ color: group.color }}>{group.title}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {group.platforms.map(p => (
              <PlatformRow key={p.name} p={p} color={group.color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
