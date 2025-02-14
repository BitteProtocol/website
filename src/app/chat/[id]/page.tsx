import ChatContent from '@/components/layout/ChatContent';
import { getAssistants } from '@/lib/api/ai-registry/registry';

const ChatPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: URLSearchParams;
}) => {
  const { id } = params;
  const searchParamsObj = new URLSearchParams(searchParams);
  const prompt = searchParamsObj.get('prompt') || undefined;

  const agentData = await getAssistants();

  return <ChatContent agentData={agentData} chatId={id} prompt={prompt} />;
};

export default ChatPage;
