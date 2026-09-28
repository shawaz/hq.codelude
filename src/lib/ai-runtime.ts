/**
 * The model runtime: pick a provider, let it use HQ's tools, stream the answer.
 *
 * All of this used to live inside src/app/api/chat/route.ts, private to that
 * one handler. The agent runner needs exactly the same machinery — same
 * providers, same tool loop, same failover — so it moved here rather than being
 * forked. The chat route keeps its own system prompt and access rules; this
 * file knows nothing about either.
 *
 * Two things it does that a thin fetch wrapper would not:
 *
 * **Failover.** Every provider here is a free tier that returns 429 under load.
 * A model that does gets parked for ten minutes and a sibling answers instead,
 * so one exhausted quota does not dead-end the page.
 *
 * **Tools before the answer.** The tool loop runs non-streaming — a tool call
 * has to complete before the next turn starts — and hands the resulting message
 * list to the streaming call. The caller just reads text either way.
 */

import Anthropic from '@anthropic-ai/sdk';
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

// ─── Message shapes ───────────────────────────────────────────────────────────

/* eslint-disable @typescript-eslint/no-explicit-any */

export function formatClaudeMessage(m: any) {
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

export function formatOpenAIMessage(m: any) {
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

// ─── Providers ────────────────────────────────────────────────────────────────

const CLAUDE_MODEL = 'claude-sonnet-4-6';

/** Providers that speak the OpenAI chat-completions dialect. */
export const OPENAI_COMPATIBLE = {
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

export type OpenAIProvider = keyof typeof OPENAI_COMPATIBLE;
export type Provider = OpenAIProvider | 'claude';

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
export const isConfigured = (p: Provider): boolean =>
  p === 'claude'
    ? Boolean(process.env.ANTHROPIC_API_KEY)
    : Boolean(process.env[OPENAI_COMPATIBLE[p].keyEnv]);

/** Cheapest and most reliable first — the same default the AI page ships with. */
const PROVIDER_PREFERENCE: OpenAIProvider[] = ['gemini', 'opencode', 'deepseek'];

export function resolveProvider(requested: unknown): Provider {
  const wanted = typeof requested === 'string' ? requested : '';

  if (wanted in OPENAI_COMPATIBLE && isConfigured(wanted as OpenAIProvider)) {
    return wanted as OpenAIProvider;
  }
  if (wanted === 'claude' && isConfigured('claude')) return 'claude';

  const fallback = PROVIDER_PREFERENCE.find(isConfigured);
  if (fallback) return fallback;
  if (isConfigured('claude')) return 'claude';

  throw new Error(
    'No AI provider is configured — set GEMINI_API_KEY, OPENCODE_API_KEY, OPENROUTER_API_KEY or ANTHROPIC_API_KEY',
  );
}

/** Which providers this deployment can actually reach. Drives the agent form. */
export const configuredProviders = (): Provider[] =>
  (['gemini', 'opencode', 'deepseek', 'claude'] as Provider[]).filter(isConfigured);

// ─── Tools ────────────────────────────────────────────────────────────────────

/** A tool loop that never terminates is a bill. Four rounds is plenty. */
const MAX_TOOL_ROUNDS = 4;

interface ToolCall { id: string; function: { name: string; arguments: string } }

/**
 * The specs a caller may use.
 *
 * An agent carries an allowlist, so it only ever sees the tools its record
 * names. The assistant passes no allowlist and gets everything. An empty array
 * is a real answer — an agent with no tools reasons from its prompt alone —
 * so the absent case is `undefined`, not `[]`.
 */
function specsFor(allowlist: string[] | undefined) {
  if (!allowlist) return TOOL_SPECS;
  return TOOL_SPECS.filter((t) => allowlist.includes(t.function.name));
}

/** TOOL_SPECS, restated in Anthropic's tool shape. */
const claudeTools = (allowlist: string[] | undefined) =>
  specsFor(allowlist).map((t) => ({
    name: t.function.name,
    description: t.function.description,
    input_schema: t.function.parameters as any,
  }));

export interface ToolLoopResult {
  messages: any[];
  /** Tool names actually called, in order, for the run record. */
  toolCalls: string[];
}

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
export async function runToolLoop(
  provider: OpenAIProvider,
  apiKey: string,
  system: string,
  messages: any[],
  token: string | undefined,
  allowlist?: string[],
): Promise<ToolLoopResult | null> {
  const tools = specsFor(allowlist);
  if (tools.length === 0) return null;

  const url = OPENAI_COMPATIBLE[provider].url;
  const convo: any[] = [
    { role: 'system', content: `${system}\n\n${TOOL_PROMPT}` },
    ...messages.map(formatOpenAIMessage),
  ];
  const toolCalls: string[] = [];
  let usedAnyTool = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: TOOL_MODEL[provider],
        max_tokens: 4096,
        messages: convo,
        tools,
      }),
    });

    // Rate limit or refusal: fall through to plain chat rather than dead-ending.
    if (!res.ok) return usedAnyTool ? { messages: convo, toolCalls } : null;

    const json = await res.json().catch(() => null);
    const msg = json?.choices?.[0]?.message;
    const calls: ToolCall[] | undefined = msg?.tool_calls;
    if (!calls?.length) return usedAnyTool ? { messages: convo, toolCalls } : null;

    usedAnyTool = true;
    convo.push(msg);

    for (const call of calls) {
      const result = await executeTool(call.function.name, call.function.arguments, token, allowlist);
      toolCalls.push(call.function.name);
      convo.push({ role: 'tool', tool_call_id: call.id, name: result.name, content: result.content });
    }
  }

  return { messages: convo, toolCalls };
}

/**
 * Let Claude read and write HQ before it answers.
 *
 * The OpenAI-compatible providers had this and Claude did not, so picking
 * "Claude Sonnet" in the model strip silently dropped every tool: it answered
 * about departments from the system prompt alone.
 */
export async function runClaudeToolLoop(
  system: string,
  messages: any[],
  token: string | undefined,
  allowlist?: string[],
): Promise<ToolLoopResult | null> {
  const tools = claudeTools(allowlist);
  if (tools.length === 0) return null;

  const convo: any[] = messages.map(formatClaudeMessage);
  const toolCalls: string[] = [];
  let usedAnyTool = false;

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    const res = await anthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: `${system}\n\n${TOOL_PROMPT}`,
      messages: convo,
      tools,
    });

    const calls = res.content.filter((b: any) => b.type === 'tool_use') as any[];
    if (!calls.length) return usedAnyTool ? { messages: convo, toolCalls } : null;

    usedAnyTool = true;
    convo.push({ role: 'assistant', content: res.content });

    const results = [];
    for (const call of calls) {
      const out = await executeTool(call.name, call.input, token, allowlist);
      toolCalls.push(call.name);
      results.push({ type: 'tool_result', tool_use_id: call.id, content: out.content });
    }
    convo.push({ role: 'user', content: results });
  }

  return { messages: convo, toolCalls };
}

// ─── Streaming ────────────────────────────────────────────────────────────────

export async function streamClaude(
  messages: any[],
  system: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder,
  preparedMessages?: any[],
) {
  const response = await anthropic().messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2048,
    system,
    messages: preparedMessages ?? messages.map(formatClaudeMessage),
    stream: true,
  });
  for await (const event of response) {
    if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
      controller.enqueue(encoder.encode(event.delta.text));
    }
  }
}

export async function streamOpenAICompatible(
  provider: OpenAIProvider,
  messages: any[],
  system: string,
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
      { role: 'system', content: system },
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

// ─── The whole turn ───────────────────────────────────────────────────────────

/**
 * Resolve a provider, run its tool loop, stream the answer.
 *
 * This is the sequence both the chat route and the agent runner need, in the
 * same order, with the same failure handling. Callers differ only in the system
 * prompt they build and the allowlist they pass.
 *
 * Errors are enqueued into the stream rather than thrown: the response has
 * already started, so a throw would truncate it with no explanation. Returns
 * what happened, which the agent runner records and the chat route ignores.
 */
export async function streamAnswer(opts: {
  model?: unknown;
  system: string;
  messages: any[];
  token?: string;
  allowlist?: string[];
  controller: ReadableStreamDefaultController;
  encoder: TextEncoder;
}): Promise<{ provider: Provider | null; toolCalls: string[]; error?: string }> {
  const { model, system, messages, token, allowlist, controller, encoder } = opts;
  try {
    const provider = resolveProvider(model);

    if (provider !== 'claude') {
      const cfg = OPENAI_COMPATIBLE[provider];
      const apiKey = process.env[cfg.keyEnv];

      // Let the model fetch what it needs from HQ first. It runs under the
      // caller's own token, so Convex's access checks decide what comes back —
      // there is no second copy of the permission rules here.
      const loop = apiKey
        ? await runToolLoop(provider, apiKey, system, messages, token, allowlist).catch(() => null)
        : null;

      await streamOpenAICompatible(provider, messages, system, controller, encoder, loop?.messages);
      return { provider, toolCalls: loop?.toolCalls ?? [] };
    }

    const loop = await runClaudeToolLoop(system, messages, token, allowlist).catch(() => null);
    await streamClaude(messages, system, controller, encoder, loop?.messages);
    return { provider, toolCalls: loop?.toolCalls ?? [] };
  } catch (e) {
    const error = e instanceof Error ? e.message : String(e);
    controller.enqueue(encoder.encode(`\n\n[Error: ${error}]`));
    return { provider: null, toolCalls: [], error };
  }
}
