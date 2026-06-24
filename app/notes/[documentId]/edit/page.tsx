import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/apollo-client';
import { NOTE_DETAIL, TAGS } from '@/lib/graphql';
import { updateNoteAction } from './actions';

type Tag = {
  documentId: string;
  name: string;
  slug: string;
  color?: string | null;
};

type NoteDetail = {
  documentId: string;
  title: string;
  content: string | null;
  tags: Tag[];
};

export const dynamic = 'force-dynamic';

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;

  const [noteRes, tagsRes] = await Promise.all([
    query<{ note: NoteDetail | null }>({
      query: NOTE_DETAIL,
      variables: { documentId },
    }),
    query<{ tags: Tag[] }>({ query: TAGS }),
  ]);

  const note = noteRes.data?.note;
  if (!note) notFound();

  const allTags = tagsRes.data?.tags ?? [];
  const selectedTagIds = new Set(note.tags.map((t) => t.documentId));
  const boundAction = updateNoteAction.bind(null, documentId);

  return (
    <div className="max-w-2xl space-y-6">
      <header className="space-y-1">
        <Link
          href={`/notes/${documentId}`}
          className="text-sm text-neutral-500 hover:text-black"
        >
          ← Back to note
        </Link>
        <h1 className="text-2xl font-semibold">Edit note</h1>
        <p className="text-sm text-neutral-500">
          Submits the{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
            updateNote
          </code>{' '}
          Shadow CRUD mutation.
        </p>
      </header>

      <form action={boundAction} className="space-y-5">
        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm font-medium">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            required
            defaultValue={note.title}
            className="w-full rounded border px-3 py-2 text-sm"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="content" className="block text-sm font-medium">
            Content (Markdown)
          </label>
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={note.content ?? ''}
            className="w-full rounded border px-3 py-2 font-mono text-sm"
          />
        </div>

        {allTags.length > 0 && (
          <fieldset className="space-y-2">
            <legend className="text-sm font-medium">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {allTags.map((t) => (
                <label
                  key={t.documentId}
                  className="inline-flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-sm hover:bg-neutral-50 has-[:checked]:border-black has-[:checked]:bg-neutral-100"
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={t.documentId}
                    defaultChecked={selectedTagIds.has(t.documentId)}
                    className="sr-only"
                  />
                  {t.name}
                </label>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
          >
            Save changes
          </button>
          <Link
            href={`/notes/${documentId}`}
            className="text-sm text-neutral-500 hover:text-black"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
