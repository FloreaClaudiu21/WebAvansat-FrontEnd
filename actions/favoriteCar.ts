import { useFetch } from "@/hooks/useFetch";
import { Car, User } from "@/types";

export const FavoriteCar = async (car: Car, user: User) => {
	const response = await useFetch({
		values: {},
		method: "POST",
		path: "cars/favorites/create?carID=" + car.id + "&userID=" + user.id,
	});
	return response;
};
