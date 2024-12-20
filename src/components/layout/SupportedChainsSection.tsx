import { fira } from '@/app/fonts';
import { chainData } from '@/lib/data/chainData';
import Image from 'next/image';

export const SupportedChainsSection = () => {
  return (
    <section className='relative mt-12 md:mt-24 mb-16 md:mb-32 px-5'>
      <p
        className={`${fira.className} text-sm text-mb-gray-300 font-normal text-center uppercase mb-6`}
      >
        Supported Chains
      </p>
      <div className='flex flex-wrap itmes-center justify-center gap-6 md:gap-8'>
        {chainData?.map((data, i) => (
          <div className='flex items-center gap-1.5' key={`chains-${i}`}>
            <Image
              src={data?.logo}
              className='object-contain'
              width={32}
              height={32}
              alt={`${data?.logo}-logo`}
              loading='lazy'
            />
            <div className='text-mb-white-100 font-medium'>{data?.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
};
