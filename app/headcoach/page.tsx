"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { PARTICIPANTS } from "@/lib/scoring";
import { YesNoPill } from "@/components/Pills";

export default function HeadCoachPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [facilitation, setFacilitation] = useState<any[]>([]);
  const [impact, setImpact] = useState<any[]>([]);
  const [operations, setOperations] = useState<any[]>([]);
  const [remediation, setRemediation] = useState<any[]>([]);
  const [panel, setPanel] = useState<any[]>([]);

  const load = async () => {
    const [a, f, i, o, r, p] = await Promise.all([
      supabase.from("quarterly_assessments").select("*"),
      supabase.from("facilitation_observations").select("*"),
      supabase.from("participant_impact").select("*"),
      supabase.from("business_retreat_log").select("*"),
      supabase.from("remediation_plans").select("*"),
      supabase.from("head_coach_panel").select("*")
    ]);
    setAssessments(a.data || []); setFacilitation(f.data || []); setImpact(i.data || []);
    setOperations(o.data || []); setRemediation(r.data || []); setPanel(p.data || []);
  };
  useEffect(() => { load(); }, []);

  const avg = (arr: number[]) => arr.length ? Math.round((arr.reduce((s,n)=>s+n,0)/arr.length)*10)/10 : 0;

  const updatePanelDemo = async (participant: string, value: string) => {
    await supabase.from("head_coach_panel").upsert([{ participant, panel_demonstration: Number(value) }], { onConflict: "participant" });
    load();
  };

  const rows = PARTICIPANTS.map(p => {
    const perf = avg(assessments.filter(a => a.participant === p).map(a => Number(a.composite || 0)));
    const facAvg = avg(facilitation.filter(x => x.participant === p).map(x => ((x.preparation+x.presence+x.clarity+x.engagement+x.listening+x.safety+x.flow)/7)*20));
    const impAvg = avg(impact.filter(x => x.participant === p).map(x => Number(x.rating) * 20));
    const facilitationImpact = avg([facAvg, impAvg]);
    const opsAvg = avg(operations.filter(x => x.participant === p).map(x => ((x.reliability+x.initiative+x.problem_solving+x.communication+x.handover)/5)*20));
    const cultureAvg = avg(assessments.filter(a => a.participant === p).map(a => Number(a.culture_coach || 0) * 20));
    const panelRow = panel.find(x => x.participant === p) || { panel_demonstration: 0 };
    const panelDemo = Number(panelRow.panel_demonstration || 0);
    const index = Math.round((perf*0.30 + facilitationImpact*0.25 + opsAvg*0.20 + cultureAvg*0.15 + panelDemo*0.10) * 10) / 10;
    const disqualifying = remediation.some(r => r.participant === p && r.eligibility_effect === "Disqualifying");
    const gatesCleared = perf >= 95 && facilitationImpact >= 90 && opsAvg >= 90 && cultureAvg >= 90 && panelDemo >= 90 &&
      assessments.some(a => a.participant === p && a.head_coach_consideration === "Yes") && !disqualifying;
    return { participant: p, perf, facilitationImpact, opsAvg, cultureAvg, panelDemo, index, gatesCleared };
  });

  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Head Coach assessment panel</h3>
        <p className="text-xs text-gray-500 mb-3">Leadership-confidential. Final appointment still requires panel review beyond this index.</p>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Participant</th><th className="border p-2 text-left">2-Yr Avg (30%)</th>
              <th className="border p-2 text-left">Facilitation & Impact (25%)</th><th className="border p-2 text-left">Retreat & Ops (20%)</th>
              <th className="border p-2 text-left">Culture & Trust (15%)</th><th className="border p-2 text-left">Panel Demo (10%)</th>
              <th className="border p-2 text-left">Final Index</th><th className="border p-2 text-left">Gates Cleared</th>
            </tr></thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.participant}>
                  <td className="border p-2">{r.participant}</td><td className="border p-2">{r.perf}</td>
                  <td className="border p-2">{r.facilitationImpact}</td><td className="border p-2">{r.opsAvg}</td>
                  <td className="border p-2">{r.cultureAvg}</td>
                  <td className="border p-2">
                    <input type="number" defaultValue={r.panelDemo} className="border rounded px-2 py-1 w-20"
                      onBlur={e => updatePanelDemo(r.participant, e.target.value)} />
                  </td>
                  <td className="border p-2 font-bold">{r.index}</td>
                  <td className="border p-2"><YesNoPill value={r.gatesCleared ? "Yes" : "No"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
