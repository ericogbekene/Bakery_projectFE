"use client";

import Container from "@/components/shared/container";
import CartItems from "./CartItems";
import OrderForm from "./OrderForm";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Page() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    sessionStorage.setItem("redirectAfterLogin", "/cart");
    router.push("/login");
  };

  return (
    <main>
      <Container className="grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr] my-12 lg:my-16">
        <CartItems />
        {loading ? null : isAuthenticated ? (
          <OrderForm />
        ) : (
          <div className="rounded-2xl border border-gray-200 p-8 text-center space-y-4 h-fit">
            <h3 className="text-lg font-semibold text-gray-800">
              Ready to checkout?
            </h3>
            <p className="text-sm text-gray-500">
              Please log in to fill in your delivery details and place your order.
            </p>
            <Button size="lg" className="w-full" onClick={handleLogin}>
              Log in to continue
            </Button>
            <p className="text-sm text-gray-400">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        )}
      </Container>
    </main>
  );
}