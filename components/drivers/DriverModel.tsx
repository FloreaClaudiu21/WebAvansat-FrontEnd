/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { Driver, User } from "@/types";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Divider,
	Tooltip,
	useDisclosure,
} from "@nextui-org/react";
import { useToast } from "../ui/use-toast";
import { CalendarIcon, TrashIcon } from "@radix-ui/react-icons";
import DriverDeleteModal from "./DriverDeleteModal";
import Image from "next/image";
import NoteIcon from "@mui/icons-material/Note";
import { useFetch } from "@/hooks/useFetch";
import { mutate } from "swr";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DriverAsignCarModal from "./DriverAsignCarModal";

export default function DriverModel({
	driver,
	user,
	page,
}: {
	user: User;
	page: number;
	driver: Driver;
}) {
	const { toast } = useToast();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: openAsign,
		onOpen: onOpenAsign,
		onOpenChange: onOpenChangeAsign,
	} = useDisclosure();
	const deallocateCar = async () => {
		const response = await useFetch({
			values: {},
			method: "PUT",
			path: "drivers/deallocate-car?driverID=" + driver.id,
		});
		if (response.error) {
			toast({
				variant: "destructive",
				title: "Remove the driver from the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Remove the driver from the company car completed!",
			description:
				"Car '" + driver.car.plateNumber + "' now does not have a driver.",
		});
		mutate(`api/v1/cars?page=${page}`);
		mutate(`api/drivers/byCarId/${driver.car.id}`);
		mutate(`api/v1/drivers?page=${page}`);
	};
	return (
		<Card isBlurred shadow="sm" className="min-w-[100px] w-full">
			<CardHeader className="relative pb-0">
				<div className="text-[22px] leading-[26px] font-bold capitalize">
					<h1 className="text-lg text-blue-600">
						{driver.firstName} {driver.lastName}
					</h1>
				</div>
				<Tooltip content="Delete this driver" placement="right-start">
					<Button
						isIconOnly
						color="danger"
						aria-label="Delete"
						onPress={onOpen}
						className="w-8 h-8 absolute top-2 right-2 min-w-0"
					>
						<TrashIcon className="w-6 h-6" />
					</Button>
				</Tooltip>
			</CardHeader>
			<CardBody>
				<div className="relative w-full h-40 my-2 object-contain flex flex-col justify-center place-items-center">
					<Image
						priority
						width={100}
						height={100}
						alt="car model"
						className="object-contain"
						src={"https://cdn-icons-png.flaticon.com/512/1/1247.png"}
					/>
				</div>
				<Divider />
				<div className="flex flex-col text-sm py-2 ">
					<div className="flex flex-row place-items-start gap-2">
						<LocalPhoneIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Phone:</b> {driver.phone}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CalendarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Birth date:</b> {driver.birthDate}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<NoteIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>License number:</b> {driver.license?.licenseNumber}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CalendarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>License issue date:</b> {driver.license?.issueDate}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CalendarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>License expiration date:</b> {driver.license?.expirationDate}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<NoteIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>License categories:</b> {driver.license?.categories}
						</span>
					</div>
					<Divider className="my-2" />
					<div className="flex flex-row place-items-start gap-2">
						<DirectionsCarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Drives car: </b>
							<span className="flex flex-row gap-4 justify-center place-items-center">
								{driver.car ? (
									<>
										<p>
											{driver.car.brand.manufacturer +
												" " +
												driver.car.brand.model}
										</p>
										<span>{" | " + driver.car.plateNumber}</span>
										<Tooltip content={"Remove this car"}>
											<Button
												isIconOnly
												className="w-6 h-6 mx-0 px-0 bg-orange-300"
												onClick={deallocateCar}
											>
												<TrashIcon className="text-white font-bold" />
											</Button>
										</Tooltip>
									</>
								) : (
									<Button
										className="mt-2 text-primary-foreground bg-primary"
										onClick={onOpenAsign}
									>
										Assign a car to this driver
									</Button>
								)}
							</span>
						</span>
					</div>
				</div>
			</CardBody>
			<DriverDeleteModal
				page={page}
				onOpenChange={onOpenChange}
				openModal={isOpen}
				driver={driver}
			/>
			<DriverAsignCarModal
				driver={driver}
				onOpenChange={onOpenChangeAsign}
				openModal={openAsign}
				page={page}
			/>
		</Card>
	);
}
