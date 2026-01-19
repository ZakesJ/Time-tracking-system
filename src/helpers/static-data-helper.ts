import type { ColorFamily } from "@/lib/types"

export interface ClientOption {
  label: string
  value: string
  color: ColorFamily
}

export interface TaskTypeOption {
  label: string
  value: string
}

// Mock client data with assigned colors
export const CLIENT_OPTIONS: ClientOption[] = [
  { label: "EMSI", value: "emsi-solutions", color: "blue" },
  { label: "Falcorp", value: "falcorp", color: "cyan" },
  { label: "Openserve", value: "openserve", color: "green" },
  { label: "Vodacom", value: "vodacom", color: "red" },
  { label: "Condor Group", value: "condor-green", color: "red" },
  { label: "MTN", value: "mtn", color: "yellow" },
 
]

// Mock task type data
export const TASK_TYPE_OPTIONS: TaskTypeOption[] = [
  { label: "Development", value: "development" },
  { label: "Design", value: "design" },
  { label: "Meeting", value: "meeting" },
  { label: "Review", value: "review" },
  { label: "Planning", value: "planning" },
  { label: "Testing", value: "testing" },
  { label: "Documentation", value: "documentation" },
  { label: "Research", value: "research" },
]

// Helper function to get color by client value
export const getClientColor = (clientValue: string): ColorFamily => {
  const client = CLIENT_OPTIONS.find(c => c.value === clientValue)
  return client?.color || 'gray'
}

// Helper function to get client label by value
export const getClientLabel = (clientValue: string): string => {
  const client = CLIENT_OPTIONS.find(c => c.value === clientValue)
  return client?.label || clientValue
}

