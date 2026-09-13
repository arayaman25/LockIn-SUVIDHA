import { NextResponse } from 'next/server';
import { SUVIDHA_SCHEMES } from '@/lib/data';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * GET /api/schemes
 * Attempts to fetch schemes from the Python backend.
 * Falls back to the static SUVIDHA_SCHEMES dataset if backend is unavailable.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const q = searchParams.get('q');

  try {
    const backendUrl = new URL(`${BACKEND_URL}/api/schemes`);
    if (category && category !== 'all') backendUrl.searchParams.set('category', category);
    if (q) backendUrl.searchParams.set('q', q);

    const backendRes = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: AbortSignal.timeout(4000),
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      const schemes = Array.isArray(data) ? data : data.schemes ?? data.data ?? [];
      return NextResponse.json({ schemes, source: 'backend' });
    }
  } catch {
    // Backend unavailable - fall through to local data
  }

  let schemes = [...SUVIDHA_SCHEMES];

  if (category && category !== 'all') {
    schemes = schemes.filter((s) => s.category === category);
  }

  if (q) {
    const lower = q.toLowerCase();
    schemes = schemes.filter(
      (s) =>
        s.name.toLowerCase().includes(lower) ||
        s.desc.toLowerCase().includes(lower) ||
        s.ministry.toLowerCase().includes(lower) ||
        s.tags.some((t) => t.toLowerCase().includes(lower))
    );
  }

  return NextResponse.json({ schemes, source: 'local' });
}
