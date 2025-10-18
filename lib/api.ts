import type { TenantFoodsResponse, TenantCategoriesResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://menuapi.hornsolution.com/api/v1"

export async function fetchFoods(tenantName: string): Promise<TenantFoodsResponse> {
  const response = await fetch(`${API_BASE_URL}/food/${tenantName}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch foods: ${response.statusText}`)
  }
  return response.json()
}

export async function fetchCategories(tenantName: string): Promise<TenantCategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/category/${tenantName}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.statusText}`)
  }
  return response.json()
}
