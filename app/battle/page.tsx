"use client"
import { title } from "@/components/primitives";
import React, { useState, useEffect } from 'react';
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useAccount,
	useContractEvent
  } from "wagmi";
  import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue,Button,Spinner} from "@nextui-org/react";
  import { readContracts , watchAccount  } from '@wagmi/core'
  import {Card, CardBody , CardHeader , Divider} from "@nextui-org/react";
  import { nftAbi , tokenAbi } from '../../abi';
  import { useDebounce } from './useDebounce'
  import {Image} from "@nextui-org/react";
  const ethers = require("ethers")
  const nftAddress= `0x${process.env.NFT_ADDRESS?.slice(2)}`;
  const getEventSignature = (eventName : string, abi:any) => {
    const eventAbi = abi.find((entry:any) => entry.name === eventName);
    const types = eventAbi.inputs.map((input:any) => input.type);
    return `${eventName}(${types.join(',')})`;
}
  //https://github.com/ChangoMan/nextjs-ethereum-starter/blob/main/frontend/pages/index.tsx
export default function Battle() {
	
	const [listBattle, setListBattle] = useState<any>(null);
	const { address } = useAccount();
	const [ownPet, setOwnPet] = useState<any>(null)
	const [ownPetId, setOwnPetId] = useState<any>(null)
	const [selectedPet, setSelectedPet] = useState<any>(null)
	const [activity, setActivity] = useState<any>([])
	const [isLoading, setIsLoading] = React.useState(true);
	const colors = ["default", "primary", "secondary", "success", "warning", "danger"];
	const [selectedColor, setSelectedColor] = React.useState("default");
	const debouncedSelectedPet = useDebounce(selectedPet, 500)
	const debouncedOwnPetId = useDebounce(ownPetId, 500)
	const unwatch = watchAccount((account) => {

	})
	
	

	const { config : configAttack } = usePrepareContractWrite({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: "attack",
		args: [debouncedOwnPetId , debouncedSelectedPet],
		});
	  
		const {
		  data: attackData,
		  writeAsync: setAttackAsync,
		  error:errorAttack,
		} = useContractWrite(configAttack);
		
		const { isLoading : isLoadingAttack} = useWaitForTransaction({
			hash: attackData?.hash,
			onSuccess(data) {
			  console.log('success data', data)
			  const InputDataDecoder = require('ethereum-input-data-decoder');
			  const decoder = new InputDataDecoder(nftAbi);
			  const data1 = decoder.decodeData(data.logs[0].data);
			  console.log("decode",data1);
			  const list = activity;
			  list.push(` You Attacked #${selectedPet} `)
			  setActivity(list)

			  fetchMyAPI()
			}
		  })
const onAttack = ( petId : any )=> {
	console.log("pet",debouncedOwnPetId)
      setSelectedPet(petId);
	  setAttackAsync?.();
    };

//kill
	
	const { config : configKill } = usePrepareContractWrite({
		address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
		abi: nftAbi,
		functionName: "kill",
		args: [debouncedSelectedPet,debouncedOwnPetId],
		});
	  
		const {
		  data: killData,
		  writeAsync: setKillAsync,
		  error:errorKill,
		} = useContractWrite(configKill);


		const { isLoading : isLoadingKill} = useWaitForTransaction({
			hash: killData?.hash,
			onSuccess(data) {
			  console.log('success data', data)
			  const list = activity;
			  list.push(` You Killed #${selectedPet} `)
			  setActivity(list)
			  fetchMyAPI();
			},
		  })
const onKill = async( petId : any )=> {
	console.log("kill",petId)
      await setSelectedPet(petId);
	  await setKillAsync?.();
    };

	const trackLogs = async()=>{
		const provider = new ethers.providers.JsonRpcProvider('https://rpc-testnet.viction.xyz')
		const eventSignature = getEventSignature('Attack', nftAbi)
		console.log('-------------')
		console.log(eventSignature)
		console.log('-------------')
		
		const filter = {
			address: nftAddress,
			topics: [
				ethers.utils.id(eventSignature),
	
			]
		};
		const result = await provider.getLogs(filter)
		const contractInterface = new ethers.utils.Interface(nftAbi);

    result.forEach((log:any, idx:any) => {
        const decodedLog = contractInterface.decodeEventLog('Attack', log.data, log.topics);
        console.log('logs:', decodedLog)
    });
	}
const fetchMyAPI = async()=>{
	let response : any= await fetch(`${process.env.EXPLORER_URL}/api/nft/inventory?tokenAddress=${process.env.NFT_ADDRESS}`)
	response = await response.json()
	let petArr : any = [];
	let petArrOwned : any = [];
	if(response.data){
	  for (const element of response.data) {
		const Info : any = await readContracts({
		  contracts: [
			{
			  address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
			  abi: nftAbi,
			  functionName: 'getPetInfo',
			  args: [element.tokenId],
			}
		  ],
		})
		if(element.address !== address && element.address !== '0x0000000000000000000000000000000000000000'){
		  Info[0].result.push(element.tokenId);
		  petArr.push(Info[0].result)
		}
		if(element.address == address){
			petArrOwned.push({
			  value:element.tokenId,
			  label:Info[0].result[0]
			})
		  }
	  }
	}
	console.log("petArr",petArr);
	setIsLoading(false)
	setListBattle(petArr)
	
	const pet = localStorage.getItem('pet');
	console.log("pet",pet)
	if (pet) {
		const Info : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [BigInt(pet)],
			  }
			],
		  })
		  
		  Info[0].result.push(BigInt(pet));
		  
		  setOwnPetId(pet);
		  console.log("ownedpet",Info[0].result)
		  setOwnPet(Info[0].result);
  }else{
	if(petArrOwned[0]){
		localStorage.setItem('pet',petArrOwned[0].value);
		setOwnPetId(petArrOwned[0].value);
		const Info : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [BigInt(petArrOwned[0].value)],
			  }
			],
		  })
		  setOwnPet(Info[0].result);
	}

  }
} 
useContractEvent({
	address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	abi: nftAbi,
	eventName:"Attack",
	listener(logs) {
		console.log("logs",logs);
		async function getlogs() {
			if(logs[0]){
				const petAttacked : any = await readContracts({
					contracts: [
					  {
						address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
						abi: nftAbi,
						functionName: 'getPetInfo',
						args: [selectedPet as bigint],
					  }
					],
				  })
	
				const list = activity;
				//list.push(` Your Pet attacked ${JSON.stringify(petAttacked)} and ${ownPetId == logs[0].args.winner ? "won" : "lost"} ${logs[0].args.scoresWon} points`)
				setActivity(list)
				fetchMyAPI();
			}
		  }
		  getlogs();
	  }
  })
 
  useContractEvent({
	address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	abi: nftAbi,
	eventName: 'PetKilled',
	listener: (logs) => {
		console.log("logs",logs);
		async function getlogs() {
			if(logs[0]){
				const petDeaded : any = await readContracts({
					contracts: [
					  {
						address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
						abi: nftAbi,
						functionName: 'getPetInfo',
						args: [logs[0].args.deadId as bigint],
					  }
					],
				  })
	
				const list = activity;
				list.push(` You killed ${JSON.stringify(petDeaded)} `)
				fetchMyAPI();
				setActivity(list)
				
			}
		  }
		  getlogs();
	  }
  })

	useEffect(() => {
		fetchMyAPI()
		trackLogs();
	  }, [])
	return (
		<>
		<div>
<Table isStriped
color={selectedColor}
        selectionMode="single"  aria-label="Example static collection table h-44" classNames={{
        base: "max-h-[520px] pt-3",
        table: "min-h-[420px] pt-3",
      }}>
      <TableHeader>
        <TableColumn>Info</TableColumn>
        <TableColumn>Score</TableColumn>
        <TableColumn>Battle</TableColumn>
      </TableHeader>
      <TableBody isLoading={isLoading} loadingContent={<Spinner label="Loading..." />} >
	  {listBattle && listBattle.map((pet:any,index:number) => (
       <TableRow key={index} >
	   <TableCell > 
		 <User
		 avatarProps={{radius: "lg", className:"p-1" ,src: "/gotchi/Animated/GIF_Pet.gif"}}
		 description={'lv:'+pet[3]}
		 name={pet[0] +"#"+pet[9] || "Unknow" +"#"+pet[9]}
		 
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
		 ownPet &&	ownPet[3] <  pet[3]  && pet[1] !== 4 && ownPet[1] !== 4 &&  ownPet[6] == BigInt("0") && (pet[5] == BigInt("0")  ||  Math.floor((( Math.abs(Number(new Date( Number(pet[5]) )) * 1000  - Date.now())) /1000)/60)/60 > 1)    && (
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
		  pet[1] == 4  &&(
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
		<br/>
		<Card >
		<CardHeader className="flex gap-3">
			<div className="flex flex-col">
			  <p className="text-md">Activity</p>
			  <p className="text-small text-default-500">list</p>
			</div>
		  </CardHeader>
		  <Divider/>
	  <CardBody>
		{activity.length > 0 && activity.map((item:string,index:number) => (
			<p  key={index}>{item}</p> 
		) )}
		{activity.length == 0 && (<p>No activity</p>)}
			
	  </CardBody>
	</Card>
	<br/>
	<br/>
	<br/>
	</>
		)
}
