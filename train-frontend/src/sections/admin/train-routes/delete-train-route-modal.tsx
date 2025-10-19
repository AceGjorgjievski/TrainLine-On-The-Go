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
  const tAdminTrains = useTranslations("AdminPage");

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
      <DialogTitle>
        {tAdminTrains("view-all-train-routes.delete-train-route.title")}
      </DialogTitle>
      <DialogContent>
        {tAdminTrains("view-all-train-routes.delete-train-route.title-description")} {" "}
        <strong>{trainRoute?.name}</strong>?
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          {tAdminTrains("view-all-train-routes.delete-train-route.cancel-button")}
        </Button>
        <Button onClick={onDelete} variant="contained" color="error">
          {tAdminTrains("view-all-train-routes.delete-train-route.delete-button")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
