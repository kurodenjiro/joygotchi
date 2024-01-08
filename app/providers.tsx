"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";


import { Chain } from '@wagmi/core'
 
export const vicTestnet = {
  id: 89,
  name: 'Vic',
  network: 'viction',
  nativeCurrency: {
    decimals: 18,
	
    name: 'tomo',
    symbol: 'TOMO',
  },
  rpcUrls: {
    public: { http: ['https://rpc-testnet.viction.xyz'] },
    default: { http: ['https://rpc-testnet.viction.xyz'] },
  },
  blockExplorers: {
    etherscan: { name: 'Vicscan', url: 'https://testnet.vicscan.xyz/' },
    default: { name: 'Vicscan', url: 'https://testnet.vicscan.xyz/' },
  },
} as const satisfies Chain

import {
	RainbowKitProvider,
	getDefaultWallets,
	connectorsForWallets,
  } from '@rainbow-me/rainbowkit';
  import {
	argentWallet,
	trustWallet,
	ledgerWallet,
  } from '@rainbow-me/rainbowkit/wallets';
  import { configureChains, createConfig, WagmiConfig } from 'wagmi';
  
  import { publicProvider  } from 'wagmi/providers/public';
  import { alchemyProvider } from 'wagmi/providers/alchemy';
  
  const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
		vicTestnet,
	  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [vicTestnet] : []),
	],
	[
		publicProvider(),
		alchemyProvider({ apiKey: "Df6rvkniZ98Rh9Dvhn-88PEfJkE9_Tgg" })
	]
  );
  
  const projectId = 'ea8370ab6881883427566262faaf8556';
  
  const { wallets } = getDefaultWallets({
	appName: 'JoyGotchi',
	projectId,
	chains,
  });
  
  const demoAppInfo = {
	appName: 'JoyGotchi',
  };
  
  const connectors = connectorsForWallets([
	...wallets,
	{
	  groupName: 'Other',
	  wallets: [
		argentWallet({ projectId, chains }),
		trustWallet({ projectId, chains }),
		ledgerWallet({ projectId, chains }),
	  ],
	},
  ]);
  
  const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
	webSocketPublicClient,
  });

export interface ProvidersProps {
	children: React.ReactNode;
	themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

	return (
		<WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} appInfo={demoAppInfo}>
	  <NextUIProvider navigate={router.push}>
			<NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
		</NextUIProvider>
		</RainbowKitProvider>
	  </WagmiConfig>
	 
	
	);
}
