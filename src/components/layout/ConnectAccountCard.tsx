import Image from 'next/image';
import { Roboto_Mono } from 'next/font/google';

const roboto_mono = Roboto_Mono({ subsets: ['latin'] });

const ConnectAccountCard = ({
  action,
  icon1,
  icon2,
  text,
  account,
}: {
  action: (() => void) | (() => void)[];
  icon1: string;
  icon2?: string;
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
      className='w-full bg-[#232323] hover:bg-[#60A5FA4D] h-[61px] flex items-center gap-3 rounded-md p-3 cursor-pointer'
      onClick={handleClick}
    >
      <div className='flex items-center gap-2'>
        <Image
          src={icon1}
          width={40}
          height={40}
          alt='connect-wallet-connect-logo'
        />
        {icon2 ? (
          <Image
            src={icon2}
            width={40}
            height={40}
            alt='metamask-connect-logo'
          />
        ) : null}
        <p className='text-sm font-semibold text-[#F8FAFC]'>{text}</p>
      </div>
      <div className='flex ml-auto items-center'>
        <p className='text-[#BABDC2] text-xs italic'>
          e.g.
          <span
            className={`ml-2 bg-[#010101] p-1.5 rounded-md text-xs text-[#60A5FA] not-italic ${roboto_mono.className}`}
          >
            {account}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ConnectAccountCard;
