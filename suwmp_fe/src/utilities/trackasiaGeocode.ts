const TRACKASIA_GEOCODE_BASE =
  "https://sg-maps.track-asia.com/api/v2/geocode/json";

// Configure via .env: VITE_TRACKASIA_KEY=...
const TRACKASIA_API_KEY = import.meta.env.VITE_TRACKASIA_KEY ?? "public_key";

type TrackAsiaGeocodeResponse = {
  status?: string;
  results?: Array<{
    formatted_address?: string;
    name?: string;
    sublabel?: string;
  }>;
  error_message?: string;
};

export async function reverseGeocode(
  lat: number,
  lng: number,
  radiusMeters: number = 200,
): Promise<string | null> {
  try {
    const url = `${TRACKASIA_GEOCODE_BASE}?latlng=${lat},${lng}&radius=${radiusMeters}&key=${TRACKASIA_API_KEY}`;
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = (await res.json()) as TrackAsiaGeocodeResponse;
    if (data.status !== "OK" || !data.results?.length) return null;

    return (
      data.results[0].formatted_address ||
      data.results[0].name ||
      data.results[0].sublabel ||
      null
    );
  } catch {
    return null;
  }
}

