"use client"
import { title } from "@/components/primitives";
import React, { useState, useEffect, useMemo } from 'react';
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useAccount,
	useContractEvent
  } from "wagmi";
  import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue,Button,Spinner ,Pagination} from "@nextui-org/react";
  import { readContracts , watchAccount  } from '@wagmi/core'
  import {Card, CardBody , CardHeader , Divider} from "@nextui-org/react";
  import { nftAbi , tokenAbi } from '../../abi';
  import { useDebounce } from './useDebounce'
  import {Image} from "@nextui-org/react";
  import useSWR from "swr";


  const fetcher = async (...args: Parameters<typeof fetch>) => {
	const res = await fetch(...args);
	return res.json();
  };

  const nftAddress= `0x${process.env.NFT_ADDRESS?.slice(2)}`;
 
  //https://github.com/ChangoMan/nextjs-ethereum-starter/blob/main/frontend/pages/index.tsx
export default function Battle() {
	
	const [listBattle, setListBattle] = useState<any>(null);
	const { address } = useAccount();
	const [page, setPage] = React.useState(0);
	const [ownPet, setOwnPet] = useState<any>(null)
	const [ownPetId, setOwnPetId] = useState<any>(null)
	const [selectedPet, setSelectedPet] = useState<any>(null)
	const [activity, setActivity] = useState<any>([])
	const colors = ["default", "primary", "secondary", "success", "warning", "danger"];
	const [selectedColor, setSelectedColor] = React.useState("default");
	const debouncedSelectedPet = useDebounce(selectedPet, 500)
	const debouncedOwnPetId = useDebounce(ownPetId, 500)
	const unwatch = watchAccount((account) => {

	})
	
	
	const {data, isLoading, mutate } = useSWR( `https://scan-api-testnet.viction.xyz/api/nft/inventory?tokenAddress=${process.env.NFT_ADDRESS}&limit=20&offset=${page}`, fetcher, {
	
	  });
	  
	//   let petList = data?.data.filter((item:any) =>item.address !== address && item.address !== '0x0000000000000000000000000000000000000000') ;
	let petList = data?.data.filter((item:any) =>item.address !== address && item.address !== '0x0000000000000000000000000000000000000000');
	  
	  console.log("petList",petList);
	  const loadingState = isLoading || data?.data.length === 0 ? "loading" : "idle";

	  const rowsPerPage = 20;
	  const pages = useMemo(() => {
		
		return data?.total ? Math.ceil(data.total / rowsPerPage) : 0;
	  }, [data?.total, rowsPerPage]);
	  

	  const renderCell = React.useCallback(async(data:any, columnKey:any ) => {
		const cellValue = data[columnKey];
		console.log("ownedpet1",ownPet)
		const res : any = await readContracts({
			contracts: [
			  {
				address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
				abi: nftAbi,
				functionName: 'getPetInfo',
				args: [data.tokenId],
			  }
			],
		  })
		  const pet  = res[0].result;

		switch (columnKey) {
		  case "pet":
			return (
				<div className="relative flex justify-start items-center gap-2">
				<User
					avatarProps={{radius: "lg", className:"p-1" ,src: "/gotchi/Animated/GIF_Pet.gif"}}
					description={'lv:'+pet[3]}
					name={pet[0] +"#"+data.tokenId || "Unknow" +"#"+data.tokenId}
	   			>
		</User>
			  </div>
			);
		  case "score":
			return (
				<div className="relative flex justify-end items-center gap-2">
				<p className="text-bold text-sm capitalize">{pet[2].toString()}</p>
		 <p className="text-bold text-sm capitalize text-default-400">Pts.</p>
			  </div>
			);
		  case "actions":
			return (
			  <div className="relative flex justify-end items-center gap-2">
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
			  </div>
			);
		  default:
			return cellValue;
		}
	  }, [ownPet]);


	 

	

	


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
			  const InputDataDecoder = require('ethereum-input-data-decoder');
			  const decoder = new InputDataDecoder(nftAbi);
			  const data1 = decoder.decodeData(data.logs[0].data);
			  const list = activity;
			  list.push(` You Attacked #${selectedPet} `)
			  setActivity(list)

			  fetchMyAPI()
			}
		  })
const onAttack = ( petId : any )=> {
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
			  const list = activity;
			  list.push(` You Killed #${selectedPet} `)
			  setActivity(list)
			  fetchMyAPI();
			},
		  })
const onKill = async( petId : any )=> {
      await setSelectedPet(petId);
	  await setKillAsync?.();
    };

	
const fetchMyAPI = async()=>{
	mutate();
	const pet =  typeof window !== 'undefined' ? localStorage.getItem('pet') : null;
	console.log("ownedPet",pet)
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
  }
} 
useContractEvent({
	address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
	abi: nftAbi,
	eventName:"Attack",
	listener(logs) {
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
	  }, [])
	return (
		<>
		<div>
<Table isStriped

		bottomContent={
			pages > 0 ? (
			  <div className="flex w-full justify-center">
				<Pagination
				  isCompact
				  showControls
				  showShadow
				  color="primary"
				  page={page}
				  total={pages}
				  onChange={(page) => setPage(page)}
				/>
			  </div>
			) : null}
        selectionMode="single"  aria-label="Example static collection table h-44" classNames={{
        base: "max-h-[520px] pt-3",
        table: "min-h-[420px] pt-3",
      }}>
      <TableHeader>
        <TableColumn key="pet" >Info</TableColumn>
        <TableColumn key="score">Score</TableColumn>
        <TableColumn key="actions">Battle</TableColumn>
      </TableHeader>
      <TableBody
	  items={petList || []}
	  loadingState={loadingState}
	  loadingContent={<Spinner label="Loading..." />}
	  
	  >
		{/* {item.address !== address && element.address !== '0x0000000000000000000000000000000000000000') 
		} */}
		
		   {(item:any)  =>  (
          <TableRow key={item?.tokenIdString}>
            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
          </TableRow>
        )}
	  {/* {listBattle && listBattle.map((pet:any,index:number) => (
       <TableRow key={index} >
	   <TableCell > 
		 <User
		 avatarProps={{radius: "lg", className:"p-1" ,src: "/gotchi/Animated/GIF_Pet.gif"}}
		 description={'lv:'+pet[3]}
		 name={pet[0] +"#"+pet[9] || "Unknow" +"#"+pet[9]}
	   >
	   </User>
	   </TableCell>

	   <TableCell > 
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
      ))} */}
       
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
			
	  </CardBody>
	</Card>
	<br/>
	<br/>
	<br/>
	</>
		)
}
