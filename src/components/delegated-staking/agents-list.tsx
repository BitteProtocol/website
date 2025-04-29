'use client';

import { useBitteTokenBalances } from '@/hooks/useBitteTokenBalances';
import { DelegatedAgent, useDelegatedAgents } from '@/hooks/useDelegatedAgents';
import { BITTE_TOKEN_ADDRESS } from '@/lib/balances/bitteTokens';
import { formatTokenBalance } from '@/lib/utils/delegatedagents';
import { ArrowRight, InfoIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { parseAbi, parseUnits } from 'viem';
import { sepolia } from 'viem/chains';
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
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

const tokenAbi = parseAbi([
  'function approve(address spender, uint256 amount) returns (bool)',
]);

// Define the ABI for just the stake function
const stakingAbi = parseAbi([
  'function stake(address agent, uint256 amount) external returns (uint256)',
]);

const AgentsList = ({ address }: { address: `0x${string}` }) => {
  const { balances } = useBitteTokenBalances(sepolia, address);
  const { agents, loading, error } = useDelegatedAgents();

  // Component state
  const [selectedAgent, setSelectedAgent] = useState<DelegatedAgent | null>(
    null
  );
  const [stakeAmount, setStakeAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [txStatus, setTxStatus] = useState<
    'idle' | 'checking' | 'approving' | 'staking' | 'success' | 'error'
  >('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [approvalTxHash, setApprovalTxHash] = useState<
    `0x${string}` | undefined
  >();

  // Contract interaction hooks
  const {
    data: writeData,
    isPending: isWritePending,
    writeContract,
  } = useWriteContract();
  const {
    data: txReceipt,
    isLoading: isConfirming,
    isSuccess: isTxSuccess,
  } = useWaitForTransactionReceipt({ hash: writeData });

  // Check approval status on open
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: BITTE_TOKEN_ADDRESS,
    abi: tokenAbi,
    functionName: 'allowance',
    args: address && [address, STAKING_CONTRACT_ADDRESS],
    query: { enabled: !!address && open },
  });

  // Handle transaction status changes
  useEffect(() => {
    if (!isWritePending && !isConfirming && isTxSuccess) {
      if (txStatus === 'approving') {
        setTxStatus('staking');
        setStatusMessage('Approval successful! Now staking tokens...');
        setApprovalTxHash(writeData);

        // Small delay to ensure the approval transaction is fully processed
        setTimeout(() => {
          handleStakingStep();
        }, 2000);
      } else if (txStatus === 'staking') {
        setTxStatus('success');
        setStatusMessage('Staking successful! Transaction confirmed.');

        // Close dialog after success
        setTimeout(() => {
          setOpen(false);
          setStakeAmount('');
          setTxStatus('idle');
        }, 3000);
      }
    }
  }, [isWritePending, isConfirming, isTxSuccess, txStatus]);

  // Main staking function
  const handleStake = async () => {
    if (!selectedAgent || !stakeAmount || parseFloat(stakeAmount) <= 0) {
      setStatusMessage('Please select an agent and enter a valid amount');
      return;
    }

    if (!address) {
      setStatusMessage('Please connect your wallet');
      return;
    }

    try {
      setTxStatus('checking');
      setStatusMessage('Checking allowance and balance...');

      // Parse the amount with 18 decimals
      const parsedAmount = parseUnits(stakeAmount, 18);

      // Refresh allowance data
      await refetchAllowance();

      // Check if we have enough allowance
      if (!allowanceData || allowanceData < parsedAmount) {
        // Need to approve first
        setTxStatus('approving');
        setStatusMessage('Approving tokens for staking...');

        writeContract({
          address: BITTE_TOKEN_ADDRESS,
          abi: tokenAbi,
          functionName: 'approve',
          args: [STAKING_CONTRACT_ADDRESS, parsedAmount],
        });
      } else {
        // Already approved, go straight to staking
        setTxStatus('staking');
        setStatusMessage('Tokens already approved. Staking now...');
        handleStakingStep();
      }
    } catch (error) {
      console.error('Error initiating stake:', error);
      setTxStatus('error');
      setStatusMessage(
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  // Separate function for the staking step
  const handleStakingStep = () => {
    try {
      if (!selectedAgent || !stakeAmount) return;

      const parsedAmount = parseUnits(stakeAmount, 18);

      writeContract({
        address: STAKING_CONTRACT_ADDRESS,
        abi: stakingAbi,
        functionName: 'stake',
        args: [selectedAgent.id as `0x${string}`, parsedAmount],
        // Using lower-level configuration
        gas: 500000n, // Higher gas limit to prevent out-of-gas errors
      });
    } catch (error) {
      console.error('Error during staking step:', error);
      setTxStatus('error');
      setStatusMessage(
        `Staking failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  // Reset function for error states
  const resetStakingProcess = () => {
    setTxStatus('idle');
    setStatusMessage('');
    setApprovalTxHash(undefined);
  };

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div>Error: {error}</div>;

  // JSX for dialog buttons
  const renderDialogActions = () => {
    switch (txStatus) {
      case 'idle':
      case 'checking':
        return (
          <>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleStake}
              disabled={
                !selectedAgent || !stakeAmount || txStatus === 'checking'
              }
            >
              {txStatus === 'checking' ? 'Checking...' : 'Stake'}
            </Button>
          </>
        );
      case 'approving':
      case 'staking':
        return (
          <Button disabled className='w-full'>
            <span className='mr-2'>
              {txStatus === 'approving' ? 'Approving...' : 'Staking...'}
            </span>
            <div className='h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin' />
          </Button>
        );
      case 'success':
        return (
          <div>
            <p>Stake successful! Tx Hash: {txReceipt?.transactionHash}</p>

            <Button
              variant='outline'
              className='w-full'
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        );
      case 'error':
        return (
          <>
            <Button variant='outline' onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={resetStakingProcess}>
              Try Again
            </Button>
          </>
        );
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Agent</TableHead>
          <TableHead>
            <div className='flex items-center'>Total Delegated</div>
          </TableHead>
          <TableHead>Total Staked</TableHead>
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

                  {/* Status message */}
                  {txStatus !== 'idle' && (
                    <div
                      className={`p-3 rounded-md ${
                        txStatus === 'success'
                          ? 'bg-green-50 text-green-700'
                          : txStatus === 'error'
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      <p>{statusMessage}</p>
                      {approvalTxHash &&
                        txStatus !== 'success' &&
                        txStatus !== 'error' && (
                          <a
                            href={`https://sepolia.etherscan.io/tx/${approvalTxHash}`}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm underline'
                          >
                            View approval transaction
                          </a>
                        )}
                      {writeData && txStatus === 'staking' && (
                        <a
                          href={`https://sepolia.etherscan.io/tx/${writeData}`}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='text-sm underline'
                        >
                          View staking transaction
                        </a>
                      )}
                    </div>
                  )}
                  {/* Dialog actions */}
                  <div className='flex justify-end gap-4 mt-4'>
                    {renderDialogActions()}
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
