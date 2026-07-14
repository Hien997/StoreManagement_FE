import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { type ColumnDef } from '@tanstack/react-table'
import { Eye, Pencil, Plus, Trash2, Truck } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { DataTable } from '@/shared/components/DataTable'
import { Button } from '@/shared/components/ui/button'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { useSuppliers, useDeleteSupplier } from '@/features/suppliers/hooks'
import { useProducts } from '@/features/products/hooks'
import { SupplierFormDialog } from './SupplierFormDialog'
import { toSupplier, toProduct } from '@/types/api/mappers'
import type { SupplierResponse } from '@/types/api'
import type { Supplier } from '@/shared/lib/types'
import { formatCurrency, formatDate } from '@/shared/lib/format'
import { useToast } from '@/shared/components/ui/toast'
import { useTranslation } from 'react-i18next'

export function SuppliersPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const toast = useToast()
  const { data: suppliersData, isLoading } = useSuppliers({ limit: 100 })
  const { data: productsData } = useProducts({ limit: 100 })
  const deleteSupplier = useDeleteSupplier()
  const suppliers = React.useMemo(() => (suppliersData?.items ?? []).map(toSupplier), [suppliersData])
  const products = React.useMemo(() => (productsData?.items ?? []).map(toProduct), [productsData])

  const productCount = React.useMemo(() => {
    const map: Record<string, number> = {}
    products.forEach((p) => {
      map[p.supplierId] = (map[p.supplierId] ?? 0) + 1
    })
    return map
  }, [products])

  const [formOpen, setFormOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<SupplierResponse | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<Supplier | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const openNew = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (s: Supplier) => {
    const raw = suppliersData?.items.find((item) => String(item.id) === s.id) ?? null
    setEditing(raw)
    setFormOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteSupplier.mutateAsync(Number(deleteTarget.id))
      toast({ title: t('supplier.deleted'), variant: 'destructive' })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: 'name',
      header: t('common.supplier'),
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Truck className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">{row.original.contactName}</p>
          </div>
        </div>
      ),
    },
    { accessorKey: 'email', header: t('common.email'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
    { accessorKey: 'phone', header: t('common.phone'), cell: ({ getValue }) => <span className="text-sm">{getValue<string>()}</span> },
    {
      id: 'products',
      header: t('common.products'),
      cell: ({ row }) => <span className="text-sm">{productCount[row.original.id] ?? 0}</span>,
    },
    {
      accessorKey: 'outstandingBalance',
      header: t('common.balance'),
      cell: ({ getValue }) => <span className="font-medium">{formatCurrency(getValue<number>())}</span>,
    },
    { accessorKey: 'createdAt', header: t('common.since'), cell: ({ getValue }) => <span className="text-sm">{formatDate(getValue<string>())}</span> },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" onClick={() => navigate(`/suppliers/${row.original.id}`)}>
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => openEdit(row.original)}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => setDeleteTarget(row.original)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('supplier.title')}
        description={t('supplier.description', { count: suppliers.length })}
        actions={
          <Button onClick={openNew}>
            <Plus className="h-4 w-4" /> {t('supplier.add')}
          </Button>
        }
      />
      <DataTable
        columns={columns}
        data={suppliers}
        searchKey="name"
        searchPlaceholder={t('common.searchSuppliers')}
        loading={isLoading}
        onRowClick={(s) => navigate(`/suppliers/${s.id}`)}
      />

      <SupplierFormDialog open={formOpen} onOpenChange={setFormOpen} supplier={editing} />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t('supplier.deleteTitle')}
        description={t('supplier.deleteDescription', { name: deleteTarget?.name })}
        confirmText={deleting ? t('common.deleting') : t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}