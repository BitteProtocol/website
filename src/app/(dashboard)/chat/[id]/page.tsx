import ChatContent from '@/components/layout/ChatContent';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ChatPage = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: URLSearchParams;
}) => {
  const { id } = params;
  const searchParamsObj = new URLSearchParams(searchParams.toString());
  const prompt = searchParamsObj.get('prompt') || undefined;

  const agentData = await getAssistants();

  if (!agentData) {
    return null;
  }

  return (
    <Suspense
      fallback={
        <div className='flex gap-3'>
          <Skeleton className='w-1/6 h-[100vh]' />
          <Skeleton className='w-1/6 h-[70vh] mt-20' />
          <Skeleton className='w-4/6 h-[70vh] mt-20' />
        </div>
      }
    >
      <ChatContent agentData={agentData} chatId={id} prompt={prompt} />
    </Suspense>
  );
};

export default ChatPage;
