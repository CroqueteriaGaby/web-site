# Croqueteria Gaby

Landing page and product catalog for Croqueteria Gaby, a pet food store based in Mexico.

## Prerequisites

- Node.js 18+
- npm 9+

## Setup

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

| Script                 | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start Vite dev server           |
| `npm run build`        | Typecheck + production build    |
| `npm run preview`      | Preview production build        |
| `npm run test`         | Run Vitest tests                |
| `npm run test:watch`   | Run tests in watch mode         |
| `npm run lint`         | ESLint check                    |
| `npm run lint:fix`     | ESLint auto-fix                 |
| `npm run format`       | Prettier format all files       |
| `npm run format:check` | Prettier check (CI)             |
| `npm run typecheck`    | TypeScript type check (no emit) |

## Architecture

```
src/
  main.tsx                     # App entry point
  App.tsx                      # Router setup (/, /catalogo)
  App.css                      # Home page styles
  index.css                    # Global styles
  constants.ts                 # Shared constants (cloud name, WhatsApp, categories)
  types/
    product.ts                 # Product interface
  utils/
    images.ts                  # Image URL builder and error handler
    productKey.ts              # Stable product key generation
    pdfImageLoader.ts          # DOM-based image capture for PDF
  components/
    Home.tsx                   # Landing page
    Catalog.tsx                # Product catalog (search, filter, sort)
    Catalog.css                # Catalog styles
    Loader.tsx                 # Loading spinner
    Navbar.tsx                 # Navigation bar
    ProductModal.tsx           # Product detail modal with WhatsApp buy
    ProductModal.css           # Modal styles
    DownloadPDFButton.tsx      # PDF catalog download with progress
    pdf/
      CatalogPDF.tsx           # Full PDF document assembly
      CoverPage.tsx            # PDF cover page
      TableOfContents.tsx      # PDF table of contents
      CategorySection.tsx      # PDF category page
      ProductCard.tsx          # PDF product card
      PDFFooter.tsx            # PDF footer with page numbers
      PDFStyles.ts             # PDF stylesheet and slug utility
  data/
    catalog.json               # Product catalog data
```

### Data flow

1. `catalog.json` is imported statically as `Product[]`
2. `Catalog.tsx` filters, sorts, and groups products by brand/breed
3. `ProductModal.tsx` shows details and generates a WhatsApp order link
4. `DownloadPDFButton.tsx` captures product images from the DOM, then lazy-loads `@react-pdf/renderer` to build a PDF

## Deployment

The app is deployed on Vercel. Push to `main` to trigger a deploy.

## Tech stack

- React 18, TypeScript (strict), Vite 6
- React Router DOM 7 (client-side routing)
- @react-pdf/renderer (client-side PDF generation)
- Vitest + @testing-library/react (testing)
- ESLint 9 + Prettier + Husky + lint-staged (code quality)
