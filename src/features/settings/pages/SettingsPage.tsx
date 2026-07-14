import * as React from 'react'
import { Bell, Moon, Palette, Store, User } from 'lucide-react'

import { PageHeader } from '@/shared/components/PageHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card'
import { Label } from '@/shared/components/ui/label'
import { Switch } from '@/shared/components/ui/switch'
import { Input } from '@/shared/components/ui/input'
import { Button } from '@/shared/components/ui/button'
import { Separator } from '@/shared/components/ui/separator'
import { useThemeStore } from '@/shared/store/useThemeStore'
import { useAuthStore } from '@/shared/store/useAuthStore'
import { useToast } from '@/shared/components/ui/toast'
import { cn } from '@/shared/lib/utils'

const themes = [
  { value: 'light', label: 'Light', icon: Store },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Palette },
] as const

export function SettingsPage() {
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const user = useAuthStore((s) => s.user)
  const toast = useToast()
  const [emailNotif, setEmailNotif] = React.useState(true)
  const [pushNotif, setPushNotif] = React.useState(true)
  const [lowStockAlert, setLowStockAlert] = React.useState(true)

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your preferences" />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" /> Appearance
            </CardTitle>
            <CardDescription>Choose your theme preference</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-3">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-lg border p-4 transition-colors',
                  theme === t.value ? 'border-primary bg-primary/5' : 'hover:bg-accent',
                )}
              >
                <t.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{t.label}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" /> Profile
            </CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={user?.full_name || user?.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user?.email} />
            </div>
            <Button onClick={() => toast({ title: 'Profile saved', variant: 'success' })}>
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Bell className="h-4 w-4" /> Notifications
            </CardTitle>
            <CardDescription>Configure how you receive alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive updates via email</p>
              </div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Push Notifications</p>
                <p className="text-xs text-muted-foreground">Receive push notifications in browser</p>
              </div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
            <Separator />
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm font-medium">Low Stock Alerts</p>
                <p className="text-xs text-muted-foreground">Get notified when items run low</p>
              </div>
              <Switch checked={lowStockAlert} onCheckedChange={setLowStockAlert} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}