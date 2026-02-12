import { describe, it, expect } from 'vitest';
import { getProductImageUrl, handleImageError } from './images';
import { PLACEHOLDER_IMAGE_URL } from '../constants';

describe('getProductImageUrl', () => {
  it('returns full HTTP URL as-is', () => {
    const product = { image: 'https://example.com/photo.jpg', name: 'Test' };
    expect(getProductImageUrl(product)).toBe('https://example.com/photo.jpg');
  });

  it('returns full HTTP URL even for http (non-https)', () => {
    const product = { image: 'http://example.com/photo.jpg', name: 'Test' };
    expect(getProductImageUrl(product)).toBe('http://example.com/photo.jpg');
  });

  it('builds Cloudinary URL from product name when image is missing', () => {
    const product = { image: '', name: 'Royal Canin Adult' };
    const url = getProductImageUrl(product);
    expect(url).toContain('res.cloudinary.com');
    expect(url).toContain('Royal Canin Adult');
    expect(url).toContain('.jpg');
  });

  it('strips "productos/" prefix from image field', () => {
    const product = { image: 'productos/my-product', name: 'Fallback' };
    const url = getProductImageUrl(product);
    expect(url).toContain('my-product');
    expect(url).not.toContain('productos/');
  });

  it('strips file extensions from image field', () => {
    const product = { image: 'my-product.png', name: 'Fallback' };
    const url = getProductImageUrl(product);
    expect(url).not.toContain('.png');
    expect(url).toContain('my-product.jpg');
  });

  it('trims whitespace from image name', () => {
    const product = { image: '  spaced  ', name: 'Fallback' };
    const url = getProductImageUrl(product);
    expect(url).toContain('spaced');
    expect(url).not.toContain('  ');
  });
});

describe('handleImageError', () => {
  it('sets placeholder src and clears onerror', () => {
    const img = { onerror: () => {}, src: 'broken.jpg' } as unknown as HTMLImageElement;
    const event = { currentTarget: img } as React.SyntheticEvent<HTMLImageElement>;

    handleImageError(event);

    expect(img.src).toBe(PLACEHOLDER_IMAGE_URL);
    expect(img.onerror).toBeNull();
  });
});
