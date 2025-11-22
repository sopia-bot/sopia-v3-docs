import { baseOptions } from "@/app/layout.config";
import { HomeLayout } from "fumadocs-ui/layouts/home";
import type { ReactNode } from "react";

interface LayoutProps {
	children: ReactNode;
	params: Promise<{ slug: string[] }>;
}

export default async function Layout({ children, params }: LayoutProps) {
	return (
		<HomeLayout {...baseOptions}>
			{children}
		</HomeLayout>
	);
}
