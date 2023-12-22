"use client"

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
  useNetwork, 
	useSwitchNetwork
  } from "wagmi";
  import { readContracts  } from '@wagmi/core'
  const nftAddress= '0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241';
  const MAX_ALLOWANCE = BigInt('20000000000000000000000')
  const tokenAddress = '0xf28194a06800FEf63C312E5D41967Ca85A5De121'



export default function PetPage() {
  const [petData, setPetData] = React.useState<any>(null)
  const [itemData, setItemData] = React.useState<any>(null)
  const [isClient, setIsClient] = React.useState<any>(true)
  const [selectedPet, setSelectedPet] = React.useState<any>(null)
  const [selectedItem, setSelectedItem] = React.useState<any>(null)
  const [petName, setPetName] = React.useState<any>(null)
  const { address, connector, isConnected } = useAccount()
  const { connect, connectors , pendingConnector } = useConnect()
  const { chain  } = useNetwork()
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
        async function fetchMyAPI() {
          let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241/instances')
          response = await response.json()
          let petArr : any = [];
          console.log(response.items)
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
              if(element.owner.hash == address){
                petArr.push({
                  value:element.id,
                  label:Info[0].result[0]
                })
              }
            }
          }
          console.log("check",petArr)
          if(petArr[0]){
            const pet = localStorage.getItem('pet');
          if (pet) {
            setSelectedPet(pet);
          }else{
            setSelectedPet(petArr[0].value)
          }
        }
          let items : any = [0,1];
          let itemArr : any = [];
          for (const element of items) {
            const Info : any = await readContracts({
              contracts: [
                {
                  address: nftAddress,
                  abi: nftAbi,
                  functionName: 'getItemInfo',
                  args: [element],
                }
              ],
            })
            itemArr.push({
              id:element,
              name:Info[0].result[0],
              price:Info[0].result[1],
              points:Info[0].result[2],
              timeExtension:Info[0].result[3],
            })
          }
          setItemData(itemArr);
          
        }
        setIsClient(true);
        fetchMyAPI()
				

      }
		  })
  const {isOpen : isOpenPetName , onOpen : onOpenPetName, onOpenChange : onOpenChangePetName , onClose : onCloseChangePetName} = useDisclosure();
  const debouncedPetName = useDebounce(petName, 500)
  const debouncedSelectedPet = useDebounce(selectedPet, 500)
  const debouncedSelectedItem = useDebounce(selectedItem, 500)

  const { config : configPetName } = usePrepareContractWrite({
    address: nftAddress,
    abi: nftAbi,
    functionName: "setPetName",
    args: [debouncedSelectedPet, debouncedPetName],
    });
  
    const {
      data: petNameResult,
      writeAsync: setPetNameAsync,
      error:errorPetName,
    } = useContractWrite(configPetName);

    const { config : configBuyAccessory } = usePrepareContractWrite({
      address: nftAddress,
      abi: nftAbi,
      functionName: "buyAccessory",
      args: [debouncedSelectedPet, debouncedSelectedItem],
      });
    
      const {
        data: buyAccessoryResult,
        writeAsync: setBuyAccessoryAsync,
        error:errorBuyAccessory,
      } = useContractWrite(configBuyAccessory);


    const handleChangePetName = ( event : any )=> {
     
      setPetName(event.target.value);
    };
    const handleChangeSelectPet = ( event : any )=> {
      localStorage.setItem('pet',event.target.value);
      setSelectedPet(event.target.value);
    };
    const onChangePetName = () =>{
       setPetNameAsync?.();
     onCloseChangePetName()
    }
    const onBuyAccessory = (itemId:any) =>{
      setSelectedItem(itemId);
      setBuyAccessoryAsync?.();
   }
   

  React.useEffect(() => {
    async function fetchMyAPI() {

      let response : any= await fetch('https://sepolia.explorer.mode.network/api/v2/tokens/0xe70BbbA43664e133a8BdD459ec5DbDAFB4c6b241/instances')
      response = await response.json()
      let petArr : any = [];
      console.log(response.items)
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
          if(element.owner.hash == address){
            petArr.push({
              value:element.id,
              label:Info[0].result[0]
            })
          }
        }
      }
      console.log("check",petArr)
      
      if(petArr[0]){
        const pet = localStorage.getItem('pet');
      if (pet) {
        setSelectedPet(pet);
      }else{
        setSelectedPet(petArr[0].value)
      }
    }
    setPetData(petArr)
      let items : any = [0,1];
      let itemArr : any = [];
      for (const element of items) {
        const Info : any = await readContracts({
          contracts: [
            {
              address: nftAddress,
              abi: nftAbi,
              functionName: 'getItemInfo',
              args: [element],
            }
          ],
        })
        itemArr.push({
          id:element,
          name:Info[0].result[0],
          price:Info[0].result[1],
          points:Info[0].result[2],
          timeExtension:Info[0].result[3],
        })
      }
      setItemData(itemArr);
      
    }

   // fetchMyAPI()

    if(chain?.id == 919){
      setIsClient(true);
      fetchMyAPI()
      
    }else{
      setIsClient(false);
    }
 

  }, [])

	return (
    
     isClient  ? (
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
<div className="col-span-2">

<Select
  fullWidth={false}
  className="max-w-xs"
variant="underlined"
size="sm"
selectedKeys={[selectedPet]}
onChange={handleChangeSelectPet}
labelPlacement="outside"
>
  {petData && petData.map((pet:any) => (
    <SelectItem key={pet.value} value={pet.value} >
      {pet.label+ '#'+ pet.value}
    </SelectItem>
  ))}
</Select></div>
</div>
  
</div>
<div className="col-start-1 col-end-7 ">
  <Progress size="sm" color="default" aria-label="" value={100} /></div>

  <div className="col-start-1 col-end-3 ">Reward</div>
<div className="col-end-7 col-span-1 ">ETH:{itemData && itemData[0].name}</div>
</div>
<div className="grid grid-cols-2 gap-4  p-6">
{itemData  && itemData.map((item:any)=>(
<Tooltip key={"default"}  color={"default"} content={"lost 10 FP"} className="capitalize">
  <button type="button" className="nes-btn w-full" onClick={()=>onBuyAccessory(item.id)}> {item.name} </button>
</Tooltip>
))}
</div>

</>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 py-8 md:py-10 ">
  <button
        key={919}
        onClick={() => switchNetwork?.(919)}
    className="nes-btn w-52 mt-48"
      >
       switch to Mode Testnet
        {loadingSwingNetwork && pendingChainId === 919 && ' (switching)'}
      </button>
      <span>{errorSwitchNetwork && errorSwitchNetwork.message}</span>
        </div>
    )
	);
}
