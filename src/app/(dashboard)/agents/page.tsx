import AgentContent from '@/components/layout/AgentsContent';
import { cookies } from 'next/headers';

export default async function Agents() {
  const cookieStore = cookies();
  const walletState = cookieStore.get('wallet_state')?.value;

  if (!walletState) {
    return <div>Please connect your wallet to view agents</div>;
  }

  const state = JSON.parse(walletState);
  if (
    !state.isEvmConnected &&
    !state.isNearConnected &&
    !state.isSuiConnected
  ) {
    return <div>Please connect your wallet to view agents</div>;
  }

  return <AgentContent />;
}
