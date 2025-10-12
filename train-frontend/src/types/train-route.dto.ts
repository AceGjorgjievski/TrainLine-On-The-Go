import { TrainRouteStop } from "@/types";

export type TrainRouteDTO = {
  id: number;
  name: string;
  stationStops: TrainRouteStop[];
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  totalRouteTime: number;
  routeDistance: number;
  working: boolean;
}

export type EditTrainRoutePayload = {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  totalRouteTime: number;
  routeDistance: number;
  isWorking: boolean;
  stationStops: number[];
};