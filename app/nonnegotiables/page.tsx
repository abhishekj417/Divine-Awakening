"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS, QUARTERS } from "@/lib/scoring";
import { Select, Text, NumberInput as _N } from "@/components/Inputs";

export default function NonNegPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState({
    participant: PARTICIPANTS[0], quarter: QUARTERS[0], month_label: "",
    ritual_compliance: "", wheel_of_life: "Yes", meeting_attendance: "",
    deadline_compliance: "", exception_context: "", coach_verified: "Yes"
  });

  const load = async () => {
    const { data } = await supabase.from("non_negotiables").select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("non_negotiables").insert([{
      ...form,
      ritual_compliance: Number(form.ritual_compliance),
      meeting_attendance: Number(form.meeting_attendance),
      deadline_compliance: Number(form.deadline_compliance)
    }]);
    load();
  };

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Add non-negotiables log</h3>
        <form onSubmit={submit} className="grid grid-cols-2 gap-3">
          <Select label="Participant" value={form.participant} options={PARTICIPANTS} onChange={(v:string) => setForm({ ...form, participant: v })} />
          <Select label="Quarter" value={form.quarter} options={QUARTERS} onChange={(v:string) => setForm({ ...form, quarter: v })} />
          <Text label="Month label" value={form.month_label} onChange={(v:string) => setForm({ ...form, month_label: v })} />
          <div>
            <label className="text-xs font-semibold block mb-1">Ritual compliance %</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={form.ritual_compliance} onChange={e => setForm({ ...form, ritual_compliance: e.target.value })} />
          </div>
          <Select label="Wheel of Life submitted" value={form.wheel_of_life} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, wheel_of_life: v })} />
          <div>
            <label className="text-xs font-semibold block mb-1">Meeting attendance %</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={form.meeting_attendance} onChange={e => setForm({ ...form, meeting_attendance: e.target.value })} />
          </div>
          <div>
            <label className="text-xs font-semibold block mb-1">Deadline compliance %</label>
            <input type="number" className="w-full border rounded px-2 py-1" value={form.deadline_compliance} onChange={e => setForm({ ...form, deadline_compliance: e.target.value })} />
          </div>
          <Select label="Coach verified" value={form.coach_verified} options={["Yes","No"]} onChange={(v:string) => setForm({ ...form, coach_verified: v })} />
          <Text label="Exception / context" value={form.exception_context} onChange={(v:string) => setForm({ ...form, exception_context: v })} area />
          <div className="col-span-2">
            <button className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold" type="submit">Save record</button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Non-negotiables log</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">Quarter</th>
              <th className="border p-2 text-left">Month</th><th className="border p-2 text-left">Ritual %</th>
              <th className="border p-2 text-left">Wheel</th><th className="border p-2 text-left">Attendance %</th>
              <th className="border p-2 text-left">Deadline %</th><th className="border p-2 text-left">Verified</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.quarter}</td>
                  <td className="border p-2">{r.month_label}</td><td className="border p-2">{r.ritual_compliance}</td>
                  <td className="border p-2">{r.wheel_of_life}</td><td className="border p-2">{r.meeting_attendance}</td>
                  <td className="border p-2">{r.deadline_compliance}</td><td className="border p-2">{r.coach_verified}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
