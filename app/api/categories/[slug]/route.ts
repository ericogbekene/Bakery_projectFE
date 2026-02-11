import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, CategoryWithProducts, Category } from '@/lib/types/product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') !== 'false'
    const { slug } = await params

    const category = await prisma.category.findUnique({
      where: {
        slug: slug
      },
      include: includeProducts ? {
        products: {
          where: { isActive: true },
          orderBy: { createdAt: 'desc' }
        }
      } : undefined
    })

    if (!category) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<CategoryWithProducts> = {
      success: true,
      data: category as CategoryWithProducts
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching category:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch category'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const body = await request.json()
    const { name, description, image } = body

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (!existingCategory) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const category = await prisma.category.update({
      where: { slug },
      data: {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(image !== undefined && { image })
      }
    })

    const response: ApiResponse<Category> = {
      success: true,
      data: category as Category,
      message: 'Category updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating category:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update category'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params

    // Check if category exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug }
    })

    if (!existingCategory) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Category not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Check if category has products
    const productsCount = await prisma.product.count({
      where: { 
        categoryId: existingCategory.id,
        isActive: true
      }
    })

    if (productsCount > 0) {
      const response: ApiResponse<null> = {
        success: false,
        error: `Cannot delete category. It has ${productsCount} active products.`
      }
      return NextResponse.json(response, { status: 400 })
    }

    await prisma.category.delete({
      where: { slug }
    })

    const response: ApiResponse<null> = {
      success: true,
      message: 'Category deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting category:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete category'
    }

    return NextResponse.json(response, { status: 500 })
  }
} 