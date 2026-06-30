'use server';

import { redirect } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { LOGIN } from '@/lib/graphql';
import { setJwt } from '@/lib/auth';

const asString = (v: FormDataEntryValue | null) =>
  typeof v === 'string' ? v : '';

export async function loginAction(formData: FormData) {
  const identifier = asString(formData.get('identifier')).trim();
  const password = asString(formData.get('password'));

  if (!identifier || !password) return;

  let jwt: string | undefined;
  try {
    const { data } = await getClient().mutate<{
      login: { jwt: string };
    }>({
      mutation: LOGIN,
      variables: { input: { identifier, password } },
    });
    jwt = data?.login?.jwt;
  } catch {
    // Apollo throws CombinedGraphQLErrors when Strapi returns an error
    // (e.g. "Invalid identifier or password"). Catch it and fall through
    // to the !jwt redirect below; otherwise the throw bubbles to Next's
    // runtime overlay instead of giving the user an error message.
  }

  if (!jwt) redirect('/login?error=invalid');

  await setJwt(jwt);
  redirect('/');
}
