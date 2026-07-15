import type { Order, OrderItem, OrderStatus } from '@/shared/lib/types'
import type { OrderItemResponse, SalesOrderResponse } from './types'

const mapOrderItem = (i: OrderItemResponse): OrderItem => ({
  productId: String(i.product_id),
  productName: '',
  quantity: i.quantity,
  price: i.unit_price,
})

export function mapOrder(o: SalesOrderResponse): Order {
  return {
    id: String(o.id),
    orderNumber: o.reference,
    customerId: String(o.customer_id),
    customerName: '',
    status: o.status as OrderStatus,
    items: o.items.map(mapOrderItem),
    total: o.items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0),
    createdAt: o.created_at || o.order_date,
  }
}