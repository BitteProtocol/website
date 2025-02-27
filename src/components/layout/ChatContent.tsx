'use client';

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
  const agentIdParam = searchParams.get('agentid');
  const promptParam = searchParams.get('prompt');

  const togglePlayground = (value: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
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
    selectAgent(agent.id);
  };

  const selectAgent = (newAgentId: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (agentIdParam === newAgentId) {
      params.delete('agentid');
    } else {
      params.set('agentid', newAgentId);
    }

    history.replaceState({}, '', `?${params.toString()}`);
  };

  useEffect(() => {
    if (agentsList.length) {
      // Check if agentIdParam exists and set the agent based on it
      if (agentIdParam && !selectedAgent) {
        const agentById = agentsList.find((agent) => agent.id === agentIdParam);
        if (agentById) {
          setSelectedAgent(agentById);
          return;
        }
      }

      // Only set initial agent if none is selected
      if (!selectedAgent) {
        const storedAgent = sessionStorage.getItem('selectedAgent');
        if (storedAgent) {
          try {
            const parsed = JSON.parse(storedAgent);
            // Verify the stored agent exists in current list
            if (agentsList.some((agent) => agent.id === parsed.id)) {
              setSelectedAgent(parsed);
              return;
            }
          } catch (e) {
            console.error('Error parsing stored agent:', e);
          }
        }
        setSelectedAgent(agentsList[0]);
      }
    }
  }, [agentsList, selectedAgent, agentIdParam]);

  // Debounce saving to sessionStorage to prevent excessive writes
  useEffect(() => {
    if (selectedAgent) {
      const timeoutId = setTimeout(() => {
        sessionStorage.setItem('selectedAgent', JSON.stringify(selectedAgent));
      }, 300);
      return () => clearTimeout(timeoutId);
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
    <div className='flex flex-col lg:flex-row gap-2 lg:gap-6 lg:h-[calc(100vh-156px)] 2xl:h-[calc(100vh-280px)] w-full 2xl:w-4/5 mx-auto'>
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
        <div className='w-full h-[560px] lg:h-[calc(100vh-156px)] 2xl:h-[calc(100vh-280px)]'>
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
  );
};

export default ChatContent;
