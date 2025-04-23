import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { WalletSelectModalProps } from '@/lib/wallet/types';

export const WalletSelectModal: React.FC<WalletSelectModalProps> = ({
  wallets,
  onClose,
  onSelectWallet,
  isWalletInstalled,
  connectionError,
}) => {
  return (
    <div className='fixed inset-0 bg-black/70 flex items-center justify-center z-50'>
      <div className='bg-black p-6 rounded-md max-w-md w-full border border-mb-gray-800'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-white text-lg font-medium'>Connect SUI Wallet</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white'>
            <X size={20} />
          </button>
        </div>

        {connectionError && (
          <div className='bg-red-900/30 border border-red-500/30 p-3 rounded-md mb-4'>
            <p className='text-red-400 text-sm'>{connectionError}</p>
          </div>
        )}

        <div className='space-y-3'>
          {wallets.map((walletInfo) => {
            const isInstalled = isWalletInstalled(walletInfo.name);

            return (
              <div key={walletInfo.name} className='w-full'>
                {isInstalled ? (
                  <button
                    onClick={() => onSelectWallet(walletInfo.name)}
                    className='w-full bg-mb-gray-650 text-white px-4 py-3 rounded-md hover:bg-mb-blue-30 transition-colors flex items-center gap-3'
                  >
                    <div className='w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center'>
                      <Image
                        src={walletInfo.icon}
                        width={20}
                        height={20}
                        alt={`${walletInfo.name}-logo`}
                        className='object-contain'
                      />
                    </div>
                    <div className='flex justify-between items-center w-full'>
                      <span className='font-medium'>{walletInfo.name}</span>
                    </div>
                  </button>
                ) : (
                  <a
                    href={walletInfo.downloadUrl}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='w-full bg-mb-gray-700 text-mb-gray-300 px-4 py-3 rounded-md flex items-center gap-3 hover:bg-mb-gray-650 transition-colors'
                  >
                    <div className='w-8 h-8 rounded-full bg-[#1E1E1E] flex items-center justify-center'>
                      <Image
                        src={walletInfo.icon}
                        width={20}
                        height={20}
                        alt={`${walletInfo.name}-logo`}
                        className='object-contain'
                      />
                    </div>
                    <div className='flex justify-between items-center w-full'>
                      <span className='font-medium'>{walletInfo.name}</span>
                      <span className='text-xs text-mb-blue-100'>
                        Install wallet
                      </span>
                    </div>
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WalletSelectModal;
