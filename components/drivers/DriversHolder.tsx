"use client";
import { Driver, User } from "@/types";
import React, { useState } from "react";
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
import { GetDriversWithFirstName } from "@/actions/getDrivers";
import DriverCreateModal from "./DriverCreateModal";
import DriverModel from "./DriverModel";

export default function DriversHolder({ user }: { user: User }) {
	const [page, setPage] = useState(1);
	const [fname, setFirstName] = useState("");
	const [lastSearch, setLastSearch] = useState("");
	const { isOpen, onOpen, onOpenChange } = useDisclosure();
	const {
		error,
		isLoading,
		data: driversResponse,
	} = useSWR(`api/v1/drivers?page=${page}`, () =>
		GetDriversWithFirstName(page + "", fname)
	);
	/////////////////////////////////////////////
	const curPage: number = driversResponse?.data.success
		? driversResponse?.data.curPage
		: 1;
	const maxPages: number = driversResponse?.data.success
		? driversResponse?.data.maxPages
		: 1;
	const driversList = driversResponse?.data?.drivers?.data as Driver[];
	/////////////////////////////////////////////////////////////////////
	const hasDrivers = driversList?.length > 0;
	const hasError =
		error || driversResponse?.error || driversResponse?.data == undefined;
	return (
		<div className="flex flex-col px-4 py-4 mx-auto min-h-screen max-w-[1536px] gap-3">
			<div className="flex flex-row gap-4 place-items-center">
				<h2 className="text-md font-bold underline md:text-lg lg:text-xl">
					Company Drivers (Page {curPage}/{maxPages}):
				</h2>
				<Button
					isIconOnly
					color="success"
					className="h-6 w-6 shadow-sm"
					onPress={onOpen}
					disabled={isLoading}
				>
					<PlusIcon className="w-4 h-4 text-white font-bold" />
				</Button>
			</div>
			<div className="flex flex-row gap-4 place-items-center">
				<Input
					type="text"
					key={"primary"}
					value={fname}
					label="First name"
					disabled={isLoading || hasError}
					placeholder="Search for the drivers first name..."
					onChange={(ev) => setFirstName(ev.currentTarget.value)}
				/>
				<Button
					color="primary"
					disableRipple={hasError}
					disableAnimation={hasError}
					endContent={<SearchIcon />}
					onClick={() => {
						if (lastSearch == fname) {
							return;
						}
						setLastSearch(fname);
						mutate(`api/v1/drivers?page=${page}`);
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
					<p className="text-md text-center">Loading drivers data...</p>
				</>
			) : (
				<div
					className={
						!hasDrivers
							? "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center place-items-center"
							: "mt-4 gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center"
					}
				>
					{!hasError ? (
						hasDrivers ? (
							driversList.map((driver: Driver, index: number) => {
								return (
									<DriverModel
										key={driver.id}
										driver={driver}
										page={page}
										user={user}
									/>
								);
							})
						) : (
							<p className="col-span-full text-sm max-w-xl text-center">
								No drivers have been found!
							</p>
						)
					) : (
						<p className="col-span-full text-sm max-w-xl text-red-500 text-center">
							❌ Error while trying to load the drivers. Exception:{" "}
							{driversResponse?.data + ""}
						</p>
					)}
				</div>
			)}
			{!hasError && !isLoading && hasDrivers && (
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
			<DriverCreateModal
				page={page}
				onOpenChange={onOpenChange}
				openModal={isOpen}
			/>
		</div>
	);
}
