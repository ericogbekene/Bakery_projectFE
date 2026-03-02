// Mock ENDPOINTS before importing modules that depend on it
jest.mock("@/constants/endpoints", () => ({
  __esModule: true,
  default: {
    EXTERNAL: {
      ORDERS: {
        CREATE: "/orders/create/",
        DETAIL: "/orders/",
      },
    },
  },
}));

jest.mock("@/lib/api/http-client");

import orderService, { Order } from "@/lib/services/order-service";
import { httpClient } from "@/lib/api/http-client";

describe("Order Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockOrder: Order = {
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

  describe("createOrder", () => {
    it("should create an order with valid data", async () => {
      const mockData = {
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "5551234567",
        delivery_address: "123 Main St, City, ZIP",
        special_instructions: "Leave at door",
        payment_method: "card",
      };

      (httpClient.post as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.createOrder(mockData);

      expect(httpClient.post).toHaveBeenCalledWith(
        "/orders/create/",
        mockData
      );
      expect(result).toEqual(mockOrder);
      expect(result.id).toBe(123);
      expect(result.customer_name).toBe("John Doe");
    });

    it("should handle create order errors", async () => {
      const mockData = {
        customer_name: "John Doe",
        customer_email: "john@example.com",
        customer_phone: "5551234567",
        delivery_address: "123 Main St, City, ZIP",
        special_instructions: "",
        payment_method: "card",
      };

      const error = new Error("Network error");
      (httpClient.post as jest.Mock).mockRejectedValue(error);

      await expect(orderService.createOrder(mockData)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getOrder", () => {
    it("should fetch order by ID", async () => {
      (httpClient.get as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrder(123);

      expect(httpClient.get).toHaveBeenCalledWith(
        `${ENDPOINTS.EXTERNAL.ORDERS}/123`
      );
      expect(result).toEqual(mockOrder);
    });

    it("should handle 404 not found error", async () => {
      const error = new Error("Order not found");
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getOrder(999)).rejects.toThrow(
        "Order not found"
      );
    });

    it("should handle network errors", async () => {
      const error = new Error("Network timeout");
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.getOrder(123)).rejects.toThrow(
        "Network timeout"
      );
    });
  });

  describe("listOrders", () => {
    it("should fetch list of orders", async () => {
      const mockOrders = [mockOrder, { ...mockOrder, id: 124 }];
      (httpClient.get as jest.Mock).mockResolvedValue(mockOrders);

      const result = await orderService.listOrders();

      expect(httpClient.get).toHaveBeenCalledWith(ENDPOINTS.EXTERNAL.ORDERS);
      expect(result).toEqual(mockOrders);
      expect(result.length).toBe(2);
    });

    it("should handle empty order list", async () => {
      (httpClient.get as jest.Mock).mockResolvedValue([]);

      const result = await orderService.listOrders();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it("should handle errors when fetching orders", async () => {
      const error = new Error("Failed to fetch orders");
      (httpClient.get as jest.Mock).mockRejectedValue(error);

      await expect(orderService.listOrders()).rejects.toThrow(
        "Failed to fetch orders"
      );
    });
  });

  describe("cancelOrder", () => {
    it("should cancel an order by ID", async () => {
      const cancelledOrder = { ...mockOrder, status: "cancelled" };
      (httpClient.patch as jest.Mock).mockResolvedValue(cancelledOrder);

      const result = await orderService.cancelOrder(123);

      expect(httpClient.patch).toHaveBeenCalledWith(
        `${ENDPOINTS.EXTERNAL.ORDERS}/123`,
        { status: "cancelled" }
      );
      expect(result.status).toBe("cancelled");
    });

    it("should handle cancellation of non-existent order", async () => {
      const error = new Error("Order not found");
      (httpClient.patch as jest.Mock).mockRejectedValue(error);

      await expect(orderService.cancelOrder(999)).rejects.toThrow(
        "Order not found"
      );
    });

    it("should handle errors during cancellation", async () => {
      const error = new Error("Cannot cancel completed order");
      (httpClient.patch as jest.Mock).mockRejectedValue(error);

      await expect(orderService.cancelOrder(123)).rejects.toThrow(
        "Cannot cancel completed order"
      );
    });
  });

  describe("Order Data Integrity", () => {
    it("should preserve all order fields from API response", async () => {
      (httpClient.get as jest.Mock).mockResolvedValue(mockOrder);

      const result = await orderService.getOrder(123);

      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("user_id");
      expect(result).toHaveProperty("customer_name");
      expect(result).toHaveProperty("customer_email");
      expect(result).toHaveProperty("customer_phone");
      expect(result).toHaveProperty("delivery_address");
      expect(result).toHaveProperty("special_instructions");
      expect(result).toHaveProperty("payment_method");
      expect(result).toHaveProperty("total_amount");
      expect(result).toHaveProperty("status");
      expect(result).toHaveProperty("created_at");
      expect(result).toHaveProperty("updated_at");
    });
  });
});
