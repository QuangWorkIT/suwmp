import { Button } from '@/components/ui/button';
import type { NearbyEnterpriseResponse } from '@/types/WasteReportRequest';
import { AnimatePresence, motion } from 'framer-motion';
import { Building2, Loader2, MapPin, Star } from 'lucide-react';

const StarRating = ({ rating }: { rating: number }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((s) => (
            <Star
                key={s}
                size={12}
                className={s <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
            />
        ))}
        <span className="ml-1 text-xs text-gray-500">{rating.toFixed(1)}</span>
    </div>
);

interface NearByEnterpriseProps {
    filtered: NearbyEnterpriseResponse[];
    assigningId: number | null;
    handleAssign: (id: number) => void;
}

const NearByEnterprise = ({ filtered, assigningId, handleAssign }: NearByEnterpriseProps) => {
  return (
    <AnimatePresence>
        <div className="space-y-2">
            {filtered.map((enterprise) => (
                <motion.div
                    key={enterprise.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                >
                    <div className="flex items-center justify-between gap-3 p-3 rounded-xl border bg-white hover:shadow-sm transition group">
                        <div className="flex items-center gap-3 min-w-0">
                            {/* Avatar */}
                            <div className="h-9 w-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Building2 size={16} className="text-emerald-600" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-semibold truncate">{enterprise.name}</p>
                                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                    <StarRating rating={enterprise.rating} />
                                    {enterprise.distance != null && (
                                        <span className="flex items-center gap-0.5 text-xs text-gray-400">
                                            <MapPin size={11} />
                                            {enterprise.distance < 1000
                                                ? `${Math.round(enterprise.distance)} m`
                                                : `${(enterprise.distance / 1000).toFixed(1)} km`}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <Button
                            size="sm"
                            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8 px-3"
                            disabled={assigningId !== null}
                            onClick={() => handleAssign(enterprise.id)}
                        >
                            {assigningId === enterprise.id ? (
                                <Loader2 size={13} className="animate-spin" />
                            ) : (
                                "Assign"
                            )}
                        </Button>
                    </div>
                </motion.div>
            ))}
        </div>
    </AnimatePresence>
)
}

export default NearByEnterprise