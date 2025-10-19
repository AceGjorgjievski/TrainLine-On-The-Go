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
import { useTranslations } from "next-intl";
import { useState } from "react";
import toast from "react-hot-toast";

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
  const tAdminTrains = useTranslations("AdminPage");
  const tToaster = useTranslations("Toaster");

  const handleSubmit = async () => {
    try {
      const newTrainStop = await addTrainStop(formData);
      toast.success(tToaster("add"));
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
              {tAdminTrains("view-all-train-stops.add-train-stop.title")}
            </Typography>
            <Box sx={{ flex: 1, overflowY: "auto", pr: 1 }}>
              <TextField
                required
                label={tAdminTrains("view-all-train-stops.add-train-stop.train-stop-name")}
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                fullWidth
                margin="normal"
              />

              <TextField
                required
                label={tAdminTrains("view-all-train-stops.add-train-stop.longitude")}
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
                label={tAdminTrains("view-all-train-stops.add-train-stop.latitude")}
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
                {tAdminTrains("view-all-train-stops.add-train-stop.cancel-button")}
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
                {tAdminTrains("view-all-train-stops.add-train-stop.add-button")}
              </Button>
            </Box>
          </Container>
        </Box>
      </Fade>
    </Modal>
  );
}
