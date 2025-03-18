import { getNetworkMapping } from '@/lib/utils/chainIds';
import {
  useAppKit,
  useAppKitNetwork,
  useAppKitState,
} from '@reown/appkit/react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';

const EvmNetworkSelector = () => {
  const { caipNetwork, chainId } = useAppKitNetwork();
  const { open: openNetworkModal } = useAppKit();
  const { open: isModalOpen } = useAppKitState();

  const imageUrl = getNetworkMapping()[Number(chainId)]?.icon;

  return (
    <div
      className='bg-mb-gray-600 rounded-full py-0.5 px-3 flex items-center min-w-[100px] gap-2 cursor-pointer'
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
      <span className='text-xs text-mb-white-100 font-normal'>
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
