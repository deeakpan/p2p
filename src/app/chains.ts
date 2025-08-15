import { http } from 'wagmi';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import type { Chain } from 'wagmi/chains';

export const pepuTestnet: Chain = {
  id: 97740,
  name: 'Pepe Unchained V2 Testnet',
  nativeCurrency: {
    name: 'PEPU',
    symbol: 'PEPU',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc-pepu-v2-testnet-vn4qxxp9og.t.conduit.xyz'] },
    public: { http: ['https://rpc-pepu-v2-testnet-vn4qxxp9og.t.conduit.xyz'] },
  },
  blockExplorers: {
    default: { 
      name: 'PEPU Explorer', 
      url: 'https://explorer-pepu-v2-testnet-vn4qxxp9og.t.conduit.xyz'
    },
  },
  testnet: true,
};

export const config = getDefaultConfig({
  appName: 'Peer2Pepu',
  projectId: 'test123', // Temporary for testing
  chains: [pepuTestnet],
  ssr: true,
  transports: {
    [pepuTestnet.id]: http(),
  },
});
