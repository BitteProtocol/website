import { AgentDetailComponent } from '@/components/layout/AgentDetail';
import { getAllDailyPingsByAgentId } from '@/lib/api/kv';

// Remove revalidate
// Remove force-static
export const dynamic = 'force-dynamic'; // Change to force-dynamic
export const dynamicParams = true;

export default async function AgentDetail({
  params,
}: {
  params: { agentId: string };
}) {
  const agentId = params.agentId as string;

  // Then fetch related data in parallel
  const [pings] = await Promise.all([getAllDailyPingsByAgentId(agentId)]);

  return <AgentDetailComponent agentId={agentId} pings={pings} />;
}
