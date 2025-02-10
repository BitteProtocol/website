import { getAssistants } from '@/lib/api/ai-registry/registry';
import ChatContent from '@/components/layout/ChatContent';

const ChatPage = async () => {
  const agentData = await getAssistants();
  return <ChatContent agentData={agentData} />;
};

export default ChatPage;
