/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.imagin.studio",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "www.shareicon.net",
				port: "",
				pathname: "/**",
			},
			{
				protocol: "https",
				hostname: "cdn-icons-png.flaticon.com",
				port: "",
				pathname: "/**",
			},
		],
	},
};

module.exports = nextConfig;
