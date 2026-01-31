import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { motion, AnimatePresence } from 'framer-motion'
import { useDebounce } from '@/hooks/useDebouse'
import { forwardGeocode, getUserLocation, reverseGeocode } from '@/utilities/geocoding'
import { ArrowLeft, ArrowRight, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import trackasiagl, { Marker } from 'trackasia-gl'
import 'trackasia-gl/dist/trackasia-gl.css'

interface LocationDetailProps {
    handleNextStep: () => void
    handlePreviousStep: () => void
    location: number[]
    setLocation: (location: number[]) => void
    notes: string
    setNotes: (note: string) => void
}

const apiKey = import.meta.env.VITE_MAPS_API_KEY

export default function LocationDetail({
    handleNextStep,
    handlePreviousStep,
    location,
    setLocation,
    notes,
    setNotes
}: LocationDetailProps) {

    const mapContainerRef = useRef<HTMLDivElement | null>(null)
    const mapRef = useRef<trackasiagl.Map | null>(null)
    const markerRef = useRef<Marker | null>(null)

    const [displayAddress, setDisplayAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const debouncedAddress = useDebounce(displayAddress, 600)

    /* ----------------------------- Map Init ----------------------------- */
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return

        mapRef.current = new trackasiagl.Map({
            container: mapContainerRef.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${apiKey}`,
            center: [106.694945, 10.769034],
            zoom: 8
        })

        return () => {
            mapRef.current?.remove()
            mapRef.current = null
            markerRef.current = null
        }
    }, [])

    /* ----------------------- Forward Geocoding -------------------------- */
    useEffect(() => {
        if (!debouncedAddress || !mapRef.current) return

        let cancelled = false

        const run = async () => {
            try {
                setIsLoading(true)
                const { longitude, latitude } = await forwardGeocode(debouncedAddress)
                if (cancelled) return

                updateMap(longitude, latitude)
                setLocation([longitude, latitude])
            } catch (err) {
                console.error('Forward geocoding failed:', err)
            } finally {
                setIsLoading(false)
            }
        }

        run()
        return () => { cancelled = true }
    }, [debouncedAddress])

    /* ----------------- Restore Address From Location -------------------- */
    useEffect(() => {
        if (location.length !== 2 || displayAddress) return

        let cancelled = false

        const syncAddress = async () => {
            try {
                setIsLoading(true)
                const address = await reverseGeocode(location[0], location[1])
                if (!cancelled) setDisplayAddress(address)
            } catch (err) {
                console.error('Reverse geocoding failed:', err)
            } finally {
                setIsLoading(false)
            }
        }

        syncAddress()
        return () => { cancelled = true }
    }, [location])

    /* ---------------------- Restore Map Marker --------------------------- */
    useEffect(() => {
        if (!mapRef.current || location.length !== 2) return
        updateMap(location[0], location[1])
    }, [location])

    /* --------------------------- Helpers -------------------------------- */
    const updateMap = (lng: number, lat: number) => {
        if (!mapRef.current) return

        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 16,
            essential: true
        })

        if (!markerRef.current) {
            markerRef.current = new Marker()
        }

        markerRef.current.setLngLat([lng, lat]).addTo(mapRef.current)
    }

    const useCurrentLocation = async () => {
        if (!mapRef.current) return

        try {
            setIsLoading(true)
            const { coords } = await getUserLocation()
            const { longitude, latitude } = coords

            updateMap(longitude, latitude)
            setLocation([longitude, latitude])

            const address = await reverseGeocode(longitude, latitude)
            setDisplayAddress(address)
        } catch (err) {
            console.error('Get current location failed:', err)
        } finally {
            setIsLoading(false)
        }
    }

    /* ----------------------------- UI ----------------------------------- */
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-8 max-w-3xl mx-auto shadow-lg">

                <header className="text-center mb-2">
                    <h2 className="text-2xl font-bold">Collection Location</h2>
                    <p className="text-muted-foreground">
                        Confirm the pickup location for waste collection
                    </p>
                </header>

                <div className="space-y-6">

                    <div>
                        <Label className='pb-2'>Address</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                            <Input
                                value={displayAddress}
                                onChange={e => setDisplayAddress(e.target.value)}
                                disabled={isLoading}
                                placeholder="Enter pickup address"
                                className="pl-11"
                            />
                        </div>
                    </div>

                    <Button variant="outline" onClick={useCurrentLocation} className='w-full'>
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.span key="loading" className="flex gap-2 items-center">
                                    <LoaderCircle className="animate-spin" />
                                    Processing…
                                </motion.span>
                            ) : (
                                <motion.span key="idle" className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Use Current Location
                                </motion.span>
                            )}
                        </AnimatePresence>
                    </Button>

                    <div className="h-64 rounded-xl overflow-hidden border">
                        <div ref={mapContainerRef} className="w-full h-full" />
                    </div>

                    <div>
                        <Label className='pb-2'>Additional Notes</Label>
                        <Textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="Any special instructions…"
                        />
                    </div>
                </div>

                <footer className="flex justify-between mt-8">
                    <Button variant="outline" onClick={handlePreviousStep}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                    </Button>

                    <Button onClick={handleNextStep} disabled={location.length !== 2}>
                        Next Step
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                </footer>
            </Card>
        </motion.div>
    )
}