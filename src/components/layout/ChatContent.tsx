'use client';

import SidebarLayout from '@/components/layout/SidebarLayout';
import { RegistryData } from '@/lib/types/agent.types';
import { AssistantsMode } from '@bitte-ai/chat';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AgentsDrawer } from '../ui/agents/AgentsDrawer';
import { Button } from '../ui/button';

// Dynamically import components that rely on client-side navigation
const AgentSelectorWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AgentSelector'),
  { ssr: false }
);
const AiChatWithNoSSR = dynamic(() => import('@/components/layout/AiChat'), {
  ssr: false,
});

const ChatContent = ({
  agentData,
  chatId,
  prompt,
}: {
  agentData: {
    agents: RegistryData[];
    unverifiedAgents: RegistryData[];
  };
  chatId?: string;
  prompt?: string;
}) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [isAgentsDrawerOpen, setIsAgentsDrawerOpen] = useState(false);

  const searchParams = useSearchParams();
  const modeParam = searchParams.get('mode');

  const togglePlayground = (value: boolean) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('mode', AssistantsMode.DEBUG);
    } else {
      params.delete('mode');
    }

    history.replaceState({}, '', `?${params.toString()}`);
  };

  const mode = modeParam || AssistantsMode.DEFAULT;
  const isPlayground = mode === AssistantsMode.DEBUG;

  const agentsList = isPlayground
    ? agentData.unverifiedAgents
    : agentData.agents;

  const handleSelectAgent = (agent: RegistryData) => {
    setSelectedAgent(agent);
    setIsAgentsDrawerOpen(false);
  };

  useEffect(() => {
    if (agentsList.length) {
      setSelectedAgent(agentsList[0]);
    }
  }, [agentsList]);

  useEffect(() => {
    // Retrieve the selected agent from sessionStorage when the component mounts
    const storedAgent = sessionStorage.getItem('selectedAgent');
    if (storedAgent) {
      setSelectedAgent(JSON.parse(storedAgent));
    }
  }, []);

  useEffect(() => {
    // Save the selected agent to sessionStorage whenever it changes
    if (selectedAgent) {
      sessionStorage.setItem('selectedAgent', JSON.stringify(selectedAgent));
    }
  }, [selectedAgent]);

  const agentContentComponent = (
    <AgentSelectorWithNoSSR
      agentData={agentsList}
      onSelectAgent={handleSelectAgent}
      selectedAgent={selectedAgent}
      isPlayground={isPlayground}
      togglePlayground={togglePlayground}
    />
  );

  return (
    <SidebarLayout>
      <div className='flex flex-col lg:flex-row gap-2 lg:gap-6 lg:h-[calc(100vh-156px)] 2xl:h-[calc(100vh-360px)] w-full 2xl:w-4/5 mx-auto'>
        <AgentsDrawer
          open={isAgentsDrawerOpen}
          onOpenChange={setIsAgentsDrawerOpen}
        >
          {agentContentComponent}
        </AgentsDrawer>

        <div className='w-1/3 lg:min-w-[310px]'>
          <div className='hidden lg:flex h-full'>{agentContentComponent}</div>
        </div>
        <div className='grid grid-cols-1 w-full'>
          <div className='w-full h-[560px] lg:h-full'>
            <AiChatWithNoSSR
              selectedAgent={selectedAgent}
              chatId={chatId}
              prompt={prompt}
              agentsButton={
                <Button
                  className='w-full bg-[#27272A] hover:bg-[#27272A] hover:bg-opacity-60 text-white'
                  onClick={() => setIsAgentsDrawerOpen(true)}
                >
                  Agents
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ChatContent;
