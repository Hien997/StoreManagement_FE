import type { Activity, AppNotification, Category, Customer, Order, OrderStatus, Product, ProductStatus, StockMovement, Supplier } from './types'

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const rand = mulberry32(42)
const pick = <T,>(a: T[]): T => a[Math.floor(rand() * a.length)]
const int = (min: number, max: number) => Math.floor(rand() * (max - min + 1)) + min
const float = (min: number, max: number, d = 2) => Number((rand() * (max - min) + min).toFixed(d))
const daysAgo = (n: number) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString() }

const roots = ['Beverages','Snacks','Dairy','Bakery','Produce','Meat','Seafood','Frozen','Household','Personal Care','Electronics','Office','Toys','Pharmacy','Pet Care']
const subs: Record<string, string[]> = {
  Beverages: ['Water','Juice','Soda','Coffee','Tea'],
  Snacks: ['Chips','Nuts','Cookies','Candy'],
  Dairy: ['Milk','Cheese','Yogurt','Butter'],
  Electronics: ['Phones','Laptops','Audio','Accessories'],
  Household: ['Cleaning','Kitchen','Storage','Paper'],
  'Personal Care': ['Skincare','Haircare','Oral','Fragrance'],
}
const brands = ['FreshCo','NatureBest','PrimeSelect','HomeEssentials','TechPro','PureLife','GoldenHarvest','UrbanStyle','EcoGreen','ValueMax']
const units = ['pcs','box','kg','g','L','pack','bottle','can']
const supNames = ['Global Traders','Metro Wholesale','Pacific Imports','Summit Dist','Apex Supply','Continental','BlueOcean','Vertex Merchants']
const first = ['John','Mary','David','Sarah','Michael','Emma','James','Olivia','Robert','Linda']
const last = ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Wilson','Anderson']

export const categories: Category[] = []
const rootCats: Category[] = []
roots.forEach((name, i) => { const id = `cat-${i + 1}`; categories.push({ id, name, parentId: null, productCount: 0 }); rootCats.push(categories[categories.length - 1]) })
Object.entries(subs).forEach(([parent, list]) => { const p = rootCats.find((c) => c.name === parent)!; list.forEach((s, j) => categories.push({ id: `${p.id}-${j + 1}`, name: s, parentId: p.id, productCount: 0 })) })

export const suppliers: Supplier[] = supNames.map((name, i) => ({
  id: `sup-${i + 1}`, name, contactName: `${pick(first)} ${pick(last)}`,
  email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@example.com`,
  phone: `+1-${int(200,999)}-${int(200,999)}-${int(1000,9999)}`,
  address: `${int(10,999)} ${pick(['Main','Oak','Pine','Maple'])} St`,
  outstandingBalance: float(0, 50000), createdAt: daysAgo(int(100, 800)),
}))

export const customers: Customer[] = Array.from({ length: 300 }, (_, i) => ({
  id: `cus-${i + 1}`, name: `${pick(first)} ${pick(last)}`, email: `customer${i + 1}@mail.com`,
  phone: `+1-${int(200,999)}-${int(200,999)}-${int(1000,9999)}`,
  address: `${int(10,999)} ${pick(['Elm','Park','Lake','Hill'])} Ave`,
  createdAt: daysAgo(int(1, 600)), totalOrders: int(0, 50), totalSpent: float(0, 20000),
}))

export const products: Product[] = Array.from({ length: 1200 }, (_, i) => {
  const parent = pick(rootCats)
  const children = categories.filter((c) => c.parentId === parent.id)
  const cat = children.length ? pick(children) : parent
  const pp = float(1, 200)
  const stock = int(0, 500)
  const status: ProductStatus = stock === 0 ? 'discontinued' : pick(['active', 'active', 'active', 'inactive'])
  return {
    id: `prod-${i + 1}`, sku: `SKU-${10000 + i}`, barcode: String(int(100000000000, 999999999999)),
    name: `${pick(brands)} ${parent.name} ${pick(['Classic', 'Premium', 'Eco', 'Pro', 'Lite', 'Max'])} ${int(1, 99)}`,
    categoryId: cat.id, brand: pick(brands), supplierId: pick(suppliers).id,
    purchasePrice: pp, sellingPrice: Number((pp * float(1.2, 2.5)).toFixed(2)),
    stock, unit: pick(units), status, imageUrl: `https://picsum.photos/seed/prod${i + 1}/200/200`,
    expiredDate: daysAgo(int(-30, 365)),
    createdAt: daysAgo(int(1, 700)), updatedAt: daysAgo(int(0, 30)),
  }
})
products.forEach((p) => { const c = categories.find((x) => x.id === p.categoryId); if (c) c.productCount++ })

const orderStatuses: OrderStatus[] = ['draft', 'pending', 'paid', 'completed', 'cancelled']
export const orders: Order[] = Array.from({ length: 400 }, (_, i) => {
  const customer = pick(customers)
  const items = Array.from({ length: int(1, 5) }, () => {
    const p = pick(products)
    return { productId: p.id, productName: p.name, quantity: int(1, 10), price: p.sellingPrice }
  })
  return {
    id: `ord-${i + 1}`, orderNumber: `ORD-${10000 + i}`, customerId: customer.id, customerName: customer.name,
    status: pick(orderStatuses), items, total: Number(items.reduce((s, it) => s + it.quantity * it.price, 0).toFixed(2)),
    createdAt: daysAgo(int(0, 120)),
  }
})

function buildActivities(): Activity[] {
  const acts: Activity[] = []
  products.filter((p) => p.stock === 0).slice(0, 20).forEach((p, i) =>
    acts.push({ id: `act-${i + 1}`, type: 'out_of_stock', message: `${p.name} is out of stock`, createdAt: daysAgo(int(0, 5)) }))
  products.filter((p) => p.stock > 0 && p.stock < 15).slice(0, 20).forEach((p, i) =>
    acts.push({ id: `act-l-${i + 1}`, type: 'low_stock', message: `Low stock: ${p.name} (${p.stock} ${p.unit})`, createdAt: daysAgo(int(0, 5)) }))
  orders.filter((o) => o.status === 'completed').slice(0, 20).forEach((o, i) =>
    acts.push({ id: `act-c-${i + 1}`, type: 'completed_order', message: `Order ${o.orderNumber} completed`, createdAt: daysAgo(int(0, 5)) }))
  return acts.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
}
export const activities: Activity[] = buildActivities()
export const notifications: AppNotification[] = activities.slice(0, 15).map((a, i) => ({
  id: `n-${i + 1}`, type: a.type, title: a.type.replace(/_/g, ' '), message: a.message, read: i > 5, createdAt: a.createdAt,
}))

export const stockMovements: StockMovement[] = Array.from({ length: 200 }, (_, i) => {
  const p = pick(products)
  return { id: `mv-${i + 1}`, productId: p.id, productName: p.name, type: pick(['in', 'out', 'adjustment'] as const), quantity: int(1, 100), note: pick(['Receipt', 'Sale', 'Adjustment', 'Return', 'Damage']), createdAt: daysAgo(int(0, 60)) }
})

export function getDashboardStats() {
  const paid = orders.filter((o) => o.status === 'paid' || o.status === 'completed')
  const revenue = paid.reduce((s, o) => s + o.total, 0)
  const cost = paid.reduce((s, o) => s + o.items.reduce((si, it) => { const p = products.find((pr) => pr.id === it.productId); return si + it.quantity * (p?.purchasePrice ?? 0) }, 0), 0)
  return {
    totalProducts: products.length,
    categories: categories.filter((c) => c.parentId === null).length,
    suppliers: suppliers.length, customers: customers.length, orders: orders.length,
    revenue, profit: revenue - cost,
    inventoryValue: products.reduce((s, p) => s + p.stock * p.purchasePrice, 0),
    lowStock: products.filter((p) => p.stock > 0 && p.stock < 15).length,
    outOfStock: products.filter((p) => p.stock === 0).length,
  }
}
