import { useFetch } from "@/hooks/useFetch";

export const GetCarsWithPageAndPlateNumber = async (
	page: string,
	plate: string
) => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "cars/byPlateNumber?page=" + page + "&plateNumber=" + plate,
		options: {
			revalidate: 3000,
			tags: ["carsWithPlatePage"],
		},
	});
	return response;
};
