import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
    center:  LatLngExpression;
    zoom: number;
}

export default function RecenterMap({ center, zoom }: Props) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);

  return null;
}
