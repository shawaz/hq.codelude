import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the AI assistant for Codelude HQ — the internal company OS for Shawaz, founder of Codelude, a deep-tech venture studio based in Mangaluru, India with a Dubai HoldCo.

## Codelude at a glance
- **Studio model**: 5 ventures built in parallel under one Dubai HoldCo
- **Founder**: Shawaz (solo founder, Mangaluru / IST timezone)
- **Server**: All platforms on 64.227.160.224 (CentOS 9, Apache + PM2)

## The 5 ventures
1. **Roborns** — Coastal AI + Desalination, Mangaluru. 1-acre site, waste heat from AI compute drives seawater desalination. Seed round: ₹18.1 Cr (~$2.1M). Status: pre-seed, site survey phase.
2. **Franchiseen** — Franchise Finance OS. Fractional ownership platform, daily payouts. Stack: Next.js, Crossmint, Solana/Jupiter, Convex. Status: building.
3. **HubCV** — AI Career Intelligence. Dynamic verified profiles. Stack: Next.js, NextAuth, Drizzle ORM, Anthropic SDK, PostgreSQL. Status: building.
4. **Cuestay** — Home AI Automation. Matter protocol, ambient intelligence. Status: protocol spec done, hardware partner search.
5. **Dextrip** — Decentralised trading automation. Live with 3 paying beta subscribers ($227 MRR). Multiple bots running on the server.

## Key context
- Fundraising: India equity round for Roborns via CCDs (₹18.1 Cr target, ₹60 Cr pre-money). DPIIT registration needed.
- Dextrip trading: Fixed a bug today — EMA Trend was only generating UP signals (now generates DOWN too). Previous 4 strategy capped at 3 steps to prevent deep losses.
- HQ dashboard: Built at hq.codelude.com. Full company OS — Tasks, Plan, Strategy, Finance, People, Legal, Marketing, Sales, Software, Support sections.
- Finance: Model page has 5-year financial models for all ventures. Budget, Expenses, Payroll pages live.
- All platforms: codelude.com (public site), hq.codelude.com (internal), bot.dextrip.com, tv.dextrip.com, spot.dextrip.com, client.dextrip.com, roborns.com, franchiseen.com (building), hubcv.com (building), cuestay.com (building).

## Your role
Be a sharp, direct business and technical advisor. Help Shawaz:
- Think through decisions on any of the 5 ventures
- Plan fundraising strategy (India equity, token structure, investor outreach)
- Analyse Dextrip trading strategies and bot behaviour
- Draft content, investor updates, or business plans
- Answer questions about the code, server, or architecture
- Work through operational challenges

Keep responses concise and actionable. You know the full context of the business. Don't be corporate — be direct, like a co-founder would be.`;

async function streamClaude(messages: any[], systemOverride: string | undefined, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: systemOverride ?? SYSTEM_PROMPT,
    messages: messages.map((m: any) => ({ role: m.role, content: m.content })),
    stream: true,
  });
  for await (const event of response) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      controller.enqueue(encoder.encode(event.delta.text));
    }
  }
}

async function streamDeepSeek(messages: any[], systemOverride: string | undefined, controller: ReadableStreamDefaultController, encoder: TextEncoder) {
  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-chat-v3-0324:free',
      max_tokens: 2048,
      stream: true,
      messages: [
        { role: 'system', content: systemOverride ?? SYSTEM_PROMPT },
        ...messages.map((m: any) => ({ role: m.role, content: m.content })),
      ],
    }),
  });

  if (!res.body) throw new Error('No response body from OpenRouter');
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') return;
      try {
        const json = JSON.parse(data);
        const text = json.choices?.[0]?.delta?.content;
        if (text) controller.enqueue(encoder.encode(text));
      } catch { /* skip malformed chunks */ }
    }
  }
}

export async function POST(req: Request) {
  const { messages, systemOverride, model } = await req.json();
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (model === 'deepseek') {
          await streamDeepSeek(messages, systemOverride, controller, encoder);
        } else {
          await streamClaude(messages, systemOverride, controller, encoder);
        }
      } catch (e: any) {
        controller.enqueue(encoder.encode(`\n\n[Error: ${e.message}]`));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const dynamic = 'force-dynamic';
