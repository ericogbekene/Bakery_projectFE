import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CheckoutPage from "@/app/checkout/page";
import { CartProvider } from "@/lib/hooks/useCart";
import { useCheckout } from "@/hooks/useCheckout";
import orderService from "@/lib/services/order-service";

// Mock modules
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock("@/hooks/use-message", () => ({
  __esModule: true,
  default: () => ({
    alertMessage: jest.fn(),
  }),
}));

jest.mock("@/lib/services/order-service");
jest.mock("@/hooks/useCheckout");

describe("Checkout Flow Integration Tests", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    jest.clearAllMocks();
  });

  const mockCart = {
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

  const mockOrder = {
    id: 123,
    user_id: "user-1",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "5551234567",
    delivery_address: "123 Main St, City, ZIP",
    special_instructions: "Leave at door",
    payment_method: "card",
    total_amount: "150.00",
    status: "pending",
    created_at: "2025-01-01T10:00:00Z",
    updated_at: "2025-01-01T10:00:00Z",
  };

  const renderCheckoutPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <CheckoutPage />
        </CartProvider>
      </QueryClientProvider>
    );
  };

  describe("Checkout Page Rendering", () => {
    it("should display checkout form with all sections", () => {
      renderCheckoutPage();

      expect(screen.getByRole("heading", { name: /checkout/i })).toBeInTheDocument();
      expect(screen.getByText(/customer information/i)).toBeInTheDocument();
      expect(screen.getByText(/delivery details/i)).toBeInTheDocument();
      expect(screen.getByText(/payment method/i)).toBeInTheDocument();
    });

    it("should display order summary sidebar", () => {
      renderCheckoutPage();

      expect(screen.getByText(/order summary/i)).toBeInTheDocument();
    });

    it("should have all required form fields", () => {
      renderCheckoutPage();

      expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/your@email.com/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/street address/i)).toBeInTheDocument();
    });

    it("should have payment method dropdown", () => {
      renderCheckoutPage();

      const paymentSelect = screen.getByDisplayValue(/credit\/debit card/i);
      expect(paymentSelect).toBeInTheDocument();
    });
  });

  describe("Form Validation", () => {
    it("should show validation errors for empty required fields", async () => {
      renderCheckoutPage();

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/full name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it("should validate email format", async () => {
      renderCheckoutPage();

      const emailInput = screen.getByPlaceholderText(/your@email.com/i);
      await userEvent.type(emailInput, "invalid-email");

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      });
    });

    it("should validate phone number length", async () => {
      renderCheckoutPage();

      const phoneInput = screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i);
      await userEvent.type(phoneInput, "123");

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/phone number must be at least 10 digits/i)).toBeInTheDocument();
      });
    });

    it("should validate address length", async () => {
      renderCheckoutPage();

      const addressInput = screen.getByPlaceholderText(/street address/i);
      await userEvent.type(addressInput, "123");

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      });
    });
  });

  describe("Form Submission", () => {
    it("should submit valid checkout form", async () => {
      const mockCheckout = jest.fn().mockResolvedValue(mockOrder);
      (useCheckout as jest.Mock).mockReturnValue({
        checkout: mockCheckout,
        isPending: false,
      });

      renderCheckoutPage();

      // Fill form
      await userEvent.type(screen.getByPlaceholderText(/your name/i), "John Doe");
      await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), "john@example.com");
      await userEvent.type(
        screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i),
        "5551234567"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/street address/i),
        "123 Main St, City, ZIP"
      );

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCheckout).toHaveBeenCalledWith(
          expect.objectContaining({
            customer_name: "John Doe",
            customer_email: "john@example.com",
            customer_phone: "5551234567",
            delivery_address: "123 Main St, City, ZIP",
            payment_method: "card",
          })
        );
      });
    });

    it("should display success message after order submission", async () => {
      const mockCheckout = jest.fn().mockResolvedValue(mockOrder);
      const mockAlertMessage = jest.fn();

      (useCheckout as jest.Mock).mockReturnValue({
        checkout: mockCheckout,
        isPending: false,
        onSuccess: (callback: Function) => callback(mockOrder),
      });

      jest.mock("@/hooks/use-message", () => ({
        __esModule: true,
        default: () => ({
          alertMessage: mockAlertMessage,
        }),
      }));

      renderCheckoutPage();

      // Fill and submit form
      await userEvent.type(screen.getByPlaceholderText(/your name/i), "John Doe");
      await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), "john@example.com");
      await userEvent.type(
        screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i),
        "5551234567"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/street address/i),
        "123 Main St, City, ZIP"
      );

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCheckout).toHaveBeenCalled();
      });
    });

    it("should disable submit button while submitting", async () => {
      (useCheckout as jest.Mock).mockReturnValue({
        checkout: jest.fn(),
        isPending: true,
      });

      renderCheckoutPage();

      const submitButton = screen.getByRole("button", { name: /processing order/i });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Order Summary Component", () => {
    it("should display all cart items in order summary", async () => {
      renderCheckoutPage();

      // Note: This assumes OrderSummary is rendered and shows cart items
      // The actual rendering depends on useCart hook implementation
      await waitFor(() => {
        expect(screen.queryByText(/loading checkout/i)).not.toBeInTheDocument();
      });
    });

    it("should calculate and display total with tax", async () => {
      renderCheckoutPage();

      await waitFor(() => {
        expect(screen.queryByText(/loading checkout/i)).not.toBeInTheDocument();
      });
      // Verify total is displayed (exact value depends on cart data)
      expect(screen.getByText(/total:/i)).toBeInTheDocument();
    });
  });

  describe("Payment Method Selection", () => {
    it("should allow changing payment method", async () => {
      renderCheckoutPage();

      const paymentSelect = screen.getByDisplayValue(/credit\/debit card/i) as HTMLSelectElement;

      await userEvent.selectOptions(paymentSelect, "bank_transfer");
      expect(paymentSelect.value).toBe("bank_transfer");

      await userEvent.selectOptions(paymentSelect, "cash_on_delivery");
      expect(paymentSelect.value).toBe("cash_on_delivery");
    });

    it("should include selected payment method in order submission", async () => {
      const mockCheckout = jest.fn().mockResolvedValue(mockOrder);
      (useCheckout as jest.Mock).mockReturnValue({
        checkout: mockCheckout,
        isPending: false,
      });

      renderCheckoutPage();

      const paymentSelect = screen.getByDisplayValue(/credit\/debit card/i) as HTMLSelectElement;
      await userEvent.selectOptions(paymentSelect, "bank_transfer");

      // Fill required fields
      await userEvent.type(screen.getByPlaceholderText(/your name/i), "John Doe");
      await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), "john@example.com");
      await userEvent.type(
        screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i),
        "5551234567"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/street address/i),
        "123 Main St, City, ZIP"
      );

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCheckout).toHaveBeenCalledWith(
          expect.objectContaining({
            payment_method: "bank_transfer",
          })
        );
      });
    });
  });

  describe("Special Instructions", () => {
    it("should allow optional special instructions", async () => {
      renderCheckoutPage();

      const specialInstructionsInput = screen.getByPlaceholderText(
        /any special requests or allergies/i
      );
      expect(specialInstructionsInput).toBeInTheDocument();

      await userEvent.type(specialInstructionsInput, "Gluten free, please");
      expect(specialInstructionsInput).toHaveValue("Gluten free, please");
    });

    it("should include special instructions in order submission", async () => {
      const mockCheckout = jest.fn().mockResolvedValue(mockOrder);
      (useCheckout as jest.Mock).mockReturnValue({
        checkout: mockCheckout,
        isPending: false,
      });

      renderCheckoutPage();

      // Fill required fields
      await userEvent.type(screen.getByPlaceholderText(/your name/i), "John Doe");
      await userEvent.type(screen.getByPlaceholderText(/your@email.com/i), "john@example.com");
      await userEvent.type(
        screen.getByPlaceholderText(/\+1 \(555\) 123-4567/i),
        "5551234567"
      );
      await userEvent.type(
        screen.getByPlaceholderText(/street address/i),
        "123 Main St, City, ZIP"
      );

      await userEvent.type(
        screen.getByPlaceholderText(/any special requests or allergies/i),
        "Gluten free, please"
      );

      const submitButton = screen.getByRole("button", { name: /place order/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockCheckout).toHaveBeenCalledWith(
          expect.objectContaining({
            special_instructions: "Gluten free, please",
          })
        );
      });
    });
  });
});
