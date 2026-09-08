/**
 * Staged site feasibility programmes, per venture.
 *
 * Ordered by what can kill a site soonest and cheapest, not by engineering
 * sequence: nothing in a later stage is worth paying for until the stage above
 * comes back clean. This is why the full feasibility study sits last rather
 * than second, which is where the original EXP-009 schedule put it.
 *
 * Costs are indicative Indian market ranges for scoping, not quotations.
 */

export type ItemStatus = 'todo' | 'in-progress' | 'done';

/**
 * `blocking` items can end the deal on their own and gate the spend decision.
 * `value` items establish what the site is worth if it clears — worth doing,
 * but they must not hold up a walk-away.
 */
export type ItemKind = 'blocking' | 'value' | 'standard';

export interface FeasibilityItem {
  ref: string;
  action: string;
  detail?: string;
  who: string;
  /** INR. Equal min and max means a firm figure rather than a range. */
  costMin: number;
  costMax: number;
  kind: ItemKind;
  status: ItemStatus;
}

export interface FeasibilityStage {
  stage: string;
  title: string;
  summary: string;
  items: FeasibilityItem[];
}

export interface FeasibilityProgramme {
  venture: string;
  site: string;
  location: string;
  /** Published working copy — the version outside HQ that can be shared. */
  artifactUrl?: string;
  facts: { label: string; value: string; sub?: string }[];
  stages: FeasibilityStage[];
  /** Ordered by how early and cheaply each can be settled. */
  risks: { rank: string; title: string; detail: string }[];
}

export const PROGRAMMES: FeasibilityProgramme[] = [
  {
    venture: 'Roborns',
    site: 'Bhavani Shipping Yard — Panambur',
    location: 'Village No. 54 Panambur, Mangalore Taluk, Dakshina Kannada',
    artifactUrl: 'https://claude.ai/code/artifact/965f83e6-478c-4b3d-85a5-e3d9a53c4f85',
    facts: [
      { label: 'Site area',         value: '7.01 acre',  sub: '28,369.65 m² · 305,257 sq ft' },
      { label: 'Asking price',      value: '₹49.07 Cr',  sub: '₹7 lakh/cent · ₹1,607/sq ft' },
      { label: 'Boundary survey',   value: '24 Aug 26',  sub: 'DGPS · WGS-84 UTM-43 · Shree Associates' },
      { label: 'Title documented',  value: '1.35 acre',  sub: '135.26 of 701 cents' },
      { label: 'Power line',        value: '1.5 km',     sub: 'KPTCL — headroom unconfirmed' },
    ],
    stages: [
      {
        stage: '0',
        title: 'Desk checks',
        summary:
          'All free or near-free, all obtainable this week, and every one can end the deal on its own. ' +
          'Nothing below Stage 0 gets paid for until these are back.',
        items: [
          { ref: '0.1',  action: 'Schedule of every survey number with extent, totalling 7.01 acres', detail: 'If they cannot produce one page showing this, that is the answer.', who: 'Seller',              costMin: 0,    costMax: 0,    kind: 'blocking', status: 'todo' },
          { ref: '0.2',  action: 'RTC / Pahani per survey number — owner, extent, kissam',            who: 'Bhoomi',               costMin: 0,    costMax: 0,    kind: 'standard', status: 'todo' },
          { ref: '0.3',  action: 'Mutation (MR) extracts — the ownership chain',                      who: 'Bhoomi',               costMin: 0,    costMax: 0,    kind: 'standard', status: 'todo' },
          { ref: '0.4',  action: 'Encumbrance Certificate, 30 years, per survey number',              who: 'Kaveri',               costMin: 1000, costMax: 1000, kind: 'standard', status: 'todo' },
          { ref: '0.5',  action: 'Guidance value for Village 54 Panambur, against the ₹7 lakh/cent ask', who: 'Kaveri',             costMin: 0,    costMax: 0,    kind: 'standard', status: 'todo' },
          { ref: '0.6',  action: 'DC conversion orders, with the stated purpose',                     detail: 'Converted for residential is not converted for industrial.', who: 'Seller / Tahsildar', costMin: 0, costMax: 0, kind: 'standard', status: 'todo' },
          { ref: '0.7',  action: 'The CRZ clearance letter itself',                                   detail: 'Authority, reference, date, activity granted for, survey numbers covered, validity, transferability, and the approved map showing the HTL.', who: 'Broker / Seller', costMin: 0, costMax: 0, kind: 'blocking', status: 'todo' },
          { ref: '0.8',  action: 'Land-use zoning of the parcel — Industrial or Transportation & Communication', who: 'MUDA',       costMin: 0,    costMax: 0,    kind: 'standard', status: 'todo' },
          { ref: '0.9',  action: 'Permitted thermal discharge ΔT and mixing-zone rules',              detail: 'Sizes the intake structure and therefore the entire marine capex. Free, and not previously asked.', who: 'KSPCB', costMin: 0, costMax: 0, kind: 'blocking', status: 'todo' },
          { ref: '0.10', action: 'Source substation, voltage, spare capacity and augmentation date',  detail: 'The line is 1.5 km away. Headroom is the real question, not distance — Kapu died on a Q3 2029 approval date.', who: 'KPTCL', costMin: 0, costMax: 0, kind: 'blocking', status: 'todo' },
          { ref: '0.11', action: "Existing yard's sanctioned load and a recent electricity bill",     who: 'Seller',               costMin: 0,    costMax: 0,    kind: 'standard', status: 'todo' },
          { ref: '0.12', action: 'Proposed Mangaluru cable landing station — status, location, distance', detail: 'Confirm whether the site fits the state’s CLS-linked incentive category.', who: 'KDEM / State IT', costMin: 0, costMax: 0, kind: 'value', status: 'todo' },
          { ref: '0.13', action: 'Terrestrial fibre — RailTel on the Konkan line, KPTCL OPGW, NLD carriers', detail: 'The tippani notes put the railway ~500 m from the site.', who: 'Carriers', costMin: 0, costMax: 0, kind: 'value', status: 'todo' },
        ],
      },
      {
        stage: '1',
        title: 'Paid opinions',
        summary:
          'Three professional opinions against the three ways this parcel can be worthless — no title, ' +
          'no permission, no power — plus one that establishes what it is worth if it survives.',
        items: [
          { ref: '1.1', action: "Advocate's title opinion across all survey numbers", detail: 'Must reconcile physical boundary against title. The survey is marked "physical boundary shown by client" — it is not title-verified.', who: 'Advocate', costMin: 25000, costMax: 50000, kind: 'blocking', status: 'todo' },
          { ref: '1.2', action: 'CRZ review of the existing clearance', detail: 'Confirms it is current and states what a data centre with seawater intake and thermal outfall additionally needs. Reduced from a fresh opinion because a clearance reportedly exists.', who: 'CRZ consultant', costMin: 15000, costMax: 25000, kind: 'blocking', status: 'todo' },
          { ref: '1.3', action: 'KPTCL power availability application', detail: 'Returns a firm line-and-bay estimate for the 1.5 km connection.', who: 'KPTCL', costMin: 15000, costMax: 25000, kind: 'standard', status: 'todo' },
          { ref: '1.4', action: 'Connectivity and cable-landing feasibility', detail: 'What terrestrial routes reach the site, what a CLS-adjacent position requires, and whether the fibre corridor can share the intake’s CRZ marine-works application.', who: 'Telecom consultant', costMin: 25000, costMax: 50000, kind: 'value', status: 'todo' },
        ],
      },
      {
        stage: '2',
        title: 'Site physical',
        summary:
          'What the ground actually is, and whether the shape can hold a building. The parcel is an ' +
          'assembly of at least nine survey numbers across three blocks, with a long thin south-west arm.',
        items: [
          { ref: '2.1', action: 'Topographic survey — contours, spot levels, distance to High Tide Line', detail: 'The boundary survey’s legend promises spot levels but none are drawn.', who: 'Surveyor', costMin: 50000, costMax: 100000, kind: 'standard', status: 'todo' },
          { ref: '2.2', action: 'Buildable-area study — overlay a 2 MW block on the actual outline', detail: 'Contiguous usable area is materially less than 7.01 acres.', who: 'Architect', costMin: 25000, costMax: 50000, kind: 'standard', status: 'todo' },
          { ref: '2.3', action: 'Intake, outfall and fibre corridor route walk', detail: 'All three cross the same intertidal zone. One CRZ marine-works application covering them together costs far less than two.', who: 'Marine consultant', costMin: 25000, costMax: 50000, kind: 'standard', status: 'todo' },
        ],
      },
      {
        stage: '3',
        title: 'Technical',
        summary:
          'The engineering questions. The thermodynamic study is narrower than originally scoped: the ' +
          'thermal simulator built 7 Sep already rules out MED-TVC below a 70 °C return temperature.',
        items: [
          { ref: '3.1', action: 'Thermodynamic desk study', detail: 'Confirms achievable immersion return temperature and selects between LT-MED, MVC and membrane distillation. Two to three weeks.', who: 'Thermal engineer', costMin: 50000, costMax: 100000, kind: 'standard', status: 'todo' },
          { ref: '3.2', action: 'Geotechnical investigation — boreholes, bearing capacity, water table', detail: 'A well and a borewell already exist on site.', who: 'Geotech firm', costMin: 150000, costMax: 300000, kind: 'standard', status: 'todo' },
        ],
      },
      {
        stage: '4',
        title: 'Full feasibility',
        summary:
          'The bankable document — EXP-009 in the budget. Only commissioned once every stage above has ' +
          'cleared; it was previously scheduled far too early in the sequence.',
        items: [
          { ref: '4.1', action: 'Full thermal, process and civil feasibility study', detail: 'The document an investor or lender underwrites against.', who: 'Engineering firm', costMin: 400000, costMax: 400000, kind: 'standard', status: 'todo' },
        ],
      },
    ],
    risks: [
      { rank: '01', title: 'Title',               detail: '5.66 of 7.01 acres has no paperwork behind it. Everything else is moot until this closes. Most likely a partial document set — three sheets say "contains 5 sheets" — but it must be proven, not assumed.' },
      { rank: '02', title: 'CRZ scope',           detail: 'A clearance is reported to exist. Clearance attaches to an activity, not to land — a shipping yard permission does not carry a data centre with marine intake and thermal outfall, which is a separate CRZ-IV question.' },
      { rank: '03', title: 'Discharge ΔT',        detail: "KSPCB's permitted temperature rise sizes the intake bore — 189 mm at 2 MW, 617 mm at 20 MW on an 8 °C ΔT, against Indian norms of typically 5–7 °C. Free to ask, and it moves capex more than anything else." },
      { rank: '04', title: 'Substation headroom', detail: 'Kapu died on exactly this — grid approval dated Q3 2029 against a Q1 2027 construction start. A short line to a full substation is worth nothing.' },
    ],
  },
];

export function programmeFor(venture: string): FeasibilityProgramme | undefined {
  return PROGRAMMES.find((p) => p.venture === venture);
}

/** Inclusive of both bounds, so a firm figure reports as a single number. */
export function stageCost(s: FeasibilityStage): { min: number; max: number } {
  return s.items.reduce(
    (a, i) => ({ min: a.min + i.costMin, max: a.max + i.costMax }),
    { min: 0, max: 0 },
  );
}

export function programmeCost(p: FeasibilityProgramme): { min: number; max: number } {
  return p.stages.reduce(
    (a, s) => {
      const c = stageCost(s);
      return { min: a.min + c.min, max: a.max + c.max };
    },
    { min: 0, max: 0 },
  );
}

/**
 * Stage 0 and 1 together — the walk-away decision, excluding `value` items,
 * which establish worth rather than viability and must not gate it.
 */
export function decisionCost(p: FeasibilityProgramme): { min: number; max: number } {
  return p.stages
    .filter((s) => s.stage === '0' || s.stage === '1')
    .flatMap((s) => s.items)
    .filter((i) => i.kind !== 'value')
    .reduce((a, i) => ({ min: a.min + i.costMin, max: a.max + i.costMax }), { min: 0, max: 0 });
}

/** ₹0 · ₹25,000 · ₹25,000 – 50,000 */
export function rupees(min: number, max: number): string {
  if (min === 0 && max === 0) return '₹0';
  const f = (n: number) => n.toLocaleString('en-IN');
  return min === max ? `₹${f(min)}` : `₹${f(min)} – ${f(max)}`;
}

/** Lakh, for stage and programme totals where full rupees are noise. */
export function lakh(min: number, max: number): string {
  const f = (n: number) => (n / 100000).toFixed(n % 100000 === 0 ? 0 : 2);
  return min === max ? `₹${f(min)} L` : `₹${f(min)} – ${f(max)} L`;
}
