'use server';

import { redirect } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { REGISTER } from '@/lib/graphql';
import { setJwt } from '@/lib/auth';

const asString = (v: FormDataEntryValue | null) =>
  typeof v === 'string' ? v : '';

export async function registerAction(formData: FormData) {
  const username = asString(formData.get('username')).trim();
  const email = asString(formData.get('email')).trim();
  const password = asString(formData.get('password'));

  if (!username || !email || !password) return;

  let jwt: string | undefined;
  try {
    const { data } = await getClient().mutate<{
      register: { jwt: string };
    }>({
      mutation: REGISTER,
      variables: { input: { username, email, password } },
    });
    jwt = data?.register?.jwt;
  } catch {
    // Same try/catch shape as the login action: Apollo throws on Strapi
    // validation errors (duplicate username/email, password too short),
    // so we catch and fall through to the redirect below.
  }

  if (!jwt) redirect('/register?error=invalid');

  await setJwt(jwt);
  redirect('/');
}
