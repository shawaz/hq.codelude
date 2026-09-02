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
  { name: 'codelude.com', type: 'Domain', venture: 'Codelude', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Primary company domain. SSL live via Let\'s Encrypt.' },
  { name: 'roborns.com', type: 'Domain', venture: 'Roborns', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Venture website live.' },
  { name: 'franchiseen.com', type: 'Domain', venture: 'Franchiseen', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Platform domain. Website pending.' },
  { name: 'hubcv.pro', type: 'Domain', venture: 'HubCV', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Platform domain. Website pending.' },
  { name: 'nanotrade.com', type: 'Domain', venture: 'Nanotrade', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Live trading platform domain.' },
  { name: 'llife.ai', type: 'Domain', venture: 'Llife', status: 'active', value: '$15/year', location: 'Domain Registrar', notes: 'Platform domain. Website pending.' },
  { name: 'Roborns Coastal Site — Mangaluru', type: 'Physical', venture: 'Roborns', status: 'planned', value: 'Land lease TBD', location: 'Uchila Thalapady, Mangaluru', notes: '1-acre coastal site for Phase 1 facility. Lease pending site survey and permits.' },
  { name: 'Llife Five-Domain Model', type: 'IP', venture: 'Llife', status: 'in-development', value: 'Proprietary', location: 'GitHub / llife / docs', notes: 'Domain taxonomy, time-block schema and the scoring model behind the daily review. Internal IP.' },
  { name: 'Nanotrade Strategy Engine', type: 'IP', venture: 'Nanotrade', status: 'active', value: 'Proprietary', location: 'GitHub / nanotrade', notes: 'Multi-exchange trading automation engine. Core IP of the Nanotrade platform.' },
  { name: 'HubCV Matching Algorithm', type: 'IP', venture: 'HubCV', status: 'in-development', value: 'Proprietary', location: 'GitHub / hubcv', notes: 'AI-driven candidate-to-opportunity matching. In development.' },
];
