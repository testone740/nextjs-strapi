// app/tags/[slug]/page.tsx
import Link from 'next/link';
import { query } from '@/lib/apollo-client';
import { NOTES_BY_TAG } from '@/lib/graphql';
import { NoteCard } from '@/components/note-card';

type Note = Parameters<typeof NoteCard>[0]['note'];

export const dynamic = 'force-dynamic';

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data } = await query<{ notesByTag: Note[] }>({
    query: NOTES_BY_TAG,
    variables: { slug },
  });
  const notes = data?.notesByTag ?? [];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <Link href="/" className="text-sm text-neutral-500 hover:text-black">
          ← Back to notes
        </Link>
        <h1 className="text-2xl font-semibold">
          Notes tagged{' '}
          <code className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-lg">
            {slug}
          </code>
        </h1>
        <p className="text-sm text-neutral-500">
          Calls the{' '}
          <code className="rounded bg-neutral-100 px-1 py-0.5 font-mono text-xs">
            notesByTag
          </code>{' '}
          custom query, which runs a nested relation filter on Tag.
        </p>
      </header>

      {notes.length === 0 ? (
        <p className="text-sm text-neutral-500">
          No active notes tagged <code className="font-mono">{slug}</code>.
        </p>
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
