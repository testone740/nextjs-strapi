import { cookies } from 'next/headers';

export const JWT_COOKIE = 'strapi_jwt';

export async function getJwt(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(JWT_COOKIE)?.value;
}

export async function setJwt(jwt: string): Promise<void> {
  const store = await cookies();
  store.set(JWT_COOKIE, jwt, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function clearJwt(): Promise<void> {
  const store = await cookies();
  store.delete(JWT_COOKIE);
}
