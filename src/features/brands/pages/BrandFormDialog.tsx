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
import { useCreateBrand, useUpdateBrand } from '@/features/brands'
import type { BrandResponse } from '@/types/api'
import { useTranslation } from 'react-i18next'
import { FormInput } from '@/shared/components/form'

const brandSchema = z.object({
  code: z.string().min(1, 'Code is required'),
  name: z.string().min(1, 'Name is required'),
  logoUrl: z.string().optional(),
  country: z.string().optional(),
})

type BrandFormValues = z.infer<typeof brandSchema>

interface BrandFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  brand: BrandResponse | null
}

export function BrandFormDialog({ open, onOpenChange, brand }: BrandFormDialogProps) {
  const { t } = useTranslation()
  const createBrand = useCreateBrand()
  const updateBrand = useUpdateBrand()

  const form = useForm<BrandFormValues>({
    defaultValues: {
      code: '',
      name: '',
      logoUrl: '',
      country: '',
    },
  })

  React.useEffect(() => {
    if (open) {
      form.reset({
        code: brand?.code ?? '',
        name: brand?.name ?? '',
        logoUrl: brand?.logo_url ?? '',
        country: brand?.country ?? '',
      })
    }
  }, [open, brand, form])

  const onSubmit = (values: BrandFormValues) => {
    const body = {
      code: values.code,
      name: values.name,
      logo_url: values.logoUrl || undefined,
      country: values.country || undefined,
    }
    if (brand) {
      updateBrand.mutateAsync({ id: brand.id, body }).then(() => onOpenChange(false))
    } else {
      createBrand.mutateAsync(body).then(() => onOpenChange(false))
    }
  }

  const saving = createBrand.isPending || updateBrand.isPending

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{brand ? t('common.editBrand') : t('common.addBrand')}</DialogTitle>
          <DialogDescription>
            {brand ? t('common.updateBrandDetails') : t('common.createBrandDetails')}
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={form.control}
              name="code"
              label={t('common.code')}
              placeholder={t('common.egBrandCode')}
              required
            />
            <FormInput
              control={form.control}
              name="name"
              label={t('common.name')}
              placeholder={t('common.egBrandName')}
              required
            />
            <FormInput
              control={form.control}
              name="logoUrl"
              label={t('common.logoUrl')}
              placeholder={t('common.optional')}
            />
            <FormInput
              control={form.control}
              name="country"
              label={t('common.country')}
              placeholder={t('common.optional')}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? t('common.saving') : brand ? t('common.saveChanges') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}