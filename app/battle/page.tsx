"use client"
import { title } from "@/components/primitives";
import React from "react";
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
  import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue,Button} from "@nextui-org/react";
  import { readContracts , writeContract } from '@wagmi/core'
  import { nftAbi , tokenAbi } from '../../abi';
  import { useDebounce } from './useDebounce'

  import {Image} from "@nextui-org/react";
  const nftAddress= '0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241';
  const MAX_ALLOWANCE = BigInt('20000000000000000000000')
  const tokenAddress = '0xf28194a06800FEf63C312E5D41967Ca85A5De121'
  
  //https://github.com/ChangoMan/nextjs-ethereum-starter/blob/main/frontend/pages/index.tsx
export default function battle() {

	const [listBattle, setListBattle] = React.useState<any>(null);
	const { address, connector, isConnected } = useAccount();
	const [ownPet, setOwnPet] = React.useState<any>(null)
	const [selectedPet, setSelectedPet] = React.useState<any>(null)
	const debouncedSelectedPet = useDebounce(selectedPet, 500)
	const debouncedOwnPet = useDebounce(ownPet, 500)
	const { config : configAttack } = usePrepareContractWrite({
		address: nftAddress,
		abi: nftAbi,
		functionName: "attack",
		args: [debouncedOwnPet ? ownPet[9] : "0", debouncedSelectedPet],
		});
	  
		const {
		  data: attackData,
		  writeAsync: setAttackAsync,
		  error:errorAttack,
		} = useContractWrite(configAttack);

const onAttack = ( petId : any )=> {
      setSelectedPet(parseInt(petId));
	  setAttackAsync?.();
    };

//kill
	
	const { config : configKill } = usePrepareContractWrite({
		address: nftAddress,
		abi: nftAbi,
		functionName: "attack",
		args: [ownPet ? ownPet[9] : "0", debouncedSelectedPet],
		});
	  
		const {
		  data: killData,
		  writeAsync: setKillAsync,
		  error:errorKill,
		} = useContractWrite(configKill);

const onKill = ( petId : any )=> {
      setSelectedPet(parseInt(petId));
	  setKillAsync?.();
    };


	React.useEffect(() => {
		async function fetchMyAPI() {
		  let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241/instances')
		  response = await response.json()
		  let petArr : any = [];
		  if(response.items){
			for (const element of response.items) {
			  const Info : any = await readContracts({
				contracts: [
				  {
					address: nftAddress,
					abi: nftAbi,
					functionName: 'getPetInfo',
					args: [element.id],
				  }
				],
			  })
			  if(element.owner.hash !== address){
				Info[0].result.push(element.id);
				petArr.push(Info[0].result)
			  }
			}
		  }
		  setListBattle(petArr)
		  
		  const pet = localStorage.getItem('pet');
		  if (pet) {
			  const Info : any = await readContracts({
				  contracts: [
					{
					  address: nftAddress,
					  abi: nftAbi,
					  functionName: 'getPetInfo',
					  args: [BigInt(pet)],
					}
				  ],
				})
				console.log("pet",Info[0].result)
				Info[0].result.push(BigInt(pet));
				setOwnPet(Info[0].result);
		}
	
		}
		fetchMyAPI()
		console.log('a');
	  }, [])
	return (
		<div>
<Table aria-label="Example static collection table " className="pt-3">
      <TableHeader>
        <TableColumn>Info</TableColumn>
        <TableColumn>Score</TableColumn>
        <TableColumn>Battle</TableColumn>
      </TableHeader>
      <TableBody>
	  {listBattle && listBattle.map((pet:any,index:number) => (
       <TableRow key={index} >
	   <TableCell > 
		 <User
		 avatarProps={{radius: "lg", className:"p-1" ,src: "/gotchi/Animated/GIF_Pet.gif"}}
		 description={'lv:'+pet[3]}
		 name={pet[0] || "Unknow" +"#"+pet[9]}
		 
	   >
	   </User></TableCell>
	   <TableCell > 
	   {/* enum Status {
        HAPPY = 0,
        HUNGRY = 1,
        STARVING = 2,
        DYING = 3,
        DEAD = 4


    } */}
		
		 <div className="flex flex-col">
		 <p className="text-bold text-sm capitalize">{pet[2].toString()}</p>
		 <p className="text-bold text-sm capitalize text-default-400">Pts.</p>
	   </div></TableCell>
	   <TableCell>
		{
		 ownPet &&	ownPet[3] <  pet[3]  && ownPet[3] !== 4 && pet[3] !==4 && (
<Button isIconOnly size="sm" className="p-2" color="default" aria-label="Like" onPress={()=>onAttack(pet[9])}>
	   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
				 <g>
					 <path fill="none" d="M0 0h24v24H0z"/>
					 <path fill-rule="nonzero" d="M17.457 3L21 3.003l.002 3.523-5.467 5.466 2.828 2.829 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415-2.829-2.828-2.828 2.828 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 2.827-2.828-5.46-5.46L3 3l3.546.003 5.453 5.454L17.457 3zm-7.58 10.406L7.05 16.234l.708.707 2.827-2.828-.707-.707zm9.124-8.405h-.717l-4.87 4.869.706.707 4.881-4.879v-.697zm-14 0v.7l11.241 11.241.707-.707L5.716 5.002l-.715-.001z"/>
				 </g>
			 </svg>
   </Button>
			)
		}
		{
		  pet[3] == 4 && (
<Button isIconOnly size="sm" className="p-2" color="default" aria-label="Like" onPress={()=>onKill(pet[9])}>
<Image
    radius={"none"}
    width={40}
src="/gotchi/Icon/skull2.png"
/>
   </Button>
			)
		}
	    </TableCell>
	 </TableRow>
      ))}
       
      </TableBody>
    </Table>
		</div>
		)
}
