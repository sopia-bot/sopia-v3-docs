import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    const { name } = params;
    
    // 악의적인 경로 주입 방지 (경로 검증)
    if (name.includes('..') || !name.match(/^[a-zA-Z0-9-_]+$/)) {
      return NextResponse.json(
        { error: '유효하지 않은 문서 이름입니다.' },
        { status: 400 }
      );
    }

    // 서버에 저장된 MDX 콘텐츠 파일 경로
    // 이 경로는 실제 서버 환경에 맞게 변경해야 합니다
    const filePath = path.join(process.cwd(), 'content', 'bundles', `${name}.mdx`);
    
    // 파일 존재 여부 확인
    try {
      await fs.access(filePath);
    } catch (error) {
      return NextResponse.json(
        { error: '요청한 문서가 존재하지 않습니다.' },
        { status: 404 }
      );
    }
    
    // 파일 콘텐츠 읽기
    const content = await fs.readFile(filePath, 'utf-8');
    
    // 간단한 front matter 추출 (정규식 사용)
    let title = name;
    let description = '';
    let full = false;
    
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
      
      // full 필드 추출
      const fullMatch = frontmatter.match(/full:\s*(true|false)\s*(\n|$)/);
      if (fullMatch) full = fullMatch[1] === 'true';
    }
    
    // 응답 반환
    return NextResponse.json({
      content,
      title,
      description,
      full,
    });
    
  } catch (error) {
    console.error('MDX 콘텐츠 제공 중 오류 발생:', error);
    return NextResponse.json(
      { error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}