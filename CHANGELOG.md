# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESLint 9 flat config with React, React Hooks, and TypeScript rules
- Prettier formatting with single quotes and trailing commas
- Husky pre-commit hooks with lint-staged
- `Product` type interface and shared constants (`CLOUD_NAME`, `WHATSAPP_NUMBER`, `CATEGORIES`)
- Shared utilities: `getProductImageUrl()`, `handleImageError()`, `getProductKey()`
- Unit tests for `productKey` and `images` utilities (14 tests)
- README with architecture overview, scripts table, and deployment guide
- CONTRIBUTING guide with commit conventions and PR checklist
- CLAUDE.md for AI assistant context
- CHANGELOG with pre-commit enforcement

### Changed

- Converted all 20 source files from JavaScript/JSX to TypeScript/TSX
- Replaced duplicated image URL logic across Catalog, ProductModal, and pdfImageLoader with shared `getProductImageUrl()`
- Replaced duplicated `handleImageError` across Catalog and ProductModal with shared utility
- Replaced hardcoded WhatsApp number with `WHATSAPP_NUMBER` constant
- Replaced inline category arrays with shared `CATEGORIES` constant
- Moved CTA button inline styles (20+ lines) to CSS class
- Replaced hardcoded copyright year with dynamic `new Date().getFullYear()`
- Simplified ProductModal quantity controls with direct onClick handlers
- Updated broken test assertions to match current UI text

### Removed

- Unused `Layout` component and `Layout.css`
- Dead `.thumbnails` / `.thumb` CSS from `ProductModal.css`
- Unnecessary `import React` from all components (JSX transform handles it)
