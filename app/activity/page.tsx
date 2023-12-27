"use client"
import React, { useState, useEffect } from 'react';
import { readContracts  , watchAccount} from '@wagmi/core'
import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell,Button ,Input} from "@nextui-org/react";
import { nftAbi , tokenAbi } from '../../abi';

export default function ActivityPage() {
	const [activity, setActivity] = useState<any>(null)
	useEffect(() => {
		async function fetchMyAPI() {
		  let response : any= await fetch(`${process.env.EXPLORER_URL}/api/transaction/list?account=${process.env.NFT_ADDRESS}`)
		  response = await response.json()
		  console.log(response);
		  let acitivityArr = [];
		  for (const element of response.data) {
			if (element.result == "success") {
			
				if(element.method == "buyAccessory"){
					const itemInfo : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getItemInfo',
							args: [element.decoded_input.parameters[1].value],
						  }
						],
					  })

					  const petInfo : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[0].value],
						  }
						],
					  })

					  acitivityArr.push({
						pet:petInfo[0].result[0] || "Unknow",
						method:element.method,
						action:"Feed",
						log:`${itemInfo[0].result[0]}`
					})

				}
				if(element.method == "mint"){
					
					acitivityArr.push({
						pet:"A new Pet",
						method:element.method,
						action:"Mint",
						log:`Minted`
					})
				}
				if(element.method == "redeem"){
					const petInfo : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[0].value],
						  }
						],
					  })
					acitivityArr.push({
						pet:petInfo[0].result[0],
						method:element.method,
						action:"Redeem",
						log:`Redeemed`
					})
				}
				if(element.method == "attack"){
					const petAttack : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[0].value],
						  }
						],
					  })
					  const petWasAttack : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[1].value],
						  }
						],
					  })
					  acitivityArr.push({
						pet:petAttack[0].result[0],
						method:element.method,
						action:"Attacked",
						log:`${petWasAttack[0].result[0]}`
					})
				}
				if(element.method == "kill"){
					const petAttack : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[0].value],
						  }
						],
					  })
					  const petWasAttack : any = await readContracts({
						contracts: [
						  {
							address: `0x${process.env.NFT_ADDRESS?.slice(2)}`,
							abi: nftAbi,
							functionName: 'getPetInfo',
							args: [element.decoded_input.parameters[1].value],
						  }
						],
					  })
					  acitivityArr.push({
						pet:petAttack[0].result[0],
						method:element.method,
						action:"Killed",
						log:`${petWasAttack[0].result[0]}`
					})
				}
				
			  }	
			  
		  };
		  setActivity(acitivityArr);
		  
		}
		fetchMyAPI()
	})

	return (
		<>
		<div className='pt-10'>
				<Table aria-label="Example static collection table h-44" className="pt-3">
      <TableHeader>
        <TableColumn>Pet.</TableColumn>
        <TableColumn>Action</TableColumn>
        <TableColumn>Info</TableColumn>
      </TableHeader>
      <TableBody>
	  
		{activity && activity.map((item:any,index:number)=>(
			<TableRow  key={index}>
			
			<TableCell>
		<p>{item.pet}</p>
	   </TableCell>
	   
	   <TableCell >
		<p>{item.action}</p>
	   </TableCell>
	   
	   <TableCell >
		<p>{item.log}</p>
	   </TableCell>
	   </TableRow>
		))}
	   
      </TableBody>
    </Table>
		</div>
		</>
	);
}
