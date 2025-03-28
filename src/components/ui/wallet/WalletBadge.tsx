import Image from 'next/image';
import React from 'react';
import { NetworkBadgeProps } from '@/lib/wallet/types';

export const WalletBadge: React.FC<NetworkBadgeProps> = ({
  networkName,
  iconPath,
  iconSize = 14,
  className = '',
}) => {
  return (
    <div className={`bg-mb-gray-600 rounded-full py-0.5 px-3 flex items-center gap-2 w-fit ${className}`}>
      <div className='bg-black p-0.5 rounded'>
        <Image
          src={iconPath}
          width={iconSize}
          height={iconSize}
          alt={`${networkName.toLowerCase()}-network-badge`}
        />
      </div>
      <span className='text-xs text-mb-white-100 font-normal'>{networkName}</span>
    </div>
  );
};

export default WalletBadge; 