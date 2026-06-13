import { NextRequest, NextResponse } from 'next/server';

const BASE = 'https://thendaragc.cps.golf';

async function proxy(req: NextRequest, path: string[], method: string) {
  const url = `${BASE}/identityapi/${path.join('/')}`;

  // Only forward what the identity endpoints need — no browser headers
  const headers: Record<string, string> = {};
  const ct = req.headers.get('content-type');
  if (ct) headers['content-type'] = ct;
  const auth = req.headers.get('authorization');
  if (auth) headers['authorization'] = auth;

  const options: RequestInit = { method, headers, cache: 'no-store' };
  if (method !== 'GET') options.body = await req.text();

  const res = await fetch(url, options);
  const text = await res.text();
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path, 'POST');
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path, 'GET');
}
