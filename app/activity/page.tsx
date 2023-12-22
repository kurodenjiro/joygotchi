"use client"
import { title } from "@/components/primitives";
import {Table, TableHeader, TableColumn,Link, TableBody, TableRow, TableCell, User, Chip, Tooltip, getKeyValue,Button} from "@nextui-org/react";
export default function ActivityPage() {
	return (
		<div>
				<Table aria-label="Example static collection table h-44" className="pt-3">
      <TableHeader>
        <TableColumn>Addr.</TableColumn>
        <TableColumn>Pet</TableColumn>
        <TableColumn>Action</TableColumn>
      </TableHeader>
      <TableBody>
	 
       
      </TableBody>
    </Table>

		</div>
	);
}
