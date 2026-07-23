"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS } from "@/lib/scoring";
import { Select, NumberInput, Text, DateInput } from "@/components/Inputs";

const TYPES = ["Business Function","Retreat Role","Project Deliverable"];

export default function OperationsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    participant: PARTICIPANTS[0], log_date: "", quarter: QUARTERS[0], log_type: TYPES[0], deliverable: "",
    reliability: 3, initiative: 3, problem_solving: 3, communication: 3, handover: 3, lead_feedback: "", verified: "No"
  });

  const load = async () => {
    const { data } = await supabase.from("business_retreat_log").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("business_retreat_log").insert([form]);
    load();
  };

  const avg = (r: any) => Math.round(((r.reliability + r.initiative + r.problem_solving + r.communication + r.handover) / 5) * 100) / 100;

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Add business or retreat ownership record</h3>
        <form onSubmit={submit} className="grid grid-cols-3 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <DateInput label="Date" value={form.log_date} onChange={(v:string) => setForm({ ...form, log_date: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <Select label="Type" value={form.log_type} options={TYPES} onChange={(v:string) => setForm({ ...form, log_type: v })} />
          <Text label="Function / Retreat Role / Deliverable" value={form.deliverable} onChange={(v:string) => setForm({ ...form, deliverable: v })} />
          <Select label="Verified" value={form.verified} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, verified: v })} />
          <NumberInput label="Reliability" value={form.reliability} onChange={(v:string) => setForm({ ...form, reliability: Number(v) })} />
          <NumberInput label="Initiative" value={form.initiative} onChange={(v:string) => setForm({ ...form, initiative: Number(v) })} />
          <NumberInput label="Problem Solving" value={form.problem_solving} onChange={(v:string) => setForm({ ...form, problem_solving: Number(v) })} />
          <NumberInput label="Communication" value={form.communication} onChange={(v:string) => setForm({ ...form, communication: Number(v) })} />
          <NumberInput label="Handover" value={form.handover} onChange={(v:string) => setForm({ ...form, handover: Number(v) })} />
          <Text label="Lead feedback" value={form.lead_feedback} onChange={(v:string) => setForm({ ...form, lead_feedback: v })} area />
          <div className="col-span-3">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save ownership record</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Business and retreat log</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Date</th>
              <th className="border p-2 text-left">Quarter</th><th className="border p-2 text-left">Type</th>
              <th className="border p-2 text-left">Deliverable</th><th className="border p-2 text-left">Average</th>
              <th className="border p-2 text-left">Verified</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.log_date}</td>
                  <td className="border p-2">{r.quarter}</td><td className="border p-2">{r.log_type}</td>
                  <td className="border p-2">{r.deliverable}</td><td className="border p-2">{avg(r)}</td>
                  <td className="border p-2">{r.verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
