import { describe, it, expect } from 'vitest';
import { getProductKey } from './productKey';

describe('getProductKey', () => {
  it('returns product.id when present', () => {
    const product = {
      id: 'abc-123',
      category: 'Premium',
      brand: 'Royal Canin',
      name: 'Adult',
      weight: '3kg',
    };
    expect(getProductKey(product)).toBe('abc-123');
  });

  it('returns product.id as string when id is numeric', () => {
    const product = {
      id: '42',
      category: 'Premium',
      brand: 'Royal Canin',
      name: 'Adult',
      weight: '3kg',
    };
    expect(getProductKey(product)).toBe('42');
  });

  it('falls back to slug when id is empty string', () => {
    const product = {
      id: '',
      category: 'Premium',
      brand: 'Royal Canin',
      name: 'Adult',
      weight: '3kg',
    };
    expect(getProductKey(product)).toBe('premium-royal-canin-adult-3kg');
  });

  it('falls back to slug when id is whitespace-only', () => {
    const product = {
      id: '   ',
      category: 'Premium',
      brand: 'Royal Canin',
      name: 'Adult',
      weight: undefined,
    };
    expect(getProductKey(product)).toBe('premium-royal-canin-adult');
  });

  it('strips accents in slug fallback', () => {
    const product = {
      id: '',
      category: 'Alimento Económico',
      brand: 'Señor Can',
      name: 'Básico',
      weight: undefined,
    };
    expect(getProductKey(product)).toBe('alimento-economico-senor-can-basico');
  });

  it('filters out undefined fields', () => {
    const product = {
      id: '',
      category: 'Premium',
      brand: 'Royal Canin',
      name: 'Puppy',
      weight: undefined,
    };
    expect(getProductKey(product)).toBe('premium-royal-canin-puppy');
  });

  it('returns "unknown" when all fields are empty', () => {
    const product = {
      id: '',
      category: '',
      brand: '',
      name: '',
      weight: undefined,
    };
    expect(getProductKey(product)).toBe('unknown');
  });
});
