import Image from 'next/image';
import { CopyStandard } from '../ui/copy/Copy';
import { Button } from '../ui/button';
import { Unlink } from 'lucide-react';

const CurrentlyConnected = ({
  chainIcon,
  accountId,
  networkBadge,
  network,
  balance,
  action,
}: {
  chainIcon: string;
  accountId: string;
  networkBadge: JSX.Element;
  network: string;
  balance: string | number;
  action: () => void;
}) => {
  return (
    <div className='flex gap-2 items-center justify-between'>
      <div className='flex items-center gap-3'>
        <Image
          src={chainIcon}
          width={40}
          height={40}
          alt='connect-wallet-modal-logo-near'
        />
        <div className='flex flex-col items-start gap-1.5'>
          <CopyStandard
            text={accountId}
            textColor='#CBD5E1'
            textSize='sm'
            copySize={14}
            nopadding
            isNearAddress
          />
          <div className='flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-5'>
            {networkBadge}
            <small className='text-xs text-[#CBD5E1] font-normal'>
              {balance} {network}
            </small>
          </div>
        </div>
      </div>
      <Button
        variant='outline'
        className='px-2.5 border border-[#EF44444D] bg-transparent'
        size='sm'
        onClick={action}
      >
        <Unlink size={16} color='#EF4444' />
      </Button>
    </div>
  );
};

export default CurrentlyConnected;
