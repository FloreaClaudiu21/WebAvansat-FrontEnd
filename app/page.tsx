import { cookies } from "next/headers";
import { getCookie } from "cookies-next";
import { redirect } from "next/navigation";

export default async function Home() {
	const email = getCookie("loggedIn", { cookies });
	!email ? redirect("/login") : redirect("/main");
}
