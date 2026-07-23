"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";

export default function ParticipantsPage() {
  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("roster").select("*").order("participant");
      setRows(data || []);
    };
    load();
  }, []);

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Participant roster</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Participant</th>
                <th className="border p-2 text-left">Cohort Start</th>
                <th className="border p-2 text-left">Mentor</th>
                <th className="border p-2 text-left">Rotation</th>
                <th className="border p-2 text-left">Stage</th>
                <th className="border p-2 text-left">Active Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td>
                  <td className="border p-2">{r.cohort_start || "-"}</td>
                  <td className="border p-2">{r.mentor || "-"}</td>
                  <td className="border p-2">{r.rotation || "-"}</td>
                  <td className="border p-2">{r.stage}</td>
                  <td className="border p-2">{r.active_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
