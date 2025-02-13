import ChatContent from '@/components/layout/ChatContent';
import { getAssistants } from '@/lib/api/ai-registry/registry';

const ChatPage = async () => {
  const agentData = await getAssistants();

  return <ChatContent agentData={agentData} />;
};

export default ChatPage;
