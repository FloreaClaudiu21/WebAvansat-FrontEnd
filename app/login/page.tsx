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
import {
	Button,
	Checkbox,
	CircularProgress,
	Divider,
	Input,
} from "@nextui-org/react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginSchema } from "./schema";
import { useFetch } from "@/hooks/useFetch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { getCookie } from "cookies-next";

export default function Login() {
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
	const loginForm = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
	});
	const [showPassword, setShowPassword] = useState(false);
	async function onSubmit(values: z.infer<typeof loginSchema>) {
		setLoading(true);
		const response = await useFetch({
			path: "auth",
			values,
			method: "POST",
		});
		if (response.error) {
			setLoading(false);
			toast({
				variant: "destructive",
				title: "Login request failed!",
				description: "Error: " + response.data,
			});
			return;
		}
		const email = response.data.user?.email;
		toast({
			title: "Login request completed!",
			description:
				"User " +
				email +
				" have been logged in! Redirecting you to the main page...",
		});
		const expirationDate = new Date();
		if (values.keepLoggedIn) {
			expirationDate.setTime(
				expirationDate.getTime() + 2 * 24 * 60 * 60 * 1000
			);
		} else {
			expirationDate.setTime(expirationDate.getTime() + 2 * 60 * 60 * 1000);
		}
		const expires = `expires=${expirationDate.toUTCString()}`;
		document.cookie = `loggedIn=${email}; ${expires}; path=/`;
		setLoading(false);
		router.push("/main");
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
			<h1 className="text-center py-2 font-bold text-lg">Login Page</h1>
			<Divider />
			<Form {...loginForm}>
				<form
					onSubmit={loginForm.handleSubmit(onSubmit)}
					className="bg-gray-200 shadow-md shadow-[rgba(0,0,0,0.3)] flex mt-4 rounded-sm p-4 flex-col w-full justify-center place-items-center"
				>
					<div className="w-full space-y-4 flex flex-col">
						<FormField
							control={loginForm.control}
							name="email"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormLabel>Email:</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="test@gmail.com"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={loginForm.control}
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
					</div>
					<div className="flex flex-col w-full mt-4 space-y-2">
						<FormField
							control={loginForm.control}
							name="keepLoggedIn"
							render={({ field }) => (
								<FormItem className="w-full">
									<FormControl>
										<Checkbox
											checked={field.value}
											onValueChange={field.onChange}
										/>
									</FormControl>
									<FormLabel>Keep me logged in</FormLabel>
								</FormItem>
							)}
						/>
						<Link
							href={"/register"}
							className="text-center hover:underline hover:font-bold delay-75 ease-in-out transition-all"
						>
							Don&apos;t you have an account? Register here.
						</Link>
					</div>
					<Button
						type="submit"
						className="bg-black mt-4 text-white font-bold uppercase px-8"
					>
						Login
					</Button>
				</form>
			</Form>
		</div>
	);
}
