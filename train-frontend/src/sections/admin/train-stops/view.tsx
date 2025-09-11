"use client";

import { useState } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  SelectChangeEvent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  TablePagination,
} from "@mui/material";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { getTrainRoutesByName } from "@/services/train-route.services";
import { TrainRouteDTO } from "@/types/TrainRouteDTO";
type Order = "asc" | "desc";

export default function TrainStopsAdminView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");
  const [route, setRoute] = useState("");
  const renderRoutes =
    direction === "departure" ? fromSkopjeRouteNameMap : toSkopjeRouteNameMap;

  const [order, setOrder] = useState<Order>("asc");
  const [trainRoute, setTrainRoute] = useState<TrainRouteDTO | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [orderBy, setOrderBy] = useState<keyof any>("stationSequenceNumber");

  const handleDirectionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDirection(e.target.value as "departure" | "arrival");
    setRoute("");
    setTrainRoute(null);
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

  const handleRequestSort = (property: keyof any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedStops = trainRoute
    ? [...trainRoute.stationStops].sort((a, b) => {
        const aVal = a[orderBy];
        const bVal = b[orderBy];
        if (aVal < bVal) return order === "asc" ? -1 : 1;
        if (aVal > bVal) return order === "asc" ? 1 : -1;
        return 0;
      })
    : [];

  const paginatedStops = sortedStops.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <FormControl component="fieldset" sx={{ mb: 3 }}>
        <FormLabel component="legend">Choose Direction</FormLabel>
        <RadioGroup row value={direction} onChange={handleDirectionChange}>
          <FormControlLabel
            value="departure"
            control={<Radio />}
            label="Departure from Skopje"
          />
          <FormControlLabel
            value="arrival"
            control={<Radio />}
            label="Arrival to Skopje"
          />
        </RadioGroup>
      </FormControl>
      {direction && (
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
      )}
      {trainRoute && (
        <Paper>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    onClick={() => handleRequestSort("trainStop")}
                    style={{ cursor: "pointer" }}
                  >
                    Station Name{" "}
                    {orderBy === "trainStop" && (order === "asc" ? "▲" : "▼")}
                  </TableCell>
                  <TableCell
                    onClick={() => handleRequestSort("stationSequenceNumber")}
                    style={{ cursor: "pointer" }}
                  >
                    Sequence{" "}
                    {orderBy === "stationSequenceNumber" &&
                      (order === "asc" ? "▲" : "▼")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStops.map((stop) => (
                  <TableRow key={stop.id}>
                    <TableCell>{stop.trainStop.name}</TableCell>
                    <TableCell>{stop.stationSequenceNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sortedStops.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </Paper>
      )}
    </>
  );
}
