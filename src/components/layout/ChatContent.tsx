'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import SidebarLayout from '@/components/layout/SidebarLayout';
import { useBitteWallet } from '@bitte-ai/react';
import { RegistryData } from '@/lib/types/agent.types';
import { Filters as AgentFilters } from '@/lib/types/agent.types';
import { useAccount } from 'wagmi';

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
}: {
  agentData: { agents: RegistryData[] };
}) => {
  const [selectedAgent, setSelectedAgent] = useState<RegistryData | null>(null);
  const [selectedFilters] = useState<AgentFilters[]>([]);

  const { isConnected } = useBitteWallet();

  const { isConnected: isEvmConnected } = useAccount();
  const isWalletDisconnected = !isConnected && !isEvmConnected;

  console.log({ isWalletDisconnected });

  const filteredAgents = selectedFilters?.length
    ? agentData.agents.filter((agent) => {
        if (!agent) return false;

        return selectedFilters.every((filter) => {
          if (filter.label === 'Category' && agent.category) {
            return filter.values.includes(agent.category);
          }
          return true;
        });
      })
    : agentData.agents;

  useEffect(() => {
    if (agentData.agents.length) {
      setSelectedAgent(agentData.agents[0]);
    }
  }, [agentData]);

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

  return (
    <SidebarLayout>
      <div className='mt-6 z-10 flex flex-col lg:flex-row gap-6 lg:h-[500px] 2xl:h-[800px] w-full 2xl:w-4/5'>
        <div className='z-10 -mx-8 lg:-mx-0'>
          <AgentSelectorWithNoSSR
            agentData={filteredAgents}
            onSelectAgent={setSelectedAgent}
            selectedAgent={selectedAgent}
          />
        </div>
        <div className='lg:w-full h-[560px] lg:h-full -mx-8 lg:-mx-0'>
          <AiChatWithNoSSR selectedAgent={selectedAgent} />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default ChatContent;
