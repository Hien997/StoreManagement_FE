import { Button } from '@/shared/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

export function Pagination({ page, pageCount, onChange }: PaginationProps) {
  if (pageCount <= 1) return null
  const pages = Array.from({ length: pageCount }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === pageCount || Math.abs(p - page) <= 1,
  )
  return (
    <div className="flex items-center justify-center gap-1">
      <Button variant="outline" size="icon" onClick={() => onChange(page - 1)} disabled={page <= 1}>
        <ChevronLeft className="h-4 w-4" />
      </Button>
      {pages.map((p, i) => {
        const gap = i > 0 && p - pages[i - 1] > 1
        return (
          <span key={p} className="flex items-center gap-1">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <Button variant={p === page ? 'default' : 'outline'} size="icon" className={cn('h-9 w-9')} onClick={() => onChange(p)}>
              {p}
            </Button>
          </span>
        )
      })}
      <Button variant="outline" size="icon" onClick={() => onChange(page + 1)} disabled={page >= pageCount}>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}