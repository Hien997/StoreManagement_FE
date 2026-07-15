import { Star } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface RatingProps {
  value: number
  count?: number
  size?: number
  className?: string
}

export function Rating({ value, count, size = 14, className }: RatingProps) {
  const full = Math.floor(value)
  const half = value - full >= 0.5
  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex items-center" aria-label={`Rated ${value} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i < full
          const isHalf = i === full && half
          return (
            <Star
              key={i}
              style={{ width: size, height: size }}
              className={cn(
                'transition-colors',
                filled || isHalf ? 'fill-amber-400 text-amber-400' : 'fill-muted text-muted-foreground',
              )}
            />
          )
        })}
      </div>
      <span className="text-xs font-medium text-muted-foreground">{value.toFixed(1)}</span>
      {count != null && <span className="text-xs text-muted-foreground">({count})</span>}
    </div>
  )
}