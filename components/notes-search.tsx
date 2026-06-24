'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const DEBOUNCE_MS = 300;

export function NotesSearch({ initialQuery }: { initialQuery: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(initialQuery);
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setValue(initialQuery), [initialQuery]);

  function pushQuery(searchTerm: string) {
    const params = new URLSearchParams(searchParams.toString());
    const trimmed = searchTerm.trim();
    if (trimmed) params.set('q', trimmed);
    else params.delete('q');
    const qs = params.toString();
    startTransition(() =>
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false }),
    );
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const searchTerm = e.target.value;
    setValue(searchTerm);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => pushQuery(searchTerm), DEBOUNCE_MS);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (timerRef.current) clearTimeout(timerRef.current);
        pushQuery(value);
      }}
      className="flex items-center gap-2"
    >
      <input
        type="search"
        name="q"
        value={value}
        onChange={onChange}
        placeholder="Search notes by title…"
        className="flex-1 rounded border px-3 py-2 text-sm"
        autoComplete="off"
      />
      {isPending && (
        <span className="text-xs text-neutral-500">searching…</span>
      )}
    </form>
  );
}
