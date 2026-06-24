'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { UPDATE_NOTE } from '@/lib/graphql';

const asString = (v: FormDataEntryValue | null) =>
  typeof v === 'string' ? v : '';

export async function updateNoteAction(documentId: string, formData: FormData) {
  const title = asString(formData.get('title')).trim();
  const content = asString(formData.get('content'));
  const tagIds = formData.getAll('tagIds').filter((v) => typeof v === 'string');

  if (!title) return;

  await getClient().mutate({
    mutation: UPDATE_NOTE,
    variables: {
      documentId,
      data: { title, content, tags: tagIds },
    },
  });

  revalidatePath('/');
  revalidatePath(`/notes/${documentId}`);
  redirect(`/notes/${documentId}`);
}
