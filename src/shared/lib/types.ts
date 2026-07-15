export type ID = string;

export type ProductStatus = "active" | "inactive" | "discontinued";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";
export type OrderStatus =
  | "draft"
  | "pending"
  | "paid"
  | "completed"
  | "cancelled";

export interface Category {
  id: ID;
  name: string;
  parentId: ID | null;
  description?: string;
  productCount: number;
}

export interface Supplier {
  id: ID;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  outstandingBalance: number;
  createdAt: string;
}

export interface Brand {
  id: ID;
  code: string;
  name: string;
  logoUrl?: string;
  country?: string;
  isActive: boolean;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  totalOrders: number;
  totalSpent: number;
}

export interface Product {
  id: ID;
  sku: string;
  barcode: string;
  name: string;
  description?: string;
  categoryId: ID;
  brand: string;
  supplierId: ID;
  purchasePrice: number;
  sellingPrice: number;
  stock: number;
  unit: string;
  status: ProductStatus;
  imageUrl: string;
  expiredDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: ID;
  productName: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: ID;
  orderNumber: string;
  customerId: ID;
  customerName: string;
  status: OrderStatus;
  items: OrderItem[];
  total: number;
  createdAt: string;
}

export type ActivityType =
  | "low_stock"
  | "new_order"
  | "completed_order"
  | "inventory_change"
  | "product_created"
  | "out_of_stock";

export interface Activity {
  id: ID;
  type: ActivityType;
  message: string;
  createdAt: string;
}

export interface AppNotification {
  id: ID;
  type: ActivityType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface StockMovement {
  id: ID;
  productId: ID;
  productName: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  note: string;
  createdAt: string;
}
