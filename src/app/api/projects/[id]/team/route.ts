import { NextRequest, NextResponse } from 'next/server';
import { addTeamMember, removeTeamMember } from '@/lib/site-projects';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { name, role, contact } = await req.json();
  if (!name?.trim() || !role?.trim()) {
    return NextResponse.json({ error: 'name and role required' }, { status: 400 });
  }
  const member = addTeamMember(id, { name: name.trim(), role: role.trim(), contact: contact?.trim() || undefined });
  if (!member) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(member, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const memberId = req.nextUrl.searchParams.get('memberId');
  if (!memberId) return NextResponse.json({ error: 'memberId required' }, { status: 400 });
  removeTeamMember(id, memberId);
  return NextResponse.json({ ok: true });
}
