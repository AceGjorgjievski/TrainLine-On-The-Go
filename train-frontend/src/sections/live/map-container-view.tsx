import React, { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  CircleMarker,
} from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import {
  Container,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";

import SideDrawer from "@/components/sideDrawer/side-drawer";
import RecenterMap from "./recenter-map";

import { getTrainRoutesByName } from "@/services/train-route.services";

import { TrainRouteDTO } from "@/types/TrainRouteDTO";
import { TrainRouteStop } from "@/types/trainRouteStop";
import { TrainStop } from "@/types/trainStop";
import { getActiveTrainsByRouteName } from "@/services/train.service";
import { ActiveTrainDTO } from "@/types/ActiveTrainDTO";
import { FormData, Direction, RouteKey } from "@/types/submit.types";
import {
  fromSkopjeRouteNameMap,
  toSkopjeRouteNameMap,
} from "@/constants/routes";
import { Coord } from "@/types/coordinates";
import { TrainStopTime } from "@/types/trainStopTime";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const getJsonFilePath = (route: RouteKey, direction: Direction) => {
  const fullName = getFullRouteName(route, direction);
  const fileName = fullName.toLowerCase().replace(/\s+/g, "");
  return `/routes/${direction}/${fileName}.json`;
};

const getFullRouteName = (route: RouteKey, direction: Direction): string => {
  return direction === "departure"
    ? fromSkopjeRouteNameMap[route]
    : toSkopjeRouteNameMap[route];
};

type LiveTrainProgress = {
  trainId: number;
  lastStationName: string | undefined;
  nextStationName: string | undefined;
  lastStationNumber: number;
  nextStationNumber: number;
  trainStopTimeList: TrainStopTime[];
  segment: Coord[];
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  currentIndex: number;
  interval: number; // in ms
};

export default function MapContainerView() {
  const [liveTrainProgress, setLiveTrainProgress] = useState<
    LiveTrainProgress[]
  >([]);
  const [liveMapCenter, setLiveMapCenter] = useState<{
  lat: number;
  lng: number;
  zoom: number;
} | null>(null);


  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<TrainRouteDTO | null>(null);

  const [activeTrains, setActiveTrains] = useState<ActiveTrainDTO[]>([]);
  const [formData, setFormData] = useState<FormData | null>(null);

  const [coord, setCoord] = useState<Coord[]>([]);
  const [index, setIndex] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    console.log("Component mounted");
    setIsMounted(true);

    const defaultRoute: RouteKey = "veles";
    const defaultDirection: Direction = "departure";

    const getFileName = getJsonFilePath(defaultRoute, defaultDirection);

    console.log("Fetching default JSON file:", getFileName);

    fetch(getFileName)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch default route file");
        return res.json();
      })
      .then((data) => {
        setCoord(data);
      })
      .catch((err) => {
        console.error("Error loading default JSON:", err);
      });
  }, []);

  useEffect(() => {
    if (!coord.length || !activeTrains.length) return;

    const updatedProgress = activeTrains
      .map((train) => {
        const lastStationNumber = train.currentPassedStationNumber.toString();
        const { lastStation, nextStation, segment } = findStationsBetween(
          coord,
          lastStationNumber
        );

        const stopIdx = train.trainStopTimeList.findIndex(
          (t) =>
            t.trainRouteStopDTO.stationSequenceNumber ===
            Number(lastStationNumber)
        );

        const lastStop = train.trainStopTimeList[stopIdx];
        const nextStop = train.trainStopTimeList[stopIdx + 1];

        if (!lastStop || !nextStop || segment.length === 0) return null;

        const totalTime = getTimeDiffInSeconds(
          lastStop.trainStopTime,
          nextStop.trainStopTime
        );
        const intervalPerStep = totalTime / segment.length;

        return {
          trainId: train.id,
          lastStationName: lastStation?.stationName,
          nextStationName: nextStation?.stationName,
          lastStationNumber: Number(lastStation?.stationNumber),
          nextStationNumber: Number(nextStation?.stationNumber),
          trainStopTimeList: train.trainStopTimeList,
          segment,
          centerLatitude: train.centerLatitude,
          centerLongitude: train.centerLongitude,
          zoomLevel: train.zoomLevel,
          currentIndex: 0,
          interval: intervalPerStep * 1000, // to ms
        };
      })
      .filter(Boolean) as LiveTrainProgress[];

    setLiveTrainProgress(updatedProgress);
  }, [activeTrains, coord]);

  useEffect(() => {
    if (!liveTrainProgress.length) return;

    const intervalIds = liveTrainProgress.map((train, i) => {
      return setInterval(() => {
        setLiveTrainProgress((prev) => {
          const copy = [...prev];
          const current = copy[i];

          if (current.currentIndex < current.segment.length - 1) {
            current.currentIndex += 1;
          } else if (current.nextStationName) {
            const nextSegment = findStationsBetween(
              coord,
              `${current.nextStationNumber}`
            );

            if (nextSegment.segment.length > 0) {
              current.segment = nextSegment.segment;
              current.currentIndex = 0;
              current.lastStationName = nextSegment.lastStation?.stationName;
              current.nextStationName = nextSegment.nextStation?.stationName;

              const lastStop = train.trainStopTimeList.find(
                (t) =>
                  t.trainRouteStopDTO.trainStop.name === current.lastStationName
              );
              const nextStop = train.trainStopTimeList.find(
                (t) =>
                  t.trainRouteStopDTO.trainStop.name === current.nextStationName
              );
              if (lastStop && nextStop) {
                const totalTime = getTimeDiffInSeconds(
                  lastStop.trainStopTime,
                  nextStop.trainStopTime
                );
                current.interval = (totalTime / current.segment.length) * 1000;
              }
            }
          }

          return copy;
        });
      }, train.interval);
    });

    return () => {
      intervalIds.forEach(clearInterval);
    };
  }, [liveTrainProgress]);



  const handleFormSubmit = (data: FormData) => {
    setFormData(data);

    if (data.viewOption === "stations") {
      setActiveTrains([]);
    } else {
      //live
      setRouteData(null);
    }

    const strategy = {
      departure: {
        stations: () => fetchStations(data.route, data.direction),
        live: () => fetchLiveTrains(data.route, data.direction),
      },
      arrival: {
        stations: () => fetchStations(data.route, data.direction),
        live: () => fetchLiveTrains(data.route, data.direction),
      },
    };

    strategy[data.direction][data.viewOption]();
  };

  const fetchStations = (route: RouteKey, direction: Direction) => {
    const fullName = getFullRouteName(route, direction);

    getTrainRoutesByName(fullName)
      .then((data) => {
        console.log("routes: ", data);
        setRouteData(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  console.log("full path:", getJsonFilePath("tabanovce", "departure"));

  const fetchLiveTrains = (route: RouteKey, direction: Direction) => {
    const fullName = getFullRouteName(route, direction);
    console.log("full", fullName);
    const fullJsonFileName = getJsonFilePath(route, direction);
    console.log("Fetching JSON from:", fullJsonFileName);

    getActiveTrainsByRouteName(fullName)
      .then((data: ActiveTrainDTO[]) => {
        console.log("live trains: ", data);
        setActiveTrains(data);
        if(data.length > 0) {
          const firstTrain = data[0];
          setLiveMapCenter({
            lat: firstTrain.centerLatitude, 
            lng: firstTrain.centerLongitude, 
            zoom: firstTrain.zoomLevel
          });
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });

    fetch(fullJsonFileName)
      .then((data) => data.json())
      .then((data) => setCoord(data));
  };

  useEffect(() => {
    if (routeData?.stationStops) {
      console.log("Station Stops:", routeData.stationStops);
    }
  }, [routeData]);

  const centerPosition: LatLngExpression | undefined = routeData
    ? [routeData.centerLatitude, routeData.centerLongitude]
    : liveMapCenter ? [liveMapCenter.lat, liveMapCenter.lng]
    : [41.9981, 21.4254];

  if (!isMounted || coord.length === 0) {
    console.log(isMounted, coord);
    return <p>Loading train data...</p>;
  }

  const findStationsBetween = (coord: Coord[], lastStationNumber: string) => {
    const currentIdx = coord.findIndex(
      (c) => c.stationNumber === lastStationNumber
    );
    if (currentIdx === -1) {
      return { lastStation: null, nextStation: null, segment: [] };
    }

    const lastStationNum = parseInt(lastStationNumber);
    const nextStationNum = lastStationNum + 1;
    const nextStationNumber = nextStationNum.toString();

    const nextIdx = coord.findIndex(
      (c) => c.stationNumber === nextStationNumber
    );

    if (nextIdx === -1) {
      return { lastStation: coord[currentIdx], nextStation: null, segment: [] };
    }

    const segment = coord.slice(currentIdx, nextIdx + 1);

    return {
      lastStation: coord[currentIdx],
      nextStation: coord[nextIdx],
      segment,
    };
  };

  const getTimeDiffInSeconds = (time1: string, time2: string): number => {
    const [h1, m1, s1] = time1.split(":").map(Number);
    const [h2, m2, s2] = time2.split(":").map(Number);

    //without seconds - dont add
    const totalSeconds1 = h1 * 3600 + m1 * 60;
    const totalSeconds2 = h2 * 3600 + m2 * 60;

    return totalSeconds2 - totalSeconds1;
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        height: "87.7vh",
        width: "100%",
        padding: 0,
        margin: 0,
        position: "relative",
      }}
    >
      <Button
        variant="contained"
        color="primary"
        onClick={() => toggleDrawer(true)}
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          zIndex: 1000,
        }}
      >
        Open Drawer
      </Button>

      <MapContainer
        center={centerPosition}
          zoom={
          routeData?.zoomLevel ??
          liveMapCenter?.zoom ??
          13
        }
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {liveTrainProgress.map((train) => {
          const coord = train.segment[train.currentIndex];
          if (!coord) return null;

          return (
            <CircleMarker
              key={train.trainId}
              center={[coord.lat, coord.lng]}
              radius={10}
              pathOptions={{ color: "blue" }}
            >
              <Popup>
                <Typography>Train ID: {train.trainId}</Typography>
                <Typography>Segment Index: {train.currentIndex}</Typography>
                <Typography>
                  Previous Station: {train.lastStationName}
                </Typography>
                <Typography>Next Station: {train.nextStationName}</Typography>
              </Popup>
            </CircleMarker>
          );
        })}


        {routeData ? (
          <RecenterMap
            center={[routeData.centerLatitude, routeData.centerLongitude]}
            zoom={routeData.zoomLevel}
          />
        ) : liveMapCenter ? (
          <RecenterMap
            center={[liveMapCenter.lat, liveMapCenter.lng]}
            zoom={liveMapCenter.zoom}
          />
        ) : null}

        {routeData?.stationStops?.map(
          (stopWrapper: TrainRouteStop, idx: number) => {
            const stop: TrainStop = stopWrapper.trainStop;
            return (
              <Marker key={idx} position={[stop.latitude, stop.longitude]}>
                <Popup>
                  <div>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {stop.name}
                    </Typography>
                    <Typography variant="body2">
                      Station number: {stopWrapper.stationSequenceNumber}
                    </Typography>
                    <Typography variant="body2">
                      Lat: {stop.latitude}, Lng: {stop.longitude}
                    </Typography>
                  </div>
                </Popup>
              </Marker>
            );
          }
        )}

        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              zIndex: 1500,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress size={60} sx={{ color: "white" }} />
          </Box>
        )}
      </MapContainer>

      <SideDrawer
        drawerOpen={drawerOpen}
        toggleDrawer={toggleDrawer}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}
