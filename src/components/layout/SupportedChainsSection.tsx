import { fira } from '@/app/fonts';
import { chainData } from '@/lib/data/chainData';
import { cn } from '@/lib/utils';
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
          className={`${fira.className} text-sm text-mb-gray-100 font-normal text-center uppercase mb-6`}
        >
          Supported Chains
        </p>
      )}
      <div
        className={`flex flex-wrap items-center ${noSpacing ? '' : 'justify-center'} gap-6 md:gap-8`}
      >
        {chainData?.map((data, i) => (
          <div className='flex items-center gap-1.5' key={`chains-${i}`}>
            <Image
              src={data?.logo}
              className={cn('object-contain', isRegistry ? 'size-6' : 'size-8')}
              alt={`${data?.logo}-logo`}
              width={0}
              height={0}
              loading='lazy'
            />
            <div
              className={`${isRegistry ? 'text-sm text-mb-gray-400' : 'text-base text-mb-gray-100 font-medium'}`}
            >
              {data?.name}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
