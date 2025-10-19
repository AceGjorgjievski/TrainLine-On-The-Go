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
import { useTranslations } from "next-intl";

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
  const [mode, setMode] = useState<AdminMode>(
    authenticated ? "" : "Regular Search"
  );
  const tSideDrawer = useTranslations("Side-Drawer");
  const tSideDrawerAdmin = useTranslations("Side-Drawer.question.admin");
  const tToaster = useTranslations("Toaster");

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
    if (mode === "View All Trains") {
      onSubmit({ showAllLiveTrains: true } as FormData);
    } else if (mode === "Add New Train Station") {
      toast(
        () => (
          <span>
            <b>{tToaster("add-new-station-before")}</b>
          </span>
        ),
        { duration: 3700 }
      );
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
      <Box sx={{ width: 400, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          {tSideDrawer("title")}
        </Typography>

        <FormControl component="fieldset" sx={{ mb: 3 }}>
          <RadioGroup
            value={mode}
            onChange={(e) => setMode(e.target.value as AdminMode)}
          >
            {authenticated && (
              <>
                <FormControlLabel
                  value="View All Trains"
                  control={<Radio />}
                  label={tSideDrawerAdmin("radio-option-one")}
                />
                <FormControlLabel
                  value="Add New Train Station"
                  control={<Radio />}
                  label={tSideDrawerAdmin("radio-option-two")}
                />
                <FormControlLabel
                  value="Regular Search"
                  control={<Radio />}
                  label={tSideDrawerAdmin("radio-option-three")}
                />
              </>
            )}
          </RadioGroup>
        </FormControl>

        {mode === "Regular Search" && (
          <DepartureArrival
            direction={direction}
            handleDirectionChange={handleDirectionChange}
          />
        )}

        {mode === "Regular Search" && direction && (
          <RouteDirection
            route={route}
            direction={direction}
            handleRouteChange={handleRouteChange}
          />
        )}

        {mode === "Regular Search" && route && (
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
            !mode ||
            (mode === "Regular Search" && (!direction || !route || !viewOption))
          }
        >
          {tSideDrawer("submit")}
        </Button>
      </Box>
    </Drawer>
  );
}
