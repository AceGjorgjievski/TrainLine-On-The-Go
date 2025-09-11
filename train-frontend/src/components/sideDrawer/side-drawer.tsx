"use client";

import {
  Direction,
  FormData,
  RouteKey,
  ViewOptions,
} from "@/types";
import {
  Button,
  Drawer,
  Box,
  Typography,
  SelectChangeEvent,
} from "@mui/material";
import { useCallback, useState } from "react";
import RouteDirection from "./routeDirectionFormControl";
import DepartureArrival from "./departureArrivalFormControl";
import StationLiveTypeFormControl from "./stationLiveTypeFormControl";

type Props = {
  drawerOpen: boolean;
  toggleDrawer: (action: boolean) => void;
  onSubmit: (data: FormData) => void;
};

export default function SideDrawer({
  drawerOpen,
  toggleDrawer,
  onSubmit,
}: Props) {
  const [viewOption, setViewOption] = useState<ViewOptions | "">("");
  const [route, setRoute] = useState<RouteKey | "">("");
  const [direction, setDirection] = useState<Direction | "">("");

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
    onSubmit({ direction, route, viewOption } as FormData);
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

        {
          <DepartureArrival
            direction={direction}
            handleDirectionChange={handleDirectionChange}
          />
        }

        {direction && (
          <RouteDirection 
            route={route} 
            direction={direction} 
            handleRouteChange={handleRouteChange} 
          />
        )}

        {route && (
          <StationLiveTypeFormControl
            viewOption={viewOption}
            handleStationLiveTypeChange={handleStationLiveTypeChange}
          />
        )}

        <Button 
          variant="outlined" 
          fullWidth 
          onClick={handleSubmit}
          disabled={!direction || !route || !viewOption}
        >
          Submit
        </Button>
      </Box>
    </Drawer>
  );
}
