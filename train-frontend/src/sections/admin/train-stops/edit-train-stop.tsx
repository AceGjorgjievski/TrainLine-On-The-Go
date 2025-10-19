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
import { useState, useEffect } from "react";

import { editTrainStop } from "@/services";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  trainStop: TrainStop;
  onSave: (newTrainStop: {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
  }) => void;
}

export default function EditTrainStopModal({
  open,
  onClose,
  trainStop,
  onSave,
}: Props) {
  const [formData, setFormData] = useState({
    id: 0,
    name: "",
    latitude: 0,
    longitude: 0,
  });
  const tToaster = useTranslations("Toaster");


  useEffect(() => {
    if (open && trainStop) {
      setFormData({
        id: trainStop.id,
        name: trainStop.name,
        latitude: trainStop.latitude,
        longitude: trainStop.longitude,
      });
    }
  }, [trainStop, open]);

  const handleSubmit = async () => {
    try {
      const updatedTrainStop = await editTrainStop(formData);

      toast.success(tToaster("update"));
      onSave(updatedTrainStop);
      onClose();
    } catch (error) {
      console.error("Failed to edit train stop:", error);
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
                defaultValue={formData.name}
                onChange={(e) => (formData.name = e.target.value)}
                fullWidth
                margin="normal"
              />
              <TextField
                required
                label="Latitude"
                type="number"
                defaultValue={formData.longitude}
                onChange={(e) =>
                  (formData.longitude = parseFloat(e.target.value))
                }
                fullWidth
                margin="normal"
              />
              <TextField
                required
                label="Latitude"
                type="number"
                defaultValue={formData.latitude}
                onChange={(e) =>
                  (formData.latitude = parseFloat(e.target.value))
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
                Save
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
}
