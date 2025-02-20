export interface RegistryData {
  id: string;
  name: string;
  coverImage: string;
  generatedDescription?: string;
  description?: string;
  previewUrl?: string;
  vercelLink?: string;
  author: string;
  category?: string;
  verified: boolean;
  publisher?: string;
  repoUrl?: string;
}

export interface Filters {
  values: string[];
  label: string;
}

export type AgentData = {
  agents: RegistryData[];
  unverifiedAgents: RegistryData[];
  filters: Filters[];
} | null;
