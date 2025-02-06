import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import { useState } from 'react';
// Import your sidebar component after adding it with shadcn
import Sidebar from '@/components/sidebar/Sidebar';
// Import your logo, dialogs, and other components
import Logo from '@/components/Logo';
import ConnectDialog from '@/components/layout/ConnectDialog';
import ManageAccountsDialog from '@/components/layout/ManageAccountsDialog';
import AgentSelector from '@/components/layout/AgentSelector';
import AiChat from '@/components/layout/AiChat';
import AllAgents from '@/components/ui/agents/AllAgents';

// Dynamically import components that rely on client-side navigation
const AgentSelectorWithNoSSR = dynamic(
  () => import('@/components/layout/AgentSelector'),
  { ssr: false }
);
const AiChatWithNoSSR = dynamic(() => import('@/components/layout/AiChat'), {
  ssr: false,
});
const AllAgentsWithNoSSR = dynamic(
  () => import('@/components/ui/agents/AllAgents'),
  { ssr: false }
);

const ChatPage = () => {
  const router = useRouter();
  const { chatid } = router.query;
  const [isConnected, setIsConnected] = useState(false);
  // Define state to track selected sidebar option
  const [selectedSidebarOption, setSelectedSidebarOption] = useState('Chat');

  // Define your handlers for connecting and selecting sidebar options
  // ...

  return (
    <div className='flex'>
      <Sidebar
        collapsible
        logo={<Logo />}
        menuOptions={['Chat', 'Browse Agent']}
        selectedOption={selectedSidebarOption}
        onSelectOption={setSelectedSidebarOption}
      >
        {/* Place the ConnectDialog or ManageAccountsDialog at the bottom of the sidebar */}
        {!isConnected ? <ConnectDialog /> : <ManageAccountsDialog />}
      </Sidebar>
      <div className='flex-1'>
        {selectedSidebarOption === 'Chat' ? (
          <>
            <AgentSelectorWithNoSSR /* pass required props */ />
            <AiChatWithNoSSR /* pass required props */ />
          </>
        ) : (
          <AllAgentsWithNoSSR /* pass required props */ />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
