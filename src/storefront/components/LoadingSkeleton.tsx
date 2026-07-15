import { Skeleton } from '@/shared/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'

export function ProductCardSkeleton({ view = 'grid' }: { view?: 'grid' | 'list' }) {
  if (view === 'list') {
    return (
      <div className="flex gap-4 rounded-xl border p-3">
        <Skeleton className="h-28 w-28 rounded-lg" />
        <div className="flex-1 space-y-2 py-1">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    )
  }
  return (
    <div className="overflow-hidden rounded-xl border">
      <Skeleton className="aspect-square w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-5 w-24" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ view = 'grid', count = 8 }: { view?: 'grid' | 'list'; count?: number }) {
  return (
    <div className={cn(view === 'list' ? 'flex flex-col gap-3' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4')}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} view={view} />
      ))}
    </div>
  )
}