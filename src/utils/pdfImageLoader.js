import { getProductKey } from './productKey';

const CLOUD_NAME = 'df3mkkfdo';

/** Max width used when drawing images to canvas for PDF (matches ProductCard display size). */
const PDF_IMAGE_MAX_WIDTH = 150;

/** JPEG quality for PDF product images. */
const PDF_IMAGE_JPEG_QUALITY = 0.7;

function getImageUrl(product) {
  if (product.image && product.image.startsWith('http')) return product.image;

  let imageName = product.image || product.name;
  if (imageName.startsWith('productos/')) {
    imageName = imageName.replace('productos/', '');
  }
  imageName = imageName.replace(/\.(jpg|png|webp|jpeg)$/i, '');
  imageName = imageName.trim();

  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/f_auto,q_auto,w_500/v1/${imageName}.jpg`;
}

/**
 * Captures product images from the current page DOM. Use when the catalog is visible
 * so we get exactly the pixels the user sees (avoids CORS and wrong URLs).
 * Uses getProductKey(product) so products without or with duplicate ids still get
 * the correct image (no cache collapse).
 *
 * @param {Array<object>} products - Full catalog product list.
 * @returns {Record<string, string>} Map of product key -> data URL (only for captured products).
 */
export function captureImagesFromDom(products) {
  const cache = {};
  for (const product of products) {
    const key = getProductKey(product);
    const img = document.querySelector(`img.card-image[data-product-id="${CSS.escape(key)}"]`);
    if (!img || !img.complete || img.naturalWidth === 0) continue;

    try {
      const canvas = document.createElement('canvas');
      const scale = Math.min(1, PDF_IMAGE_MAX_WIDTH / img.naturalWidth);
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      cache[key] = canvas.toDataURL('image/jpeg', PDF_IMAGE_JPEG_QUALITY);
    } catch {
      // Skip; buildImageCacheFromDom will use placeholder for this product.
    }
  }
  return cache;
}

/**
 * Builds the full image cache for the PDF using only DOM-captured images.
 * Any product not captured (not in DOM or img not loaded) gets the "Sin Foto"
 * placeholder. We never fetch by URL here, so the PDF never shows a wrong
 * image from the catalog (e.g. same URL for different products).
 *
 * @param {Array<object>} products - Full catalog product list.
 * @param {Record<string, string>} domCache - Result of captureImagesFromDom(products).
 * @returns {Record<string, string>} Complete product key -> data URL map.
 */
export function buildImageCacheFromDom(products, domCache) {
  const PLACEHOLDER = generatePlaceholderDataUrl();
  const cache = { ...domCache };
  for (const product of products) {
    const key = getProductKey(product);
    if (cache[key] == null) {
      cache[key] = PLACEHOLDER;
    }
  }
  return cache;
}

function generatePlaceholderDataUrl() {
  const canvas = document.createElement('canvas');
  canvas.width = 150;
  canvas.height = 150;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#FFF0F0';
  ctx.fillRect(0, 0, 150, 150);

  ctx.fillStyle = '#FF6B6B';
  ctx.font = 'bold 14px Helvetica, Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Sin Foto', 75, 75);

  return canvas.toDataURL('image/png');
}

function loadSingleImage(product) {
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
        const ctx = canvas.getContext('2d');
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

/**
 * Preloads images by URL. Cache is keyed by getProductKey(product) so it merges
 * correctly with DOM capture. Reuses the same data URL for products that share
 * the same image URL.
 */
export async function preloadImages(products, onProgress) {
  const cache = {};
  const urlToDataUrl = {};
  const PLACEHOLDER = generatePlaceholderDataUrl();
  const CONCURRENCY = 6;

  for (let i = 0; i < products.length; i += CONCURRENCY) {
    const batch = products.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map((product) => {
        const url = getImageUrl(product);
        if (urlToDataUrl[url] !== undefined) {
          return Promise.resolve(urlToDataUrl[url]);
        }
        return loadSingleImage(product).then((dataUrl) => {
          urlToDataUrl[url] = dataUrl;
          return dataUrl;
        });
      }),
    );

    results.forEach((result, idx) => {
      const product = batch[idx];
      const key = getProductKey(product);
      cache[key] = result.status === 'fulfilled' ? result.value : PLACEHOLDER;
    });

    onProgress(Math.min(i + CONCURRENCY, products.length), products.length);
  }

  return cache;
}

/**
 * Loads images only for products missing from existingCache (e.g. after DOM capture).
 * Uses getProductKey for keys so merge matches DOM cache. Returns merged cache.
 */
export async function preloadMissingImages(products, existingCache, onProgress) {
  const missing = products.filter((p) => !existingCache[getProductKey(p)]);
  if (missing.length === 0) {
    onProgress(products.length, products.length);
    return { ...existingCache };
  }

  const loaded = await preloadImages(missing, (loaded, total) => {
    onProgress(Object.keys(existingCache).length + loaded, products.length);
  });
  return { ...existingCache, ...loaded };
}

export async function loadLogoAsBase64(logoUrl) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
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
