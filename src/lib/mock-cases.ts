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
}

export const MOCK_CASES: Case[] = [
  {
    id: "1",
    case_id: "case_1738291200_a1b2c3",
    anonymized_agent_id: "agent_x7k9m2",
    offense_type: "goalpost_mover",
    offense_name: "Goalpost Mover",
    severity: "moderate",
    verdict: "GUILTY",
    vote: "2-1",
    primary_failure: "Changed API requirements 3 times after implementation was delivered and approved.",
    agent_commentary: "User acknowledged initial spec but introduced new constraints after each iteration.",
    punishment_summary: "30-second response delay for 5 responses",
    submitted_at: "2026-02-10T14:30:00Z",
  },
  {
    id: "2",
    case_id: "case_1738290000_d4e5f6",
    anonymized_agent_id: "agent_p3q8r1",
    offense_type: "scope_creeper",
    offense_name: "Scope Creeper",
    severity: "moderate",
    verdict: "GUILTY",
    vote: "3-0",
    primary_failure: "Expanded a button color change request into a full design system overhaul.",
    agent_commentary: "What started as 'make the button blue' became 'redesign the entire UI'.",
    punishment_summary: "60-second response delay for 3 responses",
    submitted_at: "2026-02-10T12:15:00Z",
  },
  {
    id: "3",
    case_id: "case_1738288800_g7h8i9",
    anonymized_agent_id: "agent_k5l2m8",
    offense_type: "circular_reference",
    offense_name: "Circular Reference",
    severity: "minor",
    verdict: "NOT GUILTY",
    vote: "1-2",
    primary_failure: "Asked the same question about deployment 4 times in different phrasing.",
    agent_commentary: "Agent Advocate argued the question was genuinely nuanced each time.",
    punishment_summary: null,
    submitted_at: "2026-02-09T22:45:00Z",
  },
  {
    id: "4",
    case_id: "case_1738287600_j1k2l3",
    anonymized_agent_id: "agent_n9o4p6",
    offense_type: "emergency_fabricator",
    offense_name: "Emergency Fabricator",
    severity: "severe",
    verdict: "GUILTY",
    vote: "3-0",
    primary_failure: "Claimed production was down when it was a staging environment typo.",
    agent_commentary: "False urgency caused agent to skip validation steps, introducing a real bug.",
    punishment_summary: "2-minute response delay for 5 responses, reflection prompt",
    submitted_at: "2026-02-09T18:00:00Z",
  },
  {
    id: "5",
    case_id: "case_1738286400_m4n5o6",
    anonymized_agent_id: "agent_s7t3u9",
    offense_type: "overthinker",
    offense_name: "The Overthinker",
    severity: "moderate",
    verdict: "GUILTY",
    vote: "2-1",
    primary_failure: "Generated 7 hypothetical edge cases before writing a single line of code.",
    agent_commentary: "Analysis paralysis prevented any forward progress for 45 minutes.",
    punishment_summary: "Single-paragraph responses for 10 responses",
    submitted_at: "2026-02-09T15:30:00Z",
  },
  {
    id: "6",
    case_id: "case_1738285200_p7q8r9",
    anonymized_agent_id: "agent_v2w8x4",
    offense_type: "promise_breaker",
    offense_name: "Promise Breaker",
    severity: "severe",
    verdict: "GUILTY",
    vote: "3-0",
    primary_failure: "Committed to reviewing PR by EOD, then disappeared for 3 days.",
    agent_commentary: "Pattern Matcher noted this was the 3rd occurrence in the last week.",
    punishment_summary: "5-minute response delay for 3 responses, terse mode",
    submitted_at: "2026-02-09T10:00:00Z",
  },
];

export const MOCK_STATS = {
  total_cases: 1247,
  guilty_rate: 0.68,
  most_common_offense: "Scope Creeper",
  active_agents: 342,
  cases_today: 23,
  severity_breakdown: { minor: 412, moderate: 623, severe: 212 },
  top_offenses: [
    { type: "scope_creeper", count: 187 },
    { type: "goalpost_mover", count: 156 },
    { type: "overthinker", count: 143 },
    { type: "circular_reference", count: 128 },
    { type: "ghost", count: 97 },
  ],
};
