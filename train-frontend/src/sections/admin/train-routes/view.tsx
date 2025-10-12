"use client";

import {
  getAllTrainStops,
  getDepartureTrainRoutes,
  deleteTrainRoute,
  getArrivalTrainRoutes,
} from "@/services";
import { DirectionSelector } from "@/shared/components";
import { TrainRouteDTO, TrainStop } from "@/types";
import {
  Container,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Stack,
  CircularProgress,
  TablePagination,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EditTrainRouteModal } from "./edit-train-route-modal";
import { AddTrainRouteModal } from "./add-train-route-modal";
import { DeleteTrainRouteModal } from "./delete-train-route-modal";

type SortKey = "name";
type SortOrder = "asc" | "desc" | "";

export default function TrainRoutesAdminView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");
  const [allRoutes, setAllRoutes] = useState<TrainRouteDTO[]>([]);

  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState<TrainRouteDTO | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDirection = e.target.value as "departure" | "arrival";
    setDirection(selectedDirection);
  };
  const [trainStopData, setTrainStopData] = useState<TrainStop[]>([]);

  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [routeToDelete, setRouteToDelete] = useState<TrainRouteDTO | null>(
    null
  );

  useEffect(() => {
    const fetchAllTrainStops = async () => {
      getAllTrainStops()
        .then((data) => {
          setTrainStopData(data);
        })
        .catch((err) => {
          console.error("Error fetching train stop data: ", err);
        });
    };

    fetchAllTrainStops();
  }, []);

  useEffect(() => {
    const fetchAllRoutes = async () => {
      try {
        setLoading(true);

        const [fromRoutes, toRoutes] = await Promise.all([
          getDepartureTrainRoutes(),
          getArrivalTrainRoutes(),
        ]);

        setAllRoutes([...fromRoutes, ...toRoutes]);
      } catch (error) {
        console.error("Failed to fetch routes", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllRoutes();
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const filteredRoutes = allRoutes.filter((route) =>
    direction === "departure"
      ? route?.name.startsWith("Skopje")
      : route?.name.endsWith("Skopje")
  );

  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    const aValue = a[sortKey].toLowerCase();
    const bValue = b[sortKey].toLowerCase();

    if (sortOrder === "asc") return aValue.localeCompare(bValue);
    if (sortOrder === "desc") return bValue.localeCompare(aValue);
    return 0;
  });

  const paginatedRoutes: TrainRouteDTO[] = sortedRoutes.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderSortIcon = (key: SortKey) => {
    if (sortKey !== key || sortOrder === "") return null;
    return sortOrder === "asc" ? "▲" : "▼";
  };

  const confirmDelete = async () => {
    if (!routeToDelete) return;

    await deleteTrainRoute(routeToDelete.id);
    setAllRoutes((prev) => prev.filter((r) => r.id !== routeToDelete.id));
    setRouteToDelete(null);
    setConfirmDeleteOpen(false);
  };

  return (
    <>
      <DirectionSelector
        direction={direction}
        handleDirectionChange={handleDirectionChange}
      />
      {direction && (
        <Container>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
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
                  Add New Route
                </Button>
              </Box>

              <TableContainer
                component={Paper}
                sx={{
                  marginTop: 4,
                  marginBottom: 2,
                  borderRadius: 4,
                  boxShadow: 10,
                  border: "2px solid",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        sx={{
                          width: "70%",
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => handleSort("name")}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Route Name {renderSortIcon("name")}
                        </Typography>
                      </TableCell>

                      <TableCell
                        sx={{
                          width: "70%",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Latitude
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "70%",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Longitude
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "70%",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Zoom Level
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          width: "30%",
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Action
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedRoutes.map((route, index) => (
                      <TableRow key={route.id || index}>
                        <TableCell align="center">{route.name}</TableCell>
                        <TableCell align="center">
                          {route.centerLatitude}
                        </TableCell>
                        <TableCell align="center">
                          {route.centerLongitude}
                        </TableCell>
                        <TableCell align="center">{route.zoomLevel}</TableCell>
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={2}
                            justifyContent="center"
                          >
                            <Button
                              variant="contained"
                              color="warning"
                              size="small"
                              onClick={() => {
                                setEditingRoute(route);
                                setIsModalOpen(true);
                              }}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              onClick={() => {
                                setRouteToDelete(route);
                                setConfirmDeleteOpen(true);
                              }}
                            >
                              Delete
                            </Button>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
                    count={sortedRoutes.length}
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
              {/* <Dialog
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
              >
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                  Are you sure you want to delete route{" "}
                  <strong>{routeToDelete?.name}</strong>?
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setConfirmDeleteOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={confirmDelete}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </DialogActions>
              </Dialog> */}
              <DeleteTrainRouteModal
                open={confirmDeleteOpen}
                onClose={() => setConfirmDeleteOpen(false)}
                onConfirm={(id: number) => {
                  setAllRoutes((prev) => 
                    prev.filter((route) => route.id !== id)
                  );
                }}
                trainRoute={routeToDelete}
              />
            </>
          )}
        </Container>
      )}
      {editingRoute && (
        <EditTrainRouteModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          route={editingRoute}
          onSave={(updatedRoute) => {
            setAllRoutes((prev) =>
              prev.map((r) => (r.id === updatedRoute.id ? updatedRoute : r))
            );
          }}
          trainStops={trainStopData}
        />
      )}
      {
        <AddTrainRouteModal
          open={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newRoute) => {
            setAllRoutes((prev) => [...prev, newRoute]);
          }}
          trainStops={trainStopData}
        />
      }
    </>
  );
}
