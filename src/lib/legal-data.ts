// ─── NDA REGISTRY ────────────────────────────────────────────────────────────

export type NDAStatus = 'active' | 'expired' | 'pending' | 'unsigned';

export interface NDAEntry {
  id:        string;
  party:     string;
  type:      'Bilateral' | 'Unilateral';
  venture:   string;
  signed:    string;
  expiry:    string;
  status:    NDAStatus;
  purpose:   string;
  location:  string;
}

export const NDAS: NDAEntry[] = [
  { id: 'NDA-001', party: 'Thermal Engineering Partner (TBD)', type: 'Bilateral', venture: 'Roborns', signed: 'Pending', expiry: '1 year from signing', status: 'pending', purpose: 'Sharing Roborns technical spec and financial model with engineering partner for feasibility assessment', location: 'To be filed: Google Drive / Legal / NDAs' },
  { id: 'NDA-002', party: 'Dubai HoldCo Legal Counsel (TBD)', type: 'Bilateral', venture: 'Codelude', signed: 'Pending', expiry: '2 years from signing', status: 'pending', purpose: 'HoldCo incorporation details, token structure, cap table, and investor terms', location: 'To be filed: Google Drive / Legal / NDAs' },
  { id: 'NDA-003', party: 'Franchise Brand Partner 1 (TBD)', type: 'Bilateral', venture: 'Franchiseen', signed: 'Pending', expiry: '1 year from signing', status: 'pending', purpose: 'Sharing platform architecture, payout model, and pilot investment terms', location: 'To be filed: Google Drive / Legal / NDAs' },
  { id: 'NDA-004', party: 'Investor Prospect 1 (TBD)', type: 'Unilateral', venture: 'Roborns', signed: 'Pending', expiry: '2 years from signing', status: 'pending', purpose: 'Sharing Roborns financial model, site details, and seed round terms', location: 'To be filed: Google Drive / Legal / NDAs' },
];

// ─── CONTRACTS ────────────────────────────────────────────────────────────────

export type ContractStatus = 'draft' | 'review' | 'signed' | 'active' | 'expired' | 'terminated';
export type ContractType   = 'Service' | 'Employment' | 'Partnership' | 'Investment' | 'Lease' | 'SaaS' | 'Advisory';

export interface Contract {
  id:          string;
  title:       string;
  party:       string;
  type:        ContractType;
  venture:     string;
  value:       string;
  startDate:   string;
  endDate:     string;
  status:      ContractStatus;
  keyTerms:    string;
  location:    string;
}

export const CONTRACTS: Contract[] = [
  { id: 'CON-001', title: 'VPS Hosting Agreement', party: 'Cloud Provider', type: 'SaaS', venture: 'Codelude', value: '~$120/month', startDate: '2025-01-01', endDate: 'Rolling', status: 'active', keyTerms: 'Monthly billing, 99.9% uptime SLA, 2vCPU 8GB 160GB NVMe CentOS 9', location: 'Email / Provider dashboard' },
  { id: 'CON-002', title: 'Thermal Engineering — Feasibility', party: 'TBD Engineering Firm', type: 'Service', venture: 'Roborns', value: '$5,000–10,000', startDate: 'Q3 2026', endDate: 'Q4 2026', status: 'draft', keyTerms: 'Fixed-fee feasibility study. Deliverable: technical validation report and heat exchange system design.', location: 'Pending — to be filed: Google Drive / Legal / Contracts' },
  { id: 'CON-003', title: 'Dubai HoldCo Incorporation', party: 'DIFC Legal Counsel (TBD)', type: 'Service', venture: 'Codelude', value: '$5,000–15,000', startDate: 'Q3 2026', endDate: 'Q3 2026', status: 'draft', keyTerms: 'One-time incorporation + ongoing compliance retainer. DIFC free zone entity.', location: 'Pending — to be filed: Google Drive / Legal / Contracts' },
  { id: 'CON-004', title: 'Franchiseen Investment Platform Legal', party: 'Investment Law Firm (TBD)', type: 'Service', venture: 'Franchiseen', value: '$2,500/month', startDate: 'Q3 2026', endDate: '12 months', status: 'draft', keyTerms: 'Monthly retainer for SEBI compliance, investor agreement templates, platform legal review.', location: 'Pending — to be filed: Google Drive / Legal / Contracts' },
  { id: 'CON-005', title: 'Smart Contract Security Audit', party: 'Audit Firm (TBD)', type: 'Service', venture: 'Roborns', value: '$20,000–50,000', startDate: 'Q4 2026', endDate: 'Q4 2026', status: 'draft', keyTerms: 'One-time audit of Roborns token smart contract before issuance. Deliverable: public audit report.', location: 'Pending — to be contracted post token structure finalisation' },
  { id: 'CON-006', title: 'Domain Registrar Annual Renewal', party: 'Domain Registrar', type: 'SaaS', venture: 'Codelude', value: '~$90/year (all domains)', startDate: 'Rolling', endDate: 'Rolling', status: 'active', keyTerms: 'Annual renewal for codelude.com, roborns.com, franchiseen.com, hubcv.com, cuestay.com, dextrip.com.', location: 'Domain registrar dashboard' },
];

// ─── GOVERNMENT ───────────────────────────────────────────────────────────────

export type GovtStatus  = 'required' | 'in-progress' | 'submitted' | 'approved' | 'not-required';
export type GovtJurisdiction = 'India' | 'UAE' | 'International';

export interface GovtFiling {
  id:           string;
  title:        string;
  authority:    string;
  jurisdiction: GovtJurisdiction;
  venture:      string;
  status:       GovtStatus;
  deadline:     string;
  notes:        string;
}

export const GOVT_FILINGS: GovtFiling[] = [
  { id: 'G01', title: 'Coastal Regulatory Zone (CRZ) clearance', authority: 'Karnataka Coastal Zone Management Authority', jurisdiction: 'India', venture: 'Roborns', status: 'required', deadline: 'Before construction', notes: 'CRZ-III clearance required for coastal industrial facility within 500m of high-tide line. Timeline: 6–12 months. Engage environmental law firm.' },
  { id: 'G02', title: 'Environmental Impact Assessment', authority: 'Karnataka State Pollution Control Board', jurisdiction: 'India', venture: 'Roborns', status: 'required', deadline: 'Before construction', notes: 'EIA for industrial facility. Requires baseline survey, public consultation, and KSPCB approval. Budget: ₹10–25L.' },
  { id: 'G03', title: 'MESCOM 10MW HT Power Connection', authority: 'Mangalore Electricity Supply Company (MESCOM)', jurisdiction: 'India', venture: 'Roborns', status: 'required', deadline: 'Q2 2027', notes: 'Industrial HT connection application. Standard process for large industrial consumers. Lead time: 4–6 months from application.' },
  { id: 'G04', title: 'Dubai HoldCo — DIFC Free Zone Incorporation', authority: 'Dubai International Financial Centre (DIFC)', jurisdiction: 'UAE', venture: 'Codelude', status: 'in-progress', deadline: 'Q3 2026', notes: 'DIFC Single Family Office or DIFC Company registration. Enables token issuance and investor management under DFSA framework.' },
  { id: 'G05', title: 'Token / Digital Asset Registration (DFSA)', authority: 'Dubai Financial Services Authority', jurisdiction: 'UAE', venture: 'Codelude', status: 'required', deadline: 'Before token issuance', notes: 'DFSA oversight of digital asset issuance from DIFC. Requires DIFC registration first. Legal counsel to advise on exact framework.' },
  { id: 'G06', title: 'SEBI — Investment Adviser Registration or Exemption', authority: 'Securities and Exchange Board of India', jurisdiction: 'India', venture: 'Franchiseen', status: 'required', deadline: 'Before investor onboarding', notes: 'Franchiseen must determine if it falls under SEBI IA regulations for accepting retail investor capital. Revenue-sharing structure may not require registration — legal review needed.' },
  { id: 'G07', title: 'India DPDP Act Compliance', authority: 'Ministry of Electronics and IT (MeitY)', jurisdiction: 'India', venture: 'Codelude', status: 'required', deadline: 'Before user data collection', notes: 'Digital Personal Data Protection Act 2023 compliance required for HubCV, Franchiseen investor data. Data processing policy, consent framework, deletion mechanism required.' },
  { id: 'G08', title: 'GST Registration — India Entity', authority: 'Goods and Services Tax Network (GSTN)', jurisdiction: 'India', venture: 'Codelude', status: 'required', deadline: 'When India revenue exceeds ₹20L threshold', notes: 'GST registration when Franchiseen or HubCV begins billing Indian customers. Dextrip subscription billing may trigger earlier.' },
];
