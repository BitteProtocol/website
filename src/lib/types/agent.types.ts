export interface RegistryData {
  id: string;
  name: string;
  image: string;
  generatedDescription?: string;
  description?: string;
  previewUrl?: string;
  vercelLink?: string;
  author: string;
  category?: string;
  verified: boolean;
  publisher?: string;
  repoUrl?: string;
  chainIds?: number[];
}

export interface Filters {
  values: string[];
  label: string;
}

export type AgentData = {
  agents: RegistryData[];
  filters: Filters[];
} | null;
