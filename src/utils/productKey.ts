import type { Product } from '../types/product';

export function getProductKey(
  product: Pick<Product, 'id' | 'category' | 'brand' | 'name' | 'weight'>,
): string {
  if (product.id != null && String(product.id).trim() !== '') {
    return String(product.id);
  }
  const parts = [product.category, product.brand, product.name, product.weight].filter(Boolean);
  return slug(parts.join('|'));
}

function slug(str: string): string {
  return (
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'unknown'
  );
}
