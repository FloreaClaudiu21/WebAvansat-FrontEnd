/* eslint-disable react-hooks/rules-of-hooks */
import { Car } from "@/types";
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

export default function CarDeleteModal({
	page,
	openModal,
	onOpenChange,
	car,
}: {
	car: Car;
	page: number;
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
			path: "cars/delete?carID=" + car.id,
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Delete the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Delete the company car completed!",
			description:
				"Car '" + car.plateNumber + "' have been deleted from our database.",
		});
		setLoading(false);
		onOpenChange(false);
		mutate(`api/v1/cars?page=${page}`);
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
							Delete a company car
						</ModalHeader>
						<ModalBody>
							<p>
								Are you sure you want to delete the car with plate number `
								{car.plateNumber}`?
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
