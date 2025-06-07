import { getMDXComponents } from "@/mdx-components";
import {
	DocsBody,
	DocsDescription,
	DocsPage,
	DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getTableOfContents } from "fumadocs-core/server";
import { compileMDX } from "next-mdx-remote/rsc";

// 서버에서 MDX 파일을 가져오는 함수
async function fetchMDXContent(name: string) {
	try {
		// 내부 API 엔드포인트를 사용하여 MDX 콘텐츠 가져오기
		const apiUrl = `/api/mdx/${name}`;

		console.log("name", name);

		// 서버에서 MDX 콘텐츠 가져오기
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL || ""}${apiUrl}`,
			{
				next: { revalidate: 60 }, // 60초마다 재검증 (필요에 따라 조정)
			},
		);

		if (!response.ok) {
			throw new Error(`Failed to fetch MDX: ${response.statusText}`);
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("MDX 콘텐츠를 가져오는 중 오류 발생:", error);
		return null;
	}
}

export default async function BundlePage({
	params,
}: {
	params: { name: string };
}) {
	// URL에서 name 파라미터 가져오기
	const { name } = params;

	// 서버에서 MDX 콘텐츠 가져오기
	const mdxData = await fetchMDXContent(name);

	// 데이터가 없으면 404 페이지 표시
	if (!mdxData) notFound();

	// MDX 콘텐츠 컴파일
	const { content } = await compileMDX({
		source: mdxData.content,
		components: getMDXComponents({}),
		options: { parseFrontmatter: true },
	});

	// 목차 생성
	const toc = getTableOfContents(mdxData.content);

	return (
		<DocsPage toc={toc} full={mdxData.full}>
			<DocsTitle>{mdxData.title || name}</DocsTitle>
			<DocsDescription>{mdxData.description || ""}</DocsDescription>
			<div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-md">
				<p className="text-sm text-amber-800 dark:text-amber-300">
					이 문서는 서버에서 동적으로 로드된 Bundle 문서입니다.
				</p>
			</div>
			<DocsBody>{content}</DocsBody>
		</DocsPage>
	);
}
