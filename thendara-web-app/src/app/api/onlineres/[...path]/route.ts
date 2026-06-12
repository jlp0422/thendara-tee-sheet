import { NextRequest, NextResponse } from 'next/server';
import initCycleTLS, { type CycleTLSClient } from 'cycletls';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BASE = 'https://thendaragc.cps.golf';

// Cloudflare runs a Managed Challenge on the whole /onlineres namespace, gated on the
// caller's TLS + HTTP/2 fingerprint. Plain Node fetch is flagged as a bot (403 "Just a
// moment..."). cycletls forges a real Chrome fingerprint, which Cloudflare accepts —
// requests then reach the API and return real responses (401 without a token, 200 with).
const CHROME_JA3 =
  '771,4865-4866-4867-49195-49199-49196-49200-52393-52392-49171-49172-156-157-47-53,' +
  '0-23-65281-10-11-35-16-5-13-18-51-45-43-27-17513,29-23-24,0';
const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// ClubProphet's API-specific headers (the browser Axios client sends these too).
const FIXED: Record<string, string> = {
  'client-id': 'onlineresweb',
  'X-TerminalId': '3',
  'x-websiteid': 'ea9504eb-cf5e-4be6-1c6e-08db47e738a5',
  'x-ismobile': 'false',
  'x-productid': '1',
  'x-componentid': '1',
  'x-siteid': '1',
  'x-timezone-offset': '240',
  'x-timezoneid': 'America/New_York',
  'x-moduleid': '7',
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9',
  origin: BASE,
  referer: `${BASE}/onlineresweb/`,
};

// Spin up a single cycletls instance (it runs a helper process) and reuse it across
// requests. Created lazily so the dev server only pays the cost on first API call.
let cyclePromise: Promise<CycleTLSClient> | null = null;
function getCycle(): Promise<CycleTLSClient> {
  if (!cyclePromise) cyclePromise = initCycleTLS();
  return cyclePromise;
}

async function proxy(req: NextRequest, path: string[], method: 'get' | 'post') {
  const incoming = new URL(req.url);
  const dest = new URL(`${BASE}/onlineres/${path.join('/')}`);
  incoming.searchParams.forEach((v, k) => dest.searchParams.set(k, v));

  const headers: Record<string, string> = { ...FIXED };
  const auth = req.headers.get('authorization');
  if (auth) headers['Authorization'] = auth;
  const requestId = req.headers.get('x-requestid');
  if (requestId) headers['x-requestid'] = requestId;
  const ct = req.headers.get('content-type');
  if (ct) headers['content-type'] = ct;

  const body = method === 'post' ? await req.text() : undefined;

  const cycle = await getCycle();
  const res = await cycle(
    dest.toString(),
    { ja3: CHROME_JA3, userAgent: CHROME_UA, headers, body },
    method,
  );

  // cycletls exposes the body as `data` (string or already-parsed JSON), not `body`.
  const text = typeof res.data === 'string' ? res.data : JSON.stringify(res.data ?? '');
  if (res.status === 403) {
    console.error(`[proxy] 403 from ClubProphet: ${method} ${dest.toString()}\n${text.slice(0, 300)}`);
  }
  return new NextResponse(text, {
    status: res.status,
    headers: { 'content-type': 'application/json' },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path, 'get');
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  return proxy(req, (await params).path, 'post');
}
