/**
 * Open roles per venture, and the seed source for the agents table.
 *
 * Agents used to be served straight out of this file, which is why every
 * venture but Llife read "0 agents" on the Team page — adding one meant editing
 * code and redeploying. They live in Convex now (src/convex/agents.ts); what
 * remains here is the one-time seed and the open-roles list, which has no table
 * of its own yet (real roles live in `positions`).
 */

export interface LegacyAgent {
  name: string; emoji: string; color: string; type: string;
  model: string; tf: string[]; role: string; tools: string[];
}

export const VENTURE_DATA: Record<string, { agents: LegacyAgent[]; openRoles: string[] }> = {
  Codelude: {
    agents: [
      {
        name: 'Smithers',
        emoji: '👓',
        color: '#eeeeee',
        type: 'Executive Assistant',
        model: 'gemini-2.5-flash',
        tf: ['realtime', 'daily'],
        role: 'Company-level executive assistant, VPS backend agent (+91 888 444 9055 Baileys WhatsApp gateway), and primary OS3 / Rabbit R1 interface for Shawaz & Codelude HQ.',
        tools: ['vps_management', 'whatsapp_gateway', 'repo_sync', 'executive_ops', 'task_management'],
      },
    ],
    openRoles: ['Chief of Staff', 'Infrastructure Lead'],
  },
  Llife: {
    agents: [
      {
        name: 'Agent L',
        emoji: '⌚',
        color: '#a5a5a5',
        type: 'Ambient Orchestrator',
        model: 'gemini-2.5-pro',
        tf: ['realtime', 'daily'],
        role: 'Always-on master intelligence for llife.app wearable & mobile platform. Intercepts multimodal audio/vision streams, processes context via Gemini, and dynamically spawns sub-agents (Agent S, Agent M, Agent A).',
        tools: ['multimodal_stream', 'subagent_spawning', 'voice_tts', 'vision_capture'],
      },
      {
        name: 'Agent A',
        emoji: '📊',
        color: '#9d9d9d',
        type: 'Analyst Agent',
        model: 'gemini-2.5-flash',
        tf: ['daily', 'async'],
        role: 'Financial modeling, Solana/Dextrip trading metric audits, web automation via CDP/browser control, and automated web scrapers for llife.app & Codelude HQ.',
        tools: ['financial_audit', 'cdp_browser_automation', 'web_scraping'],
      },
      {
        name: 'Agent S',
        emoji: '📅',
        color: '#a5a5a5',
        type: 'Planner Agent',
        model: 'gemini-2.5-flash',
        tf: ['daily'],
        role: 'Strategic Life Planner for llife.app. Translates long-term goals into daily time blocks across the 5 Life Domains (Finances, Education, Earnings, Mind, Body).',
        tools: ['domain_review', 'time_blocking', 'routine_learning'],
      },
      {
        name: 'Agent M',
        emoji: '🧠',
        color: '#b5b5b5',
        type: 'Wellness Agent',
        model: 'gemini-2.5-flash',
        tf: ['daily'],
        role: 'Mind & Body Wellness Monitor for llife.app. Tracks sleep, exercise, diet, mindfulness, and habits via HealthKit and Google Health Connect.',
        tools: ['health_sync', 'streak_tracking', 'mindfulness_nudges'],
      },
      {
        name: 'Llife Daily',
        emoji: '🗓️',
        color: '#a5a5a5',
        type: 'Claude Agent',
        model: 'gemini-2.5-flash',
        tf: ['daily'],
        role: 'Personal life agent — reviews the day across Finances, Education, Earnings, Mind and Body, flags what slipped, and prepares tomorrow’s time blocks.',
        tools: ['domain_review', 'net_worth_rollup', 'streak_tracking', 'daily_briefing'],
      },
    ],
    openRoles: ['Integrations Engineer', 'Product Engineer (Mobile)', 'Privacy & Compliance Lead'],
  },
  HubCV: {
    agents: [
      {
        name: 'Marge',
        emoji: '🔵',
        color: '#b5b5b5',
        type: 'Strategy Agent',
        model: 'gemini-2.5-flash',
        tf: ['async', 'daily'],
        role: 'HubCV AI Career & Talent Assistant. Manages Living Resume scoring, OpenRouter ATS resume matching, Dehradun campus campaign onboarding (Aman ₹1.5L blitz across UPES, GEHU, DIT), and candidate screening.',
        tools: ['resume_scoring', 'ats_matching', 'campus_campaign', 'candidate_vetting'],
      },
      {
        name: 'HubCV Matcher',
        emoji: '🔍',
        color: '#b5b5b5',
        type: 'Claude Agent',
        model: 'gemini-2.5-flash',
        tf: ['async'],
        role: 'Analyzes professional profiles against recruiter requirements using Anthropic SDK. Scores match quality, identifies skill gaps, and surfaces upskilling recommendations.',
        tools: ['profile_analysis', 'skill_scoring', 'job_matching', 'gap_detection'],
      },
    ],
    openRoles: ['AI / ML Engineer', 'Campus Outreach Manager', 'Recruiter Success Manager'],
  },
  Franchiseen: {
    agents: [
      {
        name: 'Homer',
        emoji: '🟡',
        color: '#c8c8c8',
        type: 'Strategy Agent',
        model: 'gemini-2.5-flash',
        tf: ['async', 'daily'],
        role: 'Franchiseen AI Business & Marketplace Assistant. Handles brand franchisor onboarding, franchise ROI analytics, location search, and EAS preview APK / Google Play deployment pipelines.',
        tools: ['franchise_analytics', 'eas_build_trigger', 'location_discovery', 'deal_tracking'],
      },
    ],
    openRoles: ['Franchise Partnership Manager', 'Platform Engineer (Fullstack)', 'Investment Legal Counsel'],
  },
  Roborns: {
    agents: [
      {
        name: 'Lisa',
        emoji: '🎷',
        color: '#dbdbdb',
        type: 'Strategy Agent',
        model: 'gemini-2.5-flash',
        tf: ['async', 'daily'],
        role: 'Roborns Coastal AI Infrastructure & Site Projects Assistant. Manages coastal site feasibility, seawater cooling/desalination thermodynamics, land restoration analytics, and site project boundaries.',
        tools: ['coastal_analysis', 'site_boundary_drawing', 'feasibility_calc'],
      },
    ],
    openRoles: ['Thermal Engineering Lead', 'Government Liaison (CRZ / MESCOM)', 'Site Survey Coordinator'],
  },
  Nanotrade: {
    agents: [
      {
        name: 'Bart',
        emoji: '🟠',
        color: '#adadad',
        type: 'Strategy Agent',
        model: 'gemini-2.5-flash',
        tf: ['5m', '15m'],
        role: 'Dextrip Solana Trading & Momentum Driver Agent. Hunts breakout trades, monitors liquidity sweeps, and tracks high-slippage transactions.',
        tools: ['solana_trading', 'momentum_break', 'liquidity_sweep'],
      },
      { name: 'Alpha', emoji: '🔴', color: '#9d9d9d', type: 'Claude Agent', model: 'gemini-2.5-flash', tf: ['5m', '15m'], role: 'Aggressive UP-biased trader. Strong in breakout and bullish continuation regimes.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Sigma', emoji: '🔵', color: '#a5a5a5', type: 'Claude Agent', model: 'gemini-2.5-flash', tf: ['5m', '15m'], role: 'Balanced risk manager. Reads regime before committing direction. Holds more than most.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Delta', emoji: '🟢', color: '#dbdbdb', type: 'Claude Agent', model: 'gemini-2.5-flash', tf: ['5m', '15m'], role: 'Contrarian fade specialist. Hunts overextended moves and fades them with RSI + VWAP.', tools: ['get_market_data', 'get_polymarket_prices', 'get_resolved_windows', 'get_session_performance', 'make_decision'] },
      { name: 'Mr Burns', emoji: '⚫', color: '#7a7870', type: 'Strategy Agent', model: 'gemini-2.5-flash', tf: ['1h', '4h'], role: 'Trend Ride player. Follows sustained directional moves using MA slope and higher highs/lows.', tools: ['Trend Ride', 'Trend Pullback', 'Volume Surge'] },
      { name: 'Multi-Bot', emoji: '⚙️', color: '#eeeeee', type: 'Execution Bot', model: 'gemini-2.5-flash', tf: ['5m', '15m'], role: 'Core multi-exchange execution engine. Routes orders across Binance, Bybit, OKX.', tools: ['Order execution', 'Balance management', 'Multi-exchange routing'] },
    ],
    openRoles: ['Quant Developer', 'Creator Programme Lead'],
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
      provider: 'gemini' as const,
      tools: a.tools ?? [],
      tf: a.tf,
    })),
  );
}
