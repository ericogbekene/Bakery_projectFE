export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Bakery API',
    description: 'A comprehensive API for managing bakery products and categories',
    version: '1.0.0',
    contact: {
      name: 'Bakery API Support',
      email: 'support@bakery.com'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Development server'
    }
  ],
  tags: [
    {
      name: 'Products',
      description: 'Product management operations'
    },
    {
      name: 'Categories',
      description: 'Category management operations'
    }
  ],
  components: {
    schemas: {
      Product: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique product identifier'
          },
          title: {
            type: 'string',
            description: 'Product title'
          },
          description: {
            type: 'string',
            description: 'Product description'
          },
          image: {
            type: 'string',
            description: 'Product image URL'
          },
          price: {
            type: 'number',
            nullable: true,
            description: 'Product price in Nigerian Naira'
          },
          categoryId: {
            type: 'string',
            description: 'Category ID this product belongs to'
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the product is active'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Product last update timestamp'
          }
        },
        required: ['id', 'title', 'description', 'image', 'categoryId', 'isActive', 'createdAt', 'updatedAt']
      },
      Category: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'Unique category identifier'
          },
          name: {
            type: 'string',
            description: 'Category name'
          },
          description: {
            type: 'string',
            nullable: true,
            description: 'Category description'
          },
          slug: {
            type: 'string',
            description: 'URL-friendly category identifier'
          },
          image: {
            type: 'string',
            nullable: true,
            description: 'Category image URL'
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            description: 'Category creation timestamp'
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            description: 'Category last update timestamp'
          }
        },
        required: ['id', 'name', 'slug', 'createdAt', 'updatedAt']
      },
      ProductWithCategory: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Product' },
          {
            type: 'object',
            properties: {
              category: {
                $ref: '#/components/schemas/Category'
              }
            }
          }
        ]
      },
      CategoryWithProducts: {
        type: 'object',
        allOf: [
          { $ref: '#/components/schemas/Category' },
          {
            type: 'object',
            properties: {
              products: {
                type: 'array',
                items: {
                  $ref: '#/components/schemas/Product'
                }
              }
            }
          }
        ]
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            description: 'Whether the request was successful'
          },
          data: {
            description: 'Response data (varies by endpoint)'
          },
          message: {
            type: 'string',
            description: 'Success message'
          },
          error: {
            type: 'string',
            description: 'Error message (only present when success is false)'
          }
        },
        required: ['success']
      },
      CreateProductRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Product title'
          },
          description: {
            type: 'string',
            description: 'Product description'
          },
          image: {
            type: 'string',
            description: 'Product image URL'
          },
          price: {
            type: 'number',
            nullable: true,
            description: 'Product price in Nigerian Naira'
          },
          categoryId: {
            type: 'string',
            description: 'Category ID this product belongs to'
          }
        },
        required: ['title', 'description', 'image', 'categoryId']
      },
      UpdateProductRequest: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'Product title'
          },
          description: {
            type: 'string',
            description: 'Product description'
          },
          image: {
            type: 'string',
            description: 'Product image URL'
          },
          price: {
            type: 'number',
            nullable: true,
            description: 'Product price in Nigerian Naira'
          },
          categoryId: {
            type: 'string',
            description: 'Category ID this product belongs to'
          },
          isActive: {
            type: 'boolean',
            description: 'Whether the product is active'
          }
        }
      },
      CreateCategoryRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Category name'
          },
          description: {
            type: 'string',
            description: 'Category description'
          },
          slug: {
            type: 'string',
            description: 'URL-friendly category identifier'
          },
          image: {
            type: 'string',
            description: 'Category image URL'
          }
        },
        required: ['name', 'slug']
      },
      UpdateCategoryRequest: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'Category name'
          },
          description: {
            type: 'string',
            description: 'Category description'
          },
          image: {
            type: 'string',
            description: 'Category image URL'
          }
        }
      }
    }
  },
  paths: {
    '/api/products': {
      get: {
        tags: ['Products'],
        summary: 'Get all products',
        description: 'Retrieve a list of all products with optional filtering and pagination',
        parameters: [
          {
            name: 'category',
            in: 'query',
            description: 'Filter products by category slug',
            schema: {
              type: 'string'
            },
            example: 'signature-cakes'
          },
          {
            name: 'limit',
            in: 'query',
            description: 'Maximum number of products to return',
            schema: {
              type: 'integer',
              default: 50
            },
            example: 10
          },
          {
            name: 'offset',
            in: 'query',
            description: 'Number of products to skip',
            schema: {
              type: 'integer',
              default: 0
            },
            example: 0
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/ProductWithCategory'
                          }
                        }
                      }
                    }
                  ]
                },
                example: {
                  success: true,
                  data: [
                    {
                      id: 'cmeeags1t0008u9b6ruv5hv0s',
                      title: 'Butterfly',
                      description: "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
                      image: '/assets/images/5.webp',
                      price: null,
                      categoryId: 'cmeeagrzo0000u9b6xk6w0j4i',
                      isActive: true,
                      createdAt: '2025-08-16T13:24:28.289Z',
                      updatedAt: '2025-08-16T14:07:48.045Z',
                      category: {
                        id: 'cmeeagrzo0000u9b6xk6w0j4i',
                        name: 'Signature Cakes',
                        description: 'Unique, Handcrafted, Signature Cakes.',
                        slug: 'signature-cakes',
                        image: '/images/signature-cakes.jpg',
                        createdAt: '2025-08-16T13:24:28.212Z',
                        updatedAt: '2025-08-16T14:07:47.985Z'
                      }
                    }
                  ],
                  message: 'Found 1 products'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to fetch products'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Products'],
        summary: 'Create a new product',
        description: 'Create a new product with the provided details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateProductRequest'
              },
              example: {
                title: 'New Cake',
                description: 'A delicious new cake',
                image: '/assets/images/new-cake.webp',
                price: 15000,
                categoryId: 'cmeeagrzo0000u9b6xk6w0j4i'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Product created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/ProductWithCategory'
                        }
                      }
                    }
                  ]
                },
                example: {
                  success: true,
                  data: {
                    id: 'cmeeccb1y0001u9iio2kosn4d',
                    title: 'New Cake',
                    description: 'A delicious new cake',
                    image: '/assets/images/new-cake.webp',
                    price: 15000,
                    categoryId: 'cmeeagrzo0000u9b6xk6w0j4i',
                    isActive: true,
                    createdAt: '2025-08-16T14:16:58.870Z',
                    updatedAt: '2025-08-16T14:16:58.870Z',
                    category: {
                      id: 'cmeeagrzo0000u9b6xk6w0j4i',
                      name: 'Signature Cakes',
                      description: 'Unique, Handcrafted, Signature Cakes.',
                      slug: 'signature-cakes',
                      image: '/images/signature-cakes.jpg',
                      createdAt: '2025-08-16T13:24:28.212Z',
                      updatedAt: '2025-08-16T14:07:47.985Z'
                    }
                  },
                  message: 'Product created successfully'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - missing required fields',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Missing required fields: title, description, image, categoryId'
                }
              }
            }
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Category not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to create product'
                }
              }
            }
          }
        }
      }
    },
    '/api/products/{id}': {
      get: {
        tags: ['Products'],
        summary: 'Get a specific product',
        description: 'Retrieve a single product by its ID',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: {
              type: 'string'
            },
            example: 'cmeeags1t0008u9b6ruv5hv0s'
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/ProductWithCategory'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Product not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to fetch product'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Products'],
        summary: 'Update a product',
        description: 'Update an existing product with new information',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: {
              type: 'string'
            },
            example: 'cmeeags1t0008u9b6ruv5hv0s'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateProductRequest'
              },
              example: {
                title: 'Updated Cake Title',
                price: 20000
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Product updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/ProductWithCategory'
                        }
                      }
                    }
                  ]
                },
                example: {
                  success: true,
                  data: {
                    id: 'cmeeags1t0008u9b6ruv5hv0s',
                    title: 'Updated Cake Title',
                    description: "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
                    image: '/assets/images/5.webp',
                    price: 20000,
                    categoryId: 'cmeeagrzo0000u9b6xk6w0j4i',
                    isActive: true,
                    createdAt: '2025-08-16T13:24:28.289Z',
                    updatedAt: '2025-08-16T14:17:26.822Z',
                    category: {
                      id: 'cmeeagrzo0000u9b6xk6w0j4i',
                      name: 'Signature Cakes',
                      description: 'Unique, Handcrafted, Signature Cakes.',
                      slug: 'signature-cakes',
                      image: '/images/signature-cakes.jpg',
                      createdAt: '2025-08-16T13:24:28.212Z',
                      updatedAt: '2025-08-16T14:07:47.985Z'
                    }
                  },
                  message: 'Product updated successfully'
                }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Product not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to update product'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Products'],
        summary: 'Delete a product',
        description: 'Soft delete a product by setting isActive to false',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            description: 'Product ID',
            schema: {
              type: 'string'
            },
            example: 'cmeeags1t0008u9b6ruv5hv0s'
          }
        ],
        responses: {
          '200': {
            description: 'Product deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: true,
                  message: 'Product deleted successfully'
                }
              }
            }
          },
          '404': {
            description: 'Product not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Product not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to delete product'
                }
              }
            }
          }
        }
      }
    },
    '/api/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get all categories',
        description: 'Retrieve a list of all categories with optional product inclusion',
        parameters: [
          {
            name: 'includeProducts',
            in: 'query',
            description: 'Include products in the response',
            schema: {
              type: 'boolean',
              default: false
            },
            example: true
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          type: 'array',
                          items: {
                            $ref: '#/components/schemas/Category'
                          }
                        }
                      }
                    }
                  ]
                },
                example: {
                  success: true,
                  data: [
                    {
                      id: 'cmeeagrzo0000u9b6xk6w0j4i',
                      name: 'Signature Cakes',
                      description: 'Unique, Handcrafted, Signature Cakes.',
                      slug: 'signature-cakes',
                      image: '/images/signature-cakes.jpg',
                      createdAt: '2025-08-16T13:24:28.212Z',
                      updatedAt: '2025-08-16T14:07:47.985Z'
                    }
                  ],
                  message: 'Found 1 categories'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to fetch categories'
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Categories'],
        summary: 'Create a new category',
        description: 'Create a new category with the provided details',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateCategoryRequest'
              },
              example: {
                name: 'New Category',
                description: 'A new category for special cakes',
                slug: 'new-category',
                image: '/images/new-category.jpg'
              }
            }
          }
        },
        responses: {
          '201': {
            description: 'Category created successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Category'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '400': {
            description: 'Bad request - missing required fields',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Missing required fields: name, slug'
                }
              }
            }
          },
          '409': {
            description: 'Conflict - category with same slug already exists',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Category with this slug already exists'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to create category'
                }
              }
            }
          }
        }
      }
    },
    '/api/categories/{slug}': {
      get: {
        tags: ['Categories'],
        summary: 'Get a specific category',
        description: 'Retrieve a single category by its slug with optional product inclusion',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Category slug',
            schema: {
              type: 'string'
            },
            example: 'signature-cakes'
          },
          {
            name: 'includeProducts',
            in: 'query',
            description: 'Include products in the response',
            schema: {
              type: 'boolean',
              default: true
            },
            example: true
          }
        ],
        responses: {
          '200': {
            description: 'Successful response',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/CategoryWithProducts'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Category not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to fetch category'
                }
              }
            }
          }
        }
      },
      put: {
        tags: ['Categories'],
        summary: 'Update a category',
        description: 'Update an existing category with new information',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Category slug',
            schema: {
              type: 'string'
            },
            example: 'signature-cakes'
          }
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/UpdateCategoryRequest'
              },
              example: {
                name: 'Updated Category Name',
                description: 'Updated category description'
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'Category updated successfully',
            content: {
              'application/json': {
                schema: {
                  allOf: [
                    { $ref: '#/components/schemas/ApiResponse' },
                    {
                      type: 'object',
                      properties: {
                        data: {
                          $ref: '#/components/schemas/Category'
                        }
                      }
                    }
                  ]
                }
              }
            }
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Category not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to update category'
                }
              }
            }
          }
        }
      },
      delete: {
        tags: ['Categories'],
        summary: 'Delete a category',
        description: 'Delete a category (only if it has no active products)',
        parameters: [
          {
            name: 'slug',
            in: 'path',
            required: true,
            description: 'Category slug',
            schema: {
              type: 'string'
            },
            example: 'signature-cakes'
          }
        ],
        responses: {
          '200': {
            description: 'Category deleted successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: true,
                  message: 'Category deleted successfully'
                }
              }
            }
          },
          '400': {
            description: 'Bad request - category has active products',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Cannot delete category. It has 4 active products.'
                }
              }
            }
          },
          '404': {
            description: 'Category not found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Category not found'
                }
              }
            }
          },
          '500': {
            description: 'Internal server error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ApiResponse'
                },
                example: {
                  success: false,
                  error: 'Failed to delete category'
                }
              }
            }
          }
        }
      }
    }
  }
}; 