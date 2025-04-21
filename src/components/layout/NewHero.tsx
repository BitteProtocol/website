import { fetchVerifiedAssistants } from '@/lib/data/fetchVerifiedAssistants';
import { RegistryData } from '@/lib/types/agent.types';
import { cookies } from 'next/headers';
import { Hero } from './HeroComponent';

export default async function NewHero() {
  const agentData = await fetchVerifiedAssistants();

  // Get selected agent from cookies instead of sessionStorage
  const cookieStore = cookies();
  const selectedAgentCookie = cookieStore.get('selectedAgent');
  let selectedAgent = agentData?.agents?.[0] || null;

  if (selectedAgentCookie) {
    try {
      selectedAgent = JSON.parse(selectedAgentCookie.value);
    } catch (e) {
      console.error('Error parsing selectedAgent cookie:', e);
    }
  }

  // Map and ensure all required properties exist
  const mappedAgentData = agentData
    ? {
        ...agentData,
        agents:
          agentData.agents?.map((agent) => ({
            ...agent,
            id: agent.id || '',
            name: agent.name || 'Unnamed Agent',
            image: agent.image || '/logo.svg',
          })) || [],
        filters: agentData.filters || [],
      }
    : { agents: [], filters: [] };

  const mappedSelectedAgent = selectedAgent
    ? {
        ...selectedAgent,
        id: selectedAgent.id || '',
        name: selectedAgent.name || 'Unnamed Agent',
        image: selectedAgent.image || '/logo.svg',
      }
    : null;

  return (
    <Hero
      agentData={mappedAgentData}
      selectedAgent={mappedSelectedAgent as RegistryData}
    />
  );
}
