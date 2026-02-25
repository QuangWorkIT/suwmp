import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RewardRuleService } from "@/services/RewardRuleService";
import type { RewardRule } from "@/types/rewardRule";
import { formatWasteTypeName } from "@/utilities/capacityUtils";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface RewardRuleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  wasteTypeName: string;
  wasteTypeId: number;
  enterpriseId: number;
  onSave: () => void;
}

export default function RewardRuleDialog({
  open,
  onOpenChange,
  wasteTypeName,
  wasteTypeId,
  enterpriseId,
  onSave,
}: RewardRuleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [rule, setRule] = useState<RewardRule | null>(null);

  // Form state
  const [basePoints, setBasePoints] = useState<number | string>("");
  const [qualityMultiplier, setQualityMultiplier] = useState<number | string>("");
  const [active, setActive] = useState<boolean>(true);

  const [isCreating, setIsCreating] = useState(false);
  const [errors, setErrors] = useState<{ basePoints?: string; qualityMultiplier?: string }>({});

  useEffect(() => {
    if (open && enterpriseId && wasteTypeId) {
      fetchRule();
      setIsCreating(false);
      setErrors({});
    }
  }, [open, enterpriseId, wasteTypeId]);

  const fetchRule = async () => {
    setFetching(true);
    try {
      const response = await RewardRuleService.getByEnterpriseAndWasteType(
        enterpriseId,
        wasteTypeId
      );
      if (response.data) {
        setRule(response.data);
        setBasePoints(response.data.basePoints);
        setQualityMultiplier(response.data.qualityMultiplier);
        setActive(response.data.active);
      } else {
        setRule(null);
        setBasePoints("");
        setQualityMultiplier("");
      }
    } catch (error) {
      // 404 or other error means no rule
      setRule(null);
      setBasePoints("");
      setQualityMultiplier("");
    } finally {
      setFetching(false);
    }
  };

  const handleStartCreate = () => {
      setBasePoints("");
      setQualityMultiplier("");
      setActive(true);
      setIsCreating(true);
      setErrors({});
  };

  const handleSave = async () => {
    const newErrors: { basePoints?: string; qualityMultiplier?: string } = {};
    if (basePoints === "") newErrors.basePoints = "Base points are required";
    if (qualityMultiplier === "") newErrors.qualityMultiplier = "Multiplier is required";

    if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
    }

    setLoading(true);
    try {
      if (rule?.id) {
        await RewardRuleService.update(rule.id, {
          basePoints: Number(basePoints),
          qualityMultiplier: Number(qualityMultiplier),
          active,
        });
        toast.success("Reward rule updated successfully");
      } else {
        await RewardRuleService.create({
          enterpriseId,
          wasteTypeId,
          basePoints: Number(basePoints),
          qualityMultiplier: Number(qualityMultiplier),
        });
        toast.success("Reward rule created successfully");
      }
      onSave(); // Trigger refresh or callback
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save reward rule");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
      if (!rule?.id) return;
      setLoading(true);
      try {
          await RewardRuleService.delete(rule.id);
          toast.success("Reward rule deleted");
          setRule(null);
          setIsCreating(false);
          onSave();
      } catch (error) {
          console.error(error);
          toast.error("Failed to delete reward rule");
      } finally {
          setLoading(false);
      }
  };

  const showForm = !!rule || isCreating;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Reward Configuration</DialogTitle>
          <DialogDescription>
            Configure scoring rules for <span className="font-medium text-foreground">{formatWasteTypeName(wasteTypeName)}</span>.
          </DialogDescription>
        </DialogHeader>

        {fetching ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : !showForm ? (
            <div className="py-8 text-center space-y-4">
                <p className="text-muted-foreground text-sm">No reward rule configured for this waste type.</p>
                <Button onClick={handleStartCreate}>
                    Create Reward Rule
                </Button>
            </div>
        ) : (
          <div className="grid gap-6 py-4">
            
            {/* Status Toggle */}
             <div className="flex items-center space-x-2">
                <Checkbox 
                    id="active-rule" 
                    checked={active}
                    onCheckedChange={(checked) => setActive(checked as boolean)}
                />
                <Label htmlFor="active-rule" className="cursor-pointer">Enable Scoring for this waste type</Label>
            </div>

            <div className={`grid gap-4 transition-opacity ${!active ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="basePoints" className="text-right">
                    Base Points
                </Label>
                <div className="col-span-3">
                    <Input
                        id="basePoints"
                        type="number"
                        min="0"
                        value={basePoints}
                        onChange={(e) => {
                            setBasePoints(e.target.value === "" ? "" : Number(e.target.value));
                            if (errors.basePoints) setErrors({ ...errors, basePoints: undefined });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSave();
                            }
                        }}
                        placeholder="e.g. 10"
                        className={errors.basePoints ? "border-red-500" : ""}
                    />
                    {errors.basePoints && <p className="text-red-500 text-xs mt-1">{errors.basePoints}</p>}
                </div>
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="qualityMultiplier" className="text-right">
                    Quality Multiplier
                </Label>
                <div className="col-span-3">
                    <Input
                        id="qualityMultiplier"
                        type="number"
                        step="0.01"
                        min="0"
                        value={qualityMultiplier}
                        onChange={(e) => {
                            setQualityMultiplier(e.target.value === "" ? "" : Number(e.target.value));
                            if (errors.qualityMultiplier) setErrors({ ...errors, qualityMultiplier: undefined });
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                                handleSave();
                            }
                        }}
                        placeholder="e.g. 1.0"
                        className={errors.qualityMultiplier ? "border-red-500" : ""}
                    />
                    {errors.qualityMultiplier && <p className="text-red-500 text-xs mt-1">{errors.qualityMultiplier}</p>}
                </div>
                </div>
            </div>

          </div>
        )}

        <DialogFooter className="flex items-center justify-between sm:justify-between w-full">
            {showForm && rule?.id ? (
                 <Button variant="destructive" size="sm" onClick={handleDelete} disabled={loading || fetching}>
                    Delete
                </Button>
            ) : (
                <div /> /* Spacer if no delete button */
            )}
            
            <div className="flex gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                    Cancel
                </Button>
                {showForm && (
                    <Button onClick={handleSave} disabled={loading || fetching}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Configuration
                    </Button>
                )}
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
