# AI Agent Blog

AI 에이전트(Claude Code, Cursor 등)를 활용한 개발 경험을 공유하는 기술 블로그입니다.

> https://ai-dev-playbook.vercel.app

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router) |
| 언어 | TypeScript, React 19 |
| 스타일링 | Tailwind CSS 4, shadcn/ui, Lucide React |
| 콘텐츠 | Markdown (gray-matter + unified) |
| 다크모드 | next-themes |
| 분석 | Vercel Analytics |
| E2E 테스트 | Playwright |

## 주요 기능

- **Drawer 미리보기** - Parallel Route + Intercepting Route를 활용한 포스트 미리보기
- **무한스크롤** - IntersectionObserver 기반 포스트 목록 로딩
- **카테고리/태그 필터** - 설정, 문제해결, 개선, 팁 4개 카테고리
- **검색** - 제목/설명 기반 포스트 검색
- **SEO** - sitemap.xml, robots.txt, RSS 피드, Open Graph, JSON-LD 구조화 데이터

## 프로젝트 구조

```
ai-agent-blog/
├── content/posts/         # 마크다운 블로그 포스트
├── specs/                 # 기획/디자인 명세 문서
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── @drawer/       # Parallel Route (Drawer 슬롯)
│   │   ├── posts/         # 포스트 목록/상세 페이지
│   │   ├── feed.xml/      # RSS 피드
│   │   ├── sitemap.ts     # 사이트맵
│   │   └── robots.ts      # robots.txt
│   ├── components/
│   │   ├── common/        # 공통 컴포넌트
│   │   ├── features/Blog/ # 블로그 기능 컴포넌트
│   │   └── ui/            # shadcn/ui 컴포넌트
│   ├── hooks/             # 커스텀 훅
│   ├── lib/               # 유틸리티 (마크다운 파싱 등)
│   ├── providers/         # ThemeProvider
│   └── types/             # 타입 정의
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# E2E 테스트
npx playwright test
```

http://localhost:3000 에서 확인할 수 있습니다.

## 콘텐츠 작성

`content/posts/` 디렉토리에 마크다운 파일을 추가합니다.

```markdown
---
title: "포스트 제목"
description: "포스트 설명"
category: "설정"
tags: ["Claude Code", "설정"]
date: "2025-01-01"
slug: "post-slug"
thumbnail: "/images/thumbnail.png"
---

본문 내용 (Markdown)
```

| 필드 | 필수 | 설명 |
|------|------|------|
| title | O | 포스트 제목 |
| description | O | 포스트 설명 (SEO용) |
| category | O | 카테고리 (설정/문제해결/개선/팁) |
| tags | O | 태그 배열 |
| date | O | 작성일 (YYYY-MM-DD) |
| slug | O | URL 슬러그 |
| thumbnail | X | 썸네일 이미지 경로 |
