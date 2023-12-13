"use client";
import React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Logo from "../../public/logo.png";
import {
	Avatar,
	Divider,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	NavbarMenu,
	NavbarMenuItem,
	NavbarMenuToggle,
} from "@nextui-org/react";
import { MenuLinks, User } from "@/types";
import { deleteCookie } from "cookies-next";
import { toast } from "../ui/use-toast";

export default function NavbarPage({ user }: { user: User }) {
	const redirect = useRouter();
	const router = useSearchParams();
	const pageView = router.get("view");
	const [isMenuOpen, setIsMenuOpen] = React.useState(false);
	function LogOut() {
		deleteCookie("loggedIn");
		redirect.push("/login");
		toast({
			title: "Logged out!",
			description:
				"You logged out from the account, redirecting to the login page...",
		});
	}
	const isActive = (title: string) => {
		if (!pageView && title == "Cars") {
			return true;
		}
		return pageView === title.replace(" ", "");
	};
	return (
		<Navbar
			disableAnimation
			isBordered
			maxWidth="2xl"
			className="h-16"
			onMenuOpenChange={setIsMenuOpen}
		>
			<NavbarContent>
				<NavbarMenuToggle
					className="md:hidden"
					aria-label={isMenuOpen ? "Close menu" : "Open menu"}
				/>
				<NavbarBrand>
					<Link href={"/main"} className="w-full">
						<Image
							width={64}
							height={32}
							src={Logo}
							alt="No img"
							priority
							className="object-fill max-h-9"
						/>
					</Link>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="hidden md:flex gap-4 flex-1" justify="start">
				{MenuLinks.map(({ title, href }) => {
					return (
						<NavbarItem key={title}>
							<Link
								key={title}
								href={href}
								style={{
									color: isActive(title) ? "blue" : "",
									fontWeight: isActive(title) ? 800 : 500,
								}}
								className="w-full hover:underline hover:font-bold"
							>
								{title}
							</Link>
						</NavbarItem>
					);
				})}
			</NavbarContent>
			<NavbarContent as="div" justify="end">
				<Dropdown placement="bottom-end">
					<DropdownTrigger>
						<Avatar
							size="sm"
							isBordered
							as="button"
							color="secondary"
							name={user.userName}
							className="transition-transform shadow-md shadow-black"
							src="https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes-thumbnail.png"
						/>
					</DropdownTrigger>
					<DropdownMenu aria-label="Profile Actions" variant="flat">
						<DropdownItem key="profile" className="h-4 gap-2">
							{user.firstName} {user.lastName}
						</DropdownItem>
						<DropdownItem key="profile1" className="h-4 gap-2">
							Username: <span className="font-semibold">@{user.userName}</span>
						</DropdownItem>
						<DropdownItem key="profile2" className="h-14 gap-2">
							<p className="font-semibold">Signed in as:</p>
							<p className="font-semibold">{user.email}</p>
						</DropdownItem>
						<DropdownItem key="settings">My Settings</DropdownItem>
						<DropdownItem
							key="logout"
							color="danger"
							onClick={() => {
								LogOut();
							}}
						>
							Log Out
						</DropdownItem>
					</DropdownMenu>
				</Dropdown>
			</NavbarContent>
			<NavbarMenu className="md:hidden">
				{MenuLinks.map(({ title, href }) => (
					<NavbarMenuItem key={`${title}-${href}`}>
						<Link
							style={{
								color: pageView === title.replace(" ", "") ? "blue" : "",
								fontWeight: pageView === title.replace(" ", "") ? 800 : 400,
							}}
							className="w-full hover:underline hover:font-bold"
							href={href}
						>
							{title}
						</Link>
					</NavbarMenuItem>
				))}
				<span
					className="text-red-600 font-bold hover:cursor-pointer hover:font-extrabold"
					onClick={() => {
						LogOut();
					}}
				>
					Log Out
				</span>
				<NavbarContent
					justify="end"
					className="flex-1 border-t-2 flex-col place-items-center justify-center"
				>
					<NavbarItem className="w-full flex flex-row gap-2 place-items-center justify-items-center">
						<Avatar />
						<div className="flex flex-col">
							<span className="font-normal">
								{user.firstName} {user.lastName}{" "}
							</span>
							<span className="font-bold text-blue-700">@{user.userName}</span>
						</div>
					</NavbarItem>
					<Divider />
					<NavbarItem key="profile2" className="w-full h-14 gap-2">
						<p className="font-semibold">Signed in as:</p>
						<p className="font-semibold">{user.email}</p>
					</NavbarItem>
				</NavbarContent>
			</NavbarMenu>
		</Navbar>
	);
}
