'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { generateId } from 'ai';
import { ArrowUp, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const AgentBadge = ({ className }: { className?: string }) => {
  return (
    <Badge
      variant='outline'
      className={cn(
        'w-fit rounded-full border-[#475569] border-dashed text-[#C084FC] bg-zinc-900/90 py-1 text-[12px] uppercase',
        className
      )}
    >
      CoWSwap Assistant
    </Badge>
  );
};

const HeroPromptInput = () => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>('');

  const router = useRouter();

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push(`/chat/${id}?prompt=${value}`);
    setValue('');
    setIsLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  useEffect(() => {
    setId(generateId());
  }, []);

  return (
    <div className='relative rounded-2xl bg-zinc-900/90 p-3 shadow-lg'>
      <AgentBadge className='sm:hidden flex' />
      <div className='relative'>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter your prompt...'
          className='min-h-[100px] w-full resize-none border-0 bg-transparent pt-2.5 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0 text-base leading-relaxed [&::placeholder]:text-left sm:indent-[178px] px-0'
        />
        <AgentBadge className='absolute left-2 top-2 hidden sm:block' />
        <Button
          onClick={handleSubmit}
          disabled={value?.length === 0}
          size='icon'
          className='absolute bottom-2 right-2 h-10 w-10 rounded-lg bg-white text-black hover:bg-zinc-200'
        >
          {isLoading ? (
            <Loader2 className='h-4 w-4 animate-spin' />
          ) : (
            <ArrowUp className='h-4 w-4' />
          )}
        </Button>
      </div>
    </div>
  );
};

export default HeroPromptInput;
