import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

interface WelcomeMessageProps {
  ConnectDialog: React.ComponentType<{
    isOpen: boolean;
    setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
    isWelcomeMessage?: boolean;
  }>;
  isConnectModalOpen: boolean;
  setConnectModalOpen: Dispatch<SetStateAction<boolean>>;
}

const WelcomeMessage = ({
  ConnectDialog,
  isConnectModalOpen,
  setConnectModalOpen,
}: WelcomeMessageProps) => {
  return (
    <div className='flex flex-col gap-4 items-center justify-center absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 text-center w-full'>
      <Image
        alt='bitte-ai-logo'
        className='mx-auto mb-4'
        width={40}
        height={28}
        src='/logo.svg'
      />
      <div className='mb-8 text-[20px] font-medium text-gray-40'>
        Execute Transactions with AI
      </div>
      <ConnectDialog
        isOpen={isConnectModalOpen}
        setConnectModalOpen={setConnectModalOpen}
        isWelcomeMessage
      />
    </div>
  );
};

export default WelcomeMessage;
