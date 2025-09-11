import { TrainStopTime } from "@/types";


export type ActiveTrainDTO = {
    id: number;
    name: string;
    speed: number;
    currentStopTime: string;
    trainStopTimeList: TrainStopTime[];
    currentPassedStationName: string;
    currentPassedStationNumber: number;
    centerLatitude: number;
    centerLongitude: number;
    zoomLevel: number;
}