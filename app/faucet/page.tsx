"use client"
import React, { useState, useEffect } from 'react';
import {
	usePrepareContractWrite,
	useContractWrite,
	useWaitForTransaction,
	useAccount,
  } from "wagmi";
  import { useDebounce } from './useDebounce';
  const nftAddress= process.env.NFT_ADDRESS;
  const tokenAddress = process.env.TOKEN_ADDRESS;
import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell,Button ,Input} from "@nextui-org/react";
export default function ActivityPage() {
	const [addressFaucet, setAddressFaucet] = useState<any>(null)
	const debouncedAddressFaucet = useDebounce(addressFaucet, 500)

	const handleChangeAddress = ( event : any )=> {
     
		setAddressFaucet(event.target.value);
	  };

		const { config : configFaucet } = usePrepareContractWrite({
			address: `0x${process.env.FAUCET_ADDRESS?.slice(2)}`,
			abi: [
				{
					"inputs": [
						{
							"internalType": "address",
							"name": "_token",
							"type": "address"
						}
					],
					"stateMutability": "nonpayable",
					"type": "constructor"
				},
				{
					"inputs": [
						{
							"internalType": "address",
							"name": "_to",
							"type": "address"
						}
					],
					"name": "getJoy",
					"outputs": [],
					"stateMutability": "nonpayable",
					"type": "function"
				},
				{
					"inputs": [],
					"name": "token",
					"outputs": [
						{
							"internalType": "contract IERC20",
							"name": "",
							"type": "address"
						}
					],
					"stateMutability": "view",
					"type": "function"
				}
			],
			functionName: "getJoy",
			args: [debouncedAddressFaucet],
			});
		  
			const {
			  data: faucetData,
			  writeAsync: setFaucetAsync,
			  error:errorFaucet,
			} = useContractWrite(configFaucet);

			const onFaucet = ()=> {
				setFaucetAsync?.();
				};
	return (
		<>
		<div className='pt-10'>
				{/* <Table aria-label="Example static collection table h-44" className="pt-3">
      <TableHeader>
        <TableColumn>Addr.</TableColumn>
        <TableColumn>Pet</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
	  <TableRow >
	   <TableCell >
		<p></p>
	   </TableCell>
	   </TableRow>
      </TableBody>
    </Table> */}
	<Input
      type="address"
      label="Input your Address"
      className="w-full"
	  color={"primary"}
	  onChange={handleChangeAddress}
    />
	<br/>
		<Button color="primary" className="w-full" onPress={onFaucet}>
		faucet $Joy Token
	  </Button>
	  
		</div>
		</>
	);
}
