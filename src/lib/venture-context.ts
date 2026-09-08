/**
 * Per-venture facts injected into the AI assistant's system prompt.
 *
 * Facts only — how the assistant engages lives in src/lib/mentor-persona.ts and
 * is prepended to all of these. Adding tone instructions back here would give
 * each venture a slightly different personality.
 *
 * SERVER ONLY — imported by src/app/api/chat/route.ts and nothing else. This
 * used to live inside the "use client" dashboard page, which meant all five
 * ventures shipped in the JS bundle and any signed-in member could read them
 * straight out of the browser, whatever the API allowed. Keep it off the client.
 */
export const VENTURE_CONTEXT: Record<string, string> = {

  Llife: `You are helping Shawaz work on LLIFE — an AI personal assistant at llife.app that manages a user's day-to-day life across five domains: Finances, Education, Earnings, Mind and Body.

KEY FACTS:
- Education pulls from the HubCV API; Earnings pulls from the Nanotrade (job, crypto, stocks) and Franchiseen (franchise) APIs
- AI learns routines + acts proactively — NOT just remote control
- Revenue: Hub hardware ($499, 35% margin) + AI subscription ($29/month, 85% margin)
- Hardware MOQ: $300K first production run
- B2B channel: property developer pre-installation agreements
- Protocol spec complete (published April 2026)
- Needs: integrations engineer, mobile product engineer, Account Aggregator approval for financial data
- Y5 revenue: $8.95M
`,
};
