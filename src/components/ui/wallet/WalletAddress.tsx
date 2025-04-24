import React from 'react';
import { CopyStandard } from '../copy/Copy';

export interface WalletAddressProps {
  address: string;
  isNearAddress?: boolean;
  textSize?: 'xs' | 'sm';
  textColor?: string;
  copySize?: number;
  className?: string;
}

export const WalletAddress: React.FC<WalletAddressProps> = ({
  address,
  isNearAddress = false,
  textSize = 'xs',
  textColor = '#CBD5E1',
  copySize = 14,
  className = '',
}) => {
  return (
    <span className={`text-${textSize} flex items-center gap-3 ${className}`}>
      <CopyStandard
        text={address}
        textColor={textColor}
        textSize={textSize}
        copySize={copySize}
        nopadding
        isNearAddress={isNearAddress}
      />
    </span>
  );
};

export default WalletAddress;
