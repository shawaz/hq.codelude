'use client';
import { useState } from 'react';
import { PROPERTIES, type PropertyType } from '@/lib/ops';
import { sc, scBorder } from '@/lib/status-colors';

const TYPE_COLORS: Record<PropertyType, string> = { Digital: '#c8c8c8', Physical: '#dbdbdb', IP: '#eeeeee', Domain: '#a5a5a5' };
const STATUS_STYLES: Record<string, { color: string }> = {
  active:           { color: '#dbdbdb' },
  pending:          { color: '#b5b5b5' },
  planned:          { color: 'var(--muted)' },
  'in-development': { color: '#eeeeee' },
};
const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#eeeeee', Roborns: '#dbdbdb', Franchiseen: '#c8c8c8',
  HubCV: '#b5b5b5', Llife: '#a5a5a5', Dextrip: '#adadad',
};
const TYPES: (PropertyType | 'all')[] = ['all', 'Digital', 'Domain', 'Physical', 'IP'];

export default function PropertiesPage() {
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const filtered = PROPERTIES.filter(p => type === 'all' || p.type === type);
  return (
    <div>
      <h1 className="page-title">Properties</h1>
      <p className="page-sub">Physical and digital asset registry — servers, domains, IP, and infrastructure.</p>
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} className={`filter-pill${type === t ? ' active' : ''}`}
            style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t as PropertyType], color: sc(TYPE_COLORS[t as PropertyType]) } : {}}
            onClick={() => setType(t)}>{t === 'all' ? 'All types' : t}</button>
        ))}
      </div>
      <table className="tasks-table">
        <thead><tr><th>Name</th><th>Type</th><th>Venture</th><th>Value</th><th>Location</th><th>Status</th></tr></thead>
        <tbody>
          {filtered.map((p, i) => (
            <tr key={i}>
              <td>
                <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{p.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{p.notes}</div>
              </td>
              <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[p.type])}`, color: sc(TYPE_COLORS[p.type]) }}>{p.type}</span></td>
              <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: sc(VENTURE_COLORS[p.venture]) }}>{p.venture}</span></td>
              <td><span className="category-label">{p.value}</span></td>
              <td><span className="category-label" style={{ fontSize: '0.6rem' }}>{p.location}</span></td>
              <td><span className="status-badge" style={{ color: sc(STATUS_STYLES[p.status].color), borderColor: `${scBorder(STATUS_STYLES[p.status].color)}` }}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
