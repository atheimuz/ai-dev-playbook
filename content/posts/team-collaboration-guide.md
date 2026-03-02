---
title: "Claude Code 팀 협업 가이드 — MEMORY.md 함정부터 .claude/rules 전환까지"
description: "하위 CLAUDE.md의 로딩 한계를 발견하고, .claude/rules로 전환하여 팀 컨벤션 공유 문제를 해결한 과정을 정리했다."
category: "문제해결"
tags: ["CLAUDE.md", "협업", "설정"]
date: "2026-02-17"
---

Claude Code를 혼자 쓸 때는 문제없던 설정이 팀으로 가면 문제가 됐다.
하위 디렉토리에 나눠놓은 CLAUDE.md가 내 환경에서는 잘 참조되는데, 팀원 환경에서는 무시되는 현상이 있었다.
원인을 파헤쳐보니 MEMORY.md였고, 해결하다 보니 결국 `.claude/rules/`로 전환하게 됐다.

## MEMORY.md 함정

프로젝트의 CLAUDE.md를 디렉토리별로 나눠놓았다.

```
project/
├── CLAUDE.md                    # 프로젝트 공통 규칙
└── src/
    └── components/
        ├── CLAUDE.md            # 컴포넌트 생성 규칙
        └── common/
            └── CLAUDE.md        # 공통 컴포넌트 규칙
```

문제는 Claude가 해당 디렉토리를 탐색하기 전까지는 하위 CLAUDE.md의 존재를 모른다는 것이다.
컴포넌트를 생성할 때 components/common/CLAUDE.md에 정의된 공통 컴포넌트 규칙이 무시됐다.

팀원의 클로드는 이 내용을 참조하지 않고, 내 환경에서만 잘 참조했던 이유는
MEMORY.md에 하위 CLAUDE.md 읽고 진행하라는 내용이 자동 저장되어 있었기 때문이었다.

### MEMORY.md란

위치: ~/.claude/projects/{project-hash}/memory/MEMORY.md

다음 세션 시스템 프롬프트에 자동 포함되는 개인 파일이다.
**git에 포함되지 않고, 팀원에게 공유되지 않는다**

세션 중 작업하면서 발견한 학습 내용, 패턴, 인사이트를 스스로 기록한다.
"CLAUDE.md 잘 참조해"가 자동 저장되면 → 내 환경에서만 작동한다.
팀원의 MEMORY.md에는 그 기록이 없으므로 → CLAUDE.md 참조가 불안정하다.
내 환경에서 잘 되니까 문제를 인식하기 어렵다.

### 첫 번째 시도 — 하위 CLAUDE.md 연결

CLAUDE.md끼리의 연결고리를 만들었다.

```markdown
# components/CLAUDE.md

- 컴포넌트 작성 전 `components/common/CLAUDE.md`를 먼저 읽고 진행할 것
```

Claude가 컴포넌트를 생성하려고 components/ 디렉토리를 탐색하면 components/CLAUDE.md를 발견하고, 거기서 common/CLAUDE.md까지 참조하게 된다.

루트 CLAUDE.md에 넣지 않은 이유는 이 참조가 컴포넌트 작업 시에만 필요하기 때문이다.
다른 작업(API 수정, 설정 변경 등)에서는 불필요한 탐색이 된다.

동작은 한다. 하지만 한계가 있다.

**하위 CLAUDE.md는 Claude가 해당 폴더의 파일을 직접 읽거나 수정할 때만 로드된다.**
컴포넌트 관련 작업이어도 파일 탐색 경로에 따라 규칙이 누락될 수 있고,
연결고리가 늘어날수록 관리 부담도 커진다.

## 전환 — .claude/rules

공식 문서의 [메모리 관리](https://code.claude.com/docs/ko/memory) 페이지를 다시 읽다가 `.claude/rules/`를 발견했다.

```
project/
├── CLAUDE.md
└── .claude/
    └── rules/
        ├── component-style.md   # 컴포넌트 규칙
        ├── testing.md           # 테스트 규칙
        └── api-design.md        # API 설계 규칙
```

`.claude/rules/` 안의 모든 `.md` 파일은 자동으로 프로젝트 메모리로 로드된다.
하위 CLAUDE.md처럼 "해당 폴더를 탐색할 때만" 로드되는 게 아니라, **세션 시작 시 항상 로드**된다.

여기서 핵심 기능이 하나 더 있다.

### paths frontmatter로 조건부 적용

규칙 파일에 `paths`를 지정하면 특정 파일을 다룰 때만 그 규칙이 활성화된다.

```markdown
---
paths: src/components/**/*.tsx
---

# 컴포넌트 규칙

- 공통 컴포넌트는 반드시 src/components/common/에 위치
- Props 타입은 별도 interface로 선언
```

`src/components/` 밖의 파일 작업에선 이 규칙이 로드되지 않는다.
**원하는 조건에만 참조**되면서, 하위 CLAUDE.md 연결고리 없이도 정확히 필요한 곳에서만 규칙이 적용된다.

### 하위 CLAUDE.md와 비교

| | 하위 CLAUDE.md | .claude/rules |
|---|---|---|
| 로드 시점 | 해당 폴더 파일 읽기/수정 시 | 세션 시작 시 (조건부 가능) |
| 적용 범위 제어 | CLAUDE.md 간 연결고리로 간접 제어 | paths frontmatter로 직접 지정 |
| 관리 방식 | 디렉토리 구조에 종속 | 주제별로 독립적으로 분리 |
| 팀 공유 | git에 포함됨 | git에 포함됨 |

팀원 모두 동일한 규칙을 동일한 조건에서 적용받는다.
MEMORY.md에 의존하지 않아도 되고, 연결고리 관리도 필요 없다.

## MEMORY.md 자동 기록에 의존하지 말자

MEMORY.md에 자동 저장된 내용 덕분에 내 환경에서 잘 동작한다고 해서 팀 전체가 같은 경험을 하는 것은 아니다.
주기적으로 MEMORY.md를 열어보고, 팀에 필요한 내용이 거기에만 있다면 CLAUDE.md나 프로젝트 스킬로 승격시킨다.
더 확실한 방법은 MEMORY.md를 비운 상태에서 코드를 작성해보는 것이다.
팀원이 겪는 환경과 동일해지므로, 여기서 발견되는 문제를 CLAUDE.md에 반영하면 된다.

## 돌아보며

팀 협업에서 핵심은 "내 환경에서 되는 것"과 "팀원 환경에서도 되는 것"의 차이를 인식하는 것이었다.
MEMORY.md는 자동으로 학습 내용을 기록하기 때문에 내 환경이 점점 똑똑해진다.
그게 팀 전체의 경험이라고 착각하기 쉽다.

하위 CLAUDE.md 방식은 그 함정을 피하려는 시도였지만, 로딩 조건에 의존한다는 또 다른 불안정성이 있었다.
`.claude/rules/`는 그 두 문제를 모두 해결한다.
세션 시작 시 항상 로드되고, `paths`로 조건을 명확하게 지정할 수 있다.

내 환경에서는 완벽하게 동작하는데 팀원 환경에서 안 된다면, MEMORY.md에 의존하고 있는 건 아닌지 먼저 확인해보자.
그리고 하위 CLAUDE.md를 쓰고 있다면, `.claude/rules/`로 전환을 고려해볼 만하다.
