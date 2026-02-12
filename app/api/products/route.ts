import { NextRequest, NextResponse } from 'next/server'
// Internal API removed. Only external API is used.
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