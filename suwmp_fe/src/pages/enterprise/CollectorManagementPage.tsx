import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, UserPlus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/components/common/collector/StatsCards";
import { CollectorCard } from "@/components/common/collector/CollectorCard";
import { CollectorDialog } from "@/components/common/collector/CollectorDialog";
import { DeleteCollectorDialog } from "@/components/common/collector/DeleteCollectorDialog";
import { CollectorService } from "@/services/CollectorService";
import { mockCollectors, USE_MOCK_DATA } from "@/data/mockCollectors";
import type {
  Collector,
  CreateCollectorRequest,
  UpdateCollectorRequest,
  CollectorStats,
} from "@/types/collector";

const CollectorManagementPage = () => {
  // TODO: Get enterpriseId from auth context/Redux store
  // For now, using a placeholder - this should be retrieved from authenticated user's profile
  // In a real app, this would come from: const { user } = useAuth(); const enterpriseId = user.enterpriseId;
  const enterpriseId = 1;

  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
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

  // Fetch collectors - uses mock data if enabled, otherwise calls API
  const fetchCollectors = async () => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay for mock data
    if (USE_MOCK_DATA) {
      setTimeout(() => {
        setCollectors(mockCollectors);
        setPagination({
          page: 0,
          size: 20,
          totalElements: mockCollectors.length,
          totalPages: 1,
        });
        setLoading(false);
      }, 500); // Simulate network delay
      return;
    }

    // Real API call
    try {
      const response = await CollectorService.getCollectors(
        enterpriseId,
        pagination.page,
        pagination.size
      );
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
    } catch (err) {
      setError("An unexpected error occurred");
      console.error("Error fetching collectors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectors();
  }, [enterpriseId, pagination.page, pagination.size]);

  // Calculate statistics
  const stats: CollectorStats = useMemo(() => {
    const totalCollectors = collectors.length;
    const activeNow = collectors.filter(
      (c) => c.status === "ACTIVE" || c.status === "IDLE"
    ).length;
    // Mock data for tasks and rating - these would come from separate API endpoints
    const tasksToday = 22;
    const avgRating = 4.7;

    return {
      totalCollectors,
      activeNow,
      tasksToday,
      avgRating,
    };
  }, [collectors]);

  // Filter collectors based on search query
  const filteredCollectors = useMemo(() => {
    if (!searchQuery.trim()) {
      return collectors;
    }
    const query = searchQuery.toLowerCase();
    return collectors.filter(
      (collector) =>
        collector.fullName.toLowerCase().includes(query) ||
        collector.email.toLowerCase().includes(query) ||
        collector.phone.toLowerCase().includes(query)
    );
  }, [collectors, searchQuery]);

  // Debounced search (simple implementation)
  const [, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle create collector
  const handleCreate = async (data: CreateCollectorRequest) => {
    if (USE_MOCK_DATA) {
      // Mock: Add new collector to the list
      const newCollector: Collector = {
        id: Date.now().toString(),
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        status: "ACTIVE",
        imageUrl: null,
        createdAt: new Date().toISOString(),
      };
      setCollectors((prev) => [...prev, newCollector]);
      setDialogOpen(false);
      return;
    }

    const response = await CollectorService.createCollector(enterpriseId, data);
    if (response.success) {
      await fetchCollectors();
      setDialogOpen(false);
    } else {
      throw new Error(response.error || "Failed to create collector");
    }
  };

  // Handle update collector
  const handleUpdate = async (data: UpdateCollectorRequest) => {
    if (!selectedCollector) return;

    if (USE_MOCK_DATA) {
      // Mock: Update collector in the list
      setCollectors((prev) =>
        prev.map((collector) =>
          collector.id === selectedCollector.id
            ? {
                ...collector,
                ...data,
                status: (data.status || collector.status) as Collector["status"],
              }
            : collector
        )
      );
      setDialogOpen(false);
      setSelectedCollector(null);
      return;
    }

    const response = await CollectorService.updateCollector(
      enterpriseId,
      selectedCollector.id,
      data
    );
    if (response.success) {
      await fetchCollectors();
      setDialogOpen(false);
      setSelectedCollector(null);
    } else {
      throw new Error(response.error || "Failed to update collector");
    }
  };

  // Handle delete collector
  const handleDelete = async () => {
    if (!selectedCollector) return;

    if (USE_MOCK_DATA) {
      // Mock: Remove collector from the list (soft delete - set to INACTIVE)
      setCollectors((prev) =>
        prev.map((collector) =>
          collector.id === selectedCollector.id
            ? { ...collector, status: "INACTIVE" as const }
            : collector
        )
      );
      setDeleteDialogOpen(false);
      setSelectedCollector(null);
      return;
    }

    const response = await CollectorService.deleteCollector(
      enterpriseId,
      selectedCollector.id
    );
    if (response.success) {
      await fetchCollectors();
      setDeleteDialogOpen(false);
      setSelectedCollector(null);
    } else {
      throw new Error(response.error || "Failed to delete collector");
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
            className="pl-10 shadow-sm"
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
            if (dialogMode === "create") {
              await handleCreate(data as CreateCollectorRequest);
            } else {
              await handleUpdate(data as UpdateCollectorRequest);
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
