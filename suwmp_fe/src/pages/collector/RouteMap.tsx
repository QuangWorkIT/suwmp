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
    Loader2,
    Check,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { Link } from "react-router";
import 'trackasia-gl/dist/trackasia-gl.css'
import trackasiagl, { Marker } from 'trackasia-gl'
import { getCoordinates, getUserLocation } from "@/utilities/geocoding";
import type { Feature, LineString } from "geojson"
import { toast } from "sonner";
import ImageDetail from "@/components/common/ImageDetail";
import s3Service from "@/services/waste-reports/S3Service";
import { collectionLogService } from "@/services/collectors/CollectionLogService";
import wasteReportService from "@/services/waste-reports/WasteReportService";
import { ComplaintService } from "@/services/admins/ComplaintService";
import { WasteReportStatus } from "@/types/WasteReportRequest";
import { updateTaskStatus } from "@/components/common/collector/TaskCard";
import type { AssignedTask } from "@/types/collectorTask";
import { clearCurrentTask, setTaskStatus } from "@/redux/features/assignedTaskSlice";

const apiKey = import.meta.env.VITE_MAPS_API_KEY
const MAX_FILE_SIZE = 10 * 1024 * 1024
const ALLOWED_TYPES = ["image/jpeg", "image/png"]

export default function RouteMap() {
    const { currentTask, nextTask } = useAppSelector(state => state.assignedTask)
    const user = useAppSelector(state => state.user.user)
    const dispatch = useAppDispatch()

    const [isUpdatingTaskStatus, setIsUpdatingTaskStatus] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoadingRoute, setIsLoadingRoute] = useState(false);
    const inputRef = useRef<HTMLInputElement | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [imgPreview, setImageReview] = useState<string | null>(null)

    const [isProofPreviewOpen, setProofPreviewOpen] = useState(false)
    const [isTaskPreviewOpen, setTaskPreviewOpen] = useState(false)

    const [isSubmitting, setIsSubmitting] = useState(false)
    // map data
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
            zoom: 9
        })

        mapRef.current = map

        map.on("load", async () => {

            // render task marker
            if (!taskMarkerRef.current) {
                taskMarkerRef.current = new Marker()
                    .setLngLat([
                        currentTask.requestLongitude,
                        currentTask.requestLatitude
                    ])
                    .addTo(map)
            }

            let userPosition: [number, number]
            // render collector marker
            try {
                const { coords } = await getUserLocation()
                userPosition = [
                    coords.longitude,
                    coords.latitude
                ]
            } catch (error) {
                toast.error("Fail to get user location")
                return
            }

            if (!collectorMarkerRef.current) {
                const el = createTruckMarker()
                collectorMarkerRef.current = new Marker({ element: el })
                    .setLngLat(userPosition)
                    .addTo(map)
            } else {
                collectorMarkerRef.current.setLngLat(userPosition)
            }

            map.flyTo({
                center: userPosition,
                zoom: 16
            })

            // load route after markers are ready
            setIsLoadingRoute(true)
            try {
                const coordinates = await getCoordinates(
                    userPosition,
                    [currentTask.requestLongitude, currentTask.requestLatitude]
                )

                if (!coordinates) {
                    toast.error("Error navigating!")
                    return
                }

                updateRoute(coordinates,
                    userPosition,
                    [currentTask.requestLongitude, currentTask.requestLatitude]
                )
            } finally {
                setIsLoadingRoute(false)
            }
        })

        return () => {
            taskMarkerRef.current?.remove()
            taskMarkerRef.current = null

            map.remove()
            mapRef.current = null

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

        // Fit map to both positions
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!ALLOWED_TYPES.includes(file.type)) {
            toast.error("File is not supported")
            return
        }

        if (file.size > MAX_FILE_SIZE) {
            toast.error("File size exceeds 10MB limit")
            return
        }

        const imgObj = URL.createObjectURL(file)
        setImageReview(imgObj)
        setFile(file)
    }

    useEffect(() => {
        // clean up function preventing memory leak
        return () => {
            if (imgPreview) {
                URL.revokeObjectURL(imgPreview)
            }
        }
    }, [imgPreview])

    const handleUpdateStatus = async (task: AssignedTask) => {
        setIsUpdatingTaskStatus(true)
        await updateTaskStatus(task.requestId, WasteReportStatus.ON_THE_WAY)
        dispatch(setTaskStatus({ ...task, currentStatus: WasteReportStatus.ON_THE_WAY }))
        setIsUpdatingTaskStatus(false)
    }

    const handleCompleteTask = async () => {
        if (!file || !currentTask || !user || currentTask.currentStatus === WasteReportStatus.COLLECTED) return

        try {
            setIsSubmitting(true)
            const photoResponse = await s3Service.uploadImage(file)
            if (!photoResponse) return

            const payload = {
                wasteReportId: currentTask.requestId,
                collectionAssignmentId: currentTask.assignmentId,
                photoUrl: photoResponse.data,
                collectorId: user.id
            }

            const logCreationResponse = await collectionLogService.createCollectionLog(payload)
            if (!logCreationResponse.isSuccess)
                throw new Error(logCreationResponse.message)


            const statusUpdateResponse = await wasteReportService.updateWasteReportStatus(
                {
                    wasteReportId: currentTask.requestId,
                    status: WasteReportStatus.COLLECTED
                }
            )
            if (!statusUpdateResponse.isSuccess)
                throw new Error(statusUpdateResponse.message)

            if (currentTask.priority === "URGENT") {
                await ComplaintService.updateComplaintStatusWithWasteReportId(currentTask.requestId, {
                    status: "RESOLVED"
                })
            }

            dispatch(clearCurrentTask())
            toast.success("Upload proof successfully")
            setIsCompleted(true)

        } catch (error) {
            toast.error("Fail to upload image")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="pb-10">
            <header className="sticky top-0 left-[250px] w-[calc(100%-250px)] z-50
            bg-white/50 px-6 py-5 border-b border-foreground/20 flex w-full
            justify-between items-center backdrop-blur-xl backdrop-saturate-200">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>Optimal Route</h1>
                        <p className="text-sm text-muted-foreground">Generated path for a collection stop</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
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
                        <Card className="relative min-h-[500px] p-0 overflow-hidden bg-muted flex items-center justify-center border-border">
                            <div ref={mapContainerRef} className="w-full h-full"></div>

                            {/* Route loading overlay */}
                            {isLoadingRoute && (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/60 backdrop-blur-sm transition-opacity">
                                    <div className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-card/90 shadow-xl border border-border">
                                        <div className="relative">
                                            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
                                            <NavIcon className="w-4 h-4 text-blue-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold">Calculating Route</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">Finding the best path to collection point...</p>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTaskPreviewOpen(true);
                                            }}
                                            src={currentTask.photoUrl}
                                            alt={currentTask.wasteTypeName}
                                            className="h-24 w-32 rounded-lg object-cover
                                            cursor-zoom-in hover:scale-105 transition-transform duration-300"
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
                                        <a href={`tel:${currentTask.citizenPhone}`} className="flex-1">
                                            <Button variant="outline" className="w-full rounded-xl h-11 border-blue-100 hover:bg-blue-50 cursor-pointer">
                                                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                                                Call
                                            </Button>
                                        </a>
                                        <a href={`sms:${currentTask.citizenPhone}`} className="flex-1">
                                            <Button variant="outline" className="w-full rounded-xl h-11 border-blue-100 hover:bg-blue-50 cursor-pointer">
                                                <MessageSquare className="w-4 h-4 mr-2 text-blue-600" />
                                                SMS
                                            </Button>
                                        </a>
                                    </div>

                                    {currentTask.currentStatus !== WasteReportStatus.ON_THE_WAY
                                        && currentTask.currentStatus !== WasteReportStatus.COLLECTED ? (
                                        <div className="w-full flex justify-center py-4">
                                            <Button
                                                onClick={() => handleUpdateStatus(currentTask)}
                                                className="bg-blue-500 hover:bg-blue-600 transition-all">
                                                {isUpdatingTaskStatus ? (
                                                    "Starting..."
                                                ) : (
                                                    "Start collection"
                                                )}
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="pt-6 border-t border-border/50 space-y-4">
                                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Proof of Collection</h4>

                                            <div
                                                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer hover:bg-muted/30
                                                ${imgPreview || currentTask.currentStatus === "COLLECTED" ? "border-blue-500 bg-blue-50/50" : "border-border hover:border-blue-500/50 "}`}
                                                onClick={() => {
                                                    if (!isCompleted && currentTask.currentStatus !== "COLLECTED") {
                                                        inputRef.current?.click()
                                                    }
                                                }}
                                            >
                                                <input type="file" ref={inputRef} className="hidden" onChange={handleFileChange} />
                                                {file && imgPreview ? (
                                                    <div className="space-y-2">
                                                        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mx-auto">
                                                            <CheckCircle2 className="w-6 h-6 text-blue-600" />
                                                        </div>
                                                        <div className="p-4 w-full flex items-center justify-center overflow-hidden rounded-lg">
                                                            <img
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setProofPreviewOpen(true);
                                                                }}
                                                                src={imgPreview}
                                                                alt={file.name}
                                                                className="w-full h-32 border border-blue-200 rounded-lg object-cover 
                                                            cursor-zoom-in hover:scale-105 transition-transform duration-300" />
                                                        </div>
                                                        <p className="text-xs text-muted-foreground">{file.name}</p>
                                                    </div>
                                                ) : currentTask.currentStatus === "COLLECTED" ? (
                                                    <div className="space-y-3" >
                                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto">
                                                            <Check className="w-6 h-6 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">Photo uploaded</p>
                                                            <p className="text-xs text-muted-foreground">Task is completed</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-3" >

                                                        <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
                                                            <Camera className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold">Upload Photo</p>
                                                            <p className="text-xs text-muted-foreground">Required to complete task</p>
                                                        </div>
                                                        <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg border-blue-200">
                                                            <Upload className="w-3 h-3 mr-2 text-blue-600" />
                                                            Take Photo
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>

                                            {file && imgPreview && (
                                                <ImageDetail
                                                    imgUrl={imgPreview}
                                                    file={file}
                                                    open={isProofPreviewOpen}
                                                    onClose={() => setProofPreviewOpen(false)}
                                                />
                                            )}

                                            <ImageDetail
                                                imgUrl={currentTask.photoUrl}
                                                open={isTaskPreviewOpen}
                                                onClose={() => setTaskPreviewOpen(false)}
                                            />

                                            <Button
                                                className="w-full h-12 rounded-xl shadow-lg bg-blue-600 hover:bg-blue-700 shadow-blue-500/20 text-white font-bold disabled:opacity-50"
                                                disabled={!file || isCompleted || isSubmitting}
                                                onClick={handleCompleteTask}
                                            >
                                                {(isCompleted || currentTask.currentStatus === "COLLECTED") && (
                                                    <>
                                                        <CheckCircle2 className="w-5 h-5 mr-2" />
                                                        Collection Completed
                                                    </>
                                                )}

                                                {isSubmitting && (
                                                    <>
                                                        <Loader2 className="w-5 h-5 animate-spin" />
                                                        Submitting...
                                                    </>
                                                )}

                                                {!isCompleted && !isSubmitting && currentTask.currentStatus !== "COLLECTED" && (
                                                    <>Complete task</>
                                                )}
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </Card>

                            <Card className="p-4 border-none hover:border-blue-400 hover:bg-blue-50 bg-muted/30 cursor-pointer">
                                <div className="flex items-center justify-between text-[11px] text-muted-foreground uppercase font-bold tracking-widest">
                                    <span>Next Stop</span>
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
