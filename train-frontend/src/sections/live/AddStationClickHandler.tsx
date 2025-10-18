import { Box, TextField, Button, Typography } from "@mui/material";
import { LatLngExpression } from "leaflet";
import { useMapEvent, Marker, Popup, useMap } from "react-leaflet";
import { useState } from "react";

type Props = {
  onSave: (data: { name: string; position: LatLngExpression }) => void;
  onCancel?: () => void;
};

export default function AddStationClickHandler({ onSave, onCancel }: Props) {
  const [stationPos, setStationPos] = useState<LatLngExpression | null>(null);
  const [stationName, setStationName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const map = useMap();

  useMapEvent("click", (e) => {
    if (isEditing) return;
    setStationPos([e.latlng.lat, e.latlng.lng]);
    setIsEditing(true);
  });

  const handleSave = () => {
    if (!stationName || !stationPos) return;

    onSave({ name: stationName, position: stationPos });

    setIsEditing(false);
    setStationName("");
  };

  const handleCancel = () => {
    setStationPos(null);
    setStationName("");
    setIsEditing(false);
    onCancel?.();
  };

  return (
    <>
      {stationPos && isEditing && (
        <Marker position={stationPos}>
          <Popup>{stationName || "New Station"}</Popup>
        </Marker>
      )}

      {isEditing && (
        <Box
          sx={{
            position: "absolute",
            top: `${map.latLngToContainerPoint(stationPos as [number, number]).y}px`,
            left: `${map.latLngToContainerPoint(stationPos as [number, number]).x}px`,
            background: "white",
            padding: 2,
            borderRadius: 1,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
            zIndex: 1000,
            maxWidth: "250px",
            width: "100%",
          }}
        >
          <Typography variant="body2" gutterBottom>
            Add Station Name
          </Typography>
          <TextField
            autoFocus
            label="Station Name"
            fullWidth
            variant="outlined"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            margin="dense"
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} disabled={!stationName}>
              Save
            </Button>
          </Box>
        </Box>
      )}
    </>
  );
}
