import React from 'react';
import { View, Text, Image } from '@react-pdf/renderer';
import { styles } from './PDFStyles';

function ProductCard({ product, imageData }) {
    return (
        <View style={styles.productCard} wrap={false}>
            <View style={styles.productImageContainer}>
                {imageData && (
                    <Image style={styles.productImage} src={imageData} />
                )}
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            {product.weight && (
                <Text style={styles.productWeight}>{product.weight}</Text>
            )}
            <Text style={styles.productPrice}>${product.price}</Text>
        </View>
    );
}

export default ProductCard;
