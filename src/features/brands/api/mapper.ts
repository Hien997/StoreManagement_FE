import type { Brand } from '@/shared/lib/types'
import type { BrandResponse } from './types'

export function mapBrand(b: BrandResponse): Brand {
  return {
    id: b.id,
    code: b.code,
    name: b.name,
    logoUrl: b.logo_url,
    country: b.country,
    isActive: b.is_active,
  }
}