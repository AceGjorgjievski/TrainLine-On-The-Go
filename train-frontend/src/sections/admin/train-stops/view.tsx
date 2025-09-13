"use client";

import { useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  TableHead,
  TablePagination,
  Container,
  Divider,
  colors,
} from "@mui/material";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { getTrainRoutesByName } from "@/services/train-route.service";
import { TrainRouteDTO } from "@/types/train-route.dto";
import { DirectionSelector } from "@/shared/components";

type SortKey = "trainStop.name" | "stationSequenceNumber";
type SortOrder = "asc" | "desc" | "";

export default function TrainStopsAdminView() {
  const [direction, setDirection] = useState<"departure" | "arrival" | "">("");
  const [route, setRoute] = useState("");
  const renderRoutes =
    direction === "departure" ? fromSkopjeRouteNameMap : toSkopjeRouteNameMap;

  const [trainRoute, setTrainRoute] = useState<TrainRouteDTO | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [sortKey, setSortKey] = useState<SortKey | "">("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("");

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
        let aVal: string | number = "";
        let bVal: string | number = "";

        if (sortKey === "trainStop.name") {
          aVal = a.trainStop.name;
          bVal = b.trainStop.name;
        } else if (sortKey === "stationSequenceNumber") {
          aVal = a.stationSequenceNumber;
          bVal = b.stationSequenceNumber;
        }

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

  const paginatedStops = sortedStops.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderRoutesDropDownMenu = () => (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        marginTop: "1rem",
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
      <DirectionSelector direction={direction} handleDirectionChange={handleDirectionChange} />
      {direction && renderRoutesDropDownMenu()}
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
      {trainRoute && (
        <Container>
          <Paper>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell
                      onClick={() => handleRequestSort("trainStop.name")}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        width: 200,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Station Name {renderSortIcon("trainStop.name")}
                    </TableCell>
                    <TableCell
                      onClick={() => handleRequestSort("stationSequenceNumber")}
                      sx={{
                        cursor: "pointer",
                        textDecoration: "underline",
                        width: 200,
                        whiteSpace: "nowrap",
                      }}
                    >
                      Sequence {renderSortIcon("stationSequenceNumber")}
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
        </Container>
      )}
    </>
  );
}
