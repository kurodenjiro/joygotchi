'use client'
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { ethers } from "ethers";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
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
  } from "wagmi";
  
const ADDRESS= '0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241';
const MAX_ALLOWANCE = BigInt('20000000000000000000000')
const tokenAddress = '0xf28194a06800FEf63C312E5D41967Ca85A5De121'
//https://wagmi.sh/examples/contract-write
export default function Home() {
//check allowrance
const { address, connector, isConnected } = useAccount()
const { connect, connectors , pendingConnector } =
useConnect()

const { data: allowance, refetch } = useContractRead({
    address: tokenAddress,
    abi: tokenAbi,
    functionName: "allowance",
    args: [address, ADDRESS],
  });

  console.log(allowance);
  const { config : configAllowance } = usePrepareContractWrite({
	address: tokenAddress,
	abi: tokenAbi,
	functionName: "approve",
	args: [ADDRESS, MAX_ALLOWANCE],
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
		address: '0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241',
		abi: nftAbi,
		functionName: 'mint',
	  })
	  const { data, error, isError, write : mint } = useContractWrite(config)
	 
	  const { isLoading, isSuccess } = useWaitForTransaction({
		hash: data?.hash,
	  })
	  



	return (
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			
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
			{(allowance == 0) ? (
       <button type="button"   onClick={approveAsync} className="nes-btn w-52" >
	   Approval
   </button>
      ):(
		<button type="button"  disabled={!mint || isLoading} onClick={mint} className="nes-btn w-52" >
		Mint A Friend
	</button>
		
	  )}
			
			
{isSuccess && (
        <div>
          Successfully minted your NFT!
          <div>
            <a className="text-green-400" href={`https://sepolia.explorer.mode.network/tx/${data?.hash}`}>Scan Tx</a>
          </div>
        </div>
      )}
      {(isPrepareError || isError) && (
        <div><span className="text-red-400">Error: {(prepareError || error)?.message}</span></div>
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
