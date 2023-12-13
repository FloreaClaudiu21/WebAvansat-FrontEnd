import { useFetch } from "@/hooks/useFetch";
import { Car } from "@/types";

export const GetDriverByCarID = async (car: Car) => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "drivers/byCarId?carId=" + car.id,
		options: {
			revalidate: 3000,
			tags: ["driversByCarID"],
		},
	});
	return response;
};
