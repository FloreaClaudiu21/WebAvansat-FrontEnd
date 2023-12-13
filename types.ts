export type FetchRequest = {
	user?: User;
	error: string;
	success: boolean;
};

export type FetchResponse = {
	data: any;
	error: boolean;
};

export type NextOptions = {
	tags: string[];
	revalidate: number;
	cache?: RequestCache;
};

////////////////////////////

const MenuLinks: { title: string; href: string }[] = [
	{
		title: "Cars",
		href: "/main?view=Cars",
	},
	{
		title: "Drivers",
		href: "/main?view=Drivers",
	},
	{
		title: "Favorite Cars",
		href: "/main?view=FavoriteCars",
	},
];

/////////////////////////////

export type User = {
	id: number;
	email: string;
	phone: string;
	birthDate: string;
	userName: string;
	lastName: string;
	firstName: string;
};

export type Driver = User & {
	car: Car;
	license: {
		categories: string;
		issueDate: string;
		licenseNumber: string;
		expirationDate: string;
	};
};

//////////////////////////////

export type Car = {
	id: number;
	driver?: Driver;
	brand: CarBrand;
	mileage: number;
	color: CarColor;
	fuelType: string;
	plateNumber: string;
	transmission: string;
	features: string;
	registrationDate: string;
};

export type CarBrand = {
	id: number;
	year: number;
	model: string;
	manufacturer: string;
};

enum CarColor {
	White = "White",
	Black = "Black",
	Silver = "Silver",
	Gray = "Gray",
	Red = "Red",
	Blue = "Blue",
	Green = "Green",
	Yellow = "Yellow",
	Orange = "Orange",
	Brown = "Brown",
	Purple = "Purple",
	Pink = "Pink",
}

export const CarColorsList = Object.keys(CarColor).map((color) => ({
	label: CarColor[color as keyof typeof CarColor],
	value: color,
}));

enum CarFeature {
	LaneDepartureWarning = "Lane Departure Warning",
	CollisionAvoidanceSystem = "Collision Avoidance System",
	AdaptiveCruiseControl = "Adaptive Cruise Control",
	BlindSpotMonitoring = "Blind Spot Monitoring",
	ParkingAssistance = "Parking Assistance",
	AppleCarPlay = "Apple CarPlay",
	AndroidAuto = "Android Auto",
	BluetoothConnectivity = "Bluetooth Connectivity",
	BackupCamera = "Backup Camera",
	ThreeSixtyDegreeCamera = "360-Degree Camera",
	KeylessEntry = "Keyless Entry",
	PushButtonStart = "Push Button Start",
	LeatherSeats = "Leather Seats",
	HeatedSeats = "Heated Seats",
	PanoramicSunroof = "Panoramic Sunroof",
	NavigationSystem = "Navigation System",
	PremiumAudioSystem = "Premium Audio System",
	WirelessCharging = "Wireless Charging",
	AutomaticEmergencyBraking = "Automatic Emergency Braking",
	RainSensingWipers = "Rain-Sensing Wipers",
	LEDHeadlights = "LED Headlights",
	SmartphoneIntegration = "Smartphone Integration",
	RemoteStart = "Remote Start",
	DualZoneClimateControl = "Dual-zone Climate Control",
	PowerLiftgate = "Power Liftgate",
	MemorySeats = "Memory Seats",
	VentilatedSeats = "Ventilated Seats",
	HeatedSteeringWheel = "Heated Steering Wheel",
	AutoDimmingRearviewMirror = "Auto-dimming Rearview Mirror",
	LaneKeepAssist = "Lane Keep Assist",
	TrafficSignRecognition = "Traffic Sign Recognition",
	RearCrossTrafficAlert = "Rear Cross-Traffic Alert",
	HandsFreeLiftgate = "Hands-Free Liftgate",
	MultiZoneClimateControl = "Multi-zone Climate Control",
	AmbientLighting = "Ambient Lighting",
	DriverAssistancePackage = "Driver Assistance Package",
	WiFiHotspot = "Wi-Fi Hotspot",
	ThirdRowSeating = "Third-row Seating",
	CooledGlovebox = "Cooled Glovebox",
	AutoParkingSystem = "Auto Parking System",
	TeenDriverTechnology = "Teen Driver Technology",
	PowerFoldingMirrors = "Power-folding Mirrors",
	DualExhaustSystem = "Dual Exhaust System",
}

export const CarFeaturesList = Object.keys(CarFeature).map((feat) => ({
	label: CarFeature[feat as keyof typeof CarFeature],
	value: feat,
}));

export { MenuLinks, CarFeature, CarColor };
