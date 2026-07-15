// Reusable pulse block
function Pulse({ className = "" }) {
  return <div className={`bg-gray-200 animate-pulse rounded-xl ${className}`} />
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <Pulse className="h-48 w-full rounded-none" />
      <div className="p-4 flex flex-col gap-3">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-2/3" />
        <Pulse className="h-5 w-28" />
        <Pulse className="h-10 w-full" />
      </div>
    </div>
  )
}

export function CategoryCardSkeleton() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white border border-gray-100">
      <Pulse className="w-14 h-14" />
      <Pulse className="h-3 w-16" />
      <Pulse className="h-2 w-12" />
    </div>
  )
}

export function VendorCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <Pulse className="w-full h-32 rounded-none" />
      <div className="pt-10 px-4 pb-4 flex flex-col gap-3">
        <Pulse className="h-4 w-32" />
        <Pulse className="h-3 w-24" />
        <Pulse className="h-3 w-full" />
        <Pulse className="h-10 w-full" />
      </div>
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex gap-2 mb-8">
        {[...Array(4)].map((_, i) => (
          <Pulse key={i} className="h-3 w-16" />
        ))}
      </div>
      <div className="flex flex-col md:flex-row gap-10">
        <div className="flex-1">
          <Pulse className="w-full aspect-square" />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-8 w-full" />
          <Pulse className="h-8 w-3/4" />
          <Pulse className="h-10 w-36" />
          <Pulse className="h-12 w-full" />
          <Pulse className="h-12 w-full" />
        </div>
      </div>
    </div>
  )
}

export function OrderRowSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 flex gap-4 border border-gray-100">
      <Pulse className="w-24 h-24 flex-shrink-0" />
      <div className="flex-1 flex flex-col gap-2">
        <Pulse className="h-3 w-20" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-4 w-3/4" />
        <Pulse className="h-8 w-24" />
      </div>
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {[...Array(cols)].map((_, i) => (
        <td key={i} className="px-6 py-4">
          <Pulse className="h-4 w-full" />
        </td>
      ))}
    </tr>
  )
}

export function StatsSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-center gap-4">
            <Pulse className="w-14 h-14 flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
              <Pulse className="h-3 w-20" />
              <Pulse className="h-7 w-16" />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <Pulse className="h-5 w-32" />
        </div>
        <div className="p-4 flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <Pulse key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Pulse className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-2">
          <Pulse className="h-5 w-32" />
          <Pulse className="h-3 w-20" />
        </div>
      </div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Pulse className="h-3 w-24" />
          <Pulse className="h-12 w-full" />
        </div>
      ))}
    </div>
  )
}

export default Pulse