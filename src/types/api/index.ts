// Generated API types from Swagger (Store Management API v1.0)
// Base path: /api/v1
// These mirror the backend DTOs exactly (snake_case, integer IDs).

export interface Pagination {
  has_more: boolean;
  limit: number;
  next_cursor: string;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: Pagination;
}

/* ----------------------------- Auth ----------------------------- */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: UserInfo;
}

export interface RefreshRequest {
  refresh_token: string;
}

export interface RefreshResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

export interface UserInfo {
  id: number
  username: string
  email: string
  full_name: string
  roles: string[]
}

/* ---------------------------- Brands ----------------------------- */

export interface BrandResponse {
  id: string
  code: string
  name: string
  logo_url?: string
  country?: string
  is_active: boolean
}

export interface CreateBrandRequest {
  code: string
  name: string
  logo_url?: string
  country?: string
  is_active?: boolean
}

export interface UpdateBrandRequest {
  code?: string
  name?: string
  logo_url?: string
  country?: string
  is_active?: boolean
}

/* --------------------------- Categories -------------------------- */

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  parent_id: number;
  active: boolean;
}

export interface CreateCategoryRequest {
  name: string;
  slug: string;
  description?: string;
  parent_id?: number;
  active?: boolean;
}

export interface UpdateCategoryRequest {
  name?: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  active?: boolean;
}

/* --------------------------- Customers --------------------------- */

export interface CustomerResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  active: boolean;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export interface UpdateCustomerRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

/* --------------------------- Inventory --------------------------- */

export interface InventoryResponse {
  id: number;
  product_id: number;
  warehouse_id: number;
  quantity: number;
}

export interface CreateInventoryRequest {
  product_id: number;
  warehouse_id: number;
  quantity?: number;
}

export interface UpdateInventoryRequest {
  quantity: number;
}

/* -------------------------- Permissions -------------------------- */

export interface PermissionResponse {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface CreatePermissionRequest {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

export interface UpdatePermissionRequest {
  name: string;
  resource: string;
  action: string;
  description?: string;
}

/* ---------------------------- Products --------------------------- */

export interface ProductResponse {
  id: number;
  sku: string;
  name: string;
  description: string;
  category_id: number;
  brand_id: number;
  unit_id: number;
  supplier_id: number;
  cost_price: number;
  sale_price: number;
  reorder_level: number;
  active: boolean;
  expired_date?: string;
  created_at?: string;
}

export interface CreateProductRequest {
  name: string;
  sku: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  unit_id?: number;
  supplier_id?: number;
  cost_price?: number;
  sale_price?: number;
  reorder_level?: number;
  active?: boolean;
  expired_date?: string;
}

export interface UpdateProductRequest {
  name?: string;
  sku?: string;
  description?: string;
  category_id?: number;
  brand_id?: number;
  unit_id?: number;
  supplier_id?: number;
  cost_price?: number;
  sale_price?: number;
  reorder_level?: number;
  active?: boolean;
  expired_date?: string;
}

/* ----------------------------- Reports --------------------------- */

export interface PurchaseSummary {
  from: string;
  to: string;
  order_count: number;
  total_amount: number;
}

export interface SalesSummary {
  from: string;
  to: string;
  order_count: number;
  total_amount: number;
}

/* ------------------------------ Roles ---------------------------- */

export interface RolePermissionResponse {
  id: number;
  name: string;
  resource: string;
  action: string;
  description: string;
}

export interface RoleResponse {
  id: number;
  name: string;
  description: string;
  permissions: RolePermissionResponse[];
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  name: string;
  description?: string;
}

export interface AssignPermissionsRequest {
  permission_ids: number[];
}

/* --------------------------- Sales Orders ------------------------ */

export interface OrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  discount_amount: number;
  line_total: number;
}

export interface OrderItemRequest {
  product_id: number;
  quantity: number;
  unit_price?: number;
}

export interface SalesOrderResponse {
  id: number;
  reference: string;
  customer_id: number;
  warehouse_id: number;
  status: string;
  note: string;
  order_date: string;
  created_at: string;
  items: OrderItemResponse[];
}

export interface CreateSalesOrderRequest {
  customer_id: number;
  warehouse_id: number;
  items: OrderItemRequest[];
  reference?: string;
  order_date?: string;
  note?: string;
}

export interface UpdateSalesOrderRequest {
  status: "pending" | "completed" | "cancelled";
  note?: string;
}

/* ----------------------- Customer Sales Orders -------------------- */
// Mirrors the customer-facing API documented in
// .agents/skills/integrate-webapi/intergate.md (section 4).

export interface CustomerOrderItemResponse {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  sku: string;
  unit_price: number;
  quantity: number;
  discount_amount: number;
  line_total: number;
}

export interface CustomerOrderResponse {
  id: number;
  order_number: string;
  customer_id: number;
  warehouse_id: number;
  reference: string;
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "refunded";
  payment_method: string;
  shipping_address: string;
  billing_address: string;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  shipping_fee: number;
  total_amount: number;
  notes: string;
  order_date: string;
  created_at: string;
  items: CustomerOrderItemResponse[];
}

export interface CustomerOrderItemRequest {
  product_id: number;
  quantity: number;
  unit_price: number;
  product_name?: string;
  sku?: string;
  discount_amount?: number;
  line_total?: number;
}

// The backend ignores any customer_id sent by the client and derives it from
// the bearer token; warehouse_id defaults to 0 server-side. Therefore neither
// field belongs in the customer request body.
export interface CreateCustomerOrderRequest {
  items: CustomerOrderItemRequest[];
  billing_address?: string;
  shipping_address?: string;
  discount_amount?: number;
  shipping_fee?: number;
  subtotal?: number;
  tax_amount?: number;
  total_amount?: number;
  notes?: string;
  order_date?: string;
  payment_method?: string;
  reference?: string;
}

/* ---------------------------- Settings --------------------------- */

export interface SettingResponse {
  id: number;
  key: string;
  value: string;
  group: string;
}

export interface UpsertSettingRequest {
  key: string;
  value: string;
  group?: string;
}

/* ---------------------------- Suppliers -------------------------- */

export interface SupplierResponse {
  id: number;
  name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  tax_code: string;
  active: boolean;
}

export interface CreateSupplierRequest {
  name: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_code?: string;
  active?: boolean;
}

export interface UpdateSupplierRequest {
  name?: string;
  contact_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  tax_code?: string;
  active?: boolean;
}

/* ------------------------------ Users ---------------------------- */

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  full_name: string;
  phone: string;
  role_id: number;
  active: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  role_id: number;
  full_name?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  full_name?: string;
  phone?: string;
  role_id?: number;
  active?: boolean;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}