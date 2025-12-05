import { Product, Category, ProductWithCategory, CategoryWithProducts } from '@/lib/types/product';
import { ExternalProduct, ExternalCategory } from '@/lib/types/external-api';

/**
 * Transform external product data to internal product format
 */
export function transformExternalProduct(externalProduct: ExternalProduct): Product {
  return {
    id: externalProduct.id.toString(),
    title: externalProduct.name,
    description: externalProduct.description || externalProduct.name, // Use name as fallback
    image: externalProduct.image_url || externalProduct.thumbnail_url,
    price: parseFloat(externalProduct.price) || 0,
    categoryId: externalProduct.category_name,
    isActive: externalProduct.available,
    createdAt: new Date(externalProduct.created_at),
    updatedAt: new Date(externalProduct.updated_at || externalProduct.created_at),
  };
}

/**
 * Transform external category data to internal category format
 */
export function transformExternalCategory(externalCategory: ExternalCategory): Category {
  return {
    id: externalCategory.id.toString(),
    name: externalCategory.name,
    description: externalCategory.name, // Use name as description if no description field
    slug: externalCategory.slug,
    image: undefined, // No image field in external API
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Transform external product with category to internal format
 */
export function transformExternalProductWithCategory(
  externalProduct: ExternalProduct,
  externalCategory: ExternalCategory
): ProductWithCategory {
  const product = transformExternalProduct(externalProduct);
  const category = transformExternalCategory(externalCategory);
  
  return {
    ...product,
    category,
  };
}

/**
 * Transform external category with products to internal format
 */
export function transformExternalCategoryWithProducts(
  externalCategory: ExternalCategory,
  externalProducts: ExternalProduct[]
): CategoryWithProducts {
  const category = transformExternalCategory(externalCategory);
  const products = externalProducts.map(transformExternalProduct);
  
  return {
    ...category,
    products,
  };
}

/**
 * Transform internal product to external format (for API calls)
 */
export function transformToExternalProduct(product: Product): Partial<ExternalProduct> {
  return {
    name: product.title,
    description: product.description,
    image_url: product.image,
    price: (product.price || 0).toString(),
    is_active: product.isActive,
  };
}

/**
 * Transform internal category to external format (for API calls)
 */
export function transformToExternalCategory(category: Category): Partial<ExternalCategory> {
  return {
    name: category.name,
    description: category.description || '',
    slug: category.slug,
    image_url: category.image || '',
    is_active: true,
  };
}

/**
 * Validate external product data
 */
export function validateExternalProduct(data: unknown): data is ExternalProduct {
  const product = data as ExternalProduct;
  return (
    typeof product === 'object' &&
    product !== null &&
    typeof product.id === 'string' &&
    typeof product.name === 'string' &&
    typeof product.description === 'string' &&
    typeof product.image_url === 'string' &&
    typeof product.price === 'number' &&
    typeof product.category_id === 'string' &&
    typeof product.is_active === 'boolean' &&
    typeof product.created_at === 'string' &&
    typeof product.updated_at === 'string'
  );
}

/**
 * Validate external category data
 */
export function validateExternalCategory(data: unknown): data is ExternalCategory {
  const category = data as ExternalCategory;
  return (
    typeof category === 'object' &&
    category !== null &&
    typeof category.id === 'string' &&
    typeof category.name === 'string' &&
    typeof category.description === 'string' &&
    typeof category.slug === 'string' &&
    typeof category.image_url === 'string' &&
    typeof category.is_active === 'boolean' &&
    typeof category.created_at === 'string' &&
    typeof category.updated_at === 'string'
  );
}

/**
 * Sanitize external data to prevent XSS and other security issues
 */
export function sanitizeExternalData<T extends Record<string, unknown>>(data: T): T {
  const sanitized: Record<string, unknown> = {};
  
  for (const key in data) {
    const value = data[key];
    if (typeof value === 'string' && ['name', 'description', 'title', 'slug'].includes(key)) {
        sanitized[key] = value
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/javascript:/gi, '')
            .trim();
    } else {
        sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Merge external and local data, prioritizing external data
 */
export function mergeProductData(
  localProduct: Product,
  externalProduct: ExternalProduct
): Product {
  return {
    ...localProduct,
    title: externalProduct.name || localProduct.title,
    description: externalProduct.description || localProduct.description,
    image: externalProduct.image_url || localProduct.image,
    price: parseFloat(externalProduct.price) || localProduct.price,
    isActive: externalProduct.is_active ?? localProduct.isActive,
    updatedAt: new Date(externalProduct.updated_at || localProduct.updatedAt),
  };
}

/**
 * Merge external and local category data
 */
export function mergeCategoryData(
  localCategory: Category,
  externalCategory: ExternalCategory
): Category {
  return {
    ...localCategory,
    name: externalCategory.name || localCategory.name,
    description: externalCategory.description || localCategory.description,
    image: externalCategory.image_url || localCategory.image,
    updatedAt: new Date(externalCategory.updated_at),
  };
}