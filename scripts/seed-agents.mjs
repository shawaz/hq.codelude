/**
 * Seed the Convex `agents` table from the literals in src/lib/agents.ts.
 * Idempotent on seedId.
 *
 *   node --experimental-strip-types scripts/seed-agents.mjs [--prod]
 *
 * Unlike the older seed scripts, this does not regex the TypeScript source.
 * src/lib/agents.ts exports agentSeedRows() for exactly this, and Node 22 can
 * import a .ts module directly with --experimental-strip-types — so the seed
 * and the app read the same function rather than one parsing the other.
 *
 * Afterwards, repoint any task assigned to an agent at its new document id:
 *   npx convex run agents:relinkAssignments '{}'
 */
import { execFileSync } from 'node:child_process';

const { agentSeedRows } = await import('../src/lib/agents.ts');
const rows = agentSeedRows();

if (rows.length === 0) {
  console.error('Parsed 0 agents — the literal format changed. Aborting rather than seeding nothing.');
  process.exit(1);
}
console.log(`Parsed ${rows.length} agents from src/lib/agents.ts`);

const prod = process.argv.includes('--prod');
const args = ['convex', 'run', ...(prod ? ['--prod'] : []), 'agents:seedFromStatic', JSON.stringify({ rows })];
console.log(execFileSync('npx', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 }).trim());
