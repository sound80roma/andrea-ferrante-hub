import Link from "next/link";
import { useRouter } from "next/router";
import type { ReactNode } from "react";


function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const { pathname } = useRouter();
  const active = pathname === href || (href !== "/" && pathname.startsWith(href));
  const base = "hover:text-slate-700";
  const cls = active ? "text-slate-900 font-semibold" : "text-slate-600";
  return (
    <Link href={href} className={`${base} ${cls}`}>
      {children}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 bg-white/90 border-b border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* BRAND → cliccabile verso la home */}
        <Link
          href="/"
          aria-label="Vai alla home"
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-300 rounded-xl"
        >
          <div className="h-9 w-9 rounded-2xl bg-slate-900 text-white grid place-content-center font-bold transition group-hover:scale-105">
            AF
          </div>
          <div>
            <div className="text-sm uppercase tracking-wider text-slate-500 group-hover:text-slate-700">
              Andrea Ferrante
            </div>
            <div className="text-xs text-slate-400">app hub personale</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/#apps" className="hover:text-slate-700">App</Link>
          <Link href="/lavinio-booking" className="rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-gray-300 hover:bg-gray-50"           >
             Prenota Lavinio
           </Link>
          <a href="/houses" className="hover:text-slate-700">Affitto studenti</a>
          <NavLink href="/contact">Contatti</NavLink>
        </nav>
      </div>
    </header>
  );
}
