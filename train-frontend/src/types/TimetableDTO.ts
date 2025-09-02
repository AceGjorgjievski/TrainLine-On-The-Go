import { StationDTO } from "./stationDTO";

export type TimetableDTO = {
    routeName: string;
    trains: string[];
    stations: StationDTO[];
}