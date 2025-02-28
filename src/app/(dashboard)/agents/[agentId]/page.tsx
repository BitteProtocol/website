import { AgentDetailComponent } from '@/components/layout/AgentDetail';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getAssistantById,
  getAssistantsByCategory,
} from '@/lib/api/ai-registry/registry';
import { getAllDailyPingsByAgentId } from '@/lib/api/kv';
import { Suspense } from 'react';

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

  // Get initial data first since we need the category for related agents
  const data = await getAssistantById(agentId);

  if (!data) {
    return null;
  }

  // Then fetch related data in parallel
  const [relatedAgents, pings] = await Promise.all([
    getAssistantsByCategory(data.category),
    getAllDailyPingsByAgentId(agentId),
  ]);

  return (
    <Suspense
      fallback={
        <div className='flex gap-3'>
          <Skeleton className='w-1/3 h-[70vh]' />
          <Skeleton className='w-2/3 h-[70vh]' />
        </div>
      }
    >
      <AgentDetailComponent
        agent={data}
        relatedAgents={relatedAgents}
        pings={pings}
      />
    </Suspense>
  );
}
