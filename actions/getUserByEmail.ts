import { useFetch } from "@/hooks/useFetch";

export const UserByEmail = async (value: string) => {
	const response = await useFetch({
		path: "user/getByEmail?email=" + value,
		values: null,
		method: "GET",
		options: {
			revalidate: 500,
			tags: ["userByEmail"],
		},
	});
	return response;
};
