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

  // ─────────────────────────────────────────────────────────── NANOTRADE ────
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
      { label: 'Integration build', value: '$120K',    sub: 'HubCV, Nanotrade, Franchiseen and AA connectors', color: 'blue' },
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
      { item: 'Integration engineering',   note: 'HubCV, Nanotrade, Franchiseen connectors',   phase: 'Pre-seed', amount: '$120K' },
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
