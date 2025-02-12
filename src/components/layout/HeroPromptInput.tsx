'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { generateId } from 'ai';
import { ArrowUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const HeroPromptInput = () => {
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    setValue('');
    const id = generateId();
    router.push(`/chat/${id}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  console.log(value, !!value);

  return (
    <div className='relative rounded-2xl bg-zinc-900/90 p-2 shadow-lg'>
      <div className='relative'>
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Enter your prompt...'
          style={{ textIndent: '136px' }}
          className='min-h-[100px] w-full resize-none border-0 bg-transparent pt-2.5 text-zinc-200 placeholder:text-zinc-500 focus-visible:ring-0 text-sm leading-relaxed [&::placeholder]:text-left'
        />
        <Badge
          variant='outline'
          className='absolute left-2 top-2 rounded-full border-[#475569] border-dashed text-[#C084FC] bg-zinc-900/90 py-1 text-[12px]'
        >
          BITTE ASSISTANT
        </Badge>
        <Button
          onClick={handleSubmit}
          disabled={value?.length === 0}
          size='icon'
          className='absolute bottom-2 right-2 h-10 w-10 rounded-lg bg-white text-black hover:bg-zinc-200'
        >
          <ArrowUp className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default HeroPromptInput;
