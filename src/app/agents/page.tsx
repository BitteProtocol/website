import { getAssistants } from '@/lib/api/ai-registry/registry';
import AgentContent from '@/components/layout/AgentsContent';
import { Suspense } from 'react';

export default async function Agents() {
  const data = await getAssistants();
  return <Suspense>{data ? <AgentContent data={data} /> : null}</Suspense>;
}
