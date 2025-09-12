"use client";

import { useEffect, useState } from "react";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import {
  FormControlLabel,
  Radio,
  RadioGroup,
  TablePagination,
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

  const paginatedTrains = filteredTrains.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const renderRadioButtons = () => (
    <RadioGroup
      row
      aria-labelledby="demo-row-radio-buttons-group-label"
      name="row-radio-buttons-group"
      onChange={(e) =>
        setSelectedDirection(e.target.value as "departure" | "arrival")
      }
    >
      <FormControlLabel
        value="departure"
        control={<Radio />}
        label="Departure"
      />
      <FormControlLabel value="arrival" control={<Radio />} label="Arrival" />
    </RadioGroup>
  );

  const getStatusColor = (trainStatus: TrainStatus): string => {
    switch(trainStatus) {
      case "ACTIVE":
        return "green";
      case "INACTIVE":
        return "red";
      default:
        return "orange";
    }
  }

  return (
    <>
      {renderRadioButtons()}
      {direction ? (
        paginatedTrains.length > 0 ? (
          <>
            <Typography variant="h6" gutterBottom>
              {direction === "departure"
                ? "Departures from Skopje"
                : "Arrivals in Skopje"}
            </Typography>
            <TableContainer component={Paper} sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Speed (km/h)</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Route Name</strong>
                    </TableCell>
                    <TableCell>
                      <strong>Active</strong>
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
                      <TableCell sx={{ color: getStatusColor(train.trainStatus) }}>
                        {train.trainStatus === "ACTIVE" ? "Active" 
                        : train.trainStatus === "INACTIVE" ? "Inactive" 
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
