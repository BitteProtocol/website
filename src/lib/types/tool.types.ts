export interface Tool {
  id: string;
  agentId: string;
  type: 'function';
  function: {
    name: string;
    description: string;
  };
  execution: {
    baseUrl: string;
    path: string;
    httpMethod: string;
  };
  image?: string;
  isPrimitive?: boolean;
}
