import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { findShare, updateShare, isShareActive, hashOtp, generateOtp } from '@/lib/doc-shares';

const DOCS_PATHS = [
  '/home/centos/codelude/data/docs',
  path.join(process.cwd(), 'data', 'docs'),
];

function docPath(slug: string): string | null {
  for (const dir of DOCS_PATHS) {
    const file = path.join(dir, `${path.basename(slug)}.md`);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

const OTP_TTL_MS = 10 * 60 * 1000;
const MAX_ATTEMPTS = 5;

// GET — public status check so the share page can render the right state
// without leaking the recipient email or doc content.
export async function GET(_: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = findShare(token);
  if (!share || !isShareActive(share)) {
    return NextResponse.json({ active: false });
  }
  return NextResponse.json({ active: true, letterhead: share.letterhead });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const body = await req.json();
  const share = findShare(token);

  if (!share || !isShareActive(share)) {
    return NextResponse.json({ error: 'This link is no longer active.' }, { status: 410 });
  }

  if (body.action === 'request-otp') {
    const email = String(body.email ?? '').trim().toLowerCase();
    if (email !== share.recipientEmail) {
      // Same generic message as success to avoid confirming the recipient address.
      return NextResponse.json({ ok: true });
    }
    const otp = generateOtp();
    updateShare(token, {
      otp: { hash: hashOtp(otp), expiresAt: new Date(Date.now() + OTP_TTL_MS).toISOString(), attempts: 0 },
    });
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from:    'Codelude <hello@codelude.com>',
        to:      [share.recipientEmail],
        subject: `Your access code: ${otp}`,
        html: `
          <div style="font-family:monospace;background:#0a0a08;color:#f5f3ee;padding:40px;max-width:600px;margin:0 auto;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c8f53a;margin-bottom:8px;">Document access</div>
            <div style="font-size:22px;font-weight:700;margin-bottom:24px;letter-spacing:-0.02em;">Your one-time code</div>
            <div style="background:#111110;border:1px solid #252522;padding:20px;text-align:center;margin-bottom:24px;">
              <span style="font-size:32px;letter-spacing:12px;font-weight:700;color:#c8f53a;">${otp}</span>
            </div>
            <p style="font-size:13px;color:#7a7870;line-height:1.8;font-weight:300;">
              Enter this code to view the document. It expires in 10 minutes.<br/>
              If you didn't request this, you can ignore this email.
            </p>
          </div>
        `,
      });
    } catch {
      return NextResponse.json({ error: 'Failed to send code. Try again.' }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  }

  if (body.action === 'verify') {
    const otpState = share.otp;
    if (!otpState || new Date(otpState.expiresAt).getTime() < Date.now()) {
      return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 401 });
    }
    if (otpState.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json({ error: 'Too many attempts. Request a new code.' }, { status: 429 });
    }
    const code = String(body.otp ?? '').trim();
    if (hashOtp(code) !== otpState.hash) {
      updateShare(token, { otp: { ...otpState, attempts: otpState.attempts + 1 } });
      return NextResponse.json({ error: 'Incorrect code.' }, { status: 401 });
    }

    const file = docPath(share.slug);
    if (!file) return NextResponse.json({ error: 'Document not found.' }, { status: 404 });

    // Burn the OTP and record the view.
    updateShare(token, { otp: undefined, views: [...share.views, new Date().toISOString()] });

    return NextResponse.json({
      content: fs.readFileSync(file, 'utf-8'),
      letterhead: share.letterhead,
    });
  }

  return NextResponse.json({ error: 'invalid action' }, { status: 400 });
}
