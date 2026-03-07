---
title: "VSCode Extension에서 Rules가 무시되는 버그"
description: "claude의 rules가 VSCode Extension에서는 무시되고, cli에서는 정상 로드된다."
category: "문제해결"
tags: ["설정"]
date: "2026-03"
---

`.claude/rules/`에 규칙을 설정해두면 특정 파일을 다룰 때 자동으로 로드된다.
그런데 VSCode Extension에서 작업할 때 규칙이 자꾸 무시당하는 느낌이 들어서 직접 테스트해봤다.
결론부터 말하면, VSCode Extension에서는 rules 파일을 아예 읽지 않는 버그가 있다.

## 상황

컴포넌트 폴더에서 작업할 때 적용되는 규칙을 만들어뒀다.
핵심은 네이티브 HTML 대신 공통 컴포넌트를 쓰라는 것.
`<button>` 대신 `<Button>`, `<input>` 대신 `<Input>` 같은 식이다.

![rules 설정 내용](/images/posts/vscode-extension-rules-bug/rules.png)

테스트를 위해 간단한 요청을 해봤다.

```
@src/components/study/list/StudyTable.tsx
여기 테이블 상단에 test라는 버튼을 만들고 클릭하면 "hi"라는 alert이 표시되었으면 좋겠어
```

규칙대로라면 `<Button>` 컴포넌트를 import해서 써야 한다.

## 원인

VSCode Extension에서 실행했더니 이렇게 나왔다.

![VSCode 실행 결과](/images/posts/vscode-extension-rules-bug/vscode-prompt.png)

```
Glob pattern: ".claude/rules/**/*"
Found 17 files
```

rules 파일을 찾기는 했는데, 정작 읽지는 않고 바로 계획 작성으로 넘어갔다.
plan 내용을 보니 역시나 `<button>`을 그대로 쓰고 있었다.

![VSCode Plan 결과](/images/posts/vscode-extension-rules-bug/vscode-plan.png)

혹시나 싶어서 터미널에서 CLI로 같은 요청을 해봤다.

![CLI 실행 결과](/images/posts/vscode-extension-rules-bug/cli-prompt.png)

```
Read src/components/study/list/StudyTable.tsx (377 lines)
Loaded .claude/rules/components/component-hierarchy.md
```

이번엔 rules 파일을 제대로 읽었고, `<Button>` 컴포넌트를 사용하는 코드가 나왔다.

같은 프롬프트인데 환경에 따라 결과가 완전히 달랐다.
찾아보니 이미 GitHub에 [#13914](https://github.com/anthropics/claude-code/issues/13914)로 보고된 버그였다.
2025년 12월에 올라왔는데 아직 미해결 상태다.

## 해결책

현재로선 rules가 중요한 작업은 CLI로 해야 한다.
VSCode Extension으로 claude를 사용하는것이 UI가 편하긴 하지만, 규칙을 엄격하게 따라야 하는 작업에서는 CLI를 쓰는 수밖에 없다.
