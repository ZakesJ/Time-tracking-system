export type InsightType =
  | "risks-opportunities"
  | "knowledge-skill-transfer"
  | "improvements-value-add"
  | "learning";

export interface InsightConfig {
  value: InsightType;
  label: string;
  placeholder: string;
  description: string;
}

export const INSIGHT_TYPES: InsightConfig[] = [
  {
    value: "risks-opportunities",
    label: "Risks & Opportunities",
    placeholder: "What risks and opportunities have you encountered?",
    description: "Specify the project name, the risks identified, and the solutions implemented to mitigate them.",
  },
  {
    value: "knowledge-skill-transfer",
    label: "Knowledge & Skill Transfer",
    placeholder: "What knowledge or skills have been transferred?",
    description: "Document the knowledge, skills, or expertise shared between team members or departments during this task.",
  },
  {
    value: "improvements-value-add",
    label: "Improvements and Value Add",
    placeholder: "What improvements and value additions have been made?",
    description: "Describe any enhancements, optimizations, or value-added contributions made during this task.",
  },
  {
    value: "learning",
    label: "Learning",
    placeholder: "What have you learned?",
    description: "Share key learnings, insights, or new knowledge gained from working on this task.",
  },
];

export function getInsightConfig(type: InsightType): InsightConfig {
  return INSIGHT_TYPES.find((config) => config.value === type) || INSIGHT_TYPES[0];
}

