import { editTrainRoute } from "@/services";
import { TrainRouteDTO, EditTrainRoutePayload, TrainStop } from "@/types";
import {
  Modal,
  Box,
  TextField,
  Button,
  Backdrop,
  Fade,
  Typography,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  Container,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  route: TrainRouteDTO;
  onSave: (updated: TrainRouteDTO) => void;
  trainStops: TrainStop[];
}

export function EditTrainRouteModal({
  open,
  onClose,
  route,
  onSave,
  trainStops,
}: Props) {
  const formDataRef = useRef({
    name: "",
    centerLatitude: 0,
    centerLongitude: 0,
    zoomLevel: 10,
    totalRouteTime: 0,
    routeDistance: 0,
    isWorking: false,
    stationStops: [] as number[],
  });
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (open) {
      formDataRef.current = {
        name: route.name,
        centerLatitude: route.centerLatitude,
        centerLongitude: route.centerLongitude,
        zoomLevel: route.zoomLevel,
        totalRouteTime: route.totalRouteTime,
        routeDistance: route.routeDistance,
        isWorking: route.working,
        stationStops: route.stationStops.map((stop) => stop.trainStop.id),
      };
      forceUpdate((n) => n + 1);
    }
  }, [route, open]);

  const handleSubmit = async () => {
    try {
      const payload: EditTrainRoutePayload = {
        ...formDataRef.current
      };

      const updatedRoute = await editTrainRoute(route.id, payload);
      toast.success("Updated successfully!");
      onSave(updatedRoute);
      onClose();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{ backdrop: { timeout: 300 } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 600,
            maxHeight: "90vh",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius: 2,
            p: 4,
          }}
        >
          <Container
            sx={{
              width: 500,
              maxHeight: 600,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" gutterBottom textAlign="center">
              Edit Train Route
            </Typography>

            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              <TextField
                label="Route Name"
                defaultValue={formDataRef.current.name}
                onChange={(e) => (formDataRef.current.name = e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Latitude"
                type="number"
                defaultValue={formDataRef.current.centerLatitude}
                onChange={(e) =>
                  (formDataRef.current.centerLatitude = parseFloat(
                    e.target.value
                  ))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Longitude"
                type="number"
                defaultValue={formDataRef.current.centerLongitude}
                onChange={(e) =>
                  (formDataRef.current.centerLongitude = parseFloat(
                    e.target.value
                  ))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Zoom Level"
                type="number"
                defaultValue={formDataRef.current.zoomLevel}
                onChange={(e) =>
                  (formDataRef.current.zoomLevel = parseInt(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Total Route Time (minutes)"
                type="number"
                defaultValue={formDataRef.current.totalRouteTime}
                onChange={(e) =>
                  (formDataRef.current.totalRouteTime = parseFloat(
                    e.target.value
                  ))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                label="Route Distance (km)"
                type="number"
                defaultValue={formDataRef.current.routeDistance}
                onChange={(e) =>
                  (formDataRef.current.routeDistance = parseFloat(
                    e.target.value
                  ))
                }
                fullWidth
                margin="normal"
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel id="stationStops-label">Train Stops</InputLabel>
                <Select
                  labelId="stationStops-label"
                  multiple
                  value={formDataRef.current.stationStops}
                  onChange={(e) => {
                    formDataRef.current.stationStops = e.target
                      .value as number[];
                    forceUpdate((n) => n + 1);
                  }}
                  input={<OutlinedInput label="Train Stops" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((id) => {
                        const stop = trainStops.find((s) => s.id === id);
                        return (
                          <Chip key={id} label={stop?.name || id} />
                        );
                      })}
                    </Box>
                  )}
                >
                  {trainStops.map((stop) => (
                    <MenuItem
                      key={stop.id}
                      value={stop.id}
                      sx={{
                        "&.Mui-selected": {
                          backgroundColor: "#1976d2",
                          color: "white",
                        },
                        "&.Mui-selected:hover": {
                          backgroundColor: "#1565c0",
                        },
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          alignItems: "center",
                        }}
                      >
                        {stop?.name}
                        {formDataRef.current.stationStops.includes(stop.id) && (
                          <Chip
                            label={
                              formDataRef.current.stationStops.indexOf(
                                stop.id
                              ) + 1
                            }
                            size="small"
                            color="primary"
                            sx={{ fontWeight: "bold", ml: 1 }}
                          />
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" required>
                <Typography variant="subtitle1" gutterBottom>
                  Is Working?
                </Typography>
                <Box display="flex" gap={2}>
                  <Button
                    variant={
                      formDataRef.current.isWorking ? "contained" : "outlined"
                    }
                    color="success"
                    onClick={() => {
                      formDataRef.current.isWorking = true;
                      forceUpdate((n) => n + 1);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    variant={
                      !formDataRef.current.isWorking ? "contained" : "outlined"
                    }
                    color="error"
                    onClick={() => {
                      formDataRef.current.isWorking = false;
                      forceUpdate((n) => n + 1);
                    }}
                  >
                    No
                  </Button>
                </Box>
              </FormControl>
            </Box>

            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  !formDataRef.current.name ||
                  isNaN(formDataRef.current.centerLatitude) ||
                  isNaN(formDataRef.current.centerLongitude) ||
                  isNaN(formDataRef.current.zoomLevel) ||
                  isNaN(formDataRef.current.totalRouteTime) ||
                  isNaN(formDataRef.current.routeDistance) ||
                  formDataRef.current.stationStops.length === 0
                }
              >
                Save
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
}
