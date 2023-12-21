"use client"
import React from "react";
import { title , subtitle} from "@/components/primitives";
import {Progress} from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import {Input} from "@nextui-org/react";
import {Select, SelectItem, Avatar ,Tooltip ,Button} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { GithubIcon } from "@/components/icons";
import { Link } from "@nextui-org/link";
import {Image} from "@nextui-org/react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Checkbox} from "@nextui-org/react";
import {Divider} from "@nextui-org/react";
import { useDebounce } from './useDebounce'
import { nftAbi , tokenAbi } from '../../abi';
import {
	usePrepareContractWrite,
	useContractWrite,
	useContractRead,
	useWaitForTransaction,
	useAccount,
	useConnect,
  } from "wagmi";

  const nftAddress= '0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241';
  const MAX_ALLOWANCE = BigInt('20000000000000000000000')
  const tokenAddress = '0xf28194a06800FEf63C312E5D41967Ca85A5De121'



//https://nostalgic-css.github.io/NES.css/
//https://fonts.google.com/specimen/Silkscreen
//https://www.iconfinder.com/iconsets/8-bit
//https://www.iconfinder.com/search?q=8%20bit&price=free
//https://www.iconfinder.com/search/icons?family=pixel-15
//https://www.iconfinder.com/kladenko
//https://sepolia.explorer.mode.network/api/v2/tokens/0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241/instances
//https://www.shutterstock.com/image-vector/8bit-pixel-characters-say-hello-94043773
//https://www.shutterstock.com/image-vector/collection-colorful-pixel-icons-vector-illustration-2172310153
//https://www.shutterstock.com/image-vector/colorful-butterfly-icon-pixel-art-2198218611
//https://www.shutterstock.com/image-vector/pixel-art-8bit-different-types-butterflies-2260306285
export default function AboutPage() {
  const [petData, setPetData] = React.useState<any>(null)
  const [petDefault, setPetDefault] = React.useState<any>(null)
  const [selectedPet, setSelectedPet] = React.useState<any>(null)
  const [petName, setPetName] = React.useState<any>(null)
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors , pendingConnector } = useConnect()
  const {isOpen : isOpenPetName , onOpen : onOpenPetName, onOpenChange : onOpenChangePetName , onClose : onCloseChangePetName} = useDisclosure();
  const debouncedPetName = useDebounce(petName, 500)
  const { config : configAllowance } = usePrepareContractWrite({
    address: nftAddress,
    abi: nftAbi,
    functionName: "setPetName",
    args: [BigInt(1), debouncedPetName],
    });
  
    const {
      data: writeContractResult,
      write: setPetNameAsync,
      error:errorAllowance,
    } = useContractWrite(configAllowance);

    const handleChangePetName = ( event : any )=> {
      setPetName(event.target.value);
    };
    const handleChangeSelectPet = ( event : any )=> {
      setSelectedPet(event.target.value);
    };
    const onChangePetName = () =>{
       setPetNameAsync?.();
     onCloseChangePetName()
    }
  React.useEffect(() => {
    async function fetchMyAPI() {
      let response :any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241/instances')
      response = await response.json()
      let petData : any = [];
      if(response.items){
        response.items.forEach((element:any) => {
          if(element.owner.hash == address){
            petData.push({
              value:element.id,
              label:element.token.name
            })
          }
          
          
        });
      }
      if(petData[0]){
        setPetDefault(petData[0].value)
      }
      
      setPetData(petData);
    }

    fetchMyAPI()
  }, [])

  //fetchMyAPI()

	return (
		<>
		<div className="grid grid-cols-6 gap-3 pt-5">


		<div className="col-start-1 col-end-3 ">	
		
	  <div className="grid grid-rows-2 grid-flow-col gap-0 items-center ">
	
	<div className="row-span-2 "> <Image
			  radius={"none"}
			  width={40}
		src="/gotchi/Icon/skull2.png"
	  /></div>
	<div className="col-span-2 "><span className="text-sm">Healthy</span></div>
	<div className="row-span-1 col-span-2 "><span className="font-bold text-lg">Dead</span></div>
  </div>
	
	</div>
  <div className="col-end-8 col-span-3 ">

	
  <div className="grid grid-rows-2 grid-flow-col gap-0 items-center ">
	
  <div className="row-span-2 "> <Image
			radius={"none"}
			width={40}
      src="/gotchi/Icon/Heart.png"
    /></div>
  <div className="col-span-2 "><span className="text-sm">Healthy</span></div>
  <div className="row-span-1 col-span-2 "><span className="font-bold text-lg">Happy</span></div>
</div>
</div>
  <div className="col-start-1 col-end-7 h-16">
  <Card>
      <CardBody>
        <p>Your pet is hungry.</p>
      </CardBody>
    </Card>
  </div>
		<div className="col-start-1 col-end-7 ">
			<div className="flex justify-center">
			<Image
			radius={"none"}
			width={40}
      src="/gotchi/Animated/GIF_Happy.gif"
    />
			</div>
			</div>
		<div className="col-start-1 col-end-7 ">
			<div className="flex justify-center">
			<Image
			radius={"none"}
			width={100}
      src="/gotchi/Animated/GIF_Pet.gif"
    />
			</div>
			</div>
		<div className="col-start-1 col-end-3 ">Level 10</div>
		<div className="col-end-7 col-span-3">
    <div className="grid grid-cols-3">
  <div className="col-span-1 justify-self-end">
  <Modal 
        isOpen={isOpenPetName} 
        onOpenChange={onOpenChangePetName}
        placement="top-center"
      >
  <ModalContent>
          {(onCloseChangePetName) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Change Pet Name</ModalHeader>
              <ModalBody>
                <Input
                  autoFocus
                  label="Name"
                  onChange={handleChangePetName}
                  placeholder="Enter your pet name"
                  variant="bordered"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onCloseChangePetName}>
                  Close
                </Button>
                <Button color="primary" onPress={onChangePetName}>
                  Change
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    
    <Button onPress={onOpenPetName} isIconOnly color="default" variant="ghost" size="sm" aria-label="Change name">
  <svg enable-background="new 0 0 160 80" id="Layer_1" version="1.1" viewBox="0 0 160 80"  xmlns="http://www.w3.org/2000/svg" ><g><rect height="7" width="7" x="97" y="6"/><rect height="7" width="6" x="91" y="6"/><rect height="7" width="7" x="84" y="6"/><rect height="7" width="7" x="77" y="6"/><rect height="7" width="7" x="70" y="6"/><rect height="7" width="6" x="64" y="6"/><rect height="7" width="7" x="57" y="6"/><rect height="7" width="7" x="50" y="6"/><rect height="7" width="6" x="44" y="6"/><rect height="6" width="7" x="37" y="13"/><rect height="7" width="7" x="97" y="19"/><rect height="7" width="6" x="91" y="19"/><rect height="7" width="7" x="84" y="19"/><rect height="7" width="7" x="77" y="19"/><rect height="7" width="7" x="37" y="19"/><rect height="7" width="7" x="37" y="26"/><rect height="6" width="7" x="37" y="33"/><rect height="6" width="7" x="70" y="33"/><rect height="6" width="6" x="64" y="33"/><rect height="6" width="7" x="57" y="33"/><rect height="6" width="7" x="50" y="33"/><rect height="7" width="7" x="37" y="39"/><rect height="7" width="7" x="37" y="46"/><rect height="7" width="7" x="104" y="6"/><rect height="6" width="6" x="111" y="13"/><rect height="7" width="6" x="111" y="19"/><rect height="7" width="6" x="64" y="19"/><rect height="7" width="7" x="57" y="19"/><rect height="7" width="7" x="50" y="19"/><rect height="7" width="7" x="70" y="19"/><rect height="7" width="6" x="111" y="26"/><rect height="6" width="6" x="111" y="33"/><rect height="7" width="6" x="111" y="39"/><rect height="7" width="6" x="111" y="46"/><rect height="7" width="6" x="111" y="53"/><rect height="7" width="7" x="84" y="46"/><rect height="7" width="7" x="77" y="46"/><rect height="7" width="7" x="70" y="46"/><rect height="7" width="6" x="64" y="46"/><rect height="7" width="7" x="57" y="46"/><rect height="7" width="7" x="50" y="46"/><rect height="7" width="7" x="37" y="53"/><rect height="6" width="7" x="97" y="60"/><rect height="6" width="6" x="91" y="60"/><rect height="6" width="7" x="104" y="60"/><rect height="6" width="7" x="84" y="60"/><rect height="6" width="7" x="77" y="60"/><rect height="6" width="7" x="70" y="60"/><rect height="6" width="6" x="64" y="60"/><rect height="6" width="7" x="57" y="60"/><rect height="6" width="7" x="50" y="60"/><rect height="6" width="6" x="44" y="60"/></g></svg>
      </Button></div>
  <div className="col-span-2"><Select
			fullWidth={false}
      className="max-w-xs"
	  variant="underlined"
	  size="sm"
    selectedKeys={[petDefault]}
	  labelPlacement="outside"
    >
      {petData && petData.map((pet:any) => (
        <SelectItem key={pet.value} value={selectedPet} onChange={handleChangeSelectPet}>
          {pet.label+ '#'+ pet.value}
        </SelectItem>
      ))}
	  </Select></div>
</div>
			
	  </div>
		<div className="col-start-1 col-end-7 ">
			<Progress size="sm" color="default" aria-label="" value={100} /></div>
	
			<div className="col-start-1 col-end-3 ">Reward</div>
  <div className="col-end-7 col-span-1 ">ETH:100</div>
	  </div>
	  <div className="grid grid-cols-2 gap-4  p-6">
  <Tooltip key={"default"} color={"default"} content={"lost 10 FP"} className="capitalize">
  <button type="button" className="nes-btn w-full" >
	
	Apple</button>
  </Tooltip>
  <Tooltip key={"default"} color={"default"} content={"lost 10 FP"} className="capitalize">
  <button type="button" className="nes-btn w-full ">
  <Image
			radius={"none"}
			width={20}
      src="/gotchi/Icon/Eat1.png"
    />
	
	</button>
  </Tooltip>
  <Tooltip key={"default"} color={"default"} content={"lost 10 FP"} className="capitalize">
  <button type="button" className="nes-btn w-full">Apple</button>
  </Tooltip>
  <Tooltip key={"default"} color={"default"} content={"lost 10 FP"} className="capitalize">
  <button type="button" className="nes-btn w-full">Apple</button>
  </Tooltip>
</div>
	
</>
	);
}
