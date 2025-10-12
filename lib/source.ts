import { docs, bundles } from "@/.source";
import { loader } from "fumadocs-core/source";
import { icons } from "lucide-react";
import { createElement } from "react";

// See https://fumadocs.vercel.app/docs/headless/source-api for more info
// docs 문서를 위한 source
export const source = loader({
	// it assigns a URL to your pages
	baseUrl: "/docs",
	source: docs.toFumadocsSource(),
	icon(icon) {
		if (!icon) {
		  // You may set a default icon
		  return;
		}
		if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
	  },
});

// bundles 문서를 위한 별도 source
export const bundlesSource = loader({
	baseUrl: "/bundles",
	source: bundles.toFumadocsSource(),
	icon(icon) {
		if (!icon) {
		  // You may set a default icon
		  return;
		}
		if (icon in icons) return createElement(icons[icon as keyof typeof icons]);
	  },
});