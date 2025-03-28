import dynamic from 'next/dynamic';

const ChatContent = dynamic(
  () => import('../../../components/layout/ChatContent'),
  { ssr: false }
);

const ChatPage = async () => {
  return <ChatContent />;
};

export default ChatPage;
