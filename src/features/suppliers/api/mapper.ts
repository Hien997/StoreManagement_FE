import type { Supplier } from '@/shared/lib/types'
import type { SupplierResponse } from './types'

export function mapSupplier(s: SupplierResponse): Supplier {
  return {
    id: String(s.id),
    name: s.name,
    contactName: s.contact_name,
    email: s.email,
    phone: s.phone,
    address: s.address,
    outstandingBalance: 0,
    createdAt: '',
  }
}