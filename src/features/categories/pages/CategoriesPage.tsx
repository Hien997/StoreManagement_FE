import * as React from 'react'
import { ChevronRight, Folder, FolderOpen, Pencil, Plus, Trash2 } from 'lucide-react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import { PageHeader } from '@/shared/components/PageHeader'
import { Button } from '@/shared/components/ui/button'
import { Card, CardContent } from '@/shared/components/ui/card'
import { Badge } from '@/shared/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { ConfirmDialog } from '@/shared/components/ui/confirm-dialog'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/features/categories/hooks'
import { toCategory } from '@/types/api/mappers'
import type { Category } from '@/shared/lib/types'
import { useToast } from '@/shared/components/ui/toast'
import { cn } from '@/shared/lib/utils'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/shared/components/form'

const categorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional(),
})

type CategoryFormValues = z.infer<typeof categorySchema>

interface TreeNode extends Category {
  children: TreeNode[]
}

function buildTree(categories: Category[]): TreeNode[] {
  const map = new Map<string, TreeNode>()
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }))
  const roots: TreeNode[] = []
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node)
    } else {
      roots.push(node)
    }
  })
  return roots
}

function CategoryNode({
  node,
  depth,
  onEdit,
  onDelete,
}: {
  node: TreeNode
  depth: number
  onEdit: (node: TreeNode) => void
  onDelete: (node: TreeNode) => void
}) {
  const [open, setOpen] = React.useState(true)
  const hasChildren = node.children.length > 0
  return (
    <div>
      <div
        className={cn('flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent', hasChildren && 'cursor-pointer')}
        style={{ paddingLeft: depth * 20 + 8 }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren ? (
          <ChevronRight className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-90')} />
        ) : (
          <span className="w-4" />
        )}
        {open && hasChildren ? <FolderOpen className="h-4 w-4 text-primary" /> : <Folder className="h-4 w-4 text-muted-foreground" />}
        <span className="flex-1 text-sm font-medium">{node.name}</span>
        <Badge variant="secondary">{node.productCount}</Badge>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => {
            e.stopPropagation()
            onEdit(node)
          }}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-destructive"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(node)
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      {open && hasChildren && (
        <div>
          {node.children.map((child) => (
            <CategoryNode key={child.id} node={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export function CategoriesPage() {
  const { t } = useTranslation()
  const { data, isLoading } = useCategories({ limit: 100 })
  const categories = React.useMemo(() => (data?.items ?? []).map(toCategory), [data])
  const tree = React.useMemo(() => buildTree(categories), [categories])
  const totalRoots = tree.length
  const totalSubs = categories.length - totalRoots

  const toast = useToast()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editing, setEditing] = React.useState<TreeNode | null>(null)
  const [deleteTarget, setDeleteTarget] = React.useState<TreeNode | null>(null)
  const [deleting, setDeleting] = React.useState(false)

  const form = useForm<CategoryFormValues>({
    defaultValues: { name: '', slug: '', description: '' },
  })

  const openCreate = () => {
    setEditing(null)
    form.reset({ name: '', slug: '', description: '' })
    setDialogOpen(true)
  }

  const openEdit = (node: TreeNode) => {
    setEditing(node)
    form.reset({ name: node.name, slug: '', description: node.description ?? '' })
    setDialogOpen(true)
  }

  const handleSave = form.handleSubmit((values) => {
    if (!values.name.trim()) {
      toast({ title: t('common.nameRequired'), variant: 'destructive' })
      return
    }
    if (editing) {
      updateCategory.mutateAsync({
        id: Number(editing.id),
        body: { name: values.name, slug: values.slug || undefined, description: values.description || undefined },
      }).then(() => {
        toast({ title: t('category.updated'), variant: 'success' })
        setDialogOpen(false)
      })
    } else {
      createCategory.mutateAsync({
        name: values.name,
        slug: values.slug || values.name.toLowerCase().replace(/\s+/g, '-'),
        description: values.description || undefined,
      }).then(() => {
        toast({ title: t('category.created'), variant: 'success' })
        setDialogOpen(false)
      })
    }
  })

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteCategory.mutateAsync(Number(deleteTarget.id))
      toast({ title: t('category.deleted'), variant: 'destructive' })
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('category.title')}
        description={t('category.description')}
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> {t('category.add')}
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-sm text-muted-foreground">{t('category.total')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{totalRoots}</p>
            <p className="text-sm text-muted-foreground">{t('category.roots')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-2xl font-bold">{totalSubs}</p>
            <p className="text-sm text-muted-foreground">{t('category.subs')}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoading ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t('common.loadingCategories')}</p>
          ) : tree.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">{t('common.noCategories')}</p>
          ) : (
            tree.map((node) => (
              <CategoryNode key={node.id} node={node} depth={0} onEdit={openEdit} onDelete={setDeleteTarget} />
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? t('common.editCategory') : t('common.addCategory')}</DialogTitle>
            <DialogDescription>
              {editing ? t('common.updateCategoryDetails') : t('common.createCategoryDetails')}
            </DialogDescription>
          </DialogHeader>
          <FormProvider {...form}>
            <form onSubmit={handleSave} className="space-y-4">
              <FormInput
                control={form.control}
                name="name"
                label={t('common.name')}
                placeholder={t('common.egBeverages')}
                required
              />
              <FormInput
                control={form.control}
                name="slug"
                label={t('category.slug')}
                placeholder={t('common.autoGenerated')}
              />
              <FormInput
                control={form.control}
                name="description"
                label={t('common.description')}
                placeholder={t('common.optional')}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? t('common.saving') : editing ? t('common.saveChanges') : t('common.create')}
                </Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title={t('category.deleteTitle')}
        description={t('category.deleteDescription', { name: deleteTarget?.name })}
        confirmText={deleting ? t('common.deleting') : t('common.delete')}
        destructive
        onConfirm={handleDelete}
      />
    </div>
  )
}