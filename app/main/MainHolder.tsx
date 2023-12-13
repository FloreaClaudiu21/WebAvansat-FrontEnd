"use client";
import CarsHolder from "@/components/cars/CarsHolder";
import FavoriteCarsHolder from "@/components/cars/FavoriteCarsHolder";
import DriversHolder from "@/components/drivers/DriversHolder";
import { User } from "@/types";
import { useSearchParams } from "next/navigation";
import React from "react";

export default function MainHolder({ user }: { user: User }) {
	const params = useSearchParams();
	const pageView = params.get("view")?.toLowerCase();
	if (!pageView) {
		return <CarsHolder user={user} />;
	}
	switch (pageView) {
		case "cars":
			return <CarsHolder user={user} />;
		case "drivers":
			return <DriversHolder user={user} />;
		case "favoritecars":
			return <FavoriteCarsHolder user={user} />;
	}
}
