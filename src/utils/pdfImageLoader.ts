import type { Product } from '../types/product';
import { getProductKey } from './productKey';

const CLOUD_NAME = 'df3mkkfdo';

/** Max width used when drawing images to canvas for PDF (matches ProductCard display size). */
const PDF_IMAGE_MAX_WIDTH = 150;

/** JPEG quality for PDF product images. */
const PDF_IMAGE_JPEG_QUALITY = 0.7;

function getImageUrl(product: Product): string {
  if (product.image && product.image.startsWith('http')) return product.image;

  let imageName = product.image || product.name;
  if (imageName.startsWith('productos/')) {
    imageName = imageName.replace('productos/', '');
  }
  imageName = imageName.replace(/\.(jpg|png|webp|jpeg)$/i, '');
  imageName = imageName.trim();

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/v1/${imageName}.jpg`;
}

export function captureImagesFromDom(products: Product[]): Record<string, string> {
  const cache: Record<string, string> = {};
  for (const product of products) {
    const key = getProductKey(product);
    const img = document.querySelector(
      `img.card-image[data-product-id="${CSS.escape(key)}"]`,
    ) as HTMLImageElement | null;
    if (!img || !img.complete || img.naturalWidth === 0) continue;

    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, PDF_IMAGE_MAX_WIDTH / img.naturalWidth);
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      cache[key] = canvas.toDataURL('image/jpeg', PDF_IMAGE_JPEG_QUALITY);
    } catch {
      // Skip; buildImageCacheFromDom will use placeholder for this product.
    }
  }
  return cache;
}

export function buildImageCacheFromDom(
  products: Product[],
  domCache: Record<string, string>,
): Record<string, string> {
  const PLACEHOLDER = generatePlaceholderDataUrl();
  const cache: Record<string, string> = { ...domCache };
  for (const product of products) {
    const key = getProductKey(product);
    if (cache[key] == null) {
      cache[key] = PLACEHOLDER;
    }
  }
  return cache;
}

function generatePlaceholderDataUrl(): string {
  const canvas = document.createElement('canvas');
  canvas.width = 150;
  canvas.height = 150;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#FFF0F0';
  ctx.fillRect(0, 0, 150, 150);

  ctx.fillStyle = '#FF6B6B';
  ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Sin Foto', 75, 75);

  return canvas.toDataURL('image/png');
}

function loadSingleImage(product: Product): Promise<string> {
  const url = getImageUrl(product);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const timeout = setTimeout(() => {
      img.src = '';
      reject(new Error('timeout'));
    }, 8000);

    img.onload = () => {
      clearTimeout(timeout);
      try {
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, PDF_IMAGE_MAX_WIDTH / img.naturalWidth);
        canvas.width = img.naturalWidth * scale;
        canvas.height = img.naturalHeight * scale;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', PDF_IMAGE_JPEG_QUALITY));
      } catch (e) {
        reject(e);
      }
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('load failed'));
    };

    img.src = url;
  });
}

export async function preloadImages(
  products: Product[],
  onProgress: (loaded: number, total: number) => void,
): Promise<Record<string, string>> {
  const cache: Record<string, string> = {};
  const urlToDataUrl: Record<string, string> = {};
  const PLACEHOLDER = generatePlaceholderDataUrl();
  const CONCURRENCY = 6;

  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((product) => {
        const url = getImageUrl(product);
        if (urlToDataUrl[url] !== undefined) {
          return Promise.resolve(urlToDataUrl[url]!);
        }
        return loadSingleImage(product).then((dataUrl) => {
          urlToDataUrl[url] = dataUrl;
          return dataUrl;
        });
      }),
    );

    results.forEach((result, idx) => {
      const product = batch[idx]!;
      const key = getProductKey(product);
      cache[key] = result.status === 'fulfilled' ? result.value : PLACEHOLDER;
    });

    onProgress(Math.min(i + CONCURRENCY, products.length), products.length);
  }

  return cache;
}

export async function preloadMissingImages(
  products: Product[],
  existingCache: Record<string, string>,
  onProgress: (loaded: number, total: number) => void,
): Promise<Record<string, string>> {
  const missing = products.filter((p) => !existingCache[getProductKey(p)]);
  if (missing.length === 0) {
    onProgress(products.length, products.length);
    return { ...existingCache };
  }

  const loaded = await preloadImages(missing, (loadedCount) => {
    onProgress(Object.keys(existingCache).length + loadedCount, products.length);
  });
  return { ...existingCache, ...loaded };
}

export async function loadLogoAsBase64(logoUrl: string): Promise<string | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch {
        resolve(null);
      }
    };
    img.onerror = () => resolve(null);
    img.src = logoUrl;
  });
}
