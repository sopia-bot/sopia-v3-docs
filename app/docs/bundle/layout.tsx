import { baseOptions } from "@/app/layout.config";
import { source } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { ReactNode } from "react";
import { BundleSidebar } from "./bundle-sidebar";

// bundle 경로를 위한 커스텀 레이아웃
export default function BundleLayout({ children }: { children: ReactNode }) {
	console.log("source", source.pageTree);
	return (
		<DocsLayout
			tree={source.pageTree} // 기존 메뉴 유지
			{...baseOptions}
		>
			{/* bundle 문서 전용 헤더 */}
			<div className="bundle-header mb-6">
				<h1 className="text-2xl font-bold mb-2">번들 문서</h1>
				<p className="text-sm text-gray-500 dark:text-gray-400">
					서버에서 동적으로 로드되는 번들 문서입니다.
				</p>
			</div>
			{children}
		</DocsLayout>
	);
}
