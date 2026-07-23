"use client";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function Topbar({ name, role }: { name: string; role: string }) {
  const router = useRouter();
  const logout = async () => { await supabase.auth.signOut(); router.push("/login"); };
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome, {name}</h1>
        <p className="text-gray-500 text-sm">{role === "admin" ? "Leadership-confidential workspace" : "Participant workspace"}</p>
      </div>
      <button onClick={logout} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold">Log out</button>
    </div>
  );
}
