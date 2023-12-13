import { z } from "zod";

export const createSchema = z.object({
	year: z.string(),
	model: z.string(),
	manufacturer: z.string(),
	mileage: z.string(),
	color: z.string(),
	fuelType: z
		.string()
		.refine((value) => value.length >= 4 && value.length <= 20, {
			message: "Fuel type must be between 4 and 20 characters.",
		}),
	plateNumber: z
		.string()
		.refine((value) => value.length >= 5 && value.length <= 20, {
			message: "Plate number must be between 5 and 20 characters.",
		}),
	transmission: z
		.string()
		.refine((value) => value.length >= 4 && value.length <= 20, {
			message: "Transmission must be between 4 and 20 characters.",
		}),
	features: z.string(),
	registrationDate: z.string(),
	car_brands_id: z.number(),
});

export const updateSchema = z.object({
	year: z.string(),
	model: z.string(),
	manufacturer: z.string(),
	mileage: z.string(),
	color: z.string(),
	fuelType: z
		.string()
		.refine((value) => value.length >= 4 && value.length <= 20, {
			message: "Fuel type must be between 4 and 20 characters.",
		}),
	plateNumber: z
		.string()
		.refine((value) => value.length >= 5 && value.length <= 20, {
			message: "Plate number must be between 5 and 20 characters.",
		}),
	transmission: z
		.string()
		.refine((value) => value.length >= 4 && value.length <= 20, {
			message: "Transmission must be between 4 and 20 characters.",
		}),
	features: z.string(),
	registrationDate: z.string(),
	car_brands_id: z.number(),
});
