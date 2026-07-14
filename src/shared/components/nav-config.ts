import {
  LayoutDashboard,
  Package,
  Tags,
  Tag,
  Boxes,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  Settings,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ title: 'Dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    label: 'Inventory',
      items: [
        { title: 'Products', href: '/products', icon: Package },
        { title: 'Categories', href: '/categories', icon: Tags },
        { title: 'Brands', href: '/brands', icon: Tag },
        { title: 'Stock', href: '/inventory', icon: Boxes },
      ],
  },
  {
    label: 'Operations',
    items: [
      { title: 'Orders', href: '/orders', icon: ShoppingCart },
      { title: 'Customers', href: '/customers', icon: Users },
      { title: 'Suppliers', href: '/suppliers', icon: Truck },
    ],
  },
  {
    label: 'Analytics',
    items: [{ title: 'Reports', href: '/reports', icon: BarChart3 }],
  },
  {
    label: 'System',
    items: [{ title: 'Settings', href: '/settings', icon: Settings }],
  },
]