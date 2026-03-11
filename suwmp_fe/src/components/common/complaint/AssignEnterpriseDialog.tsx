import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import wasteReportService from "@/services/WasteReportService";
import type { Complaint, ComplaintGetResponse } from "@/types/complaint";
import type { NearbyEnterpriseResponse, WasteReportDetailForComplaint } from "@/types/WasteReportRequest";
import { Input } from "@base-ui/react";
import { Building2, Loader2, Search, Trash2, UserCheck, UserRound, Weight } from "lucide-react";
import { useEffect, useState } from "react";
import NearByEnterprise from "./NearByEnterprise";
import { formatWasteTypeName } from "@/utilities/capacityUtils";

// ─── Info Row helper ──────────────────────────────────────────────────────────

const InfoRow = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
}) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0 text-gray-400">{icon}</div>
        <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">{label}</p>
            <p className="text-sm font-medium text-gray-800 mt-0.5">{value ?? "N/A"}</p>
        </div>
    </div>
);


interface AssignEnterpriseDialogProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    complaint: ComplaintGetResponse;
    onAssigned: () => void;
}

const AssignEnterpriseDialog = ({
    open,
    onOpenChange,
    complaint,
    onAssigned,
}: AssignEnterpriseDialogProps) => {
    const [detail, setDetail] = useState<WasteReportDetailForComplaint | null>(null);
    const [enterprises, setEnterprises] = useState<NearbyEnterpriseResponse[]>([]);
    const [search, setSearch] = useState("");
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [loadingEnterprises, setLoadingEnterprises] = useState(false);
    const [assigningId, setAssigningId] = useState<number | null>(null);

    useEffect(() => {
        if (!open || !complaint.wasteReportId) return;

        const fetchDetail = async () => {
            setLoadingDetail(true);
            setDetail(null);
            setEnterprises([]);
            try {
                const d = await wasteReportService.getWasteReportDetailForComplaint(complaint.wasteReportId!);
                setDetail(d);

                // fetch nearby enterprises once we have location + wasteTypeId
                setLoadingEnterprises(true);
                try {
                    const res = await wasteReportService.getEnterprisesNearby({
                        latitude: d.latitude,
                        longitude: d.longitude,
                        wasteTypeId: d.wasteTypeId,
                    });
                    setEnterprises(res.data ?? res ?? []);
                } catch {
                    setEnterprises([]);
                } finally {
                    setLoadingEnterprises(false);
                }
            } catch {
                /* ignore */
            } finally {
                setLoadingDetail(false);
            }
        };

        fetchDetail();
    }, [open, complaint.wasteReportId]);

    const handleAssign = async (enterpriseId: number) => {
        if (!complaint.wasteReportId) return;
        setAssigningId(enterpriseId);
        try {
            await wasteReportService.createWasteReportForComplaint(complaint.wasteReportId, enterpriseId);
            onOpenChange(false);
            onAssigned();
        } catch {
            /* handle error if needed */
        } finally {
            setAssigningId(null);
        }
    };

    const filtered = enterprises.filter((e) =>
        e.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden p-0">
                {/* Header */}
                <div className="px-6 pt-6 pb-4 border-b shrink-0">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-lg">
                            <UserCheck size={20} className="text-emerald-600" />
                            Assign Enterprise
                        </DialogTitle>
                        <p className="text-sm text-gray-500 mt-1">
                            CMP-00{complaint.id} · {complaint.description}
                        </p>
                    </DialogHeader>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {/* Complaint Info Section */}
                    <div className="px-6 py-4 bg-gray-50 border-b">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                            Complaint Info
                        </p>
                        {loadingDetail ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 size={14} className="animate-spin" /> Loading details…
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                <InfoRow
                                    icon={<UserRound size={15} />}
                                    label="Citizen"
                                    value={detail?.citizenName ?? complaint.citizenName}
                                />
                                <InfoRow
                                    icon={<Trash2 size={15} />}
                                    label="Waste Type"
                                    value={formatWasteTypeName(detail?.wasteTypeName ?? "")}
                                />
                                <InfoRow
                                    icon={<Building2 size={15} />}
                                    label="Previous Enterprise"
                                    value={detail?.previousEnterprise}
                                />
                                <InfoRow
                                    icon={<Weight size={15} />}
                                    label="Volume (kg)"
                                    value={detail?.volume != null ? `${detail.volume} kg` : undefined}
                                />
                            </div>
                        )}
                    </div>

                    {/* Enterprise List */}
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                                Suggested Enterprises
                            </p>
                            {!loadingEnterprises && enterprises.length > 0 && (
                                <span className="text-xs text-gray-400">{enterprises.length} found</span>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative mb-3">
                            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search enterprise…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-8 h-9 text-sm"
                            />
                        </div>

                        {loadingEnterprises ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                                <Loader2 size={20} className="animate-spin" />
                                <p className="text-sm">Finding nearby enterprises…</p>
                            </div>
                        ) : filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2">
                                <Building2 size={28} />
                                <p className="text-sm">No enterprises found</p>
                            </div>
                        ) : (
                            <NearByEnterprise filtered={filtered} assigningId={assigningId} handleAssign={handleAssign} />
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default AssignEnterpriseDialog;