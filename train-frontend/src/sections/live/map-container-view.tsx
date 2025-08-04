import React, { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import L, { LatLngExpression } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Container, Button, CircularProgress, Box } from "@mui/material";

import SideDrawer from "@/components/sideDrawer/side-drawer";
import RecenterMap from "./recenter-map";

import { getTrainRoutesByName } from "@/services/trainRouteServices";

import { TrainRouteDTO } from "@/types/TrainRouteDTO";
import { TrainRouteStop } from "@/types/trainRouteStop";
import { TrainStop } from "@/types/trainStop";


L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function MapContainerView() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [routeData, setRouteData] = useState<TrainRouteDTO | null>(null);
  const [formData, setFormData] = useState<{
    direction: string;
    route: string;
    viewOption: string;
  } | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleFormSubmit = (data: {
    direction: string;
    route: string;
    viewOption: string;
  }) => {
    setFormData(data);
  };

  useEffect(() => {
    if (!formData?.route || !formData?.viewOption) return;

    const routeNameMap: Record<string, string> = {
      tabanovce: "Skopje - Tabanovce",
      veles: "Skopje - Veles",
      gevgelija: "Skopje - Gevgelija",
      bitola: "Skopje - Bitola",
      kochani: "Skopje - Kochani",
      kichevo: "Skopje - Kichevo",
      prishtina: "Skopje - Prishtina"
    };

    const routeName = routeNameMap[formData.route];
    if (!routeName) return;

    setLoading(true);

    getTrainRoutesByName(encodeURIComponent(routeName))
      .then((data) => {
        setRouteData(data);
        setTimeout(() => {
          setLoading(false);
        }, 1500);
        setFormData(null);
      })
      .catch((err) => {
        setLoading(false);
        setFormData(null);
        console.error(err);
      });
  }, [formData]);

  const centerPosition: LatLngExpression | undefined = routeData
    ? [routeData.centerLatitude, routeData.centerLongitude]
    : [41.9981, 21.4254];

  console.log(
    "center: ",
    centerPosition[0],
    centerPosition[1],
    routeData?.zoomLevel
  );

  return (
    <Container
      maxWidth={false}
      disableGutters
      style={{
        height: "87.7vh",
        width: "98vw",
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
        zoom={routeData?.zoomLevel || 13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {routeData && (
          <RecenterMap
            center={[routeData.centerLatitude, routeData.centerLongitude]}
            zoom={routeData.zoomLevel}
          />
        )}

        {routeData?.stationStops?.map((stopWrapper: TrainRouteStop, idx: number) => {
          const stop: TrainStop = stopWrapper.trainStop;
          return (
            <Marker key={idx} position={[stop.latitude, stop.longitude]}>
              <Popup>
                <strong>{stop.name}</strong>
                <p>Station number: {stopWrapper.stationSequenceNumber}</p>
                <br />
                Lat: {stop.latitude}, Lng: {stop.longitude}
              </Popup>
            </Marker>
          );
        })}

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
        direction={formData?.direction || ""}
        setDirection={(val) =>
          setFormData((prev) => ({ ...prev!, direction: val }))
        }
        route={formData?.route || ""}
        setRoute={(val) => setFormData((prev) => ({ ...prev!, route: val }))}
        onSubmit={handleFormSubmit}
      />
    </Container>
  );
}
