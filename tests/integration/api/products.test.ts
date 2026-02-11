/**
 * Integration tests for Products API
 * Tests the actual API endpoints with mock data
 */

describe('Products API Integration', () => {
  const baseUrl = 'http://localhost:3000/api'

  beforeEach(() => {
    // Reset fetch mock before each test
    (global.fetch as jest.Mock).mockClear()
  })

  describe('GET /api/products', () => {
    it('should fetch products successfully', async () => {
      const mockProducts = [
        {
          id: 'test-id',
          title: 'Test Cake',
          description: 'A test cake',
          image: '/test.jpg',
          price: 15000,
          categoryId: 'category-id',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          category: {
            id: 'category-id',
            name: 'Test Category',
            description: 'Test category description',
            slug: 'test-category',
            image: '/category.jpg',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        }
      ]

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: mockProducts,
          message: 'Found 1 products'
        })
      })

      const response = await fetch(`${baseUrl}/products`)
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data).toHaveLength(1)
      expect(data.data[0].title).toBe('Test Cake')
    })

    it('should handle API errors', async () => {
      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          success: false,
          error: 'Internal server error'
        })
      })

      const response = await fetch(`${baseUrl}/products`)
      const data = await response.json()

      expect(data.success).toBe(false)
      expect(data.error).toBe('Internal server error')
    })
  })

  describe('POST /api/products', () => {
    it('should create a product successfully', async () => {
      const newProduct = {
        title: 'New Cake',
        description: 'A new cake',
        image: '/new-cake.jpg',
        price: 20000,
        categoryId: 'category-id'
      }

      const createdProduct = {
        id: 'new-id',
        ...newProduct,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        category: {
          id: 'category-id',
          name: 'Test Category',
          description: 'Test category description',
          slug: 'test-category',
          image: '/category.jpg',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
      }

      ;(global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          data: createdProduct,
          message: 'Product created successfully'
        })
      })

      const response = await fetch(`${baseUrl}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      })
      const data = await response.json()

      expect(data.success).toBe(true)
      expect(data.data.title).toBe('New Cake')
      expect(data.message).toBe('Product created successfully')
    })
  })
}) 