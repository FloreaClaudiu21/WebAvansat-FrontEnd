/* eslint-disable react-hooks/rules-of-hooks */
import { CarBrand, CarColorsList, CarFeaturesList } from "@/types";
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
import { createSchema } from "./schemas";
import { mutate } from "swr";
import { FormLabel } from "@mui/material";

export default function CarCreateModal({
	page,
	openModal,
	onOpenChange,
	brandsList,
}: {
	brandsList: CarBrand[];
	page: number;
	openModal: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { toast } = useToast();
	const createForm = useForm<z.infer<typeof createSchema>>({
		resolver: zodResolver(createSchema),
	});
	const [loading, setLoading] = useState(false);
	function handleSelectionChange(
		event: React.ChangeEvent<HTMLSelectElement>
	): any {
		const val = event.target.value;
		createForm.setValue("car_brands_id", parseInt(val.split(".")[0].trim()));
		createForm.setValue("manufacturer", val);
		createForm.setValue("model", val.split("/")[1]);
		createForm.setValue("year", val.split("/")[2]);
	}
	async function onSubmit(values: z.infer<typeof createSchema>) {
		setLoading(true);
		let newvalues = {};
		let manufacturer = values.manufacturer.split(".")[1].split("/")[0];
		newvalues = { ...values, manufacturer };
		const response = await useFetch({
			values: newvalues,
			method: "POST",
			path: "cars/create",
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Create the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Create the company car completed!",
			description:
				"Car '" + response.data.car?.plateNumber + "' have been created.",
		});
		setLoading(false);
		createForm.reset();
		onOpenChange(false);
		mutate(`api/v1/cars?page=${page}`);
	}
	const brands = !brandsList ? [] : brandsList;
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
							Create a company car
						</ModalHeader>
						<ModalBody>
							<Form {...createForm}>
								<form
									onSubmit={createForm.handleSubmit(onSubmit)}
									className="space-y-4 justify-center place-items-center"
								>
									<FormField
										name="manufacturer"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Manufacturer:</FormLabel>
												<FormControl>
													<Select
														label="Select the car manufacturer"
														{...field}
														onChange={(event) => handleSelectionChange(event)}
													>
														{brands.map((brand) => (
															<SelectItem
																key={
																	brand.id +
																	". " +
																	brand.manufacturer +
																	"/" +
																	brand.model +
																	"/" +
																	brand.year
																}
																value={
																	brand.id +
																	". " +
																	brand.manufacturer +
																	"/" +
																	brand.model +
																	"/" +
																	brand.year
																}
															>
																{brand.id +
																	". " +
																	brand.manufacturer +
																	": " +
																	brand.model +
																	", " +
																	brand.year}
															</SelectItem>
														))}
													</Select>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										disabled
										name="model"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Model:</FormLabel>
												<FormControl>
													<Input
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
										disabled
										name="year"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Production year:</FormLabel>
												<FormControl>
													<Input
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
										control={createForm.control}
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
										control={createForm.control}
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
										control={createForm.control}
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
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Plate number:</FormLabel>
												<FormControl>
													<Input
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
										control={createForm.control}
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
										control={createForm.control}
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
										control={createForm.control}
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
											Create
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
