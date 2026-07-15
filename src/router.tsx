import { lazy, Suspense } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'

import { Layout } from '@/shared/components/Layout'
import { ProtectedRoute } from '@/shared/components/ProtectedRoute'
import { RouteLoader } from '@/shared/components/RouteLoader'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { ForgotPasswordPage } from '@/features/auth/pages/ForgotPasswordPage'
import { StorefrontLayout } from '@/storefront/StorefrontLayout'
import { StoreProtectedRoute } from '@/storefront/StoreProtectedRoute'

// Admin pages are code-split so the initial bundle stays small.
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage').then((m) => ({ default: m.DashboardPage })))
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const ProductDetailPage = lazy(() => import('@/features/products/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })))
const BrandsPage = lazy(() => import('@/features/brands/pages/BrandsPage').then((m) => ({ default: m.BrandsPage })))
const InventoryPage = lazy(() => import('@/features/inventory/pages/InventoryPage').then((m) => ({ default: m.InventoryPage })))
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })))
const OrderDetailPage = lazy(() => import('@/features/orders/pages/OrderDetailPage').then((m) => ({ default: m.OrderDetailPage })))
const CreateOrderPage = lazy(() => import('@/features/orders/pages/CreateOrderPage').then((m) => ({ default: m.CreateOrderPage })))
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage').then((m) => ({ default: m.CustomersPage })))
const CustomerDetailPage = lazy(() => import('@/features/customers/pages/CustomerDetailPage').then((m) => ({ default: m.CustomerDetailPage })))
const SuppliersPage = lazy(() => import('@/features/suppliers/pages/SuppliersPage').then((m) => ({ default: m.SuppliersPage })))
const SupplierDetailPage = lazy(() => import('@/features/suppliers/pages/SupplierDetailPage').then((m) => ({ default: m.SupplierDetailPage })))
const ReportsPage = lazy(() => import('@/features/reports/pages/ReportsPage').then((m) => ({ default: m.ReportsPage })))
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage').then((m) => ({ default: m.SettingsPage })))

// Storefront pages are code-split from the admin bundle.
const HomePage = lazy(() => import('@/storefront/pages/HomePage').then((m) => ({ default: m.HomePage })))
const StoreProductsPage = lazy(() => import('@/storefront/pages/ProductsPage').then((m) => ({ default: m.ProductsPage })))
const StoreProductDetailPage = lazy(() => import('@/storefront/pages/ProductDetailPage').then((m) => ({ default: m.ProductDetailPage })))
const StoreCategoriesPage = lazy(() => import('@/storefront/pages/CategoriesPage').then((m) => ({ default: m.CategoriesPage })))
const StoreBrandsPage = lazy(() => import('@/storefront/pages/BrandsPage').then((m) => ({ default: m.BrandsPage })))
const SearchPage = lazy(() => import('@/storefront/pages/SearchPage').then((m) => ({ default: m.SearchPage })))
const StoreLoginPage = lazy(() => import('@/storefront/pages/LoginPage').then((m) => ({ default: m.LoginPage })))
const RegisterPage = lazy(() => import('@/storefront/pages/RegisterPage').then((m) => ({ default: m.RegisterPage })))
const AccountPage = lazy(() => import('@/storefront/pages/AccountPage').then((m) => ({ default: m.AccountPage })))
const NotFoundPage = lazy(() => import('@/storefront/pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })))
const CartPage = lazy(() => import('@/storefront/pages/CartPage').then((m) => ({ default: m.CartPage })))
const CheckoutPage = lazy(() => import('@/storefront/pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage })))
const OrderConfirmationPage = lazy(() => import('@/storefront/pages/OrderConfirmationPage').then((m) => ({ default: m.OrderConfirmationPage })))
const StoreOrdersPage = lazy(() => import('@/storefront/pages/OrdersPage').then((m) => ({ default: m.OrdersPage })))

function withSuspense(node: React.ReactNode) {
  return <Suspense fallback={<RouteLoader />}>{node}</Suspense>
}

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
      { index: true, element: withSuspense(<DashboardPage />) },
      { path: 'products', element: withSuspense(<ProductsPage />) },
      { path: 'products/:id', element: withSuspense(<ProductDetailPage />) },
      { path: 'categories', element: withSuspense(<CategoriesPage />) },
      { path: 'brands', element: withSuspense(<BrandsPage />) },
      { path: 'inventory', element: withSuspense(<InventoryPage />) },
      { path: 'orders', element: withSuspense(<OrdersPage />) },
      { path: 'orders/new', element: withSuspense(<CreateOrderPage />) },
      { path: 'orders/:id', element: withSuspense(<OrderDetailPage />) },
      { path: 'customers', element: withSuspense(<CustomersPage />) },
      { path: 'customers/:id', element: withSuspense(<CustomerDetailPage />) },
      { path: 'suppliers', element: withSuspense(<SuppliersPage />) },
      { path: 'suppliers/:id', element: withSuspense(<SupplierDetailPage />) },
      { path: 'reports', element: withSuspense(<ReportsPage />) },
      { path: 'settings', element: withSuspense(<SettingsPage />) },
    ],
  },
  {
    path: '/shop',
    element: <StorefrontLayout />,
    children: [
      { index: true, element: withSuspense(<HomePage />) },
      { path: 'products', element: withSuspense(<StoreProductsPage />) },
      { path: 'product/:id', element: withSuspense(<StoreProductDetailPage />) },
      { path: 'categories', element: withSuspense(<StoreCategoriesPage />) },
      { path: 'category/:id', element: withSuspense(<StoreProductsPage />) },
      { path: 'brands', element: withSuspense(<StoreBrandsPage />) },
      { path: 'brand/:id', element: withSuspense(<StoreProductsPage />) },
      { path: 'search', element: withSuspense(<SearchPage />) },
      { path: 'login', element: withSuspense(<StoreLoginPage />) },
      { path: 'register', element: withSuspense(<RegisterPage />) },
      {
        path: 'account',
        element: (
          <StoreProtectedRoute>
            {withSuspense(<AccountPage />)}
          </StoreProtectedRoute>
        ),
      },
      { path: 'cart', element: withSuspense(<CartPage />) },
      {
        path: 'checkout',
        element: (
          <StoreProtectedRoute>
            {withSuspense(<CheckoutPage />)}
          </StoreProtectedRoute>
        ),
      },
      { path: 'order/:id', element: withSuspense(<OrderConfirmationPage />) },
      {
        path: 'orders',
        element: (
          <StoreProtectedRoute>
            {withSuspense(<StoreOrdersPage />)}
          </StoreProtectedRoute>
        ),
      },
    ],
  },
  { path: '/shop/*', element: withSuspense(<NotFoundPage />) },
  { path: '*', element: <Navigate to="/" replace /> },
])