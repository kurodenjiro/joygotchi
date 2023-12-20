"use client"
import React from "react";
import { title , subtitle} from "@/components/primitives";
import {Progress} from "@nextui-org/react";
import { siteConfig } from "@/config/site";
import {Input} from "@nextui-org/react";
import {Select, SelectItem, Avatar ,Tooltip} from "@nextui-org/react";
import {Card, CardBody} from "@nextui-org/react";
import { button as buttonStyles } from "@nextui-org/theme";
import { GithubIcon } from "@/components/icons";
import { Link } from "@nextui-org/link";
import {Image} from "@nextui-org/react";
import {Divider} from "@nextui-org/react";
//https://nostalgic-css.github.io/NES.css/
//https://fonts.google.com/specimen/Silkscreen
//https://www.iconfinder.com/iconsets/8-bit
//https://www.iconfinder.com/search?q=8%20bit&price=free
//https://www.iconfinder.com/search/icons?family=pixel-15
export default function AboutPage() {
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
		<div className="col-end-7 col-span-2">
			<Select
			fullWidth={false}
      className="max-w-xs"
	  variant="underlined"
	  size="sm"
	  labelPlacement="outside"
    >
      <SelectItem
        key="pet1"
      >
        pet1
      </SelectItem>
      <SelectItem
        key="pet2"
      >
        pet2
      </SelectItem>
      <SelectItem
        key="pet3"
      >
        pet3
      </SelectItem>
	  </Select>
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
