"use client";

import { useEffect, useState } from "react";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import {
  Box,
  Container,
  Divider,
  TablePagination,
  colors,
} from "@mui/material";
import { TrainDTO, TrainStatus } from "@/types/train.dto";
import { getAllTrainsByRouteName } from "@/services/train.service";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";
import { DirectionSelector } from "@/shared/components";
import { useTranslations } from "next-intl";

const statusOrder = {
  ACTIVE: 0,
  UPCOMING: 1,
  INACTIVE: 2,
};

type SortKey = "name" | "trainRouteName" | "trainStatus";
type SortOrder = "asc" | "desc" | "";

export default function TrainsAdminView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");

  const [trains, setTrains] = useState<TrainDTO[]>([]);

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(e.target.value as "departure" | "arrival");
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const tAdminTrains = useTranslations("AdminPage");

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const fromSkopjePromise = Object.values(fromSkopjeRouteNameMap).map(
          (routeName) => getAllTrainsByRouteName(routeName)
        );

        const toSkopjePromise = Object.values(toSkopjeRouteNameMap).map(
          (routeName) => getAllTrainsByRouteName(routeName)
        );

        const [fromSkopjeRes, toSkopjeRes] = await Promise.all([
          Promise.all(fromSkopjePromise),
          Promise.all(toSkopjePromise),
        ]);

        const allTrains = [...fromSkopjeRes, ...toSkopjeRes].flat();

        setTrains(allTrains);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrains();
  }, []);

  const filteredTrains = trains.filter((train) => {
    if (direction === "departure") {
      return Object.values(fromSkopjeRouteNameMap).includes(
        train.trainRouteName
      );
    } else if (direction === "arrival") {
      return Object.values(toSkopjeRouteNameMap).includes(train.trainRouteName);
    }
    return false;
  });

  const [sortKey, setSortKey] = useState<SortKey | "">("trainStatus");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const sortedTrains = [...filteredTrains].sort((a, b) => {
    if (!sortKey || sortOrder === "") return 0;

    if (sortKey === "trainStatus") {
      const orderA = statusOrder[a.trainStatus];
      const orderB = statusOrder[b.trainStatus];

      return sortOrder === "asc" ? orderA - orderB : orderB - orderA;
    }

    const valA = a[sortKey];
    const valB = b[sortKey];

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return 0;
  });

  const paginatedTrains = sortedTrains.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (trainStatus: TrainStatus): string => {
    switch (trainStatus) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      default:
        return "orange";
    }
  };

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      const nextOrder =
        sortOrder === "" ? "asc" : sortOrder === "asc" ? "desc" : "";
      setSortOrder(nextOrder);
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

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
      {direction &&
        (paginatedTrains.length > 0 ? (
          <>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
                bgcolor: "#ffffff",
                borderRadius: 2,
                p: 3,
                boxShadow: 10,
                width: "fit-content",
                height: "5rem",
                marginBottom: "2rem",
                border: "2px solid",
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: "bold", textAlign: "center" }}
              >
                {direction === "departure"
                  ? tAdminTrains("view-all-trains.direction-departure")
                  : tAdminTrains("view-all-trains.direction-arrival")}
              </Typography>
            </Container>
            <Divider
              variant="middle"
              sx={{ borderBottomWidth: 5, borderColor: colors.purple[500] }}
            />
            <Container>
              <TableContainer
                component={Paper}
                sx={{
                  mt: 2,
                  borderRadius: 4,
                  boxShadow: 10,
                  border: "2px solid",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {tAdminTrains("table.id")}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("name")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {tAdminTrains("table.name")} {renderSortIcon("name")}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {tAdminTrains("table.speed")} (km/h)
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("trainRouteName")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <Typography
                          sx={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          {tAdminTrains("table.route-name")} {renderSortIcon("trainRouteName")}
                        </Typography>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("trainStatus")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <Typography sx={{ fontWeight: "bold" }}>
                          {tAdminTrains("table.status")} {renderSortIcon("trainStatus")}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTrains.map((train, index) => (
                      <TableRow
                        key={train.id}
                        sx={{
                          bgcolor: index % 2 === 0 ? colors.blue[50] : "white",
                        }}
                      >
                        <TableCell>
                          <Typography sx={{ textAlign: "center" }}>
                            {train.id}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ textAlign: "center" }}>
                            {tAdminTrains("table." + train.name.split(" ")[0].toLocaleLowerCase()) + " " + train.name.split(" ")[1]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ textAlign: "center" }}>
                            {train.speed}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography sx={{ textAlign: "center" }}>
                            {tAdminTrains("routes." + train.trainRouteName.toLowerCase().replace(/\s+/g, "").replace("-", "-"))}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            sx={{
                              backgroundColor: getStatusColor(
                                train.trainStatus
                              ),
                              color: "#fff",
                              px: 1.5,
                              py: 0.5,
                              borderRadius: 1,
                              fontWeight: "bold",
                              display: "inline-block",
                              textAlign: "center",
                              minWidth: "80px",
                            }}
                          >
                            {train.trainStatus === "ACTIVE"
                              ? tAdminTrains("table.button-active")
                              : train.trainStatus === "INACTIVE"
                              ? tAdminTrains("table.button-inactive")
                              : tAdminTrains("table.button-upcoming")}
                          </Typography>
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
                  marginBottom: '8rem',
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
                    count={filteredTrains.length}
                    page={page}
                    onPageChange={(_, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 25]}
                    labelRowsPerPage={tAdminTrains("table.rows-per-page")}
                  />
                </Box>
              </Box>
            </Container>
          </>
        ) : (
          <Typography variant="body1">Loading train data...</Typography>
        ))}
    </>
  );
}
