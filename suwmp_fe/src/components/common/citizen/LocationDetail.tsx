import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useDebounce } from '@/hooks/useDebouse'
import { forwardGeocode, getUserLocation, reverseGeocode } from '@/utilities/geocoding'
import { ArrowLeft, ArrowRight, LoaderCircle, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import trackasiagl, { Marker } from 'trackasia-gl';
import 'trackasia-gl/dist/trackasia-gl.css';


interface WasteClassificationProps {
    handleNextStep: () => void,
    handlePreviousStep: () => void,
    location: number[],
    setLocation: (location: number[]) => void,
    notes: string,
    setNotes: (note: string) => void
}

const apiKey = import.meta.env.VITE_MAPS_API_KEY;

function LocationDetail({
    handleNextStep,
    handlePreviousStep,
    location,
    setLocation,
    notes,
    setNotes
}: WasteClassificationProps) {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<trackasiagl.Map | null>(null);
    const markerRef = useRef<Marker | null>(null);

    const [displayAddress, setDisplayAddress] = useState("");
    const [isReversing, setIsReversing] = useState(false);

    const debouncedAddress = useDebounce(displayAddress, 600);

    /* Initialize map */
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        mapRef.current = new trackasiagl.Map({
            container: mapContainerRef.current,
            style: `https://maps.track-asia.com/styles/v2/streets.json?key=${apiKey}`,
            center: { "lat": 10.769034, "lng": 106.694945 }, 
            zoom: 8
        });

        return () => {
            mapRef.current?.remove();
            mapRef.current = null;
            markerRef.current = null;
        };
    }, []);

    /* Debounced forward geocoding */
    useEffect(() => {
        if (!debouncedAddress || !mapRef.current) return;

        let cancelled = false;

        const geocode = async () => {
            try {
                setIsReversing(true)
                const { longitude, latitude } = await forwardGeocode(debouncedAddress);
                if (cancelled) return;

                mapRef.current!.flyTo({
                    center: [longitude, latitude],
                    zoom: 14,
                    essential: true,
                });

                if (!markerRef.current) {
                    markerRef.current = new Marker();
                }

                markerRef.current.setLngLat([longitude, latitude]).addTo(mapRef.current!);
                setLocation([longitude, latitude]);
            } catch (error) {
                console.error("Forward geocoding failed:", error);
            } finally {
                setIsReversing(false)
            }
        };

        geocode();

        return () => {
            cancelled = true;
        };
    }, [debouncedAddress]);

    /* Get user's current location */
    const getCurrentLocation = async () => {
        if (!mapRef.current) return;

        try {
            setIsReversing(true);

            const res = await getUserLocation();
            const { latitude, longitude } = res.coords;

            mapRef.current.flyTo({
                center: [longitude, latitude],
                zoom: 14,
                essential: true,
            });

            if (!markerRef.current) {
                markerRef.current = new Marker();
            }

            markerRef.current.setLngLat([longitude, latitude]).addTo(mapRef.current);

            setLocation([longitude, latitude]);
            setDisplayAddress(await reverseGeocode(longitude, latitude));
        } catch (error) {
            console.error("Error getting current location:", error);
        } finally {
            setIsReversing(false);
        }
    };

    return (
        <Card className="p-8 animate-fade-up shadow-lg max-w-3xl mx-auto">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                    Collection Location
                </h2>
                <p className="text-muted-foreground">
                    Confirm the pickup location for waste collection
                </p>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="location">Address</Label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-2 w-5 h-5 text-muted-foreground" />
                        <Input
                            id="location"
                            placeholder="Enter pickup address"
                            className="pl-11 rounded-lg"
                            value={displayAddress}
                            onChange={e => setDisplayAddress(e.target.value)}
                            data-testid="input-location"
                            disabled={isReversing}
                        />
                    </div>
                </div>

                <Button variant="outline" className="w-full" data-testid="button-current-location"
                    onClick={getCurrentLocation}>
                    {isReversing ? (
                        <div className="flex gap-2 items-center">
                            <LoaderCircle className='animate-spin' />
                            Processing…
                        </div>
                    ) : (
                        <>
                            <MapPin className="w-4 h-4 mr-2" />
                            Use Current Location
                        </>)}
                </Button>

                <div className="h-65 rounded-xl bg-muted flex items-center justify-center border-3 border-border">
                    <div ref={mapContainerRef} className='w-full h-full rounded-lg'></div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                        id="notes"
                        placeholder="Any special instructions for the collector..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        data-testid="input-notes"
                        className='shadow-sm rounded-lg min-h-[80px]'
                    />
                </div>
            </div>


            <div className="flex justify-between mt-8">
                <Button variant="outline"
                    className='rounded-lg w-25'
                    onClick={handlePreviousStep} data-testid="button-back">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button
                    className='rounded-lg w-35'
                    onClick={handleNextStep}
                    disabled={location.length === 0} data-testid="button-next">
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </Card>
    )
}

export default LocationDetail
