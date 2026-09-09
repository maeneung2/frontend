# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev        # 개발 서버 실행
pnpm build      # tsc -b && vite build
pnpm lint       # ESLint 실행
pnpm preview    # 빌드 결과 미리보기
```

## Stack

- React 19 + TypeScript (verbatimModuleSyntax 활성화 → 타입 import는 반드시 `import type` 사용)
- Chakra UI v3 + Ant Design v6 (CSS 레이어 충돌 → `index.html`에 `@layer reset, base, tokens, recipes, utilities, antd;` 선언으로 해결)
- React Router v7, Zustand v5 (persist), Axios, dayjs
- pnpm

## Architecture

### API
- `src/api/axios.ts` — Axios 인스턴스. 요청 시 Bearer 토큰 자동 주입, 401 응답 시 refresh 토큰으로 재발급 후 재시도, 실패 시 `/login` 리다이렉트.
- baseURL: `VITE_API_URL` 환경변수

### 인증
- `src/store/authStore.ts` — Zustand persist 스토어. `accessToken`, `refreshToken`, `user` 보관.
- `user.id`로 현재 유저 식별, `user.groupId`로 소속 그룹 확인.

### 라우팅
- `src/routes/` — RootRoute > GroupRouter / LoginRoute / IndexRoute
- 그룹 라우트: `/group/:group_id/...`
- PrivateRoute / PublicRoute 컴포넌트로 인증 가드

### 컴포넌트 구조
- `src/components/schedule/` — 스케줄 관련 공용 컴포넌트
  - `schedule.ts` — 공유 타입, 상수 (WORK_TYPES, WEEKDAYS, cellStyle)
  - `ScheduleTable.tsx` — 인원×날짜 그리드. `onCellClick` 없으면 읽기 전용
  - `WorkTypeSelector.tsx`, `ScheduleHeader.tsx`, `ScheduleActionBar.tsx`
  - `MyScheduleCalendar.tsx` — 개인 스케줄 월 달력

### 스케줄 페이지 흐름
- 목록: `GET /api/v1/schedule?groupId=`
- 생성: `GET /api/v1/schedule/init` → 409 시 해당 월 중복
- 배치 미리보기: `POST /api/v1/schedule/preview`
- 저장: `POST /api/v1/schedule`
- 상세: `GET /api/v1/schedule/:id`
- 개인 스케줄: `GET /api/v1/schedule/:id/me`
- 삭제: `DELETE /api/v1/schedule/:id`

### 스케줄 생성 로직 (localStorage)
- 최초 "시간표 생성" 클릭 시 현재 수동 배치를 `schedule_draft_{groupId}_{YYYY-MM}` 키로 localStorage 저장
- 재생성 시 localStorage에서 복원하여 동일 베이스로 재배치
- 리셋 시 localStorage 삭제 + 원본 복원

### 테마
- `src/components/Provider.tsx` — ChakraProvider + Antd StyleProvider + ConfigProvider 통합
- `src/theme/theme.ts` — 테마 토큰, `src/theme/pallet.ts` — 라이트/다크 팔레트
- `src/store/themeStore.ts` — 다크모드 preference