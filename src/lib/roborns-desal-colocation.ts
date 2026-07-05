// ─── DESALINATION CO-LOCATION STRATEGY ───────────────────────────────────────
//
// Roborns unit integration into existing desalination projects (KSA + India)
// Prepared for: Mayank Mani Prasad / VA Tech Wabag discussion
// Date: 2026-06-23
//
// Point 2 from meeting: "Plan the unit in existing desalination projects in KSA
// or India so we can have the datacenter unit there"

export interface DesalPlant {
  name: string;
  location: string;
  capacity: string;        // MGD or m³/day
  technology: string;      // MED, RO, MSF, hybrid
  status: 'operating' | 'construction' | 'development' | 'planned';
  operator: string;
  wabagInvolvement: string;
  robornsPotential: string;
  priority: 'high' | 'medium' | 'low';
}

export interface DesalProjectPipeline {
  country: string;
  plants: DesalPlant[];
  strategicCase: string;
  entryPath: string;
}

// ─── WHY CO-LOCATION WORKS ───────────────────────────────────────────────────

export const COLOCATION_THESIS = {
  title: 'Why Co-locate Roborns at an Existing Desalination Plant?',
  summary: 'Instead of Roborns building its own standalone desalination plant (Building B + intake/outfall), the immersion-cooled datacenter module is integrated into an existing or planned desalination facility.',
  benefits: [
    {
      benefit: 'Zero marginal heat for desalination',
      detail: 'The desal plant already has thermal energy infrastructure (steam, waste heat, or power). Roborns immersion cooling (60–70°C coolant) pre-heats the MED feedwater, reducing the plant\'s thermal energy consumption by 10–15% per MW of compute. The desal plant owner gets higher output per unit of energy.',
    },
    {
      benefit: 'Shared infrastructure = lower capex',
      detail: 'No separate seawater intake, outfall, CRZ clearance, or coastal land acquisition. The desal plant already has all of these. Roborns brings a prefabricated immersion DC module that connects to the plant\'s thermal loop.',
    },
    {
      benefit: 'Accelerated timeline',
      detail: 'Standalone Roborns: 24–36 months to operational (CRZ, land, permits, build). Co-located: 12–18 months (module fabrication + interconnection).',
    },
    {
      benefit: 'Permits already exist',
      detail: 'Desal plants in both KSA and India have environmental clearances, water extraction rights, and coastal permits. Adding compute heat load is a modification, not a new greenfield project.',
    },
    {
      benefit: 'Better compute colocation pricing',
      detail: 'Desal plants are industrial zones with existing grid connections, often with subsidized power (especially KSA at $0.048/kWh). Roborns benefits from the plant\'s power tariff classification.',
    },
    {
      benefit: 'Win-win for desal plant owner',
      detail: 'The desal plant gets: (a) reduced thermal energy cost, (b) new revenue stream from heat offtake or land lease, (c) ESG / zero-carbon compute differentiator, (d) potential mineral recovery revenue share.',
    },
  ],
  idealPlantProfile: {
    technology: 'MED or hybrid MED/RO preferred (thermal integration is simplest)',
    status: 'Under development or planned (easier to design-in than retrofit)',
    minCapacity: '≥50,000 m³/day (10 MGD) — enough thermal capacity for 2–5MW compute module',
    proximity: '≤5km from grid substation >10MW capacity (or existing internal power distribution)',
    waterSource: 'Seawater (not brackish) — consistent chemistry, unlimited supply',
  },
};

// ─── KSA TARGET DESALINATION PROJECTS ───────────────────────────────────────

export const KSA_DESAL_PLANTS: DesalPlant[] = [
  {
    name: 'Ras Al Khair IWPP',
    location: 'Ras Al Khair, Eastern Province',
    capacity: '1,025,000 m³/day (228 MGD)',
    technology: 'MSF + SWRO hybrid',
    status: 'operating',
    operator: 'SWCC / ACWA Power (27.5% PIF stake)',
    wabagInvolvement: 'WABAG has supplied MED systems to SWCC plants. Active maintenance contracts on GCC desal plants.',
    robornsPotential: 'Large existing plant — retrofit a small 2MW module as a pilot. ACWA Power is already in our target investor list (INV-006).',
    priority: 'medium',
  },
  {
    name: 'Shoaiba 3 IWP',
    location: 'Shoaiba, Makkah Province',
    capacity: '450,000 m³/day',
    technology: 'SWRO',
    status: 'operating',
    operator: 'SWCC',
    wabagInvolvement: 'WABAG has done EPC for SWCC RO plants. Familiar with this facility.',
    robornsPotential: 'RO plant — thermal integration is harder. But power infrastructure exists for compute colocation (cheap power = good compute margin).',
    priority: 'low',
  },
  {
    name: 'Jubail 3B IWP',
    location: 'Jubail Industrial City, Eastern Province',
    capacity: '570,000 m³/day',
    technology: 'SWRO',
    status: 'construction (2024)',
    operator: 'Engie / SWCC',
    wabagInvolvement: 'Potential WABAG O&M or supply role — not confirmed.',
    robornsPotential: 'Under construction — too late to modify design. But nearby industrial land available. Roborns could build adjacent and co-locate infrastructure.',
    priority: 'low',
  },
  {
    name: 'Yanbu 4 (planned)',
    location: 'Yanbu, Medina Province',
    capacity: '450,000 m³/day',
    technology: 'SWRO',
    status: 'development',
    operator: 'SWCC / private developer',
    wabagInvolvement: 'WABAG bid likely — large SWRO EPC tender. Confirm with Mayank.',
    robornsPotential: 'In development phase — perfect timing to pitch Roborns integration. Design phase means minimal incremental cost to add thermal interface.',
    priority: 'high',
  },
  {
    name: 'NEOM Desalination',
    location: 'NEOM, Tabuk Province',
    capacity: 'Unknown — NEOM scope unclear',
    technology: 'Planned (likely RO + solar)',
    status: 'development',
    operator: 'NEOM / Enowa (NEOM water subsidiary)',
    wabagInvolvement: 'WABAG likely tracking this — check with Mayank.',
    robornsPotential: 'Greenfield project. Roborns hardware could be designed into the NEOM water and energy masterplan. High-visibility, high-impact. Aligns with PIF/Vision 2030.',
    priority: 'high',
  },
  {
    name: 'ACWA Power — new projects pipeline',
    location: 'Various — KSA, UAE, other GCC',
    capacity: 'Multiple plants in development via ACWA Power IPP/IWP pipeline (200,000–600,000 m³/day each)',
    technology: 'RO, MED, hybrid',
    status: 'development',
    operator: 'ACWA Power',
    wabagInvolvement: 'WABAG is on ACWA Power\'s approved EPC list for certain technologies. Confirm with Mayank.',
    robornsPotential: 'ACWA Power is the #1 strategic partner target (INV-006 in fundraising.ts). They develop desal + power projects globally. Roborns unit could be a standard add-on module for new ACWA desal plants. Pitch: "Add a zero-carbon compute module to every new ACWA desal plant."',
    priority: 'high',
  },
];

export const KSA_STRATEGIC_CASE = {
  title: 'KSA Market Entry Path',
  advantages: [
    'Subsidized industrial power at $0.048/kWh — best-in-class compute margins (~75% vs 50% India)',
    'Vision 2030 AI commitment — PIF $40B+ allocated to AI compute infrastructure',
    'Water scarcity means desalination is strategic priority — dual-purpose facilities supported by MCIT, SIDF',
    'WABAG has existing relationships with SWCC and ACWA Power — warm intro possible',
    'Shawaz\'s brother in Dammam + former partner in Riyadh for on-ground coordination',
  ],
  firstMove: 'Ask Mayank: "Which active or planned desal projects is WABAG working on in KSA that are still in FEED/design phase?" Then propose a Roborns integration study as a joint value-add to the desal plant owner.',
  targetInvestors: ['ACWA Power (INV-006)', 'PIF / PIF-backed VC (INV-007)', 'MCIT AI Fund (INV-008)', 'SIDF concessional loan (INV-010)'],
};

// ─── INDIA TARGET DESALINATION PROJECTS ─────────────────────────────────────

export const INDIA_DESAL_PLANTS: DesalPlant[] = [
  {
    name: 'Nemmeli SWRO (Phase 1 & 2)',
    location: 'Nemmeli, Chennai, Tamil Nadu',
    capacity: '110,000 m³/day (Phase 1) + 100,000 (Phase 2)',
    technology: 'SWRO',
    status: 'operating',
    operator: 'Chennai Metropolitan Water Supply & Sewerage Board (CMWSSB)',
    wabagInvolvement: 'WABAG was the EPC contractor for Nemmeli Phase 1 (100 MLD SWRO plant commissioned 2013).',
    robornsPotential: 'Existing plant — thermal retrofit challenging (RO). But nearby coastal land could host Roborns standalone unit with CMWSSB as water offtaker. Known WABAG relationship is the entry advantage.',
    priority: 'medium',
  },
  {
    name: 'Minjur SWRO',
    location: 'Minjur, Chennai, Tamil Nadu',
    capacity: '100,000 m³/day',
    technology: 'SWRO',
    status: 'operating',
    operator: 'CMWSSB',
    wabagInvolvement: 'WABAG likely involved in O&M or upgrades.',
    robornsPotential: 'Similar to Nemmeli — RO plant, retrofit difficult. But CMWSSB is a potential water offtaker for standalone Roborns.',
    priority: 'low',
  },
  {
    name: 'Gujarat SWRO — proposed (multiple)',
    location: 'Gujarat coast — Mundra, Kandla, or Dwarka',
    capacity: 'Various — proposed 100,000–300,000 m³/day',
    technology: 'SWRO',
    status: 'planned',
    operator: 'Gujarat Water Supply & Sewerage Board / PPP developer',
    wabagInvolvement: 'WABAG has Gujarat presence and is active in state govt water tenders. Check with Mayank.',
    robornsPotential: 'Greenfield or FEED stage — ideal for integration. Gujarat has coastal SEZs with existing power infrastructure (Mundra SEZ, Kandla port). Could co-locate with Adani or Tata projects.',
    priority: 'high',
  },
  {
    name: 'Paradeep SWRO — proposed',
    location: 'Paradeep, Odisha',
    capacity: 'Proposed 100,000 m³/day',
    technology: 'SWRO',
    status: 'planned',
    operator: 'Odisha Water Board / PPP',
    wabagInvolvement: 'Unknown — WABAG may be tracking.',
    robornsPotential: 'High potential — coastal industrial port area with Paradeep Phosphates, IFFCO nearby. Industrial power available. However, distant from Shawaz\'s base in Mangaluru/Karnataka.',
    priority: 'low',
  },
  {
    name: 'JSW Energy — desal for captive use',
    location: 'Vijayanagar or Jaigarh, Karnataka',
    capacity: '50,000–100,000 m³/day (captive, for steel plant)',
    technology: 'Likely RO or MED',
    status: 'development or planned',
    operator: 'JSW Group',
    wabagInvolvement: 'JSW is a major WABAG customer — WABAG has done water treatment for JSW steel plants.',
    robornsPotential: 'Karnataka-based — closest to our Kapu/Hejamadi operations. JSW\'s coastal projects in Jaigarh have land, power, and water infrastructure. A Roborns module there benefits from proximity to Shawaz\'s base.',
    priority: 'high',
  },
  {
    name: 'Karnataka coastal desal — proposed / policy',
    location: 'Mangaluru coast or Karwar, Karnataka',
    capacity: 'Policy-stage — 100,000 m³/day target under AMRUT 2.0',
    technology: 'TBD — likely RO or MED',
    status: 'planned',
    operator: 'KUWSDB (Karnataka Urban Water Supply & Drainage Board)',
    wabagInvolvement: 'WABAG has presence in Karnataka — supplied water treatment plants across the state.',
    robornsPotential: 'Our home state. KUWSDB is already on the partner list for water offtake. A Karnataka desal project development would be the ideal integration vehicle for Roborns. Ask WABAG if they are tracking the Karnataka desalination policy.',
    priority: 'high',
  },
];

export const INDIA_STRATEGIC_CASE = {
  title: 'India Market Entry Path',
  advantages: [
    'Home market — Shawaz is Karnataka-based, existing government relationships',
    'India\'s desalination policy is accelerating (AMRUT 2.0, National Water Mission)',
    'Coastal Karnataka has water stress in summer months — desal + compute co-location is a politically sellable narrative ("Jobs + Water + AI")',
    'WABAG is an Indian company (HQ: Chennai) — lower friction for Indian projects',
  ],
  firstMove: 'Ask Mayank: "Which Indian desal projects in FEED/development phase could host a 2MW compute module? Especially Karnataka or Gujarat." Then propose a joint capability statement for state government RFP responses.',
  targetInvestors: ['State govt desal budgets', 'AMRUT 2.0 desalination fund', 'IndiaAI Mission compute subsidy (for the DC portion)'],
};

// ─── MODULE SPECIFICATION FOR INTEGRATION ───────────────────────────────────

export const COLOCATION_MODULE_SPEC = {
  title: 'Roborns Co-Location Module — Technical Interface Spec',
  description: 'What the desal plant needs to provide, and what Roborns brings, for a co-located installation.',
  desalPlantProvides: [
    'Seawater intake and pre-treatment (sand filtration)',
    'Seawater coolant access (for Building A immersion cooling)',
    'Plot / land area: ~2,000–5,000 sqm for 2MW module (containers or PEB structure)',
    'Grid power connection: 2MW minimum (expandable to 5MW)',
    'Thermal interface point: MED first effect or brine heater (hot side 60–70°C)',
    'Cooling water return (30–40°C) back to the marine outfall',
    'Fire water ring connection',
    'Security and site access',
    'Waste heat: ~1.5 MWth per MW of compute, delivered to the MED thermal loop',
  ],
  robornsBrings: [
    'Prefabricated immersion cooling module (containerized or skid-mounted) — 2MW per unit',
    'GPU compute hardware (supplied by tenant or Roborns)',
    'Dielectric coolant and CDU (coolant distribution unit)',
    'Titanium plate heat exchangers (A→B interface) — already in scope with WABAG',
    'SCADA / BMS integration with desal plant control system',
    'Ongoing colocation operations team',
    'Mineral extraction module (optional add-on — uses brine from desal plant)',
  ],
};

// ─── HOW TO PITCH THIS TO MAYANK / WABAG ────────────────────────────────────

export const WABAG_PITCH_ANGLE = {
  title: 'WABAG\'s Incentive to Collaborate',
  valueProp: 'Most desal EPC companies design-build and walk away. If WABAG can offer a "desal + compute" package, they differentiate from every other desal EPC in the market.',
  angles: [
    'Differentiator: "WABAG offers the world\'s first desalination plant with integrated zero-carbon AI compute." No other desal EPC can say this.',
    'Higher margin: The compute module integration is value-added engineering beyond standard desal EPC. Higher margin than just the desal train.',
    'Recurring revenue: If WABAG does O&M on Building B, they also get ongoing service revenue from the integrated plant (vs one-time EPC).',
    'Strategic positioning: Governments love "AI + Water" dual-purpose projects. WABAG wins more desal RFPs by offering this as a value-add.',
    'Global expansion: The module can be replicated across WABAG\'s desal project pipeline in Middle East, Africa, SE Asia.',
  ],
  firstAskOfMayank: [
    'Which desal projects (KSA or India) are you currently in FEED / design phase for?',
    'Can we propose a Roborns co-location module as a design option to the client?',
    'Does WABAG have the internal capability to provide the civil + thermal integration for a compute module, or would this need a JV partner?',
    'Can WABAG provide budgetary pricing for the MED skid at 4 scales (2/5/10/20MW) as we discussed?',
    'What is the lead time to sign the NDA so we can share detailed thermal and compute specs?',
  ],
};

// ─── COUNTRY-LEVEL TARGET PRIORITY ──────────────────────────────────────────

export const COLOCATION_PRIORITY = {
  ksa: {
    priority: 'HIGH',
    timeframe: '12–18 month engagement cycle',
    pathway: 'WABAG intro → ACWA Power or SWCC project → co-location pilot (2MW) → scale to 5–20MW',
    keyEnabler: 'WABAG\'s existing SWCC/ACWA relationships. Shawaz\'s KSA network for local partner requirement.',
    why: 'Subsidized power makes KSA the highest-margin geography. PIF AI compute funding is a tailwind. Desal is critical national infrastructure.',
  },
  india: {
    priority: 'HIGH (near-term)',
    timeframe: '6–12 month engagement cycle',
    pathway: 'WABAG → Karnataka desal policy or Gujarat desal RFP → incorporate Roborns module → pitch JSW or state govt',
    keyEnabler: 'Shawaz is Karnataka-based. WABAG is Indian HQ. IndiaAI Mission compute subsidy available.',
    why: 'Faster to execute (no cross-border entity). Aligns with existing Kapu Phase 1. State govt relationship easier to build.',
  },
};

export const SUMMARY = {
  headline: 'Roborns + WABAG — Desalination Co-Location Opportunity',
  immediateNextSteps: [
    '1. Share this document with Mayank (roborns-wabag-quote.ts covers Point 1; this file covers Point 2)',
    '2. Request WABAG\'s list of current desal projects in FEED/design phase in KSA and India',
    '3. Propose a joint feasibility study for integrating a 2MW Roborns module into one of those projects',
    '4. Sign NDA to exchange detailed thermal and compute specs for accurate quoting',
    '5. Target: first co-located pilot announcement by Q1 2027',
  ],
};
