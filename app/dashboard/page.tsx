"use client";
import { useEffect, useState } from "react";
import AuthGate from "@/components/AuthGate";
import { supabase } from "@/lib/supabaseClient";
import { StatusPill, YesNoPill } from "@/components/Pills";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState<any[]>([]);
  const [roster, setRoster] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: a } = await supabase.from("quarterly_assessments").select("*");
      const { data: r } = await supabase.from("roster").select("*");
      setAssessments(a || []);
      setRoster(r || []);
    };
    load();
  }, []);

  const avgComposite = assessments.length
    ? Math.round((assessments.reduce((s, a) => s + Number(a.composite || 0), 0) / assessments.length) * 10) / 10
    : 0;
  const eligible = assessments.filter(a => a.head_coach_consideration === "Yes").length;
  const watchlist = assessments.filter(a => a.status === "Watchlist" || a.status === "Remediation").length;

  const latestByParticipant: Record<string, any> = {};
  assessments.forEach(a => {
    const existing = latestByParticipant[a.participant];
    if (!existing || a.quarter > existing.quarter) latestByParticipant[a.participant] = a;
  });

  return (
    <AuthGate>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Participants" value={roster.length} />
        <StatCard label="Assessment records" value={assessments.length} />
        <StatCard label="Average composite" value={avgComposite} />
        <StatCard label="Eligible for final review" value={eligible} />
      </div>

      <div className="bg-white rounded-xl border p-5 mb-6">
        <h3 className="font-bold mb-3">Latest-quarter review</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border p-2 text-left">Participant</th>
                <th className="border p-2 text-left">Quarter</th>
                <th className="border p-2 text-left">Composite</th>
                <th className="border p-2 text-left">Status</th>
                <th className="border p-2 text-left">Non-Negotiables</th>
                <th className="border p-2 text-left">Culture Gate</th>
                <th className="border p-2 text-left">Head Coach</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(latestByParticipant).map((a: any) => (
                <tr key={a.id}>
                  <td className="border p-2">{a.participant}</td>
                  <td className="border p-2">{a.quarter}</td>
                  <td className="border p-2">{a.composite}</td>
                  <td className="border p-2"><StatusPill status={a.status} /></td>
                  <td className="border p-2"><YesNoPill value={a.all_non_negotiables_met} /></td>
                  <td className="border p-2"><YesNoPill value={a.culture_gate_clear} /></td>
                  <td className="border p-2"><YesNoPill value={a.head_coach_consideration} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Risk overview</h3>
        <p className="text-sm mb-1"><span className="pill pill-warn">Watchlist / Remediation</span> {watchlist} quarterly records</p>
        <p className="text-xs text-gray-500 mt-2">Head Coach is not automatic. Final appointment requires gate clearance, evidence completion, no disqualifying remediation, and final panel decision.</p>
      </div>
    </AuthGate>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-brand">{value}</p>
    </div>
  );
}
