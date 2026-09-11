import { NextRequest, NextResponse } from 'next/server';
import { requireApiPage } from '@/lib/api-auth';
import { Resend } from 'resend';

export async function POST(req: NextRequest) {
  const guard = await requireApiPage('nda');
  if (guard instanceof NextResponse) return guard;
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { ndaId, party, toEmail, venture, purpose, personalNote } = await req.json();

  if (!toEmail || !party) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const NDA_TEMPLATE_URL = 'https://drive.google.com/drive/folders/codelude-legal-templates';

  try {
    await resend.emails.send({
      from:    'Codelude Legal <legal@codelude.com>',
      to:      [toEmail],
      replyTo: 'shawaz@codelude.com',
      subject: `NDA signature requested — Codelude × ${party}`,
      html: `
        <div style="font-family:monospace;background:#0a0a08;color:#f5f3ee;padding:40px;max-width:600px;margin:0 auto;">
          <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#eeeeee;margin-bottom:8px;">Non-Disclosure Agreement</div>
          <div style="font-size:22px;font-weight:700;margin-bottom:24px;letter-spacing:-0.02em;">Signature requested</div>

          <p style="font-family:monospace;font-size:13px;color:#7a7870;line-height:1.8;font-weight:300;margin-bottom:24px;">
            Codelude is requesting your signature on a mutual Non-Disclosure Agreement (NDA) for the following purpose:
          </p>

          <div style="background:#111110;border:1px solid #252522;border-left:2px solid #eeeeee;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:11px;color:#7a7870;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Reference</div>
            <div style="font-size:13px;margin-bottom:6px;"><strong style="color:#f5f3ee;">${ndaId}</strong></div>
            <div style="font-size:13px;color:#7a7870;margin-bottom:4px;">Venture: ${venture}</div>
            <div style="font-size:13px;color:#7a7870;">Purpose: ${purpose}</div>
          </div>

          ${personalNote ? `
          <div style="background:#111110;border:1px solid #252522;padding:16px 20px;margin-bottom:24px;">
            <div style="font-size:11px;color:#7a7870;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">Note from Codelude</div>
            <div style="font-size:13px;color:#f5f3ee;line-height:1.7;font-weight:300;">${personalNote}</div>
          </div>
          ` : ''}

          <div style="margin-bottom:24px;">
            <div style="font-size:11px;color:#7a7870;letter-spacing:1px;text-transform:uppercase;margin-bottom:12px;">To sign</div>
            <p style="font-size:13px;color:#7a7870;line-height:1.8;font-weight:300;margin-bottom:12px;">
              Reply to this email confirming your agreement to the terms, or use the template below. Once both parties have signed, a copy will be shared with you.
            </p>
            <a href="${NDA_TEMPLATE_URL}" style="display:inline-block;background:#eeeeee;color:#0a0a08;font-family:monospace;font-size:12px;letter-spacing:1px;padding:10px 20px;text-decoration:none;font-weight:600;">View NDA template →</a>
          </div>

          <div style="border-top:1px solid #252522;padding-top:16px;font-size:11px;color:#7a7870;">
            Questions? Reply directly to this email.<br/>
            Codelude · hello@codelude.com · codelude.com
          </div>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('NDA send error:', err);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
