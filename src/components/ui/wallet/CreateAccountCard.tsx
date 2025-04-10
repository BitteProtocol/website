import Image from 'next/image';
import React from 'react';
import { MB_URL } from '@/lib/url';

interface CreateAccountCardProps {
  className?: string;
}

export const CreateAccountCard: React.FC<CreateAccountCardProps> = ({
  className = '',
}) => {
  return (
    <a
      className={`w-full bg-mb-gray-650 hover:bg-mb-blue-30 h-[69px] sm:h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer transition-all duration-500 ease-in-out ${className}`}
      href={MB_URL.BITTE_WALLET_NEW_ACCOUNT}
      target='_blank'
      rel='noreferrer'
    >
      <div className='flex items-center justify-center rounded-md h-[40px] w-[40px] bg-white'>
        <Image
          src='/bitte-symbol-black.svg'
          width={26}
          height={19}
          alt='bitte-connect-logo'
        />
      </div>
      <div>
        <p className='text-sm text-mb-white-50 font-semibold mb-2'>
          Create New Account
        </p>
        <p className='text-mb-gray-50 text-xs'>for EVM and NEAR chains</p>
      </div>
    </a>
  );
};

export default CreateAccountCard;
