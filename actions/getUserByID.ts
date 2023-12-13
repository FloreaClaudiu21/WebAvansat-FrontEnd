import { useFetch } from "@/hooks/useFetch";

export const UserByID = async (value: string) => {
	const response = await useFetch({
		path: "user/getByID?id=" + value,
		values: null,
		method: "GET",
		options: {
			revalidate: 500,
			tags: ["userByID"],
		},
	});
	return response;
};
