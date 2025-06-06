import { createMDX } from "fumadocs-mdx/next";

const withMDX = createMDX();

/** @type {import('next').NextConfig} */
const config = {
	reactStrictMode: true,
	images: {
		remotePatterns: [new URL("http://kr-cdn.spooncast.net/**")],
	},
	transpilePackages: ["next-mdx-remote"],
};

export default withMDX(config);
