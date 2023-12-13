import { useFetch } from "@/hooks/useFetch";

export const GetDriversWithFirstName = async (page: string, name: string) => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "drivers/byFirstName?page=" + page + "&firstName=" + name,
		options: {
			revalidate: 3000,
			tags: ["driversWithFirstName"],
		},
	});
	return response;
};
