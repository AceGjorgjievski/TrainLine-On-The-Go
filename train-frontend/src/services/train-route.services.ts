import { TrainRouteDTO } from "@/types/TrainRouteDTO";
import { apiGet } from "./api";
import axiosInstance from "@/utils/axios";

const API_URL = "http://localhost:8080/api/train-route";

export const getTrainRoutesByName = async (name: string) => {
    // const res =  apiGet<TrainRouteDTO>(`${API_URL}/${name}`);
    const res = axiosInstance.get<TrainRouteDTO>(`${API_URL}/${name}`);

    return (await res).data;
}
