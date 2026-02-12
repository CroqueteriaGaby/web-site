import type { Product } from '../types/product';
import { CLOUD_NAME, PLACEHOLDER_IMAGE_URL } from '../constants';

/**
 * Build the Cloudinary URL for a product image. If the product already has a
 * full HTTP URL in its `image` field, that URL is returned as-is.
 */
export function getProductImageUrl(product: Pick<Product, 'image' | 'name'>): string {
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
 * Generic `onError` handler for `<img>` elements that replaces the broken
 * image with a branded placeholder. Prevents infinite error loops by clearing
 * `onerror` before setting the fallback `src`.
 */
export function handleImageError(e: React.SyntheticEvent<HTMLImageElement>): void {
  const img = e.currentTarget;
  img.onerror = null;
  img.src = PLACEHOLDER_IMAGE_URL;
}
