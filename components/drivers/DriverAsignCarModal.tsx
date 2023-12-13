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
import { GetCarsWithNoDriver } from "@/actions/getCarsNoDrivers";

export default function DriverAsignCarModal({
	page,
	openModal,
	onOpenChange,
	driver,
}: {
	driver: Driver;
	page: number;
	openModal: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { toast } = useToast();
	const [carID, setCarId] = useState<number | undefined>(undefined);
	const [loading, setLoading] = useState(false);
	const { data: cars, isLoading: loadingCars } = useSWR(`cars/noDriver`, () =>
		GetCarsWithNoDriver()
	);
	async function onSubmit() {
		setLoading(true);
		const response = await useFetch({
			values: {},
			method: "POST",
			path: "drivers/allocate-car?carID=" + carID + "&driverID=" + driver.id,
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
		setLoading(false);
		onOpenChange(false);
		mutate(`api/v1/cars?page=${page}`);
		mutate(`api/drivers/byCarId/${carID}`);
		mutate(`api/v1/drivers?page=${page}`);
		toast({
			title: "Assign the driver to the company car completed!",
			description: "Car with ID: '" + carID + "' now have a new driver.",
		});
	}
	const carsList = cars?.data?.cars as Car[];
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
							<p>
								Choose a car to assign to the driver `
								{driver.firstName + " " + driver.lastName}`:
							</p>
							{!loadingCars ? (
								carsList != null && carsList.length > 0 ? (
									<Autocomplete
										label="Select a car"
										className="w-full"
										onSelectionChange={(e) => {
											if (e == undefined) {
												setCarId(undefined);
											}
											setCarId(parseInt(e.toString()));
										}}
									>
										{carsList.map((d) => (
											<AutocompleteItem key={d.id} value={d.id}>
												{d.id +
													". " +
													d.brand.manufacturer +
													" " +
													d.brand.model +
													" | " +
													d.plateNumber}
											</AutocompleteItem>
										))}
									</Autocomplete>
								) : (
									<p className="w-full text-center">No cars have been found</p>
								)
							) : (
								<p className="w-full text-center">Loading cars data...</p>
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
								disabled={loadingCars || carID == undefined}
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
