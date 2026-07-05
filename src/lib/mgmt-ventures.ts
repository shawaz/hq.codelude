export const VENTURES = [
  { name: 'Roborns',     color: '#5DCAA5', sector: 'Coastal AI Infrastructure' },
  { name: 'Franchiseen', color: '#7F77DD', sector: 'Franchise Finance OS' },
  { name: 'HubCV',       color: '#FAC775', sector: 'AI Career Intelligence' },
  { name: 'Cuestay',     color: '#85B7EB', sector: 'Home AI Automation' },
  { name: 'Dextrip',     color: '#F0997B', sector: 'Decentralised Trading' },
];

// ─── PARTNERS ─────────────────────────────────────────────────────────────────
export type PartnerStatus = 'active' | 'negotiating' | 'prospecting' | 'identified' | 'on-hold';
export type PartnerType   = 'Technology' | 'Distribution' | 'Financial' | 'Strategic' | 'Government' | 'Manufacturing' | 'Legal';

export interface Partner {
  name: string; type: PartnerType; status: PartnerStatus;
  category?: string;
  role: string; nextAction: string;
}

export const VENTURE_PARTNERS: Record<string, Partner[]> = {
  Roborns: [
    // ── Construction ──────────────────────────────────────────────────────────
    { name: 'Afcons Infrastructure',            category: 'Construction',            type: 'Manufacturing', status: 'prospecting', role: 'Marine and coastal civil construction — subterranean vault, seabed intake trenching, and site development for the 3-building campus', nextAction: 'Contact Afcons coastal division for site survey RFP and coastal project portfolio review' },
    { name: 'L&T Construction',                 category: 'Construction',            type: 'Manufacturing', status: 'prospecting', role: 'Industrial building construction — Building A compute vault, Building B water plant, Building C mineral hall', nextAction: 'Submit RFP to L&T Heavy Infrastructure division with site drawings and scope document' },
    { name: 'Shapoorji Pallonji',               category: 'Construction',            type: 'Manufacturing', status: 'identified',  role: 'Specialty industrial and marine construction — full campus build for coastal AI + water + mineral facility', nextAction: 'Identify SP coastal/industrial division contact and request capability statement' },
    { name: 'HCC (Hindustan Construction Co.)', category: 'Construction',            type: 'Manufacturing', status: 'identified',  role: 'Coastal civil works — marine foundation engineering and intake tunnel construction experience in Karnataka', nextAction: 'Send NDA before site disclosure and arrange HCC coastal team site visit' },
    { name: 'Kalpataru Projects International', category: 'Construction',            type: 'Manufacturing', status: 'identified',  role: 'Industrial infrastructure construction — power infrastructure, cable trenching, and grid tie-in civils', nextAction: 'Research Kalpataru industrial construction track record and identify procurement contact' },
    { name: 'Sterling & Wilson Data Center',    category: 'Construction',            type: 'Manufacturing', status: 'prospecting', role: 'Building A electrical & MEP fit-out — HT/LT distribution, UPS/backup, fire suppression, BMS, immersion-loop mechanical install (no chiller plant; shell by civil EPC). 27 DC projects delivered, modular DfMA suits 2MW first phase', nextAction: 'Submit budgetary-quote request via sterlingandwilsondc.com/contact/ — 2MW fit-out, substation + 5km HT cable as optional scope' },
    // ── Pipeline ──────────────────────────────────────────────────────────────
    { name: 'Finolex Industries',               category: 'Pipeline',                type: 'Manufacturing', status: 'prospecting', role: 'HDPE marine intake and discharge pipeline — 500m seabed run, PN16 rated, corrosion-resistant for seawater service', nextAction: 'Request Finolex HDPE marine-grade catalogue and quote for 500m DN300 subseabed intake line' },
    { name: 'Supreme Industries',               category: 'Pipeline',                type: 'Manufacturing', status: 'identified',  role: 'HDPE and structured-wall pipeline supply for marine intake and internal process water distribution', nextAction: 'Compare Supreme vs Finolex on marine-grade HDPE availability and delivery lead time to Karnataka' },
    { name: 'Welspun Corp',                     category: 'Pipeline',                type: 'Manufacturing', status: 'identified',  role: 'Large-diameter HDPE / GRP pipeline for high-flow seawater intake and brine return lines', nextAction: 'Approach Welspun pipe division for marine-grade GRP pricing and delivery schedule' },
    { name: 'Astral Pipes',                     category: 'Pipeline',                type: 'Manufacturing', status: 'identified',  role: 'HDPE and CPVC pipes for internal process water distribution, chemical dosing lines within the facility', nextAction: 'Request Astral quote for internal piping schedule from P&ID once civil design is complete' },
    { name: 'Prince Pipes & Fittings',          category: 'Pipeline',                type: 'Manufacturing', status: 'identified',  role: 'Polyethylene pressure pipes for brine distribution between Buildings B and C and ZLD return loop', nextAction: 'Request Prince Pipes brine-resistant PE100 product catalogue and Karnataka distributor contact' },
    // ── Thermal ───────────────────────────────────────────────────────────────
    { name: 'Alfa Laval India',                 category: 'Thermal',                 type: 'Technology',    status: 'prospecting', role: 'Titanium plate heat exchangers — marine duty, seawater service, primary interface between compute heat and MED distillation loop', nextAction: 'Request quotation for titanium PHE rated at 2MW thermal duty with seawater service rating' },
    { name: 'Thermax India',                    category: 'Thermal',                 type: 'Technology',    status: 'prospecting', role: 'Building C ZLD/crystallizer EPC shortlist (vs Praj) — MEE, MVR and ATFD product lines; MVR especially relevant given free 60–70°C waste heat on site. Also waste-heat-to-MED integration engineering', nextAction: 'Send Building C ZLD RFQ: Phase 1 NaCl-only train on MED brine, expandable; EPC and EPC+O&M variants. Compare against Praj and WABAG bundle quote' },
    { name: 'Kelvion India',                    category: 'Thermal',                 type: 'Technology',    status: 'identified',  role: 'Shell-and-tube and plate heat exchangers for high-temperature, high-salinity seawater service in the thermal loop', nextAction: 'Contact Kelvion India branch for marine PHE catalogue and heat exchanger sizing tool access' },
    { name: 'HRS Process Systems',              category: 'Thermal',                 type: 'Technology',    status: 'identified',  role: 'Corrugated-tube heat exchangers for viscous brine streams in Building C mineral concentration stages', nextAction: 'Download HRS brine concentration application notes and shortlist suitable models for pilot scale' },
    { name: 'SPX Flow India',                   category: 'Thermal',                 type: 'Technology',    status: 'identified',  role: 'Process heat exchangers and evaporator systems — multi-effect evaporator configuration for brine concentration', nextAction: 'Request SPX Flow MED evaporator product line literature for 50K L/day thermal duty scope' },
    // ── RO & Desalination ─────────────────────────────────────────────────────
    { name: 'VA Tech Wabag',                    category: 'RO & Desalination',       type: 'Technology',    status: 'negotiating', role: 'Anchor EPC partner — civil works (3 buildings + vault + intake), Building B MED-TVC water train (430K L/day from 2MW waste heat — full thermal capture), Building C ZLD benchmark quote, and optional O&M. Confirmed thermal desal capability (MED/TVC/MVC/MSF)', nextAction: 'Second call held 2026-06-23 (Mayank Mani Prasad). Two asks: (1) Budgetary quote for 4 scales (2/5/10/20MW) covering civil + MED + ZLD + pipelines + execution plan. (2) Propose co-location at WABAG\'s existing desal projects in KSA/India. See roborns-wabag-quote.ts and roborns-desal-colocation.ts for scope docs.' },
    { name: 'Ion Exchange (India) Ltd',         category: 'RO & Desalination',       type: 'Technology',    status: 'prospecting', role: 'RO membranes, ion-exchange resins, and water-polishing systems for post-MED demineralisation and pre-concentration in Building C', nextAction: 'Arrange demo of IEX resin suite for post-MED demineralisation + Building C mineral pre-concentration' },
    { name: 'Doosan Enerbility',                category: 'RO & Desalination',       type: 'Technology',    status: 'identified',  role: 'Seawater reverse osmosis systems — SWRO as alternative or parallel to MED for high-purity water output', nextAction: 'Research Doosan SWRO product line for 50K L/day scale feasibility and India project references' },
    { name: 'Praj Industries',                  category: 'RO & Desalination',       type: 'Technology',    status: 'prospecting', role: 'Building C ZLD/crystallizer EPC shortlist (vs Thermax) — 750+ thermal ZLD installations; Phase 1 NaCl-only train on MED brine, expandable to Mg(OH)₂/KCl/Br₂', nextAction: 'Send Building C ZLD RFQ (same spec as Thermax): pre-concentration + forced-circulation NaCl crystallization, EPC and EPC+O&M variants' },
    { name: 'BARC (MED-TVC tech transfer)',     category: 'RO & Desalination',       type: 'Government',    status: 'identified',  role: 'Indigenous MED-TVC know-how transfer — licensed 1,000 m³/day design, prototype at Trombay (240 m³/day); Phase 1 needs ~50 m³/day. Indigenization story supports CRZ/govt goodwill', nextAction: 'Send technology-transfer inquiry letter — terms, fees, and approved fabricator list' },
    { name: 'Veolia Water Technologies',        category: 'RO & Desalination',       type: 'Technology',    status: 'identified',  role: 'End-to-end water treatment design — seawater intake to ZLD with minerals recovery integration across all 3 buildings', nextAction: 'Contact Veolia India for coastal desalination + ZLD project reference list and feasibility engagement' },
    { name: 'Evoqua Water Technologies',        category: 'RO & Desalination',       type: 'Technology',    status: 'identified',  role: 'Electrodeionisation and advanced RO polishing — high-purity water for commercial and municipal offtake grade', nextAction: 'Request Evoqua EDI and advanced RO product catalogue for post-MED polishing application' },
    // ── Minerals ──────────────────────────────────────────────────────────────
    { name: 'Tata Chemicals',                   category: 'Minerals',                type: 'Strategic',     status: 'prospecting', role: 'Offtake partner for NaCl, Mg(OH)₂, MgSO₄ and other sea-mineral streams from Building C crystallisation output', nextAction: 'Approach Tata Chemicals procurement for brine-derived mineral offtake conversation and purity spec alignment' },
    { name: 'GHCL (Gujarat Heavy Chemicals)',   category: 'Minerals',                type: 'Strategic',     status: 'prospecting', role: 'Salt and mineral chemical buyer — NaCl and MgSO₄ bulk offtake from ZLD crystallisation loop in Building C', nextAction: 'Research GHCL procurement contact and standard mineral purity spec sheet for industrial salt grade' },
    { name: 'LANXESS India',                    category: 'Minerals',                type: 'Technology',    status: 'identified',  role: 'Ion-exchange resin supplier for selective Mg²⁺, K⁺, and Br⁻ extraction columns in Building C', nextAction: 'Request LANXESS Lewatit resin product list and selectivity data for seawater brine application' },
    { name: 'Nirma (Salt & Chemicals Div)',     category: 'Minerals',                type: 'Strategic',     status: 'identified',  role: 'Bulk NaCl offtake — industrial-grade salt from Building C ZLD crystallisation at ≥8 t/day by Year 3', nextAction: 'Approach Nirma salt division with projected NaCl output volumes and purity grade from Building C' },
    { name: 'Chemspec Chemicals',               category: 'Minerals',                type: 'Manufacturing', status: 'identified',  role: 'Specialty chemical offtake — KCl, bromine compounds, and technical Mg(OH)₂ from concentrated mineral streams', nextAction: 'Identify Chemspec procurement contact and share Building C projected mineral output schedule' },
    { name: 'Solenis India',                    category: 'Minerals',                type: 'Technology',    status: 'identified',  role: 'Scale inhibitor and antifoulant chemicals for RO membranes and MED evaporator in high-salinity seawater service', nextAction: 'Request Solenis antifoulant and scale inhibitor product recommendation for coastal SWRO/MED application' },
    // ── Servers ───────────────────────────────────────────────────────────────
    { name: 'NVIDIA (AI Compute)',              category: 'Servers',                 type: 'Technology',    status: 'prospecting', role: 'Anchor AI compute tenant — H100/B200 GPU cluster colocation at 2MW, leveraging PUE <1.03 and ESG credentials', nextAction: 'Approach NVIDIA India enterprise colocation team with Roborns ESG + PUE data pack and rack density spec' },
    { name: 'Supermicro',                       category: 'Servers',                 type: 'Technology',    status: 'prospecting', role: 'GPU server hardware OEM — immersion-ready HGX chassis platforms compatible with single-phase dielectric bath deployment', nextAction: 'Request Supermicro immersion-compatible server spec sheet and pricing for 2MW / 4-tank initial scope' },
    { name: 'Dell Technologies India',          category: 'Servers',                 type: 'Technology',    status: 'identified',  role: 'PowerEdge GPU servers — enterprise-grade hardware supply for compute colocation rack inventory in Building A', nextAction: 'Arrange Dell enterprise account meeting to discuss rack inventory model for co-location deployment' },
    { name: 'HPE India',                        category: 'Servers',                 type: 'Technology',    status: 'identified',  role: 'ProLiant and Cray servers — HPC-grade hardware for AI training workloads, immersion-ready configurations', nextAction: 'Request HPE immersion-compatible server roadmap and India pricing for 2MW initial deployment' },
    { name: 'E2E Networks',                     category: 'Servers',                 type: 'Strategic',     status: 'prospecting', role: 'Indian cloud compute anchor tenant — colocation of GPU nodes with Roborns managing cooling, power, and ESG certification', nextAction: 'Approach E2E Networks for colocation arrangement pitched on PUE <1.03 and ₹18K/kW/mo ESG rate' },
    { name: 'Yotta Data Services',              category: 'Servers',                 type: 'Strategic',     status: 'identified',  role: 'Indian hyperscale data centre operator — potential co-location tenant or strategic distribution partner for AI workloads', nextAction: 'Research Yotta capacity expansion plans and approach with Roborns coastal immersion co-lo proposition' },
    // ── Immersion & Liquid Cooling ────────────────────────────────────────────
    { name: 'LiquidStack',                      category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'prospecting', role: 'Two-phase immersion cooling tanks — primary vendor shortlist for Building A dielectric bath system at 2MW initial capacity', nextAction: 'Request LiquidStack DataTank product quote and thermal performance data for 2MW / 4-tank configuration' },
    { name: 'Green Revolution Cooling (GRC)',   category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'prospecting', role: 'Single-phase mineral oil immersion tanks — ICEtank product line as primary alternative to two-phase for Building A', nextAction: 'Request GRC ICEtank spec sheet, India availability, and pricing for 2MW scope alongside LiquidStack comparison' },
    { name: 'Submer Technologies',              category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'prospecting', role: 'Primary immersion shortlist (with Refroid) — single-phase SmartPod system for Building A at 2MW. Active India push: MoU with MP govt for up to 1GW liquid-cooled AI DCs, Anant Raj Cloud partnership', nextAction: 'Send 2MW immersion RFQ (tanks + CDUs + fluid + commissioning) via website/India BD; ask where scope boundary sits on facility water side' },
    { name: 'Refroid Technologies',             category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'prospecting', role: 'Indigenous immersion option (primary shortlist with Submer) — India\'s first home-grown single-phase immersion line (Hyderabad), dielectric fluid co-developed with BPCL, Sentraflo CDUs. Make-in-India angle supports govt/CRZ narrative', nextAction: 'Submit website form + email info@refroid.com: 2MW RFQ, BPCL fluid supply terms, and reference deployments above 1MW' },
    { name: 'Asperitas',                        category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'identified',  role: 'Natural convection immersion system — pump-free operation reduces opex, suited to coastal high-humidity environment', nextAction: 'Evaluate Asperitas AIC24 for pump-free feasibility and heat rejection compatibility with seawater thermal loop' },
    { name: 'Iceotope Technologies',            category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'identified',  role: 'Precision liquid cooling (PLC) — chassis-level liquid cooling for air-cooled and immersion-hybrid configurations', nextAction: 'Request Iceotope Ku:l product brief and evaluate fit for hybrid air/liquid rack configurations in Building A' },
    { name: 'Engineered Fluids (BitCool)',      category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'identified',  role: 'Dielectric coolant supplier — BitCool BC-888 single-phase fluid for immersion tanks; non-flammable, biodegradable', nextAction: 'Request BitCool BC-888 sample and safety data sheet for coastal marine environment compliance review' },
    { name: 'Solvay (Galden / Fomblin)',        category: 'Immersion & Liquid Cooling', type: 'Technology', status: 'identified',  role: 'Two-phase dielectric fluid — Galden HT series for phase-change immersion cooling; high boiling point, zero GWP variants', nextAction: 'Get Galden HT170/HT200 datasheet and India distributor pricing for 4-tank initial fill volume' },
    // ── Government & Legal ────────────────────────────────────────────────────
    { name: 'Karnataka Coastal Authority',      category: 'Government & Legal',      type: 'Government',    status: 'prospecting', role: 'Coastal construction permits, CRZ clearance, and environmental approval for the Kapu site (Udupi district)', nextAction: 'Appoint government liaison and arrange introductory meeting with Karnataka CRZ authority' },
    { name: 'Karnataka State Water Board',      category: 'Government & Legal',      type: 'Government',    status: 'prospecting', role: 'Water offtake agreement — municipality buys desalinated water from the facility at agreed bulk rate', nextAction: 'Draft water offtake term sheet and submit to KUWSDB for review' },
    { name: 'MESCOM (Grid Provider)',           category: 'Government & Legal',      type: 'Government',    status: 'prospecting', role: 'Industrial HT grid connection — Phase 1 (2MW pilot) draws from existing grid, no new substation needed. Phase 2+ (up to 20MW): 5km HT cable (~₹35 Cr) + substation (~₹15 Cr) = ~₹50 Cr total', nextAction: 'Submit 2MW load application to MESCOM Mangaluru/Udupi circle for Phase 1 pilot' },
    { name: 'Dubai HoldCo Legal Counsel',       category: 'Government & Legal',      type: 'Legal',         status: 'negotiating', role: 'HoldCo incorporation in DIFC, token structure design, and investor agreement templates', nextAction: 'Finalise engagement letter and kick off DIFC incorporation and token structure documentation' },
    { name: 'Smart Contract Auditor (TBD)',     category: 'Government & Legal',      type: 'Legal',         status: 'prospecting', role: 'Security audit of Roborns token smart contract before public issuance — target $20–50K budget', nextAction: 'Shortlist 3 audit firms (Certik, Hacken, Trail of Bits) and request audit scoping call' },
    // ── Energy ────────────────────────────────────────────────────────────────
    { name: 'Greenko / ReNew Power',            category: 'Energy',                  type: 'Technology',    status: 'prospecting', role: 'Karnataka wind/solar PPA at ₹3.0/kWh blended — 2MW contracted rate, zero upfront capex', nextAction: 'Request PPA term sheet from both Greenko and ReNew for Karnataka coastal wind + rooftop solar combination' },
    { name: 'Adani Green Energy',               category: 'Energy',                  type: 'Technology',    status: 'identified',  role: 'Solar PPA for rooftop and ground-mount capacity — supplementary to wind PPA for 24×7 renewable baseload', nextAction: 'Request Adani Green rooftop solar PPA rate card for Karnataka coastal industrial zone' },
    // ── Compute Tenants ───────────────────────────────────────────────────────
    { name: 'AI Compute Anchor Tenant (TBD)',   category: 'Compute Tenant',          type: 'Strategic',     status: 'prospecting', role: 'Pre-sign LOI for rack space before construction begins — de-risks financing and validates colocation demand', nextAction: 'Approach 5 Indian AI/ML companies with Roborns pitch deck and LOI draft for 500kW initial commitment' },
    { name: 'CoreWeave / Lambda Labs (India)',  category: 'Compute Tenant',          type: 'Strategic',     status: 'identified',  role: 'GPU cloud operator — potential anchor tenant for full 2MW initial compute capacity on long-term co-lo contract', nextAction: 'Research CoreWeave and Lambda Labs India expansion plans and initiate exploratory conversation' },
    // ── Middle East (Dubai Pivot) ──────────────────────────────────────────────
    { name: 'ACWA Power',                        category: 'Middle East',             type: 'Strategic',     status: 'prospecting', role: 'World\'s largest private desalination company — MED/R&D partnership or co-development for UAE-based coastal AI + water project', nextAction: 'Research ACWA Power\'s UAE projects (Hassyan IWP, Taweelah) and identify partnership development contact' },
    { name: 'DEWA (Dubai Water & Electricity)',  category: 'Middle East',             type: 'Government',    status: 'prospecting', role: 'Dubai\'s utility authority — regulatory gatekeeper, potential water offtaker, and solar park partnership for AI + desalination project in Dubai', nextAction: 'Approach DEWA via their IPP/WP framework with Roborns project brief and capacity requirements' },
    { name: 'G42 (Abu Dhabi)',                   category: 'Middle East',             type: 'Technology',    status: 'prospecting', role: 'UAE\'s leading AI and cloud company — Core42 GPU infrastructure, AI analytics for desalination optimisation, strategic compute partner', nextAction: 'Contact G42 partnership team (partner@g42.ai) with Roborns AI infrastructure proposal' },
    { name: 'Microsoft Azure UAE',               category: 'Middle East',             type: 'Technology',    status: 'prospecting', role: 'Azure OpenAI, GPU clusters, and cloud AI infrastructure via UAE North/Central regions — AI-driven desalination and water management models', nextAction: 'Submit Azure UAE partnership inquiry via Microsoft UAE enterprise sales team' },
    { name: 'BESIX / Six Construct',             category: 'Middle East',             type: 'Manufacturing',  status: 'prospecting', role: 'Belgian-UAE marine contractor — seawater intake/outfall, coastal civil works, and desalination plant construction for Dubai coastal facility', nextAction: 'Approach BESIX Middle East with coastal site survey RFP and project scope document' },
    { name: 'Masdar (Abu Dhabi)',                category: 'Middle East',             type: 'Strategic',     status: 'identified',  role: 'UAE state-owned renewable energy leader — solar/battery baseload, green hydrogen, and clean energy investment for coastal AI + desalination project', nextAction: 'Connect with Masdar business development for renewable energy partnership and potential co-investment' },
    { name: 'TAQA (Abu Dhabi)',                  category: 'Middle East',             type: 'Strategic',     status: 'identified',  role: 'Abu Dhabi\'s integrated water-power utility — supplies 90% of Abu Dhabi\'s water; potential utility partner for scaled UAE project', nextAction: 'Research TAQA\'s independent water project (IWP) framework and identify project development contact' },
    { name: 'Metito (Dubai)',                    category: 'Middle East',             type: 'Technology',    status: 'identified',  role: 'UAE-headquartered water management company — RO desalination, digital water monitoring (DouroECI), PPP/BOOT project delivery expertise', nextAction: 'Contact Metito about water management partnership and digital twin integration for desalination operations' },
    { name: 'ALEC Engineering (Dubai)',           category: 'Middle East',             type: 'Manufacturing',  status: 'identified',  role: 'Dubai-based contractor with dedicated Data Center Solutions and Energy divisions — ideal for AI compute facility build + solar EPC', nextAction: 'Request ALEC Data Center Solutions capability statement and project references for immersion-cooled facilities' },
    { name: 'AWS Middle East',                    category: 'Middle East',             type: 'Technology',    status: 'identified',  role: 'AWS Bahrain region + UAE expansion — GPU instances, IoT Core, SageMaker for AI/ML desalination optimisation and edge monitoring', nextAction: 'Contact AWS UAE sales team for Middle East compute partnership and startup credits for PoC' },
    { name: 'DIFC (Dubai Financial Centre)',      category: 'Middle East',             type: 'Government',    status: 'prospecting', role: 'Optimal HoldCo jurisdiction — Innovation Holding License for AI/tech, English common law, 0% corporate tax, 100% foreign ownership', nextAction: 'Submit DIFC Innovation Holding License application and consult with Dubai legal counsel on entity setup' },
  ],
  Franchiseen: [
    { name: 'F&B Franchise Brand (TBD)',      type: 'Distribution', status: 'prospecting',  role: 'First franchise brand listed — pilot with 50 retail investors', nextAction: 'Attend 1 franchise expo and identify 3 qualifying mid-size brands' },
    { name: 'KYC/AML Provider',               type: 'Technology',   status: 'negotiating',  role: 'Identity verification and compliance for investor onboarding', nextAction: 'Complete Onfido vs Signzy vs Digilocker comparison and select' },
    { name: 'Escrow / Trust Provider (TBD)',  type: 'Financial',    status: 'prospecting',  role: 'Hold retail investor funds in regulated escrow before franchise deployment', nextAction: 'Identify regulated escrow provider — banks or NBFC partner' },
    { name: 'Stripe / Razorpay',              type: 'Technology',   status: 'prospecting',  role: 'Payment processing for daily and monthly payout disbursements', nextAction: 'Submit platform account applications to both processors' },
    { name: 'Investment Legal Counsel (TBD)', type: 'Legal',        status: 'prospecting',  role: 'SEBI pathway analysis, investor agreement templates, platform compliance', nextAction: 'Engage SEBI-specialist firm — target Mumbai or Delhi based' },
    { name: 'Crossmint',                      type: 'Technology',   status: 'active',       role: 'Crypto wallet and on-chain settlement infrastructure for the Franchiseen platform', nextAction: 'Complete Crossmint SDK integration in platform' },
  ],
  HubCV: [
    { name: 'Recruiter Agency 1 (TBD)',       type: 'Distribution', status: 'prospecting',  role: 'Design partner — discounted access in exchange for structured feedback', nextAction: 'Follow up on March 2026 outreach — convert to design partner meeting' },
    { name: 'Coding Bootcamp Partner (TBD)',  type: 'Distribution', status: 'prospecting',  role: 'Graduate verification programme — each cohort = 50–100 verified profiles', nextAction: 'Reach out to 5 bootcamps with verified graduate programme proposal' },
    { name: 'Anthropic',                      type: 'Technology',   status: 'active',       role: 'Claude API for AI matching engine, profile analysis, and skill gap detection', nextAction: 'Upgrade to higher rate limit plan ahead of beta launch' },
    { name: 'Human Verifier Network (TBD)',   type: 'Strategic',    status: 'prospecting',  role: '20 domain experts (engineering, finance, design) — paid per assessment', nextAction: 'Recruit first 5 verifiers via LinkedIn and professional networks' },
    { name: 'University Partnership (TBD)',   type: 'Distribution', status: 'prospecting',  role: 'Verified credentials for graduates — institutional channel for profile supply', nextAction: 'Identify 3 target universities with strong engineering/tech programmes' },
  ],
  Cuestay: [
    { name: 'ODM Manufacturer (TBD)',         type: 'Manufacturing',status: 'negotiating',  role: 'Contract manufacturer for Cuestay Hub — Matter-certified, MOQ under $400K', nextAction: 'Request product samples and factory audit from 2 shortlisted ODMs' },
    { name: 'Property Developer (TBD)',       type: 'Distribution', status: 'prospecting',  role: 'Pre-installation agreement for new residential builds — per-unit licence fee', nextAction: 'Approach 2 Dubai developers with Cuestay B2B pitch deck' },
    { name: 'Matter / CSA Ecosystem',         type: 'Technology',   status: 'active',       role: 'Protocol compatibility — Apple HomeKit, Google Home, Amazon Alexa', nextAction: 'Submit for Matter 1.3 certification once firmware is ready' },
    { name: 'IoT Device Partners (TBD)',      type: 'Strategic',    status: 'prospecting',  role: 'Compatible smart home device brands for Cuestay integration catalogue', nextAction: 'Build integration list from top 20 Matter-compatible device brands' },
  ],
  Dextrip: [
    { name: 'Binance',                        type: 'Technology',   status: 'active',       role: 'Primary exchange — API access for multi-strategy execution, spot + derivatives', nextAction: 'Upgrade to VIP API tier to increase rate limits for public beta' },
    { name: 'Bybit',                          type: 'Technology',   status: 'active',       role: 'Secondary exchange — derivatives and spot execution', nextAction: 'Complete Bybit connector for multi-exchange beta launch' },
    { name: 'OKX',                            type: 'Technology',   status: 'prospecting',  role: 'Third exchange — DeFi chain access via OKX Web3 wallet', nextAction: 'Begin OKX API integration post Bybit connector completion' },
    { name: 'Strategy Creators (TBD)',        type: 'Distribution', status: 'prospecting',  role: 'Publish strategies to marketplace — each creator brings their own audience', nextAction: 'Launch creator outreach programme targeting quant Twitter community' },
    { name: 'GMX / dYdX (DeFi)',             type: 'Technology',   status: 'prospecting',  role: 'DeFi protocol integrations — on-chain execution infrastructure', nextAction: 'Begin GMX integration after public beta stabilises' },
  ],
};

// ─── ACTIVITY ─────────────────────────────────────────────────────────────────
export interface VActivity {
  date: string; category: string; title: string; description: string;
}

export const VENTURE_ACTIVITIES: Record<string, VActivity[]> = {
  Roborns: [
    { date: '2026-06-23', category: 'Partnership', title: 'Second WABAG call — quotation scope + desal co-location', description: 'Call with Mayank Mani Prasad (Global BD, VA Tech Wabag). Two takeaways: (1) WABAG to quote 2/5/10/20MW scales — civil, Building B MED, Building C ZLD, plus execution plan. (2) Propose co-locating Roborns unit at existing desalination projects in KSA/India. See roborns-wabag-quote.ts and roborns-desal-colocation.ts for full scope docs.' },
    { date: '2026-06-12', category: 'Decision',    title: 'Building-wise partner map finalised',          description: 'A: Submer + Refroid (immersion RFQ) with S&W DC fit-out. B: WABAG anchor (MED confirmed) + BARC tech-transfer option. C: outsourced ZLD EPC — Thermax vs Praj vs WABAG bundle; in-house keeps owner\'s engineer, controls/AI, and mineral offtake commercial. Phase 1 confirmed at 2MW.' },
    { date: '2026-06-11', category: 'Partnership', title: 'First WABAG call held',                        description: 'Call with Mayank Mani Prasad (Global BD, VA Tech Wabag). Scope discussed: civil for 3-building campus, Building B water train, CRZ view, commercial structures. NDA drafted (individual capacity, assignment-on-incorporation).' },
    { date: '2026-06-10', category: 'Product',     title: 'roborns.com UI overhaul deployed',             description: 'Readable body typography, Apple-style white light mode, theme/responsive bug fixes, reduced-motion and accessibility support. Live and merged via PR #2.' },
    { date: '2026-05-21', category: 'Milestone',   title: 'hq.codelude.com financial model published',    description: 'Roborns 5-year financial model live in HQ dashboard — seed ask ₹18 Cr, Y5 revenue ₹142 Cr.' },
    { date: '2026-05-15', category: 'Engineering',  title: 'Thermal feasibility study commissioned',       description: 'Engagement with coastal infrastructure specialists begins. Site survey underway.' },
    { date: '2026-05-10', category: 'Legal',        title: 'Dubai HoldCo legal review started',            description: 'Legal review of Dubai HoldCo tokenisation structure initiated with external counsel.' },
    { date: '2026-06-13', category: 'Decision',     title: 'Kapu site confirmed — 2MW pilot',            description: 'Uchila Thalapady cancelled (insufficient substation capacity). New site: Kapu, Karnataka — 2 acres expandable to 4, 5km from substation. Phase 1 pilot at 2MW uses existing grid — no new power infrastructure needed.' },
    { date: '2026-04-10', category: 'Decision',     title: 'Uchila Thalapady site shortlisted',           description: 'Coastal site identified as primary candidate. Coastal access, grid proximity, and water intake assessed. Later cancelled — substation capacity insufficient.' },
    { date: '2026-03-05', category: 'Finance',      title: 'Token structure modelling started',            description: 'Financial modelling of Dubai HoldCo token economics begun. Revenue per token, distribution schedule under design.' },
    { date: '2026-01-10', category: 'Milestone',    title: 'Roborns concept formalised',                  description: 'Closed-loop coastal AI + desalination + mineral extraction documented as a viable business model.' },
  ],
  Franchiseen: [
    { date: '2026-05-19', category: 'Milestone',   title: 'Payout architecture finalised',               description: 'Revenue-sharing and investor daily/monthly payout structure locked. Ready for platform implementation.' },
    { date: '2026-05-12', category: 'Product',     title: 'Platform architecture complete',               description: 'Core platform architecture for fractional ownership engine designed and documented.' },
    { date: '2026-04-28', category: 'Decision',    title: 'Daily payout as core differentiator',          description: 'Strategic decision: daily payouts are the headline feature. All priorities ordered around reliability.' },
    { date: '2026-04-15', category: 'Legal',       title: 'KYC/AML provider shortlisted',                description: '3 providers evaluated: Onfido, Digilocker, Signzy. Decision pending on integration complexity vs cost.' },
    { date: '2026-02-01', category: 'Decision',    title: 'Crossmint + Solana stack selected',            description: 'On-chain settlement via Crossmint and Jupiter on Solana selected for token-based ownership layer.' },
  ],
  HubCV: [
    { date: '2026-05-10', category: 'Product',     title: 'Matching engine development started',          description: 'AI-driven candidate-to-opportunity matching core in active development using Anthropic SDK.' },
    { date: '2026-04-05', category: 'Product',     title: 'Dynamic profile system designed',              description: 'Profile architecture for AI+human verified dynamic CVs documented. Verification workflow designed.' },
    { date: '2026-03-10', category: 'Partnership', title: 'First bootcamp outreach sent',                 description: 'Outreach to 5 coding bootcamps for verified graduate partnership programme. Responses pending.' },
    { date: '2026-01-20', category: 'Decision',    title: 'B2B-first go-to-market confirmed',             description: 'Decision: sign recruiters before opening to professionals. Supply-side quality controls acquisition.' },
  ],
  Cuestay: [
    { date: '2026-04-28', category: 'Milestone',   title: 'Protocol specification published',             description: 'Internal technical specification for home automation layer complete. Matter 1.3+ integration plan finalised.' },
    { date: '2026-03-28', category: 'Partnership', title: 'Hardware partner conversations started',       description: 'Initial outreach to 3 ODM manufacturers. Matter-certified units under evaluation.' },
    { date: '2026-02-10', category: 'Decision',    title: 'Property developer channel prioritised',       description: 'Decision: lead with property developer channel over DTC. Reduces CAC, provides volume anchor for first MOQ.' },
  ],
  Dextrip: [
    { date: '2026-05-21', category: 'Product',     title: 'Entry timing updated — dual window',          description: 'Bot now enters within 60s of event start AND 60s before next event. Price filter set to < $0.55.' },
    { date: '2026-05-18', category: 'Milestone',   title: 'Strategy engine closed beta live',             description: '3 paying beta users. Multi-exchange connector in development. Live P&L tracking confirmed.' },
    { date: '2026-05-20', category: 'Launch',      title: 'client.dextrip.com launched',                 description: 'Client investment portal live at client.dextrip.com — trades, deposits, profits.' },
    { date: '2026-03-20', category: 'Finance',     title: 'First closed beta revenue collected',          description: 'First subscription payments from closed beta users confirmed. Model validated at small scale.' },
    { date: '2026-02-20', category: 'Decision',    title: 'Strategy marketplace model approved',          description: 'Decision: creator marketplace with 30% revenue share. Each creator = distribution channel.' },
  ],
};

// ─── CHANNELS ─────────────────────────────────────────────────────────────────
export type ChStatus = 'active' | 'building' | 'planned';

export interface VChannel {
  name: string; type: string; status: ChStatus;
  description: string; metric: string;
}

export const VENTURE_CHANNELS: Record<string, VChannel[]> = {
  Roborns: [
    { name: 'Direct investor outreach',    type: 'Sales',    status: 'active',   description: 'Personal 1:1 outreach to Gulf infrastructure investors, family offices, and deep-tech angels', metric: 'Investor meetings per week' },
    { name: 'Roborns.com',                type: 'Marketing',status: 'active',   description: 'Public venture website — concept, technology, and investment thesis', metric: 'Investor enquiry form submissions' },
    { name: 'LinkedIn thought leadership', type: 'Marketing',status: 'building', description: 'Founder posts on coastal AI compute, sustainability, and Indian infrastructure', metric: 'Post reach and follower growth' },
    { name: 'Investor conferences (Gulf)', type: 'Sales',    status: 'planned',  description: 'Deep-tech and infrastructure conferences in Dubai and Abu Dhabi for face-to-face investor access', metric: 'Meetings booked per conference' },
    { name: 'Engineering community',       type: 'Community',status: 'planned',  description: 'Engagement with coastal engineering and desalination professional networks for partner discovery', metric: 'Engineering partner conversations' },
    { name: 'Token announcement',          type: 'Marketing',status: 'planned',  description: 'Public announcement of HoldCo token structure post-incorporation — crypto and RWA media', metric: 'Token investor sign-ups' },
  ],
  Franchiseen: [
    { name: 'Franchise brand outreach',   type: 'Sales',    status: 'active',   description: 'Direct outreach to mid-size franchise brands in India — F&B, retail, services', metric: 'Brand meetings per week' },
    { name: 'Investor acquisition funnel',type: 'Marketing',status: 'building', description: 'Content-led funnel explaining fractional franchise investment to high-income professionals', metric: 'Investor waitlist sign-ups' },
    { name: 'Franchise expos',            type: 'Sales',    status: 'planned',  description: 'Attend 2 franchise industry expos — Franchise India, Expo West — for brand discovery', metric: 'Brand contacts collected' },
    { name: 'Franchiseen.com',            type: 'Marketing',status: 'planned',  description: 'Platform website and investor registration landing page', metric: 'Registrations and inbound leads' },
    { name: 'LinkedIn',                   type: 'Marketing',status: 'building', description: 'Content on franchise investment, daily payouts, and financial access for retail investors', metric: 'Follower growth and enquiries' },
    { name: 'First payout press release', type: 'Marketing',status: 'planned',  description: 'PR story around first successful payout cycle — franchise media and financial press', metric: 'Media pickups and investor leads' },
  ],
  HubCV: [
    { name: 'Recruiter design partner outreach', type: 'Sales',    status: 'active',  description: 'Direct outreach to tech-focused recruitment agencies as design partners', metric: 'Design partner commitments' },
    { name: 'Bootcamp partnerships',            type: 'Distribution',status: 'building',description: 'Graduate verification programme — each bootcamp cohort = 50–100 verified profiles', metric: 'Verified profiles per cohort' },
    { name: 'LinkedIn content',                 type: 'Marketing',status: 'planned',   description: '"The verified talent problem" content series targeting in-house recruiters', metric: 'Post engagement and profile visits' },
    { name: 'HubCV.com',                        type: 'Marketing',status: 'building',  description: 'Platform website with recruiter and professional sign-up flows', metric: 'Beta sign-ups' },
    { name: 'University channel',               type: 'Distribution',status: 'planned', description: 'Verified credentials for graduates — institutional supply channel', metric: 'University partnerships signed' },
    { name: 'SEO — hiring content',             type: 'Marketing',status: 'planned',   description: 'Long-form content targeting "verified skills recruiter" and "AI candidate matching" searches', metric: 'Organic traffic and trial sign-ups' },
  ],
  Cuestay: [
    { name: 'Property developer B2B',    type: 'Distribution',status: 'building', description: 'Direct B2B channel to Dubai and India developers for pre-installation in new builds', metric: 'Developer agreements signed' },
    { name: '10-home pilot programme',   type: 'Marketing', status: 'planned',   description: 'Real pilot homes in Mangaluru and Dubai — documented for testimonial content', metric: 'Pilot homes complete' },
    { name: 'Pre-order campaign',        type: 'Marketing', status: 'planned',   description: 'DTC pre-order with pilot testimonials — validates demand before production run', metric: 'Pre-orders collected (target: 200)' },
    { name: 'Instagram + YouTube',       type: 'Marketing', status: 'planned',   description: 'Video content of smart home automation — before/after, routine learning in action', metric: 'Views and waitlist sign-ups' },
    { name: 'Cuestay.com',              type: 'Marketing', status: 'planned',   description: 'Product website with beta waitlist, pilot stories, and property developer enquiry', metric: 'Waitlist registrations' },
  ],
  Dextrip: [
    { name: 'Twitter / X community',     type: 'Community', status: 'building',  description: 'Strategy performance sharing, market commentary, creator-friendly content', metric: 'Followers and engagement' },
    { name: 'Strategy creator programme',type: 'Distribution',status: 'planned', description: '20 creators recruited pre-beta — 30% rev-share, co-marketing, early access', metric: 'Active strategy creators' },
    { name: 'Discord',                   type: 'Community', status: 'planned',   description: 'Strategy marketplace community — bug reports, feature requests, alpha signals', metric: 'Active members per week' },
    { name: 'Dextrip.com',             type: 'Marketing', status: 'active',    description: 'Main platform — strategy dashboard, public beta registration', metric: 'Beta sign-ups' },
    { name: 'bot.dextrip.com',         type: 'Marketing', status: 'active',    description: 'Bot dashboard — strategies, account management, P&L', metric: 'Active strategy count' },
    { name: 'Crypto media outreach',    type: 'Marketing', status: 'planned',   description: 'CoinDesk, The Block, Decrypt — after public beta launch', metric: 'Articles and media mentions' },
  ],
};

// ─── RELATIONS ────────────────────────────────────────────────────────────────
export type RHealth = 'strong' | 'developing' | 'cold' | 'target';

export interface VRelation {
  name: string; category: string; health: RHealth;
  description: string; lastContact: string; nextStep: string;
}

export const VENTURE_RELATIONS: Record<string, VRelation[]> = {
  Roborns: [
    { name: 'Gulf Infrastructure Investors', category: 'Investor',    health: 'target',     description: 'Institutional and HNWI investors focused on real assets and clean tech in the Gulf', lastContact: 'Not yet', nextStep: 'Build target list of 20 Dubai-based infrastructure investors' },
    { name: 'Karnataka State Government',    category: 'Government',  health: 'cold',       description: 'State authority for coastal land, water board, and environmental clearance', lastContact: 'Not yet', nextStep: 'Appoint government liaison and schedule first meeting' },
    { name: 'Dubai DIFC / DFSA',            category: 'Government',  health: 'developing', description: 'Dubai financial regulator for HoldCo structure and token issuance', lastContact: 'May 2026', nextStep: 'Finalise legal counsel engagement for DIFC incorporation' },
    { name: 'Deep-Tech Advisors',            category: 'Advisor',     health: 'target',     description: 'Operators in coastal infrastructure or energy who add technical credibility', lastContact: 'Not yet', nextStep: 'Identify 3 target advisors through engineering networks' },
    { name: 'RWA Token Investors',          category: 'Investor',    health: 'target',     description: 'Crypto-native funds focused on tokenised real-world assets', lastContact: 'Not yet', nextStep: 'Approach after HoldCo token structure is finalised' },
  ],
  Franchiseen: [
    { name: 'Franchise Operator Community', category: 'Customer',    health: 'target',     description: 'Existing operators who need capital — the supply side of the marketplace', lastContact: 'Not yet', nextStep: 'Attend 1 franchise expo and collect 20 operator contacts' },
    { name: 'Retail Investor Community',    category: 'Customer',    health: 'target',     description: 'High-income professionals who want yield alternatives beyond stock market', lastContact: 'Not yet', nextStep: 'Build investor waitlist page on Franchiseen.com' },
    { name: 'SEBI / Regulatory',           category: 'Government',  health: 'cold',       description: 'Indian regulator for retail investment platform operations', lastContact: 'Not yet', nextStep: 'Identify lightest regulatory path — revenue-share vs equity structure' },
    { name: 'Angel Investors (SAFE)',      category: 'Investor',    health: 'developing', description: 'Pre-seed angels who invest post first payout proof. SAFE at $1.5M cap', lastContact: 'Mar 2026', nextStep: 'Share Franchiseen pitch with Codelude angel network' },
    { name: 'Franchise Trade Media',       category: 'Media',       health: 'target',     description: 'Franchise India, Franchise World — target for first payout case study', lastContact: 'Not yet', nextStep: 'Prepare press release for first payout milestone' },
  ],
  HubCV: [
    { name: 'Tech Recruitment Agencies',   category: 'Customer',    health: 'developing', description: 'In-house and agency recruiters experiencing candidate quality problems', lastContact: 'Mar 2026', nextStep: 'Convert 2 outreach responses to design partner meetings' },
    { name: 'Working Professionals',       category: 'Customer',    health: 'target',     description: 'Early adopters who want verified profiles and career intelligence', lastContact: 'Not yet', nextStep: 'Launch beta waitlist on HubCV.com' },
    { name: 'Angel Investors',             category: 'Investor',    health: 'target',     description: 'Bootstrap-friendly angels who back post-proof SaaS platforms', lastContact: 'Not yet', nextStep: 'Approach after 20 paying recruiter accounts are live' },
    { name: 'HR Tech Media',               category: 'Media',       health: 'target',     description: 'HR Technologist, RecruitingBrainz — target for launch coverage', lastContact: 'Not yet', nextStep: 'Prepare product announcement for beta launch' },
  ],
  Cuestay: [
    { name: 'Pilot Homeowners',            category: 'Customer',    health: 'target',     description: 'Tech-forward homeowners in Mangaluru and Dubai willing to host pilot installations', lastContact: 'Not yet', nextStep: 'Launch pilot waitlist on Cuestay.com' },
    { name: 'Property Developers (Dubai)', category: 'Customer',    health: 'developing', description: 'Residential developers wanting smart home as a premium in new builds', lastContact: 'Mar 2026', nextStep: 'Request B2B meeting with 2 developers shortlisted' },
    { name: 'Hardware Angels',             category: 'Investor',    health: 'target',     description: 'IoT / hardware-focused angels or property tech investors for pre-seed', lastContact: 'Not yet', nextStep: 'Build investor list after hardware partner is signed' },
    { name: 'Smart Home Media',            category: 'Media',       health: 'target',     description: 'The Verge, TechCrunch, Wired — pilot story coverage for DTC launch', lastContact: 'Not yet', nextStep: 'Prepare pilot documentation for press kit' },
  ],
  Dextrip: [
    { name: 'Dextrip Beta Users (3)',      category: 'Customer',    health: 'strong',     description: '3 paying closed beta subscribers — validating model and retention', lastContact: 'May 2026', nextStep: 'Gather testimonials and onboard as first marketplace contributors' },
    { name: 'Crypto Trading Community',    category: 'Community',   health: 'developing', description: 'Retail and semi-professional traders active on Crypto Twitter and Discord', lastContact: 'May 2026', nextStep: 'Engage 10 strategy creators with marketplace invite and rev-share offer' },
    { name: 'Quant / Strategy Creators',  category: 'Customer',    health: 'target',     description: 'Developers and quants who want to monetise their strategies', lastContact: 'Not yet', nextStep: 'Launch creator outreach programme targeting quant Twitter' },
    { name: 'Crypto / DeFi Media',        category: 'Media',       health: 'target',     description: 'CoinDesk, The Block, Decrypt — after public beta and marketplace launch', lastContact: 'Not yet', nextStep: 'Prepare public beta press release for July 2026 launch' },
  ],
};

// ─── RESOURCES ────────────────────────────────────────────────────────────────
export type ResType = 'Human' | 'Technology' | 'Legal' | 'Physical' | 'Financial';
export type ResStatus = 'active' | 'needed' | 'planned';
export type ResPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Resource {
  name: string; type: ResType; status: ResStatus; priority: ResPriority;
  monthlyCost: number;    // USD/month (0 if one-time)
  oneTimeCost: number;    // USD one-time (0 if recurring)
  currency?: string;      // defaults USD
  notes: string;
}

export const VENTURE_RESOURCES: Record<string, Resource[]> = {
  Roborns: [
    // Human
    { name: 'Thermal Engineering Firm',        type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 0,    oneTimeCost: 10000, notes: 'Feasibility study contract — one-time fee for Phase 1 validation' },
    { name: 'Government Liaison',              type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 2000, oneTimeCost: 0,     notes: 'Monthly retainer for Karnataka govt permit navigation — CRZ, water board, MESCOM' },
    { name: 'Site Survey Coordinator',         type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 0,    oneTimeCost: 3000,  notes: 'One-time: coordinate Mangaluru site survey and documentation' },
    { name: 'HoldCo Legal Counsel (Dubai)',    type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 1500, oneTimeCost: 5000,  notes: 'DIFC incorporation one-time + monthly retainer for token structure and compliance' },
    { name: 'Environmental Law Firm',          type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 1000, oneTimeCost: 0,     notes: 'Karnataka coastal authority, EIA process, CRZ clearance' },
    // Technology
    { name: 'Engineering CAD / Design Tools',  type: 'Technology', status: 'needed',  priority: 'medium',   monthlyCost: 300,  oneTimeCost: 0,     notes: 'AutoCAD or similar for facility architectural drawings' },
    { name: 'Project Management Software',     type: 'Technology', status: 'active',  priority: 'low',      monthlyCost: 50,   oneTimeCost: 0,     notes: 'HQ dashboard covers most of this — supplementary tool only' },
    // Legal
    { name: 'Smart Contract Audit',           type: 'Legal',      status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 30000, notes: 'Required before any token issuance — security audit by specialist firm' },
    { name: 'IP / Patent Registration',       type: 'Legal',      status: 'planned', priority: 'medium',   monthlyCost: 0,    oneTimeCost: 10000, notes: 'Protect thermal loop design and mineral extraction process IP' },
    // Physical
    { name: 'Coastal Land Lease (Kapu)', type: 'Physical',   status: 'planned', priority: 'critical', monthlyCost: 5000, oneTimeCost: 0,     notes: '2-acre coastal site (expandable to 4) in Kapu, Udupi — estimated lease ₹3–5L/month, pending survey' },
    { name: 'Phase 1 Construction Capex',     type: 'Physical',   status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 2100000,notes: '₹18.1 Cr = ~$2.1M USD — Buildings A+B, thermal loop, grid' },
    // Financial
    { name: 'Seed Round Facilitation',        type: 'Financial',  status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 15000, notes: 'Legal and structuring costs for HoldCo token seed round' },
  ],
  Franchiseen: [
    // Human
    { name: 'Franchise Partnership Manager',  type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 4000, oneTimeCost: 0,     notes: 'Full-time: owns brand acquisition, target 5+ brands in 6 months. Commission + base.' },
    { name: 'Investment Legal Counsel',       type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 2500, oneTimeCost: 5000,  notes: 'Monthly retainer + setup fee — SEBI pathway, investor agreements, KYC frameworks' },
    { name: 'Platform Engineer (Fullstack)',  type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 5000, oneTimeCost: 0,     notes: 'Full-time: owns Franchiseen platform — payout engine, investor portal, operator portal' },
    // Technology
    { name: 'KYC/AML Provider (Onfido/Signzy)',type:'Technology', status: 'needed',  priority: 'critical', monthlyCost: 400,  oneTimeCost: 2000,  notes: 'Per-verification pricing — $2–5/check + setup fee. Scales with investor volume.' },
    { name: 'Stripe / Razorpay',             type: 'Technology', status: 'needed',  priority: 'critical', monthlyCost: 150,  oneTimeCost: 500,   notes: 'Payment processing — 2.9% + $0.30 per transaction. Est. at launch volume.' },
    { name: 'Convex Backend',                type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Real-time database and serverless functions for Franchiseen platform' },
    { name: 'Platform Hosting (Vercel/AWS)', type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 80,   oneTimeCost: 0,     notes: 'Next.js hosting + database + storage' },
    // Legal
    { name: 'Company Registration',          type: 'Legal',      status: 'planned', priority: 'high',     monthlyCost: 0,    oneTimeCost: 5000,  notes: 'Franchiseen entity registration — India + potential UAE structure' },
    { name: 'Escrow Account Setup',          type: 'Legal',      status: 'needed',  priority: 'critical', monthlyCost: 200,  oneTimeCost: 1000,  notes: 'Regulated escrow for investor funds — mandatory before accepting capital' },
  ],
  HubCV: [
    // Human
    { name: 'AI / ML Engineer',              type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 7000, oneTimeCost: 0,     notes: 'Full-time: owns matching engine, Anthropic SDK, skill graph. Python + LLM expertise.' },
    { name: 'Human Verifier Network (×20)',  type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 2000, oneTimeCost: 1000,  notes: '$20–50/assessment × ~60 assessments/month at launch. Monthly variable cost.' },
    { name: 'Recruiter Success Manager',     type: 'Human',      status: 'planned', priority: 'medium',   monthlyCost: 3000, oneTimeCost: 0,     notes: 'Onboards and manages design partner recruiter accounts. Y2 hire.' },
    // Technology
    { name: 'Anthropic API (Claude)',        type: 'Technology', status: 'active',  priority: 'critical', monthlyCost: 400,  oneTimeCost: 0,     notes: 'LLM API for profile analysis, skill scoring, and opportunity matching. Scales with usage.' },
    { name: 'PostgreSQL (Neon/Supabase)',    type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Relational database for profiles, jobs, matches, verifications' },
    { name: 'Platform Hosting',             type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 80,   oneTimeCost: 0,     notes: 'Vercel + CDN + storage for HubCV platform' },
    { name: 'Vector Database',              type: 'Technology', status: 'needed',  priority: 'high',     monthlyCost: 150,  oneTimeCost: 0,     notes: 'Pinecone or Weaviate for skill embedding similarity search' },
    // Legal
    { name: 'DPDP Act Compliance (India)',  type: 'Legal',      status: 'needed',  priority: 'high',     monthlyCost: 500,  oneTimeCost: 2000,  notes: 'Data privacy compliance — consent framework, deletion mechanism, processing policy' },
  ],
  Cuestay: [
    // Human
    { name: 'Hardware Product Manager',     type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 6000, oneTimeCost: 0,     notes: 'Owns ODM relationship, Matter certification, MOQ management, supply chain' },
    { name: 'Firmware Engineer',            type: 'Human',      status: 'needed',  priority: 'critical', monthlyCost: 7000, oneTimeCost: 0,     notes: 'Matter 1.3+ integration, Hub OS, device management layer, on-device AI' },
    { name: 'Mobile App Developer',         type: 'Human',      status: 'planned', priority: 'high',     monthlyCost: 5000, oneTimeCost: 0,     notes: 'iOS and Android Cuestay app. React Native preferred. Y2 hire.' },
    // Technology
    { name: 'Matter SDK License',           type: 'Technology', status: 'needed',  priority: 'critical', monthlyCost: 0,    oneTimeCost: 2000,  notes: 'CSA Matter SDK for hub firmware development' },
    { name: 'CSA Matter Certification',    type: 'Technology', status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 15000, notes: 'Required before retail sale — Matter 1.3 certification process' },
    { name: 'AI Inference (Cloud)',         type: 'Technology', status: 'planned', priority: 'high',     monthlyCost: 200,  oneTimeCost: 0,     notes: 'Cloud fallback AI inference for Cuestay routines. Scales with active homes.' },
    { name: 'Design Tools (Figma/Fusion)', type: 'Technology', status: 'active',  priority: 'medium',   monthlyCost: 100,  oneTimeCost: 0,     notes: 'UI design and hardware CAD tooling' },
    // Physical
    { name: 'Hardware MOQ (First Run)',     type: 'Physical',   status: 'planned', priority: 'critical', monthlyCost: 0,    oneTimeCost: 300000,notes: '1,000-unit production run — Matter-certified Hub. Triggers at manufacturer sign.' },
    { name: '10-Home Pilot Installations', type: 'Physical',   status: 'planned', priority: 'high',     monthlyCost: 0,    oneTimeCost: 50000, notes: '$5K per pilot home including device, installation, and 6-month monitoring' },
    // Legal
    { name: 'Product Liability Insurance', type: 'Legal',      status: 'planned', priority: 'medium',   monthlyCost: 300,  oneTimeCost: 0,     notes: 'Required before retail sale of consumer electronic device' },
  ],
  Dextrip: [
    // Human
    { name: 'Creator Programme Lead',      type: 'Human',      status: 'needed',  priority: 'high',     monthlyCost: 3500, oneTimeCost: 0,     notes: 'Recruits and manages strategy creators. Crypto-native, community experience required.' },
    { name: 'Platform Engineer',           type: 'Human',      status: 'planned', priority: 'high',     monthlyCost: 6000, oneTimeCost: 0,     notes: 'Y2 hire: owns strategy marketplace, institutional API, DeFi integrations.' },
    // Technology
    { name: 'Binance API (VIP tier)',      type: 'Technology', status: 'active',  priority: 'critical', monthlyCost: 200,  oneTimeCost: 0,     notes: 'Higher rate limits for public beta scale. Volume-based pricing.' },
    { name: 'Bybit API',                  type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 100,  oneTimeCost: 0,     notes: 'Secondary exchange connector for derivatives and spot' },
    { name: 'Server Infrastructure',      type: 'Technology', status: 'active',  priority: 'high',     monthlyCost: 200,  oneTimeCost: 0,     notes: 'VPS hosting all Dextrip apps — bot.dextrip.com, tv, spot, client portal' },
    { name: 'OKX API',                    type: 'Technology', status: 'planned', priority: 'medium',   monthlyCost: 100,  oneTimeCost: 0,     notes: 'Third exchange — DeFi chain access. Planned post-Bybit completion.' },
    { name: 'GMX / dYdX Integration',     type: 'Technology', status: 'planned', priority: 'medium',   monthlyCost: 50,   oneTimeCost: 2000,  notes: 'DeFi protocol integration — on-chain execution. Development cost one-time.' },
    // Legal
    { name: 'Terms of Service / Legal',   type: 'Legal',      status: 'needed',  priority: 'high',     monthlyCost: 0,    oneTimeCost: 3000,  notes: 'Non-custodial ToS, risk disclosures, creator agreement templates' },
    // Financial
    { name: 'Creator Fund (Onboarding)',  type: 'Financial',  status: 'planned', priority: 'medium',   monthlyCost: 0,    oneTimeCost: 15000, notes: 'Incentive budget for first 20 strategy creators — co-marketing + bonus' },
  ],
};
