'use client';

import EmailSection from '@/components/settings/EmailSection';
import SocialSection from '@/components/settings/SocialSection';
import WalletSection from '@/components/settings/WalletSection';

export default function SettingsPage() {
  return (
    <div className='text-white min-h-screen mx-auto p-6'>
      <h1 className='text-xl font-semibold mb-3'>Security & Access</h1>
      <div className='border-b border-zinc-800 mb-8 pb-2'></div>
      <EmailSection />
      <SocialSection />
      <WalletSection />
    </div>
  );
}
