"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/participants", label: "Participants" },
  { href: "/nonnegotiables", label: "Non-Negotiables" },
  { href: "/milestones", label: "Milestones" },
  { href: "/assessments", label: "Quarterly Assessment" },
  { href: "/facilitation", label: "Facilitation" },
  { href: "/impact", label: "Participant Impact" },
  { href: "/operations", label: "Business & Retreat" },
  { href: "/remediation", label: "Remediation" },
  { href: "/headcoach", label: "Head Coach Panel", adminOnly: true },
  { href: "/definitions", label: "Definitions" }
];

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();
  return (
    <aside className="bg-brand text-white w-64 min-h-screen p-5 sticky top-0">
      <h2 className="text-lg font-bold mb-1">Leadership Portal</h2>
      <p className="text-xs text-blue-100 mb-4">Divine Awakening Curriculum</p>
      <nav className="space-y-1">
        {links.filter(l => !l.adminOnly || role === "admin" || role === "coach").map(l => (
          <Link key={l.href} href={l.href} className={`block px-3 py-2 rounded-lg text-sm ${pathname === l.href ? "bg-white/20" : "hover:bg-white/10"}`}>
            {l.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
