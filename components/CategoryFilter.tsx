"use client";

import { useCategories } from "@/lib/hooks/useCategories";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory?: string | null;
  onCategoryChange: (slug: string | null) => void;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { categories, loading, error } = useCategories();

  if (error) {
    return <p className="text-destructive">Error loading categories</p>;
  }

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-4">Categories</h3>
      {loading ? (
        <p>Loading categories...</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onCategoryChange(null)}
            className={cn(
              "px-4 py-2 rounded border transition-colors",
              !selectedCategory
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input hover:bg-accent"
            )}
          >
            All Products
          </button>
          {categories.map((category) => (
            <button
              key={category.slug}
              onClick={() => onCategoryChange(category.slug)}
              className={cn(
                "px-4 py-2 rounded border transition-colors",
                selectedCategory === category.slug
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {category.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
