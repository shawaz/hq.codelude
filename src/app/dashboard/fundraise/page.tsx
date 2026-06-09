'use client';

import { useState } from 'react';
import VentureTabs from '@/components/VentureTabs';

type Tab = 'round' | 'investors' | 'legal' | 'timeline' | 'hyperscaler';

const TABS: { key: Tab; label: string }[] = [
  { key: 'round',       label: 'Round Structure' },
  { key: 'investors',   label: 'Investor Targets' },
  { key: 'legal',       label: 'Legal & Compliance' },
  { key: 'timeline',    label: 'Timeline' },
  { key: 'hyperscaler', label: 'Hyperscaler & Govt Pitch' },
];

// ─── DATA ─────────────────────────────────────────────────────────────────────

const ROUND = {
  name:       'Roborns Seed Round — India Equity',
  entity:     'Roborns Energy & Infrastructure Pvt. Ltd.',
  domicile:   'Mangaluru, Karnataka, India',
  instrument: 'Compulsorily Convertible Debentures (CCDs)',
  target:     '₹18.1 Crore (~$2.1M USD)',
  premoney:   '₹60 Crore',
  postmoney:  '₹78.1 Crore',
  dilution:   '23.2%',
  minTicket:  '₹50 Lakh',
  maxTicket:  '₹5 Crore',
  conversion: 'Auto-converts to equity at Series A or 36 months, whichever is earlier',
  interest:   '0% — pure equity-equivalent instrument',
  rights:     ['Pro-rata participation rights at Series A', 'Information rights (quarterly P&L, site milestones)', 'Board observer seat for investors above ₹2 Cr'],
};

const USE_OF_FUNDS = [
  { item: 'Immersion tanks + compute (2MW)', amount: '₹5.0 Cr', pct: 27.6, phase: 'Building A' },
  { item: 'Network, UPS, power distribution', amount: '₹1.2 Cr', pct: 6.6, phase: 'Building A' },
  { item: 'Subterranean vault civil works',   amount: '₹2.1 Cr', pct: 11.6, phase: 'Building A' },
  { item: 'Titanium heat exchangers',          amount: '₹1.8 Cr', pct: 9.9, phase: 'Thermal Loop' },
  { item: 'Marine intake pipeline (500m)',     amount: '₹1.4 Cr', pct: 7.7, phase: 'Thermal Loop' },
  { item: 'MED desalination skid (50K L/day)',amount: '₹2.8 Cr', pct: 15.5, phase: 'Building B' },
  { item: 'Pre-filtration + mineralisation',  amount: '₹0.9 Cr', pct: 5.0, phase: 'Building B' },
  { item: 'Grid connection + solar (500 kW)', amount: '₹4.1 Cr', pct: 22.7, phase: 'Site & Power' },
  { item: 'Working capital + 12m opex reserve',amount:'₹2.5 Cr', pct: 13.8, phase: 'Operations' },
];

const RETURN_SCENARIOS = [
  { scenario: 'Base case',      multiple: '8×',  irr: '32%', basis: 'EBITDA at ₹20 Cr (Y3). Exit at 8× EBITDA = ₹160 Cr valuation.' },
  { scenario: 'Upside case',    multiple: '15×', irr: '48%', basis: 'Full scale (10MW + minerals). Exit at ₹600 Cr+ via infrastructure REIT.' },
  { scenario: 'Conservative',   multiple: '4×',  irr: '19%', basis: 'Compute only, slower ramp. Still generates strong infrastructure yield.' },
];

const INVESTORS = [
  {
    category: 'Family Offices — Gulf-India corridor',
    color: '#5DCAA5',
    why: 'Strong appetite for physical infrastructure in India. Many have existing Mangaluru / Karnataka connections. Comfortable with 3–5 year holds.',
    targets: [
      { name: 'Karnataka-based industrial family offices', ticket: '₹1–5 Cr', fit: 'Local knowledge, coastal land expertise, network with MESCOM and state govt' },
      { name: 'Dubai-based NRI family offices', ticket: '₹2–5 Cr', fit: 'Gulf-India corridor investors comfortable with both jurisdictions' },
      { name: 'Mangaluru port / trade family offices', ticket: '₹1–3 Cr', fit: 'Existing coastal infrastructure relationships, proximity to site' },
    ],
  },
  {
    category: 'Infrastructure & Clean-tech VCs',
    color: '#c8f53a',
    why: 'Growing clean-tech mandate, ESG infrastructure appetite. Coastal compute is a new category — first-mover interest.',
    targets: [
      { name: 'Bloom Ventures / Avaana Capital', ticket: '₹2–5 Cr', fit: 'Climate-tech focus, India infrastructure thesis' },
      { name: 'Mela Ventures / Omnivore', ticket: '₹1–3 Cr', fit: 'Deep India infrastructure and sustainability mandate' },
      { name: 'Gulf clean-tech fund (UAE-India)', ticket: '₹3–5 Cr', fit: 'Cross-border infrastructure, clean energy alignment' },
    ],
  },
  {
    category: 'Angel Networks',
    color: '#FAC775',
    why: 'Individual angels in engineering, energy, and coastal sectors can move faster than VCs. DPIIT recognition unlocks angel tax exemption.',
    targets: [
      { name: 'Indian Angel Network (IAN)', ticket: '₹50L–1 Cr', fit: 'Largest Indian angel network, infra-track angels available' },
      { name: 'Mumbai Angels / Lead Angels', ticket: '₹50L–2 Cr', fit: 'Syndicate model — can aggregate multiple smaller cheques' },
      { name: 'Thermal / energy sector angels', ticket: '₹1–3 Cr', fit: 'Domain-expert angels bring operational value, not just capital' },
    ],
  },
  {
    category: 'Government & Strategic',
    color: '#85B7EB',
    why: 'Non-dilutive or concessional capital available through Startup India, SIDBI, and state government schemes.',
    targets: [
      { name: 'SIDBI Startup Fund (Fund of Funds)', ticket: 'Non-dilutive / ₹1–2 Cr', fit: 'Concessional debt or guarantee support for infrastructure startups' },
      { name: 'Karnataka Udyog Mitra (State Govt)', ticket: 'Subsidies / land', fit: 'State incentives for industrial coastal infrastructure in Karnataka' },
      { name: 'DPIIT Startup India recognition', ticket: 'Non-dilutive benefits', fit: 'Angel tax exemption (Section 56 benefit), ESOP tax deferral, fast-track IPO' },
    ],
  },
];

const LEGAL_STEPS = [
  {
    phase: 'Entity Setup', color: '#5DCAA5',
    steps: [
      { title: 'Incorporate Roborns Energy & Infrastructure Pvt. Ltd.', status: 'required', cost: '₹20,000–50,000', notes: 'MCA21 filing. Private limited company under Companies Act 2013. Registered office in Mangaluru.' },
      { title: 'DPIIT Startup India recognition', status: 'required', cost: '₹0 (free)', notes: 'Unlocks angel tax exemption (Section 56(2)(viib) exemption), ESOP tax deferral, easier winding up. Apply within 6 months of incorporation.' },
      { title: 'PAN, TAN, GST registration', status: 'required', cost: '₹5,000–10,000', notes: 'Mandatory for any commercial operations. GST applicable when revenue crosses ₹20L threshold.' },
      { title: 'Director DINs and digital signatures', status: 'required', cost: '₹3,000–5,000', notes: 'All directors need Director Identification Numbers (DIN) and DSC for MCA filings.' },
    ],
  },
  {
    phase: 'Round Structure', color: '#c8f53a',
    steps: [
      { title: 'CCD term sheet drafted', status: 'required', cost: 'Legal fee: ₹1–2L', notes: 'Compulsorily Convertible Debentures: interest-free, converts to equity at Series A or 36 months. Preferred over SAFE in India — legally cleaner, well-understood by Indian investors.' },
      { title: 'Shareholder agreement (SHA)', status: 'required', cost: 'Legal fee: ₹2–3L', notes: 'Governs investor rights: pro-rata, anti-dilution, information rights, board rights, drag-along, tag-along, ROFR.' },
      { title: 'ESOPs pool created (10–15%)', status: 'recommended', cost: 'Legal fee: ₹50K', notes: 'Set up employee stock option plan. Expand cap table pre-money so ESOP dilution does not come from seed investors.' },
      { title: 'Valuation report (DCF / CCI)', status: 'required for angel tax', cost: '₹50K–1L', notes: 'Section 56(2)(viib) compliance. Without DPIIT recognition, need registered valuer certificate for any shares issued above fair market value. DPIIT registration removes this requirement.' },
    ],
  },
  {
    phase: 'Site & Regulatory', color: '#FAC775',
    steps: [
      { title: 'Coastal Regulatory Zone (CRZ) clearance', status: 'required', cost: '₹10–25L (legal + survey)', notes: 'CRZ-III clearance for coastal industrial facility. Timeline: 6–12 months. Engage environmental law firm immediately.' },
      { title: 'Environmental Impact Assessment', status: 'required', cost: '₹10–25L', notes: 'Karnataka State Pollution Control Board approval. Baseline survey + public consultation required.' },
      { title: 'MESCOM HT connection (10MW)', status: 'required', cost: 'Connection charges: ₹15–20L', notes: 'High-tension industrial connection application. Standard for large industrial consumers in Mangaluru area.' },
      { title: 'Coastal land lease agreement', status: 'required', cost: '₹3–5L/month (est.)', notes: 'Lease from Karnataka state or private coastal land owner. Requires CRZ clearance first. Survey and legal due diligence on title.' },
    ],
  },
  {
    phase: 'FEMA (Foreign Investment)', color: '#85B7EB',
    steps: [
      { title: 'RBI FEMA reporting (if foreign investors)', status: 'conditional', cost: 'CA fee: ₹50K', notes: 'If any NRI or foreign investor participates: automatic route for most infrastructure — file FC-GPR with RBI within 30 days of allotment. Keep foreign investment under 74% for automatic route.' },
      { title: 'Sectoral cap compliance', status: 'conditional', cost: '—', notes: 'Infrastructure sector: 100% FDI permitted under automatic route. No government approval needed if all conditions met.' },
    ],
  },
];

const TIMELINE = [
  { month: 'May–Jun 2026', phase: 'Preparation',  color: '#7a7870', items: ['Incorporate Roborns Energy & Infrastructure Pvt. Ltd.', 'Apply for DPIIT Startup India recognition', 'Engage legal counsel for CCD term sheet and SHA', 'Finalise Roborns investor deck (v1.2 is ready)'] },
  { month: 'Jun 2026',     phase: 'Site Proof',   color: '#FAC775', items: ['Complete Mangaluru coastal site survey', 'Thermal feasibility study commissioned', 'CRZ permit pathway analysis initiated', 'Site photos and documentation for investor deck'] },
  { month: 'Jul–Aug 2026', phase: 'Outreach',     color: '#c8f53a', items: ['Approach Karnataka family offices (warm intros)', 'Submit IAN / Mumbai Angels application', 'First investor meetings', 'Share financial model and site survey outcomes'] },
  { month: 'Aug–Sep 2026', phase: 'Due Diligence',color: '#F0997B', items: ['CCD term sheet issued to interested investors', 'Shareholder agreement negotiation', 'Investor due diligence on land, permits, feasibility', 'Valuation report from registered CA/valuer'] },
  { month: 'Oct 2026',     phase: 'First Close',  color: '#5DCAA5', items: ['First close: target ₹8–10 Cr from anchor investors', 'SHA signed, CCDs allotted', 'RBI FC-GPR filing if foreign investors', 'Escrow account funded'] },
  { month: 'Nov–Dec 2026', phase: 'Final Close',  color: '#5DCAA5', items: ['Final close: reach ₹18.1 Cr target', 'CRZ permits filed (parallel track)', 'Engineering contractor shortlist', 'MESCOM HT application submitted'] },
  { month: 'Q1 2027',      phase: 'Deploy',       color: '#7F77DD', items: ['Construction commences (Building A + Thermal loop)', 'Working capital deployed for site operations', 'Pilot compute tenant onboarded', 'Series A preparation begins'] },
];

// ─── HYPERSCALER & GOVT PITCH ─────────────────────────────────────────────────
// Pitch angle: Roborns isn't just an investment — it's the infrastructure
// hyperscalers need to keep building AI data centers without tripping over
// freshwater scarcity. Stats below are sourced (see notes); replace/refresh
// with newer figures as the pitch deck is built (task r20).

const CRISIS_STATS = [
  { label: 'Avg. data center water draw',  val: '1.8 L / kWh',  sub: 'Direct cooling water per kWh of IT load (EESI / TechTarget)', color: '#ff8080' },
  { label: 'AI vs. traditional clusters',  val: '10–50×',       sub: 'More cooling water consumed by AI training/inference vs. legacy server farms', color: '#FAC775' },
  { label: 'US projects blocked/delayed',  val: '$64B+',        sub: '48+ data center projects stalled by local opposition in 2025 — water & grid strain are the lead causes (Data Center Watch)', color: '#c8f53a' },
  { label: 'Roborns freshwater draw',      val: 'Zero',         sub: 'Seawater-cooled — fresh water is the byproduct, not the input', color: '#5DCAA5' },
];

const CRISIS_NARRATIVE = [
  { q: 'The problem',          a: 'Microsoft (2020) and Google (2026) have both publicly pledged to be "water positive" by 2030 — replenishing more water than their data centers consume. Yet in 2025 alone, at least 48 AI data center projects representing $150B+ were blocked or stalled by local communities, citing water and grid strain as the top concerns (e.g. Meta\'s ~$1B Michigan site, killed in Dec 2025 after opposition over water use). The pledges and the pipeline are on a collision course.' },
  { q: 'The Roborns angle',    a: 'A Roborns facility draws zero freshwater — it cools GPUs with seawater and turns the waste heat into a desalination asset that produces fresh water as an output. We don\'t compete with a community for its water table; we add to it. That converts the hyperscalers\' single biggest siting liability into a siting advantage, on day one, by design — not via a decade of retrofits and offset purchases.' },
  { q: 'Why coastal India, first', a: 'India is simultaneously a priority hyperscale expansion market (data-localisation rules, surging AI demand, new Azure/Google Cloud regions) and a water-stressed geography where new industrial water draw is politically and regulatorily contentious. Coastal siting resolves both constraints at once — and the model is exportable to other coastal, water-stressed markets (MENA, Southeast Asia, the US Gulf Coast, California).' },
  { q: 'The ask — instrument-agnostic', a: 'The conversation with a hyperscaler is not "invest in our round" — it\'s "secure GPU colocation / water-offtake capacity in a facility that removes your #1 unspoken siting risk." Whether that capacity commitment ultimately closes via equity (CCDs), a strategic/anchor-tenant pre-purchase, or a token-based revenue share, the anchor-tenant relationship is the unlock for all three — and is the explicit prerequisite already on record for the token round (see Investor Targets / R1 notes).' },
];

const HYPERSCALER_TARGETS = [
  {
    category: 'Google', color: '#85B7EB',
    why: 'Google pledged to be water-positive by 2030 and is investing $500M in public watershed infrastructure in response to AI-driven backlash. Its India Cloud expansion needs new regional capacity.',
    targets: [
      { name: 'Google Data Center Sustainability / Water Stewardship', ticket: 'Pilot MOU / capacity pre-commit', fit: 'Directly accountable for delivering the 2030 water-positive pledge — owns the search for net-water-positive site models' },
      { name: 'Google.org — climate & infrastructure grants', ticket: 'Grant / pilot funding', fit: 'Funds external pilots that visibly advance Google\'s public sustainability commitments' },
      { name: 'Google Cloud — APAC / India regional infrastructure', ticket: 'Anchor tenant LOI', fit: 'Actively scouting India colocation capacity for data-localisation and AI-demand growth' },
    ],
  },
  {
    category: 'Microsoft', color: '#c8f53a',
    why: 'Microsoft was first to pledge water-positive by 2030 (Sept 2020) and has cut datacenter water-use intensity 80%+ since its first-gen sites. Its Climate Innovation Fund backs exactly this kind of infrastructure thesis.',
    targets: [
      { name: 'Microsoft Climate Innovation Fund', ticket: 'Equity / strategic investment', fit: '$1B+ fund explicitly targeting carbon, water and waste-reduction infrastructure — coastal zero-freshwater compute is squarely in scope' },
      { name: 'Microsoft Datacenter Sustainability & Water Positive program', ticket: 'Pilot site partnership', fit: 'Owns delivery of the 2030 commitment; needs working proof points of net-water-positive sites, not just closed-loop retrofits' },
      { name: 'Microsoft India / Azure regional infrastructure', ticket: 'Anchor tenant LOI / colo capacity', fit: 'Expanding Azure India regions — needs sites that clear local water-permitting friction from day one' },
    ],
  },
  {
    category: 'Nvidia', color: '#5DCAA5',
    why: 'Nvidia isn\'t a data-center operator, but it co-designs and invests in the infrastructure layer that AI compute depends on — including India "sovereign AI" partnerships — through its corporate development and ecosystem programs.',
    targets: [
      { name: 'NVentures (Nvidia\'s corporate venture arm)', ticket: 'Equity / strategic investment', fit: 'Invests in infrastructure and energy companies expanding AI compute capacity — coastal compute is an adjacent infrastructure thesis' },
      { name: 'Nvidia AI Infrastructure Partnerships / Sovereign AI India', ticket: 'Reference-design / co-marketing partnership', fit: 'Actively building India sovereign-AI compute partnerships — a novel-cooling new entrant is a differentiated story to co-promote' },
      { name: 'Nvidia Inception (startup program)', ticket: 'Non-dilutive — credits, technical access, intros', fit: 'Provides cloud credits, technical enablement and investor introductions to infrastructure/AI startups' },
    ],
  },
  {
    category: 'Meta', color: '#F0997B',
    why: 'Meta has pledged to restore more water than its data centers consume by 2030 and drives the industry\'s liquid-cooling standards through the Open Compute Project — a natural technical-fit conversation, not a cold pitch.',
    targets: [
      { name: 'Meta Sustainability — Water Restoration & DC Strategy', ticket: 'Pilot partnership', fit: 'Owns the "water restoration positive by 2030" target; actively seeking novel cooling/siting case studies after high-profile project cancellations (e.g. Michigan, Dec 2025)' },
      { name: 'Open Compute Project — liquid cooling workgroup', ticket: 'Technical partnership / reference site', fit: 'Meta drives immersion/liquid-cooling standards through OCP — a working coastal immersion site is reference-case material for the whole consortium' },
    ],
  },
  {
    category: 'Amazon (AWS)', color: '#7F77DD',
    why: 'AWS already runs some of the most water-efficient sites in the industry (≈0.15 L/kWh) and has pledged water-positive operations by 2030, backed by the Climate Pledge Fund\'s infrastructure-decarbonisation mandate.',
    targets: [
      { name: 'AWS Sustainable Data Centers / Water Stewardship', ticket: 'Pilot site partnership', fit: 'Owns delivery of the water-positive 2030 pledge; wants provable net-positive site models to point to publicly' },
      { name: 'The Climate Pledge Fund (Amazon)', ticket: 'Equity / strategic investment', fit: 'Invests in companies building infrastructure that decarbonises and reduces resource intensity at scale' },
    ],
  },
];

const GOVT_PIPELINE = [
  {
    phase: 'Pre-requisite — Credibility Gate', color: '#ff8080',
    steps: [
      { title: 'Recalibrate financial model before any submission', status: 'required', cost: '—', notes: 'validation_report.md (Jun 2026) found power costs modelled ~2.3x too low, desalination water revenue overestimated ~100x, and immersion-cooling CapEx understated ~3x. Submitting today\'s numbers to a government evaluator or a hyperscaler infrastructure team — both of whom will sanity-check them — would do permanent damage. This must close before anything below goes out the door.' },
    ],
  },
  {
    phase: 'National — Compute & AI', color: '#5DCAA5',
    steps: [
      { title: 'IndiaAI Mission — compute subsidy application', status: 'apply now', cost: 'National pool: ₹10,372 Cr', notes: 'The single most relevant scheme on the table — explicitly funds AI compute infrastructure buildout, MeitY-administered. Needs a corrected financial model and technical DPR before submission (see Credibility Gate above).' },
      { title: 'Startup India Seed Fund Scheme (SISFS)', status: 'apply now', cost: 'Up to ₹50L grant + ₹5 Cr debt', notes: 'Early-stage validation funding. Gated on DPIIT Startup India recognition — already a planned step in the Legal & Compliance phase of this round.' },
    ],
  },
  {
    phase: 'National — Cleantech & Water', color: '#c8f53a',
    steps: [
      { title: 'SIDBI Clean Tech Fund — soft loan application', status: 'recommended', cost: 'Soft loans up to ₹5 Cr', notes: 'Concessional debt for clean-tech / water-integration infrastructure — pairs naturally with the desalination + immersion-cooling combined pitch.' },
      { title: 'AMRUT 2.0 — water management technology grant', status: 'conditional', cost: 'Grant — amount set per state allocation', notes: 'Targets urban/industrial water-management technology. The desalination + brine-to-mineral (zero liquid discharge) angle is the qualifying hook; requires coordination with Karnataka\'s urban development department.' },
    ],
  },
  {
    phase: 'State — Karnataka', color: '#FAC775',
    steps: [
      { title: 'Karnataka Industrial Policy — capex & power-tariff subsidy', status: 'recommended', cost: 'Capex subsidies + power tariff concessions (cleantech thrust sector)', notes: 'State-level incentive for cleantech industrial investment on the Karnataka coast. Same relationship as Karnataka Udyog Mitra in the Investor Targets tab — a different ask to the same desk.' },
    ],
  },
];

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function Section({ title }: { title: string }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)', marginTop: '1.5rem' }}>
      {title}
    </div>
  );
}

function InfoRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1rem', padding: '0.65rem 0', borderBottom: '1px solid var(--card-border)' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.06em' }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: accent ? 'var(--accent)' : 'var(--off-white)', fontWeight: accent ? 600 : 300, lineHeight: 1.5 }}>{value}</span>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default function FundraisePage() {
  const [tab, setTab] = useState<Tab>('round');

  return (
    <div>
      <h1 className="page-title">Roborns — India Equity Fundraise</h1>
      <p className="page-sub">₹18.1 Cr seed round plan via Compulsorily Convertible Debentures (CCDs) — Indian private limited company, equity structure.</p>
      <VentureTabs />

      {/* Summary strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem', borderLeft: '2px solid #5DCAA5' }}>
        {[
          { label: 'Target raise',  val: '₹18.1 Cr', sub: '~$2.1M USD',          color: '#5DCAA5' },
          { label: 'Pre-money',     val: '₹60 Cr',   sub: '~$7.1M valuation',    color: 'var(--off-white)' },
          { label: 'Dilution',      val: '23.2%',     sub: 'Seed investors',       color: '#FAC775' },
          { label: 'Instrument',    val: 'CCDs',      sub: 'Converts at Series A', color: '#c8f53a' },
          { label: 'Min ticket',    val: '₹50 Lakh',  sub: '~$60K',              color: 'var(--muted)' },
        ].map(c => (
          <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{c.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color: c.color, marginBottom: '0.1rem', lineHeight: 1 }}>{c.val}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: '0.55rem 1.3rem', border: '1px solid', cursor: 'pointer',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', transition: 'all 0.15s',
            background: tab === t.key ? 'var(--off-white)' : 'transparent',
            borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
            color: tab === t.key ? 'var(--black)' : 'var(--muted)',
          }}>{t.label}</button>
        ))}
      </div>

      {/* ── ROUND STRUCTURE ─────────────────────────────────────────────────── */}
      {tab === 'round' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <Section title="Round details" />
              <InfoRow label="Entity name"     value={ROUND.entity} />
              <InfoRow label="Domicile"        value={ROUND.domicile} />
              <InfoRow label="Instrument"      value={ROUND.instrument} accent />
              <InfoRow label="Target raise"    value={ROUND.target} accent />
              <InfoRow label="Pre-money"       value={ROUND.premoney} />
              <InfoRow label="Post-money"      value={ROUND.postmoney} />
              <InfoRow label="Seed dilution"   value={ROUND.dilution} />
              <InfoRow label="Interest"        value={ROUND.interest} />
              <InfoRow label="Conversion"      value={ROUND.conversion} />
              <InfoRow label="Min ticket"      value={ROUND.minTicket} />
              <InfoRow label="Max ticket"      value={ROUND.maxTicket} />

              <Section title="Investor rights" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {ROUND.rights.map((r, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                    <span style={{ color: '#5DCAA5', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', flexShrink: 0 }}>—</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{r}</span>
                  </div>
                ))}
              </div>

              <Section title="Return scenarios" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {RETURN_SCENARIOS.map((s, i) => (
                  <div key={i} style={{ background: 'var(--card-bg)', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', fontWeight: 600 }}>{s.scenario}</span>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: '#5DCAA5', fontWeight: 700 }}>{s.multiple}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: '#FAC775' }}>{s.irr} IRR</span>
                      </div>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', lineHeight: 1.5 }}>{s.basis}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Use of funds */}
            <div>
              <Section title="Use of funds — ₹18.1 Crore" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {USE_OF_FUNDS.map((u, i) => (
                  <div key={i} style={{ background: 'var(--card-bg)', padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.67rem', color: 'var(--off-white)' }}>{u.item}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#5DCAA5', fontWeight: 700, flexShrink: 0, marginLeft: '1rem' }}>{u.amount}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ flex: 1, height: 3, background: 'var(--card-border)', borderRadius: 2 }}>
                        <div style={{ height: '100%', width: `${u.pct}%`, background: '#5DCAA5', borderRadius: 2 }} />
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', flexShrink: 0 }}>{u.phase}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Section title="Why CCDs (not SAFE)" />
              <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
                {[
                  { q: 'Why not SAFE?',         a: 'SAFE is not a recognised instrument under Indian Companies Act. CCDs are the closest equivalent — legally clean, well-understood by Indian lawyers and investors.' },
                  { q: 'Why not equity shares?', a: 'Issuing equity at seed requires an exact valuation from a registered valuer (Section 56 angel tax risk). CCDs defer this to Series A when valuation is easier to establish.' },
                  { q: 'Conversion trigger',     a: 'At Series A (institutional round), or automatically after 36 months. Conversion price set at Series A price or a pre-agreed floor.' },
                  { q: 'DPIIT benefit',          a: 'With DPIIT Startup India recognition, angel tax exemption (Section 56(2)(viib)) applies — no need for registered valuer certificate for CCD issuance.' },
                ].map((r, i) => (
                  <div key={i} style={{ marginBottom: i < 3 ? '0.85rem' : 0, paddingBottom: i < 3 ? '0.85rem' : 0, borderBottom: i < 3 ? '1px solid var(--card-border)' : 'none' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', marginBottom: '0.3rem' }}>{r.q}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{r.a}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INVESTORS ───────────────────────────────────────────────────────── */}
      {tab === 'investors' && (
        <div>
          {INVESTORS.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: cat.color, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{cat.category}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem' }}>{cat.why}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {cat.targets.map((t, ti) => (
                  <div key={ti} style={{ background: 'var(--card-bg)', padding: '0.85rem 1.25rem', display: 'grid', gridTemplateColumns: '220px 120px 1fr', gap: '1.25rem', alignItems: 'start', borderLeft: `2px solid ${cat.color}30` }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{t.name}</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cat.color }}>{t.ticket}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 300 }}>{t.fit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── LEGAL ───────────────────────────────────────────────────────────── */}
      {tab === 'legal' && (
        <div>
          {LEGAL_STEPS.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: phase.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
                {phase.phase}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {phase.steps.map((s, si) => {
                  const statusColor = s.status === 'required' ? '#ff8080' : s.status === 'recommended' ? '#FAC775' : '#7a7870';
                  return (
                    <div key={si} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 120px 110px', gap: '1.25rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>{s.title}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{s.notes}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#FAC775', lineHeight: 1.5 }}>{s.cost}</div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${statusColor}40`, color: statusColor, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{s.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── TIMELINE ────────────────────────────────────────────────────────── */}
      {tab === 'timeline' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {TIMELINE.map((t, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '160px 110px 1fr', gap: '1.5rem', alignItems: 'start', borderLeft: `2px solid ${t.color}` }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', fontWeight: 600 }}>{t.month}</div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${t.color}40`, color: t.color, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{t.phase}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  {t.items.map((item, j) => (
                    <div key={j} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: t.color, fontFamily: 'var(--font-mono)', fontSize: '0.6rem', flexShrink: 0, paddingTop: '0.1rem' }}>—</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 300 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── HYPERSCALER & GOVT PITCH ─────────────────────────────────────────── */}
      {tab === 'hyperscaler' && (
        <div>
          <Section title="The data center freshwater crisis — in numbers" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
            {CRISIS_STATS.map(c => (
              <div key={c.label} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{c.label}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 800, color: c.color, marginBottom: '0.1rem', lineHeight: 1 }}>{c.val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', color: 'var(--muted)', lineHeight: 1.5 }}>{c.sub}</div>
              </div>
            ))}
          </div>

          <Section title="Positioning — why hyperscalers should care" />
          <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem', marginBottom: '1.5rem' }}>
            {CRISIS_NARRATIVE.map((r, i) => (
              <div key={i} style={{ marginBottom: i < CRISIS_NARRATIVE.length - 1 ? '0.85rem' : 0, paddingBottom: i < CRISIS_NARRATIVE.length - 1 ? '0.85rem' : 0, borderBottom: i < CRISIS_NARRATIVE.length - 1 ? '1px solid var(--card-border)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', marginBottom: '0.3rem' }}>{r.q}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{r.a}</div>
              </div>
            ))}
          </div>

          <Section title="Hyperscaler targets — realistic entry points" />
          {HYPERSCALER_TARGETS.map((cat, ci) => (
            <div key={ci} style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: cat.color, letterSpacing: '0.2em', textTransform: 'uppercase' }}>{cat.category}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.75rem' }}>{cat.why}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {cat.targets.map((t, ti) => (
                  <div key={ti} style={{ background: 'var(--card-bg)', padding: '0.85rem 1.25rem', display: 'grid', gridTemplateColumns: '300px 160px 1fr', gap: '1.25rem', alignItems: 'start', borderLeft: `2px solid ${cat.color}30` }}>
                    <div style={{ fontWeight: 600, fontSize: '0.78rem' }}>{t.name}</div>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: cat.color }}>{t.ticket}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.5, fontWeight: 300 }}>{t.fit}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <Section title="Government tender & subsidy pipeline" />
          {GOVT_PIPELINE.map((phase, pi) => (
            <div key={pi} style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: phase.color, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.75rem', paddingBottom: '0.4rem', borderBottom: '1px solid var(--card-border)' }}>
                {phase.phase}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {phase.steps.map((s, si) => {
                  const statusColor = s.status === 'required' ? '#ff8080' : s.status === 'apply now' ? '#5DCAA5' : s.status === 'recommended' ? '#FAC775' : '#7a7870';
                  return (
                    <div key={si} style={{ background: 'var(--card-bg)', padding: '1rem 1.25rem', display: 'grid', gridTemplateColumns: '1fr 200px 110px', gap: '1.25rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.8rem', marginBottom: '0.3rem' }}>{s.title}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.63rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300 }}>{s.notes}</div>
                      </div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: '#FAC775', lineHeight: 1.5 }}>{s.cost}</div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.56rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${statusColor}40`, color: statusColor, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>{s.status}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
