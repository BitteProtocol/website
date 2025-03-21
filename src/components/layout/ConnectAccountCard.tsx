import { Roboto_Mono } from 'next/font/google';
import Image from 'next/image';

const roboto_mono = Roboto_Mono({ subsets: ['latin'] });

const ConnectAccountCard = ({
  action,
  icon,
  text,
  account,
}: {
  action: (() => void) | (() => void)[];
  icon: { src: string; width?: number; height?: number };
  text: string;
  account: string;
}) => {
  const handleClick = () => {
    if (Array.isArray(action)) {
      action.forEach((fn) => fn());
    } else {
      action();
    }
  };

  return (
    <div
      className='w-full bg-mb-gray-650 hover:bg-mb-blue-30 h-[69px] sm:h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer transition-all duration-500 ease-in-out'
      onClick={handleClick}
    >
      <div className='flex items-center gap-2 justify-between w-full'>
        <Image
          src={icon.src}
          width={icon.width || 40}
          height={icon.height || 40}
          alt='connect-wallet-connect-logo'
        />

        <div className='flex flex-col sm:flex-row gap-1.5 w-full'>
          <p className='text-sm font-semibold text-mb-white-50'>{text}</p>

          <div className='flex sm:ml-auto items-center'>
            <p className='text-mb-gray-50 text-xs italic'>
              e.g.
              <span
                className={`ml-2 bg-mb-black-deep p-1 sm:p-1.5 rounded-md text-xs text-mb-blue-100 not-italic ${roboto_mono.className}`}
              >
                {account}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectAccountCard;
