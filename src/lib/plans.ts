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
