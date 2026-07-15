import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Package, Pencil, Plus, Trash2 } from 'lucide-react'
import { Boxes } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { ProductFormDialog } from '@/features/products/pages/ProductFormDialog'
import { useToast } from '@/shared/components/ui/toast'
import { useProducts, useDeleteProduct } from '@/features/products'
import { useCategories } from '@/features/categories'
import { useBrands } from '@/features/brands'
import { toProduct, toCategory, toBrand } from '@/types/api/mappers'
import type { Product } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useTranslation } from 'react-i18next'

const statusVariant: Record<Product['status'], 'success' | 'secondary' | 'danger'> = {
  active: 'success',
  inactive: 'secondary',
  discontinued: 'danger',
}

export function ProductsPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const { t } = useTranslation()
  const { data: productsData, isLoading } = useProducts({ limit: 100 })
  const { data: categoriesData } = useCategories({ limit: 100 })
  const { data: brandsData } = useBrands({ page: 1, page_size: 100 })
  const deleteProduct = useDeleteProduct()
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])
  const categories = React.useMemo(() => (categoriesData?.items ?? []).map(toCategory), [categoriesData])
  const brands = React.useMemo(() => (brandsData?.items ?? []).map(toBrand), [brandsData])

  const [editing, setEditing] = React.useState<Product | null>(null)
  const [formOpen, setFormOpen] = React.useState(false)
  const [deleteId, setDeleteId] = React.useState<string | null>(null)

  const openEdit = React.useCallback((p: Product) => {
    setEditing(p)
    setFormOpen(true)
  }, [])

  const columns = React.useMemo<ColumnDef<Product>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('common.product'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 rounded-md">
              <AvatarImage src={row.original.imageUrl} alt={row.original.name} />
              <AvatarFallback className="rounded-md">{row.original.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.sku}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'categoryId',
        header: t('product.category'),
        cell: ({ row }) => {
          const cat = categories.find((c) => c.id === row.original.categoryId)
          return <span className="text-sm">{cat?.name ?? '—'}</span>
        },
      },
      {
        accessorKey: 'brand',
        header: t('product.brand'),
        cell: ({ row }) => {
          const brand = brands.find((b) => b.id === row.original.brand)
          return <span className="text-sm">{brand?.name ?? '—'}</span>
        },
      },
      { accessorKey: 'stock', header: t('product.stock'), cell: ({ getValue }) => <span className="font-medium">{getValue<number>()}</span> },
      {
        accessorKey: 'sellingPrice',
        header: t('product.price'),
        cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue<number>())}</span>,
      },
      {
        accessorKey: 'status',
        header: t('common.status'),
        cell: ({ row }) => (
          <Badge variant={statusVariant[row.original.status]} className="capitalize">
            {t(`product.${row.original.status}`)}
          </Badge>
        ),
      },
      {
        accessorKey: 'expiredDate',
        header: t('product.expiredDate'),
        cell: ({ getValue }) => {
          const value = getValue<string>()
          return <span className="text-sm">{value ? formatDate(value) : '—'}</span>
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => navigate(`/products/${row.original.id}`)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteId(row.original.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t, categories, brands, navigate, openEdit],
  )

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const handleDelete = () => {
    if (!deleteId) return
    deleteProduct.mutate(Number(deleteId), {
      onSuccess: () => {
        toast({ title: t('product.deleted'), variant: 'destructive' })
        setDeleteId(null)
      },
    })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <PageHeader
        title={t('product.title')}
        description={t('product.description', { count: products.length })}
        icon={Boxes}
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> {t('product.add')}
          </Button>
        }
      />

      <DataTable
        columns={columns}
        data={products}
        searchKey="name"
        searchPlaceholder={t('common.search')}
        loading={isLoading}
        toolbar={
          <Button variant="outline" onClick={() => navigate('/categories')}>
            <Package className="h-4 w-4" /> {t('nav.categories')}
          </Button>
        }
        onRowClick={(p) => navigate(`/products/${p.id}`)}
      />

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(o) => !o && setDeleteId(null)}
        title={t('product.deleteTitle')}
        description={t('product.deleteDescription')}
        confirmText={t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </motion.div>
  )
}

function handleSave() {
  // Save is handled inside ProductFormDialog via the products hooks.
}