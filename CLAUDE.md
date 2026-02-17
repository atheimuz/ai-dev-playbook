# ai-agent-blog

Next.js App Router 기반 정적 블로그.

## 기술 스택

- Next.js 16 (App Router) / React 19 / TypeScript
- Tailwind CSS 4 + shadcn/ui + Lucide React
- 마크다운: gray-matter + unified (remark + rehype)
- 다크모드: next-themes / E2E: Playwright

## 핵심 아키텍처

### 라우팅

- Parallel Routes(`@drawer`) + Intercepting Routes(`(.)posts/[slug]`)로 Drawer 미리보기
- Drawer는 영역 차지형 (오버레이 아님), `src/app/layout.tsx`에서 children과 drawer 슬롯 나란히 렌더링

### 콘텐츠

- 포스트: `content/posts/*.md` (frontmatter: title, description, category, tags, date, slug)
- 데이터 로드: `src/lib/posts.ts` -- getAllPostMetas(), getPostBySlug(), getLatestPosts()
- 카테고리: "설정" | "문제해결" | "개선" | "팁" (`src/types/post.ts`의 CATEGORIES)

### 컴포넌트

- `src/components/common/` -- 공통 (CategoryBadge, TagBadge, GlobalNav, Footer, MarkdownRenderer)
- `src/components/features/Blog/` -- 블로그 기능 (BentoGrid, PostCard, PostDrawer, CategoryFilter, SearchBar)
- `src/components/ui/` -- shadcn/ui
- 모든 컴포넌트는 폴더 단위 (index.ts re-export)

### 서버/클라이언트 경계

- 페이지(page.tsx)는 서버 컴포넌트에서 데이터 로드
- `*Client.tsx` 네이밍으로 클라이언트 컴포넌트 구분

## 개발 명령어

- `npm run dev` / `npm run build` / `npm run lint`

## 코딩 컨벤션

React/TypeScript 코드 작성 시 `~/.claude/skills/react-conventions/skill.md` 규칙을 따를 것.
