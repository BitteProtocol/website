import { AgentDetailComponent } from '@/components/layout/AgentDetail';
import {
  getAssistantById,
  getAssistantsByCategory,
} from '@/lib/api/ai-registry/registry';
import { getAllDailyPingsByAgentId } from '@/lib/api/kv';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Params {
  agentId: string;
}

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Params }) {
  const agentId = params.agentId as string;
  const data = await getAssistantById(agentId);

  return {
    title: `${data?.name} Agent | Bitte.ai`,
    description: data?.description,
  };
}

export default async function AgentDetail({
  params,
}: {
  params: { agentId: string };
}) {
  const agentId = params.agentId as string;

  const data = await getAssistantById(agentId);
  const relatedAgents = await getAssistantsByCategory(data?.category);
  const pings = await getAllDailyPingsByAgentId(agentId);

  if (!data) {
    return null;
  }

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
