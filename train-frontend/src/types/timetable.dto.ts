import { StationDTO } from "@/types";

export type TimetableDTO = {
    routeName: string;
    trains: string[];
    stations: StationDTO[];
}