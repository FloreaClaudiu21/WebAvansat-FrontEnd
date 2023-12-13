import * as z from "zod";

const isStrongPassword = (password: string) => {
	try {
		const hasUpperCase = /[A-Z]/.test(password);
		const hasLowerCase = /[a-z]/.test(password);
		const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		const hasMinLength = password.length >= 8;
		return hasUpperCase && hasLowerCase && hasSpecialCharacter && hasMinLength;
	} catch (e) {
		return false;
	}
};

export const registerSchema = z
	.object({
		email: z
			.string()
			.min(5)
			.max(80)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		birthDate: z.string(),
		phone: z
			.string()
			.min(4)
			.max(13)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		firstName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		lastName: z
			.string()
			.min(4)
			.max(120)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		userName: z
			.string()
			.min(4)
			.max(100)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		password: z
			.string()
			.min(8)
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
		rePassword: z
			.string()
			.refine((value) => (typeof value === "string" ? value.trim() : value)),
	})
	.refine((data) => data.rePassword === data.password, {
		message: "Passwords must match",
		path: ["rePassword"],
	})
	.refine((data) => isStrongPassword(data.password), {
		message:
			"Password must be strong (include uppercase, lowercase, special characters, and be at least 8 characters long)",
		path: ["password"],
	});
