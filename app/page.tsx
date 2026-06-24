import { query } from '@/lib/apollo-client';
import { ACTIVE_NOTES } from '@/lib/graphql';
import { NoteCard } from '@/components/note-card';

type Note = Parameters<typeof NoteCard>[0]['note'];

export const dynamic = 'force-dynamic';

export default async function Home() {
  const { data } = await query<{ notes: Note[] }>({ query: ACTIVE_NOTES });
  const notes = data?.notes ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Your notes</h1>
        <p className="text-sm text-neutral-500">
          {notes.length} active, sorted by pinned then recency. Powered by the{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
            notes
          </code>{' '}
          Shadow CRUD query.
        </p>
      </header>

      {notes.length === 0 ? (
        <p className="text-sm text-neutral-500">No notes yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {notes.map((n) => (
            <NoteCard key={n.documentId} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
