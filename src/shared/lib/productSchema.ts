import { z } from 'zod'

export const productSchema = (t: (key: string) => string) =>
  z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters'),
      sku: z.string().min(2, 'SKU is required'),
      barcode: z.string().optional().or(z.literal('')),
      categoryId: z.string().min(1, 'Category is required'),
      brandId: z.string().min(1, 'Brand is required'),
      supplierId: z.string().min(1, 'Supplier is required'),
      purchasePrice: z.coerce.number().min(0, 'Must be >= 0'),
      sellingPrice: z.coerce.number().min(0, 'Must be >= 0'),
      stock: z.coerce.number().int().min(0, 'Must be a positive integer'),
      unit: z.string().min(1, 'Unit is required'),
      status: z.enum(['active', 'inactive', 'discontinued']),
      expiredDate: z
        .string()
        .min(1, t('validation.requiredExpiredDate'))
        .refine((v) => !Number.isNaN(Date.parse(v)), t('validation.requiredExpiredDate'))
        .refine((v) => {
          const d = new Date(v)
          d.setHours(0, 0, 0, 0)
          const today = new Date()
          today.setHours(0, 0, 0, 0)
          return d >= today
        }, t('validation.futureExpiredDate')),
      manufactureDate: z.string().optional().or(z.literal('')),
      receivedDate: z.string().optional().or(z.literal('')),
    })
    .refine(
      (data) => !data.manufactureDate || !data.expiredDate || Date.parse(data.expiredDate) >= Date.parse(data.manufactureDate),
      { message: t('validation.expiredAfterManufacture'), path: ['expiredDate'] },
    )
    .refine(
      (data) => !data.receivedDate || !data.expiredDate || Date.parse(data.expiredDate) >= Date.parse(data.receivedDate),
      { message: t('validation.expiredAfterReceived'), path: ['expiredDate'] },
    )

export type ProductFormValues = z.infer<ReturnType<typeof productSchema>>
