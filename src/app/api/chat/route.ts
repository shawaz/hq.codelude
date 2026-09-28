import { NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';
import { isUnrestricted, venturesForUser } from '@/lib/nav';
import { ALL_SCOPE_NAMES } from '@/lib/ventures';
import { VENTURE_CONTEXT } from '@/lib/venture-context';
import { MENTOR_PERSONA } from '@/lib/mentor-persona';
import { convexAuthNextjsToken } from '@convex-dev/auth/nextjs/server';
import { streamAnswer } from '@/lib/ai-runtime';

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
      // streamAnswer resolves the provider, runs the tool loop and streams the
      // answer. It reports its own errors into the stream rather than throwing,
      // because by then the response has already started.
      await streamAnswer({
        model,
        system: systemOverride ?? SYSTEM_PROMPT,
        messages,
        token: toolToken,
        controller,
        encoder,
      });
      controller.close();
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

export const dynamic = 'force-dynamic';
