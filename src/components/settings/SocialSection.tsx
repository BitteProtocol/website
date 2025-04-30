import { useNextAuthSocialConnections } from '@/hooks/useNextAuthSocialConnections';
import { Github, Loader2, X } from 'lucide-react';
import { useEffect } from 'react';

const SocialSection = () => {
  const {
    connectedAccounts,
    isConnecting,
    isDisconnecting,
    error,
    connectSocialAccount,
    disconnectSocialAccount,
    isConnected,
    getAccount,
    loading,
    status,
  } = useNextAuthSocialConnections();

  const handleConnect = (provider: string) => {
    console.log(`Connecting to ${provider}...`);
    connectSocialAccount(provider);
  };

  const handleDisconnect = (provider: string) => {
    console.log(`Disconnecting from ${provider}...`);
    disconnectSocialAccount(provider);
  };

  // Enhanced debugging
  useEffect(() => {
    console.log('Connected accounts updated:', connectedAccounts);
    console.log(
      'Twitter connected:',
      isConnected('twitter'),
      getAccount('twitter')
    );
    console.log(
      'GitHub connected:',
      isConnected('github'),
      getAccount('github')
    );
  }, [connectedAccounts, isConnected, getAccount]);

  return (
    <div className='mb-12'>
      <h2 className='text-lg font-semibold mb-4'>Socials</h2>
      <p className='text-mb-silver text-sm font-medium mb-6'>
        Connect your social accounts for additional methods of account recovery.
      </p>

      {loading ? (
        <div className='flex items-center space-x-2'>
          <Loader2 size={20} className='animate-spin' />
          <span>Loading connections...</span>
        </div>
      ) : (
        <div className='flex flex-col space-y-4'>
          {/* Twitter/X Connection */}
          <div className='flex items-center'>
            <button
              className={`flex items-center ${isConnected('twitter') ? 'bg-mb-blue-30' : 'bg-zinc-800'} hover:bg-zinc-700 px-4 py-2 rounded w-32 ${
                isConnecting && !isConnected('twitter') ? 'animate-pulse' : ''
              }`}
              onClick={() => handleConnect('twitter')}
              disabled={
                isConnecting || isDisconnecting || isConnected('twitter')
              }
            >
              {isConnecting && !isConnected('twitter') && (
                <Loader2 size={20} className='mr-2 animate-spin' />
              )}
              <span className='mx-auto'>X</span>
            </button>

            <div className='ml-4 flex items-center'>
              {isConnected('twitter') ? (
                <>
                  <span className='text-mb-blue-100 mr-4'>
                    {getAccount('twitter')?.username || 'CONNECTED'}
                  </span>
                  <button
                    className='text-mb-silver hover:text-red-500'
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
                <span className='text-[#ADAFB6] font-medium text-xs uppercase'>
                  NOT CONNECTED
                </span>
              )}
            </div>
          </div>

          {/* GitHub Connection */}
          <div className='flex items-center'>
            <button
              className='flex items-center bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded w-32 h-[40px]'
              onClick={() => handleConnect('github')}
              disabled={
                isConnecting || isDisconnecting || isConnected('github')
              }
            >
              {isConnecting && !isConnected('github') ? (
                <Loader2 size={20} className='mr-2 animate-spin' />
              ) : (
                <Github size={20} className='mr-2' />
              )}
              <span className='font-medium text-sm'>Github</span>
            </button>

            <div className='ml-4 flex items-center'>
              {isConnected('github') ? (
                <>
                  <span className='text-blue-400 mr-4'>
                    {getAccount('github')?.username || '@github-user'}
                  </span>
                  <button
                    className='text-gray-400 hover:text-red-500 h-[40px]'
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
                <span className='text-[#ADAFB6] font-medium text-xs uppercase'>
                  NOT CONNECTED
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {error && <p className='mt-4 text-red-500 text-sm'>{error}</p>}
    </div>
  );
};

export default SocialSection;
