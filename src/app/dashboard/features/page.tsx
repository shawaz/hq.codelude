type FeatureStatus = 'live' | 'in-progress' | 'planned';

interface Feature {
  name: string;
  description: string;
  status: FeatureStatus;
}

interface PlatformFeatures {
  platform: string;
  domain?: string;
  color: string;
  features: Feature[];
}

const DATA: PlatformFeatures[] = [
  {
    platform: 'Codelude Web',
    domain: 'codelude.com',
    color: '#c8f53a',
    features: [
      { name: 'Venture pages',         description: 'Individual deep-dive pages for Roborns, Franchiseen, HubCV, and Cuestay',                status: 'live' },
      { name: 'Token / thesis page',   description: 'Dubai HoldCo tokenization structure and investment thesis',                               status: 'live' },
      { name: 'About page',            description: 'Vision, operating principles, and venture strip',                                         status: 'live' },
      { name: 'News page',             description: 'Chronological company updates and milestone announcements',                               status: 'live' },
      { name: 'Join Us / Contact',     description: 'Contact form with interest selector, direct channels, and investment memo request',       status: 'live' },
      { name: 'Outfit brand font',     description: 'Switched from Syne to Outfit — lighter, more open at large sizes',                       status: 'live' },
      { name: 'Portfolio ticker bar',  description: 'Scrolling ticker on homepage linking to all four ventures',                              status: 'live' },
      { name: 'Responsive layout',     description: 'Mobile-optimised nav with hamburger menu and stacked grids',                             status: 'live' },
      { name: 'HTTPS + auto-renew',    description: 'Let\'s Encrypt SSL via Certbot with automatic renewal scheduled',                        status: 'live' },
      { name: 'Contact form backend',  description: 'Wire up form submission to email or CRM',                                                status: 'planned' },
      { name: 'Blog / long-form',      description: 'Long-form writing section for studio thinking and venture updates',                      status: 'planned' },
    ],
  },
  {
    platform: 'Codelude HQ',
    domain: 'hq.codelude.com',
    color: '#c8f53a',
    features: [
      { name: 'Team login',            description: 'iron-session cookie auth — credentials managed via TEAM_USERS env var',                  status: 'live' },
      { name: 'Protected routes',      description: 'Middleware-level auth guard — all /dashboard/* routes require active session',           status: 'live' },
      { name: 'Accordion sidebar',     description: '10-section collapsible sidebar — auto-opens to active page, single section at a time',   status: 'live' },
      { name: 'Overview dashboard',    description: 'Venture status cards, quick stats, and activity feed',                                   status: 'live' },
      { name: 'Tasks module',          description: '73 pre-loaded tasks across 5 ventures — filter by project and status',                   status: 'live' },
      { name: 'Projects module',       description: 'Per-venture progress bars with done / in-progress / todo task counts',                   status: 'live' },
      { name: 'Platform module',       description: 'Registry of all hosted platforms, ports, PM2 processes, and status',                     status: 'live' },
      { name: 'Features module',       description: 'Per-platform feature tracking with live / in-progress / planned status',                 status: 'live' },
      { name: 'Team module',           description: 'Team roster driven by TEAM_USERS env var — name, title, role, email',                   status: 'live' },
      { name: 'News module',           description: 'Internal chronological news and update log',                                             status: 'live' },
      { name: 'Ventures module',       description: 'Detailed per-venture view with milestones and tags',                                     status: 'live' },
      { name: 'Placeholder modules',   description: '40+ stub pages with descriptions across all sidebar sections',                          status: 'live' },
      { name: 'Bug AI agent',          description: 'Automated agent to scan, report, and fix bugs across all platforms',                    status: 'planned' },
      { name: 'Task CRUD',             description: 'Create, edit, assign, and close tasks from the UI — currently read-only',               status: 'planned' },
      { name: 'Multi-user roles',      description: 'Role-based access — admins vs members with permission scoping',                         status: 'planned' },
      { name: 'Notifications',         description: 'In-app and email notifications for task assignments and status changes',                 status: 'planned' },
    ],
  },
  {
    platform: 'Dextrip Web',
    domain: 'bot.dextrip.com',
    color: '#F0997B',
    features: [
      { name: 'Strategy dashboard',    description: 'View and manage active trading strategies across exchanges',                             status: 'live' },
      { name: 'Account management',    description: 'Exchange API key management and account overview',                                       status: 'live' },
      { name: 'Live P&L tracking',     description: 'Real-time profit and loss across all active strategies',                                status: 'live' },
      { name: 'Multi-exchange support',description: 'Supports multiple exchanges via the dextrip-multi-bot engine',                          status: 'live' },
      { name: 'Webhook integration',   description: 'External signal ingestion via /webhook/5m and /webhook/15m endpoints',                  status: 'live' },
      { name: 'Strategy marketplace',  description: 'Shareable strategy library for team and eventually public users',                       status: 'planned' },
      { name: 'Public beta',           description: 'Open registration and onboarding for paying users',                                     status: 'planned' },
    ],
  },
  {
    platform: 'Dextrip TV',
    domain: 'tv.dextrip.com',
    color: '#F0997B',
    features: [
      { name: 'Live market dashboard', description: 'Real-time price charts and market data display optimised for large screens',            status: 'live' },
      { name: '5m / 15m signal feed',  description: 'Automated signal updates pushed via TV bot Python service on port 8787',               status: 'live' },
      { name: 'Health endpoint',       description: '/health check endpoint for monitoring and uptime tracking',                             status: 'live' },
    ],
  },
  {
    platform: 'Spot Dashboard',
    domain: 'spot.dextrip.com',
    color: '#F0997B',
    features: [
      { name: 'Spot trade dashboard',  description: 'Real-time spot trading interface backed by spot-bot Python service on port 8788',       status: 'live' },
      { name: 'Automated execution',   description: 'Spot bot handles trade execution automatically based on configured strategy',           status: 'live' },
    ],
  },
  {
    platform: 'Roborns',
    domain: 'roborns.com',
    color: '#5DCAA5',
    features: [
      { name: 'Public venture page',   description: 'Company website explaining the coastal AI + desalination concept',                      status: 'live' },
      { name: 'Investor section',      description: 'Information for potential investors and strategic partners',                            status: 'in-progress' },
      { name: 'Engineering portal',    description: 'Technical documentation and partner collaboration space',                               status: 'planned' },
    ],
  },
  {
    platform: 'Dextrip Client Portal',
    domain: 'client.dextrip.com',
    color: '#F0997B',
    features: [
      { name: 'Client dashboard',      description: 'Investor-facing portal to manage Dextrip investment — track trades, deposits, and profits', status: 'live' },
      { name: 'Trade history',         description: 'Full trade log with P&L per trade and aggregate performance',                            status: 'live' },
      { name: 'Deposit / withdrawal',  description: 'Capital management flows for client accounts',                                          status: 'live' },
      { name: 'Authentication',        description: 'Secure client login and session management',                                            status: 'live' },
      { name: 'Portfolio analytics',   description: 'Performance charts and ROI tracking across strategies',                                 status: 'in-progress' },
    ],
  },
  {
    platform: 'Franchiseen',
    domain: 'franchiseen.com',
    color: '#7F77DD',
    features: [
      { name: 'Fractional ownership engine', description: 'Core platform for fractional franchise investment — built with Crossmint and Solana', status: 'in-progress' },
      { name: 'Jupiter / Solana integration',description: 'On-chain settlement via Jupiter aggregator on Solana for token-based ownership',  status: 'in-progress' },
      { name: 'Investor dashboard',          description: 'Portfolio view for retail investors — holdings, payouts, performance',            status: 'in-progress' },
      { name: 'Daily payout system',         description: 'Automated daily revenue distribution to fractional owners',                      status: 'planned' },
      { name: 'Franchise operator portal',   description: 'Onboarding and management interface for franchise brand partners',               status: 'planned' },
      { name: 'KYC / AML',                   description: 'Identity verification and compliance for investor onboarding',                   status: 'planned' },
    ],
  },
  {
    platform: 'HubCV',
    domain: 'hubcv.com',
    color: '#FAC775',
    features: [
      { name: 'AI matching engine',     description: 'Anthropic SDK-powered candidate-to-opportunity matching with skill graph analysis',     status: 'in-progress' },
      { name: 'Authentication',         description: 'NextAuth-based login with multiple providers for professionals and recruiters',         status: 'in-progress' },
      { name: 'PostgreSQL + Drizzle ORM',description: 'Relational database layer for profiles, matches, verifications, and job data',        status: 'in-progress' },
      { name: 'Dynamic profile system', description: 'AI-enriched professional profiles that update with real skill progression',           status: 'in-progress' },
      { name: 'Recruiter portal',        description: 'Dashboard for recruiters to search verified profiles and manage pipelines',           status: 'planned' },
      { name: 'Human verification',      description: 'Domain-expert assessors validate skills — pay-per-assessment model',                 status: 'planned' },
      { name: 'Premium billing',         description: 'Subscription paywall for premium professional features and recruiter seats',         status: 'planned' },
    ],
  },
  {
    platform: 'Cuestay',
    domain: 'cuestay.com',
    color: '#85B7EB',
    features: [
      { name: 'Protocol specification',    description: 'Home automation protocol spec — Matter-native, AI intelligence layer. Internal doc complete.', status: 'live' },
      { name: 'Matter protocol integration',description: 'Cross-ecosystem device compatibility — Apple HomeKit, Google Home, Amazon Alexa via Matter 1.3+', status: 'in-progress' },
      { name: 'AI personal assistant core',description: 'Routine learning algorithm — home learns behaviour and acts proactively before being asked',    status: 'planned' },
      { name: 'Smart home hub',             description: 'Cuestay Hub hardware — ODM manufacturing partner in negotiation. Matter-certified device.',    status: 'planned' },
      { name: 'Mobile app',                 description: 'iOS and Android app for home management, routine setup, and ambient intelligence controls',   status: 'planned' },
      { name: 'IoT device management',      description: 'Unified device registry and control layer across all connected home devices',                 status: 'planned' },
      { name: 'Property developer API',     description: 'B2B licence API for pre-installation in new residential builds — per-unit revenue model',    status: 'planned' },
    ],
  },
];

const STATUS_STYLES: Record<FeatureStatus, { color: string; label: string }> = {
  'live':        { color: '#5DCAA5', label: 'Live' },
  'in-progress': { color: '#c8f53a', label: 'In Progress' },
  'planned':     { color: '#7a7870', label: 'Planned' },
};

export default function FeaturesPage() {
  const all         = DATA.flatMap(d => d.features);
  const live        = all.filter(f => f.status === 'live').length;
  const inProgress  = all.filter(f => f.status === 'in-progress').length;
  const planned     = all.filter(f => f.status === 'planned').length;

  return (
    <div>
      <h1 className="page-title">Features</h1>
      <p className="page-sub">Feature inventory across all platforms — what's live, what's being built, and what's planned.</p>

      <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '2rem' }}>
        <div className="tasks-count-cell">
          <div className="tasks-count-num">{all.length}</div>
          <div className="tasks-count-label">Total features</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#5DCAA5' }}>{live}</div>
          <div className="tasks-count-label">Live</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: '#c8f53a' }}>{inProgress}</div>
          <div className="tasks-count-label">In Progress</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: 'var(--muted)' }}>{planned}</div>
          <div className="tasks-count-label">Planned</div>
        </div>
      </div>

      {DATA.map(d => (
        <div key={d.platform} style={{ marginBottom: '2rem' }}>
          <div className="section-label" style={{ color: d.color }}>
            {d.platform}{d.domain ? ` — ${d.domain}` : ''}
          </div>
          <table className="tasks-table">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Feature</th>
                <th>Description</th>
                <th style={{ width: '110px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {d.features.map(f => {
                const s = STATUS_STYLES[f.status];
                return (
                  <tr key={f.name}>
                    <td style={{ fontWeight: 600, fontSize: '0.78rem' }}>{f.name}</td>
                    <td><span className="category-label" style={{ fontSize: '0.7rem' }}>{f.description}</span></td>
                    <td>
                      <span className="status-badge" style={{ color: s.color, borderColor: `${s.color}40` }}>
                        {s.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
