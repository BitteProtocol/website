import { FunctionTool } from 'openai/resources/beta/assistants';
import { FunctionDefinition } from 'openai/resources/index';

// TO DO: SURGE: ADjust the file, pick the things u need from here regarding generateText and update agents

export type BitteAssistantConfig = {
  id: string;
  name: string;
  accountId: string;
  description: string;
  instructions: string;
  verified: boolean;
  tools?: BitteToolSpec[];
  image?: string;
  generatedDescription?: string;
  category?: string;
  repo?: string;
  chainIds?: number[];
};

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
