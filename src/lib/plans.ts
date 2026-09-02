export interface BusinessModel {
  revenueStreams:  { stream: string; description: string }[];
  customerSegments:{ segment: string; description: string }[];
  valueProp:       string;
  costStructure:   string[];
  keyPartners:     string[];
}

export interface Milestone {
  date: string;
  title: string;
  done: boolean;
}

export interface BusinessPlan {
  problem:    string;
  solution:   string;
  market:     { label: string; size: string }[];
  gtm:        string;
  milestones: Milestone[];
}

export interface FinancialPlan {
  fundingNeed:   string;
  fundingSource: string;
  revenueModel:  { label: string; value: string }[];
  year1Target:   string;
  breakEven:     string;
  notes:         string;
}

export interface VenturePlan {
  name:          string;
  color:         string;
  sector:        string;
  businessModel: BusinessModel;
  businessPlan:  BusinessPlan;
  financialPlan: FinancialPlan;
}

export const PLANS: VenturePlan[] = [
  {
    name: 'Roborns',
    color: '#dbdbdb',
    sector: 'Coastal AI Infrastructure',
    businessModel: {
      valueProp: 'Closed-loop AI infrastructure — waste heat from compute drives seawater desalination, eliminating water costs and enabling carbon-negative compute. Tokenised via Dubai HoldCo for participatory ownership.',
      revenueStreams: [
        { stream: 'Compute hosting',      description: 'Lease rack space and compute capacity to AI/ML companies at coastal rates' },
        { stream: 'Desalinated water',    description: 'Sell treated water to municipalities and industrial users' },
        { stream: 'Mineral extraction',   description: 'Recover and sell lithium, magnesium, and other minerals from brine byproduct' },
        { stream: 'HoldCo token yield',   description: 'Token holders receive proportional revenue distributions from all three streams' },
      ],
      customerSegments: [
        { segment: 'AI/ML companies',     description: 'Need affordable coastal compute — GPU clusters for training and inference' },
        { segment: 'Municipalities',      description: 'Water-stressed coastal cities needing desalination supply' },
        { segment: 'Chemical companies',  description: 'Buy extracted minerals (lithium, magnesium, potassium) from brine' },
        { segment: 'HoldCo investors',    description: 'Strategic and retail investors buying tokenised exposure to physical infrastructure' },
      ],
      costStructure: [
        'Land lease — 1-acre coastal site, Mangaluru',
        'Phase 1 construction capex — facility, cooling systems, water intake',
        'Thermal engineering and ongoing technical operations',
        'Energy infrastructure — power supply and backup',
        'Dubai HoldCo legal and compliance costs',
      ],
      keyPartners: [
        'Thermal engineering firm (coastal heat exchange)',
        'Construction contractor — coastal industrial',
        'AI compute anchor tenant',
        'Karnataka state government (permits and clearances)',
        'Dubai HoldCo legal counsel',
      ],
    },
    businessPlan: {
      problem: 'AI compute is energy and water-intensive, placing unsustainable load on inland infrastructure. Simultaneously, coastal cities face fresh water scarcity. There is no integrated solution that addresses both.',
      solution: 'Co-locate an AI datacenter on a 1-acre coastal site. Waste heat from compute servers drives multi-effect distillation of seawater. Brine byproduct feeds mineral extraction. Every resource loop is closed — compute costs go down, water is produced as a byproduct, minerals generate additional revenue.',
      market: [
        { label: 'AI Infrastructure',  size: '$100B+ globally, 30% CAGR' },
        { label: 'Desalination',       size: '$15B globally, coastal demand accelerating' },
        { label: 'Mineral Extraction', size: '$8B lithium market alone, brine-sourced growing' },
      ],
      gtm: 'Sign one anchor AI compute tenant pre-construction to de-risk capex. Simultaneously engage Karnataka municipality for water offtake agreement. Use token structure to bring in seed capital from strategic investors. Phase 1 proves the model — Phase 2 scales.',
      milestones: [
        { date: 'Q2 2026', title: 'Thermal engineering partner engaged',         done: true },
        { date: 'Q3 2026', title: 'Site survey and feasibility study complete',  done: false },
        { date: 'Q3 2026', title: 'Land lease signed',                           done: false },
        { date: 'Q3 2026', title: 'Anchor compute tenant LOI signed',            done: false },
        { date: 'Q3 2026', title: 'Seed infrastructure round closed',            done: false },
        { date: 'Q4 2026', title: 'Government permits and clearances received',  done: false },
        { date: 'Q4 2026', title: 'Phase 1 groundbreaking',                      done: false },
        { date: 'Q2 2027', title: 'Facility operational — first compute revenue',done: false },
        { date: 'Q3 2027', title: 'Desalination system live — water revenue',    done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$3M–5M (Phase 1)',
      fundingSource: 'Dubai HoldCo token sale to strategic investors — token represents proportional revenue share in the physical asset',
      revenueModel: [
        { label: 'Compute hosting',    value: '$15K–40K/month per rack (10 racks Phase 1)' },
        { label: 'Water sales',        value: '$0.80–1.20 per cubic metre — est. 500m³/day' },
        { label: 'Mineral extraction', value: 'Variable — lithium ~$25K/tonne' },
      ],
      year1Target:   '$1.5M–3M ARR once operational (compute + water)',
      breakEven:     '18–24 months post Phase 1 construction complete',
      notes:         'Token structure allows early investors to participate before construction completes. All three revenue streams are independent — facility breaks even on compute alone, water and minerals are upside.',
    },
  },

  {
    name: 'Franchiseen',
    color: '#c8c8c8',
    sector: 'AI Business Assistant',
    businessModel: {
      valueProp: 'Democratise franchise ownership. Retail investors buy fractional stakes in franchise businesses from $100, receiving daily and monthly payouts. Franchise operators get working capital without traditional bank lending.',
      revenueStreams: [
        { stream: 'Platform fee',       description: '1–2% fee on every franchise deal facilitated through the platform' },
        { stream: 'Payout spread',      description: 'Small spread on daily distribution processing' },
        { stream: 'Management fee',     description: '0.5% annual fee on assets under management' },
        { stream: 'Premium listings',   description: 'Franchise operators pay for featured placement and priority onboarding' },
      ],
      customerSegments: [
        { segment: 'Retail investors',      description: 'Want yield-generating investments with daily liquidity — franchise revenue is predictable' },
        { segment: 'Franchise operators',   description: 'Need capital to open or expand — want to avoid bank debt' },
        { segment: 'Franchise brands',      description: 'Want an accelerated expansion model with pre-vetted, funded operators' },
      ],
      costStructure: [
        'Platform development and hosting',
        'Payment processing and daily payout infrastructure',
        'KYC/AML compliance and legal',
        'Franchise partner acquisition and onboarding',
        'Investor acquisition and support',
      ],
      keyPartners: [
        'Payment processor (Stripe / Razorpay)',
        'KYC/AML provider',
        'Franchise brands (initial 3–5 partners)',
        'Regulatory counsel — investment platform compliance',
        'Escrow and trust account provider',
      ],
    },
    businessPlan: {
      problem: 'Franchise ownership requires $100K–$1M in capital, excluding 99% of potential investors. At the same time, franchise operators struggle to access affordable working capital. The market is inefficient on both sides.',
      solution: 'A fractional ownership platform that splits franchise investment into small units, delivers daily revenue distributions to investors, and provides operators with pooled capital at competitive terms. The platform handles the entire ownership OS — onboarding, compliance, payouts, and reporting.',
      market: [
        { label: 'Global franchise market',     size: '$3T+ annual revenue' },
        { label: 'Retail investment platforms',  size: '$1.1B+ crowdfunding market' },
        { label: 'Alternative investments',      size: '$13T AUM globally, growing 12% YoY' },
      ],
      gtm: 'Sign one franchise brand partner. Run a pilot with 50 retail investors on a single location. Execute the first payout cycle to prove the model publicly. Use proof to onboard 5 more brands in Q1 2027.',
      milestones: [
        { date: 'Q2 2026', title: 'Platform architecture complete',               done: true },
        { date: 'Q3 2026', title: 'First franchise partner agreement signed',     done: false },
        { date: 'Q3 2026', title: 'KYC/AML integration live',                    done: false },
        { date: 'Q3 2026', title: 'Investor onboarding flow complete',           done: false },
        { date: 'Q3 2026', title: 'First payout cycle executed',                 done: false },
        { date: 'Q4 2026', title: '5 franchise brands on platform',              done: false },
        { date: 'Q4 2026', title: '$100K AUM milestone',                         done: false },
        { date: 'Q1 2027', title: '10 franchise partners, $500K AUM',            done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$150K–300K (platform completion + compliance + launch)',
      fundingSource: 'Bootstrap from Codelude HoldCo + small angel round post first payout proof',
      revenueModel: [
        { label: 'Platform fee',        value: '1.5% of deal size — avg deal $50K = $750 per deal' },
        { label: 'Management fee',      value: '0.5% on AUM — $500K AUM = $2.5K/year' },
        { label: 'Payout spread',       value: 'Est. 0.05% on daily distributions' },
      ],
      year1Target:   '$30K–80K revenue on $2M+ AUM facilitated',
      breakEven:     '6–12 months post-launch (low fixed cost model)',
      notes:         'Asset-light model — Franchiseen does not own any franchise assets. Revenue scales with AUM and deal volume. Regulatory compliance is the main upfront cost and moat.',
    },
  },

  {
    name: 'HubCV',
    color: '#b5b5b5',
    sector: 'AI Career Assistant',
    businessModel: {
      valueProp: 'A resume that builds itself out of verified coursework. A school claims its hub, puts its faculty on the Assessment Program, and every test, task and attendance log gets tagged to a skill. Students leave with a dynamic, evidence-backed profile and AI guidance on which skill to deepen and which job, course, project or event to go after next — and the school gets an outcomes record it can show parents and boards.',
      revenueStreams: [
        { stream: 'Seat subscriptions (Option A)', description: 'Annual per-seat licence — $19 school, $29 college, $49 business. The hub pays at a 30% discount, or the parent pays full and the hub keeps a 30% rev-share. Platform nets the same either way. This is the primary line.' },
        { stream: 'Per-subject (Option B)',        description: 'Entry wedge for hubs not ready to commit to seats. The school sets a price from $2/subject and the platform takes a 30% service fee.' },
        { stream: 'AI credits',                    description: 'Prepaid metered credits for assistant usage beyond the bundled guidance reports. No hub share — 100% platform margin.' },
        { stream: 'Parent tipping',                description: 'Optional parent top-up to support faculty and STEM programmes. Shipped but deliberately excluded from the model as upside.' },
      ],
      customerSegments: [
        { segment: 'School principals / trusts', description: 'The actual buyer. Claims the hub with KYB documents, selects the payment model, and authorises seats across year groups.' },
        { segment: 'School chains and boards',   description: 'One agreement covers hundreds of hubs. Kendriya Vidyalaya, DAV, Narayana, Sri Chaitanya, CBSE affiliates. The only channel with real leverage.' },
        { segment: 'Faculty',                    description: 'Not the buyer, but the adopter. Runs the Assessment Program inside courses; if faculty do not use it, seats do not renew.' },
        { segment: 'Parents and students',       description: 'Pay directly under the parent_paid model, and the ones who experience the guidance output. They decide renewal sentiment.' },
      ],
      costStructure: [
        'Hub revenue share — 30% of list price under parent_paid, or a 30% discount under hub_paid',
        'AI inference — guidance reports and assistant usage, metered against credits',
        'Payment processing — ~2% of gross enrolment volume across Razorpay and Stripe',
        'Institutional sales and KYB operations — every hub claim is manually approved',
        'Platform engineering — Convex backend, directory scale, mobile shells',
      ],
      keyPartners: [
        'Faculty and assessors (the supply side and the distribution channel)',
        'Schools and colleges — hub owners who authorise the Assessment Program',
        'Razorpay and Stripe — split payouts to faculty',
        'OpenRouter / Anthropic — inference behind guidance and the credit ledger',
      ],
    },
    businessPlan: {
      problem: 'A student finishes school or college with a transcript that lists subjects and grades but proves no skill. Faculty already generate the evidence — tests, assignments, attendance, project work — and then throw it away into a mark sheet. Nobody can tell what a student can actually do, so guidance is generic and the first job is a lottery.',
      solution: 'Put the assessment itself on the platform. Faculty join the Assessment Program and log every test, task and attendance record tagged to a skill. The scoring engine folds that into a 0–100 skill level per student, and the AI reads the resulting skill graph to recommend a specialisation and the specific jobs, courses, projects and events that fit. The student pays per subject; the resume is the by-product.',
      market: [
        { label: 'Outreach universe (TAM)',   size: '1.7M Indian schools, 260M students, ~9.5M teachers' },
        { label: 'Serviceable base (SAM)',    size: '~300K private + aided schools with secondary sections' },
        { label: 'Karnataka beachhead (Y1)',  size: '77,076 schools already geocoded to 4,670 points' },
        { label: 'Y5 planned coverage (SOM)', size: '12,000 verified hubs, 2.64M seats — ~4% of the serviceable base' },
      ],
      gtm: 'Institution-led, with counselling as the door-opener. The product gates on a KYB hub claim that only an authorised representative can file and only the company team can approve, so the buyer is a principal, correspondent or trust — never an individual teacher. Free career guidance camps are how you get into the building: students get a real guidance report, the school sees its own outcomes data, and the conversation with the principal starts from evidence rather than a pitch. Karnataka for all of Y1 — 100 hubs, where the 77K-school directory is already geocoded. Then state by state. The leverage channel is chains and boards: one agreement with Kendriya Vidyalaya, DAV, Narayana or a state board covers hundreds of hubs at once and substitutes for a thousand individual sales. Camps seed and prove; chains scale. Target the ~300K private and aided schools with secondary sections — the 1.7M directory is the prospecting map, not the target list.',
      milestones: [
        { date: 'Q3 2026', title: 'Seat billing + hub_paid / parent_paid live',   done: false },
        { date: 'Q3 2026', title: 'KYB approval pipeline — under 5 days per hub', done: false },
        { date: 'Q4 2026', title: 'Mangaluru + Udupi camps — first 40 hubs',      done: false },
        { date: 'Q4 2026', title: 'AI credit ledger out of beta',                done: false },
        { date: 'Q1 2027', title: 'Karnataka Y1 target — 100 hubs, 12K seats',    done: false },
        { date: 'Q2 2027', title: 'First school chain agreement signed',          done: false },
        { date: 'Q3 2027', title: 'National directory — 1.7M schools loaded',     done: false },
        { date: 'Q4 2027', title: 'First 3 states beyond Karnataka',              done: false },
        { date: 'Q2 2028', title: 'First seat renewal cohort — measure churn',    done: false },
        { date: 'Q4 2028', title: '8 states, 2,200 active hubs',                  done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$50–60K (peak deficit ~$44K, all inside Y1)',
      fundingSource: 'Bootstrap — hubs carry delivery cost and a hub pays back inside a quarter',
      revenueModel: [
        { label: 'Seat subscriptions', value: '$19 / $29 / $49 per seat per year — platform nets $13.30 / $20.30 / $34.30' },
        { label: 'Per-subject',        value: '30% service fee on a school-set price from $2' },
        { label: 'AI credits',         value: 'Prepaid metered — 100% platform margin, no hub share' },
      ],
      year1Target:   '$104K revenue — 100 Karnataka hubs, 12,000 seats at launch pricing',
      breakEven:     'Y2 — seat renewals compound faster than fixed cost',
      notes:         'The single most useful property of the shipped pricing: the platform nets exactly the same per seat whether the hub pays at a 30% discount or the parent pays full and the hub takes a 30% rev-share. $13.30 on a school seat either way. That makes the payment model a pure sales lever with zero revenue consequence — offer whichever unblocks the deal. Per-subject is the wedge for hubs that will not commit to seats, and AI credits are the only line carrying no hub share at all, so blended margin rises with usage. Two risks dominate. First, seats are annual: this is a renewal business, and if faculty do not actually run the Assessment Program the school will not re-sign, which makes faculty adoption the leading indicator of revenue even though faculty are not the buyer. Second, every hub claim needs manual KYB approval by the company team — that is the credential moat, but it is also a hard throughput ceiling. Model it as a real cost line and staff it before it becomes the bottleneck.',
    },
  },
  {
    name: 'Nanotrade',
    color: '#adadad',
    sector: 'AI Trading Assistant',
    businessModel: {
      valueProp: 'Algorithmic trading without coding or custodial risk. Build or subscribe to strategies, let Nanotrade execute on your behalf across exchanges — your keys, your funds, automated.',
      revenueStreams: [
        { stream: 'Strategy subscription',   description: 'Access to the strategy marketplace — $29–99/month per user' },
        { stream: 'Performance fee',         description: '5–10% of net profits on managed strategy tiers (optional)' },
        { stream: 'API access',              description: 'Developer and institutional API for strategy integration — $199–499/month' },
        { stream: 'Strategy creator royalty', description: 'Strategy creators earn 30% of subscription revenue from their strategies' },
      ],
      customerSegments: [
        { segment: 'Retail traders',          description: 'Want automation without coding — currently use manual or basic bots' },
        { segment: 'Strategy creators',       description: 'Developers and quants who want to monetise their strategies' },
        { segment: 'Trading desks',           description: 'Small prop desks wanting execution infrastructure without building it' },
        { segment: 'DeFi protocols',          description: 'Protocols needing automated liquidity management' },
      ],
      costStructure: [
        'Exchange API infrastructure and rate limit management',
        'Strategy execution engine hosting',
        'Security — non-custodial key management',
        'User acquisition and community',
        'Strategy backtesting infrastructure',
      ],
      keyPartners: [
        'Centralised exchanges (Binance, Bybit, OKX)',
        'DeFi protocols (Uniswap, GMX, dYdX)',
        'Strategy creators and quant community',
        'Wallet infrastructure providers',
      ],
    },
    businessPlan: {
      problem: 'Retail traders cannot compete with algorithmic speed and discipline. Existing bots either require coding, custody funds (custodial risk), or are black-box with no transparency. The market needs non-custodial, composable, strategy-shareable automation.',
      solution: 'A non-custodial trading automation platform. Users connect their exchange API keys or DeFi wallets. They subscribe to or build strategies. Nanotrade executes on their behalf with full transparency. Strategy marketplace creates a flywheel — creators publish, users subscribe, platform earns.',
      market: [
        { label: 'Algorithmic trading market', size: '$18B+ globally' },
        { label: 'Crypto retail trading',      size: '$50B+ daily volume on major exchanges' },
        { label: 'DeFi TVL',                   size: '$50B+ — automation demand growing' },
      ],
      gtm: 'Closed beta running — validate retention and strategy performance with 50 users. Open public beta with strategy marketplace as the growth lever. Strategy creators bring their own audiences. Target 200 paying users by Q4 2026.',
      milestones: [
        { date: 'Q2 2026', title: 'Strategy engine — closed beta live',         done: true },
        { date: 'Q3 2026', title: 'Multi-exchange connector complete',          done: false },
        { date: 'Q3 2026', title: 'Public beta launch',                        done: false },
        { date: 'Q3 2026', title: 'Strategy marketplace open to creators',     done: false },
        { date: 'Q4 2026', title: '100 paying subscribers',                    done: false },
        { date: 'Q4 2026', title: 'DeFi protocol integration live',            done: false },
        { date: 'Q1 2027', title: '500 paying subscribers',                    done: false },
        { date: 'Q2 2027', title: 'Institutional API tier launched',           done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$50K–100K (infrastructure scale + marketing at launch)',
      fundingSource: 'Bootstrap — already generating closed beta revenue. Self-funding through Q3 2026, then reinvest subscription revenue.',
      revenueModel: [
        { label: 'Base subscription',    value: '$29/month × 200 users = $5.8K MRR at launch target' },
        { label: 'Pro subscription',     value: '$99/month × 50 users = $5K MRR' },
        { label: 'Performance fee',      value: '5% on profits — variable, scales with AUM' },
      ],
      year1Target:   '$120K–240K ARR at 200–400 paying users',
      breakEven:     'Already near breakeven at closed beta scale — public launch accelerates',
      notes:         'Most capital-efficient venture in the portfolio. Non-custodial model eliminates regulatory risk around fund management. Strategy marketplace creates organic growth — each creator is a distribution channel.',
    },
  },

  {
    name: 'Llife',
    color: '#a5a5a5',
    sector: 'AI Life Assistant',
    businessModel: {
      valueProp: 'One assistant for your whole life. Five domains \u2014 Finances, Education, Earnings, Mind and Body \u2014 tracked daily against your own time blocks, with the numbers pulled straight from the platforms you already use.',
      revenueStreams: [
        { stream: 'Personal subscription',  description: 'Full assistant across all five domains \u2014 $9\u201319/month per user' },
        { stream: 'Family plan',            description: 'Shared household view with per-member privacy \u2014 $29/month' },
        { stream: 'Premium insights',       description: 'Deeper net-worth, tax and goal planning on top of the base tier' },
        { stream: 'Ecosystem referral',     description: 'Qualified referrals into HubCV, Nanotrade and Franchiseen from the domains they power' },
      ],
      customerSegments: [
        { segment: 'Students',                description: 'Education domain works on day one via HubCV \u2014 the warmest acquisition channel' },
        { segment: 'Young professionals',     description: 'Juggling salary, side income, crypto and stocks with no single view of net worth' },
        { segment: 'Self-directed investors',  description: 'Already hold crypto, stocks, property and franchise stakes across disconnected apps' },
        { segment: 'Families',                description: 'Want one shared picture of finances, education and health across the household' },
      ],
      costStructure: [
        'LLM inference \u2014 daily summaries, nudges and domain reviews',
        'Integration engineering and connector maintenance',
        'Account Aggregator and financial data access fees',
        'Mobile and web development',
        'Security, privacy and compliance audits',
      ],
      keyPartners: [
        'HubCV (Education domain API \u2014 internal)',
        'Nanotrade (Job, Crypto and Stocks API \u2014 internal)',
        'Franchiseen (Franchise ownership API \u2014 internal)',
        'RBI Account Aggregator network (bank and credit data)',
        'Apple HealthKit / Google Health Connect (Body domain)',
      ],
    },
    businessPlan: {
      problem: 'A person\u2019s life is scattered across a dozen apps \u2014 one for the bank, one for stocks, one for crypto, one for coursework, one for the gym. Nobody sees the whole picture, so nothing gets reviewed and nothing compounds.',
      solution: 'An AI assistant that unifies five life domains into one daily board. Education pulls from HubCV, Earnings from Nanotrade and Franchiseen, Finances from the Account Aggregator rails, and Mind and Body from tracked routines \u2014 each mapped to a time block so the day has a shape, and the assistant reviews it with you.',
      market: [
        { label: 'Personal finance apps',     size: '$1.5B+ India, growing with UPI and AA adoption' },
        { label: 'Personal AI assistants',    size: '$15B+ and growing' },
        { label: 'Habit and productivity',    size: '$12B globally' },
      ],
      gtm: 'Launch inside the existing ecosystem first \u2014 HubCV students get Llife with their Education domain already populated, which removes the empty-state problem that kills most trackers. Expand to Earnings via Nanotrade and Franchiseen users, then open the Finances domain once Account Aggregator consent is live.',
      milestones: [
        { date: 'Q2 2026', title: 'Five-domain model defined',                  done: true  },
        { date: 'Q3 2026', title: 'HubCV Education API integration',            done: false },
        { date: 'Q4 2026', title: 'Nanotrade + Franchiseen Earnings integration', done: false },
        { date: 'Q4 2026', title: 'Daily tracker board in private beta',        done: false },
        { date: 'Q1 2027', title: 'Account Aggregator consent live',            done: false },
        { date: 'Q2 2027', title: 'Public launch with subscription tier',       done: false },
        { date: 'Q3 2027', title: '1,000 paying subscribers',                   done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$150K\u2013250K (integration engineering + inference + compliance)',
      fundingSource: 'Bootstrap through the ecosystem cross-sell, then an angel round once retention data exists from private beta.',
      revenueModel: [
        { label: 'Personal subscription', value: '$9\u201319/month \u2014 85%+ gross margin after inference' },
        { label: 'Family plan',           value: '$29/month \u2014 higher retention, lower churn' },
        { label: 'Ecosystem referral',    value: 'Qualified leads into HubCV, Nanotrade and Franchiseen' },
      ],
      year1Target:   '$40K\u2013120K revenue (500\u20131,000 subscribers post-launch)',
      breakEven:     '15\u201320 months \u2014 software margins, so volume rather than unit cost is the constraint',
      notes:         'No hardware and no inventory, so the capital need is far lower than a device business. The real risks are data-access approvals (Account Aggregator onboarding) and retention \u2014 daily trackers live or die on whether the user opens them. Seeding the Education domain from HubCV is the main defence against day-one churn.',
    },
  },
];
