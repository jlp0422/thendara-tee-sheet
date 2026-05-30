import * as SecureStore from 'expo-secure-store';

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

export async function saveSession(params: {
  accessToken: string;
  golferId: number;
  classCode: string;
  email: string;
  fullName: string;
}) {
  const expiry = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();
  await Promise.all([
    SecureStore.setItemAsync(KEYS.ACCESS_TOKEN, params.accessToken),
    SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, expiry),
    SecureStore.setItemAsync(KEYS.GOLFER_ID, String(params.golferId)),
    SecureStore.setItemAsync(KEYS.CLASS_CODE, params.classCode),
    SecureStore.setItemAsync(KEYS.EMAIL, params.email),
    SecureStore.setItemAsync(KEYS.FULL_NAME, params.fullName),
  ]);
}

export async function saveCredentials(username: string, password: string) {
  await SecureStore.setItemAsync(
    KEYS.CREDENTIALS,
    JSON.stringify({ username, password }),
  );
}

export async function getCredentials(): Promise<{ username: string; password: string } | null> {
  const raw = await SecureStore.getItemAsync(KEYS.CREDENTIALS);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function getAccessToken(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.ACCESS_TOKEN);
}

export async function getGolferId(): Promise<number | null> {
  const raw = await SecureStore.getItemAsync(KEYS.GOLFER_ID);
  return raw ? parseInt(raw, 10) : null;
}

export async function getClassCode(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.CLASS_CODE);
}

export async function getEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.EMAIL);
}

export async function getFullName(): Promise<string | null> {
  return SecureStore.getItemAsync(KEYS.FULL_NAME);
}

export async function isSessionValid(): Promise<boolean> {
  const expiry = await SecureStore.getItemAsync(KEYS.TOKEN_EXPIRY);
  if (!expiry) return false;
  return new Date(expiry).getTime() > Date.now();
}

export async function rollSessionExpiry() {
  const expiry = new Date(Date.now() + THIRTY_DAYS_MS).toISOString();
  await SecureStore.setItemAsync(KEYS.TOKEN_EXPIRY, expiry);
}

export async function clearSession() {
  await Promise.all(Object.values(KEYS).map((k) => SecureStore.deleteItemAsync(k)));
}
