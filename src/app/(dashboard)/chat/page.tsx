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
          <Skeleton className='w-1/3 h-[70vh]' />
          <Skeleton className='w-2/3 h-[70vh]' />
        </div>
      }
    >
      <ChatContent agentData={agentData} />
    </Suspense>
  );
};

export default ChatPage;
