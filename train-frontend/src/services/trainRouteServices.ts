import { TrainRouteDTO } from "@/types/TrainRouteDTO";
import { apiGet } from "./api";


const API_URL = "http://localhost:8080/api/train-route";

export const getTrainRoutesByName = async (name: string) => {
    const res =  apiGet<TrainRouteDTO>(`${API_URL}/${name}`);

    return res;
}
