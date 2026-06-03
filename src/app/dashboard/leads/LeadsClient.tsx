'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface RobornLead {
  id: string;
  name: string;
  email: string;
  interest: string;
  config: string;
  message: string;
  source: string;
  venture: string;
  date: string;
  status: LeadStatus;
}

type LeadStatus = 'new' | 'qualified' | 'meeting-booked' | 'proposal-sent' | 'negotiating';

const STATUS_META: Record<LeadStatus, { label: string; color: string }> = {
  'new':            { label: 'New',            color: '#c8f53a' },
  'qualified':      { label: 'Qualified',      color: '#FAC775' },
  'meeting-booked': { label: 'Meeting Booked', color: '#85B7EB' },
  'proposal-sent':  { label: 'Proposal Sent',  color: '#7F77DD' },
  'negotiating':    { label: 'Negotiating',    color: '#5DCAA5' },
};

const INTEREST_COLOR: Record<string, string> = {
  Compute:   '#5DCAA5',
  Water:     '#85B7EB',
  Mineral:   '#c8b4f8',
  Franchise: '#F0997B',
};

const FILTERS = ['All', 'Compute', 'Water', 'Mineral', 'Franchise'] as const;

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
}

export default function LeadsClient({ initialLeads }: { initialLeads: RobornLead[] }) {
  const [leads, setLeads] = useState<RobornLead[]>(initialLeads);
  const [filter, setFilter] = useState<typeof FILTERS[number]>('All');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function updateStatus(id: string, status: LeadStatus) {
    await fetch(`/api/leads/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    startTransition(() => {
      setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      router.refresh();
    });
  }

  const filtered = filter === 'All' ? leads : leads.filter(l => l.interest === filter);

  const stats = {
    total:     leads.length,
    new:       leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => ['qualified', 'meeting-booked', 'proposal-sent', 'negotiating'].includes(l.status)).length,
    thisWeek:  leads.filter(l => Date.now() - new Date(l.date).getTime() < 7 * 86400000).length,
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>Roborns Leads</h1>
          <p className="page-sub" style={{ margin: 0 }}>Inbound enquiries from roborns.com — compute, water, mineral &amp; franchise.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <a href="https://roborns.com" target="_blank" rel="noopener" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.1em', border: '1px solid var(--card-border)', padding: '0.4rem 0.8rem', textDecoration: 'none' }}>
            ↗ roborns.com
          </a>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Leads', value: stats.total,     color: 'var(--accent)' },
          { label: 'New',         value: stats.new,       color: '#c8f53a' },
          { label: 'In Pipeline', value: stats.qualified, color: '#FAC775' },
          { label: 'This Week',   value: stats.thisWeek,  color: '#85B7EB' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: s.color, letterSpacing: '-0.03em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '0.4rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {FILTERS.map(f => {
          const count = f === 'All' ? leads.length : leads.filter(l => l.interest === f).length;
          const active = filter === f;
          const accent = f === 'All' ? 'var(--accent)' : (INTEREST_COLOR[f] || 'var(--accent)');
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '0.08em',
                padding: '0.4rem 0.9rem', cursor: 'pointer', transition: 'all 0.15s',
                border: active ? `1px solid ${accent}` : '1px solid var(--card-border)',
                background: active ? `${accent}18` : 'var(--card-bg)',
                color: active ? accent : 'var(--muted)',
              }}
            >
              {f} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Leads list */}
      {filtered.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
            {leads.length === 0
              ? 'No leads yet. Enquiries from roborns.com will appear here automatically.'
              : `No ${filter} leads yet.`}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {filtered.map(lead => {
            const sm = STATUS_META[lead.status] || STATUS_META.new;
            const ic = INTEREST_COLOR[lead.interest] || 'var(--accent)';
            const isExpanded = expanded === lead.id;
            return (
              <div key={lead.id} style={{ background: 'var(--card-bg)', borderLeft: `3px solid ${ic}` }}>
                <div
                  style={{ padding: '1.1rem 1.4rem', cursor: 'pointer', display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'start' }}
                  onClick={() => setExpanded(isExpanded ? null : lead.id)}
                >
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 110px 120px 90px', gap: '1rem', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.84rem', marginBottom: '0.2rem' }}>{lead.name}</div>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)' }}>{lead.email}</div>
                    </div>
                    <div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: ic, border: `1px solid ${ic}40`, padding: '0.15rem 0.5rem', letterSpacing: '0.06em' }}>
                        {lead.interest}
                      </span>
                    </div>
                    <div onClick={e => e.stopPropagation()}>
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value as LeadStatus)}
                        style={{
                          fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: sm.color,
                          background: `${sm.color}12`, border: `1px solid ${sm.color}50`,
                          padding: '0.25rem 0.5rem', cursor: 'pointer', outline: 'none', width: '100%',
                        }}
                      >
                        {Object.entries(STATUS_META).map(([k, v]) => (
                          <option key={k} value={k} style={{ color: 'var(--off-white)', background: 'var(--card-bg)' }}>{v.label}</option>
                        ))}
                      </select>
                    </div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', textAlign: 'right' }}>
                      {lead.date ? timeAgo(lead.date) : '—'}
                    </div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', paddingTop: '0.15rem' }}>
                    {isExpanded ? '▲' : '▼'}
                  </div>
                </div>

                {isExpanded && (
                  <div style={{ borderTop: '1px solid var(--card-border)', padding: '1.1rem 1.4rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {lead.config && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Configuration</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: ic, background: `${ic}0a`, border: `1px solid ${ic}20`, padding: '0.6rem 0.9rem', lineHeight: 1.6 }}>
                          {lead.config}
                        </div>
                      </div>
                    )}
                    {lead.message && (
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Message</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300 }}>&ldquo;{lead.message}&rdquo;</div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Source</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>{lead.source}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Submitted</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>{lead.date ? formatDate(lead.date) : '—'}</div>
                      </div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Reply</div>
                        <a
                          href={`mailto:${lead.email}?subject=Re: Your Roborns ${lead.interest} Enquiry`}
                          style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--accent)', textDecoration: 'none' }}
                          onClick={e => e.stopPropagation()}
                        >
                          {lead.email} ↗
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
