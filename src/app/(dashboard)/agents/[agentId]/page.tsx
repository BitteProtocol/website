import { AgentDetailComponent } from '@/components/layout/AgentDetail';
import { getAllDailyPingsByAgentId } from '@/lib/api/kv';

export const revalidate = 3600;
export const dynamic = 'force-static';
export const dynamicParams = true;

// Generate static params for common agent pages
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/agents`);
    const agents = await res.json();
    return agents.map((agent: { id: string }) => ({
      agentId: agent.id,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

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
