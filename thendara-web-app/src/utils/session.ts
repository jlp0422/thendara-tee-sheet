const KEYS = {
  ACCESS_TOKEN: 'access_token',
  TOKEN_EXPIRY: 'token_expiry',
  CREDENTIALS: 'credentials',
  GOLFER_ID: 'golfer_id',
  CLASS_CODE: 'class_code',
  EMAIL: 'email',
  FULL_NAME: 'full_name',
} as const;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

function set(key: string, value: string) { localStorage.setItem(key, value); }
function get(key: string): string | null { return localStorage.getItem(key); }
function del(key: string) { localStorage.removeItem(key); }

export async function saveSession(params: {
  accessToken: string;
  golferId: number;
  classCode: string;
  email: string;
  fullName: string;
}) {
  const expiry = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();
  set(KEYS.ACCESS_TOKEN, params.accessToken);
  set(KEYS.TOKEN_EXPIRY, expiry);
  set(KEYS.GOLFER_ID, String(params.golferId));
  set(KEYS.CLASS_CODE, params.classCode);
  set(KEYS.EMAIL, params.email);
  set(KEYS.FULL_NAME, params.fullName);
}

export async function saveCredentials(username: string, password: string) {
  set(KEYS.CREDENTIALS, JSON.stringify({ username, password }));
}

export async function getCredentials(): Promise<{ username: string; password: string } | null> {
  const raw = get(KEYS.CREDENTIALS);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export async function getAccessToken(): Promise<string | null> {
  return get(KEYS.ACCESS_TOKEN);
}

export async function getGolferId(): Promise<number | null> {
  const raw = get(KEYS.GOLFER_ID);
  return raw ? parseInt(raw, 10) : null;
}

export async function getClassCode(): Promise<string | null> {
  return get(KEYS.CLASS_CODE);
}

export async function getEmail(): Promise<string | null> {
  return get(KEYS.EMAIL);
}

export async function getFullName(): Promise<string | null> {
  return get(KEYS.FULL_NAME);
}

export async function isSessionValid(): Promise<boolean> {
  const expiry = get(KEYS.TOKEN_EXPIRY);
  if (!expiry) return false;
  return new Date(expiry).getTime() > Date.now();
}

export async function rollSessionExpiry() {
  set(KEYS.TOKEN_EXPIRY, new Date(Date.now() + THIRTY_DAYS_MS).toISOString());
}

export async function clearSession() {
  Object.values(KEYS).forEach(del);
}
