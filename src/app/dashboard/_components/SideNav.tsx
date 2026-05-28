"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SideNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: "dashboard", exact: true },
    { name: "My Roadmap", href: "/dashboard/roadmap", icon: "route", exact: false },
    { name: "Practice", href: "/dashboard/practice", icon: "exercise", exact: false },
    { name: "Profile", href: "/dashboard/profile", icon: "person", exact: false },
  ];

  return (
    <aside className="w-[280px] h-full fixed left-0 top-0 glass-nav border-r border-white/5 flex flex-col p-6 z-40">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-gradient-verdant tracking-tight font-serif-accent">PrepPath</h1>
        <p className="text-xs text-white/50 font-medium mt-1 uppercase tracking-widest">AI Interview Prep</p>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-[#2E4024]/40 text-[#D4F87A] border border-[#D4F87A]/20 shadow-[0_0_15px_rgba(212,248,122,0.1)]"
                  : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <span className="material-symbols-outlined text-lg group-hover:scale-110 transition-transform">
                {item.icon}
              </span>
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6">
        <Link href="/dashboard/practice">
          <button className="w-full btn-verdant font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer overflow-hidden relative group">
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
            <span className="material-symbols-outlined relative z-10 text-xl">play_arrow</span>
            <span className="relative z-10">Start Practice</span>
          </button>
        </Link>
      </div>
    </aside>
  );
}
