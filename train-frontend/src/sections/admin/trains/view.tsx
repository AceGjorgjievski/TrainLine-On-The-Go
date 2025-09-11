"use client";

import { useEffect, useState } from "react";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import { TrainDTO } from "@/types/TrainDTO";
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

  return (
    <>
      {renderRadioButtons()}
      {direction ? (
        filteredTrains.length > 0 ? (
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
                  {filteredTrains.map((train) => (
                    <TableRow key={train.id}>
                      <TableCell>{train.id}</TableCell>
                      <TableCell>{train.name}</TableCell>
                      <TableCell>{train.speed}</TableCell>
                      <TableCell>{train.trainRouteName}</TableCell>
                      <TableCell sx={{ color: train.active ? "green" : "red" }}>
                        {train.active ? "Active" : "Inactive"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
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
