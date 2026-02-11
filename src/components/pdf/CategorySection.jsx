import React from 'react';
import { Page, View, Text } from '@react-pdf/renderer';
import ProductCard from './ProductCard';
import PDFFooter from './PDFFooter';
import { styles, toSlug } from './PDFStyles';

function CategorySection({ category, groupedByBrand, imageCache }) {
    return (
        <Page size="A4" style={styles.page}>
            <View id={`cat-${toSlug(category)}`}>
                <View style={styles.categoryBanner}>
                    <Text style={styles.categoryTitle}>{category}</Text>
                </View>
            </View>

            {Object.keys(groupedByBrand).map((brand) => (
                <View key={brand} id={`brand-${toSlug(category)}-${toSlug(brand)}`}>
                    <Text style={styles.brandTitle}>{brand}</Text>

                    {Object.keys(groupedByBrand[brand]).map((breed) => (
                        <View key={breed}>
                            <Text style={styles.breedTitle}>{breed}</Text>
                            <View style={styles.productsRow}>
                                {groupedByBrand[brand][breed].map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        imageData={imageCache[product.id]}
                                    />
                                ))}
                            </View>
                        </View>
                    ))}
                </View>
            ))}

            <PDFFooter />
        </Page>
    );
}

export default CategorySection;
