import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

import { Card } from '@/shared/components/ui/card'
import { placeholderImage } from '../utils'
import type { Category } from '@/shared/lib/types'

export function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Link to={`/shop/category/${category.id}`}>
        <Card className="card-lift group relative flex h-40 items-end overflow-hidden p-4 shadow-store">
          <img
            src={placeholderImage(category.id, category.name)}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="relative flex w-full items-center justify-between text-white">
            <div>
              <p className="text-lg font-semibold">{category.name}</p>
              <p className="text-xs text-white/80">{category.productCount} products</p>
            </div>
            <ChevronRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}