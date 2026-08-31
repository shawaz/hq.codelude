import { sc, scBorder } from '@/lib/status-colors';
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
      { name: 'Venture pages',         description: 'Individual deep-dive pages for Roborns, Franchiseen, HubCV, and Llife',                status: 'live' },
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
      { name: 'Team login',            description: 'Google OAuth via Convex Auth — restricted to @codelude.com accounts',                     status: 'live' },
      { name: 'Protected routes',      description: 'Middleware-level auth guard — all /dashboard/* routes require an active session',        status: 'live' },
      { name: 'Accordion sidebar',     description: '10-section collapsible sidebar — auto-opens to active page, single section at a time',   status: 'live' },
      { name: 'Overview dashboard',    description: 'Venture status cards, quick stats, and activity feed',                                   status: 'live' },
      { name: 'Tasks module',          description: '73 pre-loaded tasks across 5 ventures — filter by project and status',                   status: 'live' },
      { name: 'Projects module',       description: 'Per-venture progress bars with done / in-progress / todo task counts',                   status: 'live' },
      { name: 'Platform module',       description: 'Registry of all hosted platforms, ports, PM2 processes, and status',                     status: 'live' },
      { name: 'Features module',       description: 'Per-platform feature tracking with live / in-progress / planned status',                 status: 'live' },
      { name: 'Team module',           description: 'Team roster driven by Convex Auth — name, title, role, email',                          status: 'live' },
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
    domain: 'hubcv.pro',
    color: '#FAC775',
    features: [
      { name: 'Convex Auth + OTP',        description: 'Email OTP via Resend, plus a separate student credential/OTP path for under-18 accounts',        status: 'live' },
      { name: 'Two-step onboarding',      description: 'Profile basics (avatar, username, stage, lead source) then grouped skill multiselect',            status: 'live' },
      { name: 'Social feed',              description: 'Following / Recommended tabs, 6 post types (image, video, PDF, event, course, job), public or private', status: 'live' },
      { name: 'Post composer',            description: 'Single-page composer at /feed/new and /upload — media preview, on-canvas crop/rotate/brightness, skill tags', status: 'live' },
      { name: 'Hubs',                     description: 'Schools, colleges and businesses as claimable orgs — inline creation, logo upload, map location picker', status: 'live' },
      { name: 'Hub claiming',             description: '/hub/new lists every unclaimed hub as a filterable directory rather than a capped type-ahead',    status: 'live' },
      { name: 'Rooms',                    description: 'Per-posting chat with Activities / Users / Info panels, shared media, DMs, and member invites',   status: 'live' },
      { name: 'Room activities',          description: 'Tasks, tests and attendance logs — faculty enter per-member marks, results feed skill scores',    status: 'live' },
      { name: 'Skill scoring engine',     description: '5-tier engine folding approved tasks, test scores and attendance into a 0-100 skill level',       status: 'live' },
      { name: 'Career guidance reports',  description: 'Stage-aware structured assessment on the profile, rescaled to a real 0-100 range',                status: 'live' },
      { name: 'Explore map',              description: 'Leaflet map with clustering and viewport-scoped directory pins above zoom 11',                    status: 'live' },
      { name: 'Karnataka schools directory', description: '77,076 DISE schools geocoded to 4,670 distinct points via an India Post precision ladder',     status: 'live' },
      { name: 'Applications & following', description: 'LinkedIn-style application tracking and notification-style following feed, mobile and web',       status: 'live' },
      { name: 'Resume builder',           description: 'Structured resume creation and PDF export via react-pdf / jsPDF, with public showcase pages',     status: 'live' },
      { name: 'Family accounts',          description: 'Parent-managed child profiles — /family and /manage-child for guardian oversight',                status: 'live' },
      { name: 'Company console',          description: '45 internal ops modules at /company — hubs, leads, verifications, payroll, tickets, trading',     status: 'live' },
      { name: 'Marketing site',           description: 'Docs, blog, pricing, careers, for-schools / for-business, role and skill landing pages',          status: 'live' },
      { name: 'i18n',                     description: 'i18next + react-i18next translation layer wired across the platform surface',                    status: 'live' },
      { name: 'Referrals & affiliates',   description: 'Referral tracking with an affiliates marketing page',                                            status: 'live' },
      { name: 'AI credits',               description: 'Metered AI usage via OpenRouter / OpenAI with a per-account credit ledger',                       status: 'in-progress' },
      { name: 'Billing',                  description: 'Stripe and Razorpay paths for individual and institutional subscriptions',                        status: 'in-progress' },
      { name: 'Verification workflow',    description: 'Manager and faculty verification of claimed skills and completions',                              status: 'in-progress' },
      { name: 'Mobile apps',              description: 'Capacitor 8 Android and iOS shells with push notifications — not yet in the stores',              status: 'in-progress' },
      { name: 'UAE + ESCO datasets',      description: 'UAE institution and ESCO occupation import scripts — seeded but not surfaced in the UI',          status: 'in-progress' },
      { name: 'National rollout',         description: 'Extend the 77k Karnataka directory to all 1.7M Indian schools plus colleges and businesses',      status: 'planned' },
      { name: 'Recruiter portal',         description: 'Dedicated recruiter search over verified profiles with pipeline management',                      status: 'planned' },
    ],
  },
  {
    platform: 'Llife',
    domain: 'llife.ai',
    color: '#85B7EB',
    features: [
      { name: 'Five-domain model',         description: 'Finances, Education, Earnings, Mind and Body — each mapped to a daily time block. Spec complete.', status: 'live' },
      { name: 'Daily tracker board',       description: 'Time-blocked board (6\u20138AM, 8\u20139AM, 9AM\u20134PM, 5PM, weekend) with per-item status and streaks', status: 'in-progress' },
      { name: 'AI personal assistant core',description: 'Routine learning algorithm — home learns behaviour and acts proactively before being asked',    status: 'planned' },
      { name: 'HubCV Education API',        description: 'College, School, Certificates, Internship and Skills pulled from the HubCV profile graph',    status: 'in-progress' },
      { name: 'Dextrip Earnings API',       description: 'Job, Crypto and Stocks positions with live P&L streamed from Dextrip',                        status: 'planned' },
      { name: 'Franchiseen Earnings API',   description: 'Franchise ownership stakes, payout schedule and AUM per investor',                            status: 'planned' },
      { name: 'Finances domain',            description: 'Net Worth, Credits, Investments, Assets and Charity via RBI Account Aggregator consent rails', status: 'planned' },
      { name: 'Mind + Body domains',        description: 'Family, Exercise, Diet, Prayers, Social and Memories \u2014 tracked routines with health sync',    status: 'planned' },
      { name: 'Mobile app',                 description: 'iOS and Android app for the daily board, reviews and assistant nudges',                       status: 'planned' },
      { name: 'Property developer API',     description: 'B2B licence API for pre-installation in new residential builds — per-unit revenue model',    status: 'planned' },
    ],
  },
];

const STATUS_STYLES: Record<FeatureStatus, { color: string; label: string }> = {
  'live':        { color: '#5DCAA5', label: 'Live' },
  'in-progress': { color: '#c8f53a', label: 'In Progress' },
  'planned':     { color: 'var(--muted)', label: 'Planned' },
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
          <div className="tasks-count-num" style={{ color: sc('#5DCAA5') }}>{live}</div>
          <div className="tasks-count-label">Live</div>
        </div>
        <div className="tasks-count-cell">
          <div className="tasks-count-num" style={{ color: sc('#c8f53a') }}>{inProgress}</div>
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
                      <span className="status-badge" style={{ color: sc(s.color), borderColor: `${scBorder(s.color)}` }}>
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
