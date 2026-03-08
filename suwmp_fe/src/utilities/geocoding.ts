import polyline from "@mapbox/polyline"

export const getUserLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
                enableHighAccuracy: true,
                timeout: 10000
            });
        } else {
            reject(new Error("Geolocation is not supported by this browser."));
        }
    });
}

const apiKey = import.meta.env.VITE_MAPS_API_KEY ?? import.meta.env.VITE_TRACKASIA_KEY ?? "public_key";

// Autocomplete address suggestions
export interface AddressSuggestion {
    formatted_address: string;
    name?: string;
    sublabel?: string;
    place_id?: string;
    geometry?: {
        location: {
            lat: number;
            lng: number;
        };
    };
}

export const autocompleteAddress = async (
    input: string,
    size: number = 5
): Promise<AddressSuggestion[]> => {
    if (!input.trim()) {
        return [];
    }

    try {
        const url = `https://sg-maps.track-asia.com/api/v2/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}&size=${size}`;
        const res = await fetch(url);

        if (!res.ok) {
            throw new Error("Autocomplete request failed");
        }

        const data = await res.json();

        if (data.status !== "OK" || !data.results) {
            return [];
        }

        return data.results.map((result: any) => ({
            formatted_address: result.formatted_address || result.name || result.sublabel || "",
            name: result.name,
            sublabel: result.sublabel,
            place_id: result.place_id,
            geometry: result.geometry,
        }));
    } catch (error) {
        console.error("Autocomplete error:", error);
        return [];
    }
};

// return longtitude and latitude from a given address
export const forwardGeocode = async (
    address: string
): Promise<{ longitude: number; latitude: number }> => {
    const url = `https://maps.track-asia.com/api/v2/place/textsearch/json?language=vi&key=${apiKey}&query=${encodeURIComponent(address)}&new_admin=true&include_old_admin=true`;
    const res = await fetch(url);


    if (!res.ok) {
        throw new Error("Geocoding request failed");
    }

    const data = await res.json();

    if (!data || data.status !== "OK" || !data.results || data.results.length === 0) {
        throw new Error("No geocoding result");
    }

    const location = data.results[0].geometry?.location;
    if (!location) {
        throw new Error("No location data in geocoding result");
    }

    return {
        longitude: Number(location.lng),
        latitude: Number(location.lat),
    };
};

// reverse geocoding: return address from longtitude and latitude
export const reverseGeocode = async (longitude: number, latitude: number): Promise<string> => {
    const response = await fetch(`https://maps.track-asia.com/api/v2/geocode/json?result_type=street_address&latlng=${latitude}%2C${longitude}&key=${apiKey}&size=5&radius=100&new_admin=true`);
    const data = await response.json();

    if (!data || data.results.length === 0) {
        throw new Error("No reverse geocoding result");
    }

    return data.results[0].formatted_address || "Unknown location";
}


// return coordinates from origin and destination [longitude, latitude]
export const getCoordinates = async (origin: [number, number], destination: [number, number]) => {
    try {
        const response = await fetch(`https://maps.track-asia.com/route/v1/car/${origin[0]},${origin[1]};${destination[0]},${destination[1]}.json?geometries=polyline&steps=true&overview=full&key=${apiKey}`)
        if (!response.ok) {
            throw new Error("Route request failed");
        }
        
        const data = await response.json()
        const geometry = data.routes[0].geometry
        const coordinates = polyline.decode(geometry).map(([lat, lng]) => [
            lng,
            lat
        ])

        return coordinates
    } catch (error) {
        console.log(error)
    }
}