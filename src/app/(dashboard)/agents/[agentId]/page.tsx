import { AgentDetailComponent } from '@/components/layout/AgentDetail';
import {
  getAssistantById,
  getAssistantsByCategory,
} from '@/lib/api/ai-registry/registry';
import { getAllDailyPingsByAgentId } from '@/lib/api/kv';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
        <div className='flex gap-5'>
          <Skeleton className='w-1/6 h-[100vh]' />
          <Skeleton className='w-2/6 h-[35vh] mt-20' />
          <Skeleton className='w-3/6 h-[100vh] mt-20' />
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
