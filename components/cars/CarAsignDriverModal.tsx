/* eslint-disable react-hooks/rules-of-hooks */
import { Car, Driver } from "@/types";
import {
	Autocomplete,
	AutocompleteItem,
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
import useSWR, { mutate } from "swr";
import { GetDriversWithFirstNameNoCar } from "@/actions/getDriversNoCar";

export default function CarAsignDriverModal({
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
	const [userID, setUserId] = useState<number | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const {
		data: drivers,
		isLoading: loadingDrivers,
	} = useSWR(`drivers/byFirstNameNoCar`, () =>
		GetDriversWithFirstNameNoCar("")
	);
	async function onSubmit() {
		setLoading(true);
		const response = await useFetch({
			values: {},
			method: "POST",
			path: "drivers/allocate-car?carID=" + car.id + "&driverID=" + userID,
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Assign the driver to the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Assign the driver to the company car completed!",
			description: "Car '" + car.plateNumber + "' now have a new driver.",
		});
		setLoading(false);
		onOpenChange(false);
		mutate(`api/v1/cars?page=${page}`);
		mutate(`api/drivers/byCarId/${car.id}`);
	}
	const driversList = drivers?.data?.drivers as Driver[];
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
							Assign a driver to the company car
						</ModalHeader>
						<ModalBody>
							<p>Choose a driver to assign to the car `{car.plateNumber}`:</p>
							{!loadingDrivers ? (
								driversList != null && driversList.length > 0 ? (
									<Autocomplete
										label="Select an driver"
										className="w-full"
										onSelectionChange={(e) => {
											if (e == undefined) {
												setUserId(undefined);
											}
											setUserId(parseInt(e.toString()));
										}}
									>
										{driversList.map((d) => (
											<AutocompleteItem key={d.id} value={d.id}>
												{d.id + ". " + d.firstName + " " + d.lastName}
											</AutocompleteItem>
										))}
									</Autocomplete>
								) : (
									<p className="w-full text-center">
										No drivers have been found
									</p>
								)
							) : (
								<p className="w-full text-center">Loading drivers data...</p>
							)}
						</ModalBody>
						<ModalFooter>
							<Button color="danger" variant="flat" onPress={onClose}>
								No
							</Button>
							<Button
								type="submit"
								color="primary"
								onClick={() => onSubmit()}
								disabled={loadingDrivers || userID == undefined}
							>
								Yes
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
