
import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { ethers } from "ethers";
import { Code } from "@nextui-org/code"
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import {Image} from "@nextui-org/react";

import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
  } from "wagmi";
  
	
//https://wagmi.sh/examples/contract-write
export default function Home() {
	const {
		config,
		error: prepareError,
		isError: isPrepareError,
	  } = usePrepareContractWrite({
		address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
		abi: [
		  {
			name: 'mint',
			type: 'function',
			stateMutability: 'nonpayable',
			inputs: [],
			outputs: [],
		  },
		],
		functionName: 'mint',
	  })
	  const { data, error, isError, write } = useContractWrite(config)
	 
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
      width={300}
      alt="joy gotchi"
      src="/gotchi/Animated/GIF_Pet2.gif"
    />
				</h1>
				<h2 className={subtitle({ class: "mt-4" })}>
				Meet your new digital friend!
				</h2>
			</div>
			<button type="button"  onClick={} className="nes-btn w-52" >
				Mint A Friend
</button>
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
