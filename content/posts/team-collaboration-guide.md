---
title: "Claude Code 팀 협업 가이드 — MEMORY.md 함정부터 컨벤션 공유까지"
description: "하위 CLAUDE.md가 팀원 환경에서만 무시되는 원인은 MEMORY.md 자동 기록이었다. 해결 과정과 팀 공유 시 주의할 점을 정리했다."
category: "팁"
tags: ["claude-code", "팀협업", "CLAUDE.md", "컨벤션", "공유"]
date: "2026-02-17"
---

Claude Code를 혼자 쓸 때는 문제없던 설정이 팀으로 가면 문제가 됐다.
하위 디렉토리에 나눠놓은 CLAUDE.md가 내 환경에서는 잘 참조되는데, 팀원 환경에서는 무시되는 현상이 있었다.
원인은 MEMORY.md였다.

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

### 해결

CLAUDE.md끼리의 연결고리를 만들었다.

```markdown
# components/CLAUDE.md

- 컴포넌트 작성 전 `components/common/CLAUDE.md`를 먼저 읽고 진행할 것
```

Claude가 컴포넌트를 생성하려고 components/ 디렉토리를 탐색하면 components/CLAUDE.md를 발견하고, 거기서 common/CLAUDE.md까지 참조하게 된다.

루트 CLAUDE.md에 넣지 않은 이유는 이 참조가 컴포넌트 작업 시에만 필요하기 때문이다.
다른 작업(API 수정, 설정 변경 등)에서는 불필요한 탐색이 된다.
**필요한 맥락에서만 참조되도록 해당 디렉토리의 CLAUDE.md에 넣는 것이 핵심이다.**

## MEMORY.md 자동 기록에 의존하지 말자

MEMORY.md에 자동 저장된 내용 덕분에 내 환경에서 잘 동작한다고 해서 팀 전체가 같은 경험을 하는 것은 아니다.
주기적으로 MEMORY.md를 열어보고, 팀에 필요한 내용이 거기에만 있다면 CLAUDE.md나 프로젝트 스킬로 승격시킨다.
더 확실한 방법은 MEMORY.md를 비운 상태에서 코드를 작성해보는 것이다.
팀원이 겪는 환경과 동일해지므로, 여기서 발견되는 문제를 CLAUDE.md에 반영하면 된다.

## 돌아보며

팀 협업에서 핵심은 "내 환경에서 되는 것"과 "팀원 환경에서도 되는 것"의 차이를 인식하는 것이었다.
MEMORY.md는 자동으로 학습 내용을 기록하기 때문에 내 환경이 점점 똑똑해진다.
그게 팀 전체의 경험이라고 착각하기 쉽다.
내 환경에서는 완벽하게 동작하는데 팀원 환경에서 안 된다면, MEMORY.md에 의존하고 있는 건 아닌지 먼저 확인해보자.
