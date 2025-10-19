import RestaurantMenu from "@/components/restaurant-menu";

export default function Home() {
  // For this example, using environment variable with fallback
  const tenantName = process.env.NEXT_PUBLIC_TENANT_NAME || "hornsolution";

  return <RestaurantMenu tenantName={tenantName} />;
}
