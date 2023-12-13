/* eslint-disable react-hooks/rules-of-hooks */
"use client";
import Logo from "../../public/logo.png";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Divider, Input } from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { registerSchema } from "./schema";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useFetch } from "@/hooks/useFetch";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { getCookie } from "cookies-next";

export default function Register() {
	const { toast } = useToast();
	const router = useRouter();
	// Check if user is already logged
	const email = getCookie("loggedIn");
	if (email) {
		router.push("/main");
		toast({
			title: "User logged in!",
			description: "You are logged in, redirecting you to the main page...",
		});
	}
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [showPassword1, setShowPassword1] = useState(false);
	const registerForm = useForm<z.infer<typeof registerSchema>>({
		resolver: zodResolver(registerSchema),
	});
	async function onSubmit(values: z.infer<typeof registerSchema>) {
		setLoading(true);
		const response = await useFetch({
			values,
			method: "POST",
			path: "register",
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Register request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		router.push("/login");
		toast({
			title: "Register request completed!",
			description:
				"User '" +
				response.data.user?.email +
				"' have been created! Redirecting you to the login page...",
		});
		setLoading(false);
	}
	return (
		<div className="flex flex-col p-4 py-8 mx-auto min-h-screen max-w-[764px] justify-center place-items-center">
			{loading ? (
				<div className="top-0 fixed flex flex-col justify-center place-items-center w-full min-h-screen h-full bg-[rgba(0,0,0,0.3)] z-50">
					<CircularProgress color="secondary" />
					<p>Loading...</p>
				</div>
			) : (
				<></>
			)}
			<div className="flex flex-col justify-center place-items-center mb-4">
				<Image
					src={Logo}
					width={300}
					height={300}
					alt="Logo image..."
					priority
				/>
			</div>
			<h1 className="text-center py-2 font-bold text-lg ">Register Page</h1>
			<Divider />
			<Form {...registerForm}>
				<form
					onSubmit={registerForm.handleSubmit(onSubmit)}
					className="bg-gray-200 shadow-md shadow-[rgba(0,0,0,0.3)] flex mt-4 rounded-sm p-4 flex-col w-full space-y-4 justify-center place-items-center"
				>
					<FormField
						name="userName"
						control={registerForm.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Username:</FormLabel>
								<FormControl>
									<Input placeholder="Enter your username..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="firstName"
						control={registerForm.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>FirstName:</FormLabel>
								<FormControl>
									<Input placeholder="Enter your firstname..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="lastName"
						control={registerForm.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>LastName:</FormLabel>
								<FormControl>
									<Input placeholder="Enter your lastname..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="phone"
						control={registerForm.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Phone:</FormLabel>
								<FormControl>
									<Input placeholder="Enter your phone number..." {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="birthDate"
						control={registerForm.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Birth Date:</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={registerForm.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Email:</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email address..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={registerForm.control}
						name="password"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Password:</FormLabel>
								<FormControl>
									<Input
										type={showPassword ? "text" : "password"}
										placeholder="Enter your password..."
										endContent={
											!showPassword ? (
												<EyeOpenIcon
													className="h-5 w-5 hover:cursor-pointer"
													onClick={() => setShowPassword((prev) => !prev)}
												/>
											) : (
												<EyeClosedIcon
													className="h-5 w-5 hover:cursor-pointer"
													onClick={() => setShowPassword((prev) => !prev)}
												/>
											)
										}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={registerForm.control}
						name="rePassword"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Re-Password:</FormLabel>
								<FormControl>
									<Input
										type={showPassword1 ? "text" : "password"}
										placeholder="Enter again your password..."
										endContent={
											!showPassword1 ? (
												<EyeOpenIcon
													className="h-5 w-5 hover:cursor-pointer"
													onClick={() => setShowPassword1((prev) => !prev)}
												/>
											) : (
												<EyeClosedIcon
													className="h-5 w-5 hover:cursor-pointer"
													onClick={() => setShowPassword1((prev) => !prev)}
												/>
											)
										}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Link
						href={"/login"}
						className="text-center hover:underline hover:font-bold delay-75 ease-in-out transition-all"
					>
						Already you have an account? Login here.
					</Link>
					<Button
						type="submit"
						className="bg-black text-white font-bold uppercase px-8"
					>
						REGISTER
					</Button>
				</form>
			</Form>
		</div>
	);
}
