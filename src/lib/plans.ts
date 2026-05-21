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
    color: '#5DCAA5',
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
    color: '#7F77DD',
    sector: 'Franchise Finance OS',
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
    color: '#FAC775',
    sector: 'AI Career Intelligence',
    businessModel: {
      valueProp: 'Skills verified by humans, enriched by AI. Dynamic profiles that reflect what professionals can actually do — not what they claim. Recruiter gets the right hire faster. Professional gets seen before the market moves.',
      revenueStreams: [
        { stream: 'Recruiter subscription',  description: 'SaaS access to verified candidate pool — $99–299/month per seat' },
        { stream: 'Professional premium',    description: 'Professionals pay for advanced profile, skill tracking, and job alerts — $9–29/month' },
        { stream: 'Placement fee',           description: '5–10% of first-year salary on successful placements (optional tier)' },
        { stream: 'Skills assessment API',   description: 'Sell verification infrastructure to bootcamps and universities' },
      ],
      customerSegments: [
        { segment: 'Recruiters',             description: 'Need pre-verified, job-ready candidates — willing to pay for quality signal' },
        { segment: 'Working professionals',  description: 'Want their real skills surfaced before job-hopping or being approached' },
        { segment: 'Bootcamps/universities', description: 'Want verified outcomes for their graduates' },
        { segment: 'Hiring companies',       description: 'Want to reduce time-to-hire and mis-hire cost' },
      ],
      costStructure: [
        'AI infrastructure — matching engine and profile enrichment',
        'Human verifier network — assessors paid per verification',
        'Platform development — recruiter and professional portals',
        'Recruiter and professional acquisition',
      ],
      keyPartners: [
        'Recruitment agencies (early distribution)',
        'Coding bootcamps and universities',
        'LinkedIn / job board integrations',
        'Skills assessment providers',
      ],
    },
    businessPlan: {
      problem: 'Resumes are self-reported and static. Recruiters waste 30–40% of screening time on unqualified candidates. Professionals are invisible until they actively job-hunt. The market has no verified, real-time skill signal.',
      solution: 'Dynamic profiles combining AI analysis (project history, code quality, role trajectory) with human verification (structured assessments by domain experts). Profiles update continuously. Recruiters subscribe to search this pool. Professionals control their visibility.',
      market: [
        { label: 'Global recruiting market',    size: '$760B — agencies, platforms, software' },
        { label: 'Online career platforms',     size: '$28B, LinkedIn alone $15B revenue' },
        { label: 'Skills & training market',    size: '$370B globally' },
      ],
      gtm: 'B2B first — sign 5 recruiting agencies as design partners at discounted rates. Use their feedback to validate the matching quality. Simultaneously build the professional waitlist through content marketing. Prove 3 placements, then open public access.',
      milestones: [
        { date: 'Q3 2026', title: 'Matching engine core complete',                done: false },
        { date: 'Q3 2026', title: 'Human verification workflow built',             done: false },
        { date: 'Q4 2026', title: 'First recruiter design partner signed',        done: false },
        { date: 'Q4 2026', title: '100-professional beta cohort live',            done: false },
        { date: 'Q1 2027', title: 'First 3 placements completed',                done: false },
        { date: 'Q1 2027', title: 'Public launch — open professional sign-up',   done: false },
        { date: 'Q2 2027', title: '1,000 verified profiles',                      done: false },
        { date: 'Q2 2027', title: '20 paying recruiter accounts',                done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$80K–150K (AI infra + verifier network bootstrap)',
      fundingSource: 'Bootstrap — low capex until first recruiter revenue, then reinvest',
      revenueModel: [
        { label: 'Recruiter subscriptions', value: '$99–299/seat/month — target 20 accounts = $2K–6K MRR' },
        { label: 'Professional premium',    value: '$9–29/month — target 500 users = $4.5K–14.5K MRR' },
        { label: 'Placement fees',          value: '5% on avg $60K salary = $3K per placement' },
      ],
      year1Target:   '$60K–120K ARR from recruiter + premium subscriptions',
      breakEven:     '12–18 months (driven by recruiter subscription scale)',
      notes:         'Human verifier network is the key moat — competitors cannot replicate AI+human verification at speed without the infrastructure. Build the verifier layer first, everything else follows.',
    },
  },

  {
    name: 'Cuestay',
    color: '#85B7EB',
    sector: 'Home AI Automation',
    businessModel: {
      valueProp: 'Your home learns your routines and acts before you ask. Not remote controls — intelligence. One hub, unified AI, every device coordinated. Hardware + AI subscription model.',
      revenueStreams: [
        { stream: 'Hardware sales',         description: 'Cuestay Hub device — $299–599 per unit, 35% margin' },
        { stream: 'AI subscription',        description: 'Monthly AI layer access — $19–49/month per home' },
        { stream: 'Installation & setup',   description: 'Professional setup service — $99–199 flat fee' },
        { stream: 'Developer API',          description: 'License the ambient intelligence API to property developers and hotels' },
      ],
      customerSegments: [
        { segment: 'Homeowners',              description: 'Tech-forward homeowners wanting a genuinely intelligent home, not gadgets' },
        { segment: 'Property developers',     description: 'Want smart home as a built-in premium for new builds' },
        { segment: 'Hotels and hospitality',  description: 'Need ambient intelligence for guest experience personalisation' },
        { segment: 'Smart home enthusiasts',  description: 'Already have devices — want a unified intelligence layer on top' },
      ],
      costStructure: [
        'Hardware manufacturing and supply chain',
        'AI infrastructure — on-device + cloud inference',
        'Mobile and firmware development',
        'Support and installation network',
        'Hardware partner and manufacturer relationship',
      ],
      keyPartners: [
        'Hardware manufacturer (contract manufacturing)',
        'Matter protocol ecosystem (Apple, Google, Amazon)',
        'IoT device brands (compatibility integrations)',
        'Property developers (B2B channel)',
        'Electricity / energy management APIs',
      ],
    },
    businessPlan: {
      problem: 'Smart homes exist but are not intelligent. They require manual configuration, don\'t anticipate needs, and fragment across 10 different apps. The promise of a home that works for you has not been delivered.',
      solution: 'A central AI hub that passively learns household routines, integrates all existing devices via Matter protocol, and proactively acts — adjusting temperature before you wake, ordering groceries before you run out, alerting you before a maintenance issue becomes a problem.',
      market: [
        { label: 'Smart home market',         size: '$174B by 2025, 25% CAGR' },
        { label: 'Personal AI assistants',    size: '$15B+ and growing' },
        { label: 'Property tech (PropTech)',  size: '$86B globally' },
      ],
      gtm: 'Start with 10 pilot homes in Mangaluru and Dubai — one in each key market. Document the experience. Build video testimonials. Launch a waitlist with a pre-order incentive. Use property developer channel for B2B scale.',
      milestones: [
        { date: 'Q2 2026', title: 'Protocol specification published',           done: true },
        { date: 'Q3 2026', title: 'Hardware manufacturing partner identified',  done: false },
        { date: 'Q4 2026', title: 'Hardware partner agreement signed',          done: false },
        { date: 'Q4 2026', title: 'AI assistant core development begins',       done: false },
        { date: 'Q1 2027', title: '10 pilot home installations',               done: false },
        { date: 'Q2 2027', title: 'DTC launch with pre-order campaign',        done: false },
        { date: 'Q3 2027', title: '100 units sold — subscription revenue live',done: false },
      ],
    },
    financialPlan: {
      fundingNeed:   '$200K–400K (hardware MOQ + firmware + AI infra)',
      fundingSource: 'Bootstrap + angel round after pilot proof. Potential property developer pre-order deal to fund first MOQ.',
      revenueModel: [
        { label: 'Hardware (Hub)',       value: '$299–599 unit — 35% margin = $105–210 per unit' },
        { label: 'AI subscription',     value: '$19–49/month — 80%+ gross margin' },
        { label: 'Installation',        value: '$99–199 flat fee' },
      ],
      year1Target:   '$50K–150K revenue (50–100 units + subscriptions post-launch)',
      breakEven:     '18–24 months — hardware requires volume for margin improvement',
      notes:         'Hardware minimum order quantity (MOQ) is the main capital constraint. Pre-order campaign or property developer anchor deal eliminates this risk. Subscription margin improves unit economics significantly post-launch.',
    },
  },

  {
    name: 'Dextrip',
    color: '#F0997B',
    sector: 'Decentralised Trading Automation',
    businessModel: {
      valueProp: 'Algorithmic trading without coding or custodial risk. Build or subscribe to strategies, let Dextrip execute on your behalf across exchanges — your keys, your funds, automated.',
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
      solution: 'A non-custodial trading automation platform. Users connect their exchange API keys or DeFi wallets. They subscribe to or build strategies. Dextrip executes on their behalf with full transparency. Strategy marketplace creates a flywheel — creators publish, users subscribe, platform earns.',
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
];
