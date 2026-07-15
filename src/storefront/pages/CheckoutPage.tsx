import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, MapPin, Store } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card } from '@/shared/components/ui/card'
import { useToast } from '@/shared/components/ui/toast'
import { formatCurrency } from '@/shared/lib/format'
import { useCartStore } from '../store/cartStore'
import { useCustomerAuthStore } from '@/features/customers/auth/store'
import { customerAuthService } from '@/features/customers/auth/service'
import { customerOrderService } from '@/features/customers/auth/orderService'
import { useMutation, useQuery } from '@tanstack/react-query'

const checkoutSchema = z
  .object({
    fulfillment: z.enum(['pickup', 'delivery']),
    name: z.string().min(2, 'Please enter your name'),
    phone: z.string().min(6, 'Enter a valid phone number'),
    address: z.string().optional().or(z.literal('')),
  })
  .refine((d) => d.fulfillment === 'pickup' || (d.address ?? '').length >= 5, {
    message: 'Delivery requires a valid address',
    path: ['address'],
  })

type CheckoutValues = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const items = useCartStore((s) => s.items)
  const subtotal = useCartStore((s) => s.subtotal())
  const clear = useCartStore((s) => s.clear)
  const user = useCustomerAuthStore((s) => s.customer)

  const profile = useQuery({ queryKey: ['customer', 'me'], queryFn: customerAuthService.me, enabled: !!user })

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { fulfillment: 'delivery', name: '', phone: '', address: '' },
  })

  const fulfillment = watch('fulfillment')

  const placeOrder = useMutation({
    mutationFn: async (values: CheckoutValues) => {
      if (!profile.data) throw new Error('Customer profile not loaded')
      const orderItems = items.map((i) => {
        const unitPrice = i.salePrice ?? i.price
        const quantity = i.quantity
        const lineTotal = unitPrice * quantity
        return {
          product_id: Number(i.id),
          product_name: i.name,
          sku: String(i.id),
          quantity,
          unit_price: unitPrice,
          discount_amount: 0,
          line_total: lineTotal,
        }
      })
      const subtotalAmount = orderItems.reduce((sum, i) => sum + i.line_total, 0)
      const body = {
        items: orderItems,
        billing_address: values.fulfillment === 'delivery' ? values.address : undefined,
        shipping_address: values.fulfillment === 'delivery' ? values.address : undefined,
        discount_amount: 0,
        shipping_fee: 0,
        subtotal: subtotalAmount,
        tax_amount: 0,
        total_amount: subtotalAmount,
        notes: values.fulfillment === 'delivery' ? `Delivery to: ${values.address}` : 'Pickup order',
        order_date: new Date().toISOString(),
        payment_method: values.fulfillment === 'delivery' ? 'delivery' : 'pickup',
      }
      return customerOrderService.create(body)
    },
    onSuccess: (order) => {
      clear()
      toast({ title: t('storefront.order.placed'), description: `${t('storefront.order.reference')} ${order.reference}`, variant: 'success' })
      navigate(`/shop/order/${order.id}`, { replace: true })
    },
    onError: (err: { message?: string }) =>
      toast({ title: t('storefront.checkout.failed'), description: err.message, variant: 'destructive' }),
  })

  if (items.length === 0) {
    return (
      <div className="container max-w-2xl py-16 text-center">
        <p className="text-muted-foreground">{t('storefront.cart.empty')}.</p>
        <Button asChild className="mt-4">
          <a href="/shop/products">{t('storefront.checkout.browseProducts')}</a>
        </Button>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl py-10">
      <h1 className="font-display text-3xl font-bold tracking-tight">{t('storefront.checkout.title')}</h1>

      <form onSubmit={handleSubmit((v) => placeOrder.mutate(v))} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Card className="p-5 shadow-store">
            <h2 className="font-display text-lg font-semibold">{t('storefront.checkout.fulfillment')}</h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setValue('fulfillment', 'pickup')}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
                  fulfillment === 'pickup' ? 'border-primary bg-primary/5' : 'hover:border-primary/40'
                }`}
              >
                <Store className="h-5 w-5 text-primary" />
                <span className="font-medium">{t('storefront.checkout.pickup')}</span>
                <span className="text-xs text-muted-foreground">{t('storefront.checkout.pickupDesc')}</span>
              </button>
              <button
                type="button"
                onClick={() => setValue('fulfillment', 'delivery')}
                className={`flex flex-col items-start gap-1 rounded-xl border p-4 text-left transition-colors ${
                  fulfillment === 'delivery' ? 'border-primary bg-primary/5' : 'hover:border-primary/40'
                }`}
              >
                <MapPin className="h-5 w-5 text-primary" />
                <span className="font-medium">{t('storefront.checkout.delivery')}</span>
                <span className="text-xs text-muted-foreground">{t('storefront.checkout.deliveryDesc')}</span>
              </button>
            </div>
          </Card>

          <Card className="space-y-4 p-5 shadow-store">
            <h2 className="font-display text-lg font-semibold">{t('storefront.checkout.contact')}</h2>
            <div className="space-y-2">
              <Label htmlFor="name">{t('storefront.checkout.fullName')}</Label>
              <Input id="name" {...register('name')} placeholder="Jane Doe" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{t('storefront.checkout.phone')}</Label>
              <Input id="phone" {...register('phone')} placeholder="+84 ..." />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
            {fulfillment === 'delivery' && (
              <div className="space-y-2">
                <Label htmlFor="address">{t('storefront.checkout.deliveryAddress')}</Label>
                <Input id="address" {...register('address')} placeholder="Street, city, district" />
                {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
              </div>
            )}
          </Card>
        </div>

        <Card className="h-fit p-5 shadow-store">
          <h2 className="font-display text-lg font-semibold">{t('storefront.cart.orderSummary')}</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-2">
                <span className="line-clamp-1 text-muted-foreground">
                  {i.quantity}× {i.name}
                </span>
                <span className="font-medium">{formatCurrency((i.salePrice ?? i.price) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t" />
          <div className="flex items-center justify-between">
            <span className="font-medium">{t('storefront.cart.total')}</span>
            <span className="text-xl font-bold">{formatCurrency(subtotal)}</span>
          </div>
          <Button type="submit" className="mt-4 w-full" size="lg" disabled={placeOrder.isPending || profile.isLoading}>
            {placeOrder.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('storefront.checkout.placeOrder')}
          </Button>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {t('storefront.checkout.paymentOn', { method: fulfillment === 'pickup' ? t('storefront.checkout.paymentPickup') : t('storefront.checkout.paymentDelivery') })}
          </p>
        </Card>
      </form>
    </div>
  )
}
