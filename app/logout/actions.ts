'use server';

import { redirect } from 'next/navigation';
import { clearJwt } from '@/lib/auth';

export async function logoutAction() {
  await clearJwt();
  redirect('/login');
}
