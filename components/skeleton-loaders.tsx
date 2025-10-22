import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export function CategorySkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-md">
      <Skeleton className="w-32 h-32 rounded-2xl" />
      <Skeleton className="h-4 w-20" />
    </div>
  );
}

export function FoodCardSkeleton() {
  return (
    <Card className="overflow-hidden border-none shadow-lg bg-white">
      <Skeleton className="w-full h-64" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
    </Card>
  );
}

export function MenuSkeletonLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-12 w-96 mx-auto mb-8" />

        {/* Search Bar Skeleton */}
        <div className="max-w-2xl mx-auto mb-8">
          <Skeleton className="h-14 w-full rounded-full" />
        </div>

        {/* Category Filters Skeleton */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[...Array(5)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>

        {/* Menu Items Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {[...Array(8)].map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
