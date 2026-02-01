import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart3, Plus } from "lucide-react"
import type { WasteTypeEnterpriseCapacity } from "@/types/wasteType";

const EnterpriseCapacityEmpty = ({handleAdd, wasteTypes}: {handleAdd: () => void; wasteTypes: WasteTypeEnterpriseCapacity[]}) => {
  return (
    <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-4 mb-4">
            <BarChart3 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Capacity Configured</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
            You haven't set up any waste type capacities yet. Add your first capacity to start managing your enterprise's waste collection limits.
            </p>
            <Button
            onClick={handleAdd}
            size="lg"
            className="shadow-sm hover:shadow-md transition-shadow"
            disabled={wasteTypes.length === 0}
            >
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Capacity
            </Button>
        </CardContent>
    </Card>
  )
}

export default EnterpriseCapacityEmpty