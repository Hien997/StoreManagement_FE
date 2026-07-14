import * as React from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import { useSupplier } from '@/features/suppliers/hooks'
import { useProducts } from '@/features/products/hooks'
import { toSupplier, toProduct } from '@/types/api/mappers'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useTranslation } from 'react-i18next'

export function SupplierDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams()
  const navigate = useNavigate()
  const supplierId = Number(id)
  const { data: supplierData, isLoading } = useSupplier(supplierId)
  const { data: productsData } = useProducts({ limit: 100 })
  const supplier = supplierData ? toSupplier(supplierData) : null
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <p className="text-muted-foreground">{t('common.loadingSupplier')}</p>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => navigate('/suppliers')}>
          <ArrowLeft className="h-4 w-4" /> {t('common.back')}
        </Button>
        <p className="text-muted-foreground">{t('common.supplierNotFound')}</p>
      </div>
    )
  }

  const supplierProducts = products.filter((p) => p.supplierId === supplier.id)

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => navigate('/suppliers')}>
        <ArrowLeft className="h-4 w-4" /> {t('common.backToSuppliers')}
      </Button>

      <PageHeader title={supplier.name} description={t('supplier.since', { date: formatDate(supplier.createdAt) })} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-4 p-6 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{supplier.address}</span>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-xs text-muted-foreground">{t('supplier.outstandingBalance')}</p>
              <p className="text-xl font-bold text-destructive">{formatCurrency(supplier.outstandingBalance)}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">{t('supplier.suppliedProducts', { count: supplierProducts.length })}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {supplierProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t('common.noProductsFromSupplier')}</p>
            ) : (
              supplierProducts.slice(0, 12).map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="flex items-center justify-between rounded-lg border p-3 text-sm transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{p.name}</span>
                  <div className="flex items-center gap-3">
                     <span className="text-muted-foreground">{t('common.inStock', { count: p.stock })}</span>
                    <Badge variant={p.status === 'active' ? 'success' : p.status === 'discontinued' ? 'danger' : 'secondary'} className="capitalize">
                      {p.status}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}