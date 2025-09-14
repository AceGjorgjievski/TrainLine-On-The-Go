import { LatLngExpression } from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";

type Props = {
  center: LatLngExpression;
  zoom: number;
  onComplete?: () => void;
};

export default function RecenterMap({ center, zoom, onComplete }: Props) {
  const map = useMap();

  useEffect(() => {
    if (center && zoom) {
      map.flyTo(center, zoom, { duration: 1.5 });
      if(onComplete) onComplete();
    }
  }, [center, zoom, map]);

  return null;
}
