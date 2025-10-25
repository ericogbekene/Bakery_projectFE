import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, Category } from '@/lib/types/product'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'

    const categories = await prisma.category.findMany({
      include: includeProducts ? {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      } : undefined,
      orderBy: {
        name: 'asc'
      }
    })

    const response: ApiResponse<Category[]> = {
      success: true,
      data: categories as Category[],
      message: `Found ${categories.length} categories`
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching categories:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch categories'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, slug, image } = body

    // Validate required fields
    if (!name || !slug) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Missing required fields: name, slug'
      }
      return NextResponse.json(response, { status: 400 })
    }

    // Check if category with same slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (existingCategory) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category with this slug already exists'
      }
      return NextResponse.json(response, { status: 409 })
    }

    const category = await prisma.category.create({
      data: {
        name,
        description: description || null,
        slug,
        image: image || null
      }
    })

    const response: ApiResponse<Category> = {
      success: true,
      data: category as Category,
      message: 'Category created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to create category'
    }

    return NextResponse.json(response, { status: 500 })
  }
} 