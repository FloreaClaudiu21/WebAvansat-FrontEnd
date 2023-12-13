/* eslint-disable react-hooks/rules-of-hooks */
import { Car, CarBrand, CarColorsList, CarFeaturesList } from "@/types";
import {
	Button,
	CircularProgress,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	Select,
	SelectItem,
} from "@nextui-org/react";
import React, { useState } from "react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "../ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFetch } from "@/hooks/useFetch";
import { useToast } from "../ui/use-toast";
import { updateSchema } from "./schemas";
import { mutate } from "swr";
import { FormLabel } from "@mui/material";

export default function CarUpdateModal({
	car,
	page,
	openModal,
	onOpenChange,
}: {
	car: Car;
	page: number;
	openModal: boolean;
	brandsList: CarBrand[];
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { toast } = useToast();
	const updateForm = useForm<z.infer<typeof updateSchema>>({
		resolver: zodResolver(updateSchema),
		defaultValues: {
			features: car.features.split(",").join(", ").toString(),
			color: car.color,
			fuelType: car.fuelType,
			manufacturer:
				car.brand.id +
				". " +
				car.brand.manufacturer +
				"/" +
				car.brand.model +
				"/" +
				car.brand.year,
			mileage: car.mileage + "",
			model: car.brand.model,
			plateNumber: car.plateNumber,
			transmission: car.transmission,
			registrationDate: car.registrationDate,
			year: car.brand.year + "",
			car_brands_id: car.brand.id,
		},
	});
	const [loading, setLoading] = useState(false);
	async function onSubmit(values: z.infer<typeof updateSchema>) {
		setLoading(true);
		let newvalues = {};
		let manufacturer = values.manufacturer.split(".")[1].split("/")[0];
		newvalues = { ...values, manufacturer };
		const response = await useFetch({
			values: newvalues,
			method: "PUT",
			path: "cars/update?carID=" + car.id,
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Update the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Update the company car completed!",
			description:
				"Car '" +
				response.data.car?.plateNumber +
				"' have been updated with the new data.",
		});
		setLoading(false);
		updateForm.reset();
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
							Update a company car
						</ModalHeader>
						<ModalBody>
							<Form {...updateForm}>
								<form
									onSubmit={updateForm.handleSubmit(onSubmit)}
									className="space-y-4 justify-center place-items-center"
								>
									<FormField
										name="manufacturer"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Manufacturer:</FormLabel>
												<FormControl>
													<Input
														readOnly
														type="text"
														placeholder="BMW"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="model"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Model:</FormLabel>
												<FormControl>
													<Input
														readOnly
														type="text"
														placeholder="BMW X7"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="year"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Production year:</FormLabel>
												<FormControl>
													<Input
														readOnly
														type="text"
														placeholder="2021"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="mileage"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Mileage (km):</FormLabel>
												<FormControl>
													<Input
														disabled
														type="text"
														placeholder="2000"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="color"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Color:</FormLabel>
												<FormControl>
													<Select label="Color" {...field}>
														{CarColorsList.map((brand) => (
															<SelectItem key={brand.value} value={brand.value}>
																{brand.label}
															</SelectItem>
														))}
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="fuelType"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Fuel type:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Gasoline"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="plateNumber"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Plate number:</FormLabel>
												<FormControl>
													<Input
														readOnly
														type="text"
														placeholder="B 32 ARR"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="transmission"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Transmission:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Manual"
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="features"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Features:</FormLabel>
												<FormControl>
													<Select
														{...field}
														label="Features"
														placeholder="Select the car features"
														selectionMode="multiple"
													>
														{CarFeaturesList.map((feat) => (
															<SelectItem key={feat.value} value={feat.value}>
																{feat.label}
															</SelectItem>
														))}
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="registrationDate"
										control={updateForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Registration date:</FormLabel>
												<FormControl>
													<Input type="date" variant="bordered" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<div className="flex flex-row justify-end gap-2">
										<Button color="danger" variant="flat" onPress={onClose}>
											Close
										</Button>
										<Button type="submit" color="primary">
											Update
										</Button>
									</div>
								</form>
							</Form>
						</ModalBody>
					</>
				)}
			</ModalContent>
		</Modal>
	);
}
