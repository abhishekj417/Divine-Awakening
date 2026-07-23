import AuthGate from "@/components/AuthGate";

const DEFS: [string, string, string][] = [
  ["Self-Leadership & Discipline","15%","Ritual consistency, punctuality, discipline, attendance, and follow-through."],
  ["Learning & Embodiment","10%","Completion of learning, depth of reflection, application, and behavioral embodiment."],
  ["Facilitation Mastery","20%","Preparation, presence, clarity, engagement, psychological safety, and command of flow."],
  ["Participant Transformation","15%","Observed value creation, feedback strength, follow-through, and outcome evidence."],
  ["Operational Stewardship","15%","Ownership, reliability, issue management, communication, and handover quality."],
  ["Retreat Leadership","10%","Preparation, on-ground leadership, care, judgment, and debrief quality."],
  ["Culture & Trust","10%","Integrity, coachability, adherence to Code of Honor, and cultural stewardship."],
  ["Intellectual Contribution","5%","Original assets, content creation, curriculum contribution, and thought leadership."],
  ["Qualification Gate","Mandatory","All required non-negotiables completed or formally resolved."],
  ["Qualification Gate","Mandatory","No unresolved Culture or Code of Honor concern."],
  ["Qualification Gate","Mandatory","Minimum composite score of 95 for Head Coach consideration."],
  ["Qualification Gate","Mandatory","No core panel category below 90."],
  ["Qualification Gate","Mandatory","Required facilitation, retreat, and business ownership evidence completed."],
  ["Qualification Gate","Mandatory","No active disqualifying remediation at final review."]
];

export default function DefinitionsPage() {
  return (
    <AuthGate>
      <div className="bg-white rounded-xl border p-5">
        <h3 className="font-bold mb-3">Definitions and qualification gates</h3>
        <div className="overflow-auto">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-gray-50">
              <th className="border p-2 text-left">Pillar / Rule</th><th className="border p-2 text-left">Weight / Standard</th>
              <th className="border p-2 text-left">Definition / Anchor</th>
            </tr></thead>
            <tbody>
              {DEFS.map((d, i) => (
                <tr key={i}>
                  <td className="border p-2">{d[0]}</td><td className="border p-2">{d[1]}</td><td className="border p-2">{d[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGate>
  );
}
