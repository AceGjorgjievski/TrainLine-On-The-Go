"use client";

import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TableContainer,
  Paper,
  TablePagination,
  Container,
  Divider,
  colors,
  Box,
  Button,
  TextField,
} from "@mui/material";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { getTrainRoutesByName } from "@/services/train-route.service";
import { TrainRouteDTO, TrainStop, TrainRouteStop } from "@/types";
import { getAllTrainStops } from "@/services";
import { DirectionSelector } from "@/shared/components";

import TrainStopTable from "./train-stop-table";
import TrainRouteStopTable from "./train-route-stop-table";
import EditTrainStopModal from "./edit-train-stop";
import DeleteTrainStopDialog from "./delete-train-stop";
import { AddTrainStopModal } from "./add-train-stop";

type SortKey = "trainStop.name" | "stationSequenceNumber";
type SortOrder = "asc" | "desc" | "";

function isTrainRouteStop(
  obj: TrainRouteStop | TrainStop
): obj is TrainRouteStop {
  return obj && typeof obj === "object" && "trainStop" in obj;
}

export default function TrainStopsAdminView() {
  const [direction, setDirection] = useState<
    "departure" | "arrival" | "all" | ""
  >("");
  const [route, setRoute] = useState("");
  const renderRoutes =
    direction === "departure" ? fromSkopjeRouteNameMap : toSkopjeRouteNameMap;

  const [trainRoute, setTrainRoute] = useState<TrainRouteDTO | null>(null);
  const [allTrainStops, setAllTrainStops] = useState<TrainStop[]>([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingTrainStop, setDeletingTrainStop] = useState<TrainStop | null>(
    null
  );

  const [editingTrainStop, setEditingTrainStop] = useState<TrainStop | null>(
    null
  );
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleDirectionChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedDirection = e.target.value as "departure" | "arrival" | "all";
    setDirection(selectedDirection);
    setRoute("");
    setTrainRoute(null);
    setPage(0);

    if (selectedDirection === "all") {
      try {
        const data = await getAllTrainStops();
        setAllTrainStops(data);
      } catch (error) {
        console.error("Failed to fetch all train stops", error);
      }
    } else {
      setAllTrainStops([]);
    }
  };

  const handleRouteChange = (e: SelectChangeEvent) => {
    setRoute(e.target.value);
    getTrainRoutesByName(e.target.value)
      .then((data) => {
        setTrainRoute(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleRequestSort = (key: SortKey) => {
    if (sortKey === key) {
      const nextOrder =
        sortOrder === "" ? "asc" : sortOrder === "asc" ? "desc" : "";
      setSortOrder(nextOrder);
      if (nextOrder === "") {
        setSortKey("");
      }
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const handleComparableValues = (
    item: TrainRouteStop | TrainStop,
    sortKey: string
  ): string | number => {
    if (sortKey === "trainStop.name") {
      return isTrainRouteStop(item) ? item.trainStop.name : item.name;
    }

    if (sortKey === "stationSequenceNumber") {
      return isTrainRouteStop(item) ? item.stationSequenceNumber : 0;
    }

    return "";
  };

  const sortedStops = trainRoute
    ? [...trainRoute.stationStops].sort((a, b) => {
        const aVal = handleComparableValues(a, sortKey);
        const bVal = handleComparableValues(b, sortKey);

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
      })
    : [];

  const filteredAllStops = allTrainStops.filter((stop) =>
    stop.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedAllStops = [...filteredAllStops].sort((a, b) => {
    const aVal = handleComparableValues(a, sortKey);
    const bVal = handleComparableValues(b, sortKey);

    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortOrder === "asc"
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return 0;
  });

  const displayedStops = direction === "all" ? sortedAllStops : sortedStops;

  const renderRoutesDropDownMenu = () => (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
        bgcolor: "#fffdfdff",
        borderRadius: 2,
        padding: 3,
        boxShadow: 10,
        width: "fit-content",
        height: "6.5rem",
        border: "2px solid",
      }}
    >
      <FormControl sx={{ mb: 3, width: "200px" }}>
        <InputLabel id="route-select-label">Choose Train Route</InputLabel>
        <Select
          labelId="route-select-label"
          id="route-select"
          value={route}
          label="Choose Train Route"
          onChange={handleRouteChange}
        >
          {Object.entries(renderRoutes).map(([key, value]) => (
            <MenuItem key={key} value={value}>
              {value}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Container>
  );

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key || sortOrder === "") return null;
    return sortOrder === "asc" ? "▲" : "▼";
  };

  return (
    <>
      <DirectionSelector
        direction={direction}
        handleDirectionChange={handleDirectionChange}
      />
      {direction === "all" && (
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: 2,
            bgcolor: "#fffdfdff",
            borderRadius: 2,
            padding: 3,
            boxShadow: 10,
            width: "fit-content",
            border: "2px solid",
          }}
        >
          <TextField
            label="Search Station"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Container>
      )}

      {direction && direction !== "all" && renderRoutesDropDownMenu()}

      {direction && trainRoute && (
        <Divider
          variant="middle"
          sx={{
            borderBottomWidth: 5,
            borderColor: colors.purple[500],
            marginY: "1rem",
          }}
        />
      )}
      {((direction && trainRoute) || direction === "all") && (
        <Container>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "1rem",
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add New Train Stop
            </Button>
          </Box>
          <TableContainer
            component={Paper}
            sx={{
              mt: 2,
              borderRadius: 4,
              boxShadow: 10,
              border: "2px solid",
            }}
          >
            {direction === "all" ? (
              <>
                <TrainStopTable
                  stops={sortedAllStops}
                  page={page}
                  rowsPerPage={rowsPerPage}
                  onEdit={(stop) => {
                    setEditingTrainStop(stop);
                    setEditModalOpen(true);
                  }}
                  onDelete={(stop) => {
                    setDeletingTrainStop(stop);
                    setDeleteModalOpen(true);
                  }}
                  handleSortRequest={handleRequestSort}
                  handleSortIcon={renderSortIcon}
                />
                <DeleteTrainStopDialog
                  open={deleteModalOpen}
                  onClose={() => {
                    setEditingTrainStop(null);
                    setDeleteModalOpen(false);
                  }}
                  onConfirm={(id: number) => {
                    setAllTrainStops((prev) =>
                      prev.filter((stop) => stop.id !== id)
                    );
                  }}
                  stop={deletingTrainStop}
                />
              </>
            ) : (
              <TrainRouteStopTable
                stops={sortedStops}
                page={page}
                rowsPerPage={rowsPerPage}
                handleSortRequest={handleRequestSort}
                handleSortIcon={renderSortIcon}
              />
            )}
          </TableContainer>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mt: 2,
              mb: 2,
            }}
          >
            <Box
              sx={{
                bgcolor: "#fffdfd",
                borderRadius: 2,
                boxShadow: 10,
                border: "2px solid",
              }}
            >
              <TablePagination
                component="div"
                count={displayedStops.length}
                page={page}
                onPageChange={(_, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </Box>
          </Box>
        </Container>
      )}
      
      {editingTrainStop && (
        <EditTrainStopModal
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          trainStop={editingTrainStop}
          onSave={(updatedTrainStop) => {
            setAllTrainStops((prev) =>
              prev.map((stop) =>
                stop.id === updatedTrainStop.id ? updatedTrainStop : stop
              )
            );
          }}
        />
      )}

      {
        <AddTrainStopModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newTrainStop) => {
            setAllTrainStops((prev) => [...prev, newTrainStop]);
          }}
        />
      }
    </>
  );
}
