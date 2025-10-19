import { LiveTrainProgress } from "@/types";
import { Box, Typography } from "@mui/material";
import { Icon } from "leaflet";
import { useTranslations } from "next-intl";
import { Marker, Popup } from "react-leaflet";

type Props = {
  liveTrainProgress: LiveTrainProgress[];
};

export default function TrainLiveMarker({ liveTrainProgress }: Props) {
  const trainIcon = new Icon({
    iconUrl: "/train.svg",
    iconSize: [35, 35],
    iconAnchor: [18, 35],
    popupAnchor: [0, -35],
  });
  const tLiveLiveMaerker = useTranslations("Live.live-marker");
  const tLiveStations = useTranslations("Timetable.stations");


  return (
    <>
      {liveTrainProgress.map((train) => {
        const coord = train.segment[train.currentIndex];
        if (!coord) return null;

        return (
          <Marker
            key={train.trainId}
            position={[coord.lat, coord.lng]}
            icon={trainIcon}
          >
            <Popup>
              <Box sx={{ minWidth: 200 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: "bold", mb: 1 }}
                >
                  🚆 {train.trainName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMaerker("route-name")}: </strong> {train.routeName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMaerker("previous-station")}: </strong>
                  {tLiveStations(train!.lastStationName || '')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMaerker("next-station")}: </strong>
                  {tLiveStations(train!.nextStationName || '')}
                </Typography>
                <Typography variant="body2" color="green">
                  <strong>{tLiveLiveMaerker("status")}:</strong> {tLiveLiveMaerker("on-time")}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
