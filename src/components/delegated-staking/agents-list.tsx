'use client';

import { useEffect } from 'react';

import { useBitteTokenBalances } from '@/hooks/useBitteTokenBalances';
import { graphQLClient } from '@/lib/graphql/client';
import { GET_AGENTS_BY_STAKE } from '@/lib/graphql/queries';
import { ArrowRight, InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

// ... keep the rest of the imports

interface Agent {
  id: string;
  isActive: boolean;
  totalStaked: string;
  totalDelegated: string;
  delegates: [
    {
      id: string;
      staker: {
        id: string;
      };
      amount: string;
      initialAmount: string;
    },
  ];
}

interface AgentsResponse {
  registeredAgents: Agent[];
}

export function AgentsList({ address }: { address?: string }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [open, setOpen] = useState(false);

  const { bitte, dBitte, sBitte } = useBitteTokenBalances(address);

  console.log({ bitte, dBitte, sBitte });

  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await graphQLClient.request<AgentsResponse>(
          GET_AGENTS_BY_STAKE,
          {
            first: 10,
            skip: 0,
          }
        );

        setAgents(data.registeredAgents);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching agents:', err);
        setError('Failed to load agents data');
        setLoading(false);
      }
    }

    fetchAgents();
  }, []);

  const handleStake = () => {
    if (selectedAgent) {
      //    onStake(selectedAgent.id, stakeAmount)
      setOpen(false);
      setStakeAmount('');
    }
  };

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>
            <div className='flex items-center'>Delegated</div>
          </TableHead>
          <TableHead>Staked</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agents.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>
              {agent.id}{' '}
              <p className='text-sm text-muted-foreground'>
                Active: {agent.isActive ? 'Yes' : 'No'}
              </p>
            </TableCell>
            <TableCell>{agent.totalDelegated}</TableCell>
            <TableCell>
              {agent.totalStaked}{' '}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
                  </TooltipTrigger>
                  <TooltipContent side='top' align='start' className='max-w-xs'>
                    <div className='space-y-2'>
                      <h4 className='font-medium'>Staked Accounts</h4>
                      <div className='max-h-[200px] overflow-y-auto'>
                        {agent.delegates.map((delegate, index) => (
                          <div
                            key={index}
                            className='flex justify-between text-xs py-1 border-b border-border last:border-0'
                          >
                            <span className='text-muted-foreground mr-4 w-[100px] truncate'>
                              {delegate.staker.id}
                            </span>
                            <span className='font-medium'>
                              {delegate.amount}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </TableCell>
            <TableCell className='text-right'>
              <Dialog
                open={open && selectedAgent?.id === agent.id}
                onOpenChange={(newOpen) => {
                  setOpen(newOpen);
                  if (!newOpen) setSelectedAgent(null);
                }}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setSelectedAgent(agent)}
                  >
                    Stake
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Stake in {agent.id}</DialogTitle>
                    <DialogDescription>
                      Enter the amount of $BITTE tokens you want to stake.
                    </DialogDescription>
                  </DialogHeader>
                  <div className='grid gap-4 py-4'>
                    <div className='grid gap-2'>
                      <Label htmlFor='amount'>Amount</Label>
                      <Input
                        id='amount'
                        type='number'
                        placeholder='Enter amount'
                        value={stakeAmount}
                        onChange={(e) => setStakeAmount(e.target.value)}
                      />
                      <p className='text-xs text-muted-foreground'>
                        Available: {bitte.balance.toLocaleString()} $BITTE
                      </p>
                    </div>
                  </div>
                  <div className='flex gap-4 justify-end items-center'>
                    <Button variant='outline' onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleStake}>Stake Tokens</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
