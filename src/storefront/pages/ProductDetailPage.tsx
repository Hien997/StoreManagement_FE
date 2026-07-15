import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router-dom'
import { Heart, Share2, Truck, ShieldCheck, RotateCcw } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Separator } from '@/shared/components/ui/separator'
import { formatDate } from '@/shared/lib/format'
import { useStoreProducts, useStoreCategories, useStoreBrands, useRelatedProducts } from '../hooks'
import { ProductGallery } from '../components/ProductGallery'
import { ProductPrice } from '../components/ProductPrice'
import { Rating } from '../components/Rating'
import { ProductBadge } from '../components/ProductBadge'
import { ProductCard } from '../components/ProductCard'
import { AddToCartButton } from '../components/AddToCartButton'
import { Breadcrumb } from '../components/Breadcrumb'
import { EmptyState } from '../components/EmptyState'
import { ErrorState } from '../components/ErrorState'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import { STOCK_LABELS } from '../utils'

export function ProductDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const products = useStoreProducts()
  const categories = useStoreCategories()
  const brands = useStoreBrands()
  const [qty, setQty] = useState(1)

  const product = useMemo(
    () => products.data?.find((p) => p.id === id),
    [products.data, id],
  )
  const category = categories.data?.find((c) => c.id === product?.categoryId)
  const brand = brands.data?.find((b) => b.id === product?.brand)
  const related = useRelatedProducts(products.data, product)

  if (products.isLoading) {
    return (
      <div className="container py-8">
        <ProductGridSkeleton count={4} />
      </div>
    )
  }

  if (products.isError) {
    return (
      <div className="container py-8">
        <ErrorState onRetry={() => products.refetch()} />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container py-16">
        <EmptyState
          title={t('storefront.product.notFound')}
          description={t('storefront.product.notFoundDesc')}
          actionLabel={t('storefront.product.backToAll')}
          onAction={() => window.history.back()}
        />
      </div>
    )
  }

  const specs = [
    { label: t('storefront.product.sku'), value: product.sku },
    { label: t('storefront.product.barcode'), value: product.barcode || '—' },
    { label: t('storefront.product.brand'), value: brand?.name ?? '—' },
    { label: t('storefront.product.category'), value: category?.name ?? '—' },
    { label: t('storefront.product.unit'), value: product.unit || '—' },
    { label: t('storefront.product.stock'), value: STOCK_LABELS[product.stockStatus] },
    { label: t('storefront.product.expiration'), value: product.expiredDate ? formatDate(product.expiredDate) : '—' },
  ]

  return (
    <div className="container py-8">
      <Breadcrumb
        className="mb-6"
        items={[
          { label: t('storefront.products.allProducts'), to: '/shop/products' },
          ...(category ? [{ label: category.name, to: `/shop/category/${category.id}` }] : []),
          { label: product.name },
        ]}
      />

      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery product={product} />

        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">{brand?.name ?? t('storefront.brands.globalBrand')}</Badge>
            <ProductBadge product={product} />
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">{product.name}</h1>
          <div className="mt-3 flex items-center gap-3">
            <Rating value={product.rating} count={product.reviewCount} size={16} />
          </div>

          <div className="mt-5">
            <ProductPrice product={product} size="lg" />
          </div>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description || t('storefront.product.defaultDescription')}
          </p>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex items-center rounded-md border">
              <button className="h-10 w-10 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label={t('storefront.cart.decreaseQty')}>−</button>
              <span className="w-10 text-center text-sm font-medium">{qty}</span>
              <button className="h-10 w-10 text-lg" onClick={() => setQty((q) => q + 1)} aria-label={t('storefront.cart.increaseQty')}>+</button>
            </div>
            <AddToCartButton
              product={product}
              quantity={qty}
              size="lg"
              fullWidth
            />
            <Button size="icon" variant="outline" className="h-11 w-11" aria-label={t('storefront.product.addToWishlist')}>
              <Heart className="h-5 w-5" />
            </Button>
            <Button size="icon" variant="outline" className="h-11 w-11" aria-label={t('storefront.product.shareProduct')}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Truck className="h-4 w-4 text-primary" /> {t('storefront.product.fastDelivery')}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><ShieldCheck className="h-4 w-4 text-primary" /> {t('storefront.product.securePayment')}</div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><RotateCcw className="h-4 w-4 text-primary" /> {t('storefront.product.easyReturns')}</div>
          </div>

          <Separator className="my-6" />

          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide">{t('storefront.product.specifications')}</h3>
          <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {specs.map((s) => (
              <div key={s.label} className="flex justify-between border-b border-dashed py-2 text-sm">
                <dt className="text-muted-foreground">{s.label}</dt>
                <dd className="font-medium">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">{t('storefront.product.relatedProducts')}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <div className="mt-8">
        <Button asChild variant="ghost">
          <Link to="/shop/products">← {t('storefront.product.backToAll')}</Link>
        </Button>
      </div>
    </div>
  )
}
