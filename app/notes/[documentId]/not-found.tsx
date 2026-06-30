// starter-template/app/notes/[documentId]/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl space-y-4 py-12 text-center">
      <h1 className="text-2xl font-semibold">Note not found</h1>
      <p className="text-sm text-neutral-600">
        This note either doesn&rsquo;t exist or isn&rsquo;t yours. We
        don&rsquo;t tell you which: ownership scoping makes other users&rsquo;
        notes invisible to you (Step 6&rsquo;s Document Service middleware). If
        you typed this URL hoping to peek at a friend&rsquo;s note, it&rsquo;s
        working as designed.
      </p>
      <Link
        href="/"
        className="inline-block rounded bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
      >
        Back to your notes
      </Link>
    </div>
  );
}
