import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, User, Phone, Store } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useToast } from '@/shared/components/ui/toast'
import { useCustomerRegisterMutation } from '@/features/customers/auth/mutations'
import { useCustomerAuthStore } from '@/features/customers/auth/store'
import { ApiError } from '@/shared/types/api/response'

const registerSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm: z.string(),
}).refine((d) => d.password === d.confirm, {
  message: 'Passwords do not match',
  path: ['confirm'],
})

type RegisterValues = z.infer<typeof registerSchema>

export function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setSession = useCustomerAuthStore((s) => s.setSession)
  const toast = useToast()
  const registerMutation = useCustomerRegisterMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', confirm: '' },
  })

  const onSubmit = (values: RegisterValues) => {
    const { confirm, ...body } = values
    registerMutation.mutate(body, {
      onSuccess: (res) => {
        setSession(res.customer, res.access_token, res.refresh_token)
        toast({ title: t('storefront.account.accountCreated'), description: t('storefront.account.welcome'), variant: 'success' })
        navigate('/shop/account', { replace: true })
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : t('storefront.account.registrationFailed')
        toast({ title: t('storefront.account.registrationFailed'), description: message, variant: 'destructive' })
      },
    })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/40 to-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md rounded-2xl border bg-card p-8 shadow-xl"
      >
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Store className="h-7 w-7" />
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight">{t('storefront.account.createYourAccount')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('storefront.account.joinStorePro')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">{t('storefront.account.fullName')}</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="name" autoComplete="name" {...register('name')} className="pl-9" placeholder="Jane Doe" />
            </div>
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t('storefront.account.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" autoComplete="email" {...register('email')} className="pl-9" placeholder="you@example.com" />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t('storefront.account.phoneOptional')}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="phone" {...register('phone')} className="pl-9" placeholder="+84 ..." />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('common.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" autoComplete="new-password" {...register('password')} className="pl-9" placeholder="••••••••" />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">{t('storefront.account.confirmPassword')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="confirm" type="password" autoComplete="new-password" {...register('confirm')} className="pl-9" placeholder="••••••••" />
            </div>
            {errors.confirm && <p className="text-xs text-destructive">{errors.confirm.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
            {registerMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('storefront.account.createAccount')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('storefront.account.alreadyHaveAccount')}{' '}
          <Link to="/shop/login" className="font-medium text-primary hover:underline">
            {t('storefront.account.signIn')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
