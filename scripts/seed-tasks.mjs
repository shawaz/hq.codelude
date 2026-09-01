/**
 * Seed the Convex `tasks` table from the static array in src/lib/tasks.ts.
 *
 * Convex functions cannot import from src/lib, so the rows are read here and
 * passed in. Idempotent — seedFromStatic skips any seedId already present, so
 * re-running after a partial batch is safe.
 *
 *   node scripts/seed-tasks.mjs            # dev deployment
 *   node scripts/seed-tasks.mjs --prod     # production
 */
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const src = readFileSync(new URL('../src/lib/tasks.ts', import.meta.url), 'utf8');
const body = src.slice(src.indexOf('export const SEED_TASKS'));

// The array is a flat list of single-line object literals; parse the fields we
// need rather than pulling in a TS toolchain for one script.
const rows = [];
for (const line of body.split('\n')) {
  const m = line.match(
    /\{\s*id:\s*'([^']+)',\s*project:\s*'([^']+)',\s*category:\s*'([^']+)',\s*priority:\s*'([^']+)',\s*status:\s*'([^']+)',\s*title:\s*'((?:[^'\\]|\\.)*)'/,
  );
  if (!m) continue;
  rows.push({
    seedId: m[1], project: m[2], category: m[3],
    priority: m[4], status: m[5],
    title: m[6].replace(/\\'/g, "'").replace(/\\\\/g, '\\'),
  });
}

if (rows.length === 0) {
  console.error('Parsed 0 tasks — the literal format changed. Aborting rather than seeding nothing.');
  process.exit(1);
}
console.log(`Parsed ${rows.length} tasks from src/lib/tasks.ts`);

const prod = process.argv.includes('--prod');
const args = ['convex', 'run', ...(prod ? ['--prod'] : []), 'tasks:seedFromStatic', JSON.stringify({ rows })];
const out = execFileSync('npx', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
console.log(out.trim());
