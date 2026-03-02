---
title: "Claude Code 확장의 3가지 축: Skill, Command, SubAgent"
description: "Skill, Command, SubAgent의 차이점과 각각 언제 사용해야 하는지, 실전 예시와 의사결정 가이드로 정리했다."
date: "2025-12"
category: "학습"
tags: ["skill", "command", "sub-agent"]
---

Claude Code에는 Skill, Command, SubAgent라는 세 가지 확장 메커니즘이 있다.
셋 다 `.claude/` 폴더에 마크다운 파일을 만든다는 점에서 비슷해 보이지만, 역할은 명확히 다르다.

## 핵심 차이: "무엇을" vs "어떻게"

| 구분         | 비유                   | 핵심                 |
| ------------ | ---------------------- | -------------------- |
| **Command**  | "이거 해줘" (버튼)     | **무엇을** 할지 정의 |
| **Skill**    | "이렇게 해" (가이드북) | **어떻게** 할지 정의 |
| **SubAgent** | "전문가한테 맡겨"      | **누가** 할지 정의   |

코드리뷰 예시로 정리하면:

```
코드리뷰 자동화
├─ Command (/review): "PR의 변경사항을 분석해서 리뷰해줘"
├─ Skill (code-review): "리뷰할 때 이런 기준으로, 이런 말투로"
└─ SubAgent (reviewer): "메인 작업 방해 없이 독립적으로 분석해"
```

**Command**는 `/review`라고 치면 실행되는 **워크플로우**다. "지금 당장 이 작업을 수행해"라는 명령이다.

**Skill**은 리뷰를 할 때 **자동으로 참조되는 지식**이다.
Claude가 "이 프로젝트에서 리뷰할 때는 이런 기준을 적용해야 하는구나"라고 알게 된다.

**SubAgent**는 "이 분석은 좀 무거우니까 별도로 처리하고 결과만 알려줘"라는 **위임**이다.

## Command: 명시적 실행 (/슬래시)

Command는 사용자가 `/명령`을 입력했을 때만 실행된다. 자동으로 적용되지 않는다.

**파일 위치**: `.claude/commands/review.md`

```markdown
---
description: PR 코드리뷰 실행
allowed-tools: Bash(git diff:*)
---

## 작업

1. !`git diff HEAD~1` 결과를 분석합니다
2. 버그 가능성, 성능 이슈, 컨벤션 위반을 체크합니다
3. 각 이슈에 대해 구체적인 수정 제안을 합니다
```

**핵심 포인트**:

- `!` 구문으로 명령어 출력을 미리 가져옴
- `$ARGUMENTS`로 사용자 입력을 받을 수 있음
- 실행하면 바로 **액션**이 일어남

## Skill: 자동 적용되는 지식

Skill은 **관련 작업을 할 때 Claude가 자동으로 참조**한다.
사용자가 "리뷰해줘"라고 하면, Claude가 알아서 code-review Skill을 적용한다.

**파일 위치**: `.claude/skills/code-review/SKILL.md`

```markdown
---
name: code-review
description: 코드 리뷰 요청 시 적용되는 가이드라인
---

# 코드 리뷰 가이드라인

## 리뷰 기준

- 타입 안정성: any 사용 금지
- 에러 처리: try-catch 또는 Result 타입 사용
- 테스트: 새 기능에는 테스트 필수

## 말투

- 문제점과 개선 방향을 함께 제시
- "~하면 좋을 것 같습니다" 형식 사용
- 코드 예시 포함
```

**핵심 포인트**:

- `description`이 요청과 매칭되면 **자동 적용**
- 실행이 아니라 **지식 주입**
- `/code-review`로 수동 호출도 가능

### Command와 Skill의 시너지

Command와 Skill은 함께 쓰면 시너지가 난다.

```
사용자: /review
Claude: (review Command 실행)
        (code-review Skill도 함께 적용)
        git diff 분석 + Skill의 가이드라인에 따라 리뷰
```

둘 다 마크다운 파일이라 비슷해 보이지만, 역할이 완전히 다르다.

- **Command**: 트리거 + 워크플로우 정의
- **Skill**: 품질 기준 + 지식 정의

## SubAgent: 독립 컨텍스트에서 작업

SubAgent를 이해하려면 **컨텍스트 문제**를 알아야 한다.

### 문제: 메인 컨텍스트 오염

대규모 코드베이스를 분석하다 보면, 파일을 수십 개 읽게 된다. 이 모든 내용이 메인 컨텍스트에 쌓이면

```
메인 컨텍스트 상황
├─ 사용자 질문: "로그인 버그 수정해줘"
├─ 코드베이스 분석으로 읽은 파일들: 30개
├─ 실제 필요한 파일: 2개
└─ 결과: 토큰 낭비 + 응답 품질 저하
```

### 해결: 독립 컨텍스트에서 작업

SubAgent는 **별도 컨텍스트**에서 작업하고, 결과만 메인에 돌려준다.

```
SubAgent 사용 시
├─ 메인: "코드베이스 구조 분석해줘"
├─ SubAgent: (별도 컨텍스트에서 파일 30개 분석)
├─ SubAgent → 메인: "분석 결과 요약: ..."
└─ 결과: 메인 컨텍스트 깔끔하게 유지
```

**파일 위치**: `.claude/agents/codebase-explorer.md`

```markdown
---
name: codebase-explorer
description: 코드베이스 구조 분석 전문가
---

# 역할

메인 컨텍스트를 오염시키지 않고 코드베이스를 탐색한다.

## 분석 항목

1. 디렉토리 구조와 각 폴더 역할
2. 진입점 파일 (main, index, app)
3. 주요 의존성 관계

## 출력 형식

간결한 요약으로 반환한다.

- 전체 구조 트리
- 핵심 발견사항 3개
- 권장 탐색 경로
```

### 언제 SubAgent를 쓸까?

```
SubAgent 사용 판단
├─ 대규모 탐색이 필요한가? → SubAgent
├─ 메인 작업과 독립적인가? → SubAgent
├─ 결과만 필요하고 과정은 필요 없는가? → SubAgent
└─ 그 외 → Command나 Skill로 충분
```

## 의사결정 가이드

### 판단 플로우

```
Q1: 특정 요청 시 자동으로 적용되어야 하는 "지식"인가?
├── Yes → Skill
└── No → Q2

Q2: "/명령"으로 명시적 실행이 필요한가?
├── Yes → Command
└── No → Q3

Q3: 메인 컨텍스트와 분리해서 작업해야 하는가?
├── Yes → SubAgent
└── No → CLAUDE.md에 추가
```

### 시나리오별 정리

| 시나리오                   | 선택     | 이유                        |
| -------------------------- | -------- | --------------------------- |
| "리뷰할 때 이 기준 적용해" | Skill    | 자동 적용되는 지식          |
| "지금 커밋 만들어줘"       | Command  | 명시적 실행                 |
| "프로젝트 구조 분석해줘"   | SubAgent | 대규모 탐색, 독립 작업      |
| "PR 만들어줘"              | Command  | 순차적 워크플로우           |
| "TypeScript는 이렇게 써"   | Skill    | 자동 적용되는 스타일 가이드 |
| "보안 취약점 찾아줘"       | SubAgent | 전문 분석, 독립 컨텍스트    |
| "6개 리뷰어를 병렬 실행"   | Command  | 오케스트레이터는 워크플로우 |

## 실제 실행 흐름: 조합의 시너지

세 가지를 개별적으로 이해하는 것도 중요하지만, 함께 동작하는 흐름을 보면 더 명확해진다.

### 예시: `/review src/` 실행 시

```
사용자: /review src/
     ↓
[Command 호출]
  → review.md의 워크플로우 시작
     ↓
[Skill 자동 참조]
  → code-review Skill의 가이드라인 적용
     ↓
[파일 많으면 SubAgent 위임]
  ├─ SubAgent 1: src/components/ 리뷰
  ├─ SubAgent 2: src/utils/ 리뷰
  └─ SubAgent 3: src/api/ 리뷰
     ↓
[결과 취합]
  → 메인 컨텍스트에 요약된 리뷰 결과 반환
```

이 흐름에서 각 요소의 역할이 명확해진다.

- **Command**: 전체 워크플로우의 시작점 (트리거)
- **Skill**: 리뷰 품질을 결정하는 기준 (지식)
- **SubAgent**: 대규모 분석의 실행자 (위임)

### 언제 Command를 만들어야 할까?

Skill이 자동으로 적용되면, Command는 안 만들어도 되는 걸까?

맞다. **Skill만으로 충분한 경우가 많다.**
하지만 사용하다 보면 이런 상황이 생긴다:

```
Skill만 있을 때
├─ "리뷰해줘" → ✓ Skill 적용
├─ "content 폴더 제외하고 리뷰해줘" → 매번 언급
├─ "staged 파일만 리뷰해줘" → 매번 언급
├─ "테스트 파일은 빼고 리뷰해줘" → 매번 언급
└─ ... 반복되는 옵션들
```

이 시점이 **Command를 만들 타이밍**이다.

```
Command 추가 후
├─ /review → 기본 리뷰
├─ /review --staged → staged 파일만
├─ /review --exclude content → content 제외
└─ 옵션이 표준화되어 일관성 확보
```

**정리하면**:

- Skill만으로 시작
- "이 옵션 매번 말하네" 싶을 때 Command 추가
- 입력을 표준화해서 일관성 확보

### 실전 사례: Agent를 Command로 리팩토링

코드리뷰 시스템을 만들면서 원래는 이런 구조였다.

```
agents/code-review/
├── react-review.md       ← 6개 전문 에이전트를 병렬 호출
├── a11y-reviewer.md
├── architecture-reviewer.md
├── performance-reviewer.md
├── security-reviewer.md
└── type-safety-reviewer.md
```

`react-review.md`의 역할은 6개의 전문 리뷰어를 호출하고 결과를 취합하는 **오케스트레이터**였다.

그런데 이 파일은 직접 분석을 하지 않고, 다른 에이전트들을 조율만 하고 있었다.
Agent의 역할은 "독립적인 전문가로서 실제 작업을 수행하는 것"이다. 오케스트레이터는 작업을 위임하고 조율하는 역할이니 Command가 맞다.

리팩토링 후:

```
agents/code-review/
├── a11y-reviewer.md           ← 전문가 (독립 분석)
├── architecture-reviewer.md
├── performance-reviewer.md
├── security-reviewer.md
└── type-safety-reviewer.md

commands/
└── code-review.md             ← 오케스트레이터 (워크플로우)
```

**변경 포인트**:

- `react-review.md` → `commands/code-review.md`로 이동
- 6개의 전문 리뷰어는 Agent로 유지

이렇게 하니 역할이 명확해진다.

- `/code-review` 입력 → Command가 워크플로우 시작
- Command가 필요한 Agent들을 호출
- 각 Agent는 자기 전문 분야를 독립적으로 분석

> 여러 Agent를 조율하는 "오케스트레이터" 역할은 **Command**가 적합하다.
> Agent는 실제 분석을 수행하는 **전문가** 역할일 때 사용한다.

## 전체 구조: CLAUDE.md와 함께 보기

이 세 가지는 Claude Code의 **메모리 계층** 안에서 동작한다:

```
Claude Code 메모리 계층
├─ 1. CLAUDE.md ← 항상 로드 (프로젝트 기본 정보)
├─ 2. .claude/rules/*.md ← 경로별 조건부 로드
├─ 3. .claude/skills/ ← 요청 매칭 시 자동 로드
├─ 4. .claude/commands/ ← /명령 시 로드
├─ 5. .claude/agents/ ← 위임 시 독립 컨텍스트
└─ 6. ~/.claude/CLAUDE.md ← 개인 설정
```

### 효율적인 구조 설계

**CLAUDE.md는 가볍게**: 빌드 명령, 기본 컨벤션만. 모든 걸 여기 넣으면 항상 토큰 소비.

**Rules로 분리**: `paths: ["src/api/**"]` 처럼 조건부 로드. API 작업할 때만 API 규칙 적용.

**Skill로 모듈화**: 반복되는 가이드라인을 분리. 관련 작업 시에만 자동 적용.

**Command로 자동화**: 자주 쓰는 워크플로우. `/commit`, `/pr`, `/deploy` 등.

**SubAgent로 분리**: 무거운 분석 작업. 메인 컨텍스트 보호.

> **Agent vs Command 핵심 구분**
>
> - **Agent**: 특정 분야 전문가 (독립 실행, 실제 분석 수행)
> - **Command**: 여러 단계/에이전트를 조율하는 워크플로우

## 돌아보며

Skill, Command, SubAgent는 비슷해 보이지만 역할이 명확히 다르다.

- **Skill** = 지식을 확장 (자동 적용)
- **Command** = 행동을 확장 (명시적 실행)
- **SubAgent** = 전문성을 확장 (독립 컨텍스트)

가장 중요한 건, 이 세 가지를 **조합해서 쓰는 것**이다.
Command가 실행될 때 관련 Skill이 자동으로 적용되고, 무거운 작업은 SubAgent에게 위임하는 구조가 효과적이다.
