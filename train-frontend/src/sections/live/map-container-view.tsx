import { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import TrainStopMarker from "./TrainStopMarker";
import TrainLiveMarker from "./TrainLiveMarker";
import RecenterMap from "./recenter-map";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Container, Button, CircularProgress, Box } from "@mui/material";
import { SideDrawer } from "@/components/sideDrawer";

import { getTrainRoutesByName, getActiveTrainsByRouteName } from "@/services";
import {
  Coord,
  LiveTrainProgress,
  TrainRouteDTO,
  ActiveTrainDTO,
  FormData,
  Direction,
  RouteKey,
} from "@/types";

import {
  getFullRouteName,
  getJsonFilePath,
  findStationsBetween,
  getTimeDiffInSeconds,
} from "@/shared/utils";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

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

  const [coord, setCoord] = useState<Coord[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [shouldRecenter, setShouldRecenter] = useState(false);


  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const defaultRoute: RouteKey = "veles";
    const defaultDirection: Direction = "departure";

    const getFileName = getJsonFilePath(defaultRoute, defaultDirection);

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
          trainName: train.name,
          lastStationName: lastStation?.stationName,
          nextStationName: nextStation?.stationName,
          lastStationNumber: Number(lastStation?.stationNumber),
          nextStationNumber: Number(nextStation?.stationNumber),
          trainStopTimeList: train.trainStopTimeList,
          routeName: train.routeName,
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
    setRouteData(null);
    setLiveTrainProgress([]);
    setActiveTrains([]);
    setLoading(true);

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
        setRouteData(data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchLiveTrains = (route: RouteKey, direction: Direction) => {
    setLoading(true);

    const fullName = getFullRouteName(route, direction);
    const fullJsonFileName = getJsonFilePath(route, direction);

    Promise.all([
      getActiveTrainsByRouteName(fullName),
      fetch(fullJsonFileName).then((res) => {
        if (!res.ok)
          throw new Error("Failed to fetch data for the coordinates.");
        return res.json();
      }),
    ])
      .then(([activeTrainData, routeJsonCoordData]) => {
        setActiveTrains(activeTrainData);
        if (activeTrainData.length > 0) {
          const firstTrain = activeTrainData[0];
          setLiveMapCenter({
            lat: firstTrain.centerLatitude,
            lng: firstTrain.centerLongitude,
            zoom: firstTrain.zoomLevel,
          });
          setShouldRecenter(true);
        }
        setCoord(routeJsonCoordData);
      })
      .catch((err) => {
        console.error("Error fetching...", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const centerPosition: LatLngExpression | undefined = routeData
    ? [routeData.centerLatitude, routeData.centerLongitude]
    : liveMapCenter
    ? [liveMapCenter.lat, liveMapCenter.lng]
    : [41.9981, 21.4254];

  if (!isMounted || loading) {
    return <p>Loading train data...</p>;
  }

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
        zoom={routeData?.zoomLevel ?? liveMapCenter?.zoom ?? 13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        <TrainLiveMarker liveTrainProgress={liveTrainProgress} />

        {routeData ? (
          <RecenterMap
            center={[routeData.centerLatitude, routeData.centerLongitude]}
            zoom={routeData.zoomLevel}
            onComplete={() => setShouldRecenter(false)}
          />
        ) : shouldRecenter && liveMapCenter ? (
          <RecenterMap
            center={[liveMapCenter.lat, liveMapCenter.lng]}
            zoom={liveMapCenter.zoom}
            onComplete={() => setShouldRecenter(false)}
          />
        ) : null}

        <TrainStopMarker routeData={routeData} />

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
