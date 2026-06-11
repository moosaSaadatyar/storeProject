export interface IProductCard {
  id?: number;
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  oldPrice?: number;
  discount?: number;
  inStock?: boolean;
}