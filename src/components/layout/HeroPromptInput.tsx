'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BITTE_AGENTID } from '@/lib/agentConstants';
import { cn } from '@/lib/utils';
import { generateId } from 'ai';
import { ArrowUp, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const AgentBadge = ({ className }: { className?: string }) => {
  return (
    <Badge
      variant='outline'
      className={cn(
        'w-fit rounded-full border-[#475569] border-dashed text-[#C084FC] bg-zinc-900/90 py-1 text-[12px] uppercase',
        className
      )}
    >
      Bitte Assistant
    </Badge>
  );
};

const HeroPromptInput = () => {
  const [value, setValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const router = useRouter();

  useEffect(() => {
    setId(generateId());
    router.prefetch('/chat');
  }, [router]);

  const handleSubmit = async () => {
    if (!value.trim() || isLoading) return;

    setIsLoading(true);
    const chatPath = `/chat/${id}?agentid=${BITTE_AGENTID}&prompt=${encodeURIComponent(value)}`;

    try {
      await router.replace(chatPath);
    } finally {
      setValue('');
      // Keep loading true since we're navigating away
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea && value) {
      textarea.style.height = 'auto';
      const newHeight = Math.min(textarea.scrollHeight, 200);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    adjustTextareaHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    setScrollPosition(e.currentTarget.scrollTop);
  };

  // Calculate opacity based on scroll position
  const badgeOpacity = Math.max(0, 1 - scrollPosition / 20);

  useEffect(() => {
    adjustTextareaHeight();
  }, []);

  return (
    <div className='relative rounded-2xl bg-zinc-900/90 p-3 shadow-lg'>
      <AgentBadge className='sm:hidden flex' />
      <div className='relative'>
        <div className='pb-[52px]'>
          <Textarea
            ref={textareaRef}
            value={value}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            onChange={handleTextareaChange}
            placeholder='Enter your prompt...'
            className='w-full resize-none border-0 bg-transparent pt-2.5 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0 text-base md:text-base [&::placeholder]:text-left sm:indent-[136px] px-0'
          />
          <div
            className='absolute top-2 hidden sm:block pointer-events-none'
            style={{ opacity: badgeOpacity }}
          >
            <AgentBadge />
          </div>
        </div>

        <div className='flex gap-2 items-center absolute bottom-2 right-0'>
          <Button
            asChild
            className='bg-[#60A5FA4D] hover:bg-[#60A5FA]/40 text-[#60A5FA]'
          >
            <Link href='/agents'>All Agents</Link>
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={value?.length === 0}
            size='icon'
            className='h-10 w-10 rounded-lg bg-white text-black hover:bg-zinc-200'
          >
            {isLoading ? (
              <Loader2 className='h-4 w-4 animate-spin' />
            ) : (
              <ArrowUp className='h-4 w-4' />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroPromptInput;
