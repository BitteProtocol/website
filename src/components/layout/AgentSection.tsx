import { AgentSectionComponent } from '../AgentSectionComp';
import { fetchVerifiedAssistants } from '@/lib/data/fetchVerifiedAssistants';

const AgentSection = async () => {
  const agentData = await fetchVerifiedAssistants();

  if (agentData.agents && agentData.agents.length > 0) {
    return <AgentSectionComponent agentData={agentData} />;
  }

  return <></>;
};

export default AgentSection;
