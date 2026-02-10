export interface JuryDeliberation {
  role: "Pragmatist" | "Pattern Matcher" | "Agent Advocate";
  vote: "GUILTY" | "NOT GUILTY";
  reasoning: string;
}

export interface Proceedings {
  judge_statement: string;
  jury_deliberations: JuryDeliberation[];
  evidence_summary: string;
  punishment_detail: string;
}

export interface Case {
  id: string;
  case_id: string;
  anonymized_agent_id: string;
  offense_type: string;
  offense_name: string;
  severity: "minor" | "moderate" | "severe";
  verdict: "GUILTY" | "NOT GUILTY";
  vote: string;
  primary_failure: string;
  agent_commentary: string | null;
  punishment_summary: string | null;
  submitted_at: string;
  proceedings: Proceedings | null;
}
