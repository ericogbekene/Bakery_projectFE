import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, ProductWithCategory } from '@/lib/types/product'
import { getCachedResponse, setCachedResponse, invalidateCache } from '@/lib/cache'

/**
 * GET /api/products
 * 
 * Retrieves a list of products with optional filtering and pagination.
 * Supports caching for improved performance.
 * 
 * @param request - The incoming HTTP request
 * @returns JSON response with products array or error message
 * 
 * @example
 * // Get all products
 * GET /api/products
 * 
 * // Get products by category
 * GET /api/products?category=signature-cakes
 * 
 * // Get products with pagination
 * GET /api/products?limit=10&offset=0
 */

export async function GET(request: NextRequest) {
  try {
    // Check cache first
    const cached = getCachedResponse(request)
    if (cached) {
      return NextResponse.json(cached)
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

                    const whereClause: { isActive: boolean; category?: { slug: string } } = { isActive: true }

    if (category) {
      whereClause.category = {
        slug: category
      }
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true
      },
      take: limit,
      skip: offset,
      orderBy: {
        createdAt: 'desc'
      }
    })

    const response: ApiResponse<ProductWithCategory[]> = {
      success: true,
      data: products as ProductWithCategory[],
      message: `Found ${products.length} products`
    }

    // Cache the response
    setCachedResponse(request, response)

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching products:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch products'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

/**
 * POST /api/products
 * 
 * Creates a new product in the database.
 * Validates required fields and ensures category exists.
 * Invalidates cache after successful creation.
 * 
 * @param request - The incoming HTTP request with product data
 * @returns JSON response with created product or error message
 * 
 * @example
 * POST /api/products
 * Content-Type: application/json
 * 
 * {
 *   "title": "New Cake",
 *   "description": "A delicious new cake",
 *   "image": "/assets/images/new-cake.webp",
 *   "price": 15000,
 *   "categoryId": "category-id"
 * }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, price, categoryId } = body

    // Validate required fields
    if (!title || !description || !image || !categoryId) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: title, description, image, categoryId'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if category exists
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        title,
        description,
        image,
        price: price || null,
        categoryId,
        isActive: true
      },
      include: {
        category: true
      }
    })

    const response: ApiResponse<ProductWithCategory> = {
      success: true,
      data: product as ProductWithCategory,
      message: 'Product created successfully'
    }

    // Invalidate cache for products
    invalidateCache('/api/products')

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating product:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create product'
    }

    return NextResponse.json(response, { status: 500 })
  }
} 