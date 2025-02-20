import { DetailsSideBar } from '@/components/layout/DetailsSidebar';
import { RegistryData } from '@/lib/types/agent.types';
import { Calendar } from '../ui/calendar';
import { Card, CardContent } from '../ui/card';
import AiChat from './AiChat';
import GitCommitHistory from './CommitHistory';
import { MarkdownBody } from './MarkdownBody';
import { RelatedTemplates } from './Related';

export const AgentDetailComponent = ({
  agent,
  relatedAgents,
  pings,
}: {
  agent: RegistryData;
  relatedAgents: RegistryData[];
  pings?: Record<string, number>;
}) => {
  if (!agent) return null;

  return (
      <div className='container m-auto'>
        <div className='w-full lg:flex gap-12 justify-center'>
          <div className='w-full lg:w-1/3'>
            <DetailsSideBar {...{ agent }} />
          </div>
          <div className='w-full xl:w-[680px]'>
            <div className='grid grid-cols-1'>
              <div className='h-[420px] lg:h-[600px] mb-6 '>
                <AiChat selectedAgent={agent} isAgentPage />
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
                  <Card className='border border-[#313E52]'>
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
                  <Card className='border border-[#313E52]'>
                    <CardContent className='p-6'>
                      <div className='text-sm text-gray-400 mb-2'>
                        Daily Average
                      </div>
                      <div className='text-2xl font-bold text-white'>
                        {Math.round(
                          Object.values(pings).reduce(
                            (sum, count) => sum + count,
                            0
                          ) / Object.keys(pings).length
                        )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className='border border-[#313E52]'>
                    <CardContent className='p-6'>
                      <div className='text-sm text-gray-400 mb-2'>
                        Last 7 Days
                      </div>
                      <div className='text-2xl font-bold text-white'>
                        {Object.entries(pings)
                          .sort(
                            (a, b) =>
                              new Date(b[0]).getTime() -
                              new Date(a[0]).getTime()
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
                  <GitCommitHistory repoUrl={agent.repoUrl} />
                </div>
              </>
            )}
          </div>
        </div>
        <RelatedTemplates relatedAgents={relatedAgents} />
      </div>
  );
};
