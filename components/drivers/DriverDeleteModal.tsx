/* eslint-disable react-hooks/rules-of-hooks */
import { Driver } from "@/types";
import {
	Button,
	CircularProgress,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "../ui/use-toast";
import { mutate } from "swr";

export default function DriverDeleteModal({
	page,
	openModal,
	onOpenChange,
	driver,
}: {
	page: number;
	driver: Driver;
	openModal: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { toast } = useToast();
	const [loading, setLoading] = useState(false);
	async function onSubmit() {
		setLoading(true);
		const response = await useFetch({
			values: {},
			method: "DELETE",
			path: "drivers/delete?driverID=" + driver.id,
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Delete the company driver request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Delete the company driver completed!",
			description:
				"Driver '" +
				driver.firstName +
				" " +
				driver.lastName +
				"' have been deleted from our database.",
		});
		setLoading(false);
		onOpenChange(false);
		mutate(`api/v1/drivers?page=${page}`);
	}
	return (
		<Modal
			isOpen={openModal}
			placement="top-center"
			className="max-h-screen"
			onOpenChange={onOpenChange}
		>
			<ModalContent className="overflow-y-auto my-4">
				{(onClose) => (
					<>
						{loading ? (
							<div className="fixed left-0 top-0 flex flex-col justify-center place-items-center w-full h-screen bg-[rgba(0,0,0,0.3)] z-50">
								<CircularProgress color="secondary" />
								<p className="text-white">Loading...</p>
							</div>
						) : (
							<></>
						)}
						<ModalHeader className="flex flex-col gap-1">
							Delete a company driver
						</ModalHeader>
						<ModalBody>
							<p>
								Are you sure you want to delete this company driver with the
								name `{driver.firstName + " " + driver.lastName}`?
							</p>
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="flat" onPress={onClose}>
								No
							</Button>
							<Button type="submit" color="primary" onClick={() => onSubmit()}>
								Yes
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
