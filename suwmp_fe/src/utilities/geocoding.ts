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

const apiKey = import.meta.env.VITE_MAPS_API_KEY;

// return longtitude and latitude from a given address
export const forwardGeocode = async (
    address: string
): Promise<{ longitude: number; latitude: number }> => {
    const res = await fetch(
        `https://maps.track-asia.com/api/v2/place/textsearch/json?language=vi&key=${apiKey}&query=${encodeURIComponent(address)}&new_admin=true`
    );
    const data = await res.json();

    if (!data || data.results.length === 0) {
        throw new Error("No geocoding result");
    }

    return {
        longitude: Number(data.results[0].geometry.location.lng),
        latitude: Number(data.results[0].geometry.location.lat),
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