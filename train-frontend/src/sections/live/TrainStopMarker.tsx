import { TrainRouteDTO, TrainRouteStop, TrainStop } from "@/types";
import { Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import { Marker, Popup } from "react-leaflet";

type Props = {
  routeData: TrainRouteDTO | null;
};

export default function TrainStopMarker({ routeData }: Props) {
  const tLiveStopMarker = useTranslations("Live.stop-marker");
  const tLiveStations = useTranslations("Timetable.stations");

  return (
    <>
      {routeData?.stationStops?.map(
        (stopWrapper: TrainRouteStop, idx: number) => {
          const stop: TrainStop = stopWrapper.trainStop;
          return (
            <Marker
              key={`station-marker-${idx}`}
              position={[stop.latitude, stop.longitude]}
            >
              <Popup>
                <div style={{ minWidth: "200px" }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    gutterBottom
                  >
                    🚉 {tLiveStopMarker("station")}: {tLiveStations(stop.name)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{tLiveStopMarker("station-number")}:</strong>{" "}
                    {stopWrapper.stationSequenceNumber}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{tLiveStopMarker("latitude")}:</strong> {stop.latitude.toFixed(6)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>{tLiveStopMarker("longitude")}:</strong> {stop.longitude.toFixed(6)}
                  </Typography>
                </div>
              </Popup>
            </Marker>
          );
        }
      )}
    </>
  );
}
