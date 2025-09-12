

export type TrainStatus = "ACTIVE" | "INACTIVE" | "UPCOMING";

export type TrainDTO = {
    id: number;
    name: string;
    speed: number;
    trainRouteName: string;
    trainStatus: TrainStatus;
}