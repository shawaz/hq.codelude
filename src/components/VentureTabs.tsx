'use client';

import { useVenture } from '@/contexts/venture-context';
import { VENTURES } from '@/lib/ventures';

export default function VentureTabs() {
  const { vi, setVi } = useVenture();
  return (
    <div style={{ display: 'flex', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)', marginBottom: '1.5rem' }}>
      {VENTURES.map((v, i) => (
        <button key={v.name} onClick={() => setVi(i)} style={{
          flex: 1, padding: '0.85rem 1rem', background: vi === i ? v.color : 'var(--card-bg)',
          border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '0.68rem',
          letterSpacing: '0.08em', color: vi === i ? 'var(--black)' : 'var(--muted)',
          fontWeight: vi === i ? 700 : 400, transition: 'all 0.15s',
        }}>
          {v.name}
        </button>
      ))}
    </div>
  );
}
