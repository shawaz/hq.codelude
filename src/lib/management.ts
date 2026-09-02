// ─── STRATEGY ────────────────────────────────────────────────────────────────

export interface Initiative {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  status: 'active' | 'planned' | 'on-hold';
}

export interface StrategicRisk {
  risk: string;
  mitigation: string;
  severity: 'high' | 'medium' | 'low';
}

export interface VentureStrategy {
  name: string;
  color: string;
  positioning: string;
  competitiveAdvantages: string[];
  initiatives: Initiative[];
  risks: StrategicRisk[];
  threeYearVision: string;
}

export const STRATEGIES: VentureStrategy[] = [
  {
    name: 'Roborns',
    color: '#dbdbdb',
    positioning: 'First-mover in closed-loop coastal AI infrastructure. We are not a datacenter company or a desalination company — we are a resource-loop company that happens to generate all three revenue streams from one site. This is impossible to replicate without the physical asset.',
    competitiveAdvantages: [
      'Physical asset moat — a built coastal facility cannot be copied overnight',
      'Triple revenue loop — compute, water, minerals from a single capex investment',
      'Tokenised structure — investors participate before construction, creating early capital alignment',
      'Carbon-negative positioning — waste heat as the energy source, zero freshwater input',
      'Geographic advantage — Mangaluru coastal access with government partnership pathway',
    ],
    initiatives: [
      { title: 'Secure thermal engineering partner',    description: 'Identify and contract a coastal heat exchange engineering firm to validate the technical model before committing to site capex.', priority: 'critical', status: 'active' },
      { title: 'Close anchor compute tenant LOI',       description: 'A signed letter of intent from one AI/ML company de-risks the entire construction phase. Target: hyperscaler or large AI startup.', priority: 'critical', status: 'active' },
      { title: 'Activate Dubai HoldCo token structure', description: 'Finalise legal structure for token issuance. Token represents proportional revenue share in the physical asset — enables pre-construction investor participation.', priority: 'critical', status: 'planned' },
      { title: 'Karnataka government engagement',       description: 'Build relationship with state water board and coastal authority early. Permits take time — engage before they are needed.', priority: 'high', status: 'planned' },
      { title: 'Seed infrastructure round',             description: 'Raise $3M–5M via HoldCo token sale to strategic investors once LOI and feasibility are in hand.', priority: 'high', status: 'planned' },
    ],
    risks: [
      { risk: 'Construction timeline slippage',           mitigation: 'Fix-price contractor agreement with penalty clauses. Buffer 20% on timeline estimates.', severity: 'high' },
      { risk: 'Regulatory delay on coastal permits',      mitigation: 'Engage government liaison early. Have legal team on retainer for Karnataka coastal authority.', severity: 'high' },
      { risk: 'Anchor tenant fails to sign',             mitigation: 'Approach 5 potential tenants simultaneously. Feasibility phase does not require a signed tenant.', severity: 'medium' },
      { risk: 'Thermal efficiency underperforms model',   mitigation: 'Commission independent engineering validation before construction commitment.', severity: 'medium' },
      { risk: 'Climate / coastal risk (flooding, storm)', mitigation: 'Site survey includes climate risk assessment. Facility design accounts for 50-year flood levels.', severity: 'medium' },
    ],
    threeYearVision: 'Three operational closed-loop facilities — Mangaluru Phase 1 and 2, and a second site in the Gulf. $10M+ ARR across compute, water, and minerals. Proven replication model that can be tokenised and deployed at scale globally. Roborns becomes the reference architecture for sustainable coastal AI infrastructure.',
  },
  {
    name: 'Franchiseen',
    color: '#c8c8c8',
    positioning: 'The franchise ownership operating system — not a marketplace, not a crowdfunding platform. Franchiseen is infrastructure. We handle capital pooling, compliance, payouts, and reporting so operators and investors never have to. The moat is in the payout infrastructure and regulatory compliance layer.',
    competitiveAdvantages: [
      'Daily payout infrastructure — no competitor offers daily yield distribution at this scale',
      'Full ownership OS — onboarding, KYC, compliance, payouts, reporting in one platform',
      'Network effects — more franchise brands attract more investors; more investors attract more brands',
      'First-mover in fractional franchise — the category is being created, not entered',
      'Regulatory compliance as moat — painful to build, protects against fast-followers',
    ],
    initiatives: [
      { title: 'Sign first franchise brand partner',    description: 'The entire model proves or fails with the first deal. Prioritise a mid-size regional brand with proven unit economics over a large but slow-moving franchisor.', priority: 'critical', status: 'active' },
      { title: 'Complete payout infrastructure',        description: 'Daily distribution engine must be live and tested before any investor capital is accepted. Zero tolerance for payout failure at launch.', priority: 'critical', status: 'active' },
      { title: 'Obtain investment platform compliance', description: 'Identify the lightest regulatory path to legally accept retail investor capital. SEBI (India) or DFSA (Dubai) depending on entity structure.', priority: 'critical', status: 'planned' },
      { title: 'Run pilot with 50 investors',           description: 'Closed pilot — 50 investors, one franchise location, one full payout cycle. Document and publish results as proof of concept.', priority: 'high', status: 'planned' },
      { title: 'Build investor acquisition funnel',     description: 'Content-led funnel explaining fractional franchise investment. Target: high-income professionals who understand F&B/retail but cannot access franchise investment.', priority: 'medium', status: 'planned' },
    ],
    risks: [
      { risk: 'Regulatory challenge on investor capital',  mitigation: 'Work with specialised investment platform legal counsel. Structure as revenue-sharing agreement if equity route is complex.', severity: 'high' },
      { risk: 'Franchise partner underperforms',           mitigation: 'Rigorous due diligence on unit economics before listing. Investor contracts include performance disclosure clauses.', severity: 'high' },
      { risk: 'Investor trust — first payout failure',    mitigation: 'Never accept investor capital until payout infrastructure is fully tested. First payout is the product.', severity: 'high' },
      { risk: 'Payment processor rejection',              mitigation: 'Approach 3 processors simultaneously. Structure as escrow or trust account to simplify compliance.', severity: 'medium' },
      { risk: 'Competitor enters fractional franchise',   mitigation: 'Move fast. The payout infrastructure and brand relationships are the moat — build them before others can.', severity: 'medium' },
    ],
    threeYearVision: '$50M+ AUM across 50+ franchise brands in India and Southeast Asia. 10,000+ retail investors receiving daily payouts. Franchiseen becomes the default capital layer for new franchise expansion — operators choose Franchiseen over bank loans because the platform does everything.',
  },
  {
    name: 'HubCV',
    color: '#b5b5b5',
    positioning: 'Institution-led, not recruiter-led. We do not ask students to write a better resume — we put the assessment itself on the platform and let the resume fall out of it. The school is the customer: it claims its hub under KYB, licenses seats for its year groups, and its faculty run the grading. That gate is deliberate. Because every hub is verified before it goes live, the skill record carries institutional weight rather than self-reported noise — which is the whole moat, and the reason an open sign-up model would destroy it.',
    competitiveAdvantages: [
      'KYB-verified hubs — every institution is approved before it issues a record, so the skill graph carries real weight',
      'Assessment-native evidence — skill levels come from graded tasks, tests and attendance, not self-reported claims',
      '77,076 geocoded Karnataka schools — a proprietary directory that is the supply-side acquisition map',
      'Model-neutral pricing — platform nets the same per seat whether hub or parent pays, so payment terms are a free sales lever',
      'Chain leverage — one agreement with a school group or board covers hundreds of hubs at once',
    ],
    initiatives: [
      { title: 'Build the counselling engine',          description: 'Free hands-on career guidance camps are how you get into the building, not how you close. Students get a real guidance report and the school sees its own outcomes data, so the principal conversation starts from evidence. Karnataka for all of Y1 — 100 hubs across Dakshina Kannada, Udupi and Bengaluru.', priority: 'critical', status: 'planned' },
      { title: 'Ship billing and faculty split payouts', description: 'Razorpay and Stripe paths with automatic 70/30 split at point of enrolment. Nothing monetises until faculty can be paid reliably and see their earnings.', priority: 'critical', status: 'active' },
      { title: 'Take the AI credit ledger to GA',        description: 'Metered prepaid credits with hard caps. This is the entire margin story — it carries no faculty share and lifts blended take rate from 30% toward 46%.', priority: 'critical', status: 'active' },
      { title: 'Sign the first 50 faculty',              description: 'Assessment Program onboarding: authoring tests, tasks and attendance logs with skill tags. Fifty active faculty with 40-student classes is roughly 2,000 paying students.', priority: 'critical', status: 'planned' },
      { title: 'Launch the professional course tier',    description: 'Open the ₹3,000–15,000 band to certification instructors. Low volume, high margin — this is the tier that carries EBITDA before student volume arrives.', priority: 'high', status: 'planned' },
      { title: 'National directory rollout',             description: 'Load all 1.7M Indian schools into the directory. This is the outreach map that tells counsellors where to go and shows faculty their peer network — not a promise to visit every school. Physical camps reach ~21,000 of them over five years; referral and digital walkthroughs carry the rest.', priority: 'high', status: 'planned' },
      { title: 'Land the first chain agreement',        description: 'One agreement with Kendriya Vidyalaya, DAV, Narayana, Sri Chaitanya or a state board covers hundreds of hubs and substitutes for a thousand individual sales. This is the only channel in the plan with real leverage and it is currently unstaffed.', priority: 'critical', status: 'planned' },
      { title: 'Make faculty adoption measurable',      description: 'Faculty are not the buyer but they decide renewal: a school whose teachers never ran the Assessment Program will not re-sign. Instrument active-faculty-per-hub and assessments-logged-per-term as the leading indicator of seat revenue.', priority: 'critical', status: 'planned' },
      { title: 'Industrialise KYB approval',            description: 'Every hub claim is manually approved by the company team. That gate is the credential moat and a hard throughput ceiling at the same time. Get approval under five days per hub and staff it before it becomes the bottleneck.', priority: 'high', status: 'planned' },
    ],
    risks: [
      { risk: 'Faculty churn breaks the class',       mitigation: 'The student relationship must survive the faculty member. Profiles, skill records and guidance stay with the student, and because the hub holds the licence the class survives a teacher leaving — one genuine advantage of the institution-led model over an open faculty sign-up.', severity: 'medium' },
      { risk: 'Open faculty sign-up would break the moat', mitigation: 'A YouTube-style model where any teacher self-serves and issues verifications is faster to grow and fatal to credibility — the record is only worth something because a verified institution stands behind it. If a faculty tier is ever added, gate it on institutional track record the way YouTube gates its Partner Programme.', severity: 'high' },
      { risk: 'AI credit costs invert the ₹150 tier', mitigation: 'Bundled guidance reports stay bounded at ₹2–5 of inference. Everything beyond that is prepaid and hard-capped. Never bundle unlimited assistant chat into a subject price.', severity: 'high' },
      { risk: 'Option B cannibalises seat revenue',   mitigation: 'Per-subject nets roughly a quarter of what a seat does per student. Keep it positioned as a trial wedge with a defined upgrade path, not a permanent alternative, or hubs will park there indefinitely.', severity: 'medium' },
      { risk: 'Seats do not renew',                   mitigation: 'Seats are annual, so this is a renewal business and churn is fatal in a way a one-off enrolment never was. The cause of churn will be faculty non-adoption, not price. Watch active faculty per hub from the first term and staff customer success before the first renewal cohort lands in Y2.', severity: 'high' },
      { risk: 'KYB approval becomes the bottleneck',  mitigation: 'Manual company approval on every hub claim caps how fast the business can grow regardless of demand. Measure approval throughput per week as a capacity metric, not an ops chore.', severity: 'high' },
      { risk: 'Camp-to-hub conversion is unproven',   mitigation: 'A camp is a live demo run by a stranger in a school, and it now has to convert a principal rather than a teacher — a slower, more sceptical buyer. Script the playbook, and audit hubs-closed per camp rather than students-counselled per camp.', severity: 'high' },
      { risk: '1.7M schools read as 1.7M visits',     mitigation: 'The directory is the addressable map, not the visit list. Physical camps touch ~21K schools over five years — 1.2% of it. Never plan or pitch headcount against the full directory.', severity: 'medium' },
      { risk: 'Volume business needs volume',         mitigation: 'Break-even needs roughly 600 active hubs, which needs Karnataka proven and one state beyond it. Seat renewals from the Y1 cohort carry the fixed cost while the second state ramps.', severity: 'medium' },
    ],
    threeYearVision: '2,200 verified institutional hubs across eight states and roughly 400,000 licensed seats, with at least two national school chains signed and renewing. The Assessment Program runs as the default grade book rather than an add-on, and every student leaves each term with a skill-tagged, institutionally-backed profile. The verified skill graph becomes the dataset employers and credentialing bodies license — the recruiter surface arrives last, pulled in by supply, not chased first.',
  },
  {
    name: 'Nanotrade',
    color: '#adadad',
    positioning: 'The non-custodial strategy marketplace. We are not a trading bot — we are a distribution platform for trading strategies. Creators publish, users subscribe, Nanotrade earns the spread. Every strategy creator is a distribution channel. The more strategies, the more users. The more users, the more creators.',
    competitiveAdvantages: [
      'Non-custodial — users keep their keys, Nanotrade never touches funds. Trust = lower CAC',
      'Strategy marketplace flywheel — each creator brings their own audience',
      'Composable strategies — mix and match, not black-box',
      'Already live — closed beta proving retention before public launch',
      'DeFi-native — not bolted on, built for on-chain execution from day one',
    ],
    initiatives: [
      { title: 'Launch public beta with marketplace',   description: 'Open registration tied to strategy marketplace launch. First 10 creator strategies live at day one. Creators bring their audiences — organic acquisition.', priority: 'critical', status: 'planned' },
      { title: 'Creator acquisition programme',         description: 'Recruit 20 strategy creators before public beta. Offer: revenue share (30%), co-marketing, early feature access. Each creator = distribution channel.', priority: 'critical', status: 'planned' },
      { title: 'Multi-exchange connector',              description: 'Support Binance, Bybit, OKX, and Coinbase at launch. Each additional exchange = larger addressable market.', priority: 'critical', status: 'active' },
      { title: 'DeFi protocol integrations',            description: 'GMX, dYdX, and Uniswap V4 as first DeFi targets. Positions Nanotrade as on-chain execution infrastructure, not just CEX automation.', priority: 'high', status: 'planned' },
      { title: 'Institutional API tier',               description: 'Higher rate limits, dedicated support, custom strategy ingestion. Target: small prop desks and algo funds who want execution infra without building it.', priority: 'medium', status: 'planned' },
    ],
    risks: [
      { risk: 'Exchange API changes / restrictions',   mitigation: 'Abstract exchange layer so strategy logic is exchange-agnostic. Switching cost for users is zero — builds loyalty to Nanotrade, not the exchange.', severity: 'high' },
      { risk: 'Regulatory pressure on crypto trading', mitigation: 'Non-custodial model significantly reduces regulatory surface area. Users are executing their own trades — we provide the tool, not the service.', severity: 'high' },
      { risk: 'Strategy quality on marketplace',       mitigation: 'Mandatory backtesting results before listing. 90-day live track record for featured strategies. Creator reputation score visible to all users.', severity: 'medium' },
      { risk: 'Bear market reduces user engagement',   mitigation: 'Short-strategy support in roadmap. Bear markets create demand for hedging automation — position Nanotrade as risk management tool.', severity: 'medium' },
      { risk: 'Creator churn if strategy underperforms', mitigation: 'Marketplace shows transparent performance. Underperforming creators improve or delisted — protects platform reputation.', severity: 'low' },
    ],
    threeYearVision: '10,000 active subscribers, 500 published strategies, $5M MRR. Institutional API tier serving 50+ prop desks. Nanotrade becomes the non-custodial execution layer for DeFi — integrated directly into protocol dashboards as a white-label automation engine.',
  },
  {
    name: 'Llife',
    color: '#a5a5a5',
    positioning: 'A life operating system, not another tracker. Llife wins because the data arrives already populated \u2014 Education from HubCV, Earnings from Nanotrade and Franchiseen \u2014 so the user never faces an empty board. The moat is the ecosystem: no standalone competitor can pre-fill those domains.',
    competitiveAdvantages: [
      'Protocol-agnostic — works with Apple HomeKit, Google Home, Amazon Alexa simultaneously',
      'Learns vs controls — routine intelligence that improves without configuration',
      'Property developer channel — pre-installed in new builds = acquisition at zero marginal cost',
      'Personal assistant layer — proactive actions, not reactive commands',
      'Data ownership — all learning stays on-device, privacy-first positioning',
    ],
    initiatives: [
      { title: 'Ship the HubCV Education integration',  description: 'First live domain. Pulls College, School, Certificates, Internship and Skills from the HubCV profile graph so new users land on a populated board.', priority: 'critical', status: 'active' },
      { title: 'Ship Nanotrade + Franchiseen Earnings',   description: 'Job, Crypto and Stocks from Nanotrade; franchise stakes from Franchiseen. Completes the Earnings domain and the daily net-worth roll-up.', priority: 'critical', status: 'planned' },
      { title: 'Run 10 pilot home installations',       description: 'Real homes, real families. 10 pilots across Mangaluru and Dubai. Document the experience in detail — this becomes the marketing asset.', priority: 'high', status: 'planned' },
      { title: 'Property developer partnership',        description: 'Approach 2 property developers in Dubai for a pre-installation agreement on new builds. Revenue model: per-unit licence fee + subscription rev-share.', priority: 'high', status: 'planned' },
      { title: 'Pre-order campaign',                   description: 'Launch waitlist and pre-order page with pilot testimonials. Target: 200 pre-orders before full production run to validate demand.', priority: 'medium', status: 'planned' },
    ],
    risks: [
      { risk: 'Hardware supply chain delays',          mitigation: 'Begin manufacturing conversations 12 months before target launch. Identify 2 backup manufacturers.', severity: 'high' },
      { risk: 'Apple/Google competitive response',     mitigation: 'They control the platform, not the intelligence. Llife differentiates on learning depth and cross-platform unification — neither Apple nor Google can unify all three platforms.', severity: 'high' },
      { risk: 'Consumer adoption curve — complexity',  mitigation: 'Pilot feedback shapes simplification. Zero-setup promise: plug in, it learns. No configuration required.', severity: 'medium' },
      { risk: 'Hardware MOQ capital requirement',      mitigation: 'Property developer pre-installation deal or pre-order campaign funds the first MOQ without external capital.', severity: 'medium' },
      { risk: 'Data privacy regulatory (GDPR, DPDP)', mitigation: 'On-device processing first. Cloud processing only with explicit consent. Privacy-first as a marketing advantage, not a compliance burden.', severity: 'low' },
    ],
    threeYearVision: '100,000 daily active users across India and the Gulf, most arriving through HubCV and Nanotrade. Llife becomes the consumer face of the Codelude ecosystem \u2014 the single daily surface where a user sees their education, earnings, finances, mind and body in one place.',
  },
];

// ─── ACTIVITY ────────────────────────────────────────────────────────────────

export type ActivityCategory = 'Milestone' | 'Decision' | 'Meeting' | 'Launch' | 'Partnership' | 'Finance' | 'Legal' | 'Engineering' | 'Product' | 'Marketing';

export interface Activity {
  date: string;
  venture: string;
  category: ActivityCategory;
  title: string;
  description: string;
}

export const ACTIVITIES: Activity[] = [
  { date: '2026-05-20', venture: 'Codelude',    category: 'Launch',       title: 'codelude.com goes live',                description: 'Public company website launched with SSL, PM2, Apache vhost. Four venture pages, token structure, news, and join us pages live.' },
  { date: '2026-05-20', venture: 'Codelude',    category: 'Launch',       title: 'hq.codelude.com deployed',              description: 'Internal company dashboard live with team login, accordion sidebar, tasks, projects, plan, and management modules.' },
  { date: '2026-05-20', venture: 'Nanotrade',     category: 'Product',      title: 'client-nanotrade process started on server', description: 'New Nanotrade client process launched on the server (PM2 id: 33).' },
  { date: '2026-05-19', venture: 'Franchiseen', category: 'Milestone',    title: 'Payout architecture finalized',         description: 'Revenue-sharing and investor daily/monthly payout structure locked. Ready for platform implementation.' },
  { date: '2026-05-18', venture: 'Nanotrade',     category: 'Product',      title: 'Strategy engine closed beta live',      description: 'Automated trading strategy layer live for select beta users. Multi-exchange support and live P&L tracking included.' },
  { date: '2026-05-15', venture: 'Roborns',     category: 'Engineering',  title: 'Thermal feasibility study commissioned', description: 'Engagement with coastal infrastructure specialists begins. Site survey for Mangaluru pilot facility underway.' },
  { date: '2026-05-10', venture: 'HubCV',       category: 'Product',      title: 'Matching engine development started',   description: 'AI-driven candidate-to-opportunity matching core in active development.' },
  { date: '2026-05-05', venture: 'Roborns',     category: 'Legal',        title: 'Dubai HoldCo structure review begun',   description: 'Legal review of Dubai HoldCo tokenization structure initiated with counsel.' },
  { date: '2026-04-28', venture: 'Llife',     category: 'Milestone',    title: 'Five-domain model defined',             description: 'Finances, Education, Earnings, Mind and Body fixed as the assistant\u2019s domains, each mapped to a daily time block.' },
  { date: '2026-04-20', venture: 'Franchiseen', category: 'Product',      title: 'Platform architecture complete',        description: 'Core platform architecture for fractional ownership engine designed and documented.' },
  { date: '2026-04-15', venture: 'Nanotrade',     category: 'Engineering',  title: 'Multi-exchange connector in build',     description: 'Development of unified exchange connector supporting Binance, Bybit, and OKX started.' },
  { date: '2026-04-10', venture: 'Roborns',     category: 'Engineering',  title: 'Coastal site shortlisted',             description: 'Uchila Thalapady, Mangaluru identified as primary site. Coastal access, grid proximity, and water intake assessed.' },
  { date: '2026-04-05', venture: 'HubCV',       category: 'Product',      title: 'Dynamic profile system design finalised', description: 'Profile architecture for AI+human verified dynamic CVs documented. Verification workflow designed.' },
  { date: '2026-03-28', venture: 'Llife',     category: 'Partnership',  title: 'Internal API integrations scoped',       description: 'HubCV, Nanotrade and Franchiseen agreed as the first data sources feeding the Education and Earnings domains.' },
  { date: '2026-03-20', venture: 'Nanotrade',     category: 'Finance',      title: 'Closed beta revenue first collected',   description: 'First subscription payments from closed beta users confirmed. Model validated at small scale.' },
  { date: '2026-03-15', venture: 'Franchiseen', category: 'Legal',        title: 'KYC/AML provider shortlisted',         description: 'Three KYC/AML providers evaluated. Decision pending on integration complexity vs cost.' },
  { date: '2026-03-10', venture: 'HubCV',       category: 'Partnership',  title: 'First bootcamp outreach sent',         description: 'Outreach to 5 coding bootcamps for verified graduate partnership programme. Responses pending.' },
  { date: '2026-03-05', venture: 'Roborns',     category: 'Finance',      title: 'Token structure modelling started',    description: 'Financial modelling of Dubai HoldCo token economics begun. Revenue per token, distribution schedule under design.' },
  { date: '2026-02-20', venture: 'Nanotrade',     category: 'Product',      title: 'Strategy marketplace concept approved', description: 'Decision made to build creator marketplace model. 30% revenue share for strategy creators confirmed.' },
  { date: '2026-02-10', venture: 'Llife',     category: 'Decision',     title: 'Ecosystem-first distribution chosen',        description: 'Decision: launch inside HubCV and Nanotrade rather than standalone. Near-zero CAC and the board arrives pre-populated.' },
  { date: '2026-02-01', venture: 'Franchiseen', category: 'Decision',     title: 'Daily payout as core differentiator',  description: 'Strategic decision: daily payouts are the headline feature. All product priorities ordered around making this reliable.' },
  { date: '2026-01-20', venture: 'HubCV',       category: 'Decision',     title: 'B2B-first go-to-market confirmed',     description: 'Decision: sign recruiters before opening to professionals. Supply-side quality controls acquisition.' },
  { date: '2026-01-10', venture: 'Roborns',     category: 'Milestone',    title: 'Roborns concept formalised',           description: 'Closed-loop coastal AI + desalination + mineral extraction concept documented as a viable business model.' },
  { date: '2025-12-15', venture: 'Codelude',    category: 'Decision',     title: 'Five-venture studio model confirmed',  description: 'Decision: Codelude operates as a deep-tech studio. All five ventures under one HoldCo. Token structure participatory from genesis.' },
];

// ─── PARTNERS ────────────────────────────────────────────────────────────────

export type PartnerStatus = 'active' | 'prospecting' | 'negotiating' | 'on-hold';
export type PartnerType   = 'Technology' | 'Distribution' | 'Financial' | 'Strategic' | 'Government' | 'Manufacturing';

export interface Partner {
  name: string;
  type: PartnerType;
  ventures: string[];
  status: PartnerStatus;
  role: string;
  nextAction: string;
}

export const PARTNERS: Partner[] = [
  { name: 'Thermal Engineering Firm (TBD)',      type: 'Technology',     ventures: ['Roborns'],                 status: 'prospecting',  role: 'Validate and design the coastal heat exchange system connecting AI compute to desalination',                nextAction: 'Shortlist 3 firms with coastal industrial heat exchange experience' },
  { name: 'Karnataka State Water Board',         type: 'Government',     ventures: ['Roborns'],                 status: 'prospecting',  role: 'Water offtake agreement — municipality buys desalinated water from the facility',                            nextAction: 'Arrange introductory meeting via government liaison' },
  { name: 'Karnataka Coastal Authority',         type: 'Government',     ventures: ['Roborns'],                 status: 'prospecting',  role: 'Coastal construction permits and environmental clearance',                                                  nextAction: 'Engage environmental law firm for permit pathway analysis' },
  { name: 'AI Compute Anchor Tenant (TBD)',      type: 'Strategic',      ventures: ['Roborns'],                 status: 'prospecting',  role: 'Pre-sign LOI for rack space — de-risks construction financing',                                             nextAction: 'Approach 5 AI/ML companies with Mangaluru compute pitch deck' },
  { name: 'Dubai HoldCo Legal Counsel (TBD)',    type: 'Financial',      ventures: ['Roborns', 'Codelude'],     status: 'active',       role: 'Structure and incorporate the Dubai HoldCo vehicle for tokenisation',                                       nextAction: 'Finalise token term sheet and investor agreement templates' },
  { name: 'Franchise Brand Partner 1 (TBD)',     type: 'Distribution',   ventures: ['Franchiseen'],             status: 'prospecting',  role: 'First franchise brand listed on platform — pilot with 50 retail investors',                                 nextAction: 'Identify mid-size regional F&B franchise with strong unit economics' },
  { name: 'KYC/AML Provider (TBD)',              type: 'Technology',     ventures: ['Franchiseen'],             status: 'negotiating',  role: 'Identity verification and anti-money laundering compliance for investor onboarding',                         nextAction: 'Complete integration comparison: Onfido vs Digilocker vs Signzy' },
  { name: 'Payment Processor (TBD)',             type: 'Technology',     ventures: ['Franchiseen', 'Nanotrade'],  status: 'prospecting',  role: 'Daily and monthly payout disbursement infrastructure for Franchiseen. Subscription billing for Nanotrade',    nextAction: 'Apply to Stripe and Razorpay for platform accounts' },
  { name: 'Recruiter Agency Partner 1 (TBD)',    type: 'Distribution',   ventures: ['HubCV'],                   status: 'prospecting',  role: 'Design partner — uses HubCV at discounted rate, provides structured product feedback',                       nextAction: 'Send outreach to 10 tech-focused recruitment agencies' },
  { name: 'Coding Bootcamp Partner (TBD)',       type: 'Distribution',   ventures: ['HubCV'],                   status: 'prospecting',  role: 'Graduate verification programme — each cohort = 50–100 verified profiles on platform',                       nextAction: 'Follow up on outreach sent to 5 bootcamps in March 2026' },
  { name: 'RBI Account Aggregator (Sahamati)',   type: 'Financial',      ventures: ['Llife'],                 status: 'prospecting',  role: 'Consent rails for bank balances, credits and net worth in the Finances domain',                           nextAction: 'Shortlist an AA technology service provider and review consent-flow rules' },
  { name: 'HubCV / Nanotrade (internal APIs)',     type: 'Technology',     ventures: ['Llife'],                 status: 'active',       role: 'Education, Job, Crypto and Stocks data feeding the Llife daily board',                                       nextAction: 'Finalise read scopes, auth model and rate limits for both APIs' },
  { name: 'Binance',                             type: 'Technology',     ventures: ['Nanotrade'],                 status: 'active',       role: 'Primary exchange integration — API access for multi-strategy execution',                                     nextAction: 'Upgrade to VIP API tier to increase rate limits for public beta' },
  { name: 'Bybit',                               type: 'Technology',     ventures: ['Nanotrade'],                 status: 'active',       role: 'Secondary exchange — derivatives and spot execution',                                                       nextAction: 'Complete Bybit connector for multi-exchange beta launch' },
  { name: 'OKX',                                 type: 'Technology',     ventures: ['Nanotrade'],                 status: 'prospecting',  role: 'Third exchange — DeFi chain access via OKX Web3 wallet integration',                                       nextAction: 'Begin OKX API integration after Bybit connector complete' },
  { name: 'Strategy Creators (TBD)',             type: 'Distribution',   ventures: ['Nanotrade'],                 status: 'prospecting',  role: 'Publish strategies to marketplace — each creator brings their own trading community as users',               nextAction: 'Launch creator outreach programme — target quant Twitter community' },
];

// ─── CHANNELS ─────────────────────────────────────────────────────────────────

export type ChannelStatus = 'active' | 'building' | 'planned';
export type ChannelType   = 'Marketing' | 'Sales' | 'Community' | 'Internal' | 'Distribution';

export interface Channel {
  name: string;
  type: ChannelType;
  ventures: string[];
  status: ChannelStatus;
  description: string;
  metric: string;
}

export const CHANNELS: Channel[] = [
  { name: 'codelude.com',           type: 'Marketing',    ventures: ['Codelude'],                              status: 'active',   description: 'Primary public presence — all four ventures, token thesis, news, and join us CTA',                        metric: 'Visitor → contact form conversion' },
  { name: 'Direct email outreach',  type: 'Sales',        ventures: ['Roborns', 'Franchiseen', 'Codelude'],    status: 'active',   description: 'Targeted outreach to investors, engineering partners, and franchise brands. 1:1 relationship building',      metric: 'Meetings booked per week' },
  { name: 'LinkedIn',               type: 'Marketing',    ventures: ['Codelude', 'HubCV'],                     status: 'building', description: 'Thought leadership content on deep-tech, franchise innovation, and career intelligence. Studio voice.',       metric: 'Post reach and follower growth' },
  { name: 'Twitter / X',            type: 'Community',    ventures: ['Nanotrade'],                               status: 'building', description: 'Trading community engagement. Strategy performance sharing, market commentary. Creator-friendly channel.',    metric: 'Followers and engagement rate' },
  { name: 'Discord',                type: 'Community',    ventures: ['Nanotrade'],                               status: 'planned',  description: 'Strategy creator and user community. Bug reports, feature requests, alpha access announcements.',            metric: 'Active members per week' },
  { name: 'Recruiter outreach',     type: 'Sales',        ventures: ['HubCV'],                                 status: 'building', description: 'Direct outreach to recruitment agencies and in-house talent teams. Design partner programme.',               metric: 'Design partners signed' },
  { name: 'Bootcamp partnerships',  type: 'Distribution', ventures: ['HubCV'],                                 status: 'building', description: 'Graduate verification programme. Each cohort generates verified profiles and word-of-mouth among graduates.', metric: 'Verified profiles per cohort' },
  { name: 'Content / SEO',          type: 'Marketing',    ventures: ['HubCV', 'Franchiseen'],                  status: 'planned',  description: 'Long-form content targeting high-intent search: "how to invest in franchises", "verified skills for recruiters"', metric: 'Organic search traffic' },
  { name: 'Ecosystem cross-sell',   type: 'Distribution', ventures: ['Llife'],                               status: 'building', description: 'Distribution through HubCV, Nanotrade and Franchiseen user bases — the domains arrive already populated.', metric: 'Cross-signups from ecosystem' },
  { name: 'Pre-order campaign',     type: 'Marketing',    ventures: ['Llife'],                               status: 'planned',  description: 'DTC pre-order with pilot testimonials. Builds waitlist and validates consumer demand before full production.',   metric: 'Pre-orders collected' },
  { name: 'Strategy creator programme', type: 'Distribution', ventures: ['Nanotrade'],                          status: 'planned',  description: 'Formal creator onboarding with 30% rev-share, co-marketing, and early access. Each creator = distribution.',   metric: 'Active strategy creators' },
  { name: 'Investor network',       type: 'Sales',        ventures: ['Roborns', 'Codelude'],                   status: 'active',   description: 'Direct relationships with strategic investors in deep-tech, real estate, and infrastructure. Dubai-anchored.',  metric: 'Investor conversations active' },
  { name: 'hq.codelude.com',        type: 'Internal',     ventures: ['Codelude'],                              status: 'active',   description: 'Internal company OS — all team operations, planning, tasks, and strategy tracked here',                       metric: 'Team adoption and module usage' },
  { name: 'WhatsApp / Telegram',    type: 'Internal',     ventures: ['Codelude'],                              status: 'active',   description: 'Fast internal communication for decisions and updates between core team members',                             metric: 'Response time on critical decisions' },
];

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export type RelationCategory = 'Investor' | 'Government' | 'Media' | 'Community' | 'Advisor' | 'Customer';
export type RelationHealth   = 'strong' | 'developing' | 'cold' | 'target';

export interface Relation {
  name: string;
  category: RelationCategory;
  ventures: string[];
  health: RelationHealth;
  description: string;
  lastContact: string;
  nextStep: string;
}

export const RELATIONS: Relation[] = [
  { name: 'Strategic Infrastructure Investors',  category: 'Investor',    ventures: ['Roborns'],                  health: 'target',     description: 'Institutional and HNWI investors focused on physical infrastructure, clean tech, and real assets. Dubai-based preferred for HoldCo alignment.',      lastContact: 'Not yet',          nextStep: 'Build target list of 20 Dubai-based infrastructure investors' },
  { name: 'Deep-Tech Angel Network',             category: 'Investor',    ventures: ['Codelude'],                 health: 'developing', description: 'Angel investors with portfolio in AI, automation, and emerging market tech. Entry point for pre-seed Franchiseen and HubCV rounds.',                  lastContact: 'Mar 2026',         nextStep: 'Share Codelude deck and arrange introductory calls' },
  { name: 'Token / Web3 Investors',             category: 'Investor',    ventures: ['Roborns', 'Nanotrade'],       health: 'target',     description: 'Crypto-native funds and investors comfortable with tokenised real-world assets and DeFi infrastructure plays.',                                       lastContact: 'Not yet',          nextStep: 'Identify 10 RWA-focused funds after HoldCo token structure is finalised' },
  { name: 'Karnataka State Government',          category: 'Government',  ventures: ['Roborns'],                  health: 'cold',       description: 'State authority for coastal land, water board, and environmental clearance. Long lead time — engage early.',                                          lastContact: 'Not yet',          nextStep: 'Appoint government liaison and schedule first meeting' },
  { name: 'Dubai DIFC / DFSA',                  category: 'Government',  ventures: ['Roborns', 'Franchiseen'],   health: 'cold',       description: 'Dubai financial regulator for HoldCo structure and Franchiseen investor compliance. Critical for token issuance legality.',                           lastContact: 'Not yet',          nextStep: 'Engage DIFC-registered legal counsel for initial compliance assessment' },
  { name: 'SEBI (India)',                        category: 'Government',  ventures: ['Franchiseen'],              health: 'cold',       description: 'Indian regulator for retail investment platform operations. Relevant if Franchiseen accepts Indian retail investor capital.',                          lastContact: 'Not yet',          nextStep: 'Identify lightest regulatory path — investment adviser vs SEBI-registered platform' },
  { name: 'Tech / Startup Media',               category: 'Media',       ventures: ['Codelude'],                 health: 'target',     description: 'Publications covering deep-tech, venture studios, and emerging market tech. YourStory, Inc42, TechCrunch (India/ME).',                              lastContact: 'Not yet',          nextStep: 'Draft founder story and codelude.com launch press release' },
  { name: 'Crypto / DeFi Media',                category: 'Media',       ventures: ['Nanotrade', 'Roborns'],       health: 'target',     description: 'Crypto-native publications and influencers covering trading tools and tokenised real-world assets. CoinDesk, The Block, Decrypt.',                 lastContact: 'Not yet',          nextStep: 'Target after Nanotrade public beta and Roborns token announcement' },
  { name: 'Franchise Trade Media',              category: 'Media',       ventures: ['Franchiseen'],              health: 'target',     description: 'Franchise-specific trade publications. Franchise India, Franchise World. Target for first payout proof story.',                                    lastContact: 'Not yet',          nextStep: 'Prepare first payout case study for media outreach' },
  { name: 'Trading Community (Twitter/Discord)',category: 'Community',   ventures: ['Nanotrade'],                  health: 'developing', description: 'Retail and semi-professional traders active on Crypto Twitter and Discord. Strategy creators come from this community.',                             lastContact: 'May 2026',         nextStep: 'Engage 10 strategy creators with marketplace invite and rev-share offer' },
  { name: 'Deep-Tech Advisors (TBD)',           category: 'Advisor',     ventures: ['Roborns', 'Codelude'],      health: 'target',     description: 'Experienced operators in coastal infrastructure, energy, or desalination who can provide technical credibility and network access.',                   lastContact: 'Not yet',          nextStep: 'Identify 3 target advisors through engineering network' },
  { name: 'Franchise Operator Community',       category: 'Customer',    ventures: ['Franchiseen'],              health: 'target',     description: 'Existing franchise operators who need capital — the supply side of the Franchiseen marketplace.',                                                    lastContact: 'Not yet',          nextStep: 'Attend 1 franchise expo and gather 20 operator contacts' },
  { name: 'Recruiter / Talent Acquisition Community', category: 'Customer', ventures: ['HubCV'],                health: 'developing', description: 'In-house and agency recruiters experiencing candidate quality problems. Primary B2B customer for HubCV.',                                            lastContact: 'Mar 2026',         nextStep: 'Convert 2 outreach responses to design partner meetings' },
  { name: 'Beta Users (HubCV base)',            category: 'Customer',    ventures: ['Llife'],                  health: 'target',     description: 'HubCV students whose Education domain is populated from day one — the lowest-friction beta cohort.',                                            lastContact: 'Not yet',          nextStep: 'Launch beta waitlist on llife.ai' },
];
