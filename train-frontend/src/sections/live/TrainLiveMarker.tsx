import { LiveTrainProgress } from "@/types";
import { Box, Typography } from "@mui/material";
import { Icon } from "leaflet";
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
                  <strong>Route Name:</strong> {train.routeName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Previous Station:</strong> {train.lastStationName}
                </Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}>
                  <strong>Next Station:</strong> {train.nextStationName}
                </Typography>
                <Typography variant="body2" color="green">
                  <strong>Status:</strong> ON TIME
                </Typography>
              </Box>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
}
