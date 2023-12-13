import { useFetch } from "@/hooks/useFetch";

export const GetCarsWithNoDriver = async () => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "cars/noDriver",
		options: {
			revalidate: 3000,
			tags: ["carsWithNoDriver"],
		},
	});
	return response;
};
