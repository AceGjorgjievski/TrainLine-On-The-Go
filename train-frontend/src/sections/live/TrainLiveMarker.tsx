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
  const tLiveLiveMarker = useTranslations("Live.live-marker");
  const tLiveStations = useTranslations("Timetable.stations");
  const tTrainRoutes = useTranslations("Timetable");
  const tAdminPage = useTranslations("AdminPage");


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
                  🚆
                  {tAdminPage("table." + train.trainName.split(" ")[0].toLocaleLowerCase()) + " " + train.trainName.split(" ")[1]}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMarker("route-name")}: </strong> 
                  {tTrainRoutes("routes." + train.routeName.toLowerCase().replace(/\s+/g, "").replace("-", "-"))}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMarker("previous-station")}: </strong>
                  {tLiveStations(train!.lastStationName || '')}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>{tLiveLiveMarker("next-station")}: </strong>
                  {tLiveStations(train!.nextStationName || '')}
                </Typography>
                <Typography variant="body2" color="green">
                  <strong>{tLiveLiveMarker("status")}:</strong> {tLiveLiveMarker("on-time")}
                </Typography>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
