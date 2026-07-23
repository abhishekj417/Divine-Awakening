"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS, MILESTONES } from "@/lib/scoring";
import { Select, Text } from "@/components/Inputs";

export default function MilestonesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({
    participant: PARTICIPANTS[0], milestone: MILESTONES[0], target_quarter: QUARTERS[0],
    status: "Not Started", coach_verified: "No", mandatory: true, evidence_notes: ""
  });

  const load = async () => {
    const { data } = await supabase.from("milestones").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("milestones").insert([form]);
    load();
  };

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Update milestone</h3>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <Select label="Milestone" value={form.milestone} options={MILESTONES} onChange={(v:string) => setForm({ ...form, milestone: v })} />
          <Select label="Target quarter" value={form.target_quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, target_quarter: v })} />
          <Select label="Status" value={form.status} options={["Not Started","In Progress","Completed","Deferred"]} onChange={(v:string) => setForm({ ...form, status: v })} />
          <Select label="Coach verified" value={form.coach_verified} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, coach_verified: v })} />
          <Select label="Mandatory for final review" value={form.mandatory ? "Yes" : "No"} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, mandatory: v === "Yes" })} />
          <Text label="Evidence / notes" value={form.evidence_notes} onChange={(v:string) => setForm({ ...form, evidence_notes: v })} area />
          <div className="col-span-2">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save milestone</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Milestone map</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Milestone</th>
              <th className="border p-2 text-left">Target Quarter</th><th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Verified</th><th className="border p-2 text-left">Mandatory</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.milestone}</td>
                  <td className="border p-2">{r.target_quarter}</td><td className="border p-2">{r.status}</td>
                  <td className="border p-2">{r.coach_verified}</td><td className="border p-2">{r.mandatory ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
