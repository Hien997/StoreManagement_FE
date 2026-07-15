import type { Customer } from '@/shared/lib/types'
import type { CustomerResponse } from './types'

export function mapCustomer(c: CustomerResponse): Customer {
  return {
    id: String(c.id),
    name: c.name,
    email: c.email,
    phone: c.phone,
    address: c.address,
    createdAt: '',
    totalOrders: 0,
    totalSpent: 0,
  }
}