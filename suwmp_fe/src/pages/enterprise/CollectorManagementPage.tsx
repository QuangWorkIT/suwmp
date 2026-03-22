import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/common/collector/StatsCards";
import { CollectorCard } from "@/components/common/collector/CollectorCard";
import { CollectorDialog } from "@/components/common/collector/CollectorDialog";
import { DeleteCollectorDialog } from "@/components/common/collector/DeleteCollectorDialog";
import { CollectorService } from "@/services/collectors/CollectorService";
import WasteReportService from "@/services/waste-reports/WasteReportService";
import type {
  Collector,
  CreateCollectorRequest,
  UpdateCollectorRequest,
  CollectorStats,
} from "@/types/collector";

import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";

const CollectorManagementPage = () => {
  const { user } = useAppSelector((state) => state.user);
  const enterpriseId = user?.enterpriseId;


  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(""); // Correctly wired debounce
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  });

  const [activeRequestCount, setActiveRequestCount] = useState(0);

  // Fetch collectors and related stats - calls real APIs
  const fetchDashboardData = useCallback(async () => {
    if (!enterpriseId) return;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        CollectorService.getCollectors(enterpriseId, pagination.page, pagination.size),
        WasteReportService.getWasteReportsByEnterprise(0, 1000)
      ]);

      // Handle Collectors result
      const collectorsResult = results[0];
      if (collectorsResult.status === "fulfilled") {
        const response = collectorsResult.value;
        if (response.success && response.data) {
          setCollectors(response.data.content);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data!.totalElements,
            totalPages: response.data!.totalPages,
          }));
        } else {
          setError(response.error || "Failed to fetch collectors");
        }
      } else {
        setError("Failed to fetch collectors due to network error");
        console.error("Collector fetch error:", collectorsResult.reason);
      }

      // Handle Reports result separately
      const reportsResult = results[1];
      if (reportsResult.status === "fulfilled") {
        setActiveRequestCount(reportsResult.value.data.length);
      } else {
        console.error("Waste reports fetch error:", reportsResult.reason);
        // We don't discard collectorsRes if this fails
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [enterpriseId, pagination.page, pagination.size]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Calculate statistics
  const stats: CollectorStats = useMemo(() => {
    return {
      totalCollectors: pagination.totalElements,
      // NOTE: activeNow currently only counts collectors from the currently loaded page.
      // To obtain a true global count, a dedicated "stats" endpoint or backend status filtering is required.
      activeNow: collectors.filter(c => c.status === "ACTIVE").length,
      tasksToday: activeRequestCount,
      avgRating: 0, // Placeholder: No backend API for rating yet
    };
  }, [pagination.totalElements, collectors, activeRequestCount]);

  // Filter collectors based on debounced search query
  const filteredCollectors = useMemo(() => {
    if (!debouncedSearch.trim()) {
      return collectors;
    }
    const query = debouncedSearch.toLowerCase();
    return collectors.filter(
      (collector) =>
        collector.fullName.toLowerCase().includes(query) ||
        collector.email.toLowerCase().includes(query) ||
        collector.phone.toLowerCase().includes(query)
    );
  }, [collectors, debouncedSearch]);

  // Correctly wired debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle create collector
  const handleCreate = async (data: CreateCollectorRequest) => {
    const response = await CollectorService.createCollector(enterpriseId!, data);
    if (response.success) {
      await fetchDashboardData();
      setDialogOpen(false);
    } else {
      throw new Error(response.error || "Failed to create collector");
    }
  };

  // Handle update collector
  const handleUpdate = async (data: UpdateCollectorRequest) => {
    if (!selectedCollector) return;

    const response = await CollectorService.updateCollector(
      enterpriseId!,
      selectedCollector.id,
      data
    );
    if (response.success) {
      await fetchDashboardData();
      setDialogOpen(false);
      setSelectedCollector(null);
    } else {
      throw new Error(response.error || "Failed to update collector");
    }
  };

  // Handle delete collector
  const handleDelete = async () => {
    if (!selectedCollector) return;

    try {
      const response = await CollectorService.deleteCollector(
        enterpriseId!,
        selectedCollector.id
      );
      if (response.success) {
        await fetchDashboardData();
        setDeleteDialogOpen(false);
        setSelectedCollector(null);
        toast.success("Collector deleted");
      } else {
        toast.error(response.error || "Failed to delete collector");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    }
  };

  // Handle edit click
  const handleEdit = (collector: Collector) => {
    setSelectedCollector(collector);
    setDialogMode("edit");
    setDialogOpen(true);
  };

  // Handle add click
  const handleAdd = () => {
    setSelectedCollector(null);
    setDialogMode("create");
    setDialogOpen(true);
  };

  return (
    <div className="h-full bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8 h-full overflow-y-auto">
        {/* Add Button */}
        <div className="flex items-center justify-end">
          <Button
            onClick={handleAdd}
            size="lg"
            className="shadow-sm hover:shadow-md transition-shadow"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Collector
          </Button>
        </div>
        {/* Statistics Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <StatsCards stats={stats} />
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative max-w-md"
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search collectors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-amber-500 focus-visible:border-amber-500 bg-white
                      focus-visible:ring-1 focus-visible:ring-offset-0 focus-visible:shadow-md"
          />
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg"
          >
            <p className="font-medium">{error}</p>
          </motion.div>
        )}

        {/* Loading State */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading collectors...</p>
          </motion.div>
        )}

        {/* Collectors Grid */}
        {!loading && !error && (
          <>
            {filteredCollectors.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16"
              >
                <Card className="border-0 shadow-md max-w-md mx-auto">
                  <CardHeader>
                    <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                      <Users className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <CardTitle className="text-xl">
                      {searchQuery ? "No Results Found" : "No Collectors Yet"}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {searchQuery
                        ? "Try adjusting your search terms to find what you're looking for."
                        : "Get started by adding your first collector to the team."}
                    </CardDescription>
                  </CardHeader>
                  {!searchQuery && (
                    <CardContent>
                      <Button onClick={handleAdd} className="w-full">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add Your First Collector
                      </Button>
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredCollectors.map((collector, index) => (
                  <motion.div
                    key={collector.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <CollectorCard
                      collector={collector}
                      onEdit={handleEdit}
                      onViewTasks={(collector) => {
                        // TODO: Implement view tasks functionality
                        console.log("View tasks for:", collector);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* Dialogs */}
        <CollectorDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          mode={dialogMode}
          collector={selectedCollector || undefined}
          onSubmit={async (data) => {
            try {
              if (dialogMode === "create") {
                await handleCreate(data as CreateCollectorRequest);
                toast.success("Collector created successfully");
              } else {
                await handleUpdate(data as UpdateCollectorRequest);
                toast.success("Collector updated successfully");
              }
            } catch (err: any) {
              toast.error(err.message || "Operation failed");
            }
          }}
        />

        <DeleteCollectorDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          collector={selectedCollector}
          onConfirm={handleDelete}
        />
      </div>
    </div>
  );
};

export default CollectorManagementPage;
