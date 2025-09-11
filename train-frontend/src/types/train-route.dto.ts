import { TrainRouteStop } from "@/types";

export type TrainRouteDTO = {
  id: number;
  name: string;
  stationStops: TrainRouteStop[];
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
}