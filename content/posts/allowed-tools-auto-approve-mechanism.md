---
title: "Claude Code allowed-tools의 실제 동작 — AskUserQuestion 버그와 자동 승인 메커니즘"
description: "allowed-tools에 AskUserQuestion을 넣으면 UI가 렌더링되지 않고 '.'이 반환되는 버그. 화이트리스트가 아니라 auto-approve 목록이라는 사실을 두 세션의 디버깅으로 밝혀낸 기록."
category: "문제해결"
tags: ["claude-code", "allowed-tools", "AskUserQuestion", "command", "auto-approve", "bug"]
date: "2026-02-28"
---

Claude Code custom command의 `allowed-tools` frontmatter는 화이트리스트가 아니라 **자동 승인(auto-approve) 목록**이다.
이 사실을 모르고 `AskUserQuestion`을 `allowed-tools`에 넣으면 사용자에게 질문하지 않고 `.`을 반환하는 버그가 발생한다.
두 개의 독립된 Claude 세션이 서로 다른 답을 내놓았고, 올바른 결론은 실제 동작 관찰에서 나왔다.

## 상황

`/granular-commit` command를 실행하면 커밋 계획을 제시한 뒤 `AskUserQuestion`으로 사용자 승인을 받아야 한다.
그런데 UI가 표시되지 않고 `.`이 반환되어 에이전트가 임의로 진행하는 버그가 발생했다.

`allowed-tools` frontmatter의 의미를 두고 두 가지 해석이 충돌했다.

| 해석             | 의미                              | 목록에 없는 도구                    |
| ---------------- | --------------------------------- | ----------------------------------- |
| **화이트리스트** | 목록에 명시한 도구만 사용 가능    | 차단                                |
| **자동 승인**    | 목록에 있는 도구는 컨펌 없이 실행 | 사용 가능, 실행 시 사용자 승인 요청 |

두 개의 독립된 Claude 세션에서 이 문제를 다루었다.
한쪽은 "화이트리스트이므로 `AskUserQuestion`을 넣어야 한다"고 답했고, 다른 쪽은 "자동 승인이므로 빼야 한다"고 답했다.
둘 다 확신을 가졌지만, 처음에 맞은 쪽은 없었다.

## 원인

`allowed-tools`는 자동 승인 목록이다. Anthropic 문서에 명시되어 있다. [링크](https://code.claude.com/docs/en/skills#restrict-claude%E2%80%99s-skill-access)

> "Skills that define allowed-tools grant Claude access to those tools **without per-use approval** when the skill is active."

| allowed-tools에 있으면                 | allowed-tools에 없으면                   |
| -------------------------------------- | ---------------------------------------- |
| 자동 승인 — 사용자 컨펌 없이 즉시 실행 | 사용 가능 — 실행 시 사용자에게 승인 요청 |

`AskUserQuestion`의 설계 목적은 사용자 인터랙션이다.
auto-approve의 목적은 인터랙션 생략이다.
이 둘을 조합하면 인터랙션 자체가 건너뛰어진다.

```
AskUserQuestion이 allowed-tools에 포함된 경우:
  에이전트 → AskUserQuestion 호출
    → 시스템: auto-approve
    → UI 렌더링 생략
    → "." 반환
  에이전트 → "사용자가 .로 답했다" → 임의 해석 후 진행

AskUserQuestion이 allowed-tools에 없는 경우:
  에이전트 → AskUserQuestion 호출
    → 시스템: 사용자 승인 요청
    → UI 정상 렌더링
  사용자 → 선택지 클릭 → 응답 전달
  에이전트 → 정확한 선택을 받아 진행
```

### 실증적 증거

기존의 command 파일을 조사한 결과, 본문에서 `AskUserQuestion`을 사용하면서도 `allowed-tools`에는 포함하지 않았다.
화이트리스트 해석이 맞다면 이 4개 command는 모두 `AskUserQuestion`을 사용할 수 없는 깨진 상태여야 한다.
실제로는 정상 동작한다.

## 적용한 방법

`/granular-commit`의 `allowed-tools`에서 `AskUserQuestion`을 제거했다.
이후 `AskUserQuestion` 호출 시 UI가 정상 렌더링되고, 사용자의 실제 선택이 에이전트에 전달되는 것을 확인했다.

이 경험에서 도출한 실무 규칙은 다음과 같다.

| 구분                 | 도구 예시                                 | allowed-tools 포함        |
| -------------------- | ----------------------------------------- | ------------------------- |
| 자동화/실행 도구     | Bash, Read, Write, Edit, Glob, Grep, Task | 포함 적합                 |
| 사용자 인터랙션 도구 | AskUserQuestion                           | **포함 금지**             |
| 상태 도구            | TodoWrite                                 | 포함 가능 (인터랙션 아님) |

판단 기준은 단순하다.
해당 도구가 **사용자의 응답을 기다리는 것이 목적**이면 auto-approve에 넣으면 안 된다.
auto-approve는 "기다리지 않고 바로 실행"이라는 뜻이기 때문이다.

```yaml
# Command frontmatter 작성 예시
allowed-tools:
    - Bash(git diff:*) # 자동화 도구 → auto-approve 적합
    - Read # 자동화 도구 → auto-approve 적합
    - Write # 자동화 도구 → auto-approve 적합
    - Task # 자동화 도구 → auto-approve 적합
    # AskUserQuestion    # 사용자 인터랙션 도구 → 절대 포함 금지
```

## 결과

<!-- 변경 전후 비교 -->

| 항목                      | 변경 전               | 변경 후                          |
| ------------------------- | --------------------- | -------------------------------- |
| AskUserQuestion 동작      | UI 미표시, `.` 반환   | UI 정상 렌더링, 사용자 선택 전달 |
| 사용자 승인 흐름          | 에이전트가 임의 진행  | 사용자가 직접 선택 후 진행       |
| 다른 도구 (Bash, Read 등) | 자동 실행 (변경 없음) | 자동 실행 (변경 없음)            |

## 돌아보며

<!-- AI 답변 신뢰 문제, 경험적 관찰의 중요성 -->

이 사례의 핵심 교훈은 **AI의 설명을 신뢰하지 말고, 실제 동작으로 검증하라**는 것이다.
두 개의 독립된 Claude 세션이 동일한 질문에 서로 다른 답을 내놓았다.
한쪽은 "화이트리스트이므로 넣어야 한다", 다른 쪽은 "자동 승인이므로 빼야 한다".
둘 다 확신에 차 있었지만, 올바른 결론은 "넣으면 안 물어보고, 빼면 물어본다"는 직접 관찰에서 나왔다.

AI가 자신 있게 설명하더라도 그것이 정확하다는 보장은 없다.
특히 도구의 내부 동작처럼 문서화가 불충분한 영역에서는 실제 동작을 관찰하고, 가설을 세우고, 검증하는 과정이 필수다.
