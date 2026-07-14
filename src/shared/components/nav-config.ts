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

import { useTranslation } from 'react-i18next'

export interface NavItem {
  titleKey: string
  href: string
  icon: LucideIcon
  badge?: string
}

export interface NavGroup {
  labelKey: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    labelKey: 'nav.groups.overview',
    items: [{ titleKey: 'nav.dashboard', href: '/', icon: LayoutDashboard }],
  },
  {
    labelKey: 'nav.groups.inventory',
    items: [
      { titleKey: 'nav.products', href: '/products', icon: Package },
      { titleKey: 'nav.categories', href: '/categories', icon: Tags },
      { titleKey: 'nav.brands', href: '/brands', icon: Tag },
      { titleKey: 'nav.stock', href: '/inventory', icon: Boxes },
    ],
  },
  {
    labelKey: 'nav.groups.operations',
    items: [
      { titleKey: 'nav.orders', href: '/orders', icon: ShoppingCart },
      { titleKey: 'nav.customers', href: '/customers', icon: Users },
      { titleKey: 'nav.suppliers', href: '/suppliers', icon: Truck },
    ],
  },
  {
    labelKey: 'nav.groups.analytics',
    items: [{ titleKey: 'nav.reports', href: '/reports', icon: BarChart3 }],
  },
  {
    labelKey: 'nav.groups.system',
    items: [{ titleKey: 'nav.settings', href: '/settings', icon: Settings }],
  },
]

export function useNavGroups() {
  const { t } = useTranslation()
  return navGroups.map((group) => ({
    label: t(group.labelKey),
    items: group.items.map((item) => ({ ...item, title: t(item.titleKey) })),
  }))
}
