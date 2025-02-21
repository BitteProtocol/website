import ChatContent from '@/components/layout/ChatContent';
import { Skeleton } from '@/components/ui/skeleton';
import { getAssistants } from '@/lib/api/ai-registry/registry';
import { Suspense } from 'react';

const ChatPage = async () => {
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
      <ChatContent agentData={agentData} />
    </Suspense>
  );
};

export default ChatPage;
