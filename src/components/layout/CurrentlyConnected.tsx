import Image from 'next/image';
import { CopyStandard } from '../ui/copy/Copy';
import { Button } from '../ui/button';
import { Unlink } from 'lucide-react';
import { ConnectedWalletProps } from '@/lib/wallet/types';

const CurrentlyConnected: React.FC<ConnectedWalletProps> = ({
  chainIcon,
  accountId,
  networkBadge,
  network,
  balance,
  action,
}) => {
  return (
    <div className='flex gap-2 items-center justify-between'>
      <div className='flex items-center gap-3'>
        {network === 'SUI' ? (
          <div className='flex items-center justify-center rounded-md h-[40px] w-[40px] bg-white'>
            <Image
              src={chainIcon}
              width={24}
              height={24}
              alt='connect-wallet-modal-logo'
            />
          </div>
        ) : (
          <Image
            src={chainIcon}
            width={40}
            height={40}
            alt='connect-wallet-modal-logo'
          />
        )}
        <div className='flex flex-col items-start gap-1.5'>
          <CopyStandard
            text={accountId}
            textColor='#CBD5E1'
            textSize='sm'
            copySize={14}
            nopadding
            isNearAddress={network === 'NEAR'}
          />
          <div className='flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5'>
            {networkBadge}
            <small className='text-xs text-mb-gray-300 font-normal'>
              {balance} {network}
            </small>
          </div>
        </div>
      </div>
      <Button
        variant='outline'
        className='px-2.5 border border-mb-red-30 bg-transparent'
        size='sm'
        onClick={action}
      >
        <Unlink size={16} color='#EF4444' />
      </Button>
    </div>
  );
};

export default CurrentlyConnected;
