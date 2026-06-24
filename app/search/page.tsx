// app/search/page.tsx
import { query } from '@/lib/apollo-client';
import { SEARCH_NOTES } from '@/lib/graphql';
import { NoteCard } from '@/components/note-card';
import { NotesSearch } from '@/components/notes-search';

type Note = Parameters<typeof NoteCard>[0]['note'];

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const term = (q ?? '').trim();

  let notes: Note[] = [];
  if (term) {
    const { data } = await query<{ searchNotes: Note[] }>({
      query: SEARCH_NOTES,
      variables: { q: term },
    });
    notes = data?.searchNotes ?? [];
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Search</h1>
        <p className="text-sm text-neutral-500">
          Calls the{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
            searchNotes
          </code>{' '}
          custom query. Archived notes are excluded.
        </p>
      </header>

      <NotesSearch initialQuery={term} />

      {term && (
        <p className="text-sm text-neutral-500">
          {notes.length} result{notes.length === 1 ? '' : 's'} for &ldquo;{term}
          &rdquo;.
        </p>
      )}

      {notes.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((n) => (
            <NoteCard key={n.documentId} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
