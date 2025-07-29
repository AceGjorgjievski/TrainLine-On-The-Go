/* eslint-disable @typescript-eslint/no-explicit-any */

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { Container } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

// delete L.Icon.Default.prototype.getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

export default function MapContainerView() {
  return (
    <Container
    maxWidth={false}
    disableGutters
      style={{
        height: "98vh",
        width: '98vw',
                padding: 0, // just in case, remove padding
        margin: 0,
      }}
    >
      <MapContainer
        {...({
          center: [41.9981, 21.4254],
          zoom: 13,
          style: { height: "100%", width: "100%"},
        } as any)}
      >
        <TileLayer
          {...({
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution:
              '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          } as any)}
        />
        <Marker position={[41.9981, 21.4254]}>
          <Popup>Hello from Skopje!</Popup>
        </Marker>
      </MapContainer>
    </Container>
  );
}