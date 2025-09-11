import { Coord, TrainStopTime } from "@/types";

export type LiveTrainProgress = {
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