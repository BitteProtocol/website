import '@near-wallet-selector/modal-ui/styles.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';
import NextTopLoader from 'nextjs-toploader';

import '@/app/styles/globals.css';
import '@/app/markdown.css';
import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import Providers from '@/lib/providers/Providers';
import { MB_URL } from '@/lib/url';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bitte.ai - Blockchain empowered by AI Agents',
  openGraph: {
    title: 'Bitte.ai - Blockchain empowered by AI Agents',
    description:
      'Your portal to effortlessly launch cutting-edge Web3 experiences.',
    images: [
      {
        type: 'image/png',
        url: 'https://bitte.ai/thumbnail.png',
        width: '1200',
        height: '630',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bitte.ai - Blockchain empowered by AI Agents',
    description:
      'Your portal to effortlessly launch cutting-edge Web3 experiences.',
    siteId: '1467726470533754880',
    creator: 'Bitte',
    images: 'https://bitte.ai/thumbnail.png',
  },
  description:
    'Your portal to effortlessly launch cutting-edge Web3 experiences.',
  metadataBase: new URL(MB_URL.APP_URL),
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const header = await headers();
  const cookies = header.get('wagmi');

  return (
    <html lang='en' className='overflow-x-hidden'>
      <head>
        <meta
          name='google-site-verification'
          content='L_YAA1wl9HK-pwje3STY_KyHj7yQN1oTfq09H_r9Kqw'
        />
      </head>
      <body className={`${inter.className} dark bg-black`}>
        <Providers cookies={cookies}>
          <Header />
          {children}
          <Footer />
          <Analytics />
          <NextTopLoader color='#334155' showSpinner={false} height={4} />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
