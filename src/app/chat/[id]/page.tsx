import { getAssistants } from '@/lib/api/ai-registry/registry';
import ChatContent from '@/components/layout/ChatContent';

const ChatPage = async ({ params }: { params: { id: string } }) => {
  const { id } = params;
  const agentData = await getAssistants();

  return <ChatContent agentData={agentData} chatId={id} />;
};

export default ChatPage;
