'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAction } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { sc, scBorder } from '@/lib/status-colors';

/**
 * Franchiseen operations, read live from its own deployment.
 *
 * This page used to render FRANCHISE_BRANDS from @/lib/ops — a hand-maintained
 * list that nothing kept in step with the product. It now shows what is actually
 * waiting on a person, through the bridge in src/convex/franchiseen.ts.
 *
 * Loaded by action rather than query, so it fetches on mount instead of
 * subscribing: Franchiseen is a separate Convex deployment and hq holds no copy
 * of its data. Hence the explicit Refresh — better than a stale page that looks
 * live.
 */

type Money = { amountMinor: number; currency: 'INR' | 'AED' };

type Brand = {
  _id: string;
  name: string;
  category: string | null;
  minInvestment?: Money | null;
};

type Queue = {
  kycCount: number;
  documentCount: number;
  paymentCount: number;
  applicationCount: number;
  buildingCount: number;
  shopCount: number;
  brandCount: number;
  brands: Brand[];
};

const money = (m: Money | null | undefined) =>
  m == null
    ? '—'
    : `${m.currency === 'INR' ? '₹' : 'AED '}${(m.amountMinor / 100).toLocaleString('en-IN')}`;

export default function FranchisePage() {
  const loadQueue = useAction(api.franchiseen.queue);
  const reviewBrand = useAction(api.franchiseen.reviewBrand);
  const syncLeads = useAction(api.franchiseen.syncLeads);

  const [queue, setQueue] = useState<Queue | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [synced, setSynced] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setError(null);
    try {
      setQueue((await loadQueue({})) as Queue);
    } catch (e) {
      // The bridge forwards Franchiseen's own message, which names the actual
      // problem — usually that this account has no operations profile there.
      setError(e instanceof Error ? e.message : 'Could not reach Franchiseen');
    }
  }, [loadQueue]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function decide(brandId: string, approve: boolean) {
    const reason = approve
      ? undefined
      : (window.prompt('Why is this brand being turned back? The lister reads this.') ?? '').trim();
    if (!approve && (reason === undefined || reason.length === 0)) return;

    setBusy(brandId);
    try {
      await reviewBrand({ brandId, approve, reason });
      await refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Review failed');
    } finally {
      setBusy(null);
    }
  }

  async function sync() {
    setBusy('sync');
    setError(null);
    try {
      const { created, updated } = await syncLeads({});
      setSynced(
        created === 0 && updated === 0
          ? 'Nothing to sync — no brands are waiting.'
          : `${created} new lead${created === 1 ? '' : 's'}, ${updated} refreshed.`,
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sync failed');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <h1 className="page-title">Franchise</h1>
      <p className="page-sub">
        Franchiseen operations — everything waiting on a person, live from the Franchiseen
        deployment.
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '1.5rem' }}>
        <button className="btn-ghost" onClick={() => void refresh()}>
          Refresh
        </button>
        <button className="btn-ghost" disabled={busy === 'sync'} onClick={() => void sync()}>
          {busy === 'sync' ? 'Syncing…' : 'Sync to Leads'}
        </button>
        {synced !== null ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            {synced}
          </span>
        ) : null}
        {queue === null && error === null ? (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--muted)' }}>
            Loading…
          </span>
        ) : null}
      </div>

      {error !== null ? (
        <div
          style={{
            background: 'var(--card-bg)',
            border: '1px solid var(--card-border)',
            borderLeft: `2px solid ${scBorder('#e5b55a')}`,
            padding: '1.25rem 1.5rem',
            marginBottom: '1.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--muted)',
            lineHeight: 1.8,
          }}
        >
          {error}
        </div>
      ) : null}

      {queue !== null ? (
        <>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7,1fr)',
              gap: '1px',
              background: 'var(--card-border)',
              border: '1px solid var(--card-border)',
              marginBottom: '2rem',
            }}
          >
            {(
              [
                ['Brands', queue.brandCount],
                ['Buildings', queue.buildingCount],
                ['Shops', queue.shopCount],
                ['Identity', queue.kycCount],
                ['Documents', queue.documentCount],
                ['Payments', queue.paymentCount],
                ['Applications', queue.applicationCount],
              ] as const
            ).map(([label, n]) => (
              <div key={label} style={{ background: 'var(--card-bg)', padding: '1.25rem' }}>
                <div
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: n > 0 ? sc('#e5b55a') : 'var(--muted)',
                  }}
                >
                  {n}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'var(--muted)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginTop: '0.35rem',
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--accent-text)',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid var(--card-border)',
            }}
          >
            Brands awaiting review
          </div>

          {queue.brands.length === 0 ? (
            <div
              style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
                padding: '2rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--muted)',
              }}
            >
              Nothing waiting. A brand listed in the app appears here for approval.
            </div>
          ) : (
            <table className="tasks-table">
              <thead>
                <tr>
                  <th>Brand</th>
                  <th>Category</th>
                  <th style={{ textAlign: 'right' }}>Min. Investment</th>
                  <th style={{ textAlign: 'right' }}>Decision</th>
                </tr>
              </thead>
              <tbody>
                {queue.brands.map((b) => (
                  <tr key={b._id}>
                    <td style={{ fontWeight: 600, fontSize: '0.8rem' }}>{b.name}</td>
                    <td>
                      <span className="category-label">{b.category ?? '—'}</span>
                    </td>
                    <td
                      style={{
                        textAlign: 'right',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.7rem',
                        color: 'var(--off-white)',
                      }}
                    >
                      {money(b.minInvestment)}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-ghost"
                        disabled={busy === b._id}
                        onClick={() => void decide(b._id, true)}
                      >
                        {busy === b._id ? '…' : 'Publish'}
                      </button>{' '}
                      <button
                        className="btn-ghost"
                        disabled={busy === b._id}
                        onClick={() => void decide(b._id, false)}
                      >
                        Turn back
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      ) : null}
    </div>
  );
}
