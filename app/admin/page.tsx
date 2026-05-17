"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { poltawskiNowy } from "@/lib/font";
import { useAuth } from "@/lib/hooks/useAuth";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: number;
  name: string;
  slug: string;
  product_count: number;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  product_type: "cake" | "pastry";
  price: string;
  available: boolean;
  category_name: string | null;
  description: string | null;
  layers: number | null;
  covering: string | null;
  preparation_days: number | null;
  created_at: string;
}

interface OrderSummary {
  id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  total_amount: string;
  status: string;
  status_display: string;
  payment_status: string;
  payment_status_display: string;
  created_at: string;
}

type Tab = "overview" | "products" | "categories" | "orders";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function djangoFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem("access_token");
  return fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}

// ─── Product Form ─────────────────────────────────────────────────────────────

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product?: Product;
  categories: Category[];
  onSave: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: product?.name || "",
    product_type: product?.product_type || "cake",
    category: product?.category_name
      ? categories
          .find((c) => c.name === product.category_name)
          ?.id?.toString() || ""
      : "",
    price: product?.price || "",
    description: product?.description || "",
    available: product?.available ?? true,
    layers: product?.layers?.toString() || "",
    covering: product?.covering || "",
    preparation_days: product?.preparation_days?.toString() || "",
  });

  const isCake = form.product_type === "cake";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Record<string, unknown> = {
      name: form.name,
      product_type: form.product_type,
      price: form.price,
      description: form.description,
      available: form.available,
      category: form.category ? parseInt(form.category) : null,
    };

    if (isCake) {
      payload.layers = form.layers ? parseInt(form.layers) : null;
      payload.covering = form.covering || null;
      payload.preparation_days = form.preparation_days
        ? parseInt(form.preparation_days)
        : null;
    }

    try {
      const url = product
        ? `/products/${product.slug}/update/`
        : `/products/create/`;
      const method = product ? "PATCH" : "POST";

      const res = await djangoFetch(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSave();
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch {
      alert("Failed to save product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name *</label>
          <Input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Product Type *</label>
          <select
            value={form.product_type}
            onChange={(e) =>
              setForm({
                ...form,
                product_type: e.target.value as "cake" | "pastry",
              })
            }
            className="h-10 w-full rounded-md border px-3 text-sm"
            required
          >
            <option value="cake">Cake</option>
            <option value="pastry">Pastry</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="h-10 w-full rounded-md border px-3 text-sm"
          >
            <option value="">No category</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Price (₦) *</label>
          <Input
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="h-20"
        />
      </div>

      {/* Cake-specific fields */}
      {isCake && (
        <div className="grid grid-cols-1 gap-4 rounded-lg border bg-pink-50 p-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium">Layers *</label>
            <Input
              type="number"
              min={1}
              max={10}
              value={form.layers}
              onChange={(e) => setForm({ ...form, layers: e.target.value })}
              required={isCake}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Covering *</label>
            <select
              value={form.covering}
              onChange={(e) => setForm({ ...form, covering: e.target.value })}
              className="h-10 w-full rounded-md border px-3 text-sm"
              required={isCake}
            >
              <option value="">Select covering</option>
              <option value="buttercream">Buttercream</option>
              <option value="fondant">Fondant</option>
              <option value="cream_cheese">Cream Cheese</option>
              <option value="whipped_cream">Whipped Cream</option>
              <option value="naked">Naked Cake</option>
              <option value="ganache">Chocolate Ganache</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Prep Days *</label>
            <Input
              type="number"
              min={1}
              value={form.preparation_days}
              onChange={(e) =>
                setForm({ ...form, preparation_days: e.target.value })
              }
              required={isCake}
            />
          </div>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="available"
          checked={form.available}
          onChange={(e) => setForm({ ...form, available: e.target.checked })}
          className="h-4 w-4"
        />
        <label htmlFor="available" className="text-sm font-medium">
          Available for purchase
        </label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Saving..." : product ? "Update Product" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Category Form ────────────────────────────────────────────────────────────

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category?: Category;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState(category?.name || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = category
        ? `/products/categories/${category.slug}/update/`
        : `/products/categories/create/`;
      const method = category ? "PATCH" : "POST";

      const res = await djangoFetch(url, {
        method,
        body: JSON.stringify({ name }),
      });

      if (res.ok) {
        onSave();
      } else {
        const err = await res.json();
        alert(JSON.stringify(err));
      }
    } catch {
      alert("Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Category Name *</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving} className="flex-1">
          {saving ? "Saving..." : category ? "Update" : "Create"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  const [tab, setTab] = useState<Tab>("overview");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<
    Category | undefined
  >();

  // Redirect non-admins
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes, ordersRes, countsRes] =
        await Promise.all([
          djangoFetch("/products/?page_size=100"),
          djangoFetch("/products/categories/?page_size=100"),
          djangoFetch("/orders/"),
          djangoFetch("/products/counts/"),
        ]);

      if (productsRes.ok) {
        const d = await productsRes.json();
        setProducts(d.results ?? []);
      }
      if (categoriesRes.ok) {
        const d = await categoriesRes.json();
        setCategories(d.results ?? []);
      }
      if (ordersRes.ok) {
        const d = await ordersRes.json();
        setOrders(d.results ?? (Array.isArray(d) ? d : []));
      }
      if (countsRes.ok) {
        const d = await countsRes.json();
        setStats(d);
      }
    } catch (err) {
      console.error("Failed to fetch admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`Delete "${product.name}"?`)) return;
    const res = await djangoFetch(`/products/${product.slug}/delete/`, {
      method: "DELETE",
    });
    if (res.ok) fetchAll();
    else alert("Failed to delete product.");
  };

  const handleDeleteCategory = async (category: Category) => {
    if (!confirm(`Delete category "${category.name}"?`)) return;
    const res = await djangoFetch(
      `/products/categories/${category.slug}/delete/`,
      { method: "DELETE" },
    );
    if (res.ok) fetchAll();
    else {
      const err = await res.json();
      alert(err.error || "Failed to delete category.");
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: number,
    newStatus: string,
  ) => {
    const res = await djangoFetch(`/orders/admin/${orderId}/update-status/`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });
    if (res.ok) fetchAll();
    else alert("Failed to update order status.");
  };

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-orange-100 text-orange-800",
    ready: "bg-purple-100 text-purple-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const PAYMENT_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-800",
    failed: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="border-primary mx-auto h-10 w-10 animate-spin rounded-full border-4 border-t-transparent" />
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Overview" },
    { key: "products", label: `Products (${products.length})` },
    { key: "categories", label: `Categories (${categories.length})` },
    { key: "orders", label: `Orders (${orders.length})` },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-4">
        <h1 className={cn("text-2xl font-semibold", poltawskiNowy.className)}>
          Admin Dashboard
        </h1>
        <p className="text-sm text-gray-500">
          Welcome, {(user as { first_name?: string })?.first_name ?? "Admin"}
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b bg-white px-6">
        <div className="flex gap-0">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={cn(
                "border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                tab === t.key
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500 hover:text-gray-900",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-6">
        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Total Products",
                value: products.length,
                color: "bg-blue-50 text-blue-700",
              },
              {
                label: "Cakes",
                value: stats.cakes ?? 0,
                color: "bg-pink-50 text-pink-700",
              },
              {
                label: "Pastries",
                value: stats.pastries ?? 0,
                color: "bg-orange-50 text-orange-700",
              },
              {
                label: "Total Orders",
                value: orders.length,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Categories",
                value: categories.length,
                color: "bg-purple-50 text-purple-700",
              },
              {
                label: "Pending Orders",
                value: orders.filter((o) => o.status === "pending").length,
                color: "bg-yellow-50 text-yellow-700",
              },
              {
                label: "Completed Orders",
                value: orders.filter((o) => o.status === "completed").length,
                color: "bg-green-50 text-green-700",
              },
              {
                label: "Total Revenue",
                value: `₦${orders
                  .filter((o) => o.payment_status === "paid")
                  .reduce((sum, o) => sum + Number(o.total_amount), 0)
                  .toLocaleString()}`,
                color: "bg-gray-50 text-gray-700",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={cn("rounded-lg p-5", stat.color)}
              >
                <p className="text-sm font-medium opacity-70">{stat.label}</p>
                <p className="mt-1 text-3xl font-bold">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── PRODUCTS ── */}
        {tab === "products" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Products</h2>
              <Button
                onClick={() => {
                  setEditingProduct(undefined);
                  setShowProductForm(true);
                }}
              >
                + Add Product
              </Button>
            </div>

            {showProductForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {editingProduct ? "Edit Product" : "Add Product"}
                  </h3>
                  <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onSave={() => {
                      setShowProductForm(false);
                      fetchAll();
                    }}
                    onCancel={() => setShowProductForm(false)}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="space-y-2 rounded-lg border bg-white p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium text-gray-900">
                      {product.name}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-xs font-medium",
                        product.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700",
                      )}
                    >
                      {product.available ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    {product.product_type === "cake" ? "🎂 Cake" : "🥐 Pastry"}{" "}
                    · {product.category_name ?? "No category"}
                  </p>
                  {product.description && (
                    <p className="line-clamp-2 text-xs text-gray-400">
                      {product.description}
                    </p>
                  )}
                  <p className="font-semibold text-gray-900">
                    ₦{Number(product.price).toLocaleString()}
                  </p>
                  {product.layers && (
                    <p className="text-xs text-gray-500">
                      {product.layers} layers · {product.covering} ·{" "}
                      {product.preparation_days} days prep
                    </p>
                  )}
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDeleteProduct(product)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CATEGORIES ── */}
        {tab === "categories" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Categories</h2>
              <Button
                onClick={() => {
                  setEditingCategory(undefined);
                  setShowCategoryForm(true);
                }}
              >
                + Add Category
              </Button>
            </div>

            {showCategoryForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="w-full max-w-md rounded-xl bg-white p-6">
                  <h3 className="mb-4 text-lg font-semibold">
                    {editingCategory ? "Edit Category" : "Add Category"}
                  </h3>
                  <CategoryForm
                    category={editingCategory}
                    onSave={() => {
                      setShowCategoryForm(false);
                      fetchAll();
                    }}
                    onCancel={() => setShowCategoryForm(false)}
                  />
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="space-y-2 rounded-lg border bg-white p-4"
                >
                  <h3 className="font-medium text-gray-900">{category.name}</h3>
                  <p className="text-xs text-gray-500">Slug: {category.slug}</p>
                  <p className="text-sm text-gray-600">
                    {category.product_count} products
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setEditingCategory(category);
                        setShowCategoryForm(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleDeleteCategory(category)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {tab === "orders" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Orders</h2>
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="w-full text-sm">
                <thead className="border-b bg-gray-50">
                  <tr>
                    {[
                      "Order #",
                      "Customer",
                      "Total",
                      "Status",
                      "Payment",
                      "Date",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left font-medium text-gray-600"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs">
                        {order.order_number}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.customer_name}</p>
                        <p className="text-xs text-gray-400">
                          {order.customer_email}
                        </p>
                      </td>
                      <td className="px-4 py-3 font-semibold">
                        ₦{Number(order.total_amount).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            STATUS_COLORS[order.status] ?? "bg-gray-100",
                          )}
                        >
                          {order.status_display}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "rounded-full px-2 py-0.5 text-xs font-medium",
                            PAYMENT_COLORS[order.payment_status] ??
                              "bg-gray-100",
                          )}
                        >
                          {order.payment_status_display}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(order.created_at).toLocaleDateString("en-NG")}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(order.id, e.target.value)
                          }
                          className="rounded border px-2 py-1 text-xs"
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="ready">Ready</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {orders.length === 0 && (
                <div className="py-12 text-center text-gray-400">
                  No orders yet.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
