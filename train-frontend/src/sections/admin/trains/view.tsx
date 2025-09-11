"use client";

import FormControl from "@mui/material/FormControl";
import { SelectChangeEvent } from "@mui/material/Select";
import { useEffect, useState } from "react";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";
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
  const [departureRoutes, setDepartureRoutes] = useState("Skopje - Tabanovce");
  const [arrivalRoutes, setArrivalRoutes] = useState("Tabanovce - Skopje");

  const [trains, setTrains] = useState<TrainDTO[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setDepartureRoutes(event.target.value);
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
        console.log("from sk", fromSkopjeRes);
        console.log("to sk", toSkopjeRes);

        const allTrains = [...fromSkopjeRes, ...toSkopjeRes].flat();

        setTrains(allTrains);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTrains();
  }, []);

  console.log("trains", trains);

  const renderRadioButtons = () => (
    <FormControl>
      <FormLabel id="demo-row-radio-buttons-group-label">
        Choose direction
      </FormLabel>
      <RadioGroup
        row
        aria-labelledby="demo-row-radio-buttons-group-label"
        name="row-radio-buttons-group"
      >
        <FormControlLabel
          value="Departure from Skopje"
          control={<Radio />}
          label="Departure"
        />
        <FormControlLabel
          value="Arrival in Skopje"
          control={<Radio />}
          label="Arrival"
        />
      </RadioGroup>
    </FormControl>
  );

  return (
    <>
      {renderRadioButtons()}
      {trains.length > 0 ? (
        <>
          <Typography variant="h6" gutterBottom>
            All Trains
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
                {trains.map((train) => (
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
      )}
    </>
  );
}
