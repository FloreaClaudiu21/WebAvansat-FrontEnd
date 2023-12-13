/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import { getCarImage } from "@/actions/getCarImageURL";
import { Car, CarBrand, Driver, User } from "@/types";
import {
	Button,
	Card,
	CardBody,
	CardHeader,
	CircularProgress,
	Divider,
	Skeleton,
	Tooltip,
	useDisclosure,
} from "@nextui-org/react";
import {
	CalendarIcon,
	GearIcon,
	Pencil2Icon,
	PersonIcon,
	StarFilledIcon,
	StarIcon,
	TrashIcon,
} from "@radix-ui/react-icons";
import Image from "next/image";
import useSWR, { mutate } from "swr";
import React from "react";
import FactoryIcon from "@mui/icons-material/Factory";
import CandlestickChartIcon from "@mui/icons-material/CandlestickChart";
import LocalGasStationIcon from "@mui/icons-material/LocalGasStation";
import NoteIcon from "@mui/icons-material/Note";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AddRoadIcon from "@mui/icons-material/AddRoad";
import CarDeleteModal from "./CarDeleteModal";
import CarUpdateModal from "./CarUpdateModal";
import { IsFavoriteCar } from "@/actions/isFavoriteCar";
import { FavoriteCar } from "@/actions/favoriteCar";
import { UnfavoriteCar } from "@/actions/unfavoriteCar";
import { useToast } from "../ui/use-toast";
import CarAsignDriverModal from "./CarAsignDriverModal";
import { GetDriverByCarID } from "@/actions/getDriverByCarId";
import { useFetch } from "@/hooks/useFetch";

export default function CarModel({
	car,
	user,
	page,
	brandsList,
}: {
	car: Car;
	user: User;
	page: number;
	brandsList: CarBrand[];
}) {
	const { toast } = useToast();
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		isOpen: isOpenAsign,
		onOpen: onOpenAsign,
		onOpenChange: onOpenChangeAsign,
	} = useDisclosure();
	const {
		isOpen: isOpenUpdate,
		onOpen: onOpenUpdate,
		onOpenChange: onOpenChangeUpdate,
	} = useDisclosure();
	const { data: carImage, isLoading } = useSWR(
		`api/fetchCarImage/${car.id}`,
		() => getCarImage({ car: car })
	);
	const {
		error,
		data: favoriteResponse,
		isLoading: isLoadingFavorite,
	} = useSWR(`api/cars/favorites/exists/${car.id}`, () =>
		IsFavoriteCar(car, user)
	);
	const {
		data: driverResponse,
		isLoading: isLoadingDriver,
	} = useSWR(`api/drivers/byCarId/${car.id}`, () => GetDriverByCarID(car));
	const driverCar = driverResponse?.data?.driver as Driver;
	const isFavorite =
		error || isLoadingFavorite ? false : favoriteResponse?.data?.isFavorite;
	const favoriteCar = async () => {
		const response = await FavoriteCar(car, user);
		if (response.error) {
			toast({
				variant: "destructive",
				title: "Favorite the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Favorite the company car completed!",
			description:
				"Car '" + car.plateNumber + "' have been added to the favorites list.",
		});
		mutate(`api/cars/favorites/exists/${car.id}`);
		mutate(`api/v1/favoriteCars?page=${1}`);
	};
	const unfavoriteCar = async () => {
		const response = await UnfavoriteCar(car, user);
		if (response.error) {
			toast({
				variant: "destructive",
				title: "Unfavorite the company car request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		toast({
			title: "Unfavorite the company car completed!",
			description:
				"Car '" +
				car.plateNumber +
				"' have been removed from the favorites list.",
		});
		mutate(`api/cars/favorites/exists/${car.id}`);
		mutate(`api/v1/favoriteCars?page=${1}`);
	};
	const deallocateDriver = async () => {
		const response = await useFetch({
			values: {},
			method: "PUT",
			path: "drivers/deallocate-car?driverID=" + driverCar.id,
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
			description: "Car '" + car.plateNumber + "' now does not have a driver.",
		});
		mutate(`api/v1/cars?page=${page}`);
		mutate(`api/drivers/byCarId/${car.id}`);
	};
	return (
		<Card isBlurred shadow="sm" className="min-w-[100px] w-full">
			<CardHeader className="relative pb-0">
				<div className="text-[22px] leading-[26px] font-bold capitalize">
					<h1 className="text-lg text-blue-600">
						{car.brand.manufacturer} {car.brand.model}
					</h1>
				</div>
				{brandsList.length > 0 && (
					<>
						<Tooltip content="Delete this car" placement="right-start">
							<Button
								isIconOnly
								color="danger"
								aria-label="Delete"
								onPress={onOpen}
								className="w-8 h-8 absolute top-2 right-2 min-w-0"
							>
								<TrashIcon className="w-5 h-5" />
							</Button>
						</Tooltip>
						<Tooltip content="Update this car" placement="right-start">
							<Button
								isIconOnly
								color="primary"
								aria-label="Update"
								onPress={onOpenUpdate}
								className="w-8 h-8 absolute top-2 right-12 min-w-0"
							>
								<Pencil2Icon className="w-5 h-5" />
							</Button>
						</Tooltip>
					</>
				)}
				<Tooltip
					placement="right-start"
					isDisabled={isLoadingFavorite}
					content={isFavorite ? "UnFavorite this car" : "Favorite this car"}
				>
					<Button
						isIconOnly
						color="secondary"
						aria-label="Favorite"
						onPress={() => (isFavorite ? unfavoriteCar() : favoriteCar())}
						className={
							brandsList.length > 0
								? "w-8 h-8 absolute top-2 right-[88px] min-w-0"
								: "w-8 h-8 absolute top-2 right-2 min-w-0"
						}
					>
						{isFavorite ? (
							<StarFilledIcon className="w-5 h-5" />
						) : (
							<StarIcon className="w-5 h-5" />
						)}
					</Button>
				</Tooltip>
			</CardHeader>
			<CardBody>
				<div className="relative w-full h-40 my-2 object-contain flex flex-col justify-center">
					{isLoading ? (
						<Skeleton className="w-full h-full rounded-lg">
							<div className="bg-default-200"></div>
						</Skeleton>
					) : (
						<Image
							fill
							priority
							src={carImage!}
							alt="car model"
							className="object-contain"
						/>
					)}
					<div
						className="flex justify-center place-items-center text-[8px] absolute right-1 top-1 h-8 w-8 shadow-md rounded-full border-2 border-gray-300"
						style={{ backgroundColor: car.color }}
					></div>
				</div>
				<Divider />
				<div className="flex flex-col text-sm py-2 ">
					<div className="flex flex-row place-items-start gap-2">
						<FactoryIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Manufacturer:</b> {car.brand.manufacturer}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<DirectionsCarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Model:</b> {car.brand.model}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<AddRoadIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Mileage:</b> {car.mileage} KM
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CalendarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Production year:</b> {car.brand.year}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<NoteIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Plate number:</b> {car.plateNumber}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CandlestickChartIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Transmission:</b> {car.transmission}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<LocalGasStationIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Fuel type:</b> {car.fuelType}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2">
						<CalendarIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Registration date:</b> {car.registrationDate}
						</span>
					</div>
					<div className="flex flex-row place-items-start gap-2 whitespace-break-spaces">
						<GearIcon className="min-w-[32px] max-w-[32px] h-4" />
						<span className="max-w-[calc(100%-32px)]">
							<b>Main Features:</b> {car.features}
						</span>
					</div>
					<Divider className="my-2" />
					{!isLoadingDriver ? (
						<div className="flex flex-row place-items-center gap-2">
							<PersonIcon className="min-w-[32px] max-w-[32px] h-4" />
							<span className="max-w-[calc(100%-32px)]">
								<b>Driven by: </b>
								<u>
									{driverCar ? (
										<span className="flex flex-row gap-2 justify-center place-items-center">
											{driverCar.firstName +
												" " +
												driverCar.lastName +
												" | " +
												driverCar.license.licenseNumber}
											<Tooltip content={"Remove this driver"}>
												<Button
													isIconOnly
													className="w-6 h-6 mx-0 px-0 bg-orange-300"
													onClick={deallocateDriver}
												>
													<TrashIcon className="text-white font-bold" />
												</Button>
											</Tooltip>
										</span>
									) : (
										<Button
											className="mt-2 text-primary-foreground bg-primary"
											onClick={onOpenAsign}
										>
											Assign a driver to this car
										</Button>
									)}
								</u>
							</span>
						</div>
					) : (
						<div className="flex flex-row justify-center place-content-center mt-4">
							<CircularProgress />
						</div>
					)}
				</div>
			</CardBody>
			<CarDeleteModal
				page={page}
				onOpenChange={onOpenChange}
				openModal={isOpen}
				car={car}
			/>
			<CarUpdateModal
				page={page}
				car={car}
				onOpenChange={onOpenChangeUpdate}
				openModal={isOpenUpdate}
				brandsList={brandsList}
			/>
			<CarAsignDriverModal
				car={car}
				onOpenChange={onOpenChangeAsign}
				openModal={isOpenAsign}
				page={page}
			/>
		</Card>
	);
}
