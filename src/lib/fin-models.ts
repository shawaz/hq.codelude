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
    name: 'Roborns', color: '#5DCAA5', currency: 'INR', currencySymbol: '₹',
    pnlCards: [
      { label: 'Year 5 revenue',   value: '₹142 Cr', sub: '3 streams at full scale',                        color: 'green' },
      { label: 'EBITDA margin Y5', value: '83%',       sub: 'PPA at ₹3.0/kWh — MESCOM HT grid, PUE <1.03',  color: 'blue' },
      { label: 'Break-even',       value: 'Y1',         sub: 'EBITDA positive from Year 1 on PPA pricing',    color: 'amber' },
      { label: 'Y1 revenue',       value: '₹5.1 Cr',   sub: 'Compute + water + minerals (all 3 live Y1)',    color: 'default' },
    ],
    capexCards: [
      { label: 'Total raise',      value: '₹25 Cr',    sub: '~$2.96M USD — Civil + pipelines + all 3 buildings', color: 'green' },
      { label: 'Buildings funded', value: 'A + B + C',  sub: 'Zero-waste loop complete from day 1',               color: 'blue' },
      { label: 'Capex payback',    value: '3 yrs',      sub: 'Cumulative EBITDA clears ₹25 Cr in Year 3',         color: 'amber' },
      { label: 'Pre-money',        value: '₹75 Cr',    sub: 'Single-round seed valuation',                       color: 'default' },
    ],
    unitCards: [
      { label: 'Compute margin / MW', value: '84%',       sub: '₹3.0/kWh PPA (MESCOM HT), PUE <1.03',         color: 'green' },
      { label: 'Water margin',        value: '90%',        sub: 'Heat is free — only pumping + filtration',     color: 'blue' },
      { label: 'Colocation rate',     value: '₹18K/kW/mo', sub: 'ESG premium — E2E Networks / Yotta targets',   color: 'amber' },
      { label: 'Water price (blend)', value: '₹8/litre',  sub: '70% municipal, 30% commercial',                color: 'default' },
    ],
    pnlRows: [
      { label: 'Compute colocation', note: '2MW→4MW→8MW→10MW',     values: [3.2, 9.6, 22, 38, 82],    type: 'revenue' },
      { label: 'Water offtake',       note: '50K→100K→150K L/day',  values: [1.5, 3.6, 8.8, 16, 32],   type: 'revenue' },
      { label: 'Mineral sales',       note: 'Salt, Mg, KCl, Bromine',values: [0.4, 1.2, 6, 14, 28],    type: 'revenue' },
      { label: 'Total revenue (₹ Cr)',note: '',                       values: [5.1, 14.4, 36.8, 68, 142],type: 'total-rev' },
      { label: 'Power (MESCOM HT grid)',     note: '₹3.0/kWh PPA rate — 100% grid, no on-site solar', values: [2.2, 4.4, 7.8, 9.6, 11.9],  type: 'cost' },
      { label: 'Labour & operations',    note: '9→15→22→28 headcount · all 3 buildings live day 1 · see Positions (R01–R28)', values: [1.3, 2.2, 3.8, 5.2, 7], type: 'cost' },
      { label: 'Maintenance',            note: 'Filters, membranes, LANXESS resin',values: [0.4, 0.8, 1.6, 2.4, 3.8], type: 'cost' },
      { label: 'G&A, legal, insurance',  note: 'Patents, CRZ, DIFC counsel',      values: [0.6, 0.9, 1.2, 1.5, 2],    type: 'cost' },
      { label: 'Total opex (₹ Cr)',      note: '',                                 values: [4.5, 8.3, 14.4, 18.7, 24.7], type: 'total-cost' },
      { label: 'EBITDA (₹ Cr)',          note: '',                                 values: [0.6, 6.1, 22.4, 49.3, 117.3], type: 'ebitda' },
      { label: 'EBITDA margin',          note: '',                                 values: [12, 42, 61, 73, 83],          type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Compute',  data: [3.2, 9.6, 22, 38, 82],  color: '#185FA5' },
      { label: 'Water',    data: [1.5, 3.6, 8.8, 16, 32], color: '#1D9E75' },
      { label: 'Minerals', data: [0.4, 1.2, 6, 14, 28],   color: '#BA7517' },
      { label: 'Opex',     data: [4.5, 8.3, 14.4, 18.7, 24.7], color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: '— Building A: Compute (Immersion DC) —',          note: '',                                                    phase: 'Seed', amount: '' },
      { item: 'Immersion tanks (2MW, 3×)',                        note: 'GRC ICEtank / LiquidStack — competitive RFQ',         phase: 'Seed', amount: '₹3.2 Cr' },
      { item: 'Network, power, UPS',                              note: 'Redundant PDUs, ATS',                                 phase: 'Seed', amount: '₹1.2 Cr' },
      { item: 'Subterranean vault',                               note: 'Marine-grade concrete — Afcons / L&T',                phase: 'Seed', amount: '₹2.1 Cr' },
      { item: 'Above-ground building (PEB steel)',                note: 'Secure compute shell — Kirby / Pennar India',         phase: 'Seed', amount: '₹0.4 Cr' },
      { item: 'Grid connection (10MW HT)',                        note: 'Incl. transformer station — MESCOM',                  phase: 'Seed', amount: '₹1.6 Cr' },
      { item: 'Building A subtotal',                              note: 'Immersion DC + power infra + structure',              phase: 'Seed', amount: '₹8.5 Cr', highlight: true },
      { item: '— Building B: Water (Desalination) —',            note: '',                                                    phase: 'Seed', amount: '' },
      { item: 'Marine intake pipeline (sea → B)',                 note: 'Finolex HDPE DN300 PN16, 500m subseabed intake',      phase: 'Seed', amount: '₹1.4 Cr' },
      { item: 'Titanium heat exchangers',                         note: 'Alfa Laval titanium PHE — 2MW thermal duty',          phase: 'Seed', amount: '₹1.8 Cr' },
      { item: 'MED distillation skid',                            note: 'VA Tech Wabag MED-TVC 50,000 L/day',                  phase: 'Seed', amount: '₹3.2 Cr' },
      { item: 'Filtration + mineralisation',                      note: 'Ion Exchange India — UV, RO polish, dosing',          phase: 'Seed', amount: '₹0.9 Cr' },
      { item: 'Building B civil shell (PEB)',                     note: 'Process building — Kirby / Pennar India',             phase: 'Seed', amount: '₹0.6 Cr' },
      { item: 'Building B subtotal',                              note: 'Desalination + purification + structure',             phase: 'Seed', amount: '₹7.9 Cr', highlight: true },
      { item: '— Building C: Minerals (Zero-Waste Loop) —',      note: '',                                                    phase: 'Seed', amount: '' },
      { item: 'Ion-exchange columns',                             note: 'LANXESS Lewatit — Mg²⁺, K⁺, Br⁻ selective pilot',   phase: 'Seed', amount: '₹1.5 Cr' },
      { item: 'Thermal crystallization',                          note: 'NaCl + MgSO₄ compact unit — HRS/SPX Flow',           phase: 'Seed', amount: '₹1.0 Cr' },
      { item: 'ZLD secondary evaporator',                         note: 'Zero liquid discharge — Praj Industries scope',      phase: 'Seed', amount: '₹0.9 Cr' },
      { item: 'Building C civil shell (PEB)',                     note: 'Mineral processing building — Kirby / Pennar India', phase: 'Seed', amount: '₹0.4 Cr' },
      { item: 'Building C subtotal',                              note: 'Closes the zero-waste loop + structure',              phase: 'Seed', amount: '₹3.8 Cr', highlight: true },
      { item: '— Pipelines & Site Infrastructure —',              note: '',                                                    phase: 'Seed', amount: '' },
      { item: 'Sea → Building A coolant branch',                  note: 'HDPE 150mm, 200m, pump skid — Finolex / Astral',     phase: 'Seed', amount: '₹0.4 Cr' },
      { item: 'A ↔ B thermal loop pipeline',                      note: 'Insulated SS pipe rack, 200m — Forbes Marshall',     phase: 'Seed', amount: '₹0.5 Cr' },
      { item: 'B → C brine transfer pipeline',                    note: 'Chemical-resistant HDPE — Finolex',                  phase: 'Seed', amount: '₹0.3 Cr' },
      { item: 'Site civil (roads, drainage, wall)',               note: 'Compound perimeter, CRZ coastal hardstand, drainage', phase: 'Seed', amount: '₹0.3 Cr' },
      { item: 'Pipelines & site subtotal',                        note: 'All inter-building connections + campus works',       phase: 'Seed', amount: '₹1.5 Cr', highlight: true },
      { item: '— Shared —',                                        note: '',                                                    phase: 'Seed', amount: '' },
      { item: 'Working capital + 12m opex',                       note: 'Salaries, legal, permits — 100% grid supply (MESCOM HT)', phase: 'Seed', amount: '₹3.3 Cr' },
      { item: 'Total raise — all 3 buildings',                    note: '~$2.96M USD · Civil + pipelines · Zero-waste loop from day 1', phase: 'Seed', amount: '₹25 Cr', highlight: true },
    ],
    unitRows: [
      { label: 'Colocation rate',         value: '₹18,000/kW/mo',  note: 'ESG premium — E2E Networks / Yotta target accounts; market ₹12–14K', type: 'pos' },
      { label: 'Revenue per MW / year',  value: '₹17.3 Cr',       note: '₹18K × 1000 kW × 12 mo × 80% occupancy',                             type: 'pos' },
      { label: 'Gross margin — compute', value: '84%',             note: '₹3.0/kWh PPA (MESCOM HT grid), PUE <1.03 — no on-site solar',         type: 'pos' },
      { label: 'Water output (Y1)',       value: '50,000 L/day',   note: 'VA Tech Wabag MED-TVC skid — 2MW × 55°C heat, 8–10 L/kWh thermal',   type: 'neutral' },
      { label: 'Gross margin — water',   value: '90%',             note: 'Heat is free — only Finolex/Astral pumping + Ion Exchange consumables', type: 'pos' },
      { label: 'Salt yield',             value: '8 t/day (Y3)',   note: 'Tata Chemicals / GHCL offtake — 150K L/day brine at 35× concentration', type: 'neutral' },
      { label: 'Mg(OH)₂ price',         value: '₹42,000/tonne',  note: 'Technical grade — LANXESS / Chemspec import parity benchmark',          type: 'pos' },
      { label: 'Exit scenario',          value: '10–12× EBITDA',  note: 'Implied exit value ₹1,173–₹1,408 Cr on Y5 EBITDA ₹117.3 Cr',          type: 'pos' },
      { label: 'Seed investor return',   value: '12–14×',         note: 'On ₹25 Cr entry at ₹75 Cr pre-money (25% stake) — Y5 EBITDA exit',     type: 'pos' },
    ],
    assumptions: [
      { title: 'Compute', rows: [{ label: 'Colocation rate', value: '₹18K/kW/mo' }, { label: 'Occupancy Y1', value: '80%' }, { label: 'PUE', value: '<1.03' }, { label: 'Scale Y1→Y5', value: '2→4→8→10→10 MW' }] },
      { title: 'Water',   rows: [{ label: 'MED vendor', value: 'VA Tech Wabag' }, { label: 'MED efficiency', value: '8–10 L/kWh' }, { label: 'Municipal price', value: '₹6/L' }, { label: 'Commercial price', value: '₹12/L' }] },
      { title: 'Opex',    rows: [{ label: 'Power rate', value: '₹3.0/kWh' }, { label: 'Grid supply', value: 'MESCOM HT (no solar)' }, { label: 'Immersion vendor', value: 'GRC / LiquidStack' }, { label: 'Mineral offtake', value: 'Tata Chemicals / GHCL' }] },
      { title: 'Macro',   rows: [{ label: 'INR/USD', value: '84.5' }, { label: 'Revenue CAGR', value: '128% (Y1–Y3)' }, { label: 'WACC', value: '14%' }, { label: 'Exit multiple', value: '10–12× EBITDA' }] },
    ],
  },

  // ────────────────────────────────────────────────────────── FRANCHISEEN ────
  {
    name: 'Franchiseen', color: '#7F77DD', currency: 'USD', currencySymbol: '$',
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
      { label: 'Platform fees', data: [7.5, 30, 112, 337, 810],  color: '#7F77DD' },
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
    name: 'HubCV', color: '#FAC775', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 ARR',       value: '$4.4M',    sub: 'Recruiter + professional + placement', color: 'green' },
      { label: 'EBITDA margin Y5', value: '73%',       sub: 'High-margin SaaS with AI leverage',   color: 'blue' },
      { label: 'Break-even',       value: 'Y3',        sub: 'EBITDA positive — low fixed cost',    color: 'amber' },
      { label: 'Y5 recruiters',    value: '1,000',     sub: 'At $150/seat/month avg',              color: 'default' },
    ],
    capexCards: [
      { label: 'Total capex',      value: '$160K',    sub: 'AI infra + platform + verifiers',      color: 'green' },
      { label: 'Funding needed',   value: '$80–150K', sub: 'Bootstrap to Y3 break-even',           color: 'blue' },
      { label: 'Payback period',   value: '~14 mo',   sub: 'From 50 paying recruiter accounts',   color: 'amber' },
      { label: 'Y1 target ARR',    value: '$31K',     sub: '10 recruiters + 50 professionals',    color: 'default' },
    ],
    unitCards: [
      { label: 'Recruiter ARPU',   value: '$150/mo',  sub: 'Blended $99–$299 seat pricing',       color: 'green' },
      { label: 'Professional ARPU',value: '$12/mo',   sub: 'Freemium to premium conversion',      color: 'blue' },
      { label: 'Placement fee',    value: '$3,000',   sub: '5% of $60K avg first-year salary',    color: 'amber' },
      { label: 'LTV / CAC',        value: '14–16×',   sub: 'Based on 24-month avg retention',     color: 'default' },
    ],
    pnlRows: [
      { label: 'Recruiter subscriptions', note: '10→40→150→400→1,000 seats', values: [18, 72, 270, 720, 1800], type: 'revenue' },
      { label: 'Professional premium',    note: '50→200→1,000→5,000→15,000', values: [7.2, 28.8, 144, 720, 2160], type: 'revenue' },
      { label: 'Placement fees',          note: '2→8→25→60→150 placements',  values: [6, 24, 75, 180, 450],    type: 'revenue' },
      { label: 'Total revenue ($K)',       note: '',                           values: [31, 125, 489, 1620, 4410],type: 'total-rev' },
      { label: 'AI infrastructure',       note: 'Anthropic API + compute',    values: [20, 50, 100, 200, 350],  type: 'cost' },
      { label: 'Verifier network',         note: 'Pay per assessment',         values: [5, 20, 60, 150, 300],   type: 'cost' },
      { label: 'Platform & hosting',       note: 'AWS, Vercel, PG',           values: [10, 15, 20, 30, 50],    type: 'cost' },
      { label: 'Engineering team',         note: 'AI/ML eng + full-stack',    values: [0, 80, 160, 240, 320],  type: 'cost' },
      { label: 'Marketing & sales',        note: 'Recruiter outreach, content',values: [10, 30, 60, 100, 150], type: 'cost' },
      { label: 'G&A, legal',              note: '',                           values: [15, 20, 25, 30, 40],    type: 'cost' },
      { label: 'Total opex ($K)',          note: '',                           values: [60, 215, 425, 750, 1210],type: 'total-cost' },
      { label: 'EBITDA ($K)',             note: '',                           values: [-29, -90, 64, 870, 3200], type: 'ebitda' },
      { label: 'EBITDA margin (%)',        note: '',                           values: [-94, -72, 13, 54, 73],   type: 'margin' },
    ],
    chartDatasets: [
      { label: 'Recruiter subs',  data: [18, 72, 270, 720, 1800],  color: '#FAC775' },
      { label: 'Professional',    data: [7.2, 28.8, 144, 720, 2160],color: '#f7b84b' },
      { label: 'Placements',      data: [6, 24, 75, 180, 450],      color: '#e8960a' },
      { label: 'Opex',            data: [60, 215, 425, 750, 1210],  color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'AI infrastructure setup',    note: 'Anthropic SDK, vector DB, compute', phase: 'Y1', amount: '$50K' },
      { item: 'Platform development',       note: 'Next.js, NextAuth, Drizzle, PG',    phase: 'Y1', amount: '$80K' },
      { item: 'Verifier network bootstrap', note: 'Recruit, train 20 domain assessors',phase: 'Y1', amount: '$30K' },
      { item: 'Total capex',                note: 'Bootstrap — no external raise until Y3 breakeven', phase: 'Y1', amount: '$160K', highlight: true },
    ],
    unitRows: [
      { label: 'Recruiter ARPU',         value: '$150/month',   note: 'Blended — $99 basic, $199 standard, $299 enterprise',     type: 'pos' },
      { label: 'Professional ARPU',      value: '$12/month',    note: 'Freemium → premium conversion ~15%',                      type: 'pos' },
      { label: 'Placement fee',          value: '$3,000',       note: '5% of $60K avg first-year salary',                        type: 'pos' },
      { label: 'Recruiter LTV (24 mo)',  value: '$3,600',       note: '$150/mo × 24 months avg retention',                       type: 'pos' },
      { label: 'Recruiter CAC',          value: '$150',         note: 'Design partner → paid conversion, content-led',           type: 'neutral' },
      { label: 'LTV / CAC — recruiter',  value: '24×',         note: 'Highly capital-efficient acquisition',                    type: 'pos' },
      { label: 'Verifier cost / profile',value: '$20–50',       note: 'Pay-per-assessment — scales with verified volume',        type: 'neg' },
      { label: 'Gross margin (subs)',    value: '~75%',         note: 'After AI API costs and verifier fees',                    type: 'pos' },
    ],
    assumptions: [
      { title: 'Pricing',   rows: [{ label: 'Recruiter basic', value: '$99/mo' }, { label: 'Recruiter pro', value: '$299/mo' }, { label: 'Professional', value: '$9–29/mo' }, { label: 'Placement fee', value: '5% first salary' }] },
      { title: 'Growth',    rows: [{ label: 'Recruiter CAGR', value: '~3× Y1→Y3' }, { label: 'Professional CAGR', value: '~4× Y1→Y3' }, { label: 'Churn (monthly)', value: '<3%' }, { label: 'Verifier network', value: '20 by Y1, 200 by Y3' }] },
      { title: 'Funding',   rows: [{ label: 'Model', value: 'Bootstrap' }, { label: 'Break-even', value: 'Y3 at 150 recruiter accounts' }, { label: 'External raise', value: 'After proof — if needed' }, { label: 'WACC', value: '12%' }] },
    ],
  },

  // ────────────────────────────────────────────────────────────── CUESTAY ────
  {
    name: 'Cuestay', color: '#85B7EB', currency: 'USD', currencySymbol: '$',
    pnlCards: [
      { label: 'Year 5 revenue',    value: '$8.95M',  sub: 'Hardware + subscription + install',  color: 'green' },
      { label: 'EBITDA margin Y5',  value: '54%',      sub: 'Subscription margin offsets hardware COGS', color: 'blue' },
      { label: 'Break-even',        value: 'Y3',        sub: 'EBITDA positive — subscription attached', color: 'amber' },
      { label: 'Y5 units sold',     value: '10,000',   sub: 'Hardware + 8,500 active subscriptions', color: 'default' },
    ],
    capexCards: [
      { label: 'Total capex',       value: '$500K',    sub: 'Hardware MOQ + firmware + pilot',    color: 'green' },
      { label: 'Hardware MOQ',      value: '$300K',    sub: 'First production run — Matter-certified hub', color: 'blue' },
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
      { label: 'Hardware',      data: [25, 100, 399, 1497, 4990],  color: '#85B7EB' },
      { label: 'Subscriptions', data: [12, 52, 226, 870, 2962],    color: '#5a9fd4' },
      { label: 'Installation',  data: [5, 20, 80, 300, 1000],      color: '#2d7ab8' },
      { label: 'Opex',          data: [61, 255, 624, 1583, 4134],  color: '#A32D2D', type: 'line' },
    ],
    capexRows: [
      { item: 'Hardware MOQ (first run)',  note: 'Contract manufacturer — Matter-certified', phase: 'Pre-seed', amount: '$300K' },
      { item: 'Firmware development',      note: 'Matter 1.3+ integration, Hub OS',          phase: 'Pre-seed', amount: '$100K' },
      { item: 'Matter certification',      note: 'CSA certification process',                 phase: 'Pre-seed', amount: '$30K' },
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

  // ─────────────────────────────────────────────────────────── DEXTRIP ────
  {
    name: 'Dextrip', color: '#F0997B', currency: 'USD', currencySymbol: '$',
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
      { label: 'Base subs',  data: [7, 42, 167, 522, 1740],  color: '#F0997B' },
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
];
