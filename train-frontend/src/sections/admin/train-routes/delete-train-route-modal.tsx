import { deleteTrainRoute } from "@/services";
import { TrainRouteDTO } from "@/types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (id: number) => void;
  trainRoute: TrainRouteDTO | null;
}

export function DeleteTrainRouteModal({
  open,
  onClose,
  onConfirm,
  trainRoute,
}: Props) {
  const id = trainRoute?.id;
  const tToaster = useTranslations("Toaster");

  const onDelete = async () => {
    try {
      await deleteTrainRoute(id!);
      toast.success(tToaster("delete"));
      onConfirm(id!);
      onClose();
    } catch (error) {
      console.error("Delete train route failed", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete route{" "}
        <strong>{trainRoute?.name}</strong>?
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
