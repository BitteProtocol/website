'use client';
import AgentCard from '@/components/ui/agents/AgentCard';
import { Button } from '@/components/ui/button';
import { useMyAssistants } from '@/hooks/useAssistants';
import { useBitteWallet } from '@bitte-ai/react';
import { useWallet } from '@suiet/wallet-kit';
import Link from 'next/link';
import { useAccount } from 'wagmi';

export default function MyAgents() {
  const { activeAccountId } = useBitteWallet();
  const { address: suiAddress } = useWallet();
  const { address: ethAddress } = useAccount();

  const { agents, loading } = useMyAssistants({
    ethAddress,
    suiAddress,
    nearAddress: activeAccountId,
  });

  if (!agents?.length && !loading) {
    return (
      <div className='flex flex-col justify-center items-center h-full gap-4'>
        <p>No agents found.</p>
        <Button asChild>
          <Link href='/build-agents'>Create Agent</Link>
        </Button>
      </div>
    );
  }

  return (
    <section
      className='w-full grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4'
      aria-label='My Agents'
    >
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </section>
  );
}
