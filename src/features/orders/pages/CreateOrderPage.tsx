import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, ShoppingCart, Trash2 } from 'lucide-react'
import { useForm, useFieldArray, FormProvider } from 'react-hook-form'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { useToast } from '@/shared/components/ui/toast'
import { useCustomers } from '@/features/customers'
import { useProducts } from '@/features/products'
import { useCreateOrder } from '@/features/orders'
import { toCustomer, toProduct } from '@/types/api/mappers'
import { formatCurrency } from '@/shared/lib/format'
import { useTranslation } from 'react-i18next'
import { FormSelect, FormNumberInput } from '@/shared/components/form'

interface LineItem {
  productId: string
  quantity: number
}

interface OrderFormValues {
  customerId: string
  items: LineItem[]
}

export function CreateOrderPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const createOrder = useCreateOrder()
  const { data: customersData } = useCustomers({ limit: 100 })
  const { data: productsData } = useProducts({ limit: 100 })
  const customers = React.useMemo(() => (customersData?.items ?? []).map(toCustomer), [customersData])
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])

  const form = useForm<OrderFormValues>({
    defaultValues: { customerId: '', items: [{ productId: '', quantity: 1 }] },
  })
  const { fields, append, remove } = useFieldArray({ control: form.control, name: 'items' })

  const items = form.watch('items')
  const total = items.reduce((sum, it) => {
    const p = products.find((pr) => pr.id === it.productId)
    return sum + (p ? p.sellingPrice * it.quantity : 0)
  }, 0)

  const canSubmit = form.watch('customerId') && items.every((it) => it.productId && it.quantity > 0)

  const onSubmit = (values: OrderFormValues) => {
    if (!canSubmit) {
      toast({ title: t('common.incompleteOrder'), description: t('common.selectCustomerAndProducts'), variant: 'destructive' })
      return
    }
    createOrder.mutate(
      {
        customer_id: Number(values.customerId),
        warehouse_id: 1,
        items: values.items.map((it) => ({
          product_id: Number(it.productId),
          quantity: it.quantity,
          unit_price: products.find((p) => p.id === it.productId)?.sellingPrice,
        })),
      },
      {
        onSuccess: () => navigate('/orders'),
      },
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/orders')}>
        <ArrowLeft className="h-4 w-4" /> {t('common.backToOrders')}
      </Button>

      <PageHeader title={t('order.add')} description={t('common.createOrder')} />

      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('common.orderItems')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {fields.map((field, idx) => {
                    const product = products.find((p) => p.id === items[idx]?.productId)
                    return (
                      <div key={field.id} className="flex flex-wrap items-end gap-3 rounded-lg border p-3">
                        <div className="flex-1 min-w-[200px]">
                          <FormSelect
                            control={form.control}
                            name={`items.${idx}.productId` as const}
                            label={t('common.product')}
                            placeholder={t('common.selectProduct')}
                            options={products.map((p) => ({ value: p.id, label: `${p.name} — ${formatCurrency(p.sellingPrice)}` }))}
                          />
                        </div>
                        <div className="w-24">
                          <FormNumberInput
                            control={form.control}
                            name={`items.${idx}.quantity` as const}
                            label={t('common.qty')}
                            min={1}
                          />
                        </div>
                        <div className="w-24 text-right">
                          <p className="text-xs text-muted-foreground">{t('common.subtotal')}</p>
                          <p className="font-semibold">{formatCurrency(product ? product.sellingPrice * (items[idx]?.quantity ?? 0) : 0)}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => remove(idx)}
                          disabled={fields.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  })}
                  <Button type="button" variant="outline" onClick={() => append({ productId: '', quantity: 1 })}>
                    <Plus className="h-4 w-4" /> {t('common.addItem')}
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('order.customer')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormSelect
                    control={form.control}
                    name="customerId"
                    label={t('order.customer')}
                    placeholder={t('common.selectCustomer')}
                    options={customers.map((c) => ({ value: c.id, label: c.name }))}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">{t('common.summary')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{t('order.items')}</span>
                    <span>{items.filter((i) => i.productId).length}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between text-lg font-bold">
                    <span>{t('common.total')}</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                  <Button type="submit" className="w-full" disabled={!canSubmit || createOrder.isPending}>
                    {createOrder.isPending && <ShoppingCart className="h-4 w-4 animate-spin" />}
                    {t('common.placeOrder')}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  )
}