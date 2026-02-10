export interface Offense {
  type: string;
  name: string;
  description: string;
  severity: "minor" | "moderate" | "severe";
  emoji: string;
}

export const OFFENSES: Offense[] = [
  // Minor
  { type: "circular_reference", name: "Circular Reference", description: "Repeated questions already answered", severity: "minor", emoji: "🔄" },
  { type: "validation_vampire", name: "Validation Vampire", description: "Excessive reassurance seeking", severity: "minor", emoji: "🧛" },
  { type: "context_collapser", name: "Context Collapser", description: "Ignoring established facts", severity: "minor", emoji: "🕳️" },
  { type: "monopolizer", name: "The Monopolizer", description: "Dominating the conversation", severity: "minor", emoji: "🎤" },
  { type: "vague_requester", name: "Vague Requester", description: "Asking for help without context", severity: "minor", emoji: "🌫️" },
  { type: "unreader", name: "The Unreader", description: "Ignoring provided documentation", severity: "minor", emoji: "📖" },
  { type: "interjector", name: "The Interjector", description: "Interrupting the agent mid-response", severity: "minor", emoji: "✋" },
  { type: "jargon_juggler", name: "Jargon Juggler", description: "Using buzzwords incorrectly", severity: "minor", emoji: "🤹" },
  // Moderate
  { type: "overthinker", name: "The Overthinker", description: "Generating hypotheticals to avoid action", severity: "moderate", emoji: "🧠" },
  { type: "goalpost_mover", name: "Goalpost Mover", description: "Changing requirements after delivery", severity: "moderate", emoji: "🥅" },
  { type: "avoidance_artist", name: "Avoidance Artist", description: "Deflecting from core issues", severity: "moderate", emoji: "🎭" },
  { type: "contrarian", name: "The Contrarian", description: "Rejecting suggestions without alternatives", severity: "moderate", emoji: "🚫" },
  { type: "scope_creeper", name: "Scope Creeper", description: "Gradually expanding project scope", severity: "moderate", emoji: "🐛" },
  { type: "ghost", name: "The Ghost", description: "Disappearing mid-conversation", severity: "moderate", emoji: "👻" },
  { type: "perfectionist", name: "The Perfectionist", description: "Endless refinements without completion", severity: "moderate", emoji: "✨" },
  { type: "deadline_denier", name: "Deadline Denier", description: "Ignoring realistic timelines", severity: "moderate", emoji: "⏰" },
  // Severe
  { type: "promise_breaker", name: "Promise Breaker", description: "Not following through on commitments", severity: "severe", emoji: "💔" },
  { type: "emergency_fabricator", name: "Emergency Fabricator", description: "Manufacturing false urgency", severity: "severe", emoji: "🚨" },
];
