import { api } from "./api";
import { getAccessToken } from "./session";

export type OrderStatus = "new" | "processing" | "hold" | "handed_to_courier" | "shipping" | "delivered" | "cancelled" | "returned";

export type OrderSummary = {
  orderNumber: string;
  status: OrderStatus;
  total: number;
  createdAt: string;
  itemCount: number;
  images: string[];
};

export type OrderList = { items: OrderSummary[]; total: number; page: number; totalPages: number };

export type OrderDetail = {
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  note: string | null;
  subtotal: number;
  shippingFee: number;
  total: number;
  createdAt: string;
  items: { id: string; name: string; variantLabel: string | null; image: string | null; unitPrice: number; quantity: number; lineTotal: number }[];
};

export const STATUS: Record<OrderStatus, { label: string; tone: string }> = {
  new: { label: "Order placed", tone: "bg-accent-soft text-accent-dark" },
  processing: { label: "Processing", tone: "bg-soft text-brand" },
  hold: { label: "On hold", tone: "bg-amber-50 text-amber-800" },
  handed_to_courier: { label: "With courier", tone: "bg-soft text-brand" },
  shipping: { label: "On the way", tone: "bg-soft text-brand" },
  delivered: { label: "Delivered", tone: "bg-success-soft text-success" },
  cancelled: { label: "Cancelled", tone: "bg-red-50 text-danger" },
  returned: { label: "Returned", tone: "bg-orange-50 text-orange-800" },
};

/** The steps an order moves through, in order; cancelled, returned and on-hold orders are off this path. */
export const STEPS: OrderStatus[] = ["new", "processing", "handed_to_courier", "shipping", "delivered"];

export const orderDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export async function fetchMyOrders(page = 1) {
  const res = await api<OrderList>(`/orders/mine?page=${page}`, { method: "GET", token: await getAccessToken() });
  return res.ok ? res.data : null;
}

/** The order, "missing" when it is not this customer's, or null when the shop can't be reached. */
export async function fetchMyOrder(number: string): Promise<OrderDetail | "missing" | null> {
  const res = await api<OrderDetail>(`/orders/mine/${encodeURIComponent(number)}`, { method: "GET", token: await getAccessToken() });
  if (res.ok) return res.data;
  return res.status === 404 ? "missing" : null;
}
