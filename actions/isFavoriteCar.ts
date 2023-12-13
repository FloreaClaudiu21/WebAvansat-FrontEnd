import { useFetch } from "@/hooks/useFetch";
import { Car, User } from "@/types";

export const IsFavoriteCar = async (car: Car, user: User) => {
	const response = await useFetch({
		values: {},
		method: "PUT",
		path: "cars/favorites/exists?carID=" + car.id + "&userID=" + user.id,
	});
	return response;
};
