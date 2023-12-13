import { Car } from "@/types";

export const getCarImage = async ({
	car,
	angle,
}: {
	car: Car;
	angle?: string;
}) => {
	const carPaint = await fetch(
		`https://cdn.imagin.studio/getPaints?&customer=hrjavascript-mastery&target=make&make=Camry`
	);
	const paintRes = await carPaint.json();
	const colorDesc = findTypeWithColor(paintRes.paintData, car.color);
	const carImage = await generateCarImageUrl(
		car,
		angle,
		colorDesc?.id,
		colorDesc?.desc
	);
	return carImage;
};

export function findTypeWithColor(paintData: any, colorToFind: string) {
	for (const combinationKey in paintData.paintCombinations) {
		const paintCombination = paintData.paintCombinations[combinationKey];
		for (const imageKey in paintCombination) {
			const carImage = paintCombination[imageKey];
			for (const key in carImage) {
				const paintDat = carImage[key];
				if (
					paintDat.paintDescription != null &&
					paintDat.paintDescription.toLowerCase().includes(colorToFind)
				) {
					return { id: key, desc: paintDat.paintDescription };
				}
			}
		}
	}
	return null;
}

export const generateCarImageUrl = (
	car: Car,
	angle?: string,
	paintId?: string,
	colorDesc?: string
) => {
	const { brand } = car;
	const url = new URL("https://cdn.imagin.studio/getimage");
	//////////////////////////////////////////////////////////
	url.searchParams.append("customer", "hrjavascript-mastery");
	url.searchParams.append("make", `${brand.manufacturer}`);
	url.searchParams.append("modelFamily", `${brand.model}`);
	url.searchParams.append("zoomType", "fullscreen");
	url.searchParams.append("modelYear", `${brand.year}`);
	url.searchParams.append("angle", `${angle}`);
	url.searchParams.append("paintId", `${paintId}`);
	url.searchParams.append("paintdescription", `${colorDesc}`);
	return `${url}`;
};
