import { render, screen } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { OrderSummary } from "@/components/checkout/OrderSummary";
import { Cart } from "@/lib/services/cart-service";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("OrderSummary Component", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  const mockCart: Cart = {
    id: "cart-1",
    user_id: "user-1",
    total_price: "150.00",
    cart_items: [
      {
        id: "item-1",
        product_id: 1,
        quantity: 2,
        total_price: "50.00",
        product: {
          id: 1,
          name: "Chocolate Cake",
          description: "Rich chocolate cake",
          price: "25.00",
          category: "cakes",
          image: "/images/cake.jpg",
          slug: "chocolate-cake",
          featured: true,
          created_at: "2025-01-01",
          updated_at: "2025-01-01",
        },
      },
      {
        id: "item-2",
        product_id: 2,
        quantity: 1,
        total_price: "100.00",
        product: {
          id: 2,
          name: "Vanilla Loaf",
          description: "Classic vanilla loaf",
          price: "100.00",
          category: "loaves",
          image: "/images/loaf.jpg",
          slug: "vanilla-loaf",
          featured: false,
          created_at: "2025-01-01",
          updated_at: "2025-01-01",
        },
      },
    ],
  };

  describe("With Cart Data", () => {
    it("should display order summary heading", () => {
      render(<OrderSummary cart={mockCart} />);
      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    it("should display all cart items with quantities and prices", () => {
      render(<OrderSummary cart={mockCart} />);

      expect(screen.getByText(/chocolate cake/i)).toBeInTheDocument();
      expect(screen.getByText(/vanilla loaf/i)).toBeInTheDocument();

      // Check quantities
      expect(screen.getByText(/2 \×/)).toBeInTheDocument();
      expect(screen.getByText(/1 \×/)).toBeInTheDocument();
    });

    it("should calculate and display subtotal", () => {
      render(<OrderSummary cart={mockCart} />);

      const subtotal = 150.0; // sum of item total prices
      expect(screen.getByText(new RegExp(`Subtotal:.*${subtotal}`, "i"))).toBeInTheDocument();
    });

    it("should calculate and display tax (10%)", () => {
      render(<OrderSummary cart={mockCart} />);

      const tax = 150.0 * 0.1; // 10% tax
      expect(screen.getByText(new RegExp(`Tax \\(10%\\):.*${tax.toFixed(2)}`, "i"))).toBeInTheDocument();
    });

    it("should display total with subtotal and tax", () => {
      render(<OrderSummary cart={mockCart} />);

      const total = 150.0 * 1.1; // subtotal + 10% tax
      expect(screen.getByText(/total:/i)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(`${total.toFixed(2)}`, "i"))).toBeInTheDocument();
    });

    it("should display item count badge", () => {
      render(<OrderSummary cart={mockCart} />);

      expect(screen.getByText(/2 items in cart/i)).toBeInTheDocument();
    });

    it("should display loading state when isLoading is true", () => {
      render(<OrderSummary cart={mockCart} isLoading={true} />);

      expect(screen.getByText(/loading cart details/i)).toBeInTheDocument();
    });

    it("should display submitting state when isSubmitting is true", () => {
      render(<OrderSummary cart={mockCart} isSubmitting={true} />);

      expect(screen.getByText(/processing your order/i)).toBeInTheDocument();
    });

    it("should have sticky positioning", () => {
      const { container } = render(<OrderSummary cart={mockCart} />);

      const summaryDiv = container.querySelector(".sticky");
      expect(summaryDiv).toBeInTheDocument();
    });
  });

  describe("Empty/Null Cart", () => {
    it("should display empty cart message when cart is null", () => {
      render(<OrderSummary cart={null} />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it("should display empty cart message when cart has no items", () => {
      const emptyCart: Cart = {
        id: "cart-1",
        user_id: "user-1",
        total_price: "0.00",
        cart_items: [],
      };

      render(<OrderSummary cart={emptyCart} />);

      expect(screen.getByText(/your cart is empty/i)).toBeInTheDocument();
    });

    it("should show 'Add Items to Cart' button when cart is empty", () => {
      render(<OrderSummary cart={null} />);

      const addItemsButton = screen.getByRole("button", { name: /add items to cart/i });
      expect(addItemsButton).toBeInTheDocument();
    });

    it("should navigate to products page when clicking 'Add Items to Cart'", () => {
      render(<OrderSummary cart={null} />);

      const addItemsButton = screen.getByRole("button", { name: /add items to cart/i });
      addItemsButton.click();

      expect(mockPush).toHaveBeenCalledWith("/products");
    });
  });

  describe("Single Item", () => {
    it("should display 'item' singular for one item", () => {
      const singleItemCart: Cart = {
        id: "cart-1",
        user_id: "user-1",
        total_price: "25.00",
        cart_items: [
          {
            id: "item-1",
            product_id: 1,
            quantity: 1,
            total_price: "25.00",
            product: {
              id: 1,
              name: "Chocolate Cake",
              description: "Rich chocolate cake",
              price: "25.00",
              category: "cakes",
              image: "/images/cake.jpg",
              slug: "chocolate-cake",
              featured: true,
              created_at: "2025-01-01",
              updated_at: "2025-01-01",
            },
          },
        ],
      };

      render(<OrderSummary cart={singleItemCart} />);

      expect(screen.getByText(/1 item in cart/i)).toBeInTheDocument();
    });
  });

  describe("Price Formatting", () => {
    it("should format prices with 2 decimal places", () => {
      render(<OrderSummary cart={mockCart} />);

      // Check that prices are formatted correctly
      const priceElements = screen.getAllByText(/\$\d+\.\d{2}/);
      expect(priceElements.length).toBeGreaterThan(0);

      priceElements.forEach((el) => {
        expect(el.textContent).toMatch(/\$\d+\.\d{2}/);
      });
    });
  });
});
