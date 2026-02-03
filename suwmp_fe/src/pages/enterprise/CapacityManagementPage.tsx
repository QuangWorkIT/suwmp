import OverallCapacityCard from "@/components/common/capacity/OverallCapacityCard";

import CapacityUsageChart from "@/components/common/capacity/CapacityUsageChart";
import ConfirmUpdateDelete from "@/components/common/capacity/ConfirmUpdateDelete";
import EnterpriseCapacityCard from "@/components/common/capacity/EnterpriseCapacityCard";
import EnterpriseCapacityCardSkeleton from "@/components/common/capacity/EnterpriseCapacityCardSkeleton";
import EnterpriseCapacityDialog from "@/components/common/capacity/EnterpriseCapacityDialog";
import EnterpriseCapacityEmpty from "@/components/common/capacity/EnterpriseCapacityEmpty";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/redux/hooks";
import { CapacityService } from "@/services/CapacityService";
import { EnterpriseUserService } from "@/services/EnterpriseUserService";
import { WasteTypeService } from "@/services/WasteTypeService";
import type { CreateEnterpriseCapacityRequest, EnterpriseCapacity, UpdateEnterpriseCapacityRequest } from "@/types/enterpriseCapacity";
import type { WasteTypeEnterpriseCapacity } from "@/types/wasteType";
import { formatWasteTypeName } from "@/utilities/capacityUtils";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function CapacityManagementPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<EnterpriseCapacity[]>([]);
  const user = useAppSelector((state) => state.user).user;
  const [wasteTypes, setWasteTypes] = useState<WasteTypeEnterpriseCapacity[]>([]);

  const [usedKg, setUsedKg] = useState(200);
  const [enterpriseId, setEnterpriseId] = useState<number>(0);

  const fetchCapacities = async () => {
    if (!user?.id) return [];

    try {
      setIsLoading(true);

      const enterpriseId = (await EnterpriseUserService.getEnterpriseUserByUserId(user.id)).data.enterpriseId;
      setEnterpriseId(enterpriseId);

      const response = await CapacityService.getCapacitiesByEnterpriseId(enterpriseId);
      setItems(response.data);
      return response.data;
    } catch (e) {
      console.error(e);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWasteTypes = async (capacityItems: EnterpriseCapacity[]) => {
      try {
        const allWasteTypes = await WasteTypeService.getAll();
        const usedWasteTypeIds = capacityItems.map(item => item.wasteTypeId);

        const availableWasteTypes = allWasteTypes.filter(wt => !usedWasteTypeIds.includes(wt.id));
        setWasteTypes(availableWasteTypes);
      } catch (error) {
        console.error(error);
      }
    };

  const fetchAll = async () => {
    const capacityItems = await fetchCapacities();
    await fetchWasteTypes(capacityItems);
  };
  // Fetch data
  useEffect(() => { 
    fetchAll();
  }, [user?.id]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selected, setSelected] = useState<EnterpriseCapacity | undefined>(
    undefined,
  );

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: "destructive" | "default";
  }>({
    title: "",
    description: "",
    onConfirm: () => {},
  });

  const handleAdd = () => {
    setDialogMode("create");
    setSelected(undefined);
    setDialogOpen(true);
  };

  const handleDelete = (item: EnterpriseCapacity) => {
    setConfirmConfig({
      title: "Delete Capacity?",
      description: `Are you sure you want to delete the capacity configuration for ${formatWasteTypeName(item.wasteTypeName)}? This action cannot be undone.`,
      onConfirm: () => {
        CapacityService.deleteCapacity(item.id)
          .then(() => {
            fetchAll();
            toast.success("Capacity deleted successfully");
          })
          .catch((error) => {
            console.error(error)
            toast.error("Failed to delete capacity");
          });
      },
      variant: "destructive",
    });
    setConfirmOpen(true);
  };

  const handleUpdate = (id: number, data: UpdateEnterpriseCapacityRequest) => {
    setConfirmConfig({
      title: "Save Changes?",
      description: "Do you want to apply these changes to the capacity configuration?",
      onConfirm: () => {
        CapacityService.updateCapacity(id, data)
          .then(() => {
            setDialogOpen(false);
            fetchCapacities();
            toast.success("Capacity updated successfully");
          })
          .catch((error) => {
            console.error(error)
            toast.error("Failed to update capacity");
          } );
      },
      variant: "default",
    });
    setConfirmOpen(true);
  };

  const handleDialogSubmit = (
    payload: CreateEnterpriseCapacityRequest,
  ) => {
    CapacityService.createCapacity(payload)
    .then(() => {
      setDialogOpen(false);
      fetchAll();
      toast.success("Capacity created successfully");
    })
    .catch((error) => {
      console.error(error);
      toast.error("Failed to create capacity");
    });
  };

  return (
    <div className="h-full bg-background overflow-hidden relative">
      <div className="mx-auto h-full max-w-7xl overflow-y-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <OverallCapacityCard items={items} isLoading={isLoading} usedKg={usedKg} />

        <div className="flex items-center justify-end">
          <Button
            onClick={handleAdd}
            size="lg"
            className="shadow-sm hover:shadow-md transition-shadow"
            disabled={isLoading || wasteTypes.length === 0}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Capacity
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
             {Array.from({ length: 4 }).map((_, i) => (
                <EnterpriseCapacityCardSkeleton key={i} />
             ))}
          </div>
        ) : items.length === 0 ? (
          <EnterpriseCapacityEmpty handleAdd={handleAdd} wasteTypes={wasteTypes} />
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[...items]
              .sort((a, b) => a.wasteTypeName.localeCompare(b.wasteTypeName))
              .map((item) => (
              <EnterpriseCapacityCard
                key={item.id}
                item={item}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                usedKg={usedKg}
              />
            ))}
          </div>
        )}

        <CapacityUsageChart isLoading={isLoading} />

        <EnterpriseCapacityDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          value={selected}
          onSubmit={handleDialogSubmit}
          enterpriseId={enterpriseId}
          wasteTypes={wasteTypes}
        />

        <ConfirmUpdateDelete
          confirmOpen={confirmOpen}
          setConfirmOpen={setConfirmOpen}
          confirmConfig={confirmConfig}
        />
      </div>
    </div>
  );
}
