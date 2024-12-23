import { SupportedChainsSection } from './SupportedChainsSection';

export const RegistryBanner = () => {
  return (
    <section className='mt-9 md:mt-12 relative flex items-center'>
      <div className='flex flex-col w-full z-10 py-12 text-center md:text-start'>
        <span className='text-3xl md:text-4xl font-semibold mb-6'>
          Multi-Chain AI Agents Registry
        </span>
        <span className='text-base md:text-xl text-mb-gray-300 mb-9'>
          Browse and run the latest blockchain AI Agents.
        </span>
        <SupportedChainsSection noSpacing noTitle />
      </div>
    </section>
  );
};
