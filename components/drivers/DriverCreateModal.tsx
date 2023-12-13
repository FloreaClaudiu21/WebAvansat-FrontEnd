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
import { createSchema } from "./schema";
import { mutate } from "swr";
import { FormLabel } from "@mui/material";

export default function DriverCreateModal({
	page,
	openModal,
	onOpenChange,
}: {
	page: number;
	openModal: boolean;
	onOpenChange: (isOpen: boolean) => void;
}) {
	const { toast } = useToast();
	const createForm = useForm<z.infer<typeof createSchema>>({
		resolver: zodResolver(createSchema),
	});
	const [loading, setLoading] = useState(false);
	async function onSubmit(values: z.infer<typeof createSchema>) {
		setLoading(true);
		const response = await useFetch({
			values: values,
			method: "POST",
			path: "drivers/create",
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Create the company driver request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Create the company driver completed!",
			description:
				"Driver '" +
				response.data.driver?.firstName +
				" " +
				response.data.driver?.lastName +
				"' have been created.",
		});
		setLoading(false);
		createForm.reset();
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
							Create a company driver
						</ModalHeader>
						<ModalBody>
							<Form {...createForm}>
								<form
									onSubmit={createForm.handleSubmit(onSubmit)}
									className="space-y-4 justify-center place-items-center"
								>
									<FormField
										name="firstName"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>First name:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Enter the driver first name..."
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="lastName"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Last name:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Enter the driver last name..."
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="phone"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Phone:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Enter the driver phone number..."
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="birthDate"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>Birth date:</FormLabel>
												<FormControl>
													<Input type="date" variant="bordered" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="licenseNumber"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>License Number:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Enter the driver license number..."
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="categories"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>License Categories:</FormLabel>
												<FormControl>
													<Input
														type="text"
														placeholder="Enter the driver license categories..."
														variant="bordered"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="expirationDate"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>License expiration date:</FormLabel>
												<FormControl>
													<Input type="date" variant="bordered" {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										name="issueDate"
										control={createForm.control}
										render={({ field }) => (
											<FormItem className="w-full">
												<FormLabel>License issue date:</FormLabel>
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
