import RestaurantMenu from "@/components/restaurant-menu";

export default function Home() {
  // You can get the tenant name from various sources:
  // 1. URL parameter: const tenantName = searchParams.tenant
  // 2. Subdomain: extract from request headers
  // 3. Environment variable: process.env.NEXT_PUBLIC_TENANT_NAME
  // 4. Database lookup based on domain

  // For this example, using environment variable with fallback
  const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || "hornsolution";

  return <RestaurantMenu tenantName={tenantName} />;
}
