// ─── OFFICE ──────────────────────────────────────────────────────────────────

export interface OfficeLocation {
  name: string;
  type: 'Registered' | 'Engineering' | 'Remote' | 'Server';
  city: string;
  country: string;
  status: 'active' | 'planned' | 'virtual';
  purpose: string;
  notes: string;
}

export const OFFICES: OfficeLocation[] = [
  { name: 'Codelude HoldCo — Dubai', type: 'Registered', city: 'Dubai', country: 'UAE', status: 'planned', purpose: 'Registered address for Dubai HoldCo entity. DIFC or mainland incorporation.', notes: 'Pending HoldCo incorporation (Q3 2026). Registered address service ~$500–800/year.' },
  { name: 'Engineering Base — Mangaluru', type: 'Engineering', city: 'Mangaluru', country: 'India', status: 'active', purpose: 'Primary engineering and operations base. Roborns site nearby. Core team location.', notes: 'No formal office lease yet. Founder operates from home base. Office space to be taken when team > 3.' },
  { name: 'Production Server', type: 'Server', city: 'Frankfurt', country: 'Germany', status: 'active', purpose: 'All Codelude platforms hosted on 64.227.160.224. 2 vCPU, 8GB RAM, 160GB NVMe, CentOS 9.', notes: 'Hosted via cloud provider. Monthly cost ~$120. Apache + PM2 stack. All 10+ platforms on this node.' },
  { name: 'Remote — Southeast Asia', type: 'Remote', city: 'Kuala Lumpur', country: 'Malaysia', status: 'planned', purpose: 'Future SE Asia hub for Llife and HubCV regional operations.', notes: 'Not active. Planned for 2027 when SE Asia operations begin.' },
];

// ─── DEPARTMENTS ─────────────────────────────────────────────────────────────

export interface Department {
  name: string;
  lead: string;
  headcount: number;
  ventures: string[];
  status: 'active' | 'forming' | 'planned';
  responsibilities: string[];
}

export const DEPARTMENTS: Department[] = [
  { name: 'Engineering', lead: 'Shawaz (Acting)', headcount: 1, ventures: ['Codelude', 'Roborns', 'Nanotrade', 'HubCV', 'Llife', 'Franchiseen'], status: 'active', responsibilities: ['Platform development', 'Infrastructure management', 'Llife protocol', 'HubCV matching engine', 'Nanotrade automation engine'] },
  { name: 'Strategy & Finance', lead: 'Shawaz', headcount: 1, ventures: ['Codelude'], status: 'active', responsibilities: ['Venture strategy', 'Financial modelling', 'Investor relations', 'HoldCo token structure', 'Budget management'] },
  { name: 'Operations', lead: 'Shawaz (Acting)', headcount: 1, ventures: ['Codelude'], status: 'active', responsibilities: ['Company OS (HQ)', 'Legal coordination', 'Partner management', 'Procurement', 'Team administration'] },
  { name: 'Roborns Engineering', lead: 'TBH — Thermal Engineer', headcount: 0, ventures: ['Roborns'], status: 'forming', responsibilities: ['Site engineering', 'Thermal system design', 'Desalination unit', 'Coastal infrastructure', 'Govt permit liaison'] },
  { name: 'Franchiseen Product', lead: 'TBH', headcount: 0, ventures: ['Franchiseen'], status: 'forming', responsibilities: ['Platform product management', 'KYC/AML integration', 'Payout infrastructure', 'Franchise partner onboarding', 'Investor support'] },
  { name: 'Marketing & Brand', lead: 'TBH', headcount: 0, ventures: ['Codelude'], status: 'planned', responsibilities: ['Brand identity', 'Content strategy', 'Investor communications', 'Social media', 'PR and media relations'] },
  { name: 'Legal & Compliance', lead: 'External Counsel', headcount: 0, ventures: ['Codelude', 'Franchiseen', 'Roborns'], status: 'forming', responsibilities: ['HoldCo incorporation', 'Token structure legal review', 'Investment platform compliance', 'NDA and contract management', 'IP protection'] },
  { name: 'People & Culture', lead: 'TBH', headcount: 0, ventures: ['Codelude'], status: 'planned', responsibilities: ['Recruitment', 'Onboarding', 'Culture', 'Performance', 'Team wellbeing'] },
];

// ─── FRANCHISE (OPERATIONS) ───────────────────────────────────────────────────

export interface FranchiseBrand {
  name: string;
  category: string;
  country: string;
  status: 'active' | 'prospecting' | 'negotiating' | 'signed' | 'live';
  contact: string;
  unitCount: number;
  investmentMin: string;
  expectedRevenue: string;
  notes: string;
}

export const FRANCHISE_BRANDS: FranchiseBrand[] = [
  { name: 'F&B Brand 1 (TBD)', category: 'Food & Beverage', country: 'India', status: 'prospecting', contact: 'TBD', unitCount: 0, investmentMin: '$20K–50K', expectedRevenue: '₹15–25L/year/unit', notes: 'First target: mid-size regional F&B chain with 5–20 units. Strong unit economics essential.' },
  { name: 'Retail Brand 1 (TBD)', category: 'Retail', country: 'India', status: 'prospecting', contact: 'TBD', unitCount: 0, investmentMin: '$15K–30K', expectedRevenue: '₹10–20L/year/unit', notes: 'Retail franchise with daily cash flow — ideal for daily payout model.' },
  { name: 'Service Brand 1 (TBD)', category: 'Services', country: 'India', status: 'prospecting', contact: 'TBD', unitCount: 0, investmentMin: '$10K–25K', expectedRevenue: '₹8–15L/year/unit', notes: 'Service franchise (education, fitness, etc.) — lower capex, recurring revenue.' },
];

// ─── PROPERTIES ──────────────────────────────────────────────────────────────

export type PropertyType = 'Digital' | 'Physical' | 'IP' | 'Domain';
export type PropertyStatus = 'active' | 'pending' | 'planned' | 'in-development';

export interface Property {
  name: string;
  type: PropertyType;
  venture: string;
  status: PropertyStatus;
  value: string;
  location: string;
  notes: string;
}

export const PROPERTIES: Property[] = [
  { name: 'Production Server — 64.227.160.224', type: 'Digital', venture: 'Codelude', status: 'active', value: '$120/month', location: 'Cloud VPS — Frankfurt', notes: 'Hosts all 10+ Codelude platforms. CentOS 9, Apache + PM2.' },
  { name: 'codelude.com', type: 'Domain', venture: 'Codelude', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Primary company domain — studio site and hq.codelude.com. SSL live via Let\'s Encrypt.' },
  { name: 'llife.app', type: 'Domain', venture: 'Llife', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Llife product host. Held as a placeholder for llife.ai, which is wanted but not yet budgeted.' },
  { name: 'roborns.com', type: 'Domain', venture: 'Roborns', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Venture website live.' },
  { name: 'franchiseen.com', type: 'Domain', venture: 'Franchiseen', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Platform domain. Website pending.' },
  { name: 'hubcv.pro', type: 'Domain', venture: 'HubCV', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Platform domain. Website pending.' },
  { name: 'nanotrade.com', type: 'Domain', venture: 'Nanotrade', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Live trading platform domain.' },
  { name: 'Roborns Site — Uchila Thalapady (SUPERSEDED)', type: 'Physical', venture: 'Roborns', status: 'planned', value: 'Not pursued', location: 'Uchila Thalapady, Mangaluru (DK)', notes: 'RULED OUT — no power available at site. Original 1-acre Phase 1 candidate. Killed on grid access before any survey was commissioned; the $3K site survey would have caught this. Kept on the record as siting evidence.' },
  { name: 'Roborns Site — Kapu (SUPERSEDED)', type: 'Physical', venture: 'Roborns', status: 'planned', value: 'Not pursued', location: 'Kapu, Udupi district', notes: 'SUPERSEDED by Mangaluru/DK. Published on roborns.com/investors as the primary site: 20MW at full buildout, existing grid 5km away, full capacity requires new substation, grid approval dated Q3 2029. Two problems: the 2029 date collides with the Q1 2027 construction start in the fundraise timeline, and Udupi sits outside the Dakshina Kannada AI cluster the state is planning. Public site still shows Kapu — needs updating.' },
  { name: 'Roborns Coastal Site — Mangaluru (PREFERRED)', type: 'Physical', venture: 'Roborns', status: 'planned', value: 'Lease or KIADB allotment — TBD', location: 'Panambur / Baikampady, Mangaluru, Dakshina Kannada', notes: 'PREFERRED SITING as of Sep 2026. Dakshina Kannada puts the project inside the state AI data centre cluster; Baikampady is a KIADB area with 350 acres earmarked for a data centre park. Port (NMPT) and MRPL adjacency means HT power infrastructure already exists — the constraint that killed Uchila Thalapady. Nearest point to the proposed Mangaluru cable landing station. Coastal frontage available for a marine intake, which an inland industrial estate cannot offer. ACTION: pursue KIADB allotment via KDEM / Karnataka Udyog Mitra rather than private purchase — policy gives 10% land subsidy outside Bengaluru Urban plus 100% stamp duty exemption.' },
  { name: 'Panambur parcel — 7 acres (EVALUATING, do not buy)', type: 'Physical', venture: 'Roborns', status: 'planned', value: '₹7 lakh/cent → ₹28 Cr for 4 acres, ₹49 Cr for 7 acres', location: 'Panambur, Mangaluru — 12.9416386, 74.8044337', notes: 'PRIVATE PARCEL OFFERED, NOT ACQUIRED. 7 acres at ₹7 lakh/cent = ₹7 Cr/acre = ~₹1,607/sq ft. Staged plan is 4 acres (₹28 Cr) expanding to 7 (₹49 Cr). DO NOT PROCEED PENDING: (1) CRZ classification for the survey number — pin sits on the coast just north of New Mangalore Port near Panambur Beach, and beachfront adjacent to a public beach is the hardest CRZ case; the plot may be unbuildable for this use at any price. (2) KIADB allotment rate for Baikampady as the comparable — private coastal-commercial pricing is not the right benchmark for industrial use. (3) Title, survey and encumbrance due diligence. PRICE CONTEXT: at ₹28 Cr for a 2MW Phase 1, land alone is ₹14 Cr/MW — more per MW than Datasamudra\'s entire ₹300–500 Cr / 35–40 MW project (₹8.5–14 Cr/MW all-in). Only rationalises at full 20MW buildout (₹2.45 Cr/MW), which cannot be underwritten pre-feasibility. Phase 1 raise is ₹15 Cr; 4 acres is 1.9x the entire round.' },
  { name: 'Llife Five-Domain Model', type: 'IP', venture: 'Llife', status: 'in-development', value: 'Proprietary', location: 'GitHub / llife / docs', notes: 'Domain taxonomy, time-block schema and the scoring model behind the daily review. Internal IP.' },
  { name: 'Nanotrade Strategy Engine', type: 'IP', venture: 'Nanotrade', status: 'active', value: 'Proprietary', location: 'GitHub / nanotrade', notes: 'Multi-exchange trading automation engine. Core IP of the Nanotrade platform.' },
  { name: 'HubCV Matching Algorithm', type: 'IP', venture: 'HubCV', status: 'in-development', value: 'Proprietary', location: 'GitHub / hubcv', notes: 'AI-driven candidate-to-opportunity matching. In development.' },
];
