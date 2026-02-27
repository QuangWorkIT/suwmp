import { useEffect, useMemo, useState, useRef, useCallback } from "react";
import { Edit, MapPin, Plus, LoaderCircle, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ServiceAreaService } from "@/services/ServiceAreaService";
import WasteReportService from "@/services/WasteReportService";
import type { ServiceArea } from "@/types/serviceArea";
import ServiceAreaMap from "@/components/common/enterprise/ServiceAreaMap";
import {
  reverseGeocode,
  forwardGeocode,
  autocompleteAddress,
  type AddressSuggestion,
} from "@/utilities/geocoding";
import { useDebounce } from "@/hooks/useDebouse";
import { CollectorService } from "@/services/CollectorService";

import { useAppSelector } from "@/redux/hooks";

const ServiceAreasPage = () => {
  const { user } = useAppSelector((state) => state.user);
  const enterpriseId = user?.enterpriseId;

  const [areas, setAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addresses, setAddresses] = useState<Record<number, string>>({});
  const [collectorCount, setCollectorCount] = useState(0);
  const [activeRequestCount, setActiveRequestCount] = useState(0);

  const [pendingAddress, setPendingAddress] = useState<string>("");
  const [pendingCoordinates, setPendingCoordinates] = useState<{
    lng: number;
    lat: number;
  } | null>(null);
  const [addressSuggestions, setAddressSuggestions] = useState<
    AddressSuggestion[]
  >([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [geocodingAddress, setGeocodingAddress] = useState(false);
  const addressInputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const mapCardRef = useRef<HTMLDivElement>(null); // Ref for map card
  const [radius, setRadius] = useState<string>("1000");
  const [saving, setSaving] = useState(false);
  const [focusedZone, setFocusedZone] = useState<{
    latitude: number;
    longitude: number;
    radius: number;
  } | null>(null);

  const debouncedAddress = useDebounce(pendingAddress, 400);

  const fetchAreas = useCallback(async () => {
    if (!enterpriseId) return;

    setLoading(true);
    setError(null);

    try {
      const results = await Promise.allSettled([
        ServiceAreaService.list(enterpriseId),
        CollectorService.getCollectors(enterpriseId, 0, 1),
        WasteReportService.getWasteReportsByEnterprise(enterpriseId),
      ]);

      // Service Areas
      const areasResult = results[0];
      if (areasResult.status === "fulfilled") {
        const res = areasResult.value;
        if (res.success) {
          setAreas(res.data ?? []);
        } else {
          setError(res.error || "Failed to fetch service areas");
        }
      } else {
        setError("Failed to fetch service areas due to network error");
      }

      // Collectors
      const collectorsResult = results[1];
      if (collectorsResult.status === "fulfilled") {
        const res = collectorsResult.value;
        if (res.success && res.data) {
          setCollectorCount(res.data.totalElements);
        }
      }

      // Reports
      const reportsResult = results[2];
      if (reportsResult.status === "fulfilled") {
        const activeCount = reportsResult.value.filter((r) =>
          ["PENDING", "ACCEPTED", "ASSIGNED"].includes(r.currentStatus)
        ).length;
        setActiveRequestCount(activeCount);
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [enterpriseId]);

  useEffect(() => {
    fetchAreas();
  }, [fetchAreas]);

  useEffect(() => {
    // Resolve formatted addresses for zones that don't have one yet.
    const unresolved = areas.filter((a) => !addresses[a.id]);
    if (!unresolved.length) return;

    let cancelled = false;
    (async () => {
      const updates: Record<number, string> = {};
      for (const a of unresolved) {
        try {
          // reverseGeocode expects (longitude, latitude)
          const addr = await reverseGeocode(a.longitude, a.latitude);
          if (addr) updates[a.id] = addr;
        } catch {
          // ignore and keep lat/lng fallback
        }
      }
      if (cancelled) return;
      if (Object.keys(updates).length) {
        setAddresses((prev) => ({ ...prev, ...updates }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [areas, addresses]);

  const stats = useMemo(() => {
    return {
      totalZones: areas.length,
      totalCollectors: collectorCount,
      activeRequests: activeRequestCount,
      coverageRate: 0, // Placeholder set to 0 as it's not implemented yet
    };
  }, [areas.length, collectorCount, activeRequestCount]);

  // Autocomplete search effect
  useEffect(() => {
    if (!debouncedAddress.trim() || geocodingAddress) {
      setAddressSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const suggestions = await autocompleteAddress(debouncedAddress, 5);
        if (!cancelled) {
          setAddressSuggestions(suggestions);
          setShowSuggestions(suggestions.length > 0);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Autocomplete error:", err);
          setAddressSuggestions([]);
          setShowSuggestions(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedAddress, geocodingAddress]);

  // Handle address selection from autocomplete
  const handleAddressSelect = async (suggestion: AddressSuggestion) => {
    setPendingAddress(suggestion.formatted_address);
    setShowSuggestions(false);
    setGeocodingAddress(true);
    setError(null);

    try {
      let coords: { longitude: number; latitude: number };

      // Use coordinates from suggestion if available
      if (suggestion.geometry?.location) {
        coords = {
          longitude: Number(suggestion.geometry.location.lng),
          latitude: Number(suggestion.geometry.location.lat),
        };
      } else {
        // Fallback to geocoding
        coords = await forwardGeocode(suggestion.formatted_address);
      }

      setPendingCoordinates({ lng: coords.longitude, lat: coords.latitude });
    } catch (err) {
      setError(
        "Failed to get coordinates for this address. Please try another address."
      );
      setPendingCoordinates(null);
    } finally {
      setGeocodingAddress(false);
    }
  };

  // Handle manual address geocoding (when user types and presses enter or clicks outside)
  const handleGeocodeAddress = async () => {
    if (!pendingAddress.trim() || geocodingAddress) return;

    setGeocodingAddress(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const coords = await forwardGeocode(pendingAddress);
      setPendingCoordinates({ lng: coords.longitude, lat: coords.latitude });
    } catch (err) {
      setError(
        "Failed to find this address. Please check the address or try another one."
      );
      setPendingCoordinates(null);
    } finally {
      setGeocodingAddress(false);
    }
  };

  const handleCreate = async () => {
    if (!pendingCoordinates) {
      setError("Please select a valid address first.");
      return;
    }
    const radiusValue = Number(radius);
    if (!Number.isFinite(radiusValue) || radiusValue <= 0) {
      setError("Radius must be a positive number (meters).");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await ServiceAreaService.create(enterpriseId!, {
        latitude: pendingCoordinates.lat,
        longitude: pendingCoordinates.lng,
        radius: Math.round(radiusValue),
      });

      if (!res.success) {
        setError(res.error || "Failed to create service area");
        return;
      }
      setPendingAddress("");
      setPendingCoordinates(null);
      setAddressSuggestions([]);
      await fetchAreas();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(String(err) || "An unexpected error occurred while saving");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleViewZone = (area: ServiceArea) => {
    setFocusedZone({
      latitude: area.latitude,
      longitude: area.longitude,
      radius: area.radius,
    });
    // Scroll map into view if needed
    mapCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        addressInputRef.current &&
        !addressInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="h-full bg-background overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6 h-full overflow-y-auto">
        {/* Top grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map card */}
          <Card
            ref={mapCardRef}
            className="lg:col-span-2 p-6 rounded-xl border shadow-sm"
          >
            <div className="flex items-center justify-between">
              <p className="text-lg font-semibold tracking-tight">Zone Map</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Edit className="h-4 w-4" />
                Edit Zones
              </Button>
            </div>

            <div className="mt-4 h-80 rounded-xl bg-muted/30 border border-border relative overflow-hidden">
              <ServiceAreaMap
                areas={areas}
                onMapClick={(lng, lat) => {
                  // When clicking map, reverse geocode to get address
                  (async () => {
                    try {
                      const addr = await reverseGeocode(lng, lat);
                      setPendingAddress(addr);
                      setPendingCoordinates({ lng, lat });
                    } catch {
                      setPendingAddress("");
                      setPendingCoordinates({ lng, lat });
                    }
                  })();
                }}
                focusZone={focusedZone}
              />

              {/* Click helper */}
              {!pendingCoordinates && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="mx-auto mb-3 h-12 w-12 rounded-xl bg-background/70 border flex items-center justify-center">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <p className="font-medium">Interactive Map</p>
                    <p className="text-sm">
                      Enter an address or click to add a service zone
                    </p>
                  </div>
                </div>
              )}

              {/* Add-zone mini panel */}
              {(pendingAddress || pendingCoordinates) && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-[400px] rounded-xl bg-background/90 backdrop-blur border shadow-sm p-3 space-y-3 z-10">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">New Zone</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPendingAddress("");
                        setPendingCoordinates(null);
                        setAddressSuggestions([]);
                        setShowSuggestions(false);
                        setError(null);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Address input with autocomplete */}
                  <div className="space-y-1 relative">
                    <p className="text-xs text-muted-foreground">Address</p>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        ref={addressInputRef}
                        value={pendingAddress}
                        onChange={(e) => {
                          setPendingAddress(e.target.value);
                          setShowSuggestions(true);
                          if (!e.target.value.trim()) {
                            setPendingCoordinates(null);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleGeocodeAddress();
                          } else if (e.key === "Escape") {
                            setShowSuggestions(false);
                          }
                        }}
                        onBlur={() => {
                          // Delay to allow suggestion click to fire first
                          setTimeout(() => {
                            if (pendingAddress && !pendingCoordinates) {
                              handleGeocodeAddress();
                            }
                          }, 200);
                        }}
                        placeholder="Enter address or click on map"
                        className="pl-10 pr-10"
                        disabled={geocodingAddress}
                      />
                      {geocodingAddress && (
                        <LoaderCircle className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-muted-foreground" />
                      )}

                      {/* Autocomplete suggestions dropdown */}
                      {showSuggestions && addressSuggestions.length > 0 && (
                        <div
                          ref={suggestionsRef}
                          className="absolute z-50 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto"
                        >
                          {addressSuggestions.map((suggestion, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => handleAddressSelect(suggestion)}
                              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors border-b last:border-b-0"
                            >
                              <p className="text-sm font-medium">
                                {suggestion.formatted_address}
                              </p>
                              {suggestion.sublabel && (
                                <p className="text-xs text-muted-foreground">
                                  {suggestion.sublabel}
                                </p>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    {pendingCoordinates && (
                      <p className="text-xs text-muted-foreground">
                        Location: {pendingCoordinates.lat.toFixed(6)},{" "}
                        {pendingCoordinates.lng.toFixed(6)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Radius (meters)
                    </p>
                    <Input
                      value={radius}
                      onChange={(e) => setRadius(e.target.value)}
                      placeholder="1000"
                      inputMode="numeric"
                    />
                  </div>
                  <Button
                    onClick={handleCreate}
                    disabled={saving || !pendingCoordinates || geocodingAddress}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {saving ? "Adding..." : "Add Zone"}
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Quick stats */}
          <Card className="p-6 rounded-xl border shadow-sm">
            <p className="text-lg font-semibold tracking-tight">Quick Stats</p>
            <div className="mt-4 space-y-4">
              {[
                { label: "Total Zones", value: stats.totalZones },
                { label: "Total Collectors", value: stats.totalCollectors },
                { label: "Active Requests", value: stats.activeRequests },
                { label: "Coverage Rate", value: `${stats.coverageRate}%` },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex items-center justify-between p-3 rounded-xl bg-muted/30"
                >
                  <p className="text-sm text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-semibold">{s.value}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Errors / loading */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg">
            <p className="font-medium">{error}</p>
          </div>
        )}
        {loading && (
          <div className="text-center py-10 text-muted-foreground">
            Loading service areas...
          </div>
        )}

        {/* Zone cards */}
        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {areas.map((a, idx) => {
              const baseChar = String.fromCharCode(65 + (idx % 26));
              const suffix = idx >= 26 ? Math.floor(idx / 26) : "";
              const label = `Zone ${baseChar}${suffix}`;
              return (
                <Card
                  key={a.id}
                  className="p-5 rounded-xl border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-muted-foreground">active</p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    {addresses[a.id]
                      ? addresses[a.id]
                      : `Lat ${a.latitude.toFixed(
                          4
                        )}, Lng ${a.longitude.toFixed(4)}`}
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-lg font-semibold">
                        {Math.round(a.radius / 1000)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Radius (km)
                      </p>
                    </div>
                    <div className="p-2 rounded-lg bg-muted/30 text-center">
                      <p className="text-lg font-semibold">{a.id}</p>
                      <p className="text-xs text-muted-foreground">Zone ID</p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewZone(a)}
                    >
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Config
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceAreasPage;
