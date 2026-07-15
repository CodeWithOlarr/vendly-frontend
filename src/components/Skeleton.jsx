// Base skeleton block
function SkeletonBlock({ className = "" }) {
  return (
    <div className={`bg-gray-200 rounded-xl animate-pulse ${className}`} />
  )
}

// Product Card Skeleton
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
      <SkeletonBlock className="w-full h-48 rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <SkeletonBlock key={i} className="h-3 w-3" />
          ))}
        </div>
        <SkeletonBlock className="h-5 w-28 mt-1" />
        <SkeletonBlock className="h-10 w-full mt-1 rounded-xl" />
      </div>
    </div>
  )
}

// Category Card Skeleton
export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100">
      <SkeletonBlock className="w-14 h-14 rounded-xl" />
      <SkeletonBlock className="h-3 w-16" />
      <SkeletonBlock className="h-2 w-12" />
    </div>
  )
}

// Vendor Card Skeleton
export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <SkeletonBlock className="w-full h-32 rounded-none" />
      <div className="pt-10 px-4 pb-4 flex flex-col gap-3">
        <SkeletonBlock className="h-4 w-32" />
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
        <SkeletonBlock className="h-10 w-full rounded-xl mt-2" />
      </div>
    </div>
  )
}

// Product Detail Skeleton
export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Breadcrumb */}
      <div className="flex gap-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <SkeletonBlock key={i} className="h-3 w-16" />
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-10 mb-16">
        {/* Image */}
        <div className="flex-1">
          <SkeletonBlock className="w-full aspect-square rounded-3xl" />
        </div>
        {/* Info */}
        <div className="flex-1 flex flex-col gap-4">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-8 w-full" />
          <SkeletonBlock className="h-8 w-3/4" />
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <SkeletonBlock key={i} className="h-4 w-4" />
            ))}
          </div>
          <SkeletonBlock className="h-10 w-36" />
          <SkeletonBlock className="h-px w-full" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
          <div className="grid grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => (
              <SkeletonBlock key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Order Row Skeleton
export function OrderRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 shadow-sm border border-gray-100">
      <SkeletonBlock className="w-24 h-24 rounded-xl flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-8 w-24 rounded-xl" />
      </div>
    </div>
  )
}

// Table Row Skeleton
export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <SkeletonBlock className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

// Profile Skeleton
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-2">
          <SkeletonBlock className="h-5 w-32" />
          <SkeletonBlock className="h-3 w-20" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <SkeletonBlock className="h-3 w-24" />
          <SkeletonBlock className="h-12 w-full rounded-xl" />
        </div>
      ))}
    </div>
  )
}

// Dashboard Stats Skeleton
export function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
            <SkeletonBlock className="w-14 h-14 rounded-2xl flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <SkeletonBlock className="h-3 w-20" />
              <SkeletonBlock className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <SkeletonBlock className="h-5 w-32" />
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[...Array(5)].map((_, i) => (
            <SkeletonBlock key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  )
}

// Homepage Hero Skeleton
export function HeroSkeleton() {
  return (
    <div className="bg-gray-200 animate-pulse px-6 py-16 md:py-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-4">
          <SkeletonBlock className="h-4 w-32 bg-gray-300" />
          <SkeletonBlock className="h-12 w-full bg-gray-300" />
          <SkeletonBlock className="h-12 w-3/4 bg-gray-300" />
          <SkeletonBlock className="h-4 w-full bg-gray-300" />
          <div className="flex gap-3">
            <SkeletonBlock className="h-12 w-32 rounded-full bg-gray-300" />
            <SkeletonBlock className="h-12 w-36 rounded-full bg-gray-300" />
          </div>
        </div>
        <div className="flex-1">
          <SkeletonBlock className="w-full max-w-sm h-64 rounded-3xl bg-gray-300" />
        </div>
      </div>
    </div>
  )
}

export default SkeletonBlock