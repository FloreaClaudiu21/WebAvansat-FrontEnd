"use client";
import { Car, User } from "@/types";
import React, { useState } from "react";
import CarModel from "./CarModel";
import { Button, CircularProgress, Input, Pagination } from "@nextui-org/react";
import useSWR, { mutate } from "swr";
import SearchIcon from "@mui/icons-material/Search";
import { GetCarsFavoriteWithPageAndPlateNumber } from "@/actions/getCarsFavorite";

export default function FavoriteCarsHolder({ user }: { user: User }) {
	const [page, setPage] = useState(1);
	const [lastSearch, setLastSearch] = useState("");
	const [plateNumber, setPlateNumber] = useState("");
	const {
		error,
		isLoading,
		data: carsResponse,
	} = useSWR(`api/v1/favoriteCars?page=${page}`, () =>
		GetCarsFavoriteWithPageAndPlateNumber(user, page + "", plateNumber)
	);
	const curPage: number = carsResponse?.data.success
		? carsResponse?.data.curPage
		: 1;
	const maxPages: number = carsResponse?.data.success
		? carsResponse?.data.maxPages
		: 1;
	const carsFavoriteList = carsResponse?.data?.favoriteCars?.data as Car[];
	/////////////////////////////////////////////////////////////////////////
	const hasFavoriteCars = carsFavoriteList?.length > 0;
	const hasError =
		error || carsResponse?.error || carsResponse?.data == undefined;
	return (
		<div className="flex flex-col px-4 py-4 mx-auto min-h-screen max-w-[1536px] gap-3">
			<div className="flex flex-row gap-4 place-items-center">
				<h2 className="text-md font-bold underline md:text-lg lg:text-xl">
					Favorite Company Cars (Page {curPage}/{maxPages}):
				</h2>
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
						mutate(`api/v1/favoriteCars?page=${page}`);
					}}
					disabled={isLoading || hasError}
					className="disabled:bg-gray-500 shadow-md"
				>
					Search
				</Button>
			</div>
			{isLoading ? (
				<>
					<CircularProgress
						size="lg"
						className="mt-6 col-span-full min-w-full flex justify-center"
					/>
					<p className="text-md text-center">Loading favorite cars data...</p>
				</>
			) : (
				<div
					className={
						!hasFavoriteCars
							? "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center place-items-center"
							: "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
					}
				>
					{!hasError ? (
						hasFavoriteCars ? (
							carsFavoriteList.map((car: Car, index: number) => {
								return (
									<CarModel
										key={index}
										car={car}
										page={page}
										user={user}
										brandsList={[]}
									/>
								);
							})
						) : (
							<p className="col-span-full text-sm max-w-xl text-center">
								No favorite cars have been found, start by staring some cars!
							</p>
						)
					) : (
						<p className="col-span-full text-sm max-w-xl text-red-500 text-center">
							❌ Error while trying to load the favorite cars. Exception:{" "}
							{carsResponse?.data + ""}
						</p>
					)}
				</div>
			)}
			{!hasError && !isLoading && hasFavoriteCars && (
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
		</div>
	);
}
