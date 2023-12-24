'use client'
import React from "react";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import {Image} from "@nextui-org/react";
import { nftAbi , tokenAbi } from '../abi';
import {
	usePrepareContractWrite,
	useContractWrite,
	useContractRead,
	useWaitForTransaction,
	useAccount,
	useConnect,
	useNetwork, 
	useSwitchNetwork
  } from "wagmi";
  
const nftAddress= process.env.NFT_ADDRESS;
const MAX_ALLOWANCE = BigInt('20000000000000000000000')
const tokenAddress = process.env.TOKEN_ADDRESS
//https://wagmi.sh/examples/contract-write
export default function Home() {
//check allowrance
const { address, connector, isConnected } = useAccount()
const { connect, connectors , pendingConnector } = useConnect()
const { data: allowance, refetch } = useContractRead({
    address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
    abi: tokenAbi,
    functionName: "allowance",
    args: [`0x${address ? address.slice(2) : ''}`, `0x${process.env.NFT_ADDRESS?.slice(2)}`],
  });

  const { config : configAllowance } = usePrepareContractWrite({
	address: `0x${process.env.TOKEN_ADDRESS?.slice(2)}`,
	abi: tokenAbi,
	functionName: "approve",
	args: [`0x${process.env.NFT_ADDRESS?.slice(2)}`, MAX_ALLOWANCE],
  });

  const {
    data: writeContractResult,
    writeAsync: approveAsync,
    error:errorAllowance,
  } = useContractWrite(configAllowance);

  

	
	const {
		config,
		error: prepareError,
		isError: isPrepareError,
	  } = usePrepareContractWrite({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: 'mint',
	  })
	  const { data, error, isError, write : mint } = useContractWrite(config)
	 
	  const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	  })
	  

	  const { chain  } = useNetwork()
	  const [isClient, setIsClient] = React.useState(true)
	  const { chains , error : errorSwitchNetwork, isLoading : loadingSwingNetwork, pendingChainId, switchNetwork } =
		useSwitchNetwork({
			onMutate(args) {
				console.log('Mutate', args)
			  },
			onSettled(data, error) {
				console.log('Settled', { data, error })
				setIsClient(true);
			},
			onSuccess(data) {
				console.log('sucess', { data })
				setIsClient(true);
			  }
		  })
		React.useEffect(() => {
			if(chain?.id == process.env.CHAIN_ID){
			setIsClient(true);
			}
		},[])
	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
 
      <div>{errorSwitchNetwork && errorSwitchNetwork.message}</div>
			<div className="inline-block max-w-lg text-center justify-center">
				<h1 className={title()}>Joy&nbsp;</h1>
				<h1 className={title({ color: "violet" })}>Gotchi&nbsp;</h1>
				<br />
				<h1 className={title()}>
				<Image
      width={250}
      alt="joy gotchi"
      src="/gotchi/Animated/GIF_Pet2.gif"
    />
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
				Meet your new digital friend!
				</h2>
			</div>

{isClient ? (
(allowance == BigInt(0)) ? (
	<button type="button"   onClick={approveAsync} className="nes-btn w-52" >
	Approval
</button>
   ):(
	 <button type="button"  disabled={!mint || isLoading} onClick={mint} className="nes-btn w-52" >
	 Mint A Fens
 </button>
	 
   )

) : (
	<>
	<button
          key={process.env.CHAIN_ID}
          onClick={() => switchNetwork?.(process.env.CHAIN_ID as unknown as number )}
		  className="nes-btn w-52"
        >
       switch to Mode Testnet 
         {loadingSwingNetwork && pendingChainId === process.env.CHAIN_ID && '(switching)'} 
        </button>
		<div><span className="text-red-400">{errorSwitchNetwork && errorSwitchNetwork.message}</span></div>
		</>
)
        
}


			
			
			
{isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a className="text-green-400" href={`${process.env.EXPLORER_URL}/tx/${data?.hash}`}>Scan Tx</a>
          </div>
        </div>
      )}
      {/* {(isPrepareError || isError) && (
        <div><span className="text-red-400">Error: {(prepareError || error)?.message}</span></div>
      )} */}
	        {(isError) && (
        <div><span className="text-red-400">Error: {error?.message}</span></div>
      )}
			<div className="flex gap-3">
		
				{/* <Link
					isExternal
					href={siteConfig.links.docs}
					className={buttonStyles({ color: "primary", radius: "full", variant: "shadow" })}
				>
					Documentation
				</Link>
				<Link
					isExternal
					className={buttonStyles({ variant: "bordered", radius: "full" })}
					href={siteConfig.links.github}
				>
					<GithubIcon size={20} />
					GitHub
				</Link> */}
			</div>

	
		</section>
	);
}
