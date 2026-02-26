interface SkeletonProps {
  className?: string
}

export default function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`rounded-card bg-bg-secondary shimmer animate-shimmer ${className}`}
      aria-hidden="true"
    />
  )
}

export function AnalysisSkeleton() {
  return (
    <div className="space-y-card-gap">
      {/* Overall read skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* Conversation thread skeleton */}
      <div className="bg-wa-bg rounded-card p-4 space-y-3">
        {/* Left bubble */}
        <div className="flex justify-start">
          <Skeleton className="h-14 w-3/5 rounded-lg rounded-tl-none" />
        </div>
        <div className="flex justify-start ml-4">
          <Skeleton className="h-8 w-2/5 rounded-lg" />
        </div>

        {/* Right bubble */}
        <div className="flex justify-end">
          <Skeleton className="h-12 w-1/2 rounded-lg rounded-tr-none" />
        </div>
        <div className="flex justify-end mr-4">
          <Skeleton className="h-8 w-2/5 rounded-lg" />
        </div>

        {/* Left bubble */}
        <div className="flex justify-start">
          <Skeleton className="h-16 w-2/3 rounded-lg rounded-tl-none" />
        </div>
        <div className="flex justify-start ml-4">
          <Skeleton className="h-10 w-3/5 rounded-lg" />
        </div>
      </div>

      {/* Card 2: Emotional signals */}
      <div className="bg-bg-surface rounded-card p-section border border-border space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      {/* Card 3: Suggested responses */}
      <div className="bg-bg-surface rounded-card p-section border border-border space-y-4">
        <Skeleton className="h-5 w-44" />
        <div className="space-y-3">
          <Skeleton className="h-20 w-full rounded-input" />
          <Skeleton className="h-20 w-full rounded-input" />
          <Skeleton className="h-20 w-full rounded-input" />
        </div>
      </div>
    </div>
  )
}
