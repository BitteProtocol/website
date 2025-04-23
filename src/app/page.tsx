import AgentContent from '@/components/layout/AgentsContent';
import { HomeComponent } from '@/components/layout/Home';
import NewHero from '@/components/layout/NewHero';
import { cookies } from 'next/headers';
import RootSidebar from '@/components/root-sidebar';

export default async function Home() {
  const cookieStore = cookies();
  const walletState = cookieStore.get('wallet_state')?.value;
  const decodedState = walletState ? decodeURIComponent(walletState) : null;
  const parsedState = decodedState ? JSON.parse(decodedState) : null;
  const isConnected =
    parsedState?.isEvmConnected ||
    parsedState?.isNearConnected ||
    parsedState?.isSuiConnected;

  if (isConnected) {
    return (
      <RootSidebar>
        <AgentContent />
      </RootSidebar>
    );
  }

  return (
    <main className='flex flex-col items-center justify-between'>
      <NewHero />
      <HomeComponent initialWalletState={parsedState} />
    </main>
  );
}
