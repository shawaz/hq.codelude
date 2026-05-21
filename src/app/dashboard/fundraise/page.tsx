'use client';

import { useState } from 'react';

type Tab = 'round' | 'investors' | 'legal' | 'timeline';

const TABS: { key: Tab; label: string }[] = [
  { key: 'round',     label: 'Round Structure' },
  { key: 'investors', label: 'Investor Targets' },
  { key: 'legal',     label: 'Legal & Compliance' },
  { key: 'timeline',  label: 'Timeline' },
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
    </div>
  );
}
