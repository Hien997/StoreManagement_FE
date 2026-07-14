// Maps backend API DTOs (snake_case, integer IDs) to the existing UI domain
// types (camelCase, string IDs) defined in @/shared/lib/types.
// This keeps the existing components untouched while feeding them real data.

import type {
  Brand,
  Category,
  Customer,
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductStatus,
  StockMovement,
  Supplier,
} from "@/shared/lib/types";

import type {
  BrandResponse,
  CategoryResponse,
  CustomerResponse,
  InventoryResponse,
  OrderItemResponse,
  ProductResponse,
  SalesOrderResponse,
  SupplierResponse,
} from "./index";

export const toBrand = (b: BrandResponse): Brand => ({
  id: b.id,
  code: b.code,
  name: b.name,
  logoUrl: b.logo_url,
  country: b.country,
  isActive: b.is_active,
});

export const toProduct = (p: ProductResponse): Product => ({
  id: String(p.id),
  sku: p.sku,
  barcode: "",
  name: p.name,
  categoryId: String(p.category_id),
  brand: String(p.brand_id),
  supplierId: String(p.supplier_id),
  purchasePrice: p.cost_price,
  sellingPrice: p.sale_price,
  stock: 0,
  unit: String(p.unit_id),
  status: (p.active ? "active" : "inactive") as ProductStatus,
  imageUrl: "",
  expiredDate: p.expired_date ?? "",
  createdAt: p.created_at ?? "",
  updatedAt: "",
});

export const toCategory = (c: CategoryResponse): Category => ({
  id: String(c.id),
  name: c.name,
  parentId: c.parent_id ? String(c.parent_id) : null,
  description: c.description,
  productCount: 0,
});

export const toSupplier = (s: SupplierResponse): Supplier => ({
  id: String(s.id),
  name: s.name,
  contactName: s.contact_name,
  email: s.email,
  phone: s.phone,
  address: s.address,
  outstandingBalance: 0,
  createdAt: "",
});

export const toCustomer = (c: CustomerResponse): Customer => ({
  id: String(c.id),
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: c.address,
  createdAt: "",
  totalOrders: 0,
  totalSpent: 0,
});

const toOrderItem = (i: OrderItemResponse): OrderItem => ({
  productId: String(i.product_id),
  productName: "",
  quantity: i.quantity,
  price: i.unit_price,
});

export const toOrder = (o: SalesOrderResponse): Order => ({
  id: String(o.id),
  orderNumber: o.reference,
  customerId: String(o.customer_id),
  customerName: "",
  status: o.status as OrderStatus,
  items: o.items.map(toOrderItem),
  total: o.items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0),
  createdAt: o.created_at || o.order_date,
});

// The backend exposes inventory records (product_id, warehouse_id, quantity)
// but no dedicated "stock movement" feed. We surface inventory records as
// movements so the Inventory page can render real data.
export const toStockMovement = (
  inv: InventoryResponse,
  productName: string,
): StockMovement => ({
  id: String(inv.id),
  productId: String(inv.product_id),
  productName,
  type: "in",
  quantity: inv.quantity,
  note: "Stock on hand",
  createdAt: "",
});
