import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import QueryProvider from "@/components/providers/query-provider";
import NotistackProvider from "@/components/providers/snackbar-provider";
import { AuthProvider } from "@/lib/hooks/useAuth";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const openSans = { className: "font-sans" };

export const metadata: Metadata = {
  title: "MC Cakes",
  description: "Fresh cakes, pastries and loaves baked with love.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${openSans.className} text-text antialiased`}>
        <NextTopLoader showSpinner={false} color="#c85387" />
        <QueryProvider>
          <NotistackProvider>
            <AuthProvider>
              <Header />
              {children}
              <Footer />
            </AuthProvider>
          </NotistackProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
