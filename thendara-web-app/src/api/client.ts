import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/authStore';
import { getCredentials, saveSession, getGolferId, getClassCode, getEmail, getFullName } from '@/utils/session';

function randomUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// Requests go through our Next.js server proxy (/api/onlineres/*). Direct browser
// calls are blocked by CORS; the proxy mimics ClubProphet's own portal to pass Cloudflare.
const BASE_URL = '';

const FIXED_HEADERS = {
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
};

export const client = axios.create({ baseURL: BASE_URL });

client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers['x-requestid'] = randomUUID();
  Object.assign(config.headers, FIXED_HEADERS);
  return config;
});

let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

client.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(client(original));
        });
      });
    }

    original._retry = true;
    isRefreshing = true;

    try {
      const creds = await getCredentials();
      if (!creds) throw new Error('No stored credentials');

      const params = new URLSearchParams({
        grant_type: 'password',
        scope: 'openid profile onlinereservation sale inventory sh customer email recommend references',
        username: creds.username,
        password: creds.password,
        client_id: 'js1',
        client_secret: 'v4secret',
      });

      const res = await axios.post(
        `/api/identityapi/connect/token`,
        params.toString(),
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
      );

      const { access_token } = res.data;
      useAuthStore.getState().updateToken(access_token);

      const [golferId, classCode, email, fullName] = await Promise.all([
        getGolferId(), getClassCode(), getEmail(), getFullName(),
      ]);
      await saveSession({
        accessToken: access_token,
        golferId: golferId!,
        classCode: classCode!,
        email: email ?? '',
        fullName: fullName ?? '',
      });

      refreshQueue.forEach((cb) => cb(access_token));
      refreshQueue = [];
      original.headers.Authorization = `Bearer ${access_token}`;
      return client(original);
    } catch {
      refreshQueue = [];
      useAuthStore.getState().clearAuth();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
