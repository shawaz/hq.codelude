import { NextRequest, NextResponse } from 'next/server';
import { addBudgetLine, removeBudgetLine } from '@/lib/site-projects';

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { label, category, amount, currency, notes } = await req.json();
  if (!label?.trim() || !category?.trim() || typeof amount !== 'number' || !currency?.trim()) {
    return NextResponse.json({ error: 'label, category, amount, currency required' }, { status: 400 });
  }
  const line = addBudgetLine(id, { label: label.trim(), category: category.trim(), amount, currency: currency.trim(), notes: notes?.trim() || undefined });
  if (!line) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(line, { status: 201 });
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const lineId = req.nextUrl.searchParams.get('lineId');
  if (!lineId) return NextResponse.json({ error: 'lineId required' }, { status: 400 });
  removeBudgetLine(id, lineId);
  return NextResponse.json({ ok: true });
}
