import { DEALS } from '@/lib/sales';
import VentureTabs from '@/components/VentureTabs';

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  discovery:    { color: '#85B7EB', label: 'Discovery'   },
  proposal:     { color: '#FAC775', label: 'Proposal'    },
  negotiating:  { color: '#c8f53a', label: 'Negotiating' },
  verbal:       { color: '#5DCAA5', label: 'Verbal'      },
  'closed-won': { color: '#5DCAA5', label: 'Won'         },
  'closed-lost':{ color: '#ff8080', label: 'Lost'        },
};
const VENTURE_COLORS: Record<string, string> = { Codelude: '#c8f53a', Roborns: '#5DCAA5', Franchiseen: '#7F77DD', HubCV: '#FAC775', Cuestay: '#85B7EB', Dextrip: '#F0997B' };

export default function DealsPage() {
  return (
    <div>
      <h1 className="page-title">Deals</h1>
      <p className="page-sub">Active deals — investor rounds, franchise agreements, and partnership negotiations.</p>
      <VentureTabs />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
        {DEALS.map((d, i) => {
          const ss = STATUS_STYLES[d.status];
          return (
            <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '1fr 120px 100px 100px auto', gap: '1.25rem', alignItems: 'start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.25rem' }}>{d.title}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', marginBottom: '0.5rem' }}>{d.company}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.6, fontWeight: 300 }}>{d.notes}</div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#5DCAA5', fontWeight: 500 }}>{d.value}</div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: VENTURE_COLORS[d.venture] }}>{d.venture}</span>
              <span className="category-label">{d.closeDate}</span>
              <span className="status-badge" style={{ color: ss.color, borderColor: `${ss.color}40`, whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
