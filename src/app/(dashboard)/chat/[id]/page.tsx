const ChatContent = dynamic(
  () => import('../../../../components/layout/ChatContent'),
  { ssr: false }
);

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

  return <ChatContent chatId={id} prompt={prompt} />;
};

export default ChatPage;

import dynamic from 'next/dynamic';
