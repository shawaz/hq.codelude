/**
 * Seed the Convex `offices` table from src/lib/ops.ts. Idempotent on seedId.
 *   node scripts/seed-offices.mjs [--prod]
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const src = readFileSync(new URL('../src/lib/ops.ts', import.meta.url), 'utf8');
const start = src.indexOf('export const OFFICES');
const body = src.slice(start, src.indexOf('];', start));

const str = (line, key) => {
  const m = line.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1].replace(/\\'/g, "'") : undefined;
};

const rows = [];
let n = 0;
for (const line of body.split('\n')) {
  const name = str(line, 'name');
  if (!name || !line.includes('city:')) continue;
  rows.push({
    seedId:  `O${String(++n).padStart(2, '0')}`,
    name,
    type:    str(line, 'type')    ?? 'Remote',
    city:    str(line, 'city')    ?? '',
    country: str(line, 'country') ?? 'India',
    status:  str(line, 'status')  ?? 'planned',
    purpose: str(line, 'purpose'),
    notes:   str(line, 'notes'),
  });
}

if (rows.length === 0) {
  console.error('Parsed 0 offices — the literal format changed. Aborting rather than seeding nothing.');
  process.exit(1);
}
console.log(`Parsed ${rows.length} offices from src/lib/ops.ts`);

const prod = process.argv.includes('--prod');
const args = ['convex', 'run', ...(prod ? ['--prod'] : []), 'offices:seedFromStatic', JSON.stringify({ rows })];
console.log(execFileSync('npx', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim());
