import { source } from "@/lib/source";
import { getMDXComponents } from "@/mdx-components";
import { createRelativeLink } from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import { notFound } from "next/navigation";

export default async function BundlePage(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  
  // bundle 경로에서는 URL이 /docs/bundle/[나머지경로] 형태이므로
  // source.getPage()에 전달할 때 bundle/ 접두사를 추가합니다
  const bundleSlug = params.slug ? ["bundle", ...params.slug] : ["bundle"];
  const page = source.getPage(bundleSlug);
  
  if (!page) notFound();

  const MDXContent = page.data.body;

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      {/* Bundle 문서용 추가 정보를 여기에 표시할 수 있습니다 */}
      <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-950 rounded-md">
        <p className="text-sm text-amber-800 dark:text-amber-300">
          이 문서는 Bundle 섹션에 속해 있습니다.
        </p>
      </div>
      <DocsBody>
        <MDXContent
          components={getMDXComponents({
            // 상대 경로 링크 지원
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  // bundle로 시작하는 페이지만 필터링
  const pages = source
    .getPages()
    .filter(page => page.url.startsWith("/docs/bundle"))
    .map(page => {
      // URL에서 /docs/bundle/ 부분을 제거하여 실제 slug 배열을 얻습니다
      const slug = page.url.replace("/docs/bundle/", "").split("/").filter(Boolean);
      return { slug };
    });

  return pages;
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const bundleSlug = params.slug ? ["bundle", ...params.slug] : ["bundle"];
  const page = source.getPage(bundleSlug);
  
  if (!page) notFound();

  return {
    title: `SOPIAv3 Bundle | ${page.data.title}`,
    description: page.data.description,
  };
}