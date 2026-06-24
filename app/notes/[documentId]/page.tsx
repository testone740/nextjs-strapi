import Link from 'next/link';
import { notFound } from 'next/navigation';
import { query } from '@/lib/apollo-client';
import { NOTE_DETAIL } from '@/lib/graphql';
import { Markdown } from '@/components/markdown';
import { TagBadge } from '@/components/tag-badge';
import { NoteActions } from '@/components/note-actions';

type NoteDetail = {
  documentId: string;
  title: string;
  pinned: boolean;
  archived: boolean;
  wordCount: number;
  readingTime: number;
  updatedAt: string;
  content: string | null;
  tags: Array<{
    documentId: string;
    name: string;
    slug: string;
    color?: string | null;
  }>;
};

type NoteDetailPageProps = {
  params: Promise<{ documentId: string }>;
};

export const dynamic = 'force-dynamic';

export default async function NoteDetailPage({ params }: NoteDetailPageProps) {
  const { documentId } = await params;

  const { data } = await query<{ note: NoteDetail }>({
    query: NOTE_DETAIL,
    variables: { documentId },
  });

  const note = data?.note;

  if (!note) notFound();

  return (
    <article className="space-y-6">
      <Link href="/" className="text-sm text-neutral-500 hover:text-black">
        ← Back to notes
      </Link>

      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="flex items-center gap-2 text-3xl font-semibold">
            {note.pinned && <span aria-label="pinned">📌</span>}
            {note.title}
          </h1>
          <p className="text-sm text-neutral-500">
            {note.wordCount} words · ~{note.readingTime} min read · updated{' '}
            {new Date(note.updatedAt).toLocaleDateString()}
          </p>
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((t) => (
                <TagBadge key={t.documentId} tag={t} />
              ))}
            </div>
          )}
        </div>
        <NoteActions documentId={note.documentId} pinned={note.pinned} />
      </header>

      <Markdown>{note.content}</Markdown>
    </article>
  );
}
