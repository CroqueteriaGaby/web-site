# Contributing

## Branch naming

Use prefixes: `feat/`, `fix/`, `refactor/`, `chore/`, `docs/`, `test/`.

## Commit conventions

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product search by category
fix: correct price rounding in modal
refactor: extract image utility functions
chore: update dependencies
docs: add architecture section to README
test: add productKey edge case tests
```

## Pre-commit hooks

Husky + lint-staged run automatically on `git commit`:

- `eslint --fix` on `.ts`, `.tsx`, `.js`, `.jsx`
- `prettier --write` on all staged files

If a hook blocks your commit, fix the issue and commit again. Use `--no-verify` only for formatting-only changes.

## PR checklist

Before opening a PR, ensure all checks pass:

```bash
npm run lint          # zero errors
npm run format:check  # all files formatted
npm run typecheck     # zero type errors
npm run test          # all tests pass
npm run build         # production build succeeds
```

## Code style

- TypeScript strict mode, avoid `any`
- Prefer type inference over explicit annotations where obvious
- Use named function declarations for components (`function Foo()`)
- Use shared constants from `src/constants.ts` instead of magic strings
- Use shared utilities from `src/utils/` instead of duplicating logic

## Testing

- Test runner: Vitest + @testing-library/react
- Place test files next to the code they test (`*.test.ts` / `*.test.tsx`)
- Write tests for utilities first, then component behavior
- Use `screen.getByRole` / `getByLabelText` over `getByText` where possible

## Changelog

Update `CHANGELOG.md` when changing source files. The pre-commit hook enforces this for changes to `src/` or `package.json`.
