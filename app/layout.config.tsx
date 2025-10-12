import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { BookIcon, PuzzleIcon } from "lucide-react";

/**
 * Shared layout configurations
 *
 * you can customise layouts individually from:
 * Home Layout: app/(home)/layout.tsx
 * Docs Layout: app/docs/layout.tsx
 */
export const baseOptions: BaseLayoutProps = {
	nav: {
		title: (
			<>
				<img src="/v3-icon.png" alt="SOPIAv3" className="w-7 h-7" />
				SOPIAv3
			</>
		),
	},
	// see https://fumadocs.dev/docs/ui/navigation/links
	links: [
		{
			icon: <BookIcon />,
			url: "/docs",
			text: "사용법",
			secondary: false,
		},
		{
			icon: <PuzzleIcon />,
			url: "/bundles",
			text: "번들",
			secondary: false,
		},
	],
};
