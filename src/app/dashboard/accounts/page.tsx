'use client';

import { ACCOUNTS, forVenture, isHoldCo, type AccountStatus, type AccountType } from '@/lib/finance';
import VenturePageLayout, { NoRows, HoldCoTag, type VentureTab } from '@/components/VenturePageLayout';
import { sc, scBorder } from '@/lib/status-colors';

const STATUS_STYLES: Record<AccountStatus, { color: string; label: string }> = {
  active:  { color: '#dbdbdb', label: 'Active'  },
  pending: { color: '#eeeeee', label: 'Pending' },
  planned: { color: 'var(--muted)', label: 'Planned' },
};

const TYPE_COLORS: Record<AccountType, string> = {
  Current:  '#eeeeee',
  Savings:  '#dbdbdb',
  Escrow:   '#adadad',
  Exchange: '#c8c8c8',
};

// Accounts have no natural second view, so the tab row splits by account type.
const TABS: VentureTab[] = [
  { key: 'all',      label: 'All'      },
  { key: 'Current',  label: 'Current'  },
  { key: 'Escrow',   label: 'Escrow'   },
  { key: 'Exchange', label: 'Exchange' },
];

export default function AccountsPage() {
  return (
    <VenturePageLayout
      title="Accounts"
      subtitle="Bank and exchange accounts across all entities — current, pending, and planned."
      pageSlug="accounts"
      eyebrow={() => 'accounts'}
      heading={v => `${v.name} Accounts`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        const scoped = forVenture(ACCOUNTS, venture.name);
        const rows = tab === 'all' ? scoped : scoped.filter(a => a.type === tab);

        const active  = rows.filter(a => a.status === 'active').length;
        const pending = rows.filter(a => a.status === 'pending').length;
        const planned = rows.filter(a => a.status === 'planned').length;

        return (
          <>
            <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
              {[
                { label: 'Total',   val: rows.length, color: 'var(--off-white)' },
                { label: 'Active',  val: active,      color: '#dbdbdb' },
                { label: 'Pending', val: pending,     color: '#eeeeee' },
                { label: 'Planned', val: planned,     color: 'var(--muted)' },
              ].map(c => (
                <div key={c.label} className="tasks-count-cell">
                  <div className="tasks-count-num" style={{ color: sc(c.color) }}>{c.val}</div>
                  <div className="tasks-count-label">{c.label}</div>
                </div>
              ))}
            </div>

            {rows.length === 0 ? (
              <NoRows>No {tab === 'all' ? '' : `${tab.toLowerCase()} `}accounts for {venture.name}.</NoRows>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: 'var(--card-border)', border: '1px solid var(--card-border)' }}>
                {rows.map((a, i) => {
                  const ss = STATUS_STYLES[a.status];
                  return (
                    <div key={i} style={{ background: 'var(--card-bg)', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '220px 110px 100px 1fr auto', gap: '1.25rem', alignItems: 'start' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                          {a.entity}{isHoldCo(a) && <HoldCoTag />}
                        </div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>{a.bank}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${scBorder(TYPE_COLORS[a.type])}`, color: sc(TYPE_COLORS[a.type]), alignSelf: 'flex-start' }}>{a.type}</span>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--off-white)' }}>{a.currency}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'var(--muted)', lineHeight: 1.7, fontWeight: 300, marginBottom: '0.3rem' }}>{a.purpose}</div>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--muted)', opacity: 0.7, lineHeight: 1.5 }}>{a.notes}</div>
                      </div>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.55rem', border: `1px solid ${scBorder(ss.color)}`, color: sc(ss.color), whiteSpace: 'nowrap', alignSelf: 'flex-start' }}>{ss.label}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}
