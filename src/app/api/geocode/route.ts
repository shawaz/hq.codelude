import { NextRequest, NextResponse } from 'next/server';
import { requireApiUser } from '@/lib/api-auth';

export async function GET(req: NextRequest) {
  const guard = await requireApiUser();
  if (guard instanceof NextResponse) return guard;
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q) return NextResponse.json([]);

  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({ q, format: 'json', limit: '5' })}`;
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'hq.codelude.com site-projects map (codelude@gmail.com)' } });
    if (!res.ok) return NextResponse.json([]);
    const data: { display_name: string; lat: string; lon: string }[] = await res.json();
    return NextResponse.json(data.map(d => ({
      label: d.display_name,
      lon: parseFloat(d.lon),
      lat: parseFloat(d.lat),
    })));
  } catch {
    return NextResponse.json([]);
  }
}
