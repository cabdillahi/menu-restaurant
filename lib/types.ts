export interface Tenant {
  id: string
  name: string
}

export interface Category {
  id: number
  name: string
  description: string
  imageUrl: string
  createAt: string
  updateAt: string
  tenantId: string
}

export interface Food {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
  createAt: string
  updateAt: string
  categoryId: number
  tenantId: string
  category: Category
}

export interface TenantFoodsResponse {
  tenant: Tenant
  data: Food[]
}

export interface TenantCategoriesResponse {
  tenant: Tenant
  data: Category[]
}
