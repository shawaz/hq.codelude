/**
 * Seed the Convex `positions` table from src/lib/people.ts.
 *
 * Same shape as scripts/seed-tasks.mjs — Convex functions cannot import from
 * src/lib, so the rows are parsed here and passed in. Idempotent on seedId.
 *
 *   node scripts/seed-positions.mjs            # dev
 *   node scripts/seed-positions.mjs --prod     # production
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const src = readFileSync(new URL('../src/lib/people.ts', import.meta.url), 'utf8');
const body = src.slice(src.indexOf("export const SEED_POSITIONS"), src.indexOf('export const APPLICATIONS'));

const str = (line, key) => {
  const m = line.match(new RegExp(`${key}:\\s*'((?:[^'\\\\]|\\\\.)*)'`));
  return m ? m[1].replace(/\\'/g, "'") : undefined;
};

const rows = [];
for (const line of body.split('\n')) {
  const seedId = str(line, 'id');
  if (!seedId || !/^P\d+$/.test(seedId)) continue;
  const skillsRaw = line.match(/keySkills:\s*\[([^\]]*)\]/);
  rows.push({
    seedId,
    title:       str(line, 'title'),
    department:  str(line, 'department') ?? 'General',
    venture:     str(line, 'venture')    ?? 'Codelude',
    type:        str(line, 'type')       ?? 'Full-time',
    status:      str(line, 'status')     ?? 'open',
    priority:    str(line, 'priority')   ?? 'medium',
    targetStart: str(line, 'targetStart'),
    location:    str(line, 'location'),
    keySkills:   skillsRaw ? [...skillsRaw[1].matchAll(/'((?:[^'\\]|\\.)*)'/g)].map(m => m[1].replace(/\\'/g, "'")) : [],
    notes:       str(line, 'notes'),
  });
}

if (rows.length === 0) {
  console.error('Parsed 0 positions — the literal format changed. Aborting rather than seeding nothing.');
  process.exit(1);
}
console.log(`Parsed ${rows.length} positions from src/lib/people.ts`);

const prod = process.argv.includes('--prod');
const args = ['convex', 'run', ...(prod ? ['--prod'] : []), 'positions:seedFromStatic', JSON.stringify({ rows })];
console.log(execFileSync('npx', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim());
