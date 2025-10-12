import defaultMdxComponents from "fumadocs-ui/mdx";
import { icons } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { ImageZoom } from "fumadocs-ui/components/image-zoom";
import { Accordion, Accordions } from "fumadocs-ui/components/accordion";

// use this function to get MDX components, you will need it for rendering MDX
export function getMDXComponents(components?: MDXComponents): MDXComponents {
	return {
		...(icons as unknown as MDXComponents),
		...defaultMdxComponents,
		...components,
		Accordion,
		Accordions,
		img: (props: any) => <ImageZoom {...props} />,
	};
}
