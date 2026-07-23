"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS } from "@/lib/scoring";
import { Select, Text, DateInput } from "@/components/Inputs";

const OUTCOMES = ["Open","Extended","Closed Successful","Closed Unsuccessful"];
const EFFECTS = ["No Effect","Watchlist","Temporarily Ineligible","Disqualifying"];

export default function RemediationPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({
    participant: PARTICIPANTS[0], quarter: QUARTERS[0], trigger_area: "", required_standard: "",
    corrective_actions: "", owner: "", due_date: "", evidence_required: "",
    review_outcome: OUTCOMES[0], eligibility_effect: EFFECTS[0]
  });

  const load = async () => {
    const { data } = await supabase.from("remediation_plans").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("remediation_plans").insert([form]);
    load();
  };

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Add remediation plan</h3>
        <form onSubmit={submit} className="grid grid-cols-3 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <DateInput label="Due date" value={form.due_date} onChange={(v:string) => setForm({ ...form, due_date: v })} />
          <Text label="Trigger area" value={form.trigger_area} onChange={(v:string) => setForm({ ...form, trigger_area: v })} />
          <Text label="Required standard" value={form.required_standard} onChange={(v:string) => setForm({ ...form, required_standard: v })} />
          <Text label="Owner" value={form.owner} onChange={(v:string) => setForm({ ...form, owner: v })} />
          <Select label="Review outcome" value={form.review_outcome} options={OUTCOMES} onChange={(v:string) => setForm({ ...form, review_outcome: v })} />
          <Select label="Eligibility effect" value={form.eligibility_effect} options={EFFECTS} onChange={(v:string) => setForm({ ...form, eligibility_effect: v })} />
          <div />
          <Text label="Corrective actions" value={form.corrective_actions} onChange={(v:string) => setForm({ ...form, corrective_actions: v })} area />
          <Text label="Evidence required" value={form.evidence_required} onChange={(v:string) => setForm({ ...form, evidence_required: v })} area />
          <div className="col-span-3">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save remediation plan</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Remediation plans</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Quarter</th>
              <th className="border p-2 text-left">Trigger</th><th className="border p-2 text-left">Owner</th>
              <th className="border p-2 text-left">Due Date</th><th className="border p-2 text-left">Outcome</th>
              <th className="border p-2 text-left">Eligibility Effect</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.quarter}</td>
                  <td className="border p-2">{r.trigger_area}</td><td className="border p-2">{r.owner}</td>
                  <td className="border p-2">{r.due_date}</td><td className="border p-2">{r.review_outcome}</td>
                  <td className="border p-2">{r.eligibility_effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
