# DJ Board API 연동 가이드

## 개요

`/b/[id]` 경로는 DJ Board API를 통해 사용자의 페이지 데이터를 가져와서 렌더링합니다.

## API 엔드포인트

### 페이지 데이터 조회
- **URL**: `GET /dj-board/pages/:userId`
- **Params**:
  - `userId`: 조회할 유저의 ID (Number)
- **Response (200 OK)**:
```json
{
  "userId": 1,
  "title": "나만의 대시보드",
  "content": [
    { "type": "h1", "children": [{ "text": "Welcome" }] }
  ],
  "updatedAt": "2025-07-22T12:00:00Z"
}
```
- **Response (404 Not Found)**: 해당 유저의 페이지 데이터가 없을 경우

## 환경 설정

### 1. 환경 변수 설정

`.env.local` 파일을 생성하고 API URL을 설정하세요:

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**참고**: `.env.local.example` 파일을 복사하여 사용할 수 있습니다.

```bash
cp .env.local.example .env.local
```

### 2. API 서버 실행

DJ Board API 서버를 실행해야 합니다:

```bash
# API 서버 프로젝트 디렉토리에서
npm run dev
```

### 3. Next.js 개발 서버 실행

```bash
npm run dev
```

## 사용 방법

### 페이지 접근

`/b/{userId}` 경로로 접근하면 해당 사용자의 페이지가 렌더링됩니다.

예시:
- `/b/1` - userId가 1인 사용자의 페이지
- `/b/123` - userId가 123인 사용자의 페이지

### 페이지 렌더링 흐름

1. 사용자가 `/b/{userId}` 접속
2. `getContent()` 함수가 API 호출: `GET /dj-board/pages/{userId}`
3. API 응답 데이터를 파싱
4. `content` 배열을 `ContentRenderer`로 전달
5. 블록 타입별로 React 컴포넌트 렌더링

## 데이터 구조

### 지원하는 블록 타입

- **기본 블록**: `p`, `h1-h6`, `blockquote`, `code_block`
- **리스트**: `ul`, `ol`, `li`, `lic`, `todo_li`
- **고급 블록**: `toggle`, `column_group`, `column`, `table`, `tr`, `th`, `td`
- **미디어**: `img`, `a`
- **특수 블록**: `calendar`, `dday`

자세한 데이터 구조는 `docs/` 폴더의 문서를 참고하세요:
- `docs/data-structure.md` - 전체 데이터 구조
- `docs/block-types.md` - 블록 타입별 상세 레퍼런스
- `docs/examples.json` - 실제 데이터 예제

## 캐싱 전략

현재 설정:
```typescript
cache: "no-store" // 항상 최신 데이터 가져오기
```

만약 캐싱이 필요하다면:
```typescript
// 60초 캐싱
next: { revalidate: 60 }

// 또는 태그 기반 재검증
next: { tags: ['dj-board', `user-${userId}`] }
```

## 트러블슈팅

### API 연결 실패
```
Failed to fetch page data: Error: API error: 500
```
- API 서버가 실행 중인지 확인
- `.env.local`의 `NEXT_PUBLIC_API_URL` 확인
- API 서버의 CORS 설정 확인

### 404 Not Found
- 해당 userId의 데이터가 API에 존재하는지 확인
- 브라우저 개발자 도구 Network 탭에서 API 요청 확인

### 렌더링 에러
- API 응답 데이터가 올바른 형식인지 확인
- `content` 배열의 각 블록이 올바른 타입과 children을 가지고 있는지 확인

## 프로덕션 배포

프로덕션 환경에서는 환경 변수를 적절히 설정하세요:

```bash
# Vercel, Netlify 등의 환경 변수 설정
NEXT_PUBLIC_API_URL=https://api.your-domain.com
```

## 추가 참고 사항

- 페이지는 동적으로 렌더링됩니다 (SSR)
- `generateStaticParams`는 제거되었습니다 (동적 API 데이터 사용)
- 메타데이터는 API 응답의 `title` 필드를 사용합니다
