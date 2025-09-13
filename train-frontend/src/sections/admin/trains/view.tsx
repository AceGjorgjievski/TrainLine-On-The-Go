"use client";

import { useEffect, useState } from "react";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import {
  Container,
  Divider,
  FormControlLabel,
  Radio,
  RadioGroup,
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

type SortKey = "name" | "trainRouteName" | "trainStatus";
type SortOrder = "asc" | "desc" | "";

export default function TrainsAdminView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");

  const [trains, setTrains] = useState<TrainDTO[]>([]);

  const setSelectedDirection = (mode: "departure" | "arrival") => {
    setDirection(mode);
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

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

  const [sortKey, setSortKey] = useState<SortKey | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

  const sortedTrains = [...filteredTrains].sort((a, b) => {
    if (!sortKey || sortOrder === "") return 0;

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

  const renderRadioButtons = () => (
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      onChange={(e) =>
        setSelectedDirection(e.target.value as "departure" | "arrival")
      }
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 15,
        }}
      >
        <FormControlLabel
          value="departure"
          control={<Radio />}
          label="Departure"
        />
        <FormControlLabel value="arrival" control={<Radio />} label="Arrival" />
      </Container>
    </RadioGroup>
  );

  return (
    <>
      {renderRadioButtons()}
      {direction ? (
        paginatedTrains.length > 0 ? (
          <>
            <Container
              sx={{
                display: "flex",
                justifyContent: "center",
                marginTop: "2rem",
              }}
            >
              <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                {direction === "departure"
                  ? "Departures from Skopje"
                  : "Arrivals in Skopje"}
              </Typography>
            </Container>
            <Divider
              variant="middle"
              sx={{ borderBottomWidth: 5, borderColor: colors.purple[500] }}
            />
            <Container>
              <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>
                        <strong>ID</strong>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("name")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <strong>Name {renderSortIcon("name")}</strong>
                      </TableCell>
                      <TableCell>
                        <strong>Speed (km/h)</strong>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("trainRouteName")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <strong>
                          Route Name {renderSortIcon("trainRouteName")}
                        </strong>
                      </TableCell>
                      <TableCell
                        onClick={() => handleSort("trainStatus")}
                        sx={{ cursor: "pointer", textDecoration: "underline" }}
                      >
                        <strong>Status {renderSortIcon("trainStatus")}</strong>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedTrains.map((train) => (
                      <TableRow key={train.id}>
                        <TableCell>{train.id}</TableCell>
                        <TableCell>{train.name}</TableCell>
                        <TableCell>{train.speed}</TableCell>
                        <TableCell>{train.trainRouteName}</TableCell>
                        <TableCell
                          sx={{ color: getStatusColor(train.trainStatus) }}
                        >
                          {train.trainStatus === "ACTIVE"
                            ? "Active"
                            : train.trainStatus === "INACTIVE"
                            ? "Inactive"
                            : "Upcomming"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
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
              />
            </Container>
          </>
        ) : (
          <Typography variant="body1">No trains found.</Typography>
        )
      ) : (
        <Typography variant="body1">
          Please select a direction to view trains.
        </Typography>
      )}
    </>
  );
}
