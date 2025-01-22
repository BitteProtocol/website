import { Button } from '@/components/ui/button';
import * as React from 'react';
import { Connector, useChainId, useConnect } from 'wagmi';

export function EvmWalletOptions() {
  const chainId = useChainId();
  const { connectors, connect } = useConnect();

  return connectors.map((connector) => (
    <ConnectorButton
      key={connector.uid}
      connector={connector}
      onClick={() => connect({ connector, chainId })}
    />
  ));
}

function ConnectorButton({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector, setReady]);

  return (
    <Button variant='outline' disabled={!ready} onClick={onClick}>
      {connector.name}
    </Button>
  );
}
