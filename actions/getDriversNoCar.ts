import { useFetch } from "@/hooks/useFetch";

export const GetDriversWithFirstNameNoCar = async (name: string) => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "drivers/byFirstNameNoCar?firstName=" + name,
		options: {
			revalidate: 3000,
			tags: ["driversWithNoCarFirstName"],
		},
	});
	return response;
};
