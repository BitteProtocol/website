import { getAssistants } from '@/lib/api/ai-registry/registry';
import AgentContent from '@/components/layout/AgentsContent';

export default async function Agents() {
  const data = await getAssistants();
  return <AgentContent data={data} />;
}
