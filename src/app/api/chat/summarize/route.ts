/**
 * Roll one past day of assistant conversation into a summary.
 *
 * Lives here rather than in a Convex action because the Anthropic key is a
 * Vercel env var, not a Convex one — and this keeps a single place where the
 * key is read. The client calls it when aichat.pendingSummary reports a day
 * that has messages but no summary yet.
 *
 * Idempotent: saveSummary upserts, so a retry after a failure replaces rather
 * than duplicating.
 */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { fetchQuery, fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { requireApiUser } from '@/lib/api-auth';
import { venturesForUser } from '@/lib/nav';

/**
 * Which model summarises depends on what is configured. Production currently
 * carries only OPENCODE_API_KEY, so defaulting to Anthropic would 502 every
 * time. Prefer Claude when its key exists, otherwise use the same OpenCode Zen
 * gateway the chat itself defaults to.
 */
const ZEN_URL = 'https://opencode.ai/zen/v1/chat/completions';
const ZEN_MODEL = 'big-pickle';

async function summariseWith(system: string, prompt: string): Promise<string> {
  if (process.env.ANTHROPIC_API_KEY) {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const r = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 700,
      system,
      messages: [{ role: 'user', content: prompt }],
    });
    return r.content
      .filter((b): b is Anthropic.TextBlock => b.type === 'text')
      .map(b => b.text).join('').trim();
  }

  const key = process.env.OPENCODE_API_KEY;
  if (!key) throw new Error('No summarisation provider configured');

  const res = await fetch(ZEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: ZEN_MODEL,
      // big-pickle is a reasoning model and spends max_tokens on thinking
      // before it emits any content — the chat route hit empty replies at
      // 2048, so give the summary room to actually land.
      max_tokens: 4096,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Gateway ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const json = await res.json();
  return (json?.choices?.[0]?.message?.content ?? '').trim();
}

const SUMMARY_PROMPT = `You are summarising one day of a founder's working conversation with their company assistant.

Write a compact summary they will actually re-read weeks later. Cover:
- Decisions reached, and the reasoning behind them
- Open questions left unresolved
- Concrete next actions named in the conversation
- Any numbers, names, dates or commitments worth recovering

Rules:
- Under 200 words. Terse notes, not prose.
- Only what is in the conversation. Never infer or embellish.
- If the day was thin or inconclusive, say so in one line rather than padding.
- No preamble, no "In this conversation". Start with the substance.`;

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (user instanceof NextResponse) return user;

  const { venture, day } = await req.json();
  if (typeof venture !== 'string' || typeof day !== 'string') {
    return NextResponse.json({ error: 'venture and day required' }, { status: 400 });
  }
  if (!venturesForUser(user).includes(venture)) {
    return NextResponse.json({ error: `No access to ${venture}` }, { status: 403 });
  }

  const token = await convexAuthNextjsToken();

  // Scoped to the caller's own history by the Convex query — this cannot read
  // someone else's day even with a forged venture/day pair.
  const messages = await fetchQuery(
    api.aichat.dayMessages,
    { venture, day },
    { token },
  );

  if (messages.length === 0) {
    return NextResponse.json({ error: 'Nothing to summarise' }, { status: 404 });
  }

  const transcript = messages
    .map(m => `${m.role === 'user' ? 'Founder' : 'Assistant'}: ${m.content}`)
    .join('\n\n')
    .slice(0, 120_000);   // a very long day still has to fit in one request

  let summary: string;
  try {
    summary = await summariseWith(
      SUMMARY_PROMPT,
      `Venture: ${venture}\nDate: ${day}\n\n${transcript}`,
    );
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Summarisation failed' },
      { status: 502 },
    );
  }

  if (!summary) {
    return NextResponse.json({ error: 'Empty summary' }, { status: 502 });
  }

  await fetchMutation(
    api.aichat.saveSummary,
    { venture, day, summary, messageCount: messages.length },
    { token },
  );

  return NextResponse.json({ day, messageCount: messages.length, summary });
}
