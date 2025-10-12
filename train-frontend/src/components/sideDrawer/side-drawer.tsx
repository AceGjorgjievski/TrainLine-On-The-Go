"use client";

import { Direction, FormData, RouteKey, ViewOptions } from "@/types";
import {
  Button,
  Drawer,
  Box,
  Typography,
  SelectChangeEvent,
  FormControl,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import { useCallback, useState } from "react";
import RouteDirection from "./routeDirectionFormControl";
import DepartureArrival from "./departureArrivalFormControl";
import StationLiveTypeFormControl from "./stationLiveTypeFormControl";
import { useAuthContext } from "@/auth/hooks";
import toast from "react-hot-toast";

type Props = {
  drawerOpen: boolean;
  toggleDrawer: (action: boolean) => void;
  onSubmit: (data: FormData) => void;
};

type AdminMode =
  | "View All Trains"
  | "Add New Train Station"
  | "Regular Search"
  | "";

export default function SideDrawer({
  drawerOpen,
  toggleDrawer,
  onSubmit,
}: Props) {
  const [viewOption, setViewOption] = useState<ViewOptions | "">("");
  const [route, setRoute] = useState<RouteKey | "">("");
  const [direction, setDirection] = useState<Direction | "">("");

  const { authenticated } = useAuthContext();
  const [adminMode, setAdminMode] = useState<AdminMode>("");

  const handleRouteChange = (event: SelectChangeEvent) => {
    setRoute(event.target.value as RouteKey);
  };

  const handleStationLiveTypeChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setViewOption(event.target.value as ViewOptions);
  };

  const handleDirectionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedDirection = event.target.value as Direction;
      setDirection(selectedDirection);
      setRoute("");
      setViewOption("");
    },
    []
  );

  const handleSubmit = () => {
    if (adminMode === "View All Trains") {
      onSubmit({ showAllLiveTrains: true } as FormData);
    } else if (adminMode === "Add New Train Station") {
      toast(() => (<span><b>Click Anywhere on the map to add new station</b></span>), {duration: 3700})
      onSubmit({ addNewTrainStation: true } as FormData);
    } else {
      onSubmit({
        regularSearch: true,
        direction,
        route,
        viewOption,
      } as FormData);
    }
    toggleDrawer(false);
  };

  return (
    <Drawer
      anchor="right"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      sx={{
        "& .MuiDrawer-paper": {
          height: "70%",
          top: "11.4%",
        },
      }}
    >
      <Box sx={{ width: 300, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Choose Options
        </Typography>

        {authenticated && (
          <FormControl component="fieldset" sx={{ mb: 3 }}>
            <RadioGroup
              value={adminMode}
              onChange={(e) => setAdminMode(e.target.value as AdminMode)}
            >
              <FormControlLabel
                value="View All Trains"
                control={<Radio />}
                label="View All Active Trains"
              />
              <FormControlLabel
                value="Add New Train Station"
                control={<Radio />}
                label="Add Station"
              />
              <FormControlLabel
                value="Regular Search"
                control={<Radio />}
                label="Regular Search"
              />
            </RadioGroup>
          </FormControl>
        )}

        {adminMode === "Regular Search" && (
          <DepartureArrival
            direction={direction}
            handleDirectionChange={handleDirectionChange}
          />
        )}

        {adminMode === "Regular Search" && direction && (
          <RouteDirection
            route={route}
            direction={direction}
            handleRouteChange={handleRouteChange}
          />
        )}

        {adminMode === "Regular Search" && route && (
          <StationLiveTypeFormControl
            viewOption={viewOption}
            handleStationLiveTypeChange={handleStationLiveTypeChange}
          />
        )}

        <Button
          variant="outlined"
          fullWidth
          onClick={handleSubmit}
          disabled={
            !adminMode ||
            (adminMode === "Regular Search" &&
              (!direction || !route || !viewOption))
          }
        >
          Submit
        </Button>
      </Box>
    </Drawer>
  );
}
