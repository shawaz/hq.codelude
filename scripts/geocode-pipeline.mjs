/**
 * Backfill coordinates onto pipeline records.
 *
 * Records arrive with city/district/state as text and no coordinates — only the
 * public site-enquiry form sets `center`. The map needs positions, so this
 * resolves each record's location once via Nominatim and writes it back. After
 * that the map is instant and nothing is looked up again.
 *
 * Nominatim's usage policy allows roughly one request per second and requires a
 * real User-Agent. Both are honoured below — do not lower the delay. The run is
 * slow by design; it only has to happen once.
 *
 * Resolved city names are cached in-process, so a hundred records in Mangaluru
 * cost one lookup rather than a hundred.
 *
 *   node scripts/geocode-pipeline.mjs [--prod] [--limit N]
 */
import { execFileSync } from 'node:child_process';

const prod  = process.argv.includes('--prod');
const limIx = process.argv.indexOf('--limit');
const limit = limIx > -1 ? Number(process.argv[limIx + 1]) : 100;

const RATE_MS = 1100;              // Nominatim: ~1 req/sec. Leave headroom.
const UA = 'hq.codelude.com pipeline map (codelude@gmail.com)';

const convex = (fn, args) =>
  JSON.parse(
    execFileSync('npx', ['convex', 'run', ...(prod ? ['--prod'] : []), fn, JSON.stringify(args)],
      { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }) || 'null',
  );

const sleep = ms => new Promise(r => setTimeout(r, ms));

const rows = convex('pipeline:needsGeocode', { limit });
if (!rows?.length) {
  console.log('Nothing to geocode — every record with a location already has coordinates.');
  process.exit(0);
}
console.log(`${rows.length} records to geocode (~${Math.ceil(rows.length * RATE_MS / 1000)}s at the rate limit)`);

const cache = new Map();
let done = 0, missed = 0;

for (const r of rows) {
  let hit = cache.get(r.query);
  if (hit === undefined) {
    await sleep(RATE_MS);
    const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q: r.query, format: 'json', limit: '1' })}`;
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      const data = res.ok ? await res.json() : [];
      hit = data[0] ? [parseFloat(data[0].lon), parseFloat(data[0].lat)] : null;
    } catch {
      hit = null;
    }
    cache.set(r.query, hit);
  }

  if (!hit) { missed++; console.log(`  – ${r.name}: no match for "${r.query}"`); continue; }
  convex('pipeline:setCenter', { id: r._id, center: hit });
  done++;
  if (done % 10 === 0) console.log(`  ${done}/${rows.length}…`);
}

console.log(`\ngeocoded ${done}, unresolved ${missed}, unique lookups ${cache.size}`);
if (rows.length === limit) console.log('Hit the limit — re-run to continue.');
