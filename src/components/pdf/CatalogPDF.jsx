import React from 'react';
import { Document } from '@react-pdf/renderer';
import CoverPage from './CoverPage';
import TableOfContents from './TableOfContents';
import CategorySection from './CategorySection';

const CATEGORIES = [
  'Alimento Economico',
  'Alimento Premium',
  'Sobres - Pouches Y Premios',
  'Arena para Gatos',
];

function organizeByCategory(catalogData) {
  const result = [];

  for (const category of CATEGORIES) {
    const products = catalogData.filter((item) => {
      const normalized = item.category.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalized === category;
    });

    if (products.length === 0) continue;

    const groupedByBrand = {};
    products.forEach((item) => {
      if (!groupedByBrand[item.brand]) groupedByBrand[item.brand] = {};
      if (!groupedByBrand[item.brand][item.breed]) groupedByBrand[item.brand][item.breed] = [];
      groupedByBrand[item.brand][item.breed].push(item);
    });

    const brands = Object.keys(groupedByBrand);

    result.push({
      category,
      brands,
      groupedByBrand,
      products,
    });
  }

  return result;
}

function CatalogPDF({ catalogData, imageCache, logoBase64 }) {
  const organized = organizeByCategory(catalogData);

  const tocData = organized.map(({ category, brands }) => ({
    category,
    brands,
  }));

  return (
    <Document
      title="Catalogo Croqueteria Gaby"
      author="Croqueteria Gaby"
      subject="Catalogo de Productos para Mascotas"
    >
      <CoverPage logoBase64={logoBase64} />
      <TableOfContents categoriesData={tocData} />
      {organized.map(({ category, groupedByBrand }) => (
        <CategorySection
          key={category}
          category={category}
          groupedByBrand={groupedByBrand}
          imageCache={imageCache}
        />
      ))}
    </Document>
  );
}

export default CatalogPDF;
