import Image from 'next/image';
import {
  useAppKit,
  useAppKitState,
  useAppKitNetwork,
} from '@reown/appkit/react';
import { networkMapping } from '@/lib/utils/chainIds';
import { ChevronDown, ChevronUp } from 'lucide-react';

const EvmNetworkSelector = () => {
  const { caipNetwork, chainId } = useAppKitNetwork();
  const { open: openNetworkModal } = useAppKit();
  const { open: isModalOpen } = useAppKitState();

  const imageUrl = networkMapping[Number(chainId)]?.icon;

  return (
    <div
      className='bg-[#27272A] rounded-full py-0.5 px-3 flex items-center min-w-[100px] gap-2 cursor-pointer'
      onClick={() => openNetworkModal({ view: 'Networks' })}
    >
      <div className='bg-black p-0.5 rounded'>
        <Image
          src={imageUrl}
          width={14}
          height={14}
          alt='connect-wallet-modal-logo-near'
        />
      </div>
      <span className='text-xs text-[#FAFAFA] font-normal'>
        {caipNetwork?.name}
      </span>
      {isModalOpen ? (
        <ChevronUp size={14} color='#60A5FA' />
      ) : (
        <ChevronDown size={14} color='#60A5FA' />
      )}
    </div>
  );
};

export default EvmNetworkSelector;
