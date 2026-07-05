// ─── WABAG QUOTATION SCOPE — ROBORNS 2MW TO 20MW UNITS ──────────────────────
//
// Prepared after second meeting with Mayank Mani Prasad (Global BD, VA Tech Wabag)
// Date: 2026-06-23
//
// This defines the scope for WABAG to quote on at each scale, plus the
// combined project budget and execution plan they need to submit.

export interface WabagScopeScale {
  label: string;
  computeMW: number;
  siteAcres: number;
  plannedSite: string;
  medCapacity: string;       // L/day
  note: string;
}

export interface WabagScopeLine {
  item: string;
  note: string;
  phase: 'Seed' | 'Phase 2' | 'Phase 3' | 'Full';
  amountQuote: string;   // what we want WABAG to quote
}

export interface WabagQuoteRequest {
  scale: WabagScopeScale;
  scope: WabagScopeLine[];
}

// ─── THE FOUR SCALES WABAG NEEDS TO QUOTE ─────────────────────────────────────

export const WABAG_QUOTE_SCALES: WabagScopeScale[] = [
  {
    label: 'Phase 1 — Pilot',
    computeMW: 2,
    siteAcres: 2,
    plannedSite: 'Kapu, Karnataka (13°12\'11.4"N 74°44\'37.0"E)',
    medCapacity: '430,000 L/day',
    note: 'Current Phase 1. Existing grid has capacity. 5km from substation. WABAG scope: civil + Building B MED + Building C ZLD pilot.',
  },
  {
    label: 'Phase 2 — Scale',
    computeMW: 5,
    siteAcres: 2,
    plannedSite: 'Hejamadi-2ac, Udupi',
    medCapacity: '1,075,000 L/day',
    note: 'Next phase. Same site class — WABAG to quote modular expansion of their MED/ZLD systems.',
  },
  {
    label: 'Phase 3 — Expansion',
    computeMW: 10,
    siteAcres: 4,
    plannedSite: 'Hejamadi-2ac (expanded) or new site',
    medCapacity: '2,150,000 L/day',
    note: 'Intermediate scale. Grid upgrade required (~₹15 Cr substation).',
  },
  {
    label: 'Full Buildout',
    computeMW: 20,
    siteAcres: 15,
    plannedSite: 'Hejamadi-15ac, Udupi',
    medCapacity: '4,300,000 L/day',
    note: 'Full 40MW PPA required. ₹50 Cr for substation + 5km HT line. WABAG EPC for entire water infrastructure.',
  },
];

// ─── SCOPE CATEGORIES ACROSS ALL SCALES ──────────────────────────────────────

export const WABAG_SCOPE_CATEGORIES = [
  {
    category: 'A — Civil Engineering (3-Building Campus)',
    description: 'Full civil EPC for the 3-building campus: subterranean vault (Building A), water processing hall (Building B), mineral/ZLD hall (Building C). Includes marine-grade foundations, coastal hardstand, roads, drainage, compound wall.',
    wabagRole: 'Primary EPC — WABAG has in-house civil infrastructure division for large water/industrial projects. Quote as bundled EPC or civil-only.',
    items: [
      'Subterranean vault — marine-grade concrete, watertight, corrosion-resistant (Building A below grade)',
      'Above-ground PEB steel shell — secure compute enclosure (Building A above grade)',
      'Building B — water processing hall (MED skid, filters, tanks, chemical dosing)',
      'Building C — mineral extraction and ZLD hall (ion-exchange columns, crystallizers)',
      'Site civil — roads, drainage, compound wall, CRZ-compliant hardstand',
      'Marine intake pipeline trenching (500m DN300 subseabed HDPE)',
      'Brine outfall pipeline (HDPE, DN200, CRZ-compliant dispersion)',
    ],
  },
  {
    category: 'B — MED-TVC Desalination (Building B)',
    description: 'Multi-Effect Distillation with Thermal Vapour Compression skid. Primary interface for the immersion cooling waste heat loop. Heat from compute (60–70°C coolant) feeds the MED first effect via titanium plate heat exchangers.',
    wabagRole: 'Design, supply, and commission the MED-TVC skid. WABAG confirmed this capability during Jun 11 call.',
    items: [
      'MED-TVC skid — full thermal capture of 2–20MW waste heat (1.5–15 MWth delivered to MED)',
      'Titanium plate heat exchangers (Alfa Laval or equivalent) — seawater-grade, primary interface A→B',
      'Seawater intake pump station (screened, variable speed)',
      'Pre-treatment — sand filtration + micron cartridges',
      'Brine concentration management and blowdown',
      'SCADA / automation for Building B (integration with BMS)',
      'Performance guarantee: 8–10 L/kWh thermal, 430K L/day at 2MW compute',
    ],
  },
  {
    category: 'C — Zero Liquid Discharge / Mineral Recovery (Building C)',
    description: 'ZLD loop that takes MED brine and extracts NaCl, Mg(OH)_2, KCl, and bromine compounds. Zero liquid discharge — everything is recovered as solid minerals or clean water.',
    wabagRole: 'Benchmark quote vs Thermax and Praj (who are also being RFQ\'d). Bundle with A+B for combined EPC pricing.',
    items: [
      'Pre-concentration — RO or brine concentrator for MED blowdown',
      'Selective ion-exchange columns — LANXESS Lewatit resin for Mg^2+, K^+, Br^-',
      'Thermal crystallization — NaCl forced-circulation crystallizer',
      'Secondary evaporator for Mg(OH)_2 and MgSO_4 recovery',
      'Dehumidification/condensate recovery loop',
      'Controls integration with Building B SCADA',
      'ZLD guarantee: zero liquid discharge at full brine throughput',
    ],
  },
  {
    category: 'D — Interconnecting Pipelines & Thermal Loop',
    description: 'All inter-building pipelines: seawater intake → Building A (coolant), A ↔ B (thermal loop), B → C (brine transfer), and common utilities.',
    wabagRole: 'Include in bundled EPC or quote separately.',
    items: [
      'Seawater coolant loop — HDPE 150mm from sea to Building A (pump skid)',
      'A ↔ B thermal loop — insulated SS pipe rack, ~200m, with expansion joints',
      'B → C brine transfer — chemical-resistant HDPE',
      'Fresh water distribution — from Building B product tank to site utilities',
      'Fire water ring main — marine-grade',
    ],
  },
  {
    category: 'E — O&M Services (Optional)',
    description: 'Post-construction operations and maintenance contract for Building B water train and Building C ZLD. Options: 3-year, 5-year, or 10-year.',
    wabagRole: 'Quote O&M as optional add-on. We may self-operate after Year 3.',
    items: [
      'Year 1: full WABAG O&M with Roborns shadowing',
      'Year 2–3: shared O&M, transfer of knowledge',
      'SPIR (spare parts, inspections, repairs) schedule',
      'Membrane and resin replacement schedule',
      'Remote monitoring SCADA integration with HQ dashboard',
    ],
  },
];

// ─── BUDGET ESTIMATE FRAMEWORK ───────────────────────────────────────────────
//
// Existing baseline (from fin-models.ts India model, Phase 1 2MW):
//   Building B subtotal:          ₹7.9 Cr
//   Building C subtotal:          ₹3.8 Cr
//   Pipelines & site subtotal:    ₹1.5 Cr
//   WABAG-addressable total:      ₹13.2 Cr (of ₹30 Cr total Phase 1)
//
// Scaling factors for desalination/ZLD (ref: standard chemical engineering):
//   0.7 power-law scaling for process equipment
//   0.5 for civil (shared foundations, infrastructure)
//   0.3 fixed base (intake, outfall, permits)

export interface ScaleEsimtate {
  computeMW: number;
  wabagScopeTotal: string;  // what WABAG portion costs at this scale
  civilEst: string;
  buildingBEst: string;
  buildingCEst: string;
  pipelinesEst: string;
  totalProjectRaise: string; // total Roborns raise needed
  note: string;
}

export const WABAG_BUDGET_SCALE: ScaleEsimtate[] = [
  {
    computeMW: 2,
    wabagScopeTotal: '₹13.2 Cr (~$1.6M)',
    civilEst: '₹4.8 Cr',
    buildingBEst: '₹4.5 Cr',
    buildingCEst: '₹2.5 Cr',
    pipelinesEst: '₹1.4 Cr',
    totalProjectRaise: '₹30 Cr (~$3.6M)',
    note: 'Phase 1 baseline. Kapu pilot. WABAG quotes should validate or refine these estimates.',
  },
  {
    computeMW: 5,
    wabagScopeTotal: '₹26 Cr (~$3.1M)',
    civilEst: '₹8 Cr',
    buildingBEst: '₹10 Cr',
    buildingCEst: '₹5 Cr',
    pipelinesEst: '₹3 Cr',
    totalProjectRaise: '₹75 Cr (~$9M)',
    note: '2.5× compute, ~2× WABAG cost (0.7 scaling on process, 0.5 on civil). Hejamadi-2ac.',
  },
  {
    computeMW: 10,
    wabagScopeTotal: '₹44 Cr (~$5.3M)',
    civilEst: '₹12 Cr',
    buildingBEst: '₹18 Cr',
    buildingCEst: '₹9 Cr',
    pipelinesEst: '₹5 Cr',
    totalProjectRaise: '₹160 Cr (~$19M)',
    note: 'Includes substation upgrade cost. MED divided into 2× parallel trains.',
  },
  {
    computeMW: 20,
    wabagScopeTotal: '₹80 Cr (~$9.6M)',
    civilEst: '₹20 Cr',
    buildingBEst: '₹33 Cr',
    buildingCEst: '₹18 Cr',
    pipelinesEst: '₹9 Cr',
    totalProjectRaise: '₹420 Cr (~$50M)',
    note: 'Full buildout. Hejamadi-15ac. 4× MED trains, 2× ZLD trains. Full grid upgrade included.',
  },
];

// ─── EXECUTION PLAN REQUEST ──────────────────────────────────────────────────

export interface ExecutionPlanRequest {
  title: string;
  description: string;
  deliverables: string[];
  timelineRequest: string;
}

export const WABAG_EXECUTION_REQUEST: ExecutionPlanRequest[] = [
  {
    title: 'Project Execution Methodology',
    description: 'How WABAG proposes to execute a Roborns facility at each scale. EPC model (lump-sum turnkey vs reimbursable vs hybrid).',
    deliverables: [
      'Preferred contracting model: LSTK / EPCM / hybrid for each scale',
      'Subcontractor strategy — which portions self-perform vs subcontract',
      'Quality assurance plan for marine environment',
      'Safety protocol for coastal construction (monsoons, cyclones)',
      'CRZ compliance methodology',
    ],
    timelineRequest: 'Include in budgetary quote submission',
  },
  {
    title: 'Phase-wise Timeline',
    description: 'Milestone-based timeline from NDA → FEED → detailed design → procurement → construction → commissioning.',
    deliverables: [
      'FEED study timeline (typically 4–6 months for this scale)',
      'Detailed engineering duration',
      'Equipment procurement lead times (MED skid: 8–12 months)',
      'Civil construction duration (per building)',
      'Integrated commissioning schedule',
      'Critical path identification',
    ],
    timelineRequest: 'Per scale: 2MW, 5MW, 10MW, 20MW',
  },
  {
    title: 'Procurement & Supply Chain',
    description: 'Make-in-India vs imported content breakdown. Local sourcing for Karnataka/Udupi.',
    deliverables: [
      'Equipment list with origin (import vs domestic)',
      'Long-lead items with procurement timeline',
      'Local subcontractor opportunities in Karnataka/Udupi',
      'Logistics plan for coastal site (nearest port: New Mangalore Port, 35km)',
    ],
    timelineRequest: 'Qualitative assessment with budgetary quote',
  },
  {
    title: 'Warranty & Performance Guarantees',
    description: 'Performance guarantees for MED output (L/day at specified thermal input), water quality parameters, ZLD compliance.',
    deliverables: [
      'MED performance guarantee: L/day at given inlet temp and flow',
      'ZLD guarantee: zero liquid discharge',
      'Defect liability period (standard 12–24 months)',
      'Performance testing and acceptance protocol',
    ],
    timelineRequest: 'To be included in formal quotation',
  },
];

// ─── SUMMARY FOR SHAWAZ ──────────────────────────────────────────────────────

export const WABAG_QUOTE_SUMMARY = {
  meetingDate: '2026-06-23',
  meetingWith: 'Mayank Mani Prasad (Global BD, VA Tech Wabag)',
  ndaStatus: 'Drafted — pending signature (individual capacity, assignment-on-incorporation)',
  priorEmail: 'EM-004 (2026-06-03) — MED-TVC RFP sent. EM-011 (2026-06-16) — NDA + follow-up sent',
  whatWabagNeedsToProvide: [
    '1. Budgetary quotation at 4 scales: 2MW, 5MW, 10MW, 20MW — for civil + Building B MED + Building C ZLD + interconnecting pipelines',
    '2. Combined project budget estimate — total project cost for each scale (covering WABAG portion + non-WABAG portions they can estimate)',
    '3. Scope of work document — detailed scope for each building/system at each scale',
    '4. Execution plan — methodology, timeline, procurement strategy, subcontracting approach',
    '5. Optional O&M quotation — 3/5/10 year operations contract for Building B and C',
  ],
};
