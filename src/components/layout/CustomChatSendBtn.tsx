import { SendButtonComponentProps } from '@bitte-ai/chat';
import { ArrowUp } from 'lucide-react';
import { Button } from '../ui/button';

const CustomChatSendButton = ({
  input,
  isLoading,
}: SendButtonComponentProps) => (
  <Button
    type='submit'
    disabled={!input || isLoading}
    className='bitte-h-[42px] bitte-w-full lg:bitte-w-[42px] bitte-p-0 disabled:bitte-opacity-20'
    aria-label='Send message'
  >
    <ArrowUp className='bitte-h-[16px] bitte-w-[16px] bitte-hidden lg:bitte-block' />
    <span className='lg:bitte-hidden'>Send</span>
  </Button>
);

export default CustomChatSendButton;
