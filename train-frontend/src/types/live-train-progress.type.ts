import { Coord, TrainStopTime } from "@/types";

export type LiveTrainProgress = {
  trainId: number;
  trainName: string;
  lastStationName: string | undefined;
  nextStationName: string | undefined;
  lastStationNumber: number;
  nextStationNumber: number;
  trainStopTimeList: TrainStopTime[];
  routeName: string;
  segment: Coord[];
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  currentIndex: number;
  interval: number; // in ms
};