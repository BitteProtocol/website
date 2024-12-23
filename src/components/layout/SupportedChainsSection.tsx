import { fira } from '@/app/fonts';
import { chainData } from '@/lib/data/chainData';
import Image from 'next/image';

export const SupportedChainsSection = ({
  noSpacing,
  noTitle,
  isRegistry,
}: {
  noSpacing?: boolean;
  noTitle?: boolean;
  isRegistry?: boolean;
}) => {
  return (
    <section
      className={`relative ${noSpacing ? '' : 'mt-12 md:mt-24 mb-16 md:mb-32 px-5'}`}
    >
      {!noTitle && (
        <p
          className={`${fira.className} text-sm text-mb-gray-300 font-normal text-center uppercase mb-6`}
        >
          Supported Chains
        </p>
      )}
      <div
        className={`flex flex-wrap itmes-center ${noSpacing ? '' : 'justify-center'} gap-6 md:gap-8`}
      >
        {chainData?.map((data, i) => (
          <div className='flex items-center gap-1.5' key={`chains-${i}`}>
            <Image
              src={data?.logo}
              className='object-contain'
              width={isRegistry ? 24 : 32}
              height={isRegistry ? 24 : 32}
              alt={`${data?.logo}-logo`}
              loading='lazy'
            />
            <div
              className={`${isRegistry ? 'text-sm text-[#94A3B8]' : 'text-base text-mb-white-100 font-medium'}`}
            >
              {data?.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
