import { useFetch } from "@/hooks/useFetch";

export const GetCarsBrands = async () => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path: "cars/brands",
		options: {
			revalidate: 3500,
			tags: ["carsBrands"],
		},
	});
	return response;
};
