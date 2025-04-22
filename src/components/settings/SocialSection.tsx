import { useSocialConnections } from '@/hooks/useSocialConnections';
import { Github, Loader2, Twitter, X } from 'lucide-react';

const SocialSection = () => {
  const {
    isConnecting,
    isDisconnecting,
    error,
    connectSocialAccount,
    disconnectSocialAccount,
    isConnected,
    getAccount,
  } = useSocialConnections();

  const handleConnect = (provider: string) => {
    connectSocialAccount(provider);
  };

  const handleDisconnect = (provider: string) => {
    disconnectSocialAccount(provider);
  };

  return (
    <div className='mb-12'>
      <h2 className='text-xl font-bold mb-4'>Socials</h2>
      <p className='text-gray-400 mb-6'>
        Connect your social accounts for additional methods of account recovery.
      </p>

      <div className='flex flex-col space-y-4'>
        {/* Twitter/X Connection */}
        <div className='flex items-center'>
          <button
            className='flex items-center bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded w-32'
            onClick={() => handleConnect('twitter')}
            disabled={isConnecting || isDisconnecting || isConnected('twitter')}
          >
            {isConnecting && !isConnected('twitter') ? (
              <Loader2 size={20} className='mr-2 animate-spin' />
            ) : (
              <Twitter size={20} className='mr-2' />
            )}
            <span>X</span>
          </button>

          <div className='ml-4 flex items-center'>
            {isConnected('twitter') ? (
              <>
                <span className='text-gray-400 mr-4'>CONNECTED</span>
                <button
                  className='text-gray-400 hover:text-red-500'
                  onClick={() => handleDisconnect('twitter')}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    <X size={16} />
                  )}
                </button>
              </>
            ) : (
              <span className='text-gray-400'>NOT CONNECTED</span>
            )}
          </div>
        </div>

        {/* GitHub Connection */}
        <div className='flex items-center'>
          <button
            className='flex items-center bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded w-32'
            onClick={() => handleConnect('github')}
            disabled={isConnecting || isDisconnecting || isConnected('github')}
          >
            {isConnecting && !isConnected('github') ? (
              <Loader2 size={20} className='mr-2 animate-spin' />
            ) : (
              <Github size={20} className='mr-2' />
            )}
            <span>Github</span>
          </button>

          <div className='ml-4 flex items-center'>
            {isConnected('github') ? (
              <>
                <span className='text-blue-400 mr-4'>
                  {getAccount('github')?.username}
                </span>
                <button
                  className='text-gray-400 hover:text-red-500'
                  onClick={() => handleDisconnect('github')}
                  disabled={isDisconnecting}
                >
                  {isDisconnecting ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    <X size={16} />
                  )}
                </button>
              </>
            ) : (
              <span className='text-gray-400'>NOT CONNECTED</span>
            )}
          </div>
        </div>
      </div>

      {error && <p className='mt-4 text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export default SocialSection;
