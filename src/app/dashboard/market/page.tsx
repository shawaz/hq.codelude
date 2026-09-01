'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import VenturePageLayout, { NoRows, type VentureTab } from '@/components/VenturePageLayout';
import PipelineMap, { type MapPoint } from '@/components/PipelineMap';

// Stage becomes the tab row, matching every other venture-tabbed page.
const TABS: VentureTab[] = [
  { key: 'all',      label: 'All'       },
  { key: 'prospect', label: 'Prospects' },
  { key: 'lead',     label: 'Leads'     },
  { key: 'deal',     label: 'Deals'     },
  { key: 'client',   label: 'Clients'   },
];

const STAGE_LABEL: Record<string, string> = {
  prospect: 'prospects', lead: 'leads', deal: 'deals', client: 'clients',
};

export default function MapPage() {
  const points = useQuery(api.pipeline.mapPoints, {}) as MapPoint[] | undefined;

  return (
    <VenturePageLayout
      title="Map"
      subtitle="Where the pipeline is — prospects, leads, deals and clients by location."
      pageSlug="market"
      eyebrow={() => 'pipeline geography'}
      heading={v => `${v.name} Map`}
      tabs={TABS}
    >
      {({ venture, tab }) => {
        // Plain filters, deliberately not memoised. VenturePageLayout early
        // returns before invoking this callback, so a hook here would be a
        // conditional hook call — React would throw on the first render where
        // the layout bailed out. The set is small once geocoded anyway.
        const scoped = (points ?? []).filter(p => p.venture === venture.name);
        const shown = tab === 'all' ? scoped : scoped.filter(p => p.stage === tab);

        const countFor = (k: string) => scoped.filter(p => p.stage === k).length;

        return (
          <>
            <div className="tasks-count-row" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '1.5rem' }}>
              {(['prospect', 'lead', 'deal', 'client'] as const).map(k => (
                <div key={k} className="tasks-count-cell">
                  <div className="tasks-count-num">{countFor(k)}</div>
                  <div className="tasks-count-label">{STAGE_LABEL[k]}</div>
                </div>
              ))}
            </div>

            {points === undefined ? (
              <NoRows>Loading map…</NoRows>
            ) : shown.length === 0 ? (
              <NoRows>
                {scoped.length === 0 ? (
                  <>
                    No mapped records for {venture.name} yet.
                    <br /><br />
                    Pipeline records store city and state as text — only the public
                    site-enquiry form captures coordinates. Run{' '}
                    <code style={{ color: 'var(--off-white)' }}>node scripts/geocode-pipeline.mjs --prod</code>{' '}
                    to resolve the existing ones and they will appear here.
                  </>
                ) : (
                  <>No {STAGE_LABEL[tab] ?? tab} on the map for {venture.name}. {scoped.length} other records are mapped.</>
                )}
              </NoRows>
            ) : (
              <PipelineMap points={shown} />
            )}
          </>
        );
      }}
    </VenturePageLayout>
  );
}
