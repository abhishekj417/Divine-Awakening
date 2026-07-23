"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session) { router.push("/login"); return; }
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", sessionData.session.user.id).single();
      setProfile(profileData);
      setLoading(false);
    };
    load();
  }, [router]);

  if (loading) return <div className="p-10">Loading...</div>;
  if (!profile) return <div className="p-10">No profile found. Contact admin.</div>;

  return (
    <div className="flex">
      <Sidebar role={profile.role} />
      <main className="flex-1 p-6">
        <Topbar name={profile.full_name} role={profile.role} />
        {children}
      </main>
    </div>
  );
}
