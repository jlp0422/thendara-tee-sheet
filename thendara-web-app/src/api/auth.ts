import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { saveSession, saveCredentials, clearSession } from '@/utils/session';
import { useAuthStore } from '@/store/authStore';

type JwtPayload = {
  sub: string;
  golferId: number;
  preferred_username: string;
  classCode: string;
  email: string;
};

type UserInfo = {
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  preferred_username?: string;
};

export async function login(username: string, password: string): Promise<void> {
  const params = new URLSearchParams({
    grant_type: 'password',
    scope: 'openid profile onlinereservation sale inventory sh customer email recommend references',
    username,
    password,
    client_id: 'js1',
    client_secret: 'v4secret',
  });

  const res = await axios.post(
    `/api/identityapi/connect/token`,
    params.toString(),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
  );

  const { access_token } = res.data;
  const decoded = jwtDecode<JwtPayload>(access_token);

  let fullName = '';
  try {
    const userInfoRes = await axios.get<UserInfo>(
      `/api/identityapi/connect/userinfo`,
      { headers: { Authorization: `Bearer ${access_token}` } },
    );
    const u = userInfoRes.data;
    // userinfo exposes first_name/last_name; `name` is "Last First" (reversed), so prefer the parts.
    fullName = [u.first_name, u.last_name].filter(Boolean).join(' ') || u.name || '';
  } catch {
    // Non-fatal
  }

  const email = decoded.email ?? decoded.preferred_username ?? username;

  await Promise.all([
    saveSession({ accessToken: access_token, golferId: decoded.golferId, classCode: decoded.classCode, email, fullName }),
    saveCredentials(username, password),
  ]);

  useAuthStore.getState().setAuth(access_token, decoded.golferId, decoded.classCode, email, fullName);
}

export async function logout(): Promise<void> {
  await clearSession();
  useAuthStore.getState().clearAuth();
}
