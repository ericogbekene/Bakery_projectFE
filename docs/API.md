# 📚 API Documentation

## Overview

The Bakery API provides a complete RESTful interface for managing bakery products and categories. All endpoints return JSON responses and use standard HTTP status codes.

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, the API does not require authentication. In production, consider implementing JWT or API key authentication.

## Response Format

All API responses follow this standard format:

```json
{
  "success": boolean,
  "data": any,
  "message": string,
  "error": string
}
```

## Endpoints

### Products

#### Get All Products

**GET** `/products`

Retrieve a list of all products with optional filtering and pagination.

**Query Parameters:**
- `category` (string, optional): Filter by category slug
- `limit` (number, optional): Maximum number of products (default: 50)
- `offset` (number, optional): Number of products to skip (default: 0)

**Example Request:**
```bash
curl "http://localhost:3000/api/products?category=signature-cakes&limit=10"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmeeags1t0008u9b6ruv5hv0s",
      "title": "Butterfly",
      "description": "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
      "image": "/assets/images/5.webp",
      "price": null,
      "categoryId": "cmeeagrzo0000u9b6xk6w0j4i",
      "isActive": true,
      "createdAt": "2025-08-16T13:24:28.289Z",
      "updatedAt": "2025-08-16T14:07:48.045Z",
      "category": {
        "id": "cmeeagrzo0000u9b6xk6w0j4i",
        "name": "Signature Cakes",
        "description": "Unique, Handcrafted, Signature Cakes.",
        "slug": "signature-cakes",
        "image": "/images/signature-cakes.jpg",
        "createdAt": "2025-08-16T13:24:28.212Z",
        "updatedAt": "2025-08-16T14:07:47.985Z"
      }
    }
  ],
  "message": "Found 1 products"
}
```

#### Create Product

**POST** `/products`

Create a new product.

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "image": "string",
  "price": "number (optional)",
  "categoryId": "string"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/products" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Cake",
    "description": "A delicious new cake",
    "image": "/assets/images/new-cake.webp",
    "price": 15000,
    "categoryId": "cmeeagrzo0000u9b6xk6w0j4i"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeccb1y0001u9iio2kosn4d",
    "title": "New Cake",
    "description": "A delicious new cake",
    "image": "/assets/images/new-cake.webp",
    "price": 15000,
    "categoryId": "cmeeagrzo0000u9b6xk6w0j4i",
    "isActive": true,
    "createdAt": "2025-08-16T14:16:58.870Z",
    "updatedAt": "2025-08-16T14:16:58.870Z",
    "category": {
      "id": "cmeeagrzo0000u9b6xk6w0j4i",
      "name": "Signature Cakes",
      "description": "Unique, Handcrafted, Signature Cakes.",
      "slug": "signature-cakes",
      "image": "/images/signature-cakes.jpg",
      "createdAt": "2025-08-16T13:24:28.212Z",
      "updatedAt": "2025-08-16T14:07:47.985Z"
    }
  },
  "message": "Product created successfully"
}
```

#### Get Product by ID

**GET** `/products/{id}`

Retrieve a specific product by its ID.

**Path Parameters:**
- `id` (string): Product ID

**Example Request:**
```bash
curl "http://localhost:3000/api/products/cmeeags1t0008u9b6ruv5hv0s"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeags1t0008u9b6ruv5hv0s",
    "title": "Butterfly",
    "description": "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
    "image": "/assets/images/5.webp",
    "price": null,
    "categoryId": "cmeeagrzo0000u9b6xk6w0j4i",
    "isActive": true,
    "createdAt": "2025-08-16T13:24:28.289Z",
    "updatedAt": "2025-08-16T14:07:48.045Z",
    "category": {
      "id": "cmeeagrzo0000u9b6xk6w0j4i",
      "name": "Signature Cakes",
      "description": "Unique, Handcrafted, Signature Cakes.",
      "slug": "signature-cakes",
      "image": "/images/signature-cakes.jpg",
      "createdAt": "2025-08-16T13:24:28.212Z",
      "updatedAt": "2025-08-16T14:07:47.985Z"
    }
  }
}
```

#### Update Product

**PUT** `/products/{id}`

Update an existing product.

**Path Parameters:**
- `id` (string): Product ID

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "image": "string (optional)",
  "price": "number (optional)",
  "categoryId": "string (optional)",
  "isActive": "boolean (optional)"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/products/cmeeags1t0008u9b6ruv5hv0s" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Cake Title",
    "price": 20000
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeags1t0008u9b6ruv5hv0s",
    "title": "Updated Cake Title",
    "description": "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
    "image": "/assets/images/5.webp",
    "price": 20000,
    "categoryId": "cmeeagrzo0000u9b6xk6w0j4i",
    "isActive": true,
    "createdAt": "2025-08-16T13:24:28.289Z",
    "updatedAt": "2025-08-16T14:17:26.822Z",
    "category": {
      "id": "cmeeagrzo0000u9b6xk6w0j4i",
      "name": "Signature Cakes",
      "description": "Unique, Handcrafted, Signature Cakes.",
      "slug": "signature-cakes",
      "image": "/images/signature-cakes.jpg",
      "createdAt": "2025-08-16T13:24:28.212Z",
      "updatedAt": "2025-08-16T14:07:47.985Z"
    }
  },
  "message": "Product updated successfully"
}
```

#### Delete Product

**DELETE** `/products/{id}`

Soft delete a product by setting `isActive` to false.

**Path Parameters:**
- `id` (string): Product ID

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/products/cmeeags1t0008u9b6ruv5hv0s"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Product deleted successfully"
}
```

### Categories

#### Get All Categories

**GET** `/categories`

Retrieve a list of all categories.

**Query Parameters:**
- `includeProducts` (boolean, optional): Include products in response (default: false)

**Example Request:**
```bash
curl "http://localhost:3000/api/categories?includeProducts=true"
```

**Example Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "cmeeagrzo0000u9b6xk6w0j4i",
      "name": "Signature Cakes",
      "description": "Unique, Handcrafted, Signature Cakes.",
      "slug": "signature-cakes",
      "image": "/images/signature-cakes.jpg",
      "createdAt": "2025-08-16T13:24:28.212Z",
      "updatedAt": "2025-08-16T14:07:47.985Z"
    }
  ],
  "message": "Found 1 categories"
}
```

#### Create Category

**POST** `/categories`

Create a new category.

**Request Body:**
```json
{
  "name": "string",
  "description": "string (optional)",
  "slug": "string",
  "image": "string (optional)"
}
```

**Example Request:**
```bash
curl -X POST "http://localhost:3000/api/categories" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Category",
    "description": "A new category for special cakes",
    "slug": "new-category",
    "image": "/images/new-category.jpg"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeccb1y0001u9iio2kosn4d",
    "name": "New Category",
    "description": "A new category for special cakes",
    "slug": "new-category",
    "image": "/images/new-category.jpg",
    "createdAt": "2025-08-16T14:16:58.870Z",
    "updatedAt": "2025-08-16T14:16:58.870Z"
  },
  "message": "Category created successfully"
}
```

#### Get Category by Slug

**GET** `/categories/{slug}`

Retrieve a specific category by its slug.

**Path Parameters:**
- `slug` (string): Category slug

**Query Parameters:**
- `includeProducts` (boolean, optional): Include products in response (default: true)

**Example Request:**
```bash
curl "http://localhost:3000/api/categories/signature-cakes?includeProducts=true"
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeagrzo0000u9b6xk6w0j4i",
    "name": "Signature Cakes",
    "description": "Unique, Handcrafted, Signature Cakes.",
    "slug": "signature-cakes",
    "image": "/images/signature-cakes.jpg",
    "createdAt": "2025-08-16T13:24:28.212Z",
    "updatedAt": "2025-08-16T14:07:47.985Z",
    "products": [
      {
        "id": "cmeeags1t0008u9b6ruv5hv0s",
        "title": "Butterfly",
        "description": "'Butterfly' is a 2 layered buttercream covered cake inspired by the wave of the sea and the freedom of birds.",
        "image": "/assets/images/5.webp",
        "price": null,
        "categoryId": "cmeeagrzo0000u9b6xk6w0j4i",
        "isActive": true,
        "createdAt": "2025-08-16T13:24:28.289Z",
        "updatedAt": "2025-08-16T14:07:48.045Z"
      }
    ]
  }
}
```

#### Update Category

**PUT** `/categories/{slug}`

Update an existing category.

**Path Parameters:**
- `slug` (string): Category slug

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "image": "string (optional)"
}
```

**Example Request:**
```bash
curl -X PUT "http://localhost:3000/api/categories/signature-cakes" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Category Name",
    "description": "Updated category description"
  }'
```

**Example Response:**
```json
{
  "success": true,
  "data": {
    "id": "cmeeagrzo0000u9b6xk6w0j4i",
    "name": "Updated Category Name",
    "description": "Updated category description",
    "slug": "signature-cakes",
    "image": "/images/signature-cakes.jpg",
    "createdAt": "2025-08-16T13:24:28.212Z",
    "updatedAt": "2025-08-16T14:17:26.822Z"
  },
  "message": "Category updated successfully"
}
```

#### Delete Category

**DELETE** `/categories/{slug}`

Delete a category (only if it has no active products).

**Path Parameters:**
- `slug` (string): Category slug

**Example Request:**
```bash
curl -X DELETE "http://localhost:3000/api/categories/signature-cakes"
```

**Example Response:**
```json
{
  "success": true,
  "message": "Category deleted successfully"
}
```

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "error": "Missing required fields: title, description, image, categoryId"
}
```

### 404 Not Found
```json
{
  "success": false,
  "error": "Product not found"
}
```

### 409 Conflict
```json
{
  "success": false,
  "error": "Category with this slug already exists"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Failed to fetch products"
}
```

## Rate Limiting

Currently, there are no rate limits implemented. In production, consider implementing rate limiting to prevent abuse.

## Caching

The API implements in-memory caching for GET requests with a 5-minute TTL. Cache is automatically invalidated when data is modified.

## Testing

You can test the API using:

1. **Interactive Documentation**: http://localhost:3000/api-docs
2. **cURL commands**: Examples provided above
3. **Postman/Insomnia**: Import the OpenAPI spec from http://localhost:3000/api/docs

## Support

For API support and questions:
- Check the interactive documentation
- Review error messages in responses
- Contact the development team 