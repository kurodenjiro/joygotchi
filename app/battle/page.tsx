"use client"
import { title } from "@/components/primitives";
import React, { useState, useEffect } from 'react';
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useAccount,
  } from "wagmi";
  import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue,Button} from "@nextui-org/react";
  import { readContracts , watchAccount  } from '@wagmi/core'
  import {Card, CardBody , CardHeader , Divider} from "@nextui-org/react";
  import { nftAbi , tokenAbi } from '../../abi';
  import { useDebounce } from './useDebounce'
  import {Image} from "@nextui-org/react";
  const nftAddress= '0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE';
  const tokenAddress = '0x110Ac22029AbAf5e15418B95619508cAE6f1a8Ec'
  //https://github.com/ChangoMan/nextjs-ethereum-starter/blob/main/frontend/pages/index.tsx
export default function Battle() {

	const [listBattle, setListBattle] = useState<any>(null);
	const { address } = useAccount();
	const [ownPet, setOwnPet] = useState<any>(null)
	const [ownPetId, setOwnPetId] = useState<any>(null)
	const [selectedPet, setSelectedPet] = useState<any>(null)
	const [activity, setActivity] = useState<any>([])
	const debouncedSelectedPet = useDebounce(selectedPet, 500)
	const debouncedOwnPetId = useDebounce(ownPetId, 500)
	const unwatch = watchAccount((account) => {
		async function fetchMyAPI() {
	
		//   let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE/instances')
		//   response = await response.json()

		//   setOwnPet(response.items[0].id)
		//   const list = activity;
		//   list.push(`You have changned Pet #${response.items[0].id} `)
		//   setActivity(list)
	   
		}
		fetchMyAPI()
	})
	
	const { config : configAttack } = usePrepareContractWrite({
		address: nftAddress,
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
			  const list = activity;
			  list.push(`You Pet #${debouncedOwnPetId} attacked #${debouncedSelectedPet}`)
			  setActivity(list)
			  async function fetchMyAPI() {
				let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE/instances')
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
					  Info[0].result.push(BigInt(pet));
					  setOwnPetId(pet);
					  setOwnPet(Info[0].result);
			  }
		  
			  }
			  fetchMyAPI()
			},
		  })
const onAttack = ( petId : any )=> {
	console.log('attack',petId)
      setSelectedPet(petId);
	  setAttackAsync?.();
    };

//kill
	
	const { config : configKill } = usePrepareContractWrite({
		address: nftAddress,
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
			  list.push(`You Pet ${debouncedOwnPetId} killed ${debouncedSelectedPet}`)
			  async function fetchMyAPI() {
				let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE/instances')
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
					  Info[0].result.push(BigInt(pet));
					  setOwnPetId(pet);
					  setOwnPet(Info[0].result);
			  }
		  
			  }
			  fetchMyAPI()
			  setActivity(list)
			},
		  })
const onKill = ( petId : any )=> {
	console.log("kill",petId)
      setSelectedPet(petId);
	  setKillAsync?.();
    };



	useEffect(() => {
		async function fetchMyAPI() {
		  let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0x294041aC4ed65f7cba6B2182C2c10193fedDB9fE/instances')
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
				Info[0].result.push(BigInt(pet));
				setOwnPetId(pet);
				setOwnPet(Info[0].result);
		}
	
		}
		fetchMyAPI()
	  }, [])
	return (
		<>
		<div>
<Table aria-label="Example static collection table h-44" className="pt-3">
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
		 ownPet &&	ownPet[3] <  pet[3]  && pet[1] !== 4  && (
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
