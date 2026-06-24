'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { TOGGLE_PIN, ARCHIVE_NOTE } from '@/lib/graphql';

export async function togglePinAction(documentId: string) {
  await getClient().mutate({
    mutation: TOGGLE_PIN,
    variables: { documentId },
  });
  revalidatePath(`/notes/${documentId}`);
  // revalidatePath('/');
}

export async function archiveNoteAction(documentId: string) {
  await getClient().mutate({
    mutation: ARCHIVE_NOTE,
    variables: { documentId },
  });
  // revalidatePath('/');
  redirect('/');
}
