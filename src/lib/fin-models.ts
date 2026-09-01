export interface MetricCard {
  label: string; value: string; sub: string; color: 'green' | 'blue' | 'amber' | 'default';
}

export interface PnLRow {
  label: string; note?: string;
  values: (number | null)[];   // Y1–Y5, null = N/A
  type: 'revenue' | 'cost' | 'total-rev' | 'total-cost' | 'ebitda' | 'margin';
}

export interface CapexRow {
  item: string; note?: string; phase: string; amount: string; highlight?: boolean;
}

export interface UnitRow {
  label: string; value: string; note?: string; type?: 'pos' | 'neg' | 'neutral';
}

export interface Assumption { label: string; value: string; }
export interface AssumptionGroup { title: string; rows: Assumption[]; }

export interface VentureModel {
  name: string; color: string; currency: string; currencySymbol: string;
  pnlCards: MetricCard[];
  capexCards: MetricCard[];
  unitCards: MetricCard[];
  pnlRows: PnLRow[];
  chartDatasets: { label: string; data: number[]; color: string; type?: 'line' }[];
  capexRows: CapexRow[];
  unitRows: UnitRow[];
  assumptions: AssumptionGroup[];
}

const Y = ['Y1', 'Y2', 'Y3', 'Y4', 'Y5'];

export const MODELS: VentureModel[] = [
  // ─────────────────────────────────────────────────────────── ROBORNS ────────
  {
    name: 'Roborns', color: '#dbdbdb', currency: 'INR', currencySymbol: '₹',
    pnlCards: [
      { label: 'Year 5 revenue',   value: '₹142 Cr', sub: '3 streams at full scale',     color: 'green' },
      { label: 'EBITDA margin Y5', value: '80%',       sub: 'Power is only COGS at PUE <1.03', color: 'blue' },
      { label: 'Break-even',       value: 'Y2',         sub: 'EBITDA positive from Year 2', color: 'amber' },
      { label: 'Y1 revenue',       value: '₹5.1 Cr',   sub: 'Compute + water (pilot)',    color: 'default' },
    ],
    capexCards: [
      { label: 'Seed round',       value: '₹18.1 Cr', sub: '~$2.1M USD — Buildings A+B', color: 'green' },
      { label: 'Series A',         value: '₹65–80 Cr', sub: 'Building C — minerals scale', color: 'blue' },
      { label: 'Capex payback',    value: '4.4 yrs',   sub: 'From first compute revenue',  color: 'amber' },
      { label: 'Seed valuation',   value: '₹60 Cr',   sub: 'Pre-money',                   color: 'default' },
    ],
    unitCards: [
      { label: 'Compute margin / MW', value: '81%',      sub: 'Power is only direct COGS at this PUE', color: 'green' },
      { label: 'Water margin',        value: '90%',       sub: 'Heat is free — only pumping + filtration', color: 'blue' },
      { label: 'Colocation rate',     value: '₹18K/kW/mo',sub: 'ESG premium vs market ₹12–14K',     color: 'amber' },
      { label: 'Water price (blend)', value: '₹8/litre', sub: '70% municipal, 30% commercial',       color: 'default' },
    ],
    pnlRows: [
      { label: 'Compute colocation', note: '2MW→4MW→8MW→10MW',     values: [3.2, 9.6, 22, 38, 82],    type: 'revenue' },
      { label: 'Water offtake',       note: '50K→100K→150K L/day',  values: [1.5, 3.6, 8.8, 16, 32],   type: 'revenue' },
      { label: 'Mineral sales',       note: 'Salt, Mg, KCl, Bromine',values: [0.4, 1.2, 6, 14, 28],    type: 'revenue' },
      { label: 'Total revenue (₹ Cr)',note: '',                       values: [5.1, 14.4, 36.8, 68, 142],type: 'total-rev' },
      { label: 'Power (grid + PPA)',  note: '₹3.8/kWh blended',     values: [2.7, 5.4, 9.8, 12, 15],   type: 'cost' },
      { label: 'Labour & operations', note: '8→15→22→28 headcount', values: [1.2, 2.2, 3.8, 5.2, 7],   type: 'cost' },
      { label: 'Maintenance',         note: 'Filters, membranes',    values: [0.4, 0.8, 1.6, 2.4, 3.8], type: 'cost' },
      { label: 'G&A, legal, insurance',note: 'Patents, CRZ',         values: [0.6, 0.9, 1.2, 1.5, 2],   type: 'cost' },
      { label: 'Total opex (₹ Cr)',   note: '',                      values: [5.0, 9.5, 16.7, 21.5, 28.3],type: 'total-cost' },
      { label: 'EBITDA (₹ Cr)',       note: '',                      values: [0.1, 4.9, 20.1, 46.5, 113.7],type: 'ebitda' },
      { label: 'EBITDA margin',        note: '',                      values: [2, 34, 55, 68, 80],         type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Compute',  data: [3.2, 9.6, 22, 38, 82],  color: '#185FA5' },
      { label: 'Water',    data: [1.5, 3.6, 8.8, 16, 32], color: '#1D9E75' },
      { label: 'Minerals', data: [0.4, 1.2, 6, 14, 28],   color: '#BA7517' },
      { label: 'Opex',     data: [5.0, 9.5, 16.7, 21.5, 28.3], color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Immersion tanks (2MW)',    note: '4 tanks × ₹95L',         phase: 'Seed',     amount: '₹3.8 Cr' },
      { item: 'Network, power, UPS',      note: 'Redundant PDUs, ATS',     phase: 'Seed',     amount: '₹1.2 Cr' },
      { item: 'Subterranean vault',        note: 'Marine-grade concrete',   phase: 'Seed',     amount: '₹2.1 Cr' },
      { item: 'Titanium heat exchangers', note: 'Alfa Laval / API',         phase: 'Seed',     amount: '₹1.8 Cr' },
      { item: 'Marine intake pipeline',   note: 'HDPE 500m, subseabed',    phase: 'Seed',     amount: '₹1.4 Cr' },
      { item: 'MED distillation skid',    note: '50,000 L/day capacity',   phase: 'Seed',     amount: '₹2.8 Cr' },
      { item: 'Filtration + mineralisation',note:'UV, RO polish, dosing',   phase: 'Seed',     amount: '₹0.9 Cr' },
      { item: 'Grid connection (10MW HT)',note: 'Incl. transformer station',phase: 'Seed',     amount: '₹1.6 Cr' },
      { item: 'Rooftop solar (500 kW)',   note: '25-yr PPA available',      phase: 'Seed',     amount: '₹2.5 Cr' },
      { item: 'Working capital + 12m opex',note:'Salaries, legal, permits', phase: 'Seed',     amount: '₹2.5 Cr' },
      { item: 'Seed total (Buildings A+B)',note:'~$2.1M USD',               phase: 'Seed',     amount: '₹18.1 Cr', highlight: true },
      { item: 'Ion-exchange membrane',    note: 'Selective Mg, K, Br',      phase: 'Series A', amount: '₹4.2 Cr' },
      { item: 'Thermal crystallization', note: 'NaCl + MgSO4 separation',  phase: 'Series A', amount: '₹2.6 Cr' },
      { item: 'ZLD secondary evaporator',note: 'Zero liquid to ocean',      phase: 'Series A', amount: '₹1.8 Cr' },
      { item: 'Series A total (Building C)',note:'Post pilot validation',    phase: 'Series A', amount: '₹65–80 Cr', highlight: true },
    ],
    unitRows: [
      { label: 'Colocation rate',       value: '₹18,000/kW/mo',  note: 'ESG premium vs market ₹12–14K. PUE <1.03.',              type: 'pos' },
      { label: 'Revenue per MW / year', value: '₹17.3 Cr',        note: '₹18K × 1000 kW × 12 mo × 80%',                          type: 'pos' },
      { label: 'Gross margin — compute',value: '81%',              note: 'Power is only direct COGS at this PUE',                  type: 'pos' },
      { label: 'Water output (Y1)',      value: '50,000 L/day',    note: 'Based on 2MW × 55°C heat, MED 8–10 L/kWh thermal',      type: 'neutral' },
      { label: 'Gross margin — water',  value: '90%',              note: 'Heat is free — only pumping + filtration consumables',   type: 'pos' },
      { label: 'Salt yield',            value: '8 t/day (Y3)',    note: 'From 150K L/day brine at 35× concentration',             type: 'neutral' },
      { label: 'Mg(OH)₂ price',        value: '₹42,000/tonne',   note: 'Technical grade import parity',                          type: 'pos' },
      { label: 'Exit scenario',         value: '10–12× EBITDA',   note: 'Implied exit value ₹1,100–1,400 Cr',                    type: 'pos' },
      { label: 'Seed investor return',  value: '18–23×',          note: 'On entry at ₹60 Cr pre-money',                          type: 'pos' },
    ],
    assumptions: [
      { title: 'Compute', rows: [{ label: 'Colocation rate', value: '₹18K/kW/mo' }, { label: 'Occupancy Y1', value: '80%' }, { label: 'PUE', value: '<1.03' }, { label: 'Scale Y1→Y5', value: '2→4→8→10→10 MW' }] },
      { title: 'Water',   rows: [{ label: 'MED efficiency', value: '8–10 L/kWh' }, { label: 'Y1 output', value: '50K L/day' }, { label: 'Municipal price', value: '₹6/L' }, { label: 'Commercial price', value: '₹12/L' }] },
      { title: 'Macro',   rows: [{ label: 'INR/USD', value: '84.5' }, { label: 'Revenue CAGR', value: '128% (Y1–Y3)' }, { label: 'Tax regime', value: '25% corp.' }, { label: 'WACC', value: '14%' }] },
    ],
  },

  // ────────────────────────────────────────────────────────── FRANCHISEEN ────
  {
    name: 'Franchiseen', color: '#c8c8c8', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 revenue',    value: '$1.26M',  sub: 'Platform fees + mgmt + spread',  color: 'green' },
      { label: 'EBITDA margin Y5',  value: '79%',      sub: 'Asset-light, low fixed cost',    color: 'blue' },
      { label: 'Break-even',        value: 'Y3',        sub: 'EBITDA positive from Year 3',   color: 'amber' },
      { label: 'Y5 AUM facilitated',value: '$60M',     sub: '50+ franchise brands on platform',color: 'default' },
    ],
    capexCards: [
      { label: 'Total capex',       value: '$200K',    sub: 'Platform dev + legal + KYC',     color: 'green' },
      { label: 'Funding needed',    value: '$150–300K',sub: 'Pre-seed SAFE, $1.5M cap',        color: 'blue' },
      { label: 'Payback period',    value: '~18 mo',   sub: 'From first platform revenue',     color: 'amber' },
      { label: 'Seed valuation',    value: '$1.5M',    sub: 'Pre-money cap on SAFE',           color: 'default' },
    ],
    unitCards: [
      { label: 'Platform fee',      value: '1.5%',     sub: 'Of every franchise deal facilitated', color: 'green' },
      { label: 'Avg deal size',     value: '$50K',     sub: 'Per franchise location investment',   color: 'blue' },
      { label: 'Revenue per deal',  value: '$750',     sub: '1.5% × $50K avg deal',               color: 'amber' },
      { label: 'Mgmt fee on AUM',   value: '0.5%/yr', sub: '$5K per $1M AUM annually',           color: 'default' },
    ],
    pnlRows: [
      { label: 'Platform fees (1.5%)',note: 'Of deals facilitated',  values: [7.5, 30, 112, 337, 810],   type: 'revenue' },
      { label: 'Management fees (0.5%)',note:'Of AUM annually',       values: [2.5, 10, 40, 125, 300],    type: 'revenue' },
      { label: 'Payout spread',        note: '0.05% on distributions',values: [0.5, 2, 8, 25, 60],       type: 'revenue' },
      { label: 'Total revenue ($K)',   note: '',                       values: [10.5, 42, 160, 487, 1170], type: 'total-rev' },
      { label: 'Platform dev & hosting',note:'Infrastructure, AWS',   values: [50, 60, 70, 80, 90],       type: 'cost' },
      { label: 'Legal & compliance',   note: 'SEBI / regulatory counsel',values: [30, 35, 40, 45, 50],   type: 'cost' },
      { label: 'KYC / AML',            note: 'Per-verification pricing', values: [5, 8, 15, 25, 40],     type: 'cost' },
      { label: 'Customer operations',  note: 'Partner support & onboarding',values: [0, 20, 40, 60, 80], type: 'cost' },
      { label: 'Total opex ($K)',       note: '',                       values: [85, 123, 165, 210, 260],  type: 'total-cost' },
      { label: 'EBITDA ($K)',           note: '',                       values: [-74.5, -81, -5, 277, 910],type: 'ebitda' },
      { label: 'EBITDA margin (%)',     note: '',                       values: [-710, -193, -3, 57, 78],   type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Platform fees', data: [7.5, 30, 112, 337, 810],  color: '#c8c8c8' },
      { label: 'Mgmt fees',     data: [2.5, 10, 40, 125, 300],   color: '#a09ae0' },
      { label: 'Spread',        data: [0.5, 2, 8, 25, 60],       color: '#c5c1f0' },
      { label: 'Opex',          data: [85, 123, 165, 210, 260],  color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Platform development',    note: 'Next.js, Convex, Crossmint, Solana', phase: 'Pre-seed', amount: '$100K' },
      { item: 'KYC / AML integration',   note: 'Onfido or Signzy API',               phase: 'Pre-seed', amount: '$30K' },
      { item: 'Legal & compliance setup',note: 'SEBI pathway, investor agreements',   phase: 'Pre-seed', amount: '$50K' },
      { item: 'Payment infrastructure',  note: 'Stripe / Razorpay escrow setup',      phase: 'Pre-seed', amount: '$20K' },
      { item: 'Total pre-seed capex',    note: 'Raise via SAFE, $1.5M cap, 20% disc.', phase: 'Pre-seed', amount: '$200K', highlight: true },
    ],
    unitRows: [
      { label: 'Average franchise deal',  value: '$50K',      note: 'Per location investment by retail investors',           type: 'neutral' },
      { label: 'Platform fee per deal',   value: '$750',      note: '1.5% × $50K',                                          type: 'pos' },
      { label: 'AUM per investor',        value: '$500 avg',  note: 'Minimum investment threshold',                          type: 'neutral' },
      { label: 'Management fee',          value: '$5K / $1M AUM',note:'0.5% per year on AUM',                                type: 'pos' },
      { label: 'Daily payout cost',       value: '~0.05%',    note: 'Processing spread on distributions — low friction',     type: 'neutral' },
      { label: 'Y3 AUM target',           value: '$8M',       note: '3–5 franchise brands, 500+ investors',                  type: 'pos' },
      { label: 'Y5 AUM target',           value: '$60M',      note: '50+ brands, 5,000+ investors',                         type: 'pos' },
      { label: 'Break-even AUM',          value: '~$11M',     note: 'Platform fees + mgmt fees cover opex at this AUM level',type: 'neutral' },
    ],
    assumptions: [
      { title: 'Revenue',   rows: [{ label: 'Platform fee', value: '1.5% of deals' }, { label: 'Mgmt fee', value: '0.5% AUM/yr' }, { label: 'Avg deal size', value: '$50K' }, { label: 'AUM growth', value: '3× / year' }] },
      { title: 'Platform',  rows: [{ label: 'Y1 brands', value: '1 (pilot)' }, { label: 'Y3 brands', value: '10' }, { label: 'Y5 brands', value: '50+' }, { label: 'Payout cadence', value: 'Daily + monthly' }] },
      { title: 'Funding',   rows: [{ label: 'Instrument', value: 'SAFE note' }, { label: 'Cap', value: '$1.5M pre-money' }, { label: 'Discount', value: '20%' }, { label: 'Target close', value: 'Post first payout proof' }] },
    ],
  },

  // ──────────────────────────────────────────────────────────────── HUBCV ────
  {
    name: 'HubCV', color: '#b5b5b5', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 revenue',    value: '$52.3M',   sub: 'Seats + per-subject + AI credits',      color: 'green' },
      { label: 'EBITDA margin Y5',  value: '61%',       sub: 'Software margin on an India cost base', color: 'blue' },
      { label: 'Break-even',        value: 'Y2',        sub: 'Seat renewals compound early',          color: 'amber' },
      { label: 'Y5 paid seats',     value: '2.64M',     sub: 'Across 12,000 institutional hubs',      color: 'default' },
    ],
    capexCards: [
      { label: 'Funding needed',    value: '$50–60K',  sub: 'Peak deficit ~$42K, all in Y1',         color: 'green' },
      { label: 'Platform net / seat',value: '$13.30',   sub: 'School — identical under both models',  color: 'blue' },
      { label: 'Active hubs Y5',    value: '12,000',   sub: '~4% of the ~300K serviceable base',     color: 'amber' },
      { label: 'Y1 revenue',        value: '$104K',     sub: 'Karnataka — 100 hubs at launch pricing',color: 'default' },
    ],
    unitCards: [
      { label: 'School seat',       value: '$19/yr',    sub: 'Hub pays $13.30, or parent pays $19',  color: 'green' },
      { label: 'College seat',      value: '$29/yr',    sub: 'Platform nets $20.30 either way',      color: 'blue' },
      { label: 'Hub rev-share',     value: '30%',       sub: 'Only when the parent pays',            color: 'amber' },
      { label: 'Seats per hub',     value: '120 → 220', sub: 'Grows as a hub expands year groups',   color: 'default' },
    ],
    pnlRows: [
      { label: 'Active hubs',             note: 'Karnataka → 8 states → pan-India',        values: [100, 600, 2200, 5500, 12000],           type: 'revenue' },
      { label: 'Paid seats',              note: '120→220 seats per hub',                   values: [12000, 90000, 396000, 1100000, 2640000],type: 'revenue' },
      { label: 'Seat subscriptions',      note: 'Option A — the primary line. Y1–Y2 discounted.', values: [88, 997, 5988, 17017, 41580],    type: 'revenue' },
      { label: 'Per-subject (Option B)',  note: '30% of ≥$2/subject — the entry wedge',    values: [9, 54, 190, 420, 700],                  type: 'revenue' },
      { label: 'AI credits',              note: '15%→42% attach, $4→$9 ARPU',              values: [7.2, 90, 665, 2888, 9979],              type: 'revenue' },
      { label: 'Total revenue ($K)',      note: '',                                        values: [104, 1141, 6843, 20325, 52259],         type: 'total-rev' },
      { label: 'Institutional sales',     note: 'Reps closing hubs — KYB, onboarding',     values: [20, 90, 300, 900, 2200],                type: 'cost' },
      { label: 'Counselling camps',       note: 'Door-opener into the principal, not faculty', values: [25, 80, 200, 400, 600],             type: 'cost' },
      { label: 'KYB & verification ops',  note: 'Company team approves every hub claim',   values: [10, 30, 90, 250, 550],                  type: 'cost' },
      { label: 'AI inference',            note: 'Bundled reports on all seats + credit COGS', values: [21, 167, 827, 2661, 7453],           type: 'cost' },
      { label: 'Payment processing',      note: '~2% of gross collected',                  values: [2.5, 28, 175, 520, 1330],               type: 'cost' },
      { label: 'Platform & hosting',      note: 'Convex, Vercel, maps at directory scale', values: [12, 50, 200, 600, 1500],                type: 'cost' },
      { label: 'Engineering team',        note: 'Full-stack, integrations, mobile',        values: [35, 150, 450, 1100, 2400],              type: 'cost' },
      { label: 'Customer success',        note: 'Renewals — seats are annual, churn is fatal', values: [0, 25, 120, 450, 1100],             type: 'cost' },
      { label: 'Marketing',               note: 'Content, chains, board relationships',    values: [5, 40, 150, 500, 1200],                 type: 'cost' },
      { label: 'State operations',        note: 'State leads, language, local compliance', values: [0, 40, 150, 400, 850],                  type: 'cost' },
      { label: 'G&A, legal',              note: 'DPDP at scale, GST, nodal accounts',      values: [15, 50, 180, 550, 1400],                type: 'cost' },
      { label: 'Total opex ($K)',         note: '',                                        values: [146, 750, 2842, 8331, 20583],           type: 'total-cost' },
      { label: 'EBITDA ($K)',             note: '',                                        values: [-42, 391, 4001, 11994, 31676],          type: 'ebitda' },
      { label: 'EBITDA margin (%)',       note: '',                                        values: [-40, 34, 58, 59, 61],                   type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Seat subscriptions', data: [88, 997, 5988, 17017, 41580], color: '#b5b5b5' },
      { label: 'Per-subject',        data: [9, 54, 190, 420, 700],        color: '#e8960a' },
      { label: 'AI credits',         data: [7.2, 90, 665, 2888, 9979],    color: '#f7b84b' },
      { label: 'Opex',               data: [146, 750, 2842, 8331, 20583], color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Institutional billing + KYB',    note: 'Seat subscriptions, hub_paid / parent_paid split payouts', phase: 'Y1', amount: '$30K' },
      { item: 'Karnataka counselling pilot',    note: '100 hubs — camps as the principal door-opener',            phase: 'Y1', amount: '$25K' },
      { item: 'Hub onboarding playbook',        note: 'KYB pack, seat rollout, faculty training per hub',         phase: 'Y1', amount: '$15K' },
      { item: 'Regional language walkthroughs', note: 'Kannada, Hindi, Tamil, Telugu, Marathi, Malayalam',        phase: 'Y2', amount: '$30K' },
      { item: 'National directory rollout',     note: '77K Karnataka → 1.7M Indian schools',                      phase: 'Y2', amount: '$40K' },
      { item: 'Total to break-even',            note: 'Bootstrap — EBITDA positive from Y2',                      phase: 'Y1–Y2', amount: '$140K', highlight: true },
    ],
    unitRows: [
      { label: 'School seat',             value: '$19/yr',       note: 'hub_paid $13.30 (30% off) — or parent pays $19, hub keeps $5.70',    type: 'pos' },
      { label: 'College seat',            value: '$29/yr',       note: 'hub_paid $20.30 — or parent pays $29, hub keeps $8.70',              type: 'pos' },
      { label: 'Business seat',           value: '$49/yr',       note: 'hub_paid $34.30 — or parent pays $49, hub keeps $14.70',             type: 'pos' },
      { label: 'Platform net per seat',   value: 'Model-neutral',note: 'Platform nets the same whether the hub or the parent pays. Payment model is a sales lever with zero revenue cost.', type: 'pos' },
      { label: 'Per-subject floor',       value: '$2 / ₹150',    note: 'Option B — school sets the price, platform takes 30%',               type: 'neutral' },
      { label: 'Parent tipping',          value: 'Enabled',      note: 'Optional top-up to support faculty and STEM — upside, not modelled', type: 'neutral' },
      { label: 'Outreach universe',       value: '1.7M schools', note: 'Full Indian directory — the prospecting map, not the target list',   type: 'neutral' },
      { label: 'Serviceable base',        value: '~300K schools',note: 'Private + aided with secondary sections — the only tier that pays',  type: 'pos' },
      { label: 'Revenue per hub',         value: '~$3,500/yr',   note: '220 seats × ~$15.75 blended platform net at Y5 scale',               type: 'pos' },
      { label: 'Hub acquisition cost',    value: '~$250',        note: 'Sales + camp + KYB, against ~$3,500/yr — payback under a quarter',   type: 'pos' },
      { label: 'Launch discount',         value: '50%',          note: 'hubcv_launch_50 — applied to Y1, tapering through Y2',               type: 'neg' },
    ],
    assumptions: [
      { title: 'Pricing',    rows: [{ label: 'Model A (primary)', value: 'Seats — $19 / $29 / $49 per year' }, { label: 'Model B (wedge)', value: 'Per subject, from $2' }, { label: 'Platform fee', value: '30% service fee' }, { label: 'Set by', value: 'Hub admin — not the individual faculty' }] },
      { title: 'Rollout',    rows: [{ label: 'Y1', value: 'Karnataka — 100 hubs' }, { label: 'Y2–Y3', value: '8 states — 2,200 hubs' }, { label: 'Y4–Y5', value: 'Pan-India — 12,000 hubs' }, { label: 'Coverage Y5', value: '~4% of serviceable base' }] },
      { title: 'Motion',     rows: [{ label: 'Buyer', value: 'Principal / trust / chain — not the teacher' }, { label: 'Gate', value: 'KYB claim + company approval' }, { label: 'Camps', value: 'Door-opener, ~21K over 5 years' }, { label: 'Chains', value: 'One deal = hundreds of hubs' }] },
      { title: 'Funding',    rows: [{ label: 'Model', value: 'Bootstrap' }, { label: 'Peak deficit', value: '~$42K in Y1' }, { label: 'Break-even', value: 'Y2' }, { label: 'External raise', value: 'Only to compress the state rollout' }] },
    ],
  },
  // ──────────────────────────────────────────────────────────────── LLIFE ────
  {
    name: 'Dextrip', color: '#adadad', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 ARR',       value: '$7.1M',    sub: 'Subscriptions + performance + API',  color: 'green' },
      { label: 'EBITDA margin Y5', value: '90%',       sub: 'Pure SaaS — minimal COGS',           color: 'blue' },
      { label: 'Break-even',       value: 'Y2',        sub: 'Already near-even at closed beta',  color: 'amber' },
      { label: 'Current MRR',      value: '$227/mo',   sub: '3 paying beta users — live now',    color: 'default' },
    ],
    capexCards: [
      { label: 'Total capex',      value: '$115K',    sub: 'Infrastructure + creator programme', color: 'green' },
      { label: 'Funding model',    value: 'Bootstrap', sub: 'Self-funded from subscription revenue', color: 'blue' },
      { label: 'Payback',          value: 'Already',  sub: 'Beta revenue covers infra today',   color: 'amber' },
      { label: 'Public beta',      value: 'Q3 2026',  sub: 'Strategy marketplace launch',       color: 'default' },
    ],
    unitCards: [
      { label: 'Blended ARPU',     value: '$65/mo',   sub: '60% base ($29) + 35% pro ($99)',   color: 'green' },
      { label: 'Pro LTV (24 mo)',  value: '$2,376',   sub: '$99 × 24 months',                  color: 'blue' },
      { label: 'Creator rev-share','value': '30%',    sub: 'Creator earns 30% of subscriber rev', color: 'amber' },
      { label: 'LTV / CAC',        value: '16×',      sub: 'Creator channel = zero CAC',       color: 'default' },
    ],
    pnlRows: [
      { label: 'Base subscriptions ($29)',  note: '20→120→480→1,500→5,000 users', values: [7, 42, 167, 522, 1740], type: 'revenue' },
      { label: 'Pro subscriptions ($99)',   note: '10→80→320→1,000→3,000 users',  values: [12, 95, 380, 1188, 3564],type: 'revenue' },
      { label: 'Performance fees (5%)',     note: 'On net profits — optional tier', values: [1, 14, 56, 175, 560],  type: 'revenue' },
      { label: 'Institutional API',         note: '$299–499/month, Y3+ only',      values: [0, 0, 77, 231, 462],   type: 'revenue' },
      { label: 'Creator rev-share (−30%)', note: 'Paid to strategy creators',      values: [0, -42, -161, -490, -1765],type: 'cost' },
      { label: 'Total net revenue ($K)',    note: '',                               values: [20, 109, 519, 1626, 4561],type: 'total-rev' },
      { label: 'Infrastructure',           note: 'Exchange APIs, compute, hosting', values: [15, 25, 40, 70, 120],  type: 'cost' },
      { label: 'Engineering team',         note: 'Platform + integrations',         values: [0, 60, 120, 200, 280], type: 'cost' },
      { label: 'Marketing',               note: 'Creator prog + paid beta launch',  values: [5, 30, 60, 100, 150],  type: 'cost' },
      { label: 'G&A',                     note: '',                                 values: [10, 15, 20, 25, 30],   type: 'cost' },
      { label: 'Total opex ($K)',          note: '',                                 values: [30, 130, 240, 395, 580],type: 'total-cost' },
      { label: 'EBITDA ($K)',             note: '',                                 values: [-10, -21, 279, 1231, 3981],type: 'ebitda' },
      { label: 'EBITDA margin (%)',        note: '',                                 values: [-50, -19, 54, 76, 87],  type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Base subs',  data: [7, 42, 167, 522, 1740],  color: '#adadad' },
      { label: 'Pro subs',   data: [12, 95, 380, 1188, 3564], color: '#e06535' },
      { label: 'Perf + API', data: [1, 14, 133, 406, 1022],  color: '#c43e00' },
      { label: 'Opex',       data: [30, 130, 240, 395, 580], color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Infrastructure scaling',     note: 'Exchange API limits, server capacity', phase: 'Y1', amount: '$20K' },
      { item: 'Creator programme launch',   note: '20 creator onboarding + materials',    phase: 'Y1', amount: '$15K' },
      { item: 'Public beta marketing',      note: 'Twitter, Discord, crypto community',   phase: 'Y1', amount: '$30K' },
      { item: 'Institutional API dev',      note: 'Higher rate limits, custom ingestion', phase: 'Y2', amount: '$50K' },
      { item: 'Total capex',               note: 'Funded entirely from subscription revenue', phase: 'Y1–Y2', amount: '$115K', highlight: true },
    ],
    unitRows: [
      { label: 'Base subscription',    value: '$29/month',    note: '60% of subscriber mix',                                     type: 'pos' },
      { label: 'Pro subscription',     value: '$99/month',    note: '35% of subscriber mix',                                     type: 'pos' },
      { label: 'Blended ARPU',         value: '$65/month',    note: 'Weighted average across all tiers',                        type: 'pos' },
      { label: 'Creator rev-share',    value: '30%',          note: 'Creator earns 30% of their subscribers\' revenue',         type: 'neutral' },
      { label: 'Net ARPU after share', value: '$45.50/month', note: 'Platform keeps 70% of creator-attributed revenue',         type: 'pos' },
      { label: 'Base LTV (24 mo)',     value: '$696',         note: '$29 × 24 months avg retention',                            type: 'pos' },
      { label: 'Pro LTV (24 mo)',      value: '$2,376',       note: '$99 × 24 months avg retention',                            type: 'pos' },
      { label: 'Creator CAC',          value: '$0',           note: 'Each creator brings their own audience — organic growth',   type: 'pos' },
    ],
    assumptions: [
      { title: 'Pricing',    rows: [{ label: 'Base', value: '$29/mo' }, { label: 'Pro', value: '$99/mo' }, { label: 'Institutional API', value: '$299–499/mo' }, { label: 'Creator rev-share', value: '30%' }] },
      { title: 'Users',      rows: [{ label: 'Current subscribers', value: '3 (beta)' }, { label: 'Public beta target', value: '200 (Q3 2026)' }, { label: 'Monthly churn', value: '<3%' }, { label: 'Creator count Y3', value: '100+' }] },
      { title: 'Model',      rows: [{ label: 'Funding', value: 'Bootstrap' }, { label: 'Exchange support', value: 'Binance, Bybit, OKX' }, { label: 'Non-custodial', value: 'Users keep keys' }, { label: 'WACC', value: '12%' }] },
    ],
  },

  // ─────────────────────────────────────────────────────────── DEXTRIP ────
  {
    name: 'Llife', color: '#a5a5a5', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 revenue',    value: '$8.95M',  sub: 'Hardware + subscription + install',  color: 'green' },
      { label: 'EBITDA margin Y5',  value: '54%',      sub: 'Subscription margin offsets hardware COGS', color: 'blue' },
      { label: 'Break-even',        value: 'Y3',        sub: 'EBITDA positive — subscription attached', color: 'amber' },
      { label: 'Y5 units sold',     value: '10,000',   sub: 'Hardware + 8,500 active subscriptions', color: 'default' },
    ],
    capexCards: [
      { label: 'Total capex',       value: '$500K',    sub: 'Hardware MOQ + firmware + pilot',    color: 'green' },
      { label: 'Integration build', value: '$120K',    sub: 'HubCV, Dextrip, Franchiseen and AA connectors', color: 'blue' },
      { label: 'Payback period',    value: '~24 mo',   sub: 'Hardware + subscription combined',  color: 'amber' },
      { label: 'Funding needed',    value: '$200–400K',sub: 'Pre-seed or property dev pre-order', color: 'default' },
    ],
    unitCards: [
      { label: 'Hub price',         value: '$499 avg', sub: '$299 basic, $599 premium tier',      color: 'green' },
      { label: 'Hardware margin',   value: '35%',       sub: '$175 contribution per unit',         color: 'blue' },
      { label: 'Subscription',      value: '$29/month', sub: '80% attach rate, 85% gross margin', color: 'amber' },
      { label: 'Unit LTV (3yr)',    value: '$1,010',    sub: '$175 hardware + $835 subscription', color: 'default' },
    ],
    pnlRows: [
      { label: 'Hardware sales',     note: '50→200→800→3,000→10,000 units', values: [25, 100, 399, 1497, 4990], type: 'revenue' },
      { label: 'AI subscriptions',   note: '$29/mo, 80% attach rate',        values: [12, 52, 226, 870, 2962],  type: 'revenue' },
      { label: 'Installation fees',  note: '$149 avg per install',            values: [5, 20, 80, 300, 1000],   type: 'revenue' },
      { label: 'Total revenue ($K)', note: '',                                values: [42, 172, 705, 2667, 8952],type: 'total-rev' },
      { label: 'Hardware COGS (65%)',note: 'Manufacturing cost',              values: [16, 65, 259, 973, 3244],  type: 'cost' },
      { label: 'AI infra',           note: 'On-device + cloud inference',     values: [10, 20, 40, 80, 150],    type: 'cost' },
      { label: 'Engineering team',   note: 'Firmware + mobile + AI',          values: [0, 100, 200, 300, 400],  type: 'cost' },
      { label: 'Marketing',          note: 'DTC + property developer channel',values: [20, 50, 100, 200, 300],  type: 'cost' },
      { label: 'G&A, support',       note: '',                                values: [15, 20, 25, 30, 40],     type: 'cost' },
      { label: 'Total opex ($K)',     note: '',                                values: [61, 255, 624, 1583, 4134],type: 'total-cost' },
      { label: 'EBITDA ($K)',         note: '',                                values: [-19, -83, 81, 1084, 4818],type: 'ebitda' },
      { label: 'EBITDA margin (%)',   note: '',                                values: [-45, -48, 11, 41, 54],   type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Hardware',      data: [25, 100, 399, 1497, 4990],  color: '#a5a5a5' },
      { label: 'Subscriptions', data: [12, 52, 226, 870, 2962],    color: '#5a9fd4' },
      { label: 'Installation',  data: [5, 20, 80, 300, 1000],      color: '#2d7ab8' },
      { label: 'Opex',          data: [61, 255, 624, 1583, 4134],  color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Integration engineering',   note: 'HubCV, Dextrip, Franchiseen connectors',   phase: 'Pre-seed', amount: '$120K' },
      { item: 'Mobile + web build',        note: 'Daily board, reviews, offline-first sync', phase: 'Pre-seed', amount: '$100K' },
      { item: 'Security & privacy audit',  note: 'Required before financial + health data',   phase: 'Pre-seed', amount: '$30K' },
      { item: '10-home pilot programme',   note: 'Mangaluru + Dubai pilot installs',          phase: 'Pre-seed', amount: '$50K' },
      { item: 'Pre-order campaign',        note: 'Creative, landing page, media',             phase: 'Pre-seed', amount: '$20K' },
      { item: 'Total capex',              note: 'Pre-order or property dev deal can fund MOQ', phase: 'Pre-seed', amount: '$500K', highlight: true },
    ],
    unitRows: [
      { label: 'Hub avg price',         value: '$499',        note: '$299 basic / $599 premium — mix shifts premium over time', type: 'pos' },
      { label: 'Hardware margin',       value: '35% ($175)',  note: 'COGS includes manufacturing + certification + shipping',   type: 'pos' },
      { label: 'Subscription price',    value: '$29/month',   note: 'AI layer — 80% attach rate at launch',                    type: 'pos' },
      { label: 'Subscription margin',   value: '85%',         note: 'After AI inference costs',                                type: 'pos' },
      { label: 'Unit LTV (3yr)',        value: '$1,010',      note: '$175 hardware + ($29 × 0.85 × 36) = $885 sub margin',    type: 'pos' },
      { label: 'B2B pre-install price', value: '$399/unit',  note: 'Property developer channel — volume discount',            type: 'neutral' },
      { label: 'MOQ break-even',        value: '2,150 units', note: 'To recover $300K MOQ at 35% hardware margin',            type: 'neutral' },
      { label: 'Sub break-even',        value: '1,200 subs',  note: 'Subscription revenue covers AI infra + engineering',     type: 'neutral' },
    ],
    assumptions: [
      { title: 'Hardware',    rows: [{ label: 'Hub price (avg)', value: '$499' }, { label: 'COGS', value: '65%' }, { label: 'MOQ', value: '1,000 units' }, { label: 'Attach rate (sub)', value: '80%' }] },
      { title: 'Subscription',rows: [{ label: 'Monthly price', value: '$29' }, { label: 'Gross margin', value: '85%' }, { label: 'Churn (monthly)', value: '<2%' }, { label: 'LTV', value: '$835 over 36 mo' }] },
      { title: 'Go-to-market', rows: [{ label: 'Pilot homes', value: '10 (Y1)' }, { label: 'DTC launch', value: 'Y2' }, { label: 'Property dev', value: 'Y2 channel' }, { label: 'SE Asia', value: 'Y4+' }] },
    ],
  },
];
