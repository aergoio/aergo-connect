const tuple = <T extends string[]>(...args: T) => args;

export interface ChainConfig {
  chainId: string;
  nodeUrl: string;
}

export const ChainConfigs: ChainConfig[] = [
  {
    chainId: 'testnet.aergo.io',
    nodeUrl: 'https://testnet-api-http.aergo.io',
  },
  {
    chainId: 'main.aergo.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  {
    chainId: 'aergo.io',
    nodeUrl: 'https://mainnet-api-http.aergo.io',
  },
  {
    chainId: 'sqltestnet.aergo.io',
    nodeUrl: 'https://sqltestnet-api-http.aergo.io',
  },
  {
    chainId: 'dev.chain',
    nodeUrl: 'http://127.0.0.1:7845',
  },
];

export const PublicChainIds = tuple('aergo.io', 'testnet.aergo.io');
type PublicChainId = typeof PublicChainIds[number];

export function isPublicChainId(chainId: string): chainId is PublicChainId {
  return PublicChainIds.indexOf(chainId as any) !== -1;
}

export const PublicChainData: Record<PublicChainId, { label: string; apiUrl: string; explorerUrl: string }> = {
  'aergo.io': {
    label: 'Mainnet',
    apiUrl: 'https://api.aergoscan.io/main',
    explorerUrl: 'https://mainnet.aergoscan.io',
  },
  'testnet.aergo.io': {
    label: 'Testnet',
    apiUrl: 'https://api.aergoscan.io/testnet',
    explorerUrl: 'https://testnet.aergoscan.io',
  },
};

export default {
  ChainConfigs,
  PublicChainIds,
  PublicChainData,
};
