import { TrainStop } from "./trainStop";

export type TrainRouteStop = {
  id: number;
  trainStop: TrainStop;
  stationSequenceNumber: number;
};