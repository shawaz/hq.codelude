'use client';
import { useState } from 'react';
import { PROPERTIES, type PropertyType } from '@/lib/ops';

const TYPE_COLORS: Record<PropertyType, string> = { Digital: '#7F77DD', Physical: '#5DCAA5', IP: '#c8f53a', Domain: '#85B7EB' };
const STATUS_STYLES: Record<string, { color: string }> = {
  active:           { color: '#5DCAA5' },
  pending:          { color: '#FAC775' },
  planned:          { color: 'var(--muted)' },
  'in-development': { color: '#c8f53a' },
};
const VENTURE_COLORS: Record<string, string> = {
  Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD',
  HubCV: '#FAC775', Llife: '#85B7EB', Dextrip: '#F0997B',
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
            style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t as PropertyType], color: TYPE_COLORS[t as PropertyType] } : {}}
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
              <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[p.type]}40`, color: TYPE_COLORS[p.type] }}>{p.type}</span></td>
              <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: VENTURE_COLORS[p.venture] }}>{p.venture}</span></td>
              <td><span className="category-label">{p.value}</span></td>
              <td><span className="category-label" style={{ fontSize: '0.6rem' }}>{p.location}</span></td>
              <td><span className="status-badge" style={{ color: STATUS_STYLES[p.status].color, borderColor: `${STATUS_STYLES[p.status].color}40` }}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
