import { NextRequest, NextResponse } from 'next/server';
import { fetchMutation } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { VENTURES, SEGMENTS } from '@/lib/pipeline-config';

/**
 * Public intake for website lead forms and social-media capture.
 *
 *   POST /api/leads
 *   { venture, segment, name, email?, phone?, company?, city?, state?,
 *     interest?, message?, source? }
 *
 * Lands the submission in the `lead` stage, where it appears on
 * /dashboard/leads under the matching venture + segment tab.
 *
 * This replaces the previous JSON-file reader, which could never work on
 * Vercel — serverless instances have no persistent writable filesystem.
 */

const VENTURE_NAMES = VENTURES.map(v => v.name);

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const s = (k: string) => {
    const val = body[k];
    return typeof val === 'string' && val.trim() !== '' ? val.trim() : undefined;
  };

  const name = s('name');
  if (!name) {
    return NextResponse.json({ error: 'name is required' }, { status: 400 });
  }

  // Validate against the configured taxonomy so a typo can't create an
  // orphan bucket that never shows up under any tab.
  const venture = s('venture') ?? 'Codelude';
  if (!VENTURE_NAMES.includes(venture as typeof VENTURE_NAMES[number])) {
    return NextResponse.json(
      { error: `venture must be one of: ${VENTURE_NAMES.join(', ')}` },
      { status: 400 },
    );
  }

  const segments = SEGMENTS[venture];
  const segment = s('segment') ?? segments[0].key;
  if (!segments.some(seg => seg.key === segment)) {
    return NextResponse.json(
      { error: `segment for ${venture} must be one of: ${segments.map(x => x.key).join(', ')}` },
      { status: 400 },
    );
  }

  try {
    const id = await fetchMutation(api.pipeline.submitLead, {
      venture,
      segment,
      name,
      email:   s('email'),
      phone:   s('phone'),
      company: s('company'),
      city:    s('city'),
      state:   s('state'),
      interest: s('interest'),
      message:  s('message'),
      source:   s('source') ?? 'web-form',
      config:   s('config'),
      boundary: body.boundary as never,
      center:   body.center as never,
      areaHectares:
        typeof body.areaHectares === 'number' ? body.areaHectares : undefined,
    });
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (err) {
    console.error('[api/leads] submit failed', err);
    return NextResponse.json({ error: 'Could not save lead' }, { status: 500 });
  }
}
