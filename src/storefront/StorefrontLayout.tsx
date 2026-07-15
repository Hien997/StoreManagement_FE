import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Menu, Package, Search, ShoppingBag, User, X } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import { ThemeSwitcher } from '@/shared/components/ThemeSwitcher'
import { useCustomerAuthStore } from '@/features/customers/auth/store'
import { useCartStore } from './store/cartStore'
import { CartDrawer } from './components/CartDrawer'
import { cn } from '@/shared/lib/utils'
import './storefront.css'

const NAV = [
  { to: '/shop', label: 'Home' },
  { to: '/shop/products', label: 'Products' },
  { to: '/shop/categories', label: 'Categories' },
  { to: '/shop/brands', label: 'Brands' },
]

export function StorefrontLayout() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const navigate = useNavigate()
  const user = useCustomerAuthStore((s) => s.customer)
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated)
  const [cartOpen, setCartOpen] = useState(false)
  const cartCount = useCartStore((s) => s.totalItems())

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/shop/search?q=${encodeURIComponent(q)}`)
    setOpen(false)
  }

  return (
    <div className="storefront min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="container flex h-16 items-center gap-4">
          <Link to="/shop" className="flex items-center gap-2 font-bold">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Package className="h-5 w-5" />
            </span>
            <span className="text-lg tracking-tight">StorePro</span>
          </Link>

          <nav className="ml-4 hidden items-center gap-1 md:flex">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/shop'}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>

          <form onSubmit={submit} className="ml-auto hidden max-w-xs flex-1 md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="pl-9"
              />
            </div>
          </form>

          <div className="ml-auto flex items-center gap-2 md:ml-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Cart"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Button>

            {isAuthenticated ? (
              <Button asChild variant="ghost" size="sm" className="gap-2">
                <Link to="/shop/account">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{user?.name}</span>
                </Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link to="/shop/login">Sign in</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/shop/register">Sign up</Link>
                </Button>
              </div>
            )}

            <LanguageSwitcher />
            <ThemeSwitcher />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="border-t md:hidden">
            <div className="container flex flex-col gap-1 py-3">
              <form onSubmit={submit} className="mb-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="pl-9" />
                </div>
              </form>
              {NAV.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.to === '/shop'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      'rounded-md px-3 py-2 text-sm font-medium',
                      isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground',
                    )
                  }
                >
                  {n.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />

      <footer className="mt-16 border-t bg-muted/40">
        <div className="container grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Package className="h-4 w-4" />
              </span>
              StorePro
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Your neighborhood store, online. Quality products across every category.
            </p>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Shop</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/shop/products" className="hover:text-foreground">All products</Link></li>
              <li><Link to="/shop/categories" className="hover:text-foreground">Categories</Link></li>
              <li><Link to="/shop/brands" className="hover:text-foreground">Brands</Link></li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Support</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Help center</li>
              <li>Shipping & returns</li>
              <li>Contact us</li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-semibold">Stay in touch</p>
            <p className="text-sm text-muted-foreground">Get the latest deals and new arrivals.</p>
            <form className="mt-3 flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" placeholder="Email address" className="h-9" />
              <Button type="submit" size="sm">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="border-t py-4">
          <p className="container text-center text-xs text-muted-foreground">
            © {new Date().getFullYear()} StorePro. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}