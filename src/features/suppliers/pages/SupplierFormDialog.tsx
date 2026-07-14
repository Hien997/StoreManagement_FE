import * as React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import { z } from 'zod'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog'
import { Button } from '@/shared/components/ui/button'
import { useCreateSupplier, useUpdateSupplier } from '@/features/suppliers/hooks'
import type { SupplierResponse } from '@/types/api'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/shared/components/form'

const supplierSchema = z.object({
  name: z.string().min(1),
  contactName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  taxCode: z.string().optional(),
})

type SupplierFormValues = z.infer<typeof supplierSchema>

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  supplier: SupplierResponse | null
}

export function SupplierFormDialog({ open, onOpenChange, supplier }: SupplierFormDialogProps) {
  const { t } = useTranslation()
  const createSupplier = useCreateSupplier()
  const updateSupplier = useUpdateSupplier()

  const form = useForm<SupplierFormValues>({
    defaultValues: {
      name: '',
      contactName: '',
      email: '',
      phone: '',
      address: '',
      taxCode: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: supplier?.name ?? '',
        contactName: supplier?.contact_name ?? '',
        email: supplier?.email ?? '',
        phone: supplier?.phone ?? '',
        address: supplier?.address ?? '',
        taxCode: supplier?.tax_code ?? '',
      })
    }
  }, [open, supplier, form])

  const onSubmit = (values: SupplierFormValues) => {
    const body = {
      name: values.name,
      contact_name: values.contactName || undefined,
      email: values.email || undefined,
      phone: values.phone || undefined,
      address: values.address || undefined,
      tax_code: values.taxCode || undefined,
    }
    if (supplier) {
      updateSupplier.mutateAsync({ id: supplier.id, body }).then(() => onOpenChange(false))
    } else {
      createSupplier.mutateAsync(body).then(() => onOpenChange(false))
    }
  }

  const saving = createSupplier.isPending || updateSupplier.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{supplier ? t('common.editSupplier') : t('common.addSupplier')}</DialogTitle>
          <DialogDescription>
            {supplier ? t('common.updateSupplierDetails') : t('common.createSupplierDetails')}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label={t('common.name')}
              placeholder={t('common.egGlobalTraders')}
              required
            />
            <FormInput
              control={form.control}
              name="contactName"
              label={t('supplier.contactName')}
              placeholder={t('common.optional')}
            />
            <FormInput
              control={form.control}
              name="email"
              label={t('common.email')}
              type="email"
              placeholder={t('common.optional')}
            />
            <FormInput
              control={form.control}
              name="phone"
              label={t('common.phone')}
              placeholder={t('common.optional')}
            />
            <FormInput
              control={form.control}
              name="address"
              label={t('common.address')}
              placeholder={t('common.optional')}
            />
            <FormInput
              control={form.control}
              name="taxCode"
              label={t('supplier.taxCode')}
              placeholder={t('common.optional')}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? t('common.saving') : supplier ? t('common.saveChanges') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}