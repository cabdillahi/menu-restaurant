import RestaurantMenu from "@/components/restaurant-menu"

interface PageProps {
  params: Promise<{
    tenant: string
  }>
}

export default async function TenantPage({ params }: PageProps) {
  const { tenant } = await params

  return <RestaurantMenu tenantName={tenant} />
}
