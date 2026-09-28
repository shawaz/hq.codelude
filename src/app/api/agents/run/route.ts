/**
 * Run an agent against the task it is assigned to.
 *
 * The task-detail page posts a taskId; everything else is derived server-side.
 * The client cannot name the agent, the prompt or the tool list — otherwise the
 * allowlist would be advisory, since a caller could simply ask for a different
 * one.
 *
 * Two gates, both already load-bearing elsewhere:
 *
 * 1. Tools execute through fetchQuery/fetchMutation carrying **the triggering
 *    user's** Convex token, so an agent can never read or write past what that
 *    person could. There is no service account here, and no second copy of the
 *    permission rules.
 * 2. The agent's own `tools` array narrows it further from there.
 *
 * The answer streams back as plain text — the same content type /api/chat
 * returns, so the client just reads text. The run record and the task note are
 * written after the stream closes, because the output is not known until then.
 */

import { NextResponse } from 'next/server';
import { fetchMutation, fetchQuery } from 'convex/nextjs';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { requireApiUser } from '@/lib/api-auth';
import { can } from '@/lib/nav';
import { MENTOR_PERSONA } from '@/lib/mentor-persona';
import { streamAnswer } from '@/lib/ai-runtime';

/** What the agent is told about itself and the job. */
function systemPrompt(
  agent: { name: string; type: string; role: string; tools: string[] },
  task: { title: string; project: string; category: string; priority: string; status: string },
): string {
  return [
    MENTOR_PERSONA,
    `You are **${agent.name}**, a ${agent.type} working inside Codelude HQ.`,
    '',
    `## Your role`,
    agent.role,
    '',
    `## The task you have been assigned`,
    `TASK: "${task.title}"`,
    `Venture: ${task.project}`,
    `Category: ${task.category}`,
    `Priority: ${task.priority}`,
    `Status: ${task.status}`,
    '',
    '## How to answer',
    'Do the work. Read what you need from HQ with your tools first, then give',
    'the result — not a plan to produce the result later, and not a description',
    'of what you would do. Your answer is filed as a note on this task and read',
    'by the founder, so lead with the substance.',
    '',
    agent.tools.length === 0
      ? 'You have no tools on this run. Answer from what you are told above.'
      : `Tools available to you: ${agent.tools.join(', ')}. You have no others — do not describe actions you cannot take.`,
  ].join('\n');
}

export async function POST(req: Request) {
  const user = await requireApiUser();
  if (user instanceof NextResponse) return user;

  const { taskId } = await req.json().catch(() => ({ taskId: undefined }));
  if (typeof taskId !== 'string' || !taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 });
  }

  const token = await convexAuthNextjsToken().catch(() => undefined);

  const task = await fetchQuery(api.tasks.get, { key: taskId }, { token });
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 });

  // The venture comes off the task, never off the request, so the caller cannot
  // reach a venture they lack a grant on by naming someone else's task id.
  if (!can(user, task.project, 'tasks')) {
    return NextResponse.json(
      { error: `No access to ${task.project} · tasks` },
      { status: 403 },
    );
  }

  if (task.assigneeType !== 'agent' || !task.assigneeId) {
    return NextResponse.json(
      { error: 'This task is not assigned to an agent' },
      { status: 400 },
    );
  }

  const agent = await fetchQuery(api.agents.get, { id: task.assigneeId }, { token });
  if (!agent) {
    return NextResponse.json(
      { error: 'The assigned agent no longer exists — reassign the task' },
      { status: 404 },
    );
  }
  if (agent.status !== 'active') {
    return NextResponse.json(
      { error: `${agent.name} is paused` },
      { status: 409 },
    );
  }

  // Opened before the model is called, so a run that times out still leaves a
  // row saying it started.
  const runId = await fetchMutation(api.agents.startRun, {
    agentId: agent._id,
    agentName: agent.name,
    taskId: String(task._id),
    taskTitle: task.title,
    venture: task.project,
  }, { token });

  const encoder = new TextEncoder();
  const system = systemPrompt(agent, task);

  const stream = new ReadableStream({
    async start(controller) {
      // Tee the stream: the client gets it live, and the full text is kept so
      // it can be filed as a note once it is complete.
      let output = '';
      const capturing = {
        enqueue(chunk: Uint8Array) {
          output += new TextDecoder().decode(chunk);
          controller.enqueue(chunk);
        },
      } as ReadableStreamDefaultController;

      const result = await streamAnswer({
        model: agent.provider,
        system,
        messages: [{ role: 'user', content: `Work the task "${task.title}" now.` }],
        token,
        allowlist: agent.tools,
        controller: capturing,
        encoder,
      });

      // Best-effort bookkeeping: a failure to file the note must not truncate
      // an answer the user is already reading.
      try {
        await fetchMutation(api.agents.finishRun, {
          id: runId as Id<'agent_runs'>,
          status: result.error ? 'error' : 'done',
          output: output.slice(0, 50_000),
          toolCalls: result.toolCalls,
          error: result.error,
        }, { token });

        if (!result.error && output.trim()) {
          await fetchMutation(api.taskExtras.addNote, {
            taskId: String(task._id),
            text: `${agent.emoji} ${agent.name}\n\n${output.trim()}`,
          }, { token });
        }
      } catch {
        /* the answer already reached the user — losing the record is the lesser failure */
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const dynamic = 'force-dynamic';
