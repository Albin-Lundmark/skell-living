export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  thumbnail: string
  images: string[]
  brand?: string
  sku?: string
  weight?: number
  dimensions?: {
    width: number
    height: number
    depth: number
  }
  warrantyInformation?: string
  shippingInformation?: string
  availabilityStatus?: string
  returnPolicy?: string
  minimumOrderQuantity?: number
  reviews?: ProductReview[]
  meta?: {
    barcode?: string
  }
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface ProductResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export type CategoryFilter = 'all' | 'furniture' | 'home-decoration'
