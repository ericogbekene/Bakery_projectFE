"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ProductWithCategory, Category, ApiResponse } from '@/lib/types/product';
import ProductForm from '@/components/admin/ProductForm';

export default function AdminDashboard() {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductWithCategory | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);

      const productsData: ApiResponse<ProductWithCategory[]> = await productsRes.json();
      const categoriesData: ApiResponse<Category[]> = await categoriesRes.json();

      if (productsData.success) {
        setProducts(productsData.data || []);
      }

      if (categoriesData.success) {
        setCategories(categoriesData.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProduct = async (productData: Partial<ProductWithCategory>) => {
    setSaving(true);
    try {
      const url = editingProduct 
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      const result: ApiResponse<ProductWithCategory> = await response.json();

      if (result.success) {
        setShowProductForm(false);
        setEditingProduct(null);
        fetchData(); // Refresh data
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<null> = await response.json();

      if (result.success) {
        fetchData(); // Refresh data
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product');
    }
  };

  const handleEditProduct = (product: ProductWithCategory) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={() => setShowProductForm(true)}>
          Add New Product
        </Button>
      </div>

      {showProductForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h2>
            <ProductForm
              product={editingProduct || undefined}
              onSave={handleSaveProduct}
              onCancel={() => {
                setShowProductForm(false);
                setEditingProduct(null);
              }}
              loading={saving}
            />
          </div>
        </div>
      )}

      <div className="grid gap-6">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Products ({products.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{product.title}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditProduct(product)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <p className="text-sm">
                  <strong>Category:</strong> {product.category.name}
                </p>
                {product.price && (
                  <p className="text-sm">
                    <strong>Price:</strong> ₦{product.price.toLocaleString()}
                  </p>
                )}
                <p className="text-sm">
                  <strong>Status:</strong> {product.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Categories ({categories.length})</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                <p className="text-sm">
                  <strong>Slug:</strong> {category.slug}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 