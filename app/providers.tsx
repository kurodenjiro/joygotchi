"use client";

import * as React from "react";
import { NextUIProvider } from "@nextui-org/system";
import { useRouter } from 'next/navigation'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

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
  import {
	modeTestnet
  } from 'wagmi/chains';
  import { publicProvider } from 'wagmi/providers/public';
  
  const { chains, publicClient, webSocketPublicClient } = configureChains(
	[
	  modeTestnet,
	  ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [modeTestnet] : []),
	],
	[publicProvider()]
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
