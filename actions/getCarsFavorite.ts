import { useFetch } from "@/hooks/useFetch";
import { User } from "@/types";

export const GetCarsFavoriteWithPageAndPlateNumber = async (
	user: User,
	page: string,
	plate: string
) => {
	const response = await useFetch({
		values: null,
		method: "GET",
		path:
			"cars/favorites?page=" +
			page +
			"&plateNumber=" +
			plate +
			"&userID=" +
			user.id,
		options: {
			revalidate: 3000,
			tags: ["carsFavWithPlatePage"],
		},
	});
	return response;
};
