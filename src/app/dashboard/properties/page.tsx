'use client';
import { useState } from 'react';
import { PROPERTIES, type PropertyType } from '@/lib/ops';
import { useVenture } from '@/contexts/venture-context';
import { VENTURES } from '@/lib/ventures';
import VentureTabs from '@/components/VentureTabs';

const TYPE_COLORS: Record<PropertyType, string> = { Digital: '#7F77DD', Physical: '#5DCAA5', IP: '#c8f53a', Domain: '#85B7EB' };
const STATUS_STYLES: Record<string, { color: string }> = {
  active:           { color: '#5DCAA5' },
  pending:          { color: '#FAC775' },
  planned:          { color: '#7a7870' },
  'in-development': { color: '#c8f53a' },
};
const TYPES: (PropertyType | 'all')[] = ['all', 'Digital', 'Domain', 'Physical', 'IP'];

export default function PropertiesPage() {
  const { vi } = useVenture();
  const ventureName = VENTURES[vi].name;
  const ventureColor = VENTURES[vi].color;
  const [type, setType] = useState<PropertyType | 'all'>('all');
  const filtered = PROPERTIES.filter(p =>
    (type === 'all' || p.type === type) && p.venture === ventureName
  );

  return (
    <div>
      <h1 className="page-title">Properties</h1>
      <p className="page-sub">Physical and digital asset registry — servers, domains, IP, and infrastructure.</p>
      <VentureTabs />
      <div className="filter-bar" style={{ marginBottom: '1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} className={`filter-pill${type === t ? ' active' : ''}`}
            style={type === t && t !== 'all' ? { borderColor: TYPE_COLORS[t as PropertyType], color: TYPE_COLORS[t as PropertyType] } : {}}
            onClick={() => setType(t)}>{t === 'all' ? 'All types' : t}</button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <div style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', padding: '2rem', fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--muted)', lineHeight: 1.8 }}>
          No properties for <span style={{ color: ventureColor }}>{ventureName}</span>{type !== 'all' ? ` under ${type}` : ''}.
        </div>
      ) : (
        <table className="tasks-table">
          <thead><tr><th>Name</th><th>Type</th><th>Value</th><th>Location</th><th>Status</th></tr></thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={i}>
                <td>
                  <div style={{ fontWeight: 600, fontSize: '0.78rem', marginBottom: '0.2rem' }}>{p.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)' }}>{p.notes}</div>
                </td>
                <td><span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${TYPE_COLORS[p.type]}40`, color: TYPE_COLORS[p.type] }}>{p.type}</span></td>
                <td><span className="category-label">{p.value}</span></td>
                <td><span className="category-label" style={{ fontSize: '0.6rem' }}>{p.location}</span></td>
                <td><span className="status-badge" style={{ color: STATUS_STYLES[p.status].color, borderColor: `${STATUS_STYLES[p.status].color}40` }}>{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
