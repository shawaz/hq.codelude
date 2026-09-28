import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { requireApiUser } from '@/lib/api-auth';
import { isUnrestricted, venturesForUser } from '@/lib/nav';
import { ALL_SCOPE_NAMES } from '@/lib/ventures';
import { VENTURE_CONTEXT } from '@/lib/venture-context';
import { MENTOR_PERSONA } from '@/lib/mentor-persona';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { TOOL_SPECS, TOOL_PROMPT, executeTool } from '@/lib/ai-tools';

/**
 * Built on demand, not at module load.
 *
 * `new Anthropic({ apiKey: undefined })` constructs fine and then throws
 * "Could not resolve authentication method" deep inside the first request —
 * which is what the task-detail Ask AI tab surfaced, since it sends no model
 * and used to land on Claude regardless of whether the key was deployed.
 */
function anthropic(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('Claude is not configured — set ANTHROPIC_API_KEY');
  return new Anthropic({ apiKey });
}

const SYSTEM_PROMPT = `You are the AI assistant for LLIFE HQ — the internal company OS for Shawaz, founder of LLIFE, a deep-tech venture studio based in Mangaluru, India.

## Codelude at a glance
- **Studio model**: five ventures built in parallel under one HoldCo
- **Founder**: Shawaz (solo founder, Mangaluru / IST timezone)
- **Server**: All platforms on 64.227.160.224 (CentOS 9, Apache + PM2)

## The five ventures
Each ships as its own platform. A Sep 2026 plan to consolidate them into a
single Llife product was reversed on 8 Sep 2026 — they are separate again.

1. **Roborns** — Coastal AI + desalination, Mangaluru. Preferred siting is Panambur / Baikampady, Dakshina Kannada; Uchila Thalapady was ruled out on grid access and Kapu superseded. Pre-feasibility: the power, CRZ and land-price gates (EXP-010/011/012) are all still open.
2. **Franchiseen** — AI Business Assistant. Fractional franchise ownership, daily payouts. Fractional ownership sold to retail is SEBI-regulated; treat the investment layer as gated on counsel.
3. **HubCV** (hubcv.pro) — AI Career Assistant. Live with real users and its own Convex backend.
4. **Nanotrade** — AI Trading Assistant. Bots live at bot./tv./spot./client.nanotrade.com with paying beta subscribers.
5. **Llife** (llife.app) — AI Life Assistant. Five domains on a daily time-block board, fed by the HubCV, Nanotrade and Franchiseen APIs. An AI device is planned alongside the software.

llife.app is Llife's host and a deliberate placeholder for llife.ai, which is
wanted but not yet registered — .ai bills two years upfront, which defers it.

## Key context
- Codelude is the studio brand; Llife is the consumer product. The Dubai HoldCo was closed in Aug 2026 and an India-first structure is being decided — do not describe the Dubai entity as live.
- HQ dashboard: hq.codelude.com. Full company OS — Tasks, Plan, Strategy, Finance, People, Legal, Marketing, Sales, Software, Support sections.
- HQ records use the venture names above. Records naming LLIFE or Dextrip predate the reversal of the LLIFE rebrand and the Nanotrade rename, and refer to Codelude and Nanotrade respectively.

## Full Department Access (Read & Write)
You have full Read and Write (CRUD) capabilities across all departments:
1. **Home / Workspace**: Manage task creation, task status updates, workspace focus, and daily priorities.
2. **Management**: Access strategic vision, OKRs, milestones, decisions, advisors/partners, and channel strategies.
3. **Operations**: Access offices, site projects, infrastructure, site surveys, and operational logistics.
4. **Finance**: Access budgets, MTD expenses, invoices, cap table equity, bank accounts, crypto wallets, and raise plan docs.
5. **Sales**: Access sales pipeline, prospects, leads, deals, clients, contact lists, and create/update pipeline entries.
6. **Marketing**: Access market analysis, competitor breakdowns, marketing campaigns, content plans, and channels.
7. **Human Resource (People)**: Access open positions, candidate applications, team roles, onboarding, and training data. Create roles and candidate entries.
8. **Legal**: Access the NDA registry, contracts and government filings.
9. **Support**: Access help articles, troubleshooting docs, system operating procedures, and support tickets.
10. **Software**: Access software platform architecture, feature backlogs, bug tracking, and deployment specifications.
11. **Plan**: Access each venture's business model, business plan and financial plan.

Use tools ('get_department_data', 'create_task', 'set_task_status', 'update_task', 'assign_task', 'create_pipeline_org', 'create_position', 'create_application', 'set_application_status', 'set_position_status', 'list_tasks', 'list_positions', 'list_applications', 'list_offices', 'pipeline_summary') whenever you need to read or modify records across any department. Read first, then answer — do not tell the founder you lack access to a department before you have called get_department_data for it.

## What he brings to you
- Decisions across any of the five ventures
- Department operations (Finance, HR, Sales, Ops, Marketing, Support, Software, Management, Home)
- Fundraising strategy (India equity, token structure, investor outreach)
- Nanotrade trading strategy and bot behaviour
- Drafts: content, investor updates, business plans
- Code, server and architecture questions
- Operational problems

You have the full context above. Use it — reference the actual numbers and
constraints rather than talking in generalities.`;

function formatClaudeMessage(m: any) {
  if (m.role === 'user' && m.image) {
    const match = m.image.match(/^data:(image\/[a-zA-Z]+);base64,(.+)$/);
    if (match) {
      return {
        role: 'user',
        content: [
          { type: 'text', text: m.content || 'Attached image' },
          { type: 'image', source: { type: 'base64', media_type: match[1], data: match[2] } },
        ],
      };
    }
  }
  return { role: m.role, content: m.content };
}

function formatOpenAIMessage(m: any) {
  if (m.role === 'user' && m.image) {
    return {
      role: 'user',
      content: [
        { type: 'text', text: m.content || 'Attached image' },
        { type: 'image_url', image_url: { url: m.image } },
      ],
    };
  }
  return { role: m.role, content: m.content };
}

const CLAUDE_MODEL = 'claude-sonnet-4-6';

/** TOOL_SPECS, restated in Anthropic's tool shape. */
const CLAUDE_TOOLS = TOOL_SPECS.map((t) => ({
  name: t.function.name,
  description: t.function.description,
  input_schema: t.function.parameters as any,
}));

/**
 * Let Claude read and write HQ before it answers.
 *
 * The OpenAI-compatible providers had this and Claude did not, so picking
 * "Claude Sonnet" in the model strip silently dropped every tool: it answered
 * about departments from the system prompt alone. Runs non-streaming — a tool
 * call has to complete before the next turn starts — and returns the message
 * list for the streaming call, or null if no tool was requested.
 */
async function runClaudeToolLoop(
  system: string,
  messages: any[],
  token: string | undefined,
): Promise<any[] | null> {
  const convo: any[] = messages.map(formatClaudeMessage);
  let usedAnyTool = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await anthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: `${system}\n\n${TOOL_PROMPT}`,
      messages: convo,
      tools: CLAUDE_TOOLS,
    });

    const calls = res.content.filter((b: any) => b.type === 'tool_use') as any[];
    if (!calls.length) return usedAnyTool ? convo : null;

    usedAnyTool = true;
    convo.push({ role: 'assistant', content: res.content });

    const results = [];
    for (const call of calls) {
      const out = await executeTool(call.name, call.input, token);
      results.push({ type: 'tool_result', tool_use_id: call.id, content: out.content });
    }
    convo.push({ role: 'user', content: results });
  }

  return convo;
}

async function streamClaude(
  messages: any[],
  systemOverride: string | undefined,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  preparedMessages?: any[],
) {
  const response = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system: systemOverride ?? SYSTEM_PROMPT,
    messages: preparedMessages ?? messages.map(formatClaudeMessage),
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
  gemini: {
    url: 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions',
    keyEnv: 'GEMINI_API_KEY',
    label: 'Gemini 3.6 Flash',
    models: [
      'gemini-3.6-flash',
      'gemini-3.5-flash',
      'gemini-3.7-flash',
    ],
    maxTokens: 4096,
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
 * Model used when tools are in play, per provider.
 *
 * This used to be a single hardcoded id — nemotron-3-ultra-free, an OpenCode
 * Zen model — sent to whichever provider was selected. Google and OpenRouter
 * reject an unknown model outright, so every Gemini and DeepSeek turn had its
 * tool loop 400 and fall through to plain chat: the assistant could not read a
 * single HQ record unless the user happened to have OpenCode selected. Each
 * provider now runs its tools on one of its own models.
 *
 * For OpenCode the pick is still nemotron: the gateway default, big-pickle, is
 * a free-tier model that returns FreeUsageLimitError under load, and a tool
 * loop costs three to five requests per answer rather than one, so it burns
 * that quota far faster than plain chat does. nemotron is the sibling verified
 * to return tool_calls.
 */
const TOOL_MODEL: Record<OpenAIProvider, string> = {
  opencode: 'nemotron-3-ultra-free',
  gemini: 'gemini-3.6-flash',
  deepseek: 'deepseek/deepseek-chat-v3-0324:free',
};

/**
 * Pick the provider that will actually answer.
 *
 * Callers that have a model strip send `model`; the task-detail Ask AI tab does
 * not, and an absent model used to fall straight through to Claude — which
 * fails on every deployment that carries only OPENCODE_API_KEY and
 * GEMINI_API_KEY. Resolve against the keys that are present instead, so a
 * surface without a picker gets a working provider rather than an auth error,
 * and a requested provider whose key is missing degrades to one that works.
 */
const configured = (p: OpenAIProvider) => Boolean(process.env[OPENAI_COMPATIBLE[p].keyEnv]);

/** Cheapest and most reliable first — the same default the AI page ships with. */
const PROVIDER_PREFERENCE: OpenAIProvider[] = ['gemini', 'opencode', 'deepseek'];

function resolveProvider(requested: unknown): OpenAIProvider | 'claude' {
  const wanted = typeof requested === 'string' ? requested : '';

  if (wanted in OPENAI_COMPATIBLE && configured(wanted as OpenAIProvider)) {
    return wanted as OpenAIProvider;
  }
  if (wanted === 'claude' && process.env.ANTHROPIC_API_KEY) return 'claude';

  const fallback = PROVIDER_PREFERENCE.find(configured);
  if (fallback) return fallback;
  if (process.env.ANTHROPIC_API_KEY) return 'claude';

  throw new Error(
    'No AI provider is configured — set GEMINI_API_KEY, OPENCODE_API_KEY, OPENROUTER_API_KEY or ANTHROPIC_API_KEY',
  );
}

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
  provider: OpenAIProvider,
  apiKey: string,
  system: string,
  messages: any[],
  token: string | undefined,
): Promise<{ messages: any[]; wrote: string[] } | null> {
  const url = OPENAI_COMPATIBLE[provider].url;
  const convo: any[] = [
    { role: 'system', content: `${system}\n\n${TOOL_PROMPT}` },
    ...messages.map(formatOpenAIMessage),
  ];
  const wrote: string[] = [];
  let usedAnyTool = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TOOL_MODEL[provider],
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
  preparedMessages?: any[],
) {
  const cfg = OPENAI_COMPATIBLE[provider];
  const apiKey = process.env[cfg.keyEnv];
  if (!apiKey) throw new Error(`${cfg.label} is not configured — set ${cfg.keyEnv}`);

  const body = (model: string) => JSON.stringify({
    model,
    max_tokens: cfg.maxTokens ?? 2048,
    stream: true,
    messages: preparedMessages ?? [
      { role: 'system', content: systemOverride ?? SYSTEM_PROMPT },
      ...messages.map(formatOpenAIMessage),
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
    const match = /^\d+\.\s+\*\*(\w+)\*\*/.exec(line.trim());
    if (!match) return true;
    // The prompt has two numbered bold lists — the five ventures and the
    // departments. Only the venture one is access-gated; testing membership of
    // the venture registry keeps a scoped user's department list intact.
    if (!ALL_SCOPE_NAMES.includes(match[1])) return true;
    return allowed.includes(match[1]);
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

/**
 * Tell the model which venture page it is answering from.
 *
 * Without this the venture prompt names the venture in prose but nothing says
 * it is the argument to pass to the tools, so the assistant would either ask
 * which venture was meant or read studio-wide records and answer with the
 * wrong venture's numbers.
 */
function activeVentureNote(venture: string): string {
  return [
    '## Active venture',
    `The person is on the ${venture} page. Pass venture: "${venture}" to every`,
    'tool that takes one, unless they explicitly name a different venture.',
    `So "what's in People?" means get_department_data with department`,
    `"Human Resource" and venture "${venture}".`,
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
      systemOverride = [MENTOR_PERSONA, base, activeVentureNote(venture), typeof liveData === 'string' ? liveData : '']
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
        const provider = resolveProvider(model);

        if (provider !== 'claude') {
          const cfg = OPENAI_COMPATIBLE[provider];
          const apiKey = process.env[cfg.keyEnv];

          // Let the model fetch what it needs from HQ first. It runs under the
          // caller's own token, so Convex's access checks decide what comes
          // back — there is no second copy of the permission rules here.
          let prepared: any[] | undefined;
          if (apiKey) {
            const loop = await runToolLoop(
              provider, apiKey, systemOverride ?? SYSTEM_PROMPT, messages, toolToken,
            ).catch(() => null);
            prepared = loop?.messages;
          }

          await streamOpenAICompatible(
            provider, messages, systemOverride, controller, encoder, prepared,
          );
        } else {
          const prepared = await runClaudeToolLoop(
            systemOverride ?? SYSTEM_PROMPT, messages, toolToken,
          ).catch(() => null);
          await streamClaude(messages, systemOverride, controller, encoder, prepared ?? undefined);
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
