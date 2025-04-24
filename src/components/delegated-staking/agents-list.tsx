'use client';

import { useBitteTokenBalances } from '@/hooks/useBitteTokenBalances';
import { DelegatedAgent, useDelegatedAgents } from '@/hooks/useDelegatedAgents';
import { formatTokenBalance } from '@/lib/utils/delegatedagents';
import { AlertCircle, ArrowRight, CheckCircle, InfoIcon } from 'lucide-react';
import { useState } from 'react';
import { parseAbi, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
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

// Define the contract address
const STAKING_CONTRACT_ADDRESS = '0xc5020CC858dB41a77887dE1004E6A2C166c09175';

// Define the ABI for just the stake function
const stakingAbi = parseAbi([
  'function stake(address agent, uint256 amount) external returns (uint256)',
]);

const AgentsList = ({ address }: { address: `0x${string}` }) => {
  const [selectedAgent, setSelectedAgent] = useState<DelegatedAgent | null>(
    null
  );
  const [stakeAmount, setStakeAmount] = useState('');
  const [open, setOpen] = useState(false);

  const {
    writeContract,
    isPending: isStaking,
    data: txHash,
  } = useWriteContract();
  const {
    isLoading: isConfirming,
    isSuccess: isStakeConfirmed,
    data: txReceipt,
  } = useWaitForTransactionReceipt({ hash: txHash });

  const { balances } = useBitteTokenBalances(sepolia, address);
  const { agents, loading, error } = useDelegatedAgents();

  const handleStake = async () => {
    if (!selectedAgent || !stakeAmount || stakeAmount === '0') {
      // Show error message - can't stake with no amount or agent
      return;
    }

    try {
      // Parse the amount with 18 decimals (assuming your token has 18 decimals)
      const parsedAmount = parseUnits(stakeAmount, 18);

      // Call the contract
      writeContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'stake',
        args: [selectedAgent.id as `0x${string}`, parsedAmount],
      });

      // The UI will be updated automatically based on the isPending, isConfirming states
      // After transaction is confirmed:
      if (isStakeConfirmed) {
        setOpen(false);
        setStakeAmount('');
        // Maybe show a success message or refresh balances
      }
    } catch (error) {
      console.error('Error staking tokens:', error);
      // Handle error (show toast message, etc.)
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
        {agents?.map((agent) => (
          <TableRow key={agent.id}>
            <TableCell>
              {agent.id}{' '}
              <p className='text-sm text-muted-foreground'>
                Active: {agent.isActive ? 'Yes' : 'No'}
              </p>
            </TableCell>
            <TableCell>
              {formatTokenBalance(BigInt(agent.totalDelegated), 18, 'dBITTE')}
            </TableCell>
            <TableCell>
              <div className='flex items-center gap-2'>
                {formatTokenBalance(BigInt(agent.totalStaked), 18, 'sBITTE')}
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon className='h-3.5 w-3.5 text-muted-foreground cursor-help' />
                    </TooltipTrigger>
                    <TooltipContent
                      side='top'
                      align='start'
                      className='max-w-xs'
                    >
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
                                {formatTokenBalance(
                                  BigInt(delegate.amount),
                                  18,
                                  'sBITTE'
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
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
                        Available: {balances?.bitte.balance}
                      </p>
                    </div>
                  </div>

                  {isStakeConfirmed && (
                    <div
                      className={`p-3 rounded-md ${
                        isStaking
                          ? 'bg-blue-50 text-blue-700'
                          : isStakeConfirmed
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <div className='flex items-center'>
                        {isStakeConfirmed ? (
                          <CheckCircle className='h-5 w-5 mr-2 flex-shrink-0' />
                        ) : (
                          <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0' />
                        )}
                        <p className='text-sm font-medium'>
                          {txReceipt?.transactionHash}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className='flex gap-4 justify-end items-center'>
                    <Button variant='outline' onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleStake}
                      disabled={isStaking || isConfirming || isStakeConfirmed}
                      className={isStaking || isConfirming ? 'opacity-80' : ''}
                    >
                      {isStaking || isConfirming ? (
                        <>
                          <span className='mr-2'>Staking</span>
                          <div className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
                        </>
                      ) : (
                        'Stake'
                      )}
                    </Button>{' '}
                  </div>
                </DialogContent>
              </Dialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default AgentsList;
