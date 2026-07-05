// ─────────────────────────────────────────────────────────────────────────────
// DROS — Desert Restoration Operating System
// Venture Profile (added 17 Jun 2026)
// ClimateTech + AI + Biotech + Environmental Infrastructure Platform
// Primary market: Saudi Arabia, then other arid regions
// ─────────────────────────────────────────────────────────────────────────────

export const DROS = {
  name: 'DROS',
  fullName: 'Desert Restoration Operating System',
  tagline: 'Identify, restore, monitor, and monetize degraded land using AI, biotechnology, and environmental intelligence.',
  color: '#5B8A5E',
  status: 'concept' as const,
  founded: 'June 2026',
  team: {
    lead: 'Shawaz Sharif',
    brother: 'Sharfraz (Dammam, on-ground KSA ops)',
    network: {
      riyadh: 'Saeed (ex-partner, ACWA/PIF/govt introductions)',
      dammam: 'Sharfraz (site scouting, Eastern Province ops)',
    },
  },
  primaryMarket: 'Saudi Arabia',
  secondaryMarkets: ['UAE', 'Oman', 'Qatar', 'Egypt', 'Jordan', 'Australia'],
};

// ── BUSINESS MODEL CANVAS ─────────────────────────────────────────────────────

export interface BMCSection {
  title: string;
  items: { label: string; details: string[] }[];
}

export const BMC: BMCSection[] = [
  {
    title: '1. Key Partners',
    items: [
      {
        label: 'Government & Public Sector',
        details: [
          'Ministry of Environment, Water and Agriculture (MEWA)',
          'Saudi Green Initiative (SGI)',
          'National Center for Vegetation Development (NCVC)',
          'Municipalities',
        ],
      },
      {
        label: 'Mega Projects',
        details: ['NEOM', 'Red Sea Global', 'Qiddiya', 'Diriyah Company'],
      },
      {
        label: 'Technology Partners',
        details: ['Google Earth Engine', 'Satellite data providers', 'Drone companies', 'Cloud infrastructure providers'],
      },
      {
        label: 'Scientific Partners',
        details: ['Universities', 'Research institutes (KAUST, KACST)', 'Biotechnology labs', 'Environmental consulting firms'],
      },
      {
        label: 'Commercial Partners',
        details: ['Agricultural companies', 'Mining companies', 'Carbon credit developers', 'Landscape contractors'],
      },
    ],
  },
  {
    title: '2. Key Resources',
    items: [
      {
        label: 'Intellectual Property',
        details: [
          'Desert Rehabilitation Algorithms',
          'Land Health Scoring Models',
          'Carbon Estimation Models',
          'Cyanobacteria Formulations',
        ],
      },
      {
        label: 'Data Assets',
        details: ['Satellite imagery database', 'Historical NDVI records', 'Soil maps', 'Rainfall datasets', 'Climate datasets'],
      },
      {
        label: 'Human Resources',
        details: ['AI Engineers', 'GIS Specialists', 'Microbiologists', 'Environmental Scientists', 'Software Developers'],
      },
      {
        label: 'Technology Assets',
        details: ['AI Models', 'GIS Platform', 'Monitoring Dashboard', 'Mobile Applications'],
      },
    ],
  },
  {
    title: '3. Key Activities',
    items: [
      {
        label: 'AI & Analytics',
        details: [
          'Desertification prediction models',
          'Land health assessment',
          'Carbon sequestration estimation',
          'Restoration recommendation engines',
        ],
      },
      {
        label: 'Monitoring',
        details: ['Vegetation growth', 'Soil recovery', 'Water stress', 'Restoration performance'],
      },
      {
        label: 'Restoration Planning',
        details: ['Site assessment reports', 'Rehabilitation plans', 'Water optimization plans', 'Carbon reports'],
      },
      {
        label: 'Biotechnology',
        details: ['Cyanobacteria products', 'Soil restoration products', 'Water retention products', 'Biofertilizers'],
      },
      {
        label: 'Consulting',
        details: ['Environmental assessments', 'Feasibility studies', 'Carbon project development'],
      },
    ],
  },
  {
    title: '4. Value Proposition',
    items: [
      {
        label: 'For Governments',
        details: ['Problem: No real-time national view of land degradation.', 'Solution: A digital operating system that identifies degraded land, prioritizes restoration projects, and measures environmental outcomes.'],
      },
      {
        label: 'For Mega Projects',
        details: ['Problem: High costs and uncertainty in land rehabilitation.', 'Solution: AI-powered recommendations that reduce project risk and improve restoration success rates.'],
      },
      {
        label: 'For Farmers',
        details: ['Problem: Water scarcity and poor soil health.', 'Solution: Reduce water usage while improving soil productivity and crop yields.'],
      },
      {
        label: 'For Carbon Developers',
        details: ['Problem: Expensive monitoring and verification.', 'Solution: Automated carbon measurement and reporting.'],
      },
    ],
  },
  {
    title: '5. Customer Relationships',
    items: [
      {
        label: 'Enterprise Accounts',
        details: ['Dedicated account managers', 'Environmental consultants', 'Technical support'],
      },
      {
        label: 'Government Partnerships',
        details: ['Long-term strategic contracts.'],
      },
      {
        label: 'SaaS Customers',
        details: ['Self-service dashboard.'],
      },
      {
        label: 'Community',
        details: ['Knowledge base', 'Training programs', 'Certification programs'],
      },
    ],
  },
  {
    title: '6. Channels',
    items: [
      {
        label: 'Direct Sales',
        details: ['Government ministries', 'Mega projects', 'Agricultural corporations', 'Mining companies'],
      },
      {
        label: 'Strategic Partnerships',
        details: ['Environmental consultants', 'Engineering firms', 'Sustainability advisors'],
      },
      {
        label: 'Digital Channels',
        details: ['Website', 'LinkedIn', 'Industry webinars', 'Climate conferences'],
      },
      {
        label: 'Government Tenders',
        details: ['Major source of contracts. KSA procurement cycle: 12-18 months.'],
      },
    ],
  },
  {
    title: '7. Customer Segments',
    items: [
      {
        label: 'Primary: Government Agencies',
        details: ['Need: National monitoring, desertification control, afforestation management.'],
      },
      {
        label: 'Primary: Mega Projects',
        details: ['Need: Land restoration, environmental compliance, sustainability reporting.'],
      },
      {
        label: 'Primary: Agricultural Sector',
        details: ['Need: Water optimization, soil health improvement.'],
      },
      {
        label: 'Primary: Mining Sector',
        details: ['Need: Land rehabilitation, environmental compliance.'],
      },
      {
        label: 'Secondary: Carbon Credit Developers',
        details: ['Need: MRV (Measurement, Reporting & Verification).'],
      },
      {
        label: 'Secondary: ESG & Sustainability Teams',
        details: ['Need: Environmental reporting, carbon accounting.'],
      },
      {
        label: 'Secondary: Research Institutions',
        details: ['Need: Environmental intelligence data.'],
      },
    ],
  },
  {
    title: '8. Cost Structure',
    items: [
      {
        label: 'Technology Costs',
        details: ['Cloud infrastructure', 'Satellite data processing', 'Data storage', 'AI model training'],
      },
      {
        label: 'Personnel',
        details: ['AI engineers', 'GIS analysts', 'Software developers', 'Environmental scientists'],
      },
      {
        label: 'Operations',
        details: ['Office', 'Travel', 'Field surveys', 'Drone operations'],
      },
      {
        label: 'Research & Development',
        details: ['Biotech development', 'AI model improvement', 'Pilot projects'],
      },
      {
        label: 'Sales & Marketing',
        details: ['Business development', 'Conferences', 'Industry exhibitions'],
      },
      {
        label: 'Regulatory & Compliance (KSA-specific)',
        details: ['MISA licensing', 'Saudi FDA (biotech)', 'Local content requirements', 'Insurance (biotech liability)'],
      },
    ],
  },
  {
    title: '9. Revenue Streams',
    items: [
      {
        label: '1. SaaS Subscription',
        details: [
          'Basic: Land monitoring dashboard',
          'Professional: AI recommendations',
          'Enterprise: Government & large projects',
          'Est. SAR 1,000–10,000/month/customer',
          'NOTE: Government procurement favors enterprise contracts (SAR 500K+) rather than monthly SaaS. Revisit pricing model.',
        ],
      },
      {
        label: '2. Environmental Assessment Reports',
        details: ['Charge per site', 'Land health reports, carbon assessments, restoration feasibility studies', 'Est. SAR 10,000–100,000/project'],
      },
      {
        label: '3. Rehabilitation Planning',
        details: ['AI-generated restoration plans', 'Est. SAR 50,000–500,000/project'],
      },
      {
        label: '4. Restoration Project Management',
        details: ['Manage implementation', 'Est. 5–15% of project value'],
      },
      {
        label: '5. Biotech Product Sales',
        details: ['Future phase: cyanobacteria products, water retention, biofertilizers', 'High-margin recurring revenue', 'NOTE: Requires separate manufacturing facility capex.'],
      },
      {
        label: '6. Carbon Credit Services',
        details: ['Carbon project development, monitoring, verification', 'Est. 10–20% of carbon project revenue'],
      },
      {
        label: '7. Government Contracts',
        details: ['Large-scale national monitoring contracts', 'Potential: millions of SAR annually', 'Longest sales cycle (12-18mo) but largest TAM.'],
      },
    ],
  },
];

// ── MVP STRATEGY NOTES ───────────────────────────────────────────────────────

export const MVP_NOTES = `
MVP WEDGE RECOMMENDATION:

Phase 0 — Foundation (we are here)
  - Register DROS entity (standalone vs. under existing HoldCo?)
  - Map KSA regulatory landscape
  - Identify first pilot project / target customer
  - Build initial pitch deck

Phase 1 — Environmental Assessment Reports + Monitoring Dashboard (~3 months)
  - Build a land health monitoring dashboard using free satellite data
  - Google Earth Engine API (Sentinel-2 NDVI, Landsat, soil moisture)
  - Generate automated Land Health Reports (PDF export)
  - Sell reports to government/mega-projects as proof of concept
  - Revenue: SAR 10K-100K/project
  - This is the shortest-revenue-cycle wedge

Phase 2 — AI Restoration Planning (~6 months)
  - Add restoration recommendation engine
  - Carbon sequestration estimation module
  - Rehabilitation planning tool
  - Revenue: SAR 50K-500K/project
  - This is where the "OS" brand takes shape

Phase 3 — Platform Scaling (~9-12 months)
  - Full SaaS platform with self-service dashboard
  - Government contract procurement
  - Carbon credit MRV module
  - Begin biotech R&D feasibility

Phase 4 — Biotech Manufacturing (18+ months)
  - Facility, regulatory approval, production scale-up
  - Separate capital raise

CRITICAL RISKS:
  1. AI model validation — need scientific/KAUST partnership for credibility
  2. Government sales cycle — need a shorter-revenue wedge to survive it
  3. Too many customer segments — need to pick ONE beachhead
  4. Biotech manufacturing capex — don't conflate with software budget
`;

// ── COMPETITIVE LANDSCAPE ────────────────────────────────────────────────────

export const COMPETITIVE_LANDSCAPE = `
- Planet Labs / Descartes Labs: Satellite data + analytics. Not KSA-focused, no restoration execution.
- Dendra Systems: AI + drones for ecosystem restoration. UK-based, coastal focus. Closest competitor.
- Land Life Company: Tech-driven reforestation. More tree-planting, less analytics platform.
- Saudi-specific: NCVC operates its own monitoring. Government may prefer local-first.
- Gap DROS fills: Integrated platform (assess → plan → execute → monitor → monetize) vs. point solutions.
`;

// ── FUNDING LANDSCAPE ────────────────────────────────────────────────────────

export const FUNDING_SOURCES = [
  { name: 'MCIT AI Fund', type: 'Grant', estAmount: 'SAR 1M-5M', notes: 'Saudi Ministry of Comms & IT — National AI Strategy grants for AI-based environmental solutions.' },
  { name: 'SIDF', type: 'Concessional Loan', estAmount: 'Up to SAR 40M', notes: 'Saudi Industrial Dev Fund — manufacturing/industrial facilities. Relevant for Phase 4 biotech.' },
  { name: 'Saudi Green Initiative', type: 'Government Program', estAmount: 'TBD', notes: 'SGI has allocated significant funds for land restoration. Need to identify specific procurement/grant windows.' },
  { name: 'KAUST Innovation Fund', type: 'Grant/Equity', estAmount: 'TBD', notes: 'Deep tech startup funding. Also potential scientific validation partner.' },
  { name: 'PIF Climate & Environment', type: 'SWF Investment', estAmount: 'TBD', notes: 'Longer-term. PIF has a dedicated climate/environment investment mandate.' },
  { name: "Wa'ed (Aramco)", type: 'Venture Capital', estAmount: 'Up to $5M', notes: "Aramco's VC arm. Cleantech and sustainability focus." },
];
