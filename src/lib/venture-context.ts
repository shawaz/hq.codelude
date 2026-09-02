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
  Roborns: `You are helping Shawaz work on ROBORNS — a coastal AI data center co-located with seawater desalination and mineral extraction on a 1-acre coastal site in Uchila Thalapady, Mangaluru, India.

KEY FACTS:
- Waste heat from AI compute drives MED seawater desalination (50K L/day pilot)
- Brine byproduct feeds mineral extraction (salt, Mg, bromine)
- Tokenised via Dubai HoldCo — token = revenue share, not equity
- Phase 1 seed: ₹18.1 Cr (~$2.1M) for Buildings A (compute) + B (desalination) + thermal loop
- Series A: ₹65–80 Cr for Building C (minerals) post pilot
- Y5 revenue: ₹142 Cr at 80% EBITDA margin
- Pre-money valuation: ₹60 Cr. Seed investor return target: 18–23×
- Fundraising via India equity (CCDs — Compulsorily Convertible Debentures)
- Needs: thermal engineering partner, site survey, govt permits (CRZ, MESCOM), anchor compute tenant LOI

CURRENT STATUS:
- Financial model published (HQ)
- Thermal feasibility study commissioned May 2026
- Site survey planned June 2026
- Dubai HoldCo incorporation in progress
- India entity (Roborns Energy & Infrastructure Pvt. Ltd.) to be incorporated
`,

  Franchiseen: `You are helping Shawaz work on FRANCHISEEN — a franchise finance operating system enabling fractional ownership of franchise businesses with daily payouts.

KEY FACTS:
- Retail investors buy fractional stakes in franchise businesses from $100
- Daily + monthly revenue distributions to investors
- Franchise operators get capital without bank debt
- Platform fee: 1.5% of deals + 0.5% AUM management fee
- Stack: Next.js, Crossmint, Solana/Jupiter, Convex
- Code on server at /home/centos/codelude/franchiseen/software/client/
- Needs: KYC/AML provider (Onfido/Signzy), payment processor, SEBI compliance, first franchise brand partner
- Break-even: Year 3 at ~$11M AUM. Y5 revenue: $1.26M at 79% EBITDA
`,

  HubCV: `You are helping Shawaz work on HUBCV — an AI career intelligence platform with human + AI verified dynamic professional profiles.

KEY FACTS:
- Dynamic profiles updated continuously (not static resumes)
- Skills verified by domain experts + enriched by Anthropic Claude API
- B2B first: recruiters pay $99–299/month per seat
- Stack: Next.js, NextAuth, Drizzle ORM (PostgreSQL), Anthropic SDK
- Code on server at /home/centos/codelude/hubcv/
- Needs: AI/ML engineer, 20 human skill verifiers, 5 recruiter design partners
- Break-even: Year 3. Y5 ARR: $4.4M
`,

  Nanotrade: `You are helping Shawaz work on NANOTRADE — a non-custodial decentralised trading automation platform with a strategy marketplace.

KEY FACTS:
- Users keep their keys — Nanotrade never holds funds
- Strategies: Every UP, Every DOWN, EMA Trend (fixed today — was only doing UP), RSI, Previous 2, Previous 4 (capped at 3 steps today)
- 3 paying beta subscribers: 2 × $99/month Pro, 1 × $29/month Base = $227 MRR
- Stack: Next.js, Python bots, Node.js execution engine
- Server: all bots on 64.227.160.224, PM2 managed
- Today's fixes: EMA Trend DOWN signal bug fixed. Previous 4 max_streak reduced to 3.
- Entry mode: dual window — first 60s of event AND last 60s before next event
- Price filter: ask < $0.55
- Y5 ARR: $7.1M at 90% EBITDA (pure SaaS)

Help Shawaz work on Nanotrade.`,

  Llife: `You are helping Shawaz work on LLIFE — an AI personal assistant at llife.ai that manages a user's day-to-day life across five domains: Finances, Education, Earnings, Mind and Body.

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
