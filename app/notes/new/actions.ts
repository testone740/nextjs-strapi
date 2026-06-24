'use server';

// import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getClient } from '@/lib/apollo-client';
import { CREATE_NOTE } from '@/lib/graphql';

// `formData.get()` returns `string | File | null`. Narrow before using.
const asString = (v: FormDataEntryValue | null) =>
  typeof v === 'string' ? v : '';

export async function createNoteAction(formData: FormData) {
  const title = asString(formData.get('title')).trim();
  const content = asString(formData.get('content'));
  const tagIds = formData
    .getAll('tagIds')
    .filter((v): v is string => typeof v === 'string');

  if (!title) return;

  const { data } = await getClient().mutate({
    mutation: CREATE_NOTE,
    variables: {
      data: {
        title,
        content,
        pinned: false,
        archived: false,
        tags: tagIds,
      },
    },
  });

  // revalidatePath('/');

  const newId = data?.createNote?.documentId;

  if (newId) redirect(`/`);
}
