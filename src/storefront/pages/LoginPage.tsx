import { useTranslation } from 'react-i18next'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Mail, Lock, Store } from 'lucide-react'
import { motion } from 'framer-motion'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import { useToast } from '@/shared/components/ui/toast'
import { useCustomerLoginMutation } from '@/features/customers/auth/mutations'
import { useCustomerAuthStore } from '@/features/customers/auth/store'
import { ApiError } from '@/shared/types/api/response'

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
})

type LoginValues = z.infer<typeof loginSchema>

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const setSession = useCustomerAuthStore((s) => s.setSession)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const toast = useToast()
  const loginMutation = useCustomerLoginMutation()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const from = (location.state as { from?: string })?.from ?? '/shop/account'

  if (isAuthenticated) {
    navigate(from, { replace: true })
  }

  const onSubmit = (values: LoginValues) => {
    loginMutation.mutate(values, {
      onSuccess: (res) => {
        setSession(res.customer, res.access_token, res.refresh_token)
        toast({ title: t('storefront.account.welcome'), description: res.customer.name, variant: 'success' })
        navigate(from, { replace: true })
      },
      onError: (err) => {
        const message = err instanceof ApiError ? err.message : t('storefront.account.loginFailed')
        toast({ title: t('storefront.account.loginFailed'), description: message, variant: 'destructive' })
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
          <h1 className="font-display text-2xl font-bold tracking-tight">{t('storefront.account.signIn')}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{t('storefront.account.welcomeBack')}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('storefront.account.email')}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="email" type="email" autoComplete="email" {...register('email')} className="pl-9" placeholder="you@example.com" />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('common.password')}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input id="password" type="password" autoComplete="current-password" {...register('password')} className="pl-9" placeholder="••••••••" />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
            {loginMutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t('storefront.account.signInButton')}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {t('storefront.account.noAccount')}{' '}
          <Link to="/shop/register" className="font-medium text-primary hover:underline">
            {t('storefront.account.signUp')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}