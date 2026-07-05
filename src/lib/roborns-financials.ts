// ─── ROBORNS — INFRASTRUCTURE DEVELOPER MODEL ─────────────────────────────
//
// Income model for Shawaz (Sponsor/Developer of Roborns)
// Three income channels: Development Fee + Sponsor Equity + Management Fee
// Per standard infrastructure project developer model.
//
// Last updated: 2026-06-13

export interface IncomeChannel {
  name: string;
  type: 'fee' | 'equity' | 'management' | 'exit';
  description: string;
  rate: string;
  timing: string;
  totalProjection: string;
}

export interface AnnualProjection {
  year: number;
  label: string;
  devFeeIncome: number;   // ₹ Cr
  mgmtFeeIncome: number;  // ₹ Cr
  dividendIncome: number; // ₹ Cr
  totalIncome: number;    // ₹ Cr
  cumulative: number;     // ₹ Cr
  notes: string;
}

export interface DeveloperModel {
  totalRaise: number;        // ₹420 Cr
  devFeeRate: number;        // 0.06 = 6%
  sponsorEquityPct: number;  // 0.25 = 25%
  mgmtFeeRate: number;       // 0.015 = 1.5%
  totalDevFee: number;       // calculated
  sponsorValue: number;      // calculated
  annualMgmtFee: number;     // calculated
  annualDividend: number;    // calculated
  channels: IncomeChannel[];
  projection: AnnualProjection[];
}

const DEV_FEE_RATE = 0.06;
const SPONSOR_EQUITY = 0.25;
const MGMT_FEE_RATE = 0.015;

const TOTAL_RAISE = 420;        // Cr
const FULL_REVENUE = 180;       // Cr/yr at full buildout
const FULL_OPEX = 54;           // Cr/yr
const FULL_PROFIT = 126;        // Cr/yr

export const ROBORNS_DEVELOPER_MODEL: DeveloperModel = {
  totalRaise: TOTAL_RAISE,
  devFeeRate: DEV_FEE_RATE,
  sponsorEquityPct: SPONSOR_EQUITY,
  mgmtFeeRate: MGMT_FEE_RATE,

  totalDevFee: Math.round(TOTAL_RAISE * DEV_FEE_RATE * 100) / 100,  // ₹25.2 Cr
  sponsorValue: Math.round(TOTAL_RAISE * SPONSOR_EQUITY * 100) / 100, // ₹105 Cr
  annualMgmtFee: Math.round(FULL_REVENUE * MGMT_FEE_RATE * 100) / 100, // ₹2.7 Cr/yr
  annualDividend: Math.round(FULL_PROFIT * SPONSOR_EQUITY * 100) / 100, // ₹31.5 Cr/yr

  channels: [
    {
      name: 'Development Fee',
      type: 'fee',
      description:
        'Standard 6% fee on all capital raised. Paid as you close tranches.',
      rate: '6% of ₹420 Cr = ₹25.2 Cr total',
      timing: 'Years 1–5, paid per tranche close. Monthly/quarterly draws.',
      totalProjection: '₹25.2 Cr over 5 years',
    },
    {
      name: 'Sponsor Equity',
      type: 'equity',
      description:
        'Retain 25% equity after selling 75% to investors. Entitled to dividends and exit proceeds.',
      rate: '25% of company equity. ₹105 Cr at ₹420 Cr valuation.',
      timing:
        'Dividends from Year 4+ (Phase 1 operational). Full dividends from Year 7+. Exit optional from Year 7.',
      totalProjection: '₹31.5 Cr/yr dividends + ₹252 Cr exit upside',
    },
    {
      name: 'Management Fee',
      type: 'management',
      description:
        'Ongoing operations management fee after construction. 1.5% of gross revenue.',
      rate: '1.5% of revenue = ₹2.7 Cr/yr at full buildout',
      timing: 'Starts Year 4 (Phase 1 online). Scales with revenue growth.',
      totalProjection: '₹2.7 Cr/yr ongoing (scales with MW)',
    },
    {
      name: 'Exit / Sale',
      type: 'exit',
      description:
        'Sell sponsor equity to infrastructure REIT, strategic buyer, or via IPO at 8× EBITDA.',
      rate: '8× EBITDA @ full scale: ₹1,008 Cr total → 25% share = ₹252 Cr',
      timing: 'Exit window opens Year 7–10. Option to hold and collect dividends indefinitely.',
      totalProjection: '₹252 Cr lump sum (optional — no compulsion to sell)',
    },
  ],

  projection: [
    {
      year: 1,
      label: '2026',
      devFeeIncome: 0.54,
      mgmtFeeIncome: 0,
      dividendIncome: 0,
      totalIncome: 0.54,
      cumulative: 0.54,
      notes: 'Seed fundraising (₹9 Cr raised). Dev fee at 6%. Site survey, thermal partner engagement.',
    },
    {
      year: 2,
      label: '2027',
      devFeeIncome: 2.34,
      mgmtFeeIncome: 0,
      dividendIncome: 0,
      totalIncome: 2.34,
      cumulative: 2.88,
      notes: 'Phase 1 anchoring (₹39 Cr raised). Kapu construction begins. Dev fee at 6%.',
    },
    {
      year: 3,
      label: '2028',
      devFeeIncome: 6.0,
      mgmtFeeIncome: 0.3,
      dividendIncome: 0,
      totalIncome: 6.3,
      cumulative: 9.18,
      notes: 'Phase 1 online (2MW Kapu). Raise ₹100 Cr for build expansion. Mgmt fee: 1.5% of ₹20 Cr (partial year). Dev fee on Q3/Q4 closes.',
    },
    {
      year: 4,
      label: '2029',
      devFeeIncome: 9.0,
      mgmtFeeIncome: 1.2,
      dividendIncome: 0,
      totalIncome: 10.2,
      cumulative: 19.38,
      notes: 'Hejamadi builds. Revenue scaling to ~₹80 Cr. Mgmt fee: 1.5% of full year revenue. Dev fee on larger ₹150 Cr tranche.',
    },
    {
      year: 5,
      label: '2030',
      devFeeIncome: 7.32,
      mgmtFeeIncome: 2.0,
      dividendIncome: 0,
      totalIncome: 9.32,
      cumulative: 28.70,
      notes: 'Final raise closes. Kapu full 20MW + Hejamadi 5MW online. Revenue ~₹135 Cr. Mgmt fee: 1.5%. Dev fee on remaining tranches.',
    },
    {
      year: 6,
      label: '2031',
      devFeeIncome: 0,
      mgmtFeeIncome: 2.4,
      dividendIncome: 0,
      totalIncome: 2.4,
      cumulative: 31.10,
      notes: 'Full 65MW buildout complete H2. Revenue ~₹160 Cr. Mgmt fee at 1.5%. No more dev fees.',
    },
    {
      year: 7,
      label: '2032',
      devFeeIncome: 0,
      mgmtFeeIncome: 2.7,
      dividendIncome: 15.75,
      totalIncome: 18.45,
      cumulative: 49.55,
      notes: 'Full steady state. Revenue ₹180 Cr. Mgmt fee ₹2.7 Cr. Dividends at 50% of ₹126 Cr profit × 25% = ₹15.75 Cr.',
    },
    {
      year: 8,
      label: '2033',
      devFeeIncome: 0,
      mgmtFeeIncome: 2.7,
      dividendIncome: 22.05,
      totalIncome: 24.75,
      cumulative: 74.30,
      notes: 'Steady state. Dividends at 70% payout = ₹22 Cr. Mgmt fee ₹2.7 Cr. Retain ₹9.5 Cr for reinvestment.',
    },
    {
      year: 9,
      label: '2034',
      devFeeIncome: 0,
      mgmtFeeIncome: 2.7,
      dividendIncome: 28.35,
      totalIncome: 31.05,
      cumulative: 105.35,
      notes: 'Steady state. Dividends at 90% payout = ₹28.35 Cr. Mgmt fee ₹2.7 Cr.',
    },
    {
      year: 10,
      label: '2035',
      devFeeIncome: 0,
      mgmtFeeIncome: 2.7,
      dividendIncome: 28.35,
      totalIncome: 31.05,
      cumulative: 136.40,
      notes: 'Steady state. Consider exit: sell 25% at 8× EBITDA = ₹252 Cr. Total income with exit: ~₹388 Cr.',
    },
  ],
};

// ─── WATERFALL SUMMARY ─────────────────────────────────────────────────────

export interface WaterfallTranche {
  label: string;
  pctOfProfit: number; // 0–100
  description: string;
  priority: number; // 1 = first to be paid
}

export const ROBORNS_WATERFALL: WaterfallTranche[] = [
  {
    label: 'Operating Expenses',
    pctOfProfit: 30,
    description: 'Staff, electricity, maintenance, water treatment consumables, insurance.',
    priority: 1,
  },
  {
    label: 'Debt Service',
    pctOfProfit: 10,
    description: 'Interest on project debt (if any). Estimated ₹12.6 Cr/yr at 8% on ₹150 Cr debt.',
    priority: 2,
  },
  {
    label: 'Investor Preferred Return',
    pctOfProfit: 30,
    description: '8% preferred return to equity investors (tranche A). This comes before sponsor distributions.',
    priority: 3,
  },
  {
    label: 'Investor Performance Split',
    pctOfProfit: 20,
    description: '70/30 split of remaining profit after pref return — 70% to investors, 30% to sponsor (your equity incentive).',
    priority: 4,
  },
  {
    label: 'Sponsor Dividend',
    pctOfProfit: 10,
    description: 'Your share after pref returns and performance split. This layers on top of your management fee and dev fee.',
    priority: 5,
  },
];

// ─── INCOME SUMMARY ────────────────────────────────────────────────────────

export interface IncomeSummary {
  phase: string;
  period: string;
  yourMonthlyIncome: string;
  yourAnnualIncome: string;
  source: string;
}

export const ROBORNS_INCOME_SUMMARY: IncomeSummary[] = [
  {
    phase: 'Seed Fundraising',
    period: '2026',
    yourMonthlyIncome: '₹3–5 L/mo',
    yourAnnualIncome: '₹30–60 L',
    source: 'Development fee on seed closes (₹9 Cr × 6%)',
  },
  {
    phase: 'Phase 1 Construction',
    period: '2027–2028',
    yourMonthlyIncome: '₹10–15 L/mo',
    yourAnnualIncome: '₹1.2–1.8 Cr',
    source: 'Development fee on Phase 1 raise (₹42 Cr × 6% over 18 mo)',
  },
  {
    phase: 'Full Build Fundraising',
    period: '2028–2030',
    yourMonthlyIncome: '₹50–75 L/mo',
    yourAnnualIncome: '₹6–9 Cr',
    source: 'Development fee on full raise (₹378 Cr × 6% over 3 yrs)',
  },
  {
    phase: 'Early Operations',
    period: '2030–2031',
    yourMonthlyIncome: '₹18–25 L/mo',
    yourAnnualIncome: '₹2.2–3 Cr',
    source: 'Management fee (1.5% of ₹80–160 Cr) + minimal dev fees',
  },
  {
    phase: 'Steady State',
    period: '2032+',
    yourMonthlyIncome: '₹1.5–2.6 Cr/mo',
    yourAnnualIncome: '₹18–31 Cr',
    source: 'Dividends (25% of profit) + Mgmt fee (1.5% of rev)',
  },
];
