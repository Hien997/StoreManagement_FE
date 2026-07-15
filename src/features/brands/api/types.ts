export type {
  BrandResponse,
  CreateBrandRequest,
  UpdateBrandRequest,
} from '@/types/api'

export interface BrandListParams {
  page?: number
  page_size?: number
  keyword?: string
}

export interface BrandQuery extends BrandListParams {}