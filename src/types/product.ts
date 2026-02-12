export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  breed: string;
  price: number;
  image: string;
  weight?: string;
  original_product?: string;
  popularity?: number;
}
