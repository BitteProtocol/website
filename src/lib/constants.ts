export enum EFilters {
  USE_CASE = 'Use Case',
  TOOLS = 'Tools',
  FRAMEWORK = 'Framework',
}

export const REQUEST_HEADERS = {
  'Cache-Control': 'public, max-age=31536000, immutable',
  'mb-api-key': 'omni-site',
  'Content-Type': 'application/json',
};

export enum HttpMethod {
  DELETE = 'DELETE',
  POST = 'POST',
  PUT = 'PUT',
  GET = 'GET',
}

export const REQUEST_OPTIONS = (method: HttpMethod) => {
  return { method: method, headers: REQUEST_HEADERS };
};

export const BittePrimitiveNames = [
  'create-drop',
  'generate-evm-tx',
  'generate-image',
  'generate-transaction',
  'getSwapTransactions',
  'getTokenMetadata',
  'render-chart',
  'share-twitter',
  'sign-message',
  'submit-query',
  'transfer-ft',
];

export const COLLECTIONS = {
  AGENTS: 'ai-assistants',
  TOOLS: 'tools',
} as const;
