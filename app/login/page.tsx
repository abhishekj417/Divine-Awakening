"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); return; }
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md border">
        <h1 className="text-2xl font-bold text-brand mb-1">Divine Awakening Leadership Portal</h1>
        <p className="text-gray-500 text-sm mb-6">Log in to your quarterly leadership workspace.</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Email</label>
            <input className="w-full border rounded-lg px-3 py-2 mt-1" value={email} onChange={e => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <input className="w-full border rounded-lg px-3 py-2 mt-1" value={password} onChange={e => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button className="w-full bg-brand text-white py-2 rounded-lg font-semibold" type="submit">Log in</button>
        </form>
        <p className="text-xs text-gray-400 mt-4">Accounts are created by the admin in Supabase Auth. Contact leadership if you do not have credentials.</p>
      </div>
    </div>
  );
}
