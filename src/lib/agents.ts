/**
 * Open roles per venture, and the seed source for the agents table.
 *
 * Agents used to be served straight out of this file, which is why every
 * venture but Llife read "0 agents" on the Team page — adding one meant editing
 * code and redeploying. They live in Convex now (src/convex/agents.ts); what
 * remains here is the one-time seed and the open-roles list, which has no table
 * of its own yet (real roles live in `positions`).
 *
 * The legacy `model` and `tools` fields do not survive the migration. `model`
 * named models this deployment has no key for ('claude-3-5-haiku'), and `tools`
 * held descriptive labels ('Volume Surge', 'domain_review') rather than HQ tool
 * names — seeded agents therefore start with an empty allowlist and are granted
 * tools deliberately, in the form.
 */

export interface LegacyAgent {
  name: string; emoji: string; color: string; type: string;
  model: string; tf: string[]; role: string; tools: string[];
}

export const VENTURE_DATA: Record<string, { agents: LegacyAgent[]; openRoles: string[] }> = {
  // One venture now. The agents below were HubCV's and Nanotrade's — those
  // systems are still running, so their agents are documented here under Llife
  // rather than dropped. Roborns and Franchiseen had none; their open roles
  // were hiring plans for ventures that no longer exist separately.
  Llife: {
    agents: [
{
        name: 'Llife Daily', emoji: '🗓️', color: '#a5a5a5',
        type: 'Claude Agent', model: 'claude-3-5-haiku',
        tf: ['daily'],
        role: 'Personal life agent — reviews the day across Finances, Education, Earnings, Mind and Body, flags what slipped, and prepares tomorrow\u2019s time blocks.',
        tools: ['domain_review', 'net_worth_rollup', 'streak_tracking', 'daily_briefing'],
      },
{
        name: 'HubCV Matcher', emoji: '🔍', color: '#b5b5b5',
        type: 'Claude Agent', model: 'claude-3-5-haiku',
        tf: ['async'],
        role: 'Analyzes professional profiles against recruiter requirements using Anthropic SDK. Scores match quality, identifies skill gaps, and surfaces upskilling recommendations.',
        tools: ['profile_analysis', 'skill_scoring', 'job_matching', 'gap_detection'],
      },
{ name: 'Alpha', emoji: '🔴', color: '#9d9d9d', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Aggressive UP-biased trader. Strong in breakout and bullish continuation regimes.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Sigma', emoji: '🔵', color: '#a5a5a5', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Balanced risk manager. Reads regime before committing direction. Holds more than most.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Delta', emoji: '🟢', color: '#dbdbdb', type: 'Claude Agent', model: 'claude-3-5-haiku', tf: ['5m', '15m'], role: 'Contrarian fade specialist. Hunts overextended moves and fades them with RSI + VWAP.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Lisa',      emoji: '🟡', color: '#b5b5b5', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Volume Surge specialist. Trades breakout candles when volume spikes above baseline.',         tools: ['Volume Surge', 'VWAP Reclaim'] },
      { name: 'Bart',      emoji: '🟠', color: '#adadad', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Momentum Break hunter. Enters when price breaks out of recent range with directional force.', tools: ['Momentum Break', 'Volume Surge', 'Liquidity Sweep Reversal'] },
      { name: 'Marge',     emoji: '🔵', color: '#c8c8c8', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'VWAP Reclaim trader. Buys or sells when price reclaims VWAP with supporting volume.',       tools: ['VWAP Reclaim', 'RSI Reversal'] },
      { name: 'Homer',     emoji: '🟡', color: '#b5b5b5', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'RSI Reversal fader. Looks for overstretched moves and fades them at RSI extremes.',           tools: ['RSI Reversal'] },
      { name: 'Mr Burns',  emoji: '⚫', color: 'var(--muted)', type: 'Strategy Agent', model: 'Rules-based', tf: ['1h', '4h'],  role: 'Trend Ride player. Follows sustained directional moves using MA slope and higher highs/lows.',  tools: ['Trend Ride', 'Trend Pullback', 'Volume Surge'] },
      { name: 'Nelson',    emoji: '🔴', color: '#9d9d9d', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Aggressive downside hunter. Best at sharp downside continuation and trap reversals.',         tools: ['Liquidity Sweep Reversal', 'Momentum Break', 'RSI Reversal'] },
      { name: 'Maggie',    emoji: '🟣', color: '#eeeeee', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'AntiRekt Trend Oscillator — SMMA jaw/lips crossover. Avoids breakout and chaos regimes.',     tools: ['AntiRekt Trend Oscillator'] },
      { name: 'Milhouse',  emoji: '🔵', color: '#a5a5a5', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Cautious trend follower. Reliable in clean trends, timid after failures.',                   tools: ['Trend Ride', 'VWAP Reclaim'] },
      { name: 'Apu',       emoji: '🟢', color: '#dbdbdb', type: 'Strategy Agent', model: 'Rules-based', tf: ['5m', '15m'], role: 'Multi-strategy opportunist. Avoids chaos regimes. Picks the strongest signal available.',    tools: ['Volume Surge', 'Momentum Break', 'VWAP Reclaim'] },
      { name: 'Multi-Bot', emoji: '⚙️', color: '#eeeeee', type: 'Execution Bot',  model: 'Node.js',     tf: ['5m', '15m'], role: 'Core multi-exchange execution engine. Routes orders across Binance, Bybit, OKX.',           tools: ['Order execution', 'Balance management', 'Multi-exchange routing'] },
      { name: 'TV Bot',    emoji: '📺', color: '#adadad', type: 'Feed Bot',       model: 'Python 3',    tf: ['5m', '15m'], role: 'Processes live market signals and pushes to TV dashboard via /webhook/5m and /webhook/15m.', tools: ['Webhook ingestion', 'Signal broadcast', 'TV feed'] },
      { name: 'Spot Bot',  emoji: '🎯', color: '#b5b5b5', type: 'Execution Bot',  model: 'Python 3',    tf: ['live'],      role: 'Automated spot trade execution. Monitors signals and places spot orders autonomously.',        tools: ['Spot execution', 'Balance tracking', 'Signal monitoring'] }
    ],
    openRoles: ['Integrations Engineer', 'Product Engineer (Mobile)', 'Privacy & Compliance Lead'],
  },
};

/** Open roles listed against a venture. Empty for a venture with none. */
export function openRolesFor(venture: string): string[] {
  return VENTURE_DATA[venture]?.openRoles ?? [];
}

/**
 * A stable slug for an agent name.
 *
 * Kept because task assignments minted before the migration stored one of
 * these in `assigneeId`. agents:relinkAssignments repoints those at real
 * document ids; this is what they are being migrated *from*.
 */
export const agentId = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** The literals above, flattened into the shape agents:seedFromStatic takes. */
export function agentSeedRows() {
  return Object.entries(VENTURE_DATA).flatMap(([venture, data]) =>
    data.agents.map((a) => ({
      seedId: `${agentId(venture)}-${agentId(a.name)}`,
      venture,
      name: a.name,
      emoji: a.emoji,
      color: a.color,
      type: a.type,
      role: a.role,
      // Gemini is the provider this deployment is actually keyed for; the old
      // `model` strings named models it cannot reach.
      provider: 'gemini' as const,
      tools: [] as string[],
      tf: a.tf,
    })),
  );
}
