import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { productSchema, type ProductFormValues } from '@/shared/lib/productSchema'
import { useCategories } from '@/features/categories'
import { useSuppliers } from '@/features/suppliers'
import { useBrands } from '@/features/brands'
import { useCreateProduct, useUpdateProduct } from '@/features/products'
import { toCategory, toSupplier, toBrand } from '@/types/api/mappers'
import type { Product } from '@/shared/lib/types'
import { useToast } from '@/shared/components/ui/toast'
import { useTranslation } from 'react-i18next'
import {
  FormInput,
  FormNumberInput,
  FormSelect,
  FormDatePicker,
  PriceInput,
} from '@/shared/components/form'

interface ProductFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product | null
  onSave: (values: Product) => void
}

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'discontinued', label: 'Discontinued' },
]

export function ProductFormDialog({ open, onOpenChange, product, onSave }: ProductFormDialogProps) {
  const toast = useToast()
  const { t } = useTranslation()
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const { data: categoriesData } = useCategories({ limit: 100 })
  const { data: suppliersData } = useSuppliers({ limit: 100 })
  const { data: brandsData } = useBrands({ page: 1, page_size: 100 })
  const categories = React.useMemo(() => (categoriesData?.items ?? []).map(toCategory), [categoriesData])
  const suppliers = React.useMemo(() => (suppliersData?.items ?? []).map(toSupplier), [suppliersData])
  const brands = React.useMemo(() => (brandsData?.items ?? []).map(toBrand), [brandsData])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema(t)),
    defaultValues: {
      name: '',
      sku: '',
      barcode: '',
      categoryId: '',
      brandId: '',
      supplierId: '',
      purchasePrice: 0,
      sellingPrice: 0,
      stock: 0,
      unit: 'pcs',
      status: 'active',
      expiredDate: '',
      manufactureDate: '',
      receivedDate: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      if (product) {
        form.reset({
          name: product.name,
          sku: product.sku,
          barcode: product.barcode,
          categoryId: product.categoryId,
          brandId: product.brand,
          supplierId: product.supplierId,
          purchasePrice: product.purchasePrice,
          sellingPrice: product.sellingPrice,
          stock: product.stock,
          unit: product.unit,
          status: product.status,
          expiredDate: product.expiredDate,
          manufactureDate: '',
          receivedDate: '',
        })
      } else {
        form.reset({
          name: '',
          sku: '',
          barcode: '',
          categoryId: '',
          brandId: '',
          supplierId: '',
          purchasePrice: 0,
          sellingPrice: 0,
          stock: 0,
          unit: 'pcs',
          status: 'active',
          expiredDate: '',
          manufactureDate: '',
          receivedDate: '',
        })
      }
    }
  }, [open, product, form])

  const onSubmit = (values: ProductFormValues) => {
    const payload = {
      name: values.name,
      sku: values.sku,
      description: values.barcode || undefined,
      category_id: values.categoryId ? Number(values.categoryId) : undefined,
      brand_id: values.brandId ? Number(values.brandId) : undefined,
      unit_id: values.unit ? Number(values.unit) : undefined,
      supplier_id: values.supplierId ? Number(values.supplierId) : undefined,
      cost_price: values.purchasePrice,
      sale_price: values.sellingPrice,
      reorder_level: values.stock,
      active: values.status === 'active',
      expired_date: values.expiredDate || undefined,
    }

    const done = () => {
      onSave(values as unknown as Product)
      onOpenChange(false)
    }

    if (product) {
      updateProduct.mutate(
        { id: Number(product.id), body: payload },
        { onSuccess: done, onError: (e: { message?: string }) => toast({ title: t('common.updateFailed'), description: e.message, variant: 'destructive' }) },
      )
    } else {
      createProduct.mutate(payload, {
        onSuccess: done,
        onError: (e: { message?: string }) => toast({ title: t('common.createFailed'), description: e.message, variant: 'destructive' }),
      })
    }
  }

  const margin = (Number(form.watch('sellingPrice')) || 0) - (Number(form.watch('purchasePrice')) || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{product ? t('common.editProduct') : t('common.addProduct')}</DialogTitle>
          <DialogDescription>
            {product ? t('common.updateProductDetails') : t('common.createProductDetails')}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2 sm:col-span-2">
                <FormInput
                  control={form.control}
                  name="name"
                  label={t('common.name')}
                  required
                />
              </div>

              <FormInput control={form.control} name="sku" label={t('product.sku')} required />
              <FormInput control={form.control} name="barcode" label={t('common.barcode')} />

              <FormSelect
                control={form.control}
                name="categoryId"
                label={t('product.category')}
                required
                placeholder={t('common.selectCategory')}
                options={categories.map((c) => ({ value: c.id, label: c.name }))}
              />
              <FormSelect
                control={form.control}
                name="supplierId"
                label={t('common.supplier')}
                required
                placeholder={t('common.selectSupplier')}
                options={suppliers.map((s) => ({ value: s.id, label: s.name }))}
              />

              <FormSelect
                control={form.control}
                name="brandId"
                label={t('product.brand')}
                required
                placeholder={t('common.selectBrand')}
                options={brands.map((b) => ({ value: b.id, label: b.name }))}
              />
              <FormInput control={form.control} name="unit" label={t('common.unit')} required />

              <PriceInput
                control={form.control}
                name="purchasePrice"
                label={t('common.purchasePrice')}
                min={0}
              />
              <PriceInput
                control={form.control}
                name="sellingPrice"
                label={t('common.sellingPrice')}
                min={0}
              />

              <FormNumberInput control={form.control} name="stock" label={t('product.stock')} min={0} />
              <FormSelect
                control={form.control}
                name="status"
                label={t('common.status')}
                options={STATUS_OPTIONS.map((o) => ({ value: o.value, label: t(`product.${o.value}`) }))}
              />

              <FormDatePicker
                control={form.control}
                name="expiredDate"
                label={t('product.expiredDate')}
                required
              />
            </div>

            <p className="text-xs text-muted-foreground">{t('common.margin')}: {margin >= 0 ? '+' : ''}{margin.toFixed(2)}</p>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createProduct.isPending || updateProduct.isPending}>
                {product ? t('common.saveChanges') : t('common.createProduct')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}