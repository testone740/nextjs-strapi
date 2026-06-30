import Link from 'next/link';
import { query } from '@/lib/apollo-client';
import { ME } from '@/lib/graphql';
import { logoutAction } from '@/app/logout/actions';

const LINKS = [
  { href: '/', label: 'Notes' },
  { href: '/search', label: 'Search' },
  { href: '/stats', label: 'Stats' },
];

type Me = { id: string; username: string; email: string } | null;

export async function Nav() {
  // The Apollo client (Step 8.2) injects the JWT cookie automatically.
  // On /login and /register there is no JWT, so the query throws and we
  // fall back to anonymous.
  let me: Me = null;
  try {
    const { data } = await query<{ me: Me }>({ query: ME });
    me = data?.me ?? null;
  } catch {
    me = null;
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold">
          Notes
        </Link>
        <nav className="flex items-center gap-5 text-sm text-neutral-600">
          {me ? (
            <>
              {LINKS.map((l) => (
                <Link key={l.href} href={l.href} className="hover:text-black">
                  {l.label}
                </Link>
              ))}
              <Link
                href="/notes/new"
                className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
              >
                New
              </Link>
              <span className="text-neutral-500">@{me.username}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-neutral-500 hover:text-black"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-neutral-800"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
