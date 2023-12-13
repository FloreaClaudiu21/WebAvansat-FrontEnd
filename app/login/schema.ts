import * as z from "zod";

export const loginSchema = z.object({
	password: z.string().min(4),
	email: z.string().min(5).max(80),
	keepLoggedIn: z.boolean().default(false).optional(),
});
