#!/usr/bin/env node
/**
 * Ensures every product in catalog.json has a unique `id`.
 * Products missing `id` get one from: categorySlug_brandSlug_nameSlug_weightSlug.
 * Collisions are resolved by appending _2, _3, etc.
 *
 * Run from repo root: node scripts/fix-catalog-ids.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, '../src/data/catalog.json');

const CATEGORY_SLUG = {
    'Alimento Económico': 'economico',
    'Alimento Premium': 'premium',
    'Sobres - Pouches Y Premios': 'sobres',
    'Arena para Gatos': 'arena',
};

function slug(str) {
    if (str == null || str === '') return '';
    return String(str)
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

function categorySlug(category) {
    return CATEGORY_SLUG[category] || slug(category) || 'other';
}

function generateId(product) {
    const c = categorySlug(product.category);
    const b = slug(product.brand);
    const n = slug(product.name);
    const w = slug(product.weight);
    const parts = [c, b, n, w].filter(Boolean);
    return parts.join('_') || 'product';
}

function main() {
    const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    const usedIds = new Set(catalog.map((p) => p.id).filter(Boolean));

    let assigned = 0;
    for (const product of catalog) {
        if (product.id != null && String(product.id).trim() !== '') continue;

        let candidate = generateId(product);
        let suffix = 1;
        while (usedIds.has(candidate)) {
            candidate = `${generateId(product)}_${suffix}`;
            suffix += 1;
        }
        usedIds.add(candidate);
        product.id = candidate;
        assigned += 1;
    }

    fs.writeFileSync(CATALOG_PATH, JSON.stringify(catalog, null, 2) + '\n', 'utf8');
    console.log(`Assigned ${assigned} unique id(s). All ${catalog.length} products now have an id.`);
}

main();
