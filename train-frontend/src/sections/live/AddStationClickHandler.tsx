"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { LatLngExpression } from "leaflet";
import { useMapEvent, Marker, Popup } from "react-leaflet";
import { useState } from "react";


type Props = {
  onSave: (data: { name: string; position: LatLngExpression }) => void;
  onCancel?: () => void;
};

export default function AddStationClickHandler({ onSave, onCancel }: Props) {
const [stationPos, setStationPos] = useState<LatLngExpression | null>(null);
  const [stationName, setStationName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  useMapEvent("click", (e) => {
    setStationPos([e.latlng.lat, e.latlng.lng]);
    setDialogOpen(true);
  });

  const handleSave = () => {
    if (!stationName || !stationPos) return;

    onSave({ name: stationName, position: stationPos });

    // Reset internal state
    // setStationPos(null);
    // setStationName("");
    setDialogOpen(false);
  };

  const handleCancel = () => {
    setStationPos(null);
    setStationName("");
    setDialogOpen(false);
    onCancel?.();
  };

  return (
    <>
      {stationPos && (
        <Marker position={stationPos}>
          <Popup>{stationName || "New Station"}</Popup>
        </Marker>
      )}

      <Dialog open={dialogOpen} onClose={handleCancel}>
        <DialogTitle>Add Train Station</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Station Name"
            fullWidth
            variant="outlined"
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleSave} disabled={!stationName}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
