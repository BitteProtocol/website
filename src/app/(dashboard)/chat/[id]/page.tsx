import ChatContent from '@/components/layout/ChatContent';

const ChatPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) => {
  const { id } = await params;

  const prompt = (await searchParams).prompt;

  return <ChatContent chatId={id} prompt={prompt} />;
};

export default ChatPage;
