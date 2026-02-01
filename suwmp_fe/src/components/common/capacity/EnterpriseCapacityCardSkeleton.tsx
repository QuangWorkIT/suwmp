import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function EnterpriseCapacityCardSkeleton() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {/* Title */}
            <Skeleton className="h-5 w-32" />
            {/* Usage text preview */}
            <div className="flex items-center gap-1">
              <Skeleton className="h-4 w-16" />
              <span className="text-muted-foreground">/</span>
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-4 w-4" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Status Badge */}
            <Skeleton className="h-6 w-16 rounded-full" />
            {/* Action Button */}
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Usage Progress Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-8" />
          </div>
          <Skeleton className="h-2.5 w-full rounded-full" />
        </div>

        {/* Threshold Slider Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-10 rounded" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        {/* Status Toggle Section */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <div className="space-y-1">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-6 w-11 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
