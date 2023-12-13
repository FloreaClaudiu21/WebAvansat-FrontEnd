"use client";
import { Car, CarBrand, User } from "@/types";
import React, { useState } from "react";
import CarModel from "./CarModel";
import {
	Button,
	CircularProgress,
	Input,
	Pagination,
	useDisclosure,
} from "@nextui-org/react";
import useSWR, { mutate } from "swr";
import { PlusIcon } from "@radix-ui/react-icons";
import SearchIcon from "@mui/icons-material/Search";
import CarCreateModal from "./CarCreateModal";
import { GetCarsWithPageAndPlateNumber } from "@/actions/getCars";
import { GetCarsBrands } from "@/actions/getCarsBrands";

export default function CarsHolder({ user }: { user: User }) {
	const [page, setPage] = useState(1);
	const [lastSearch, setLastSearch] = useState("");
	const [plateNumber, setPlateNumber] = useState("");
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		error,
		isLoading,
		data: carsResponse,
	} = useSWR(`api/v1/cars?page=${page}`, () =>
		GetCarsWithPageAndPlateNumber(page + "", plateNumber)
	);
	const {
		data: carsBrands,
		error: errorBrands,
		isLoading: loadingBrands,
	} = useSWR(`api/v1/cars/brands`, () => GetCarsBrands());
	/////////////////////////////////////////////////////////
	const curPage: number = carsResponse?.data.success
		? carsResponse?.data.curPage
		: 1;
	const maxPages: number = carsResponse?.data.success
		? carsResponse?.data.maxPages
		: 1;
	const brandsList = carsBrands?.data?.brands as CarBrand[];
	const carsList = carsResponse?.data?.cars?.data as Car[];
	/////////////////////////////////////////////////////////
	const hasCars = carsList?.length > 0;
	const hasError =
		error ||
		carsResponse?.error ||
		carsResponse?.data == undefined ||
		errorBrands ||
		carsBrands?.error ||
		carsBrands?.data == undefined;
	return (
		<div className="flex flex-col px-4 py-4 mx-auto min-h-screen max-w-[1536px] gap-3">
			<div className="flex flex-row gap-4 place-items-center">
				<h2 className="text-md font-bold underline md:text-lg lg:text-xl">
					Company Cars (Page {curPage}/{maxPages}):
				</h2>
				<Button
					isIconOnly
					color="success"
					className="h-6 w-6 shadow-sm"
					onPress={onOpen}
					disabled={isLoading || loadingBrands}
				>
					<PlusIcon className="w-4 h-4 text-white font-bold" />
				</Button>
			</div>
			<div className="flex flex-row gap-4 place-items-center">
				<Input
					type="text"
					key={"primary"}
					value={plateNumber}
					label="Plate number"
					disabled={isLoading || hasError}
					placeholder="Search for the car's plate number..."
					onChange={(ev) => setPlateNumber(ev.currentTarget.value)}
				/>
				<Button
					color="primary"
					disableRipple={hasError}
					disableAnimation={hasError}
					endContent={<SearchIcon />}
					onClick={() => {
						if (lastSearch == plateNumber) {
							return;
						}
						setLastSearch(plateNumber);
						mutate(`api/v1/cars?page=${page}`);
					}}
					disabled={isLoading || hasError}
					className="disabled:bg-gray-500 shadow-md"
				>
					Search
				</Button>
			</div>
			{isLoading || loadingBrands ? (
				<>
					<CircularProgress
						size="lg"
						className="mt-6 col-span-full min-w-full flex justify-center"
					/>
					<p className="text-md text-center">Loading cars data...</p>
				</>
			) : (
				<div
					className={
						!hasCars
							? "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center place-items-center"
							: "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
					}
				>
					{!hasError ? (
						hasCars ? (
							carsList.map((car: Car, index: number) => {
								return (
									<CarModel
										key={index}
										car={car}
										page={page}
										user={user}
										brandsList={brandsList}
									/>
								);
							})
						) : (
							<p className="col-span-full text-sm max-w-xl text-center">
								No cars have been found!
							</p>
						)
					) : (
						<p className="col-span-full text-sm max-w-xl text-red-500 text-center">
							❌ Error while trying to load the cars. Exception:{" "}
							{carsResponse?.data + ""}
						</p>
					)}
				</div>
			)}
			{!hasError && !isLoading && !loadingBrands && hasCars && (
				<Pagination
					showShadow
					page={page}
					color="primary"
					initialPage={1}
					total={maxPages}
					onChange={setPage}
					className="w-full flex place-content-end mt-2 mx-0 px-0"
				/>
			)}
			<CarCreateModal
				page={page}
				brandsList={brandsList}
				onOpenChange={onOpenChange}
				openModal={isOpen}
			/>
		</div>
	);
}
