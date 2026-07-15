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
import { useCreateCustomer, useUpdateCustomer } from '@/features/customers'
import type { CustomerResponse } from '@/types/api'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/shared/components/form'

const customerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  address: z.string().optional(),
})

type CustomerFormValues = z.infer<typeof customerSchema>

interface CustomerFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  customer: CustomerResponse | null
}

export function CustomerFormDialog({ open, onOpenChange, customer }: CustomerFormDialogProps) {
  const { t } = useTranslation()
  const createCustomer = useCreateCustomer()
  const updateCustomer = useUpdateCustomer()

  const form = useForm<CustomerFormValues>({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        phone: customer?.phone ?? '',
        address: customer?.address ?? '',
      })
    }
  }, [open, customer, form])

  const onSubmit = (values: CustomerFormValues) => {
    const body = {
      name: values.name,
      email: values.email,
      phone: values.phone || undefined,
      address: values.address || undefined,
    }
    if (customer) {
      updateCustomer.mutateAsync({ id: customer.id, body }).then(() => onOpenChange(false))
    } else {
      createCustomer.mutateAsync(body).then(() => onOpenChange(false))
    }
  }

  const saving = createCustomer.isPending || updateCustomer.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer ? t('common.editCustomer') : t('common.addCustomer')}</DialogTitle>
          <DialogDescription>
            {customer ? t('common.updateCustomerDetails') : t('common.createCustomerDetails')}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="name"
              label={t('common.name')}
              placeholder={t('common.optional')}
              required
            />
            <FormInput
              control={form.control}
              name="email"
              label={t('common.email')}
              type="email"
              placeholder={t('common.optional')}
              required
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? t('common.saving') : customer ? t('common.saveChanges') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}