import React from "react";
import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";
import { UserByEmail } from "@/actions/getUserByEmail";
import Navbar from "@/components/navbar/navbar";
import { User } from "@/types";
import Footer from "@/components/navbar/footer";
import MainHolder from "./MainHolder";

export default async function Main() {
	const email = getCookie("loggedIn", { cookies });
	if (!email) {
		redirect("/login");
	}
	const response = await UserByEmail(email);
	if (response.error) {
		redirect("/login");
	}
	const user = response.data.user as User;
	if (!user) {
		redirect("/login");
	}
	return (
		<>
			<Navbar user={user} />
			<MainHolder user={user} />
			<Footer />
		</>
	);
}
