import { FunctionTool } from 'openai/resources/beta/assistants';
import { FunctionDefinition } from 'openai/resources/index';

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
  repo?: string;
  chainIds?: number[];
  instructions?: string;
  tools?: BitteToolSpec[];
}

export interface Filters {
  values: string[];
  label: string;
}

export type VerifiedAgentData = {
  agents: RegistryData[];
  filters: Filters[];
} | null;

export type AgentData = {
  agents: RegistryData[];
  unverifiedAgents: RegistryData[];
  filters: Filters[];
} | null;

export type BitteToolSpec = PluginToolSpec | FunctionTool;

export type PluginToolSpec = {
  id: string;
  agentId: string;
  type: 'function';
  function: FunctionDefinition;
  execution: ExecutionDefinition;
  verified: boolean;
};

export type ExecutionDefinition = {
  baseUrl: string;
  path: string;
  httpMethod: string;
};
