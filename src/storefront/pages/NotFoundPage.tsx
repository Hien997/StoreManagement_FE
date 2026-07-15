import { Link } from 'react-router-dom'
import { PackageOpen } from 'lucide-react'

import { Button } from '@/shared/components/ui/button'

export function NotFoundPage() {
  return (
    <div className="container flex min-h-[70vh] flex-col items-center justify-center text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <PackageOpen className="h-10 w-10" />
      </div>
      <p className="text-sm font-semibold uppercase tracking-widest text-primary">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you’re looking for doesn’t exist or may have moved. Let’s get you back on track.
      </p>
      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link to="/shop">Back to home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/shop/products">Browse products</Link>
        </Button>
      </div>
    </div>
  )
}