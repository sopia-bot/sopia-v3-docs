import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [
			new URL("http://kr-cdn.spooncast.net/**"),
			new URL("http://localhost:3000/**"),
			new URL("https://localhost:3000/**"),
			new URL("https://api.sopia.dev/**"),
		],
	},
	transpilePackages: ["next-mdx-remote"],
};

export default withMDX(config);
