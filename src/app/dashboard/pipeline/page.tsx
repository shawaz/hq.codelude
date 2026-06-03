'use client';

import { useState } from 'react';
import { PIPELINE, PIPELINE_STAGES, type PipelineStage } from '@/lib/fundraising';

const ROUNDS = ['All', 'Roborns Seed', 'Codelude HoldCo Token', 'Dextrip Growth', 'Cuestay Pre-seed'];

export default function PipelinePage() {
  const [round,       setRound]       = useState('All');
  const [stageFilter, setStageFilter] = useState<PipelineStage | 'all'>('all');
  const [selected,    setSelected]    = useState<string | null>(null);

  const filtered = PIPELINE.filter(p =>
    (round       === 'All' || p.round === round) &&
    (stageFilter === 'all' || p.stage === stageFilter)
  );

  const lead = selected ? PIPELINE.find(p => p.id === selected) : null;
  const stageLookup = Object.fromEntries(PIPELINE_STAGES.map(s => [s.key, s]));

  return (
    <div>
      <h1 className="page-title">Investor Pipeline</h1>
      <p className="page-sub">CRM-style investor pipeline — from identification to close.</p>

      {/* Stage funnel counts */}
      <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem', overflowX: 'auto' }}>
        {PIPELINE_STAGES.filter(s => !['closed-lost', 'on-hold'].includes(s.key)).map(s => {
          const count = PIPELINE.filter(p => p.stage === s.key).length;
          return (
            <button key={s.key} onClick={() => setStageFilter(stageFilter === s.key ? 'all' : s.key)}
              style={{ flex: '0 0 auto', minWidth: 80, padding: '0.75rem 0.5rem', background: stageFilter === s.key ? s.color : 'var(--card-bg)', border: 'none', cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: stageFilter === s.key ? 'var(--black)' : (count > 0 ? s.color : '#4a4845') }}>{count}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.52rem', color: stageFilter === s.key ? 'var(--black)' : 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '0.2rem' }}>{s.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {ROUNDS.map(r => (
          <button key={r} className={`filter-pill${round === r ? ' active' : ''}`} onClick={() => setRound(r)}>{r}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 320px' : '1fr', gap: '1.5rem', alignItems: 'start' }}>
        {/* Lead list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
          {filtered.map(p => {
            const s = stageLookup[p.stage];
            const isActive = selected === p.id;
            return (
              <div key={p.id} onClick={() => setSelected(isActive ? null : p.id)}
                style={{ background: isActive ? '#131311' : 'var(--card-bg)', padding: '1.1rem 1.5rem', cursor: 'pointer',
                  borderLeft: `2px solid ${isActive ? s.color : 'transparent'}`, transition: 'background 0.12s' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 100px', gap: '1rem', alignItems: 'start' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.2rem' }}>{p.name}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{p.firm} · {p.type}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Round</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--off-white)' }}>{p.round}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${s.color}40`, color: s.color, alignSelf: 'flex-start', whiteSpace: 'nowrap' }}>
                    {s.label}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--accent)', marginTop: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                  <span>→</span><span style={{ lineHeight: 1.5 }}>{p.nextAction}</span>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div style={{ background: 'var(--card-bg)', padding: '2rem', textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)' }}>No leads match the current filter.</div>
          )}
        </div>

        {/* Detail panel */}
        {lead && (
          <div style={{ position: 'sticky', top: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: 'var(--card-bg)', border: `1px solid ${stageLookup[lead.stage].color}40`, borderLeft: `2px solid ${stageLookup[lead.stage].color}`, padding: '1.5rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: stageLookup[lead.stage].color, letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{stageLookup[lead.stage].label}</div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.25rem' }}>{lead.name}</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)', marginBottom: '1rem' }}>{lead.firm} · {lead.type}</div>
              {[
                { k: 'Round',        v: lead.round },
                { k: 'Target cheque',v: lead.targetAmount },
                { k: 'Last contact', v: lead.lastContact },
              ].map(row => (
                <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--card-border)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--muted)', letterSpacing: '0.08em' }}>{row.k}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--off-white)' }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '1.25rem' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--muted)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Notes</div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.8, fontWeight: 300, margin: 0 }}>{lead.notes}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
