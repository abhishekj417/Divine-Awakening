"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS } from "@/lib/scoring";
import { Select, NumberInput, Text, DateInput } from "@/components/Inputs";

const EVIDENCE_TYPES = ["Testimonial","Survey","Coach Observation","Peer Observation","Case Note","Referral","Other"];

export default function ImpactPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    participant: PARTICIPANTS[0], impact_date: "", quarter: QUARTERS[0], activity: "",
    evidence_type: EVIDENCE_TYPES[0], source: "", rating: 3, summary: ""
  });

  const load = async () => {
    const { data } = await supabase.from("participant_impact").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("participant_impact").insert([form]);
    load();
  };

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Add participant impact record</h3>
        <form onSubmit={submit} className="grid grid-cols-3 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <DateInput label="Date" value={form.impact_date} onChange={(v:string) => setForm({ ...form, impact_date: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <Text label="Activity / Session" value={form.activity} onChange={(v:string) => setForm({ ...form, activity: v })} />
          <Select label="Evidence Type" value={form.evidence_type} options={EVIDENCE_TYPES} onChange={(v:string) => setForm({ ...form, evidence_type: v })} />
          <Text label="Participant / Source" value={form.source} onChange={(v:string) => setForm({ ...form, source: v })} />
          <NumberInput label="Impact Rating" value={form.rating} onChange={(v:string) => setForm({ ...form, rating: Number(v) })} />
          <Text label="Evidence summary" value={form.summary} onChange={(v:string) => setForm({ ...form, summary: v })} area />
          <div className="col-span-3">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save impact record</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Participant impact log</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Quarter</th><th className="border p-2 text-left">Activity</th>
              <th className="border p-2 text-left">Evidence Type</th><th className="border p-2 text-left">Rating</th>
              <th className="border p-2 text-left">Summary</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.impact_date}</td>
                  <td className="border p-2">{r.quarter}</td><td className="border p-2">{r.activity}</td>
                  <td className="border p-2">{r.evidence_type}</td><td className="border p-2">{r.rating}</td>
                  <td className="border p-2">{r.summary}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
