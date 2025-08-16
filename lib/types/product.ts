export interface Product {
  id: string
  title: string
  description: string
  image: string
  price?: number
  categoryId: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  image?: string
  createdAt: Date
  updatedAt: Date
}

export interface ProductWithCategory extends Product {
  category: Category
}

export interface CategoryWithProducts extends Category {
  products: Product[]
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
} 