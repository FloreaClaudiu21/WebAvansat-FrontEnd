import { useFetch } from "@/hooks/useFetch";
import { Car, User } from "@/types";

export const UnfavoriteCar = async (car: Car, user: User) => {
	const response = await useFetch({
		values: {},
		method: "DELETE",
		path: "cars/favorites/delete?carID=" + car.id + "&userID=" + user.id,
	});
	return response;
};
