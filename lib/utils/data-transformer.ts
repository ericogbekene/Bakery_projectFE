import { Product, Category, ProductWithCategory, CategoryWithProducts } from '@/lib/types/product';
import { ExternalProduct, ExternalCategory } from '@/lib/types/external-api';

/**
 * Transform external product data to internal product format
 */
export function transformExternalProduct(externalProduct: any): Product {
  return {
    id: externalProduct.id.toString(),
    title: externalProduct.name,
    description: externalProduct.name, // Use name as description if no description field
    image: externalProduct.image_url || externalProduct.thumbnail_url,
    price: parseFloat(externalProduct.price) || 0,
    categoryId: externalProduct.category_name, // Use category name as ID for now
    isActive: externalProduct.available !== false,
    createdAt: new Date(externalProduct.created_at),
    updatedAt: new Date(externalProduct.created_at), // Use created_at as updated_at if no updated_at
  };
}

/**
 * Transform external category data to internal category format
 */
export function transformExternalCategory(externalCategory: any): Category {
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
    price: product.price || 0,
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
export function validateExternalProduct(data: any): data is ExternalProduct {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.description === 'string' &&
    typeof data.image_url === 'string' &&
    typeof data.price === 'number' &&
    typeof data.category_id === 'string' &&
    typeof data.is_active === 'boolean' &&
    typeof data.created_at === 'string' &&
    typeof data.updated_at === 'string'
  );
}

/**
 * Validate external category data
 */
export function validateExternalCategory(data: any): data is ExternalCategory {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof data.id === 'string' &&
    typeof data.name === 'string' &&
    typeof data.description === 'string' &&
    typeof data.slug === 'string' &&
    typeof data.image_url === 'string' &&
    typeof data.is_active === 'boolean' &&
    typeof data.created_at === 'string' &&
    typeof data.updated_at === 'string'
  );
}

/**
 * Sanitize external data to prevent XSS and other security issues
 */
export function sanitizeExternalData<T extends Record<string, any>>(data: T): T {
  const sanitized = { ...data };
  
  // Sanitize string fields
  const stringFields = ['name', 'description', 'title', 'slug'];
  stringFields.forEach(field => {
    if (sanitized[field] && typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .trim();
    }
  });
  
  return sanitized;
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
    price: externalProduct.price || localProduct.price,
    isActive: externalProduct.is_active,
    updatedAt: new Date(externalProduct.updated_at),
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
