import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db/prisma'
import { ApiResponse, ProductWithCategory } from '@/lib/types/product'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: {
        id: id,
        isActive: true
      },
      include: {
        category: true
      }
    })

    if (!product) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    const response: ApiResponse<ProductWithCategory> = {
      success: true,
      data: product as ProductWithCategory
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching product:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch product'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, image, price, categoryId, isActive } = body

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // If categoryId is provided, check if category exists
    if (categoryId) {
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
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(image && { image }),
        ...(price !== undefined && { price }),
        ...(categoryId && { categoryId }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        category: true
      }
    })

    const response: ApiResponse<ProductWithCategory> = {
      success: true,
      data: product as ProductWithCategory,
      message: 'Product updated successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error updating product:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to update product'
    }

    return NextResponse.json(response, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id }
    })

    if (!existingProduct) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Product not found'
      }
      return NextResponse.json(response, { status: 404 })
    }

    // Soft delete by setting isActive to false
    await prisma.product.update({
      where: { id },
      data: { isActive: false }
    })

    const response: ApiResponse<null> = {
      success: true,
      message: 'Product deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error deleting product:', error)
    
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to delete product'
    }

    return NextResponse.json(response, { status: 500 })
  }
} 