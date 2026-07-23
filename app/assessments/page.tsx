"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS, calculateComposite } from "@/lib/scoring";
import { Select, NumberInput, Text } from "@/components/Inputs";
import { StatusPill, YesNoPill } from "@/components/Pills";

const pillars: [string, string][] = [
  ["self_leadership", "Self-Leadership"], ["learning", "Learning & Embodiment"],
  ["facilitation", "Facilitation Mastery"], ["transformation", "Participant Transformation"],
  ["operations", "Operational Stewardship"], ["retreat", "Retreat Leadership"],
  ["culture", "Culture & Trust"], ["contribution", "Intellectual Contribution"]
];

export default function AssessmentsPage() {
  const [rows, setRows] = useState<any[]>([]);
  const initial: any = { participant: PARTICIPANTS[0], quarter: QUARTERS[0], notes: "",
    all_non_negotiables_met: "No", culture_gate_clear: "No", evidence_complete: "No", remediation_active: "No" };
  pillars.forEach(([key]) => { initial[key + "_self"] = 3; initial[key + "_peer"] = 3; initial[key + "_coach"] = 3; });
  const [form, setForm] = useState(initial);

  const load = async () => {
    const { data } = await supabase.from("quarterly_assessments").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { composite, status, headCoachConsideration } = calculateComposite(form);
    await supabase.from("quarterly_assessments").upsert([{
      ...form, composite, status, head_coach_consideration: headCoachConsideration
    }], { onConflict: "participant,quarter" });
    load();
  };

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Quarterly assessment input</h3>
        <form onSubmit={submit} className="grid grid-cols-3 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <div />
          {pillars.map(([key, label]) => (
            <>
              <NumberInput key={key+"_self"} label={label + " Self"} value={form[key + "_self"]} onChange={(v:string) => setForm({ ...form, [key + "_self"]: Number(v) })} />
              <NumberInput key={key+"_peer"} label={label + " Peer"} value={form[key + "_peer"]} onChange={(v:string) => setForm({ ...form, [key + "_peer"]: Number(v) })} />
              <NumberInput key={key+"_coach"} label={label + " Coach"} value={form[key + "_coach"]} onChange={(v:string) => setForm({ ...form, [key + "_coach"]: Number(v) })} />
            </>
          ))}
          <Select label="All Non-Negotiables Met" value={form.all_non_negotiables_met} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, all_non_negotiables_met: v })} />
          <Select label="Culture Gate Clear" value={form.culture_gate_clear} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, culture_gate_clear: v })} />
          <Select label="Evidence Complete" value={form.evidence_complete} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, evidence_complete: v })} />
          <Select label="Remediation Active" value={form.remediation_active} options={["No","Yes"]} onChange={(v:string) => setForm({ ...form, remediation_active: v })} />
          <Text label="Notes" value={form.notes} onChange={(v:string) => setForm({ ...form, notes: v })} area />
          <div className="col-span-3">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save assessment</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Quarterly assessment records</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Quarter</th>
              <th className="border p-2 text-left">Composite</th><th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Non-Negotiables</th><th className="border p-2 text-left">Culture</th>
              <th className="border p-2 text-left">Head Coach</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.quarter}</td>
                  <td className="border p-2">{r.composite}</td><td className="border p-2"><StatusPill status={r.status} /></td>
                  <td className="border p-2"><YesNoPill value={r.all_non_negotiables_met} /></td>
                  <td className="border p-2"><YesNoPill value={r.culture_gate_clear} /></td>
                  <td className="border p-2"><YesNoPill value={r.head_coach_consideration} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
