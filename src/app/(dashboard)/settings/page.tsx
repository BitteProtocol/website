'use client';

import EmailSection from '@/components/settings/EmailSection';
import SocialSection from '@/components/settings/SocialSection';
import WalletSection from '@/components/settings/WalletSection';

export default function SettingsPage() {
  return (
    <div className='text-white min-h-screen mx-auto p-6'>
      <h1 className='text-2xl font-bold mb-6'>Security & Access</h1>
      <div className='border-b border-zinc-800 mb-8 pb-2'></div>

      {/* Email Section */}
      <EmailSection />

      {/* Socials Section */}
      <SocialSection />

      {/* Accounts & Networks Section */}
      <WalletSection />
    </div>
  );
}
