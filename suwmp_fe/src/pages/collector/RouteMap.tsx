import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    Navigation as NavIcon,
    Bell,
    MapPin,
    User,
    Phone,
    MessageSquare,
    AlertCircle,
    Camera,
    Upload,
    CheckCircle2,
} from "lucide-react";
import { useAppSelector } from "@/redux/hooks";
import { Link } from "react-router";
import 'trackasia-gl/dist/trackasia-gl.css'
import trackasiagl, { Marker } from 'trackasia-gl'
import { getCoordinates, getUserLocation } from "@/utilities/geocoding";
import type { Feature, LineString } from "geojson"

const apiKey = import.meta.env.VITE_MAPS_API_KEY

export default function RouteMap() {
    const { currentTask, nextTask } = useAppSelector(state => state.assignedTask)

    const [isNavigating, setIsNavigating] = useState(false);
    const [isUploaded, setIsUploaded] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const mapRef = useRef<trackasiagl.Map | null>(null)
    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const taskMarkerRef = useRef<Marker | null>(null)
    const collectorMarkerRef = useRef<Marker | null>(null)


    /* ----------------------------- Map Init With Current Task ----------------------------- */
    useEffect(() => {
        if (!mapContainerRef.current || !currentTask || mapRef.current) return

        const map = new trackasiagl.Map({
            container: mapContainerRef.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${apiKey}`,
            center: [currentTask.requestLongitude, currentTask.requestLatitude],
            zoom: 14
        })

        mapRef.current = map

        map.on("load", () => {

            if (!taskMarkerRef.current) {
                taskMarkerRef.current = new Marker()
                    .setLngLat([
                        currentTask.requestLongitude,
                        currentTask.requestLatitude
                    ])
                    .addTo(map)
            }

            map.flyTo({
                center: [
                    currentTask.requestLongitude,
                    currentTask.requestLatitude
                ],
                zoom: 16
            })
        })

        return () => {
            taskMarkerRef.current?.remove()
            taskMarkerRef.current = null

            map.remove()
            mapRef.current = null
        }
    }, [currentTask])


    // load route
    useEffect(() => {
        if (!mapRef.current || !currentTask) return

        const loadRoute = async () => {

            const { coords } = await getUserLocation()

            const userPosition: [number, number] = [
                coords.longitude,
                coords.latitude
            ]

            const map = mapRef.current
            if (!map) return

            /* ---------- Render collector marker ---------- */

            if (!collectorMarkerRef.current) {
                const el = createTruckMarker()

                collectorMarkerRef.current = new Marker({ element: el })
                    .setLngLat(userPosition)
                    .addTo(map)
            } else {
                collectorMarkerRef.current.setLngLat(userPosition)
            }

            /* ---------- Get route ---------- */

            const coordinates = await getCoordinates(
                userPosition,
                [currentTask.requestLongitude, currentTask.requestLatitude]
            )

            if (!coordinates) return

            updateRoute(coordinates,
                userPosition,
                [currentTask.requestLongitude, currentTask.requestLatitude]
            )
        }

        loadRoute()

        return () => {
            collectorMarkerRef.current?.remove()
            collectorMarkerRef.current = null
        }

    }, [currentTask])

    // helper to render route
    const updateRoute = (coordinates: number[][],
        userPosition: [number, number],
        taskPosition: [number, number]
    ) => {

        const map = mapRef.current
        if (!map) return

        const routeData: Feature<LineString> = {
            type: "Feature",
            properties: {},
            geometry: {
                type: "LineString",
                coordinates
            }
        }

        const source = map.getSource("route") as trackasiagl.GeoJSONSource

        // update existing route
        if (source) {
            source.setData(routeData)
            return
        }

        // create route source
        map.addSource("route", {
            type: "geojson",
            data: routeData
        })

        map.addLayer({
            id: "route",
            type: "line",
            source: "route",
            layout: {
                "line-join": "round",
                "line-cap": "round"
            },
            paint: {
                "line-color": "#1976D2",
                "line-width": 6
            }
        })

        // 🔹 Fit map to both positions
        const bounds = new trackasiagl.LngLatBounds()
        bounds.extend(userPosition)
        bounds.extend(taskPosition)

        map.fitBounds(bounds, {
            padding: 80,
            duration: 1000
        })
    }

    // custom marker with truck icon
    const createTruckMarker = () => {
        const el = document.createElement("div")
        el.style.width = "40px"
        el.style.height = "40px"
        el.style.backgroundColor = "#F97316"
        el.style.backgroundImage = "url('/truck-icon.svg')"
        el.style.backgroundRepeat = "no-repeat"
        el.style.backgroundPosition = "center"
        el.style.backgroundSize = "22px 22px"
        el.style.borderRadius = "50%"
        el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.25)"
        el.style.cursor = "pointer"

        return el
    }

    return (
        <div className="pb-10">
            <header className="sticky top-0 left-[250px] w-[calc(100%-250px)] z-50
            bg-white/50 px-6 py-5 border-b border-foreground/20 flex w-full
            justify-between items-center backdrop-blur-xl backdrop-saturate-200">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Optimal Route</h1>
                        <p className="text-sm text-muted-foreground">Generated path for 3 collection stops</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        className={`${isNavigating ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}
                        onClick={() => setIsNavigating(!isNavigating)}
                    >
                        <NavIcon className="w-4 h-4 mr-2" />
                        {isNavigating ? "Stop Navigation" : "Start Navigation"}
                    </Button>
                    <button className="p-2 rounded-lg hover:bg-muted/50"><Bell className="w-5 h-5" /></button>
                </div>
            </header>

            <main className="p-6">
                {!currentTask ? (
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <Card className="max-w-md w-full px-10 text-center border-none shadow-xl bg-gradient-to-br from-card to-muted/30">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
                                <MapPin className="w-8 h-8 text-blue-500" />
                            </div>
                            <h2 className="text-xl font-bold">No Task Selected</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Please select a collection task from your task list to view the optimal route and start navigation.
                            </p>
                            <Link to="/collector/tasks">
                                <Button className="bg-blue-600 hover:bg-blue-700 rounded-xl h-11 px-6 shadow-lg shadow-blue-500/20 font-semibold">
                                    <NavIcon className="w-4 h-4 mr-2" />
                                    Browse Tasks
                                </Button>
                            </Link>
                        </Card>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-[1fr_440px] gap-6">
                        {/* Map Area */}
                        <Card className="relative min-h-[600px] p-0 overflow-hidden bg-muted flex items-center justify-center border-border">
                            <div ref={mapContainerRef} className="w-full h-full"></div>
                        </Card>

                        {/* Right Sidebar: Collection Details */}
                        <div className="space-y-6">
                            <Card className="p-6 border-none shadow-xl bg-gradient-to-br from-card to-muted/30 overflow-hidden relative">

                                <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                                    <User className="w-5 h-5 text-blue-500" />
                                    Current Collection
                                </h2>

                                <div className="space-y-6">
                                    <div className="flex items-center gap-4">
                                        <img
                                            src={currentTask.photoUrl}
                                            alt={currentTask.wasteTypeName}
                                            className="h-24 w-32 rounded-lg object-cover"
                                        />
                                        <div>
                                            <h3 className="text-xl font-bold">{currentTask.citizenName}</h3>
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                {currentTask.address}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 text-blue-600">Waste Type</p>
                                            <p className="text-sm font-bold">{currentTask.wasteTypeName}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-muted/50 border border-border/50">
                                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1 text-blue-600">Time to collect</p>
                                            <p className="text-sm font-bold">{new Date(currentTask.collectTime).toLocaleString()}</p>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 dark:bg-amber-950/20 dark:border-amber-900/30">
                                        <div className="flex gap-3">
                                            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider mb-1">Notes</p>
                                                <p className="text-sm text-amber-900/80 leading-relaxed">{currentTask.description}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button variant="outline" className="flex-1 rounded-xl h-11 border-blue-100 hover:bg-blue-50">
                                            <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                            Call
                                        </Button>
                                        <Button variant="outline" className="flex-1 rounded-xl h-11 border-blue-100 hover:bg-blue-50">
                                            <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                                            Chat
                                        </Button>
                                    </div>

                                    <div className="pt-6 border-t border-border/50 space-y-4">
                                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Proof of Collection</h4>

                                        <div
                                            className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${isUploaded ? "border-blue-500 bg-blue-50/50" : "border-border hover:border-blue-500/50 hover:bg-muted/50"
                                                }`}
                                            onClick={() => setIsUploaded(true)}
                                        >
                                            {isUploaded ? (
                                                <div className="space-y-2">
                                                    <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto">
                                                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                                    </div>
                                                    <p className="text-sm font-bold text-blue-600">Photo Uploaded</p>
                                                    <p className="text-xs text-muted-foreground">waste_proof_001.jpg</p>
                                                </div>
                                            ) : (
                                                <div className="space-y-3">
                                                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
                                                        <Camera className="w-6 h-6 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold">Upload Photo Proof</p>
                                                        <p className="text-xs text-muted-foreground">Required to complete task</p>
                                                    </div>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-blue-200">
                                                        <Upload className="w-3 h-3 mr-2 text-blue-600" />
                                                        Take Photo
                                                    </Button>
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            className="w-full h-12 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white font-bold disabled:opacity-50"
                                            disabled={!isUploaded || isCompleted}
                                            onClick={() => setIsCompleted(true)}
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                                    Collection Completed
                                                </>
                                            ) : (
                                                "Complete Collection"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 border-none hover:border-blue-400 hover:bg-blue-50 bg-muted/30 cursor-pointer">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
                                    <span>Next Stop</span>
                                    <span className="text-blue-600">2.4 km</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    {!nextTask ? <div>No more task found</div> : (
                                        <div className="space-y-3 min-w-0">
                                            <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                                                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-blue-500" />
                                                <span className="font-semibold leading-snug">{nextTask.address}</span>
                                            </div>
                                            <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                                                <AlertCircle className="w-3 h-3" />
                                                {nextTask.wasteTypeName}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
