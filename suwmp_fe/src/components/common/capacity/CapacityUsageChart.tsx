import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart3 } from "lucide-react";

const CapacityUsageChart = ({isLoading}: {isLoading: boolean}) => {

  return (
    <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-base">
              Capacity History (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="h-56 flex items-center justify-center">
                  <Skeleton className="h-full w-full rounded-xl" />
               </div>
            ) : (
                <div className="flex h-56 items-center justify-center rounded-xl border border-dashed border-border bg-muted/20">
                  <div className="text-center space-y-2">
                    <div className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
                      <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      Capacity usage chart
                    </div>
                  </div>
                </div>
            )}
          </CardContent>
        </Card>
  )
}

export default CapacityUsageChart