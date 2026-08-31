'use client';

import { useState } from 'react';
import { PLANS, type VenturePlan } from '@/lib/plans';

type Tab = 'model' | 'plan' | 'finance';

const TABS: { key: Tab; label: string }[] = [
  { key: 'model',   label: 'Business Model' },
  { key: 'plan',    label: 'Business Plan' },
  { key: 'finance', label: 'Financial Plan' },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--card-border)', padding: '0.7rem 0', gap: '1.5rem' }}>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.08em', minWidth: 160, flexShrink: 0 }}>{label}</span>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.6, fontWeight: 300 }}>{value}</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--accent-text)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '1rem', marginTop: '2rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--card-border)' }}>
      {children}
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.5rem', marginBottom: '1rem' }}>
      {children}
    </div>
  );
}

function ModelTab({ plan }: { plan: VenturePlan }) {
  const m = plan.businessModel;
  return (
    <div>
      <Card>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Value Proposition</div>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300 }}>{m.valueProp}</p>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <SectionTitle>Revenue streams</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {m.revenueStreams.map(r => (
              <div key={r.stream} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.3rem' }}>{r.stream}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{r.description}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Customer segments</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {m.customerSegments.map(c => (
              <div key={c.segment} style={{ background: 'var(--card-bg)', padding: '1rem 1.1rem' }}>
                <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.3rem' }}>{c.segment}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{c.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
        <div>
          <SectionTitle>Cost structure</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {m.costStructure.map((c, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '0.75rem 1.1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', flexShrink: 0, paddingTop: '0.1rem' }}>—</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionTitle>Key partners</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {m.keyPartners.map((p, i) => (
              <div key={i} style={{ background: 'var(--card-bg)', padding: '0.75rem 1.1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--accent-text)', flexShrink: 0, paddingTop: '0.1rem' }}>—</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PlanTab({ plan }: { plan: VenturePlan }) {
  const b = plan.businessPlan;
  const done = b.milestones.filter(m => m.done).length;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Problem</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300 }}>{b.problem}</p>
        </Card>
        <Card>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.6rem' }}>Solution</div>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--off-white)', lineHeight: 1.9, fontWeight: 300 }}>{b.solution}</p>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <SectionTitle>Market size</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1rem' }}>
            {b.market.map(m => (
              <div key={m.label} style={{ background: 'var(--card-bg)', padding: '0.9rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{m.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)', textAlign: 'right' }}>{m.size}</span>
              </div>
            ))}
          </div>

          <SectionTitle>Go-to-market</SectionTitle>
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{b.gtm}</p>
          </Card>
        </div>

        <div>
          <SectionTitle>Milestones — {done}/{b.milestones.length} complete</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
            {b.milestones.map((m, i) => (
              <div key={i} style={{ background: m.done ? 'var(--card-bg-alt)' : 'var(--card-bg)', padding: '0.8rem 1.1rem', display: 'grid', gridTemplateColumns: '80px 1fr auto', gap: '1rem', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: m.done ? 'var(--accent)' : 'var(--muted)', letterSpacing: '0.08em' }}>{m.date}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: m.done ? 'var(--off-white)' : 'var(--muted)', fontWeight: 300 }}>{m.title}</span>
                <span style={{ fontSize: '0.7rem', color: m.done ? '#5DCAA5' : 'var(--card-border)' }}>{m.done ? '✓' : '○'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function FinanceTab({ plan }: { plan: VenturePlan }) {
  const f = plan.financialPlan;
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Funding need',    value: f.fundingNeed },
          { label: 'Year 1 target',   value: f.year1Target },
          { label: 'Break-even',      value: f.breakEven },
        ].map(item => (
          <div key={item.label} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{item.label}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--accent-text)', lineHeight: 1.5, fontWeight: 400 }}>{item.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div>
          <SectionTitle>Revenue model</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {f.revenueModel.map(r => <Row key={r.label} label={r.label} value={r.value} />)}
          </div>

          <SectionTitle>Funding source</SectionTitle>
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{f.fundingSource}</p>
          </Card>
        </div>

        <div>
          <SectionTitle>Notes</SectionTitle>
          <Card>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.9, fontWeight: 300, margin: 0 }}>{f.notes}</p>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function PlanPage() {
  const [venture, setVenture] = useState(0);
  const [tab, setTab]         = useState<Tab>('model');
  const plan = PLANS[venture];

  return (
    <div>
      <h1 className="page-title">Plan</h1>
      <p className="page-sub">Business model, business plan, and financial plan for each venture.</p>

      {/* Venture selector */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {PLANS.map((p, i) => (
          <button
            key={p.name}
            onClick={() => setVenture(i)}
            style={{
              flex: 1, padding: '0.85rem 1rem', background: venture === i ? p.color : 'var(--card-bg)',
              border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
              letterSpacing: '0.08em', color: venture === i ? 'var(--black)' : 'var(--muted)',
              fontWeight: venture === i ? 700 : 400, transition: 'all 0.15s',
            }}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Venture header */}
      <div style={{ borderLeft: `2px solid ${plan.color}`, paddingLeft: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: plan.color, letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>{plan.sector}</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 700, letterSpacing: '-0.01em' }}>{plan.name}</div>
      </div>

      {/* Plan type tabs */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '1.5rem' }}>
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: '0.6rem 1.4rem', border: '1px solid', cursor: 'pointer', fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', transition: 'all 0.15s',
              background: tab === t.key ? 'var(--off-white)' : 'transparent',
              borderColor: tab === t.key ? 'var(--off-white)' : 'var(--card-border)',
              color: tab === t.key ? 'var(--black)' : 'var(--muted)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'model'   && <ModelTab   plan={plan} />}
      {tab === 'plan'    && <PlanTab    plan={plan} />}
      {tab === 'finance' && <FinanceTab plan={plan} />}
    </div>
  );
}
