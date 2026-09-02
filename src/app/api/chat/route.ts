import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { requireApiUser } from '@/lib/api-auth';
import { isUnrestricted, venturesForUser } from '@/lib/nav';
import { ALL_SCOPE_NAMES } from '@/lib/ventures';
import { VENTURE_CONTEXT } from '@/lib/venture-context';
import { MENTOR_PERSONA } from '@/lib/mentor-persona';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { TOOL_SPECS, TOOL_PROMPT, executeTool } from '@/lib/ai-tools';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the AI assistant for Codelude HQ — the internal company OS for Shawaz, founder of Codelude, a deep-tech venture studio based in Mangaluru, India with a Dubai HoldCo.

## Codelude at a glance
- **Studio model**: 5 ventures built in parallel under one Dubai HoldCo
- **Founder**: Shawaz (solo founder, Mangaluru / IST timezone)
- **Server**: All platforms on 64.227.160.224 (CentOS 9, Apache + PM2)

## The 5 ventures
1. **Roborns** — Coastal AI + Desalination, Mangaluru. 1-acre site, waste heat from AI compute drives seawater desalination. Seed round: ₹18.1 Cr (~$2.1M). Status: pre-seed, site survey phase.
2. **Franchiseen** — AI Business Assistant. Fractional ownership platform, daily payouts. Stack: Next.js, Crossmint, Solana/Jupiter, Convex. Status: building.
3. **HubCV** (hubcv.pro) — AI Career Assistant. Skill-verified profiles, hubs, rooms and feed. Stack: Next.js 16, React 19, Convex, Convex Auth, Capacitor. Status: live.
4. **Llife** (llife.ai) — AI Life Assistant. Five domains (Finances, Education, Earnings, Mind, Body) on a daily time-block board, fed by the HubCV (education), Nanotrade (job/crypto/stocks) and Franchiseen (franchise) APIs. Status: domain spec done, integrations in build.
5. **Nanotrade** — AI Trading Assistant. Live with 3 paying beta subscribers ($227 MRR). Multiple bots running on the server.

## Key context
- Fundraising: India equity round for Roborns via CCDs (₹18.1 Cr target, ₹60 Cr pre-money). DPIIT registration needed.
- Nanotrade trading: Fixed a bug today — EMA Trend was only generating UP signals (now generates DOWN too). Previous 4 strategy capped at 3 steps to prevent deep losses.
- HQ dashboard: Built at hq.codelude.com. Full company OS — Tasks, Plan, Strategy, Finance, People, Legal, Marketing, Sales, Software, Support sections.
- Finance: Model page has 5-year financial models for all ventures. Budget, Expenses, Payroll pages live.
- All platforms: codelude.com (public site), hq.codelude.com (internal), bot.nanotrade.com, tv.nanotrade.com, spot.nanotrade.com, client.nanotrade.com, roborns.com, franchiseen.com (building), hubcv.pro (live), llife.ai (building).

## What he brings to you
- Decisions across any of the 5 ventures
- Fundraising strategy (India equity, token structure, investor outreach)
- Nanotrade trading strategy and bot behaviour
- Drafts: content, investor updates, business plans
- Code, server and architecture questions
- Operational problems

You have the full context above. Use it — reference the actual numbers and
constraints rather than talking in generalities.`;

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

/** Providers that speak the OpenAI chat-completions dialect. */
const OPENAI_COMPATIBLE = {
  deepseek: {
    url: 'https://openrouter.ai/api/v1/chat/completions',
    keyEnv: 'OPENROUTER_API_KEY',
    label: 'DeepSeek Flash',
    models: ['deepseek/deepseek-chat-v3-0324:free'],
    maxTokens: 2048,
  },
  opencode: {
    // OpenCode Zen gateway — OpenAI-compatible endpoint.
    url: 'https://opencode.ai/zen/v1/chat/completions',
    keyEnv: 'OPENCODE_API_KEY',
    label: 'Big Pickle',
    // big-pickle is a free-tier model and returns 429 FreeUsageLimitError once
    // the quota is hit. These alternates run on the same key, so we fail over
    // rather than dead-ending the page. All verified reachable.
    models: [
      'big-pickle',                  // preferred default
      'nemotron-3-ultra-free',       // healthy as of 24 Aug 2026
      'hy3-free',
      'nemotron-3.5-lightning-free',
      'x-preview-f-free',            // intermittent 503s
      'mimo-v2.5-free',              // free quota often exhausted
    ],
    // big-pickle is a reasoning model: it streams `reasoning_content` deltas
    // before any `content`. Reasoning shares the max_tokens budget, so a 2048
    // cap can be spent entirely on thinking and return an empty answer
    // (finish_reason "length"). Give it room.
    maxTokens: 8192,
  },
} as const;

type OpenAIProvider = keyof typeof OPENAI_COMPATIBLE;

/**
 * A model that returns 429 has spent its free quota — that state lasts minutes
 * to hours, not milliseconds. Re-requesting it on every message would add a
 * guaranteed-failed round-trip to each one, so park it briefly and move on.
 * Best-effort only: serverless instances are ephemeral, so this shrinks the
 * wasted calls rather than eliminating them.
 */
const COOLDOWN_MS = 10 * 60 * 1000;
const cooling = new Map<string, number>();

const isCooling = (model: string) => {
  const until = cooling.get(model);
  if (until === undefined) return false;
  if (Date.now() >= until) { cooling.delete(model); return false; }
  return true;
};

/**
 * Model used when tools are in play.
 *
 * The gateway's default, big-pickle, is a free-tier model that returns
 * FreeUsageLimitError under load — and a tool loop costs three to five requests
 * per answer rather than one, so it exhausts that quota far faster than plain
 * chat does. nemotron-3-ultra-free is the sibling verified to return
 * tool_calls, so tool turns run there and fall back to the normal chain if it
 * refuses.
 */
const TOOL_MODEL = 'nemotron-3-ultra-free';

/** A tool loop that never terminates is a bill. Four rounds is plenty. */
const MAX_TOOL_ROUNDS = 4;

interface ToolCall { id: string; function: { name: string; arguments: string } }

/**
 * Let the model pull HQ data (and make the changes it is asked to) before it
 * answers.
 *
 * Runs non-streaming, because a tool call has to complete before the next turn
 * can start. The final answer is streamed by the normal path afterwards, so the
 * client interface is unchanged — it still just reads text.
 *
 * Returns the message list to hand to the streaming call, with tool results
 * appended, or null if the model asked for no tools at all.
 */
async function runToolLoop(
  url: string,
  apiKey: string,
  system: string,
  messages: any[],
  token: string | undefined,
): Promise<{ messages: any[]; wrote: string[] } | null> {
  const convo: any[] = [
    { role: 'system', content: `${system}\n\n${TOOL_PROMPT}` },
    ...messages.map((m: any) => ({ role: m.role, content: m.content })),
  ];
  const wrote: string[] = [];
  let usedAnyTool = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TOOL_MODEL,
        max_tokens: 4096,
        messages: convo,
        tools: TOOL_SPECS,
      }),
    });

    // Rate limit or refusal: fall through to plain chat rather than dead-ending.
    if (!res.ok) return usedAnyTool ? { messages: convo, wrote } : null;

    const json = await res.json().catch(() => null);
    const msg = json?.choices?.[0]?.message;
    const calls: ToolCall[] | undefined = msg?.tool_calls;
    if (!calls?.length) return usedAnyTool ? { messages: convo, wrote } : null;

    usedAnyTool = true;
    convo.push(msg);

    for (const call of calls) {
      const result = await executeTool(call.function.name, call.function.arguments, token);
      if (result.wrote) wrote.push(result.content);
      convo.push({ role: 'tool', tool_call_id: call.id, name: result.name, content: result.content });
    }
  }

  return { messages: convo, wrote };
}

async function streamOpenAICompatible(
  provider: OpenAIProvider,
  messages: any[],
  systemOverride: string | undefined,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  /** Conversation from the tool loop, already carrying its system turn and tool results. */
  prepared?: any[],
) {
  const cfg = OPENAI_COMPATIBLE[provider];
  const apiKey = process.env[cfg.keyEnv];
  if (!apiKey) {
    throw new Error(`${cfg.label} is not configured — set ${cfg.keyEnv}`);
  }

  const body = (model: string) => JSON.stringify({
    model,
    max_tokens: cfg.maxTokens,
    stream: true,
    messages: prepared ?? [
      { role: 'system', content: systemOverride ?? SYSTEM_PROMPT },
      ...messages.map((m: any) => ({ role: m.role, content: m.content })),
    ],
  });

  // Rate limits and upstream blips are worth retrying on a sibling model;
  // 4xx auth/validation errors are not.
  const retryable = (status: number) => status === 429 || status >= 500;

  let res: Response | undefined;
  let used: string = cfg.models[0];
  let lastErr = '';

  // Skip parked models, but never skip every option — if all are cooling,
  // fall back to trying the full list rather than failing outright.
  const live = cfg.models.filter((m) => !isCooling(m));
  const chain = live.length > 0 ? live : cfg.models;

  for (const candidate of chain) {
    const attempt = await fetch(cfg.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: body(candidate),
    });
    if (attempt.ok && attempt.body) {
      cooling.delete(candidate);
      res = attempt;
      used = candidate;
      break;
    }
    const detail = await attempt.text().catch(() => '');
    lastErr = `${attempt.status}${detail ? ` — ${detail.slice(0, 200)}` : ''}`;
    if (attempt.status === 429) cooling.set(candidate, Date.now() + COOLDOWN_MS);
    if (!retryable(attempt.status)) break;
  }

  if (!res || !res.body) {
    throw new Error(`${cfg.label} returned ${lastErr || 'no response body'}`);
  }

  // Be explicit when the answer did not come from the model that was picked.
  if (used !== cfg.models[0]) {
    controller.enqueue(encoder.encode(
      `[${cfg.label} unavailable — answered by ${used} instead]\n\n`,
    ));
  }

  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  let sawContent = false;
  let finish: string | undefined;

  const flush = () => {
    // Reasoning models can burn the whole budget thinking and return nothing.
    // Say so rather than leaving an empty message bubble.
    if (!sawContent) {
      controller.enqueue(encoder.encode(
        finish === 'length'
          ? `[${cfg.label} used its entire token budget reasoning without producing an answer. Try a narrower question.]`
          : `[${cfg.label} returned an empty response.]`,
      ));
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split('\n');
    buf = lines.pop() ?? '';
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const data = line.slice(6).trim();
      if (data === '[DONE]') { flush(); return; }
      try {
        const json = JSON.parse(data);
        const choice = json.choices?.[0];
        if (choice?.finish_reason) finish = choice.finish_reason;
        // Only `content` is surfaced; `reasoning_content` deltas are internal.
        const text = choice?.delta?.content;
        if (text) { sawContent = true; controller.enqueue(encoder.encode(text)); }
      } catch { /* skip malformed chunks */ }
    }
  }
  flush();
}

/**
 * Which ventures may this user be told about? A grant on any page for a venture
 * is enough — the AI is a lens over data they can already open.
 */
function allowedVentures(user: Parameters<typeof venturesForUser>[0]): string[] {
  return venturesForUser(user);
}

/**
 * The general (non-venture) prompt, trimmed to the ventures this user may see.
 * SYSTEM_PROMPT names all five, so handing it to a scoped member would undo the
 * access matrix in one request.
 */
function scopedSystemPrompt(allowed: string[]): string {
  if (allowed.length === ALL_SCOPE_NAMES.length) return `${MENTOR_PERSONA}\n\n${SYSTEM_PROMPT}`;
  const lines = SYSTEM_PROMPT.split('\n');
  const kept = lines.filter((line) => {
    const venture = /^\d+\.\s+\*\*(\w+)\*\*/.exec(line.trim());
    if (!venture) return true;
    return allowed.includes(venture[1]);
  });
  return `${MENTOR_PERSONA}\n\n${kept.join('\n')}\n\n${scopeFooter(allowed)}`;
}

function scopeFooter(allowed: string[]): string {
  return [
    '## Access scope',
    `This user has access to: ${allowed.join(', ') || 'no ventures yet'}.`,
    'Do not discuss, reference or speculate about any other Codelude venture,',
    'its finances, cap table, or roadmap. If asked, say it is outside their access.',
  ].join('\n');
}

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (user instanceof NextResponse) return user;

  const { messages, venture, liveData, systemOverride: clientSystem, model } = await req.json();
  const encoder = new TextEncoder();

  const allowed = allowedVentures(user);

  // The venture context lives on the server precisely so this check can exist.
  let systemOverride: string | undefined;
  if (typeof venture === 'string' && venture.length > 0) {
    if (!allowed.includes(venture)) {
      return NextResponse.json(
        { error: `No access to ${venture}` },
        { status: 403 },
      );
    }
    const base = VENTURE_CONTEXT[venture];
    if (base) {
      // Persona first, then the venture's facts, then live data — so the way
      // it engages is identical across all five, and only the subject changes.
      // `liveData` is assembled client-side from queries that are themselves
      // access-checked in Convex, so it carries nothing they cannot already see.
      systemOverride = [MENTOR_PERSONA, base, typeof liveData === 'string' ? liveData : '']
        .filter(Boolean)
        .join('\n\n');
    }
  } else if (typeof clientSystem === 'string' && clientSystem.length > 0) {
    // Task-detail chat sends its own prompt built from data the client already
    // holds, so this leaks nothing server-side — but a scoped user still gets
    // the boundary appended so the model does not volunteer other ventures.
    systemOverride = [
      MENTOR_PERSONA,
      clientSystem,
      isUnrestricted(user) ? '' : scopeFooter(allowed),
    ].filter(Boolean).join('\n\n');
  } else {
    systemOverride = scopedSystemPrompt(allowed);
  }

  // Read once here rather than inside the stream: the tools authorise as the
  // caller, and this is the last point where request context is available.
  const toolToken = await convexAuthNextjsToken().catch(() => undefined);

  const stream = new ReadableStream({
    async start(controller) {
      try {
        if (model in OPENAI_COMPATIBLE) {
          const cfg = OPENAI_COMPATIBLE[model as OpenAIProvider];
          const apiKey = process.env[cfg.keyEnv];

          // Let the model fetch what it needs from HQ first. It runs under the
          // caller's own token, so Convex's access checks decide what comes
          // back — there is no second copy of the permission rules here.
          let prepared: any[] | undefined;
          if (apiKey) {
            const loop = await runToolLoop(
              cfg.url, apiKey, systemOverride ?? SYSTEM_PROMPT, messages, toolToken,
            ).catch(() => null);
            prepared = loop?.messages;
          }

          await streamOpenAICompatible(
            model as OpenAIProvider, messages, systemOverride, controller, encoder, prepared,
          );
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
