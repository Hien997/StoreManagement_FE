import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Layout } from '@/shared/components/Layout'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { ProductsPage } from '@/features/products/pages/ProductsPage'
import { ProductDetailPage } from '@/features/products/pages/ProductDetailPage'
import { CategoriesPage } from '@/features/categories/pages/CategoriesPage'
import { BrandsPage } from '@/features/brands/pages/BrandsPage'
import { InventoryPage } from '@/features/inventory/pages/InventoryPage'
import { OrdersPage } from '@/features/orders/pages/OrdersPage'
import { OrderDetailPage } from '@/features/orders/pages/OrderDetailPage'
import { CreateOrderPage } from '@/features/orders/pages/CreateOrderPage'
import { CustomersPage } from '@/features/customers/pages/CustomersPage'
import { CustomerDetailPage } from '@/features/customers/pages/CustomerDetailPage'
import { SuppliersPage } from '@/features/suppliers/pages/SuppliersPage'
import { SupplierDetailPage } from '@/features/suppliers/pages/SupplierDetailPage'
import { ReportsPage } from '@/features/reports/pages/ReportsPage'
import { SettingsPage } from '@/features/settings/pages/SettingsPage'

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'brands', element: <BrandsPage /> },
      { path: 'inventory', element: <InventoryPage /> },
      { path: 'orders', element: <OrdersPage /> },
      { path: 'orders/new', element: <CreateOrderPage /> },
      { path: 'orders/:id', element: <OrderDetailPage /> },
      { path: 'customers', element: <CustomersPage /> },
      { path: 'customers/:id', element: <CustomerDetailPage /> },
      { path: 'suppliers', element: <SuppliersPage /> },
      { path: 'suppliers/:id', element: <SupplierDetailPage /> },
      { path: 'reports', element: <ReportsPage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])