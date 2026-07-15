import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Tag, Truck } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { useStoreProducts, useStoreCategories, useStoreBrands, useFeaturedProducts, useNewProducts, useBestSellers } from '../hooks'
import { ProductGridSkeleton } from '../components/LoadingSkeleton'
import { ProductCard } from '../components/ProductCard'
import { CategoryCard } from '../components/CategoryCard'
import { BrandCard } from '../components/BrandCard'
import { ErrorState } from '../components/ErrorState'
import { placeholderImage } from '../utils'

function SectionHeader({ title, subtitle, to }: { title: string; subtitle?: string; to?: string }) {
  const { t } = useTranslation()
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {to && (
        <Link to={to} className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
          {t('storefront.home.viewAll')} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  )
}

export function HomePage() {
  const { t } = useTranslation()
  const products = useStoreProducts()
  const categories = useStoreCategories()
  const brands = useStoreBrands()

  const featured = useFeaturedProducts(products.data)
  const newest = useNewProducts(products.data)
  const best = useBestSellers(products.data)

  return (
    <div>
      {/* Hero */}
      <section className="store-hero">
        <div className="container grid items-center gap-8 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> {t('storefront.home.heroBadge')}
            </span>
            <h1 className="font-display mt-4 text-4xl font-extrabold leading-tight tracking-tight lg:text-5xl">
              {t('storefront.home.heroTitle')}
            </h1>
            <p className="mt-4 max-w-md text-muted-foreground">
              {t('storefront.home.heroSubtitle')}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop/products">{t('storefront.home.shopNow')}</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/shop/categories">{t('storefront.home.browseCategories')}</Link>
              </Button>
            </div>
            <div className="mt-8 flex gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-primary" /> {t('storefront.home.freeShipping')}</span>
              <span className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> {t('storefront.home.weeklyDeals')}</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden lg:block"
          >
            <img
              src={placeholderImage('hero', 'StorePro')}
              alt="StorePro hero"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-2xl"
            />
          </motion.div>
        </div>
      </section>

      <div className="container space-y-16 py-12">
        {/* Featured */}
        <section className="store-section">
          <SectionHeader title={t('storefront.home.featuredTitle')} subtitle={t('storefront.home.featuredSubtitle')} to="/shop/products" />
          {products.isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : products.isError ? (
            <ErrorState onRetry={() => products.refetch()} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Categories */}
        <section className="store-section">
          <SectionHeader title={t('storefront.home.shopByCategory')} subtitle={t('storefront.home.shopByCategorySubtitle')} to="/shop/categories" />
          {categories.isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {categories.data?.slice(0, 8).map((c) => (
                <CategoryCard key={c.id} category={c} />
              ))}
            </div>
          )}
        </section>

        {/* New products */}
        <section className="store-section">
          <SectionHeader title={t('storefront.home.newArrivals')} subtitle={t('storefront.home.newArrivalsSubtitle')} to="/shop/products" />
          {products.isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {newest.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Promotion banner */}
        <section>
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-primary-foreground lg:p-12">
            <div className="relative z-10 max-w-lg">
              <h3 className="text-2xl font-bold lg:text-3xl">{t('storefront.home.membersTitle')}</h3>
              <p className="mt-2 text-primary-foreground/80">
                {t('storefront.home.membersSubtitle')}
              </p>
              <Button asChild variant="secondary" className="mt-4">
                <Link to="/shop/products">{t('storefront.home.exploreMemberDeals')}</Link>
              </Button>
            </div>
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-foreground/10" />
            <div className="absolute -bottom-16 right-24 h-64 w-64 rounded-full bg-primary-foreground/10" />
          </div>
        </section>

        {/* Best sellers */}
        <section className="store-section">
          <SectionHeader title={t('storefront.home.bestSellers')} subtitle={t('storefront.home.bestSellersSubtitle')} to="/shop/products" />
          {products.isLoading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {best.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>

        {/* Brand slider */}
        <section className="store-section">
          <SectionHeader title={t('storefront.home.popularBrands')} subtitle={t('storefront.home.popularBrandsSubtitle')} to="/shop/brands" />
          {brands.isLoading ? (
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-20 w-48 shrink-0 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          ) : (
            <div className="relative overflow-hidden">
              <div className="flex gap-4 animate-marquee">
                {[...(brands.data ?? []), ...(brands.data ?? [])].map((b, i) => (
                  <div key={`${b.id}-${i}`} className="w-56 shrink-0">
                    <BrandCard brand={b} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
