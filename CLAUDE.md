# CLAUDE.md

## Project overview

Croqueteria Gaby is a React 18 + Vite 6 SPA for a pet food store. It has two routes:

- `/` — Landing page with contact info and CTA
- `/catalogo` — Product catalog with search, filter, sort, modal, and PDF export

## Commands

```bash
npm run dev          # Start dev server (localhost:5173)
npm run build        # Typecheck + production build
npm run test         # Run all tests
npm run test:watch   # Watch mode
npm run lint         # ESLint
npm run lint:fix     # ESLint with auto-fix
npm run format       # Prettier write
npm run format:check # Prettier check
npm run typecheck    # TypeScript type check
```

## Key files

- `src/types/product.ts` — Product interface (used everywhere)
- `src/constants.ts` — CLOUD_NAME, WHATSAPP_NUMBER, PLACEHOLDER_IMAGE_URL, CATEGORIES
- `src/utils/images.ts` — `getProductImageUrl()`, `handleImageError()`
- `src/utils/productKey.ts` — `getProductKey()` for stable product IDs
- `src/data/catalog.json` — Product data (imported as `Product[]`)

## Coding conventions

- TypeScript strict mode with `noUncheckedIndexedAccess`
- No `any` — use proper types or `unknown` with narrowing
- Named function declarations for components: `function Foo() {}`
- Import types with `import type { ... }` syntax
- Use constants from `src/constants.ts`, not magic strings
- Use shared utilities from `src/utils/`, not inline duplicates

## Testing

- Vitest + @testing-library/react + happy-dom
- Test files: `*.test.ts` / `*.test.tsx` colocated with source
- The Catalog component has a 1500ms loading timer; tests use `vi.useFakeTimers()` and `vi.advanceTimersByTime(1500)` to skip it

## Pre-commit hooks

Husky runs lint-staged on commit. If source files (`src/` or `package.json`) change, `CHANGELOG.md` must also be updated.

## Important notes

- `scripts/update-catalog-images.js` is intentionally plain JS (not TypeScript)
- PDF generation uses DOM capture (`captureImagesFromDom`) to avoid CORS issues
- `@react-pdf/renderer` is lazy-loaded via `import()` to reduce initial bundle
- Product keys use `getProductKey()` (not just `product.id`) because some products have missing or duplicate IDs
