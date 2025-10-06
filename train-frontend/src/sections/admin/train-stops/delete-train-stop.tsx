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

  const onDelete = async () => {
    try {
      await deleteTrainStop(id!);
      onConfirm(id!);
      onClose();
    } catch (error) {
      console.error("Delete train stop failed", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete{" "}
        <Typography component="span" fontWeight="bold">
          {name}
        </Typography>
        ?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onDelete} variant="contained" color="error">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
