'use client';

import { fira } from '@/app/fonts';
import { MB_URL } from '@/lib/url';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import TextSection from './TextSection';

const mpcTextSection = {
  title: 'Code Less, Innovate More',
  subHeader:
    'Convert APIs into agents in minutes. Secure, scalable, and built for developers. Dive into our library or build custom agents to automate workflows, secure transactions, and scale ecosystems.',
  factTitle: '',
  fact: '',
  isDisabled: false,
  noSpacing: true,
};

const MpcSection = () => {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(MB_URL.MPC_URL);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <section className='flex flex-col items-center justify-center w-full my-24 px-4 sm:px-0'>
      <TextSection {...mpcTextSection} />
      <div className='flex flex-col gap-8 items-center justify-center w-full'>
        <span
          className={`${fira.className} bg-mb-purple-20 backdrop-blur-md rounded-full text-mb-purple uppercase text-xs py-1.5 px-5`}
        >
          Connect MPC
        </span>
        <div className='w-full max-w-lg bg-black rounded-md border border-mb-purple-10 px-6 py-5 flex items-center justify-center sm:justify-between flex-wrap gap-4'>
          <code className='text-white font-mono'>{MB_URL.MPC_URL}</code>
          <Button
            onClick={handleCopy}
            variant='secondary'
            className='w-full sm:w-[120px]'
          >
            {copied ? <Check className='w-4 h-4 inline mr-1' /> : null}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default MpcSection;
