import { z } from "zod";

export const createSchema = z.object({
	phone: z.string(),
	birthDate: z.string(),
	lastName: z.string(),
	firstName: z.string(),
	issueDate: z.string(),
	categories: z.string(),
	expirationDate: z.string(),
	licenseNumber: z.string(),
});
