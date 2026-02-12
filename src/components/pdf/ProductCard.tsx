import { View, Text, Image } from '@react-pdf/renderer';
import type { Product } from '../../types/product';
import { styles } from './PDFStyles';

interface ProductCardProps {
  product: Product;
  imageData?: string;
}

function ProductCard({ product, imageData }: ProductCardProps) {
  return (
    <View style={styles.productCard} wrap={false}>
      <View style={styles.productImageContainer}>
        {imageData && <Image style={styles.productImage} src={imageData} />}
      </View>
      <Text style={styles.productName}>{product.name}</Text>
      {product.weight && <Text style={styles.productWeight}>{product.weight}</Text>}
      <Text style={styles.productPrice}>${product.price}</Text>
    </View>
  );
}

export default ProductCard;
