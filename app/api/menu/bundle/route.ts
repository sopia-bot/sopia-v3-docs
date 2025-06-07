import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET() {
  try {
    // bundles 폴더 경로
    const bundlesDir = path.join(process.cwd(), 'content', 'bundles');
    
    // 디렉토리 내 모든 파일 목록 가져오기
    const files = await fs.readdir(bundlesDir);
    
    // .mdx 파일만 필터링
    const mdxFiles = files.filter(file => file.endsWith('.mdx'));
    
    // 각 파일의 메타데이터 읽기
    const menuItems = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filePath = path.join(bundlesDir, filename);
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 파일명에서 확장자 제거
        const name = filename.replace(/\.mdx$/, '');
        
        // frontmatter에서 제목과 설명 추출
        let title = name; // 기본값은 파일명
        let description = '';
        let order = 0; // 정렬 순서 (기본값 0)
        
        // frontmatter 추출 (---로 둘러싸인 YAML 형식)
        const frontmatterMatch = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
        if (frontmatterMatch) {
          const frontmatter = frontmatterMatch[1];
          
          // title 추출
          const titleMatch = frontmatter.match(/title:\s*["']?(.*?)["']?\s*(\n|$)/);
          if (titleMatch) title = titleMatch[1];
          
          // description 추출
          const descriptionMatch = frontmatter.match(/description:\s*["']?(.*?)["']?\s*(\n|$)/);
          if (descriptionMatch) description = descriptionMatch[1];
          
          // order 추출 (메뉴 정렬 순서)
          const orderMatch = frontmatter.match(/order:\s*(\d+)\s*(\n|$)/);
          if (orderMatch) order = parseInt(orderMatch[1], 10);
        }
        
        return {
          name, // 파일명 (URL에 사용)
          title, // 표시될 제목
          description, // 설명
          order, // 정렬 순서
        };
      })
    );
    
    // order 값에 따라 정렬
    menuItems.sort((a, b) => a.order - b.order);
    
    return NextResponse.json(menuItems);
  } catch (error) {
    console.error('메뉴 목록을 가져오는 중 오류 발생:', error);
    return NextResponse.json(
      { error: '메뉴 목록을 불러올 수 없습니다.' },
      { status: 500 }
    );
  }
}