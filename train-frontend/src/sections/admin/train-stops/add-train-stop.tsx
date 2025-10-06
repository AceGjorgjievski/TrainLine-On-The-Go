import { addTrainStop } from "@/services";
import { TrainStop } from "@/types";
import {
  Modal,
  Box,
  TextField,
  Backdrop,
  Fade,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (newTrainStop: TrainStop) => void;
}

export function AddTrainStopModal({ open, onClose, onSave }: Props) {
  const [formData, setFormData] = useState({
    name: "",
    latitude: 0,
    longitude: 0,
  });

  const handleSubmit = async () => {
    try {
      const newTrainStop = await addTrainStop(formData);
      onSave(newTrainStop);
      onClose();
    } catch (err) {
      console.error("Add route failed", err);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 300,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute" as const,
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
              Add New Train Stop
            </Typography>
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              <TextField
                required
                label="Train Stop Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                margin="normal"
              />

              <TextField
                required
                label="Longitude"
                type="number"
                value={formData.longitude}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    longitude: parseFloat(e.target.value),
                  }))
                }
                fullWidth
                margin="normal"
              />

              <TextField
                required
                label="Latitude"
                type="number"
                value={formData.latitude}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    latitude: parseFloat(e.target.value),
                  }))
                }
                fullWidth
                margin="normal"
              />
            </Box>
            <Box mt={3} display="flex" justifyContent="space-between">
              <Button variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={
                  !formData.name ||
                  formData.name.trim().length === 0 || 
                  isNaN(formData.latitude) ||
                  formData.longitude === 0 ||
                  isNaN(formData.longitude) ||
                  formData.latitude === 0
                }
              >
                Add
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
}
