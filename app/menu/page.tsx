import Container from "@/components/shared/container";
import { poltawskiNowy } from "@/lib/font";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MenuPage() {
  const categories = [
    {
      name: "Cakes",
      path: "/menu/cakes",
      description: "Custom celebration cakes",
      icon: "🎂",
    },
    {
      name: "Pastries",
      path: "/menu/pastries",
      description: "Delicious pastries",
      icon: "🥐",
    },
    {
      name: "Loaves",
      path: "/menu/loaves",
      description: "Fresh baked loaves",
      icon: "🍞",
    },
    {
      name: "Others",
      path: "/menu/others",
      description: "Other treats",
      icon: "🍪",
    },
  ];

  return (
    <main className="pb-12">
      <Container className="py-12">
        <h1
          className={cn(
            "mb-8 text-center text-3xl font-semibold",
            poltawskiNowy.className,
          )}
        >
          Our Menu
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link
              key={category.path}
              href={category.path}
              className="hover:border-primary block rounded-lg border p-6 transition-shadow hover:shadow-lg"
            >
              <div className="mb-3 text-4xl">{category.icon}</div>
              <h2 className="mb-2 text-xl font-semibold">{category.name}</h2>
              <p className="text-gray-600">{category.description}</p>
            </Link>
          ))}
        </div>
      </Container>
    </main>
  );
}
