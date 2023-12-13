import { FetchRequest, FetchResponse, NextOptions } from "@/types";
const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const useFetch = async ({
	path,
	values,
	method,
	options,
}: {
	values: any;
	path: string;
	method: string;
	options?: NextOptions;
}): Promise<FetchResponse> => {
	try {
		let response = null;
		if (method == "GET") {
			response = await fetch(BASE_URL + path, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				cache: options?.cache,
				next: {
					tags: options?.tags,
					revalidate: options?.revalidate,
				},
			});
		} else {
			response = await fetch(BASE_URL + path, {
				method: method,
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(values),
				cache: options?.cache,
				next: {
					tags: options?.tags,
					revalidate: options?.revalidate,
				},
			});
		}
		const a = await response.json();
		const data: FetchRequest = a;
		if (data.success) {
			return {
				data: data,
				error: false,
			};
		}
		return {
			data: data.error,
			error: true,
		};
	} catch (e) {
		return { error: true, data: e };
	}
};
