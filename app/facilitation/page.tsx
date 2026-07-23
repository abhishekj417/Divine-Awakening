"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS } from "@/lib/scoring";
import { Select, NumberInput, Text, DateInput } from "@/components/Inputs";

export default function FacilitationPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    participant: PARTICIPANTS[0], observation_date: "", quarter: QUARTERS[0], session_module: "", observer: "",
    preparation: 3, presence: 3, clarity: 3, engagement: 3, listening: 3, safety: 3, flow: 3, approved_independent: "No"
  });

  const load = async () => {
    const { data } = await supabase.from("facilitation_observations").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("facilitation_observations").insert([form]);
    load();
  };

  const avg = (r: any) => Math.round(((r.preparation + r.presence + r.clarity + r.engagement + r.listening + r.safety + r.flow) / 7) * 100) / 100;

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Add facilitation observation</h3>
        <form onSubmit={submit} className="grid grid-cols-3 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <DateInput label="Date" value={form.observation_date} onChange={(v:string) => setForm({ ...form, observation_date: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <Text label="Session / Module" value={form.session_module} onChange={(v:string) => setForm({ ...form, session_module: v })} />
          <Text label="Observer" value={form.observer} onChange={(v:string) => setForm({ ...form, observer: v })} />
          <Select label="Approved independently" value={form.approved_independent} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, approved_independent: v })} />
          <NumberInput label="Preparation" value={form.preparation} onChange={(v:string) => setForm({ ...form, preparation: Number(v) })} />
          <NumberInput label="Presence & Energy" value={form.presence} onChange={(v:string) => setForm({ ...form, presence: Number(v) })} />
          <NumberInput label="Clarity" value={form.clarity} onChange={(v:string) => setForm({ ...form, clarity: Number(v) })} />
          <NumberInput label="Engagement" value={form.engagement} onChange={(v:string) => setForm({ ...form, engagement: Number(v) })} />
          <NumberInput label="Listening & Responsiveness" value={form.listening} onChange={(v:string) => setForm({ ...form, listening: Number(v) })} />
          <NumberInput label="Group Safety" value={form.safety} onChange={(v:string) => setForm({ ...form, safety: Number(v) })} />
          <NumberInput label="Time & Flow" value={form.flow} onChange={(v:string) => setForm({ ...form, flow: Number(v) })} />
          <div className="col-span-3">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save observation</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Facilitation log</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Quarter</th><th className="border p-2 text-left">Session</th>
              <th className="border p-2 text-left">Observer</th><th className="border p-2 text-left">Average</th>
              <th className="border p-2 text-left">Independent</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.observation_date}</td>
                  <td className="border p-2">{r.quarter}</td><td className="border p-2">{r.session_module}</td>
                  <td className="border p-2">{r.observer}</td><td className="border p-2">{avg(r)}</td>
                  <td className="border p-2">{r.approved_independent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
