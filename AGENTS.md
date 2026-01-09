# Repository Guidelines

This uni-app Vue 3 repo targets multiple platforms. Keep changes scoped, documented, and linted before opening a PR.

## Project Structure & Module Organization
- `src/main.js` boots the app; `src/App.vue` hosts global launch/show/hide hooks and auth checks.
- Pages live in `src/pages/{common,parent,teacher}`; routing/config are set in `src/pages.json` and `src/manifest.json`.
- Shared UI: `src/components` (PascalCase `.vue` files). Data/helpers: `src/api/{common,parent,teacher}`, `src/utils`, `src/store` (auth/state).
- Styles/assets: `src/uni.scss`, `src/static`. Build output: `dist/`. Use the `@/` alias (see `jsconfig.json`) for imports.

### src 目录结构（含中文注释）
```
src/
  main.js               应用入口
  App.vue               全局生命周期与鉴权
  pages/                页面目录（common/parent/teacher）
  components/           共享 UI 组件
  api/                  接口封装（按角色分组）
  store/                状态管理与登录态
  utils/                工具方法
  static/               静态资源
  uni.scss              全局样式
  manifest.json         平台配置
  pages.json            路由/页面配置
```

## Build, Test, and Development Commands
- Install deps: `npm install`.
- H5 dev server: `npm run dev:h5`; other targets via matching `dev:*` scripts (e.g., `dev:mp-weixin`).
- Production build (web): `npm run build:h5`; platform builds mirror the `build:*` scripts.
- Quality gates: `npm run lint` for ESLint, `npm run format` for Prettier, `npm run checkCode` to run both.

## Coding Style & Naming Conventions
- Vue 3 `<script setup>` with Composition API; components named and stored in PascalCase `.vue` files.
- Two-space indentation, single quotes, trailing semicolons avoided; enforced by ESLint/Prettier (`eslint.config.mjs`).
- Keep page files lean: delegate business logic to `src/api`/`src/store` and shared UI to `src/components`.
- Prefer `@/` imports over deep relative paths; align new paths with existing aliasing.

## Testing Guidelines
- No automated test suite yet; at minimum run `npm run lint` and `npm run format` before commits.
- When adding tests, co-locate near features (e.g., `src/.../__tests__/Feature.spec.ts`) and add scripts to `package.json`.
- For E2E/regression on mini-program targets, use `@dcloudio/uni-automator` (already in devDependencies).

## Commit & Pull Request Guidelines
- Use clear, action-oriented commit messages (e.g., `feat: add parent auth redirect`, `fix: guard teacher home load`).
- PR checklist: state affected platform(s), outline changes, and list verification commands/results.
- Attach screenshots or recordings for UI updates when possible; call out changes to `pages.json`/`manifest.json`.

## Configuration & Security Tips
- Do not commit secrets or platform keys; keep sensitive values out of `manifest.json` and load via runtime config where available.
- Auth flows start in `App.vue`; re-test parent/teacher redirects whenever modifying auth or store modules.
