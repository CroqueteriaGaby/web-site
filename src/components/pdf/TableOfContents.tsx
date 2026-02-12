import { Page, View, Text, Link } from '@react-pdf/renderer';
import PDFFooter from './PDFFooter';
import { styles, toSlug } from './PDFStyles';

interface TableOfContentsProps {
  categoriesData: Array<{ category: string; brands: string[] }>;
}

function TableOfContents({ categoriesData }: TableOfContentsProps) {
  return (
    <Page size="A4" style={styles.page}>
      <Text style={styles.tocTitle}>Contenido</Text>

      {categoriesData.map(({ category, brands }) => (
        <View key={category}>
          <Link src={`#cat-${toSlug(category)}`}>
            <View style={styles.tocRow}>
              <Text style={styles.tocCategoryName}>{category}</Text>
            </View>
          </Link>

          {brands.map((brand) => (
            <Link key={brand} src={`#brand-${toSlug(category)}-${toSlug(brand)}`}>
              <View style={styles.tocBrandRow}>
                <Text style={styles.tocBrandName}>{brand}</Text>
              </View>
            </Link>
          ))}

          <View style={styles.tocSectionDivider} />
        </View>
      ))}

      <PDFFooter />
    </Page>
  );
}

export default TableOfContents;
