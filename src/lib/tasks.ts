export type Priority = 'high' | 'medium' | 'low';
export type Status   = 'todo' | 'in-progress' | 'done';
export type Project  = 'Roborns' | 'Franchiseen' | 'HubCV' | 'Cuestay' | 'Dextrip' | 'DROS';

export interface Task {
  id: string;
  title: string;
  project: Project;
  category: string;
  priority: Priority;
  status: Status;
}

export const PROJECT_COLORS: Record<Project, string> = {
  Roborns:    '#5DCAA5',
  Franchiseen:'#7F77DD',
  HubCV:      '#FAC775',
  Cuestay:    '#85B7EB',
  Dextrip:    '#F0997B',
  DROS:       '#5B8A5E',
};

export const TASKS: Task[] = [
  // ── ROBORNS ──────────────────────────────────────────────────────────
  { id: 'r01', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'in-progress', title: 'Engage thermal engineering partner' },
  { id: 'r02', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'in-progress', title: 'Kapu site survey — 2 acres, 5km from substation (13°12\'11.4"N 74°44\'37.0"E)' },
  { id: 'r03', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'todo',        title: 'AI datacenter design specification' },
  { id: 'r04', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'todo',        title: 'Seawater desalination system design' },
  { id: 'r05', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'todo',        title: 'Waste heat recovery system design' },
  { id: 'r06', project: 'Roborns', category: 'Engineering',    priority: 'medium', status: 'todo',        title: 'Mineral extraction process design' },
  { id: 'r07', project: 'Roborns', category: 'Engineering',    priority: 'medium', status: 'todo',        title: 'Power infrastructure planning — Phase 2 (20MW): ₹50 Cr substation + 5km HT line' },
  { id: 'r08', project: 'Roborns', category: 'Engineering',    priority: 'medium', status: 'todo',        title: 'Water intake system engineering' },
  { id: 'r09', project: 'Roborns', category: 'Engineering',    priority: 'low',    status: 'todo',        title: 'Facility architecture design' },
  { id: 'r10', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Environmental impact assessment' },
  { id: 'r11', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'in-progress', title: 'Dubai HoldCo legal structure finalization' },
  { id: 'r12', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Coastal land lease / acquisition' },
  { id: 'r13', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Coastal construction permits (Govt)' },
  { id: 'r14', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Environmental clearance from Karnataka Govt' },
  { id: 'r15', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Token structure design for HoldCo' },
  { id: 'r16', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Seed infrastructure round — term sheet' },
  { id: 'r17', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'done',        title: 'Financial model — Phase 1 capex / opex (recalibrated Jun 2026)' },
  { id: 'r18', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Strategic investor outreach — India seed round + KSA PIF/SWF' },
  // ── Partnerships (email outreach) ────────────────────────────
  { id: 'r19', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'Sachidananda / KPT — transmission connection + land parcels (email sent 10 AM)' },
  { id: 'r20', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'VA Tech Wabag — Second call held 23 Jun. Asks: (1) quotaion 2/5/10/20MW scales + execution plan (2) desal co-location in KSA/India. See roborns-wabag-quote.ts + roborns-desal-colocation.ts' },
  { id: 'r21', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'Greenko / ReNew Power — PPA inquiry (sent)' },
  { id: 'r22', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'Afcons Infrastructure — coastal site survey RFP (sent)' },
  { id: 'r23', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'Karnataka Coastal Authority — CRZ clearance (inquiry sent via MoEFCC)' },
  { id: 'r24', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'NVIDIA / E2E Networks — compute colocation LOI' },
  { id: 'r25', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'Tata Chemicals / GHCL — Mg(OH)₂ offtake MoU' },
  // ── Hyperscaler & Govt Pitch (freshwater crisis strategy) ─────
  { id: 'r26', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'done',        title: '✓ Financial model recalibrated — see fin-models.ts (India + KSA scenarios)' },
  { id: 'r27', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Build hyperscaler pitch narrative — "freshwater crisis" positioning deck' },
  { id: 'r28', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Map target contacts — Google/Microsoft/Nvidia/Meta/AWS sustainability & infra teams' },
  { id: 'r29', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'Secure anchor-tenant LOI — pilot GPU colocation commitment' },
  { id: 'r30', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Build government tender & subsidy application pipeline (IndiaAI, SIDBI, SISFS, AMRUT 2.0, Karnataka)' },
  { id: 'r31', project: 'Roborns', category: 'Finance',        priority: 'medium', status: 'todo',        title: 'IndiaAI Mission compute-subsidy application — DPR + submission' },
  { id: 'r32', project: 'Roborns', category: 'Partnerships',   priority: 'low',    status: 'todo',        title: 'Engage NVentures / Nvidia Inception for technical & investor introductions' },
  // ── Building-wise partner outreach (per Partner_Map_Outreach.md, 12 Jun) ──
  { id: 'r33', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Submer + Refroid — 2MW immersion RFQ (tanks, CDUs, fluid); Refroid also via info@refroid.com' },
  { id: 'r34', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Sterling & Wilson DC — Building A electrical/MEP fit-out budgetary quote (website form)' },
  { id: 'r35', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Thermax + Praj — Building C ZLD RFQ (Phase 1 NaCl-only, EPC and EPC+O&M)' },
  { id: 'r36', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'BARC — MED-TVC technology transfer inquiry letter' },
  { id: 'r37', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Reconcile 10× inconsistency in roborns_financial_model.html (unit economics vs P&L, water revenue)' },
  { id: 'r38', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Update Company_Profile_Project_Brief to 2MW Phase 1 + fill founder/site gaps before sending to vendors' },
  { id: 'r39', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'Incorporate Roborns Infrastructure Pvt Ltd (currently signing as individual w/ assignment clause)' },

  // ── Site change ──────────────────────────────────────────────────────
  { id: 'r50', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'done',       title: 'Uchila Thalapady cancelled — insufficient substation capacity. Kapu confirmed.' },
  { id: 'r51', project: 'Roborns', category: 'Engineering',    priority: 'high',   status: 'todo',       title: 'Kapu land lease — negotiate 2 acres with expansion option to 4' },

  // ── KSA Expansion (dual-track, added Jun 2026) ──────────────────────────
  { id: 'r40', project: 'Roborns', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'KSA entity setup — Dubai HoldCo → KSA subsidiary via MISA (local partner Riyadh)' },
  { id: 'r41', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'in-progress', title: 'ACWA Power — strategic pitch: immersion cooling + desal loop (one-pager drafted ✓)' },
  { id: 'r42', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'PIF tech portfolio — pitch robotics + AI datacenter (Vision 2030 alignment)' },
  { id: 'r43', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Saudi Ministry of Comms & IT — MCIT AI fund / grant application' },
  { id: 'r44', project: 'Roborns', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'G42 / Mubadala — data center infrastructure conduit for Middle East' },
  { id: 'r45', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'Masdar — renewable PPA + carbon credit partnership for immersion cooling' },
  { id: 'r46', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'Dammam/Jubail industrial site scoping — via Shawaz\'s brother (on-ground Dammam)' },
  { id: 'r47', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'SWCC (Saline Water Conversion Corp) — desalination technology synergy for KSA' },
  { id: 'r48', project: 'Roborns', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'SIDF (Saudi Industrial Dev Fund) — industrial loan application' },
  { id: 'r49', project: 'Roborns', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'KSA seed funding — PIF strategic + MCIT AI fund + SIDF industrial grant (target $4.5M)' },

  // ── FRANCHISEEN ───────────────────────────────────────────────────────
  { id: 'f01', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'in-progress', title: 'Platform core development' },
  { id: 'f02', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'in-progress', title: 'Fractional ownership engine' },
  { id: 'f03', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Daily payout infrastructure' },
  { id: 'f04', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Monthly payout system' },
  { id: 'f05', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Investor portal and dashboard' },
  { id: 'f06', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Franchise operator portal' },
  { id: 'f07', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'KYC / AML compliance integration' },
  { id: 'f08', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Payment processing setup' },
  { id: 'f09', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Investor onboarding flow' },
  { id: 'f10', project: 'Franchiseen', category: 'Product',    priority: 'high',   status: 'todo',        title: 'Franchise operator onboarding flow' },
  { id: 'f11', project: 'Franchiseen', category: 'Product',    priority: 'medium', status: 'todo',        title: 'Mobile app development' },
  { id: 'f12', project: 'Franchiseen', category: 'Legal',      priority: 'high',   status: 'todo',        title: 'Investor agreement legal templates' },
  { id: 'f13', project: 'Franchiseen', category: 'Legal',      priority: 'high',   status: 'todo',        title: 'Franchise partnership agreements' },
  { id: 'f14', project: 'Franchiseen', category: 'Legal',      priority: 'high',   status: 'todo',        title: 'Investment platform regulatory compliance' },
  { id: 'f15', project: 'Franchiseen', category: 'Business',   priority: 'high',   status: 'todo',        title: 'First franchise partner signed' },
  { id: 'f16', project: 'Franchiseen', category: 'Finance',    priority: 'high',   status: 'todo',        title: 'First investor round — target and structure' },
  { id: 'f17', project: 'Franchiseen', category: 'Marketing',  priority: 'medium', status: 'todo',        title: 'Marketing website launch' },
  { id: 'f18', project: 'Franchiseen', category: 'Marketing',  priority: 'medium', status: 'todo',        title: 'Investor acquisition campaign' },

  // ── HUBCV ─────────────────────────────────────────────────────────────
  { id: 'h01', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'in-progress', title: 'AI matching engine core development' },
  { id: 'h02', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'in-progress', title: 'Dynamic profile creation system' },
  { id: 'h03', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'todo',        title: 'Skill verification workflow' },
  { id: 'h04', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'todo',        title: 'Human verification portal for assessors' },
  { id: 'h05', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'todo',        title: 'Resume / CV parsing engine' },
  { id: 'h06', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'todo',        title: 'Recruiter portal and dashboard' },
  { id: 'h07', project: 'HubCV', category: 'Product',          priority: 'high',   status: 'todo',        title: 'Professional onboarding flow' },
  { id: 'h08', project: 'HubCV', category: 'Product',          priority: 'medium', status: 'todo',        title: 'Upskilling pathway recommendation engine' },
  { id: 'h09', project: 'HubCV', category: 'Product',          priority: 'medium', status: 'todo',        title: 'Notification and job alert system' },
  { id: 'h10', project: 'HubCV', category: 'Product',          priority: 'medium', status: 'todo',        title: 'Premium feature paywall and billing' },
  { id: 'h11', project: 'HubCV', category: 'Product',          priority: 'medium', status: 'todo',        title: 'Mobile app development' },
  { id: 'h12', project: 'HubCV', category: 'Business',         priority: 'high',   status: 'todo',        title: 'First recruiter partnership signed' },
  { id: 'h13', project: 'HubCV', category: 'Business',         priority: 'high',   status: 'todo',        title: 'Beta user acquisition — 100 professionals' },
  { id: 'h14', project: 'HubCV', category: 'Business',         priority: 'high',   status: 'todo',        title: 'Revenue model finalization' },
  { id: 'h15', project: 'HubCV', category: 'Business',         priority: 'medium', status: 'todo',        title: 'University and bootcamp partnership outreach' },

  // ── CUESTAY ───────────────────────────────────────────────────────────
  { id: 'c01', project: 'Cuestay', category: 'Product',        priority: 'high',   status: 'done',        title: 'Home automation protocol specification' },
  { id: 'c02', project: 'Cuestay', category: 'Business',       priority: 'high',   status: 'in-progress', title: 'Hardware partner identification' },
  { id: 'c03', project: 'Cuestay', category: 'Product',        priority: 'high',   status: 'todo',        title: 'AI personal assistant core development' },
  { id: 'c04', project: 'Cuestay', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Smart home integration — Matter protocol' },
  { id: 'c05', project: 'Cuestay', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Routine learning algorithm' },
  { id: 'c06', project: 'Cuestay', category: 'Product',        priority: 'medium', status: 'todo',        title: 'IoT device management system' },
  { id: 'c07', project: 'Cuestay', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Voice command integration' },
  { id: 'c08', project: 'Cuestay', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Mobile app development' },
  { id: 'c09', project: 'Cuestay', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Ambient intelligence layer' },
  { id: 'c10', project: 'Cuestay', category: 'Business',       priority: 'high',   status: 'todo',        title: 'Hardware manufacturing partner signed' },
  { id: 'c11', project: 'Cuestay', category: 'Business',       priority: 'high',   status: 'todo',        title: 'First pilot home installation partner' },
  { id: 'c12', project: 'Cuestay', category: 'Business',       priority: 'medium', status: 'todo',        title: 'Pricing model definition' },
  { id: 'c13', project: 'Cuestay', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'Beta waitlist setup and launch' },
  { id: 'c14', project: 'Cuestay', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'B2C go-to-market strategy' },

  // ── DEXTRIP ───────────────────────────────────────────────────────────
  { id: 'd01', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'done',        title: 'Strategy engine — closed beta live' },
  { id: 'd02', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'in-progress', title: 'Multi-exchange connector' },
  { id: 'd03', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'in-progress', title: 'Live trading dashboard' },
  { id: 'd04', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Backtesting engine' },
  { id: 'd05', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Strategy marketplace' },
  { id: 'd06', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Risk management system' },
  { id: 'd07', project: 'Dextrip', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Non-custodial wallet integration' },
  { id: 'd08', project: 'Dextrip', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Portfolio analytics dashboard' },
  { id: 'd09', project: 'Dextrip', category: 'Product',        priority: 'medium', status: 'todo',        title: 'DeFi protocol integrations' },
  { id: 'd10', project: 'Dextrip', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Mobile trading alerts' },
  { id: 'd11', project: 'Dextrip', category: 'Business',       priority: 'high',   status: 'todo',        title: 'Public beta launch' },
  { id: 'd12', project: 'Dextrip', category: 'Business',       priority: 'high',   status: 'todo',        title: 'Subscription payment processing' },
  { id: 'd13', project: 'Dextrip', category: 'Business',       priority: 'high',   status: 'todo',        title: 'Go-to-market strategy' },
  { id: 'd14', project: 'Dextrip', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'Community and Discord setup' },
  { id: 'd15', project: 'Dextrip', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'Beta user acquisition plan' },

  // ── DROS (Desert Restoration Operating System) ───────────────────────────
  { id: 's01', project: 'DROS', category: 'Strategy',       priority: 'high',   status: 'todo',        title: 'Define DROS entity structure — standalone vs. subsidiary' },
  { id: 's02', project: 'DROS', category: 'Strategy',       priority: 'high',   status: 'todo',        title: 'Identify MVP wedge: which product/revenue stream ships first?' },
  { id: 's03', project: 'DROS', category: 'Strategy',       priority: 'high',   status: 'todo',        title: 'Map first target customer / pilot project in KSA' },
  { id: 's04', project: 'DROS', category: 'Strategy',       priority: 'medium', status: 'todo',        title: 'Saudi Green Initiative & NCVC — research grant / procurement programs' },
  { id: 's05', project: 'DROS', category: 'Product',        priority: 'high',   status: 'todo',        title: 'DROS platform MVP — land health monitoring dashboard (satellite data ingestion)' },
  { id: 's06', project: 'DROS', category: 'Product',        priority: 'high',   status: 'todo',        title: 'Google Earth Engine API integration — NDVI, soil moisture, land surface temp' },
  { id: 's07', project: 'DROS', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Automated land health report generation (PDF export)' },
  { id: 's08', project: 'DROS', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Site assessment & restoration planning tool' },
  { id: 's09', project: 'DROS', category: 'Product',        priority: 'medium', status: 'todo',        title: 'Carbon sequestration estimation module' },
  { id: 's10', project: 'DROS', category: 'Biotech',        priority: 'medium', status: 'todo',        title: 'Cyanobacteria / soil restoration product R&D feasibility study' },
  { id: 's11', project: 'DROS', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'KSA research institution partnership — model validation / scientific credibility' },
  { id: 's12', project: 'DROS', category: 'Partnerships',   priority: 'high',   status: 'todo',        title: 'Satellite data provider partnerships — Sentinel, MAXAR, Planet Labs' },
  { id: 's13', project: 'DROS', category: 'Partnerships',   priority: 'medium', status: 'todo',        title: 'Environmental consulting firm partnerships — sales channel' },
  { id: 's14', project: 'DROS', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'DROS initial capital requirement estimate (MVP build + 12mo runway)' },
  { id: 's15', project: 'DROS', category: 'Finance',        priority: 'high',   status: 'todo',        title: 'Identify KSA-specific grant/funding programs (MCIT AI Fund, SIDF, KAUST, SGI)' },
  { id: 's16', project: 'DROS', category: 'Marketing',      priority: 'medium', status: 'todo',        title: 'DROS pitch deck — investor-ready' },
  { id: 's17', project: 'DROS', category: 'Legal',          priority: 'high',   status: 'todo',        title: 'KSA regulatory landscape mapping — environmental consultancy, biotech, SaaS' },
];
