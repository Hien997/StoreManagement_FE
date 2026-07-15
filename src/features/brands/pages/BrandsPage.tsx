import * as React from 'react'
import { type ColumnDef } from '@tanstack/react-table'
import { Pencil, Plus, Trash2, Tag } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Button } from '@/shared/components/ui/button'
import { Badge } from '@/shared/components/ui/badge'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { useBrands, useDeleteBrand } from '@/features/brands'
import { BrandFormDialog } from './BrandFormDialog'
import { toBrand } from '@/types/api/mappers'
import type { Brand } from '@/shared/lib/types'
import { useToast } from '@/shared/components/ui/toast'
import { useTranslation } from 'react-i18next'

export function BrandsPage() {
  const { t } = useTranslation()
  const toast = useToast()
  const { data: brandsData, isLoading } = useBrands({ page: 1, page_size: 100 })
  const deleteBrand = useDeleteBrand()
  const brands = React.useMemo(() => (brandsData?.items ?? []).map(toBrand), [brandsData])

  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<Brand | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Brand | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = React.useCallback(
    (b: Brand) => {
      const raw = brandsData?.items.find((item) => String(item.id) === b.id) ?? null
      setEditing(raw as never)
      setFormOpen(true)
    },
    [brandsData],
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteBrand.mutateAsync(deleteTarget.id)
      toast({ title: t('brand.deleted'), variant: 'destructive' })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = React.useMemo<ColumnDef<Brand>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('common.name'),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Tag className="h-4 w-4" />
            </div>
            <div>
              <p className="font-medium">{row.original.name}</p>
              <p className="text-xs text-muted-foreground">{row.original.code}</p>
            </div>
          </div>
        ),
      },
      { accessorKey: 'code', header: t('common.code'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
      { accessorKey: 'country', header: t('common.country'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>() || '—'}</span> },
      {
        accessorKey: 'isActive',
        header: t('common.status'),
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? 'success' : 'secondary'} className="capitalize">
            {row.original.isActive ? t('common.active') : t('common.inactive')}
          </Badge>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    [t, openEdit],
  )

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('brand.title')}
        description={t('brand.description', { count: brands.length })}
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> {t('brand.add')}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={brands}
        searchKey="name"
        searchPlaceholder={t('common.search')}
        loading={isLoading}
      />

      <BrandFormDialog open={formOpen} onOpenChange={setFormOpen} brand={editing as never} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t('brand.deleteTitle')}
        description={t('brand.deleteDescription', { name: deleteTarget?.name })}
        confirmText={deleting ? t('common.deleting') : t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}