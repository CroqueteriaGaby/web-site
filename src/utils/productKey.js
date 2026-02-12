/**
 * Stable key for a product used for DOM selectors and image cache lookups.
 * The original catalog has some products without `id` and some duplicate ids,
 * which caused wrong/repeated images in the PDF (cache collapse). This key
 * ensures every product has a unique, stable key so we never assign one
 * product's image to another.
 *
 * @param {{ id?: string, category?: string, brand?: string, name?: string, weight?: string }} product
 * @returns {string}
 */
export function getProductKey(product) {
  if (product.id != null && String(product.id).trim() !== '') {
    return String(product.id);
  }
  const parts = [product.category, product.brand, product.name, product.weight].filter(Boolean);
  return slug(parts.join('|'));
}

function slug(str) {
  return (
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || 'unknown'
  );
}
