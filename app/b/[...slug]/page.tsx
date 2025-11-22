import { notFound } from "next/navigation";
import { ContentRenderer } from "@/components/content-renderer";
import type { TNode } from "@/types/editor";

interface ApiResponse<T> {
	status: number;
	error: boolean;
	msg: string;
	data: T[];
}

interface PageProps {
	params: Promise<{ slug: string[] }>;
}

interface PageData {
	userId: number;
	title: string;
	content: TNode[];
	updatedAt: string;
}

async function getContent(slug: string[]): Promise<PageData | null> {
	try {
		const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
		
		// slug[0] = userId, slug[1...] = url path
		const userId = slug[0];
		const urlPath = slug.length > 1 ? slug.slice(1).join('/') : '/';
		
		const response = await fetch(`${apiUrl}/dj-board/pages/${userId}/${urlPath}`, {
			cache: "no-store", // 항상 최신 데이터 가져오기
		});

		if (!response.ok) {
			if (response.status === 404) {
				return null;
			}
			throw new Error(`API error: ${response.status}`);
		}

		const data: ApiResponse<PageData> = await response.json();
		return data.data[0];
	} catch (error) {
		console.error("Failed to fetch page data:", error);
		return null;
	}
}

export default async function Page(props: PageProps) {
	const params = await props.params;
	
	// slug가 없으면 404
	if (!params.slug || params.slug.length === 0) {
		notFound();
	}
	
	const pageData = await getContent(params.slug);

	if (!pageData) {
		notFound();
	}

	return (
		<div className="container mx-auto max-w-4xl px-4 py-8">
			<ContentRenderer data={pageData.content} userId={params.slug[0]} />
		</div>
	);
}

// generateStaticParams는 동적 API 데이터를 사용하므로 제거
// 페이지는 요청 시 동적으로 렌더링됩니다

export async function generateMetadata(props: PageProps) {
	const params = await props.params;
	
	if (!params.slug || params.slug.length === 0) {
		return {
			title: "Not Found",
		};
	}
	
	const pageData = await getContent(params.slug);

	if (!pageData) {
		return {
			title: "Not Found",
		};
	}

	return {
		title: `SOPIAv3 | ${pageData.title}`,
		description: `${pageData.title} - 업데이트: ${new Date(pageData.updatedAt).toLocaleDateString("ko-KR")}`,
	};
}

