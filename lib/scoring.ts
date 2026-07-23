export const WEIGHTS = {
  selfLeadership: 15, learning: 10, facilitation: 20, transformation: 15,
  operations: 15, retreat: 10, culture: 10, contribution: 5
};

export function round1(n: number) { return Math.round((n + Number.EPSILON) * 10) / 10; }

export function weightedPillar(self: number, peer: number, coach: number, weight: number) {
  return round1((((self * 0.15) + (peer * 0.25) + (coach * 0.6)) / 5) * weight);
}

export type AssessmentInput = {
  self_leadership_self: number; self_leadership_peer: number; self_leadership_coach: number;
  learning_self: number; learning_peer: number; learning_coach: number;
  facilitation_self: number; facilitation_peer: number; facilitation_coach: number;
  transformation_self: number; transformation_peer: number; transformation_coach: number;
  operations_self: number; operations_peer: number; operations_coach: number;
  retreat_self: number; retreat_peer: number; retreat_coach: number;
  culture_self: number; culture_peer: number; culture_coach: number;
  contribution_self: number; contribution_peer: number; contribution_coach: number;
  all_non_negotiables_met: string; culture_gate_clear: string;
  evidence_complete: string; remediation_active: string;
};

export function calculateComposite(a: AssessmentInput) {
  const selfLeadership = weightedPillar(a.self_leadership_self, a.self_leadership_peer, a.self_leadership_coach, WEIGHTS.selfLeadership);
  const learning = weightedPillar(a.learning_self, a.learning_peer, a.learning_coach, WEIGHTS.learning);
  const facilitation = weightedPillar(a.facilitation_self, a.facilitation_peer, a.facilitation_coach, WEIGHTS.facilitation);
  const transformation = weightedPillar(a.transformation_self, a.transformation_peer, a.transformation_coach, WEIGHTS.transformation);
  const operations = weightedPillar(a.operations_self, a.operations_peer, a.operations_coach, WEIGHTS.operations);
  const retreat = weightedPillar(a.retreat_self, a.retreat_peer, a.retreat_coach, WEIGHTS.retreat);
  const culture = weightedPillar(a.culture_self, a.culture_peer, a.culture_coach, WEIGHTS.culture);
  const contribution = weightedPillar(a.contribution_self, a.contribution_peer, a.contribution_coach, WEIGHTS.contribution);

  const composite = round1(selfLeadership + learning + facilitation + transformation + operations + retreat + culture + contribution);
  const status = composite >= 95 ? "Eligible for Final Review" : composite >= 85 ? "On Track" : composite >= 75 ? "Watchlist" : "Remediation";
  const headCoachConsideration =
    composite >= 95 && a.all_non_negotiables_met === "Yes" && a.culture_gate_clear === "Yes" &&
    a.evidence_complete === "Yes" && a.remediation_active === "No" ? "Yes" : "No";

  return { composite, status, headCoachConsideration, culture };
}

export const PARTICIPANTS = ["Rhea","Rakesh","Vijay","Shakti","Priyanka","Namita","Vivek","Divya","Neelam","Mandar"];
export const QUARTERS = ["Y1-Q1","Y1-Q2","Y1-Q3","Y1-Q4","Y2-Q1","Y2-Q2","Y2-Q3","Y2-Q4"];
export const MILESTONES = [
  "Watch assigned curriculum videos","Facilitate 5 modules","Testimonial taken and uploaded","Professional photoshoot",
  "Facilitate PPP webinar","Facilitate UUU","Create own course module","Book draft vetted","Book published"
];
