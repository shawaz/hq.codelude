// ─── EVENTS ──────────────────────────────────────────────────────────────────

export type EventType     = 'Meeting' | 'Call' | 'Site Visit' | 'Legal' | 'Milestone' | 'Deadline' | 'Launch' | 'Travel';
export type EventStatus   = 'upcoming' | 'today' | 'completed' | 'cancelled';

export interface CalEvent {
  id:       string;
  date:     string;
  time?:    string;
  title:    string;
  type:     EventType;
  venture:  string;
  location: string;
  status:   EventStatus;
  notes:    string;
}

export const EVENTS: CalEvent[] = [
  { id: 'E04', date: '2026-05-26', time: '09:00', title: 'LLIFE weekly check-in',                          type: 'Meeting',   venture: 'LLIFE',    location: 'Internal',              status: 'upcoming',  notes: 'Review both ventures — status, blockers, one action per project this week.' },
  { id: 'E05', date: '2026-05-28', time: '15:00', title: 'Dubai HoldCo legal counsel intro call',             type: 'Legal',     venture: 'LLIFE',    location: 'Zoom',                  status: 'upcoming',  notes: 'Intro call with DIFC-registered law firm. Scope: HoldCo incorporation + token structure.' },
  { id: 'E10', date: '2026-06-15', time: '09:00', title: 'Llife \u2194 HubCV API integration review',            type: 'Call',      venture: 'Llife',     location: 'Zoom',                  status: 'upcoming',  notes: 'Agree the Education domain read scope, auth model and refresh interval with the HubCV side.' },
  { id: 'E13', date: '2026-07-01', time: '',       title: 'Dubai trip — HoldCo incorporation',                type: 'Travel',    venture: 'LLIFE',    location: 'Dubai, UAE',            status: 'upcoming',  notes: 'In-person meetings with DIFC legal counsel. Target: HoldCo entity incorporated by end of trip.' },
  { id: 'E14', date: '2026-07-03', time: '10:00', title: 'DIFC legal — HoldCo documents review',             type: 'Legal',     venture: 'LLIFE',    location: 'Dubai, UAE',            status: 'upcoming',  notes: 'Review and sign HoldCo incorporation documents. Open corporate bank account.' },
  { id: 'E20', date: '2026-05-20', time: '10:00', title: 'llife.app launch',                               type: 'Launch',    venture: 'LLIFE',    location: 'Live',                  status: 'completed', notes: 'Public company website launched with SSL, ventures, news, and contact pages.' },
];

// ─── TRAVELS ─────────────────────────────────────────────────────────────────

export type TripStatus = 'planned' | 'booked' | 'in-progress' | 'completed' | 'cancelled';
export type TripPurpose = 'Business' | 'Investor' | 'Legal' | 'Engineering' | 'Partnership' | 'Site Visit';

export interface TripExpense {
  category: string;
  budgeted: number;
  actual:   number;
  currency: string;
}

export interface Trip {
  id:          string;
  destination: string;
  country:     string;
  traveler:    string;
  departure:   string;
  return:      string;
  venture:     string;
  purpose:     TripPurpose;
  status:      TripStatus;
  objectives:  string[];
  expenses:    TripExpense[];
  notes:       string;
}

export const TRIPS: Trip[] = [
  {
    id: 'T01',
    destination: 'Dubai, UAE',
    country: 'UAE',
    traveler: 'Shawaz',
    departure: '2026-07-01',
    return: '2026-07-05',
    venture: 'LLIFE',
    purpose: 'Legal',
    status: 'planned',
    objectives: [
      'Meet DIFC-registered legal counsel — finalise HoldCo incorporation documents',
      'Sign corporate bank account application (Emirates NBD / Mashreq)',
      'Review and sign token structure term sheet with legal counsel',
      'Explore office space options for HoldCo registered address',
    ],
    expenses: [
      { category: 'Flights (MNG → DXB → MNG)', budgeted: 600,  actual: 0,   currency: 'USD' },
      { category: 'Hotel (4 nights)',           budgeted: 800,  actual: 0,   currency: 'USD' },
      { category: 'Local transport',            budgeted: 150,  actual: 0,   currency: 'USD' },
      { category: 'Legal meeting fees',         budgeted: 500,  actual: 0,   currency: 'USD' },
      { category: 'Meals & incidentals',        budgeted: 200,  actual: 0,   currency: 'USD' },
    ],
    notes: 'Book early — July is peak season in Dubai. Aim for morning meetings with legal counsel.',
  },
];

// ─── FILES ────────────────────────────────────────────────────────────────────

export type FileCategory = 'Financial Model' | 'Pitch Deck' | 'Legal' | 'Brand' | 'Technical' | 'Research' | 'Internal';
export type FileFormat   = 'HTML' | 'PDF' | 'XLSX' | 'PPTX' | 'DOCX' | 'Figma' | 'MD' | 'PNG/SVG';
export type FileStatus   = 'final' | 'draft' | 'review' | 'archived';

export interface FileEntry {
  id:        string;
  name:      string;
  venture:   string;
  category:  FileCategory;
  format:    FileFormat;
  version:   string;
  date:      string;
  location:  string;
  status:    FileStatus;
  notes:     string;
}

export const FILES: FileEntry[] = [
  { id: 'F05', name: 'Llife Subscription P&L',           venture: 'Llife',     category: 'Financial Model', format: 'XLSX',   version: 'v0.4', date: '2026-04-10', location: 'Google Drive / Finance / Llife',    status: 'draft',   notes: 'Subscription cohort model, inference cost per user, retention and churn sensitivity.' },
  { id: 'F07', name: 'LLIFE Studio Overview Deck',      venture: 'LLIFE',    category: 'Pitch Deck',      format: 'PPTX',   version: 'v1.0', date: '2026-05-20', location: 'Google Drive / Decks / LLIFE',     status: 'final',   notes: 'Studio overview — all five ventures, HoldCo structure, token thesis.' },
  // Legal
  { id: 'F10', name: 'LLIFE HoldCo — Term Sheet Draft', venture: 'LLIFE',    category: 'Legal',           format: 'DOCX',   version: 'v0.3', date: '2026-05-15', location: 'Google Drive / Legal / HoldCo',       status: 'draft',   notes: 'Token structure term sheet. Pending DIFC counsel review.' },
  { id: 'F12', name: 'NDA Template — General',             venture: 'LLIFE',    category: 'Legal',           format: 'DOCX',   version: 'v1.0', date: '2026-04-01', location: 'Google Drive / Legal / Templates',    status: 'final',   notes: 'Standard bilateral NDA for use with all partners, engineers, and investors.' },
  // Brand
  { id: 'F14', name: 'LLIFE Brand Guidelines',         venture: 'LLIFE',    category: 'Brand',           format: 'Figma',  version: 'v1.0', date: '2026-05-20', location: 'Figma / LLIFE / Brand',            status: 'final',   notes: 'Outfit typeface, accent #eeeeee, dark-first palette. Logo, typography, colour.' },
  // Technical
  { id: 'F16', name: 'Llife Domain Specification',      venture: 'Llife',     category: 'Technical',       format: 'MD',     version: 'v1.0', date: '2026-04-28', location: 'GitHub / llife / docs / domains',   status: 'final',   notes: 'Five-domain model, time-block schema, and the ecosystem API contracts for Education and Earnings.' },
  { id: 'F17', name: 'HQ Dashboard (hq.llife.app)',    venture: 'LLIFE',    category: 'Internal',        format: 'HTML',   version: 'live', date: '2026-05-20', location: 'https://hq.llife.app',             status: 'final',   notes: 'Internal company OS — this system.' },
];

// ─── HANDBOOK ─────────────────────────────────────────────────────────────────

export interface HandbookArticle {
  title:   string;
  content: string;
}

export interface HandbookSection {
  title:    string;
  icon:     string;
  articles: HandbookArticle[];
}

export const HANDBOOK: HandbookSection[] = [
  {
    title: 'Culture',
    icon: '◆',
    articles: [
      {
        title: 'What LLIFE is',
        content: `LLIFE is a deep-tech venture studio. We build infrastructure-layer companies simultaneously — not sequentially. We are not a startup, not a fund, and not a consultancy. We are a builder.\n\nEach venture targets a fundamental gap in physical, financial, digital, or home infrastructure. We run them in parallel because the compounding effects between them — capital, data, distribution — are more valuable than going deep on one alone.\n\nThe HoldCo structure means all ventures share a single cap table at the top. This is not a portfolio of independent bets — it is a system.`,
      },
      {
        title: 'The operating principles',
        content: `01. Pilot before scale.\nAlways push toward the smallest thing that proves the idea works. Every venture starts with a single pilot that validates the core assumption. Comprehensiveness is the enemy of momentum.\n\n02. Time is the only non-renewable resource.\nEvery decision is filtered through this lens. Slow decisions and vague priorities are treated as capital destruction — because that is what they are.\n\n03. One action per project per day.\nClarity over comprehensiveness. A single meaningful action on each front beats scattered effort across all five. Each day's priority is explicit and non-negotiable.\n\n04. Honesty over comfort.\nIf something is wrong with a venture, a team, or a strategy — it gets said. Partners, investors, and collaborators always get the unfiltered picture. No sugarcoating. No delay.`,
      },
      {
        title: 'How we make decisions',
        content: `Decisions at LLIFE follow a simple rule: the person closest to the information makes the call.\n\nFor decisions affecting a single venture: the venture lead decides, informs the founder.\nFor decisions affecting the HoldCo, token structure, or capital: founder decides.\nFor decisions affecting two or more ventures: brief sync call, decide within 24 hours.\n\nNo decision should stay open longer than 72 hours. If it does, it means we lack information — go get the information, not consensus.\n\nWe document decisions in the Activity log. Not to create bureaucracy, but because decisions made in WhatsApp threads tend to get re-litigated. Write it down once.`,
      },
    ],
  },
  {
    title: 'How We Work',
    icon: '◈',
    articles: [
      {
        title: 'Daily rhythm',
        content: `There is no fixed 9-to-5. There is a fixed output expectation.\n\nEach day:\n— One meaningful action per active venture (minimum)\n— Review HQ dashboard — tasks, activity, any blockers\n— Respond to partner / investor messages within same business day\n\nEach week:\n— Monday: Set the week's priority per venture\n— Friday: Update task statuses in HQ, log completed activities\n— Weekly check-in meeting (see Events)\n\nEach month:\n— Update financial model actuals vs budget\n— Review milestones progress in Plan\n— Update investor round status`,
      },
      {
        title: 'Project management',
        content: `We use HQ (this system) for all project tracking. No other project management tool.\n\nTasks: Created in HQ → Tasks. Status updated as work progresses.\nMilestones: Tracked in HQ → Plan → Business Plan tab per venture.\nActivity: Key decisions and events logged in HQ → Activity.\nFiles: Referenced in HQ → Files with storage locations.\n\nIf something isn't in HQ, it doesn't exist as a commitment. WhatsApp and email are for conversation — HQ is for decisions and work.`,
      },
      {
        title: 'Tools we use',
        content: `Communication:\n— WhatsApp / Telegram: Fast internal decisions and updates\n— Email: External partners, investors, legal\n— Zoom / Google Meet: Video calls\n\nWork:\n— HQ (hq.llife.app): Company OS — tasks, plans, finances, handbook\n— Google Drive: Documents, decks, models\n— GitHub: All code repositories\n— Figma: Design and brand assets\n\nCode & infrastructure:\n— All platforms on 64.227.160.224 (CentOS 9, Apache + PM2)\n— Next.js for all web applications\n— Deployments via rsync + PM2 restart\n\nFinance:\n— All financial models in HQ → Financial Model\n— Budgets tracked in HQ → Finance → Budget`,
      },
    ],
  },
  {
    title: 'Communication',
    icon: '◉',
    articles: [
      {
        title: 'Response time norms',
        content: `WhatsApp / Telegram:\n— Team members: respond within 2 hours during working hours\n— Urgent (marked ⚡): respond within 30 minutes\n\nEmail:\n— Partners and investors: respond within 4 hours\n— Legal and compliance: same business day\n— General: within 24 hours\n\nInvestor updates:\n— Monthly: brief email update on all ventures (1 paragraph each)\n— Milestone: notify within 24 hours of a major milestone hit or missed\n\nNever leave an investor message unread for more than 24 hours. Even a "received, will follow up by [date]" response is better than silence.`,
      },
      {
        title: 'Meeting norms',
        content: `Every meeting must have:\n— A clear purpose stated before it starts\n— A decision or action item as output (not just a discussion)\n— A written record in HQ → Activity within 24 hours\n\nMeeting types:\n— Weekly check-in: 30 minutes max. Status per venture, blockers, week priorities.\n— Partner call: Send agenda 24 hours before. Follow up with notes same day.\n— Investor meeting: Prepare deck or one-pager in advance. Send materials before call.\n\nCancellation: Cancel with at least 4 hours notice. Reschedule in the same message.`,
      },
      {
        title: 'External communication',
        content: `When communicating externally (investors, partners, media) on behalf of LLIFE:\n\n— Always use a LLIFE email address (X@llife.app)\n— Do not share financial projections without an NDA in place\n— Do not confirm funding rounds or valuations without founder approval\n— All press / media enquiries go to the founder before responding\n— Any partnership that involves IP or exclusivity: consult legal before committing`,
      },
    ],
  },
  {
    title: 'Finance',
    icon: '◇',
    articles: [
      {
        title: 'Expense policy',
        content: `All expenses must be:\n1. Pre-approved for amounts above $200 USD\n2. Logged in HQ → Finance → Payee or Invoice within 3 business days\n3. Supported by a receipt (photo is fine for small amounts)\n\nCategories:\n— Infrastructure and SaaS: automatically approved if in budget\n— Travel: pre-approved per trip (see Travel policy)\n— Legal and professional services: founder approval required\n— One-time capex above $1,000: founder approval required\n\nNo petty cash. All payments via company card or bank transfer — never personal accounts without prior approval and same-day reimbursement.`,
      },
      {
        title: 'Invoicing',
        content: `Outgoing invoices:\n— Use the HQ → Finance → Invoice module to log all invoices\n— Invoice numbering: INV-[three digit sequence] (e.g. INV-006)\n— Payment terms: net 7 days for standard, net 30 for enterprise\n— Currency: USD for international, INR for India-only, AED for UAE\n\nIncoming invoices (from vendors):\n— Log in HQ → Finance → Payee\n— Approve within 3 business days\n— Pay within stated payment terms\n\nNanotrade subscription revenue: tracked separately in Nanotrade P&L. Log monthly totals in HQ.`,
      },
      {
        title: 'Budget discipline',
        content: `Each venture has a monthly operating budget in HQ → Finance → Budget.\n\nRules:\n— Do not exceed the monthly budget without prior approval\n— If a line is at 80%+ of budget and the month is not over, flag it immediately\n— Budget overruns above 20% require a written explanation in HQ → Activity\n— Unspent budget does not roll forward — it resets monthly\n\nCurrently, most venture budgets are "not started" — meaning we have headroom. As ventures activate (engineering, legal, KYC), budgets become real. Track them from day one.`,
      },
    ],
  },
  {
    title: 'Travel',
    icon: '◎',
    articles: [
      {
        title: 'Travel approval process',
        content: `All business travel requires:\n1. A trip logged in HQ → Travels with objectives listed\n2. Budget attached before booking\n3. Founder approval for trips above $1,000 total cost\n\nBook in this order:\n1. Confirm meetings and objectives are locked in\n2. Book accommodation (prefer Airbnb or business hotels)\n3. Book flights (economy for under 4 hours, economy-plus for above)\n4. Log all bookings in the trip's expense section\n\nDo not book travel for exploratory conversations — have the first call remotely. Book travel only when in-person is necessary (signing, site visits, investor meetings).`,
      },
      {
        title: 'Expense reimbursement',
        content: `Submit travel expenses within 5 business days of returning.\n\nWhat is covered:\n— Flights and ground transport (economy class)\n— Hotel (up to $200/night in India, $300/night internationally)\n— Meals (up to $50/day in India, $100/day internationally)\n— Visa and travel document fees\n— Business-related entertainment (pre-approved only)\n\nWhat is not covered:\n— Upgrades above economy (without founder approval)\n— Personal trips attached to business travel (pro-rate accordingly)\n— Alcohol at meals (exception: investor entertainment with approval)\n— Hotels outside stated limits without approval`,
      },
    ],
  },
  {
    title: 'Legal & IP',
    icon: '◑',
    articles: [
      {
        title: 'NDA policy',
        content: `Before sharing any of the following with a third party, an NDA must be signed:\n— Financial models or projections\n— Technical specifications (Llife protocol, HubCV matching algorithm)\n— Investor terms or cap table details\n— Unannounced product roadmaps\n— Site-specific details for Roborns\n\nHow to get an NDA signed:\n1. Use the standard LLIFE NDA template (HQ → Files → NDA Template — General)\n2. Send via DocuSign or physical signature — email confirmation is not sufficient\n3. File the signed copy in Google Drive / Legal / NDAs / [party name]\n\nIf a party refuses to sign an NDA before discussing sensitive information, do not proceed with the conversation.`,
      },
      {
        title: 'Intellectual property',
        content: `All work created by team members in the course of their engagement with LLIFE is owned by LLIFE HoldCo.\n\nThis includes:\n— Code, algorithms, and software\n— Design assets, copy, and brand materials\n— Financial models and analyses\n— Technical specifications\n— Business strategies and investor materials\n\nOpen-source usage: permitted for libraries and tools. Do not publish LLIFE's proprietary code under an open-source licence without approval.\n\nThird-party IP: If integrating third-party code, check the licence before use. GPL-licensed code in commercial products requires legal review.`,
      },
      {
        title: 'Contract process',
        content: `No contract commits LLIFE to an obligation without founder review.\n\nFor all contracts:\n1. Share draft with founder before signing\n2. For contracts above $5,000 value: obtain legal counsel review\n3. Never sign a contract under time pressure — request 48 hours minimum\n4. File the signed copy in Google Drive / Legal / Contracts / [venture] / [party]\n5. Log in HQ → Legal → Contracts with key terms noted\n\nRed flags in contracts:\n— Exclusivity clauses without a time limit\n— Unlimited liability clauses\n— IP assignment to the other party\n— Auto-renewal without cancel notice requirement\n— Jurisdiction outside India or UAE`,
      },
    ],
  },
  {
    title: 'Security',
    icon: '◐',
    articles: [
      {
        title: 'Access management',
        content: `All team members receive access only to the systems they need. Access is granted by the founder.\n\nPassword rules:\n— Minimum 16 characters, unique per service\n— Use a password manager (1Password or Bitwarden recommended)\n— Never share passwords via WhatsApp, email, or any unencrypted channel\n— Change passwords immediately if you suspect a breach\n\nTwo-factor authentication (2FA) is mandatory for:\n— Google Workspace / Drive\n— GitHub\n— AWS / cloud services\n— Domain registrar\n— Payment processors\n— HoldCo banking\n\nOffboarding: all access revoked within 24 hours of departure.`,
      },
      {
        title: 'Server and infrastructure',
        content: `The LLIFE server (64.227.160.224) hosts all production platforms. Access is restricted to team members with a business need.\n\nRules:\n— SSH access only — no password login\n— All deployments via rsync + PM2 (no direct file edits on production)\n— No running commands as root unless absolutely necessary\n— PM2 process list reviewed monthly — stop any zombie processes\n— Server costs reviewed in HQ → Finance → Budget monthly\n\nBefore any infrastructure change:\n1. Test locally\n2. Build and verify locally (npm run build)\n3. Sync to server\n4. Build on server\n5. Restart PM2\n6. Check logs for errors\n\nNever make direct code edits on the production server.`,
      },
      {
        title: 'Data handling',
        content: `LLIFE handles investor personal data, user data (HubCV, Franchiseen, Nanotrade), and potentially financial data. All data must be handled in compliance with applicable laws (India DPDP Act, UAE PDPL, GDPR for EU users).\n\nPrinciples:\n— Collect only what is necessary\n— Store data securely (encrypted at rest and in transit)\n— Do not share user data with third parties without explicit consent\n— Retain data only as long as necessary\n— Provide data deletion on user request\n\nFor each venture that collects user data, a data processing policy must be documented before launch.`,
      },
    ],
  },
];
