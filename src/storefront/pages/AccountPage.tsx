import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, LogOut, Trash2, User, Mail, Phone, Save } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { Card } from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'
import { useToast } from '@/shared/components/ui/toast'
import { useCustomerAuthStore } from '@/features/customers/auth/store'
import { customerAuthService } from '@/features/customers/auth/service'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

const accountSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
})

type AccountValues = z.infer<typeof accountSchema>

export function AccountPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const toast = useToast()
  const user = useCustomerAuthStore((s) => s.customer)
  const logout = useCustomerAuthStore((s) => s.logout)

  const profile = useQuery({
    queryKey: ['customer', 'me'],
    queryFn: customerAuthService.me,
    enabled: !!user,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<AccountValues>({
    resolver: zodResolver(accountSchema),
    values: profile.data
      ? { name: profile.data.name, email: profile.data.email, phone: profile.data.phone, address: profile.data.address }
      : undefined,
  })

  const updateMutation = useMutation({
    mutationFn: (body: AccountValues) => customerAuthService.updateProfile(Number(profile.data!.id), body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['customer', 'me'] })
      toast({ title: t('storefront.account.profileUpdated'), variant: 'success' })
    },
    onError: (err: { message?: string }) =>
      toast({ title: t('storefront.account.updateFailed'), description: err.message, variant: 'destructive' }),
  })

  const deleteMutation = useMutation({
    mutationFn: () => customerAuthService.deleteAccount(Number(profile.data!.id)),
    onSuccess: () => {
      logout()
      toast({ title: t('storefront.account.accountDeleted'), variant: 'destructive' })
      navigate('/shop', { replace: true })
    },
    onError: (err: { message?: string }) =>
      toast({ title: t('storefront.account.deleteFailed'), description: err.message, variant: 'destructive' }),
  })

  if (!user) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">{t('storefront.account.pleaseSignIn')}</p>
        <Button asChild className="mt-4">
          <a href="/shop/login">{t('storefront.account.signIn')}</a>
        </Button>
      </div>
    )
  }

  if (profile.isLoading) {
    return (
      <div className="container py-16">
        <div className="mx-auto h-64 max-w-xl animate-pulse rounded-xl bg-muted" />
      </div>
    )
  }

  if (profile.isError || !profile.data) {
    return (
      <div className="container py-16 text-center">
        <p className="text-muted-foreground">{t('storefront.account.couldNotLoad')}</p>
        <Button variant="outline" className="mt-4" onClick={() => profile.refetch()}>
          {t('storefront.account.retry')}
        </Button>
      </div>
    )
  }

  const onSubmit = (values: AccountValues) => updateMutation.mutate(values)

  return (
    <div className="container max-w-2xl py-10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">{t('storefront.account.title')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('storefront.account.signedInAs', { email: user.email })}
          </p>
        </div>
        <Button variant="ghost" onClick={() => { logout(); navigate('/shop') }}>
          <LogOut className="h-4 w-4" /> {t('storefront.account.signOut')}
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop/orders">{t('storefront.account.myOrders')}</Link>
        </Button>
      </div>

      <Card className="p-6 shadow-store">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('storefront.account.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="name" {...register('name')} className="pl-9" />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('storefront.account.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" {...register('email')} className="pl-9" />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('storefront.account.phone')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="phone" {...register('phone')} className="pl-9" />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">{t('storefront.account.address')}</Label>
            <Input id="address" {...register('address')} />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={updateMutation.isPending || !isDirty}>
              {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {t('storefront.account.saveChanges')}
            </Button>
            <Button type="button" variant="outline" onClick={() => reset()}>
              {t('storefront.account.cancel')}
            </Button>
          </div>
        </form>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{t('storefront.account.deleteAccount')}</p>
            <p className="text-xs text-muted-foreground">{t('storefront.account.deleteAccountDesc')}</p>
          </div>
          <Button
            variant="destructive"
            onClick={() => {
              if (window.confirm(t('storefront.account.deleteConfirm'))) deleteMutation.mutate()
            }}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            {t('storefront.account.delete')}
          </Button>
        </div>
      </Card>
    </div>
  )
}
