import { Document } from '@react-pdf/renderer';
import type { Product } from '../../types/product';
import CoverPage from './CoverPage';
import TableOfContents from './TableOfContents';
import CategorySection from './CategorySection';

const CATEGORIES = [
  'Alimento Economico',
  'Alimento Premium',
  'Sobres - Pouches Y Premios',
  'Arena para Gatos',
];

interface OrganizedCategory {
  category: string;
  brands: string[];
  groupedByBrand: Record<string, Record<string, Product[]>>;
  products: Product[];
}

function organizeByCategory(catalogData: Product[]): OrganizedCategory[] {
  const result: OrganizedCategory[] = [];

  for (const category of CATEGORIES) {
    const products = catalogData.filter((item) => {
      const normalized = item.category.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return normalized === category;
    });

    if (products.length === 0) continue;

    const groupedByBrand: Record<string, Record<string, Product[]>> = {};
    products.forEach((item) => {
      if (!groupedByBrand[item.brand]) groupedByBrand[item.brand] = {};
      if (!groupedByBrand[item.brand]![item.breed]) groupedByBrand[item.brand]![item.breed] = [];
      groupedByBrand[item.brand]![item.breed]!.push(item);
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

interface CatalogPDFProps {
  catalogData: Product[];
  imageCache: Record<string, string>;
  logoBase64: string | null;
}

function CatalogPDF({ catalogData, imageCache, logoBase64 }: CatalogPDFProps) {
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
