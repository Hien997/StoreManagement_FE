import type { StockMovement } from '@/shared/lib/types'
import type { InventoryResponse } from './types'

export function mapInventoryToMovement(
  inv: InventoryResponse,
  productName: string,
): StockMovement {
  return {
    id: String(inv.id),
    productId: String(inv.product_id),
    productName,
    type: 'in',
    quantity: inv.quantity,
    note: 'Stock on hand',
    createdAt: '',
  }
}