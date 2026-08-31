// Re-exported from the canonical registry so existing importers of this module
// (activity, partners, channel, relations, resources pages) keep working.
export { VENTURES } from './ventures';

// ─── PARTNERS ─────────────────────────────────────────────────────────────────
export type PartnerStatus = 'active' | 'negotiating' | 'prospecting' | 'on-hold';
export type PartnerType   = 'Technology' | 'Distribution' | 'Financial' | 'Strategic' | 'Government' | 'Manufacturing' | 'Legal';

export interface Partner {
  name: string; type: PartnerType; status: PartnerStatus;
  role: string; nextAction: string;
}

export const VENTURE_PARTNERS: Record<string, Partner[]> = {
  Roborns: [
    { name: 'Thermal Engineering Firm (TBD)', type: 'Technology',   status: 'prospecting',  role: 'Design and validate the coastal heat exchange system connecting compute to desalination', nextAction: 'Shortlist 3 firms with coastal heat exchange experience and send RFP' },
    { name: 'Karnataka Coastal Authority',    type: 'Government',   status: 'prospecting',  role: 'Coastal construction permits, CRZ clearance, and environmental approval', nextAction: 'Appoint government liaison and arrange introductory meeting' },
    { name: 'Karnataka State Water Board',    type: 'Government',   status: 'prospecting',  role: 'Water offtake agreement — municipality buys desalinated water from facility', nextAction: 'Draft water offtake term sheet and submit to KUWSDB' },
    { name: 'MESCOM (Grid provider)',         type: 'Government',   status: 'prospecting',  role: '10MW industrial HT grid connection for the facility', nextAction: 'Submit HT connection application to MESCOM Mangaluru' },
    { name: 'AI Compute Anchor Tenant (TBD)',type: 'Strategic',    status: 'prospecting',  role: 'Pre-sign LOI for rack space — de-risks construction financing', nextAction: 'Approach 5 AI/ML companies with pitch deck and LOI draft' },
    { name: 'Dubai HoldCo Legal Counsel',     type: 'Legal',        status: 'negotiating',  role: 'HoldCo incorporation, token structure, and investor agreement templates', nextAction: 'Finalise engagement letter and kick off incorporation' },
    { name: 'Greenko / ReNew (Wind PPA)',     type: 'Technology',   status: 'prospecting',  role: 'Karnataka wind PPA at ₹3.0/kWh — 2MW contracted rate, zero upfront cost', nextAction: 'Request PPA term sheet from Greenko and ReNew' },
    { name: 'Smart Contract Auditor (TBD)',   type: 'Legal',        status: 'prospecting',  role: 'Security audit of Roborns token smart contract before issuance', nextAction: 'Shortlist 3 audit firms — target $20–50K budget' },
  ],
  Franchiseen: [
    { name: 'F&B Franchise Brand (TBD)',      type: 'Distribution', status: 'prospecting',  role: 'First franchise brand listed — pilot with 50 retail investors', nextAction: 'Attend 1 franchise expo and identify 3 qualifying mid-size brands' },
    { name: 'KYC/AML Provider',               type: 'Technology',   status: 'negotiating',  role: 'Identity verification and compliance for investor onboarding', nextAction: 'Complete Onfido vs Signzy vs Digilocker comparison and select' },
    { name: 'Escrow / Trust Provider (TBD)',  type: 'Financial',    status: 'prospecting',  role: 'Hold retail investor funds in regulated escrow before franchise deployment', nextAction: 'Identify regulated escrow provider — banks or NBFC partner' },
    { name: 'Stripe / Razorpay',              type: 'Technology',   status: 'prospecting',  role: 'Payment processing for daily and monthly payout disbursements', nextAction: 'Submit platform account applications to both processors' },
    { name: 'Investment Legal Counsel (TBD)', type: 'Legal',        status: 'prospecting',  role: 'SEBI pathway analysis, investor agreement templates, platform compliance', nextAction: 'Engage SEBI-specialist firm — target Mumbai or Delhi based' },
    { name: 'Crossmint',                      type: 'Technology',   status: 'active',       role: 'Crypto wallet and on-chain settlement infrastructure for the Franchiseen platform', nextAction: 'Complete Crossmint SDK integration in platform' },
  ],
  HubCV: [
    { name: 'Recruiter Agency 1 (TBD)',       type: 'Distribution', status: 'prospecting',  role: 'Design partner — discounted access in exchange for structured feedback', nextAction: 'Follow up on March 2026 outreach — convert to design partner meeting' },
    { name: 'Coding Bootcamp Partner (TBD)',  type: 'Distribution', status: 'prospecting',  role: 'Graduate verification programme — each cohort = 50–100 verified profiles', nextAction: 'Reach out to 5 bootcamps with verified graduate programme proposal' },
    { name: 'Anthropic',                      type: 'Technology',   status: 'active',       role: 'Claude API for AI matching engine, profile analysis, and skill gap detection', nextAction: 'Upgrade to higher rate limit plan ahead of beta launch' },
    { name: 'Human Verifier Network (TBD)',   type: 'Strategic',    status: 'prospecting',  role: '20 domain experts (engineering, finance, design) — paid per assessment', nextAction: 'Recruit first 5 verifiers via LinkedIn and professional networks' },
    { name: 'University Partnership (TBD)',   type: 'Distribution', status: 'prospecting',  role: 'Verified credentials for graduates — institutional channel for profile supply', nextAction: 'Identify 3 target universities with strong engineering/tech programmes' },
  ],
  Llife: [
    { name: 'HubCV (internal API)',           type: 'Technology',   status: 'active',       role: 'Education domain — College, School, Certificates, Internship and Skills read from the HubCV profile graph', nextAction: 'Scope a read-only education endpoint and issue Llife a service key' },
    { name: 'Dextrip (internal API)',         type: 'Technology',   status: 'active',       role: 'Earnings domain — Job, Crypto and Stocks positions with live P&L streamed from Dextrip', nextAction: 'Agree the portfolio read schema, refresh interval and rate limits' },
    { name: 'Franchiseen (internal API)',     type: 'Technology',   status: 'active',       role: 'Earnings domain — franchise ownership stakes, payout schedule and AUM per investor', nextAction: 'Expose a per-investor holdings endpoint for Llife to consume' },
    { name: 'Account Aggregator (Sahamati)',  type: 'Financial',    status: 'prospecting',  role: 'RBI Account Aggregator consent rails — bank balances, credits and net worth for the Finances domain', nextAction: 'Shortlist an AA technology service provider and review consent-flow rules' },
    { name: 'Health Platform Partners (TBD)', type: 'Technology',   status: 'prospecting',  role: 'Body domain — Apple HealthKit and Google Health Connect sync for exercise, diet and sleep', nextAction: 'Scope read permissions and app-store privacy disclosures for health data' },
  ],
  Dextrip: [
    { name: 'Binance',                        type: 'Technology',   status: 'active',       role: 'Primary exchange — API access for multi-strategy execution, spot + derivatives', nextAction: 'Upgrade to VIP API tier to increase rate limits for public beta' },
    { name: 'Bybit',                          type: 'Technology',   status: 'active',       role: 'Secondary exchange — derivatives and spot execution', nextAction: 'Complete Bybit connector for multi-exchange beta launch' },
    { name: 'OKX',                            type: 'Technology',   status: 'prospecting',  role: 'Third exchange — DeFi chain access via OKX Web3 wallet', nextAction: 'Begin OKX API integration post Bybit connector completion' },
    { name: 'Strategy Creators (TBD)',        type: 'Distribution', status: 'prospecting',  role: 'Publish strategies to marketplace — each creator brings their own audience', nextAction: 'Launch creator outreach programme targeting quant Twitter community' },
    { name: 'GMX / dYdX (DeFi)',             type: 'Technology',   status: 'prospecting',  role: 'DeFi protocol integrations — on-chain execution infrastructure', nextAction: 'Begin GMX integration after public beta stabilises' },
  ],
};

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
export interface VActivity {
  date: string; category: string; title: string; description: string;
}

export const VENTURE_ACTIVITIES: Record<string, VActivity[]> = {
  Roborns: [
    { date: '2026-05-21', category: 'Milestone',   title: 'hq.codelude.com financial model published',    description: 'Roborns 5-year financial model live in HQ dashboard — seed ask ₹18 Cr, Y5 revenue ₹142 Cr.' },
    { date: '2026-05-15', category: 'Engineering',  title: 'Thermal feasibility study commissioned',       description: 'Engagement with coastal infrastructure specialists begins. Site survey underway.' },
    { date: '2026-05-10', category: 'Legal',        title: 'Dubai HoldCo legal review started',            description: 'Legal review of Dubai HoldCo tokenisation structure initiated with external counsel.' },
    { date: '2026-04-10', category: 'Decision',     title: 'Uchila Thalapady site shortlisted',           description: 'Coastal site identified as primary candidate. Coastal access, grid proximity, and water intake assessed.' },
    { date: '2026-03-05', category: 'Finance',      title: 'Token structure modelling started',            description: 'Financial modelling of Dubai HoldCo token economics begun. Revenue per token, distribution schedule under design.' },
    { date: '2026-01-10', category: 'Milestone',    title: 'Roborns concept formalised',                  description: 'Closed-loop coastal AI + desalination + mineral extraction documented as a viable business model.' },
  ],
  Franchiseen: [
    { date: '2026-05-19', category: 'Milestone',   title: 'Payout architecture finalised',               description: 'Revenue-sharing and investor daily/monthly payout structure locked. Ready for platform implementation.' },
    { date: '2026-05-12', category: 'Product',     title: 'Platform architecture complete',               description: 'Core platform architecture for fractional ownership engine designed and documented.' },
    { date: '2026-04-28', category: 'Decision',    title: 'Daily payout as core differentiator',          description: 'Strategic decision: daily payouts are the headline feature. All priorities ordered around reliability.' },
    { date: '2026-04-15', category: 'Legal',       title: 'KYC/AML provider shortlisted',                description: '3 providers evaluated: Onfido, Digilocker, Signzy. Decision pending on integration complexity vs cost.' },
    { date: '2026-02-01', category: 'Decision',    title: 'Crossmint + Solana stack selected',            description: 'On-chain settlement via Crossmint and Jupiter on Solana selected for token-based ownership layer.' },
  ],
  HubCV: [
    { date: '2026-05-10', category: 'Product',     title: 'Matching engine development started',          description: 'AI-driven candidate-to-opportunity matching core in active development using Anthropic SDK.' },
    { date: '2026-04-05', category: 'Product',     title: 'Dynamic profile system designed',              description: 'Profile architecture for AI+human verified dynamic CVs documented. Verification workflow designed.' },
    { date: '2026-03-10', category: 'Partnership', title: 'First bootcamp outreach sent',                 description: 'Outreach to 5 coding bootcamps for verified graduate partnership programme. Responses pending.' },
    { date: '2026-01-20', category: 'Decision',    title: 'B2B-first go-to-market confirmed',             description: 'Decision: sign recruiters before opening to professionals. Supply-side quality controls acquisition.' },
  ],
  Llife: [
    { date: '2026-04-28', category: 'Milestone',   title: 'Five-domain model defined',                    description: 'Finances, Education, Earnings, Mind and Body fixed as the assistant\u2019s domains, each mapped to a daily time block.' },
    { date: '2026-03-28', category: 'Partnership', title: 'Internal API integrations scoped',             description: 'HubCV, Dextrip and Franchiseen agreed as the first data sources feeding Education and Earnings.' },
    { date: '2026-02-10', category: 'Decision',    title: 'Property developer channel prioritised',       description: 'Decision: lead with property developer channel over DTC. Reduces CAC, provides volume anchor for first MOQ.' },
  ],
  Dextrip: [
    { date: '2026-05-21', category: 'Product',     title: 'Entry timing updated — dual window',          description: 'Bot now enters within 60s of event start AND 60s before next event. Price filter set to < $0.55.' },
    { date: '2026-05-18', category: 'Milestone',   title: 'Strategy engine closed beta live',             description: '3 paying beta users. Multi-exchange connector in development. Live P&L tracking confirmed.' },
    { date: '2026-05-20', category: 'Launch',      title: 'client.dextrip.com launched',                 description: 'Client investment portal live at client.dextrip.com — trades, deposits, profits.' },
    { date: '2026-03-20', category: 'Finance',     title: 'First closed beta revenue collected',          description: 'First subscription payments from closed beta users confirmed. Model validated at small scale.' },
    { date: '2026-02-20', category: 'Decision',    title: 'Strategy marketplace model approved',          description: 'Decision: creator marketplace with 30% revenue share. Each creator = distribution channel.' },
  ],
};

// ─── CHANNELS ─────────────────────────────────────────────────────────────────
export type ChStatus = 'active' | 'building' | 'planned';

export interface VChannel {
  name: string; type: string; status: ChStatus;
  description: string; metric: string;
}

export const VENTURE_CHANNELS: Record<string, VChannel[]> = {
  Roborns: [
    { name: 'Direct investor outreach',    type: 'Sales',    status: 'active',   description: 'Personal 1:1 outreach to Gulf infrastructure investors, family offices, and deep-tech angels', metric: 'Investor meetings per week' },
    { name: 'Roborns.com',                type: 'Marketing',status: 'active',   description: 'Public venture website — concept, technology, and investment thesis', metric: 'Investor enquiry form submissions' },
    { name: 'LinkedIn thought leadership', type: 'Marketing',status: 'building', description: 'Founder posts on coastal AI compute, sustainability, and Indian infrastructure', metric: 'Post reach and follower growth' },
    { name: 'Investor conferences (Gulf)', type: 'Sales',    status: 'planned',  description: 'Deep-tech and infrastructure conferences in Dubai and Abu Dhabi for face-to-face investor access', metric: 'Meetings booked per conference' },
    { name: 'Engineering community',       type: 'Community',status: 'planned',  description: 'Engagement with coastal engineering and desalination professional networks for partner discovery', metric: 'Engineering partner conversations' },
    { name: 'Token announcement',          type: 'Marketing',status: 'planned',  description: 'Public announcement of HoldCo token structure post-incorporation — crypto and RWA media', metric: 'Token investor sign-ups' },
  ],
  Franchiseen: [
    { name: 'Franchise brand outreach',   type: 'Sales',    status: 'active',   description: 'Direct outreach to mid-size franchise brands in India — F&B, retail, services', metric: 'Brand meetings per week' },
    { name: 'Investor acquisition funnel',type: 'Marketing',status: 'building', description: 'Content-led funnel explaining fractional franchise investment to high-income professionals', metric: 'Investor waitlist sign-ups' },
    { name: 'Franchise expos',            type: 'Sales',    status: 'planned',  description: 'Attend 2 franchise industry expos — Franchise India, Expo West — for brand discovery', metric: 'Brand contacts collected' },
    { name: 'Franchiseen.com',            type: 'Marketing',status: 'planned',  description: 'Platform website and investor registration landing page', metric: 'Registrations and inbound leads' },
    { name: 'LinkedIn',                   type: 'Marketing',status: 'building', description: 'Content on franchise investment, daily payouts, and financial access for retail investors', metric: 'Follower growth and enquiries' },
    { name: 'First payout press release', type: 'Marketing',status: 'planned',  description: 'PR story around first successful payout cycle — franchise media and financial press', metric: 'Media pickups and investor leads' },
  ],
  HubCV: [
    { name: 'Recruiter design partner outreach', type: 'Sales',    status: 'active',  description: 'Direct outreach to tech-focused recruitment agencies as design partners', metric: 'Design partner commitments' },
    { name: 'Bootcamp partnerships',            type: 'Distribution',status: 'building',description: 'Graduate verification programme — each bootcamp cohort = 50–100 verified profiles', metric: 'Verified profiles per cohort' },
    { name: 'LinkedIn content',                 type: 'Marketing',status: 'planned',   description: '"The verified talent problem" content series targeting in-house recruiters', metric: 'Post engagement and profile visits' },
    { name: 'HubCV.com',                        type: 'Marketing',status: 'building',  description: 'Platform website with recruiter and professional sign-up flows', metric: 'Beta sign-ups' },
    { name: 'University channel',               type: 'Distribution',status: 'planned', description: 'Verified credentials for graduates — institutional supply channel', metric: 'University partnerships signed' },
    { name: 'SEO — hiring content',             type: 'Marketing',status: 'planned',   description: 'Long-form content targeting "verified skills recruiter" and "AI candidate matching" searches', metric: 'Organic traffic and trial sign-ups' },
  ],
  Llife: [
    { name: 'Property developer B2B',    type: 'Distribution',status: 'building', description: 'Direct B2B channel to Dubai and India developers for pre-installation in new builds', metric: 'Developer agreements signed' },
    { name: '10-home pilot programme',   type: 'Marketing', status: 'planned',   description: 'Real pilot homes in Mangaluru and Dubai — documented for testimonial content', metric: 'Pilot homes complete' },
    { name: 'Pre-order campaign',        type: 'Marketing', status: 'planned',   description: 'DTC pre-order with pilot testimonials — validates demand before production run', metric: 'Pre-orders collected (target: 200)' },
    { name: 'Instagram + YouTube',       type: 'Marketing', status: 'planned',   description: 'Short-form content on daily life tracking — net worth, streaks and routine reviews in action', metric: 'Views and waitlist sign-ups' },
    { name: 'llife.ai',               type: 'Marketing', status: 'planned',   description: 'Product website with beta waitlist, the five-domain explainer, and daily-board demo', metric: 'Waitlist registrations' },
  ],
  Dextrip: [
    { name: 'Twitter / X community',     type: 'Community', status: 'building',  description: 'Strategy performance sharing, market commentary, creator-friendly content', metric: 'Followers and engagement' },
    { name: 'Strategy creator programme',type: 'Distribution',status: 'planned', description: '20 creators recruited pre-beta — 30% rev-share, co-marketing, early access', metric: 'Active strategy creators' },
    { name: 'Discord',                   type: 'Community', status: 'planned',   description: 'Strategy marketplace community — bug reports, feature requests, alpha signals', metric: 'Active members per week' },
    { name: 'Dextrip.com',             type: 'Marketing', status: 'active',    description: 'Main platform — strategy dashboard, public beta registration', metric: 'Beta sign-ups' },
    { name: 'bot.dextrip.com',         type: 'Marketing', status: 'active',    description: 'Bot dashboard — strategies, account management, P&L', metric: 'Active strategy count' },
    { name: 'Crypto media outreach',    type: 'Marketing', status: 'planned',   description: 'CoinDesk, The Block, Decrypt — after public beta launch', metric: 'Articles and media mentions' },
  ],
};

// ─── RELATIONS ────────────────────────────────────────────────────────────────
export type RHealth = 'strong' | 'developing' | 'cold' | 'target';

export interface VRelation {
  name: string; category: string; health: RHealth;
  description: string; lastContact: string; nextStep: string;
}

export const VENTURE_RELATIONS: Record<string, VRelation[]> = {
  Roborns: [
    { name: 'Gulf Infrastructure Investors', category: 'Investor',    health: 'target',     description: 'Institutional and HNWI investors focused on real assets and clean tech in the Gulf', lastContact: 'Not yet', nextStep: 'Build target list of 20 Dubai-based infrastructure investors' },
    { name: 'Karnataka State Government',    category: 'Government',  health: 'cold',       description: 'State authority for coastal land, water board, and environmental clearance', lastContact: 'Not yet', nextStep: 'Appoint government liaison and schedule first meeting' },
    { name: 'Dubai DIFC / DFSA',            category: 'Government',  health: 'developing', description: 'Dubai financial regulator for HoldCo structure and token issuance', lastContact: 'May 2026', nextStep: 'Finalise legal counsel engagement for DIFC incorporation' },
    { name: 'Deep-Tech Advisors',            category: 'Advisor',     health: 'target',     description: 'Operators in coastal infrastructure or energy who add technical credibility', lastContact: 'Not yet', nextStep: 'Identify 3 target advisors through engineering networks' },
    { name: 'RWA Token Investors',          category: 'Investor',    health: 'target',     description: 'Crypto-native funds focused on tokenised real-world assets', lastContact: 'Not yet', nextStep: 'Approach after HoldCo token structure is finalised' },
  ],
  Franchiseen: [
    { name: 'Franchise Operator Community', category: 'Customer',    health: 'target',     description: 'Existing operators who need capital — the supply side of the marketplace', lastContact: 'Not yet', nextStep: 'Attend 1 franchise expo and collect 20 operator contacts' },
    { name: 'Retail Investor Community',    category: 'Customer',    health: 'target',     description: 'High-income professionals who want yield alternatives beyond stock market', lastContact: 'Not yet', nextStep: 'Build investor waitlist page on Franchiseen.com' },
    { name: 'SEBI / Regulatory',           category: 'Government',  health: 'cold',       description: 'Indian regulator for retail investment platform operations', lastContact: 'Not yet', nextStep: 'Identify lightest regulatory path — revenue-share vs equity structure' },
    { name: 'Angel Investors (SAFE)',      category: 'Investor',    health: 'developing', description: 'Pre-seed angels who invest post first payout proof. SAFE at $1.5M cap', lastContact: 'Mar 2026', nextStep: 'Share Franchiseen pitch with Codelude angel network' },
    { name: 'Franchise Trade Media',       category: 'Media',       health: 'target',     description: 'Franchise India, Franchise World — target for first payout case study', lastContact: 'Not yet', nextStep: 'Prepare press release for first payout milestone' },
  ],
  HubCV: [
    { name: 'Tech Recruitment Agencies',   category: 'Customer',    health: 'developing', description: 'In-house and agency recruiters experiencing candidate quality problems', lastContact: 'Mar 2026', nextStep: 'Convert 2 outreach responses to design partner meetings' },
    { name: 'Working Professionals',       category: 'Customer',    health: 'target',     description: 'Early adopters who want verified profiles and career intelligence', lastContact: 'Not yet', nextStep: 'Launch beta waitlist on HubCV.com' },
    { name: 'Angel Investors',             category: 'Investor',    health: 'target',     description: 'Bootstrap-friendly angels who back post-proof SaaS platforms', lastContact: 'Not yet', nextStep: 'Approach after 20 paying recruiter accounts are live' },
    { name: 'HR Tech Media',               category: 'Media',       health: 'target',     description: 'HR Technologist, RecruitingBrainz — target for launch coverage', lastContact: 'Not yet', nextStep: 'Prepare product announcement for beta launch' },
  ],
  Llife: [
    { name: 'Beta Users (HubCV base)',     category: 'Customer',    health: 'target',     description: 'HubCV students whose Education domain is populated from day one — the lowest-friction beta cohort', lastContact: 'Not yet', nextStep: 'Launch beta waitlist on llife.ai' },
    { name: 'HubCV Student Base',          category: 'Customer',    health: 'developing', description: 'Students already on HubCV are the warmest channel — Education domain works on day one', lastContact: 'Mar 2026', nextStep: 'Design the cross-sign-on flow from HubCV into Llife' },
    { name: 'Consumer AI Angels',          category: 'Investor',    health: 'target',     description: 'Consumer subscription and personal-finance angels for the pre-seed round', lastContact: 'Not yet', nextStep: 'Build investor list once retention data exists from private beta' },
    { name: 'Smart Home Media',            category: 'Media',       health: 'target',     description: 'The Verge, TechCrunch, Wired — pilot story coverage for DTC launch', lastContact: 'Not yet', nextStep: 'Prepare pilot documentation for press kit' },
  ],
  Dextrip: [
    { name: 'Dextrip Beta Users (3)',      category: 'Customer',    health: 'strong',     description: '3 paying closed beta subscribers — validating model and retention', lastContact: 'May 2026', nextStep: 'Gather testimonials and onboard as first marketplace contributors' },
    { name: 'Crypto Trading Community',    category: 'Community',   health: 'developing', description: 'Retail and semi-professional traders active on Crypto Twitter and Discord', lastContact: 'May 2026', nextStep: 'Engage 10 strategy creators with marketplace invite and rev-share offer' },
    { name: 'Quant / Strategy Creators',  category: 'Customer',    health: 'target',     description: 'Developers and quants who want to monetise their strategies', lastContact: 'Not yet', nextStep: 'Launch creator outreach programme targeting quant Twitter' },
    { name: 'Crypto / DeFi Media',        category: 'Media',       health: 'target',     description: 'CoinDesk, The Block, Decrypt — after public beta and marketplace launch', lastContact: 'Not yet', nextStep: 'Prepare public beta press release for July 2026 launch' },
  ],
};

// ─── RESOURCES ────────────────────────────────────────────────────────────────
export type ResType = 'Human' | 'Technology' | 'Legal' | 'Physical' | 'Financial';
export type ResStatus = 'active' | 'needed' | 'planned';
export type ResPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Resource {
  name: string; type: ResType; status: ResStatus; priority: ResPriority;
  monthlyCost: number;    // USD/month (0 if one-time)
  oneTimeCost: number;    // USD one-time (0 if recurring)
  currency?: string;      // defaults USD
  notes: string;
}

export const VENTURE_RESOURCES: Record<string, Resource[]> = {
  Roborns: [
    // Human
    { name: 'Thermal Engineering Firm',        type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 0,    oneTimeCost: 10000, notes: 'Feasibility study contract — one-time fee for Phase 1 validation' },
    { name: 'Government Liaison',              type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 2000, oneTimeCost: 0,     notes: 'Monthly retainer for Karnataka govt permit navigation — CRZ, water board, MESCOM' },
    { name: 'Site Survey Coordinator',         type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 0,    oneTimeCost: 3000,  notes: 'One-time: coordinate Mangaluru site survey and documentation' },
    { name: 'HoldCo Legal Counsel (Dubai)',    type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 1500, oneTimeCost: 5000,  notes: 'DIFC incorporation one-time + monthly retainer for token structure and compliance' },
    { name: 'Environmental Law Firm',          type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 1000, oneTimeCost: 0,     notes: 'Karnataka coastal authority, EIA process, CRZ clearance' },
    // Technology
    { name: 'Engineering CAD / Design Tools',  type: 'Technology', status: 'needed',  priority: 'medium',   monthlyCost: 300,  oneTimeCost: 0,     notes: 'AutoCAD or similar for facility architectural drawings' },
    { name: 'Project Management Software',     type: 'Technology', status: 'active',  priority: 'low',      monthlyCost: 50,   oneTimeCost: 0,     notes: 'HQ dashboard covers most of this — supplementary tool only' },
    // Legal
    { name: 'Smart Contract Audit',           type: 'Legal',      status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 30000, notes: 'Required before any token issuance — security audit by specialist firm' },
    { name: 'IP / Patent Registration',       type: 'Legal',      status: 'planned', priority: 'medium',   monthlyCost: 0,    oneTimeCost: 10000, notes: 'Protect thermal loop design and mineral extraction process IP' },
    // Physical
    { name: 'Coastal Land Lease (Mangaluru)', type: 'Physical',   status: 'planned', priority: 'critical', monthlyCost: 5000, oneTimeCost: 0,     notes: '1-acre coastal site — estimated lease ₹3–5L/month, pending survey' },
    { name: 'Phase 1 Construction Capex',     type: 'Physical',   status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 2100000,notes: '₹18.1 Cr = ~$2.1M USD — Buildings A+B, thermal loop, grid' },
    // Financial
    { name: 'Seed Round Facilitation',        type: 'Financial',  status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 15000, notes: 'Legal and structuring costs for HoldCo token seed round' },
  ],
  Franchiseen: [
    // Human
    { name: 'Franchise Partnership Manager',  type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 4000, oneTimeCost: 0,     notes: 'Full-time: owns brand acquisition, target 5+ brands in 6 months. Commission + base.' },
    { name: 'Investment Legal Counsel',       type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 2500, oneTimeCost: 5000,  notes: 'Monthly retainer + setup fee — SEBI pathway, investor agreements, KYC frameworks' },
    { name: 'Platform Engineer (Fullstack)',  type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 5000, oneTimeCost: 0,     notes: 'Full-time: owns Franchiseen platform — payout engine, investor portal, operator portal' },
    // Technology
    { name: 'KYC/AML Provider (Onfido/Signzy)',type:'Technology', status: 'needed',  priority: 'critical', monthlyCost: 400,  oneTimeCost: 2000,  notes: 'Per-verification pricing — $2–5/check + setup fee. Scales with investor volume.' },
    { name: 'Stripe / Razorpay',             type: 'Technology', status: 'needed',  priority: 'critical', monthlyCost: 150,  oneTimeCost: 500,   notes: 'Payment processing — 2.9% + $0.30 per transaction. Est. at launch volume.' },
    { name: 'Convex Backend',                type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Real-time database and serverless functions for Franchiseen platform' },
    { name: 'Platform Hosting (Vercel/AWS)', type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 80,   oneTimeCost: 0,     notes: 'Next.js hosting + database + storage' },
    // Legal
    { name: 'Company Registration',          type: 'Legal',      status: 'planned', priority: 'high',     monthlyCost: 0,    oneTimeCost: 5000,  notes: 'Franchiseen entity registration — India + potential UAE structure' },
    { name: 'Escrow Account Setup',          type: 'Legal',      status: 'needed',  priority: 'critical', monthlyCost: 200,  oneTimeCost: 1000,  notes: 'Regulated escrow for investor funds — mandatory before accepting capital' },
  ],
  HubCV: [
    // Human
    { name: 'AI / ML Engineer',              type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 7000, oneTimeCost: 0,     notes: 'Full-time: owns matching engine, Anthropic SDK, skill graph. Python + LLM expertise.' },
    { name: 'Human Verifier Network (×20)',  type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 2000, oneTimeCost: 1000,  notes: '$20–50/assessment × ~60 assessments/month at launch. Monthly variable cost.' },
    { name: 'Recruiter Success Manager',     type: 'Human',      status: 'planned', priority: 'medium',   monthlyCost: 3000, oneTimeCost: 0,     notes: 'Onboards and manages design partner recruiter accounts. Y2 hire.' },
    // Technology
    { name: 'Anthropic API (Claude)',        type: 'Technology', status: 'active',  priority: 'critical', monthlyCost: 400,  oneTimeCost: 0,     notes: 'LLM API for profile analysis, skill scoring, and opportunity matching. Scales with usage.' },
    { name: 'PostgreSQL (Neon/Supabase)',    type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Relational database for profiles, jobs, matches, verifications' },
    { name: 'Platform Hosting',             type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 80,   oneTimeCost: 0,     notes: 'Vercel + CDN + storage for HubCV platform' },
    { name: 'Vector Database',              type: 'Technology', status: 'needed',  priority: 'high',     monthlyCost: 150,  oneTimeCost: 0,     notes: 'Pinecone or Weaviate for skill embedding similarity search' },
    // Legal
    { name: 'DPDP Act Compliance (India)',  type: 'Legal',      status: 'needed',  priority: 'high',     monthlyCost: 500,  oneTimeCost: 2000,  notes: 'Data privacy compliance — consent framework, deletion mechanism, processing policy' },
  ],
  Llife: [
    // Human
    { name: 'Product Engineer (Mobile)',    type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 6000, oneTimeCost: 0,     notes: 'Owns the daily tracker UI \u2014 time-block board, streaks, offline-first sync' },
    { name: 'Integrations Engineer',        type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 7000, oneTimeCost: 0,     notes: 'Builds and maintains the HubCV, Dextrip, Franchiseen and Account Aggregator connectors' },
    { name: 'Mobile App Developer',         type: 'Human',      status: 'planned', priority: 'high',     monthlyCost: 5000, oneTimeCost: 0,     notes: 'iOS and Android Llife app. React Native preferred. Y2 hire.' },
    // Technology
    { name: 'LLM Inference Budget',         type: 'Technology', status: 'needed',  priority: 'critical', monthlyCost: 2000, oneTimeCost: 0,     notes: 'Per-user assistant reasoning \u2014 daily summaries, nudges and domain reviews' },
    { name: 'AA Consent Integration',      type: 'Technology', status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 15000, notes: 'Account Aggregator onboarding and audit before financial data can be read' },
    { name: 'AI Inference (Cloud)',         type: 'Technology', status: 'planned', priority: 'high',     monthlyCost: 200,  oneTimeCost: 0,     notes: 'Assistant reasoning for daily reviews and nudges. Scales with active users.' },
    { name: 'Design Tools (Figma/Fusion)', type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 100,  oneTimeCost: 0,     notes: 'UI design and hardware CAD tooling' },
    // Physical
    { name: 'Security & Privacy Audit',     type: 'Technology', status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 30000, notes: 'Independent audit before handling financial and health data at scale' },
    { name: '10-Home Pilot Installations', type: 'Physical',   status: 'planned', priority: 'high',     monthlyCost: 0,    oneTimeCost: 50000, notes: '$5K per pilot home including device, installation, and 6-month monitoring' },
    // Legal
    { name: 'Product Liability Insurance', type: 'Legal',      status: 'planned', priority: 'medium',   monthlyCost: 300,  oneTimeCost: 0,     notes: 'Required before retail sale of consumer electronic device' },
  ],
  Dextrip: [
    // Human
    { name: 'Creator Programme Lead',      type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 3500, oneTimeCost: 0,     notes: 'Recruits and manages strategy creators. Crypto-native, community experience required.' },
    { name: 'Platform Engineer',           type: 'Human',      status: 'planned', priority: 'high',     monthlyCost: 6000, oneTimeCost: 0,     notes: 'Y2 hire: owns strategy marketplace, institutional API, DeFi integrations.' },
    // Technology
    { name: 'Binance API (VIP tier)',      type: 'Technology', status: 'active',  priority: 'critical', monthlyCost: 200,  oneTimeCost: 0,     notes: 'Higher rate limits for public beta scale. Volume-based pricing.' },
    { name: 'Bybit API',                  type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Secondary exchange connector for derivatives and spot' },
    { name: 'Server Infrastructure',      type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 200,  oneTimeCost: 0,     notes: 'VPS hosting all Dextrip apps — bot.dextrip.com, tv, spot, client portal' },
    { name: 'OKX API',                    type: 'Technology', status: 'planned', priority: 'medium',   monthlyCost: 100,  oneTimeCost: 0,     notes: 'Third exchange — DeFi chain access. Planned post-Bybit completion.' },
    { name: 'GMX / dYdX Integration',     type: 'Technology', status: 'planned', priority: 'medium',   monthlyCost: 50,   oneTimeCost: 2000,  notes: 'DeFi protocol integration — on-chain execution. Development cost one-time.' },
    // Legal
    { name: 'Terms of Service / Legal',   type: 'Legal',      status: 'needed',  priority: 'high',     monthlyCost: 0,    oneTimeCost: 3000,  notes: 'Non-custodial ToS, risk disclosures, creator agreement templates' },
    // Financial
    { name: 'Creator Fund (Onboarding)',  type: 'Financial',  status: 'planned', priority: 'medium',   monthlyCost: 0,    oneTimeCost: 15000, notes: 'Incentive budget for first 20 strategy creators — co-marketing + bonus' },
  ],
};
