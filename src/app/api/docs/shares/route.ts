import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createShare, readShares, updateShare, isShareActive } from '@/lib/doc-shares';
import { LETTERHEADS, type Letterhead } from '@/lib/markdown';

function publicShare(s: ReturnType<typeof readShares>[number]) {
  // Never expose the OTP hash to the dashboard client.
  const { otp: _otp, ...rest } = s;
  return { ...rest, active: isShareActive(s) };
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug');
  const shares = readShares().filter(s => !slug || s.slug === slug);
  return NextResponse.json(shares.map(publicShare));
}

export async function POST(req: NextRequest) {
  const { slug, email, letterhead, title } = await req.json();
  if (!slug || !email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: 'Valid slug and email required' }, { status: 400 });
  }
  const lh: Letterhead = letterhead === 'roborns' || letterhead === 'codelude' ? letterhead : 'none';
  const share = createShare(slug, email, lh);

  const origin = req.nextUrl.origin;
  const link = `${origin}/share/${share.token}`;
  const sender = lh === 'roborns' ? 'Roborns <roborns@codelude.com>' : 'Codelude <hello@codelude.com>';
  const fromName = lh !== 'none' ? LETTERHEADS[lh].entity : 'Codelude';
  const docTitle = title || slug;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from:    sender,
      to:      [email],
      replyTo: 'shawaz@codelude.com',
      subject: `Document shared with you — ${docTitle}`,
      html: `
        <div style="font-family:monospace;background:#0a0a08;color:#f5f3ee;padding:40px;max-width:600px;margin:0 auto;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#c8f53a;margin-bottom:8px;">${fromName}</div>
          <div style="font-size:22px;font-weight:700;margin-bottom:24px;letter-spacing:-0.02em;">A document has been shared with you</div>

          <div style="background:#111110;border:1px solid #252522;border-left:2px solid #c8f53a;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:11px;color:#7a7870;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Document</div>
            <div style="font-size:14px;color:#f5f3ee;font-weight:600;">${docTitle}</div>
          </div>

          <p style="font-size:13px;color:#7a7870;line-height:1.8;font-weight:300;margin-bottom:24px;">
            To view it, open the secure link below and verify with the one-time code
            we'll send to this email address. The link expires in 7 days.
          </p>

          <a href="${link}" style="display:inline-block;background:#c8f53a;color:#0a0a08;font-family:monospace;font-size:12px;letter-spacing:1px;padding:10px 20px;text-decoration:none;font-weight:600;">View document →</a>

          <div style="border-top:1px solid #252522;padding-top:16px;margin-top:32px;font-size:11px;color:#7a7870;">
            This document is confidential and intended only for ${email}.<br/>
            Questions? Reply directly to this email.
          </div>
        </div>
      `,
    });
  } catch {
    // Roll back so a dead link isn't left dangling.
    updateShare(share.token, { revoked: true });
    return NextResponse.json({ error: 'Failed to send email. Check RESEND_API_KEY in .env.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, share: publicShare(share) });
}

export async function DELETE(req: NextRequest) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: 'token required' }, { status: 400 });
  const updated = updateShare(token, { revoked: true });
  if (!updated) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json({ ok: true });
}
