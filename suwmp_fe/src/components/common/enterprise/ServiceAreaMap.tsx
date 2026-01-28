import { useEffect, useMemo, useRef } from "react";
import trackasiagl from "trackasia-gl";
import "trackasia-gl/dist/trackasia-gl.css";

import type { ServiceArea } from "@/types/serviceArea";
import { circlePolygon } from "@/utilities/geoCircle";

type Props = {
  areas: ServiceArea[];
  onMapClick?: (lng: number, lat: number) => void;
};

const TRACKASIA_STYLE =
  "https://maps.track-asia.com/styles/v2/streets.json?key=public_key";

export default function ServiceAreaMap({ areas, onMapClick }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<trackasiagl.Map | null>(null);

  const geojson = useMemo(() => {
    return {
      type: "FeatureCollection" as const,
      features: areas.map((a) => ({
        ...circlePolygon([a.longitude, a.latitude], a.radius),
        properties: { id: a.id },
      })),
    };
  }, [areas]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = new trackasiagl.Map({
      container: containerRef.current,
      style: TRACKASIA_STYLE,
      center: { lat: 10.769034, lng: 106.694945 },
      zoom: 9,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("service-areas", {
        type: "geojson",
        data: geojson as any,
      });

      map.addLayer({
        id: "service-areas-fill",
        type: "fill",
        source: "service-areas",
        paint: {
          "fill-color": "#f59e0b",
          "fill-opacity": 0.25,
        },
      });

      map.addLayer({
        id: "service-areas-outline",
        type: "line",
        source: "service-areas",
        paint: {
          "line-color": "#e17100",
          "line-width": 2,
        },
      });
    });

    map.on("click", (e: any) => {
      onMapClick?.(e.lngLat.lng, e.lngLat.lat);
    });

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [geojson, onMapClick]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const source = map.getSource("service-areas") as any;
    if (source?.setData) {
      source.setData(geojson as any);
    }
  }, [geojson]);

  return <div ref={containerRef} className="h-full w-full" />;
}

