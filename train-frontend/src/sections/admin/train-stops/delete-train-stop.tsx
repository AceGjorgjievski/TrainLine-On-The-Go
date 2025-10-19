"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";
import { TrainStop } from "@/types";
import { deleteTrainStop } from "@/services";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  stop: TrainStop | null;
}

export default function DeleteTrainStopDialog({
  open,
  onClose,
  onConfirm,
  stop,
}: Props) {
  const name = stop?.name;
  const id = stop?.id;
  const tToaster = useTranslations("Toaster");
  const tAdminTrains = useTranslations("AdminPage");

  const onDelete = async () => {
    try {
      await deleteTrainStop(id!);
      toast.success(tToaster("delete"));
      onConfirm(id!);
      onClose();
    } catch (error) {
      console.error("Delete train stop failed", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {tAdminTrains("view-all-train-stops.delete-train-stop.title")}
      </DialogTitle>
      <DialogContent>
        {tAdminTrains("view-all-train-stops.delete-train-stop.title-description")} {" "}
        <Typography component="span" fontWeight="bold">
          {name}
        </Typography>
        ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {tAdminTrains("view-all-train-stops.delete-train-stop.cancel-button")}
        </Button>
        <Button onClick={onDelete} variant="contained" color="error">
          {tAdminTrains("view-all-train-stops.delete-train-stop.delete-button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
