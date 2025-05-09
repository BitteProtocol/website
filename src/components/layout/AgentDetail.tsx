'use client';

import { DetailsSideBar } from '@/components/layout/DetailsSidebar';
import {
  useAssistantById,
  useAssistantsByCategory,
} from '@/hooks/useAssistants';
import { useSearchParams } from 'next/navigation';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import AiChat from './AiChat';
import GitCommitHistory from './CommitHistory';
import { MarkdownBody } from './MarkdownBody';
import PageLoaderSkeleton from './PageLoaderSkeleton';
import { RelatedTemplates } from './Related';

export const AgentDetailComponent = ({
  agentId,
  pings,
}: {
  agentId: string;
  pings?: Record<string, number>;
}) => {
  const {
    agent,
    loading: agentLoading,
    error: agentError,
  } = useAssistantById(agentId);
  const {
    agents: relatedAgents,
    loading: relatedLoading,
    error: relatedError,
  } = useAssistantsByCategory(agent?.category);

  const searchParams = useSearchParams();

  if (agentLoading || relatedLoading) {
    return <PageLoaderSkeleton />;
  }

  if (agentError || relatedError || !agent) {
    return <div>Error loading agent details.</div>;
  }

  return (
    <div className='w-full mx-auto'>
      <div className='w-full lg:flex gap-12 justify-center'>
        <div className='w-full lg:w-1/3'>
          <DetailsSideBar {...{ agent }} />
        </div>
        <div className='w-full'>
          <div className='grid grid-cols-1'>
            <div className='lg:h-[600px] mb-6'>
              <AiChat
                selectedAgent={agent}
                isAgentPage
                prompt={searchParams.get('prompt') || ''}
              />
            </div>
          </div>
          <div className='markdownBody'>
            <MarkdownBody
              data={agent?.generatedDescription || agent.description || ''}
            />
          </div>

          {pings && (
            <>
              <div className='grid gap-4 lg:grid-cols-3 my-8'>
                <Card className='border border-mb-gray-750'>
                  <CardContent className='p-6'>
                    <div className='text-sm text-gray-400 mb-2'>
                      Total Pings
                    </div>
                    <div className='text-2xl font-bold text-white'>
                      {Object.values(pings).reduce(
                        (sum, count) => sum + count,
                        0
                      )}
                    </div>
                  </CardContent>
                </Card>
                <Card className='border border-mb-gray-750'>
                  <CardContent className='p-6'>
                    <div className='text-sm text-gray-400 mb-2'>
                      Daily Average
                    </div>
                    <div className='text-2xl font-bold text-white'>
                      {pings && Object.keys(pings).length > 0
                        ? Math.round(
                            Object.values(pings).reduce(
                              (sum, count) => sum + count,
                              0
                            ) / Object.keys(pings).length
                          )
                        : 0}
                    </div>
                  </CardContent>
                </Card>
                <Card className='border border-mb-gray-750'>
                  <CardContent className='p-6'>
                    <div className='text-sm text-gray-400 mb-2'>
                      Last 7 Days
                    </div>
                    <div className='text-2xl font-bold text-white'>
                      {Object.entries(pings)
                        .sort(
                          (a, b) =>
                            new Date(b[0]).getTime() - new Date(a[0]).getTime()
                        )
                        .slice(0, 7)
                        .reduce((sum, entry) => sum + entry?.[1], 0)}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className='my-8 grid grid-cols-1'>
                <Calendar record={pings} />
              </div>
              <div className='my-8'>
                <GitCommitHistory repoUrl={agent.repo} />
              </div>
            </>
          )}
        </div>
      </div>
      <RelatedTemplates relatedAgents={relatedAgents} />
    </div>
  );
};
