import { ActiveTrainDTO, TrainDTO } from "@/types";
import axiosInstance from "@/utils/axios";


const API_URL = "http://localhost:8080/api/train";


export const getAllTrainsByRouteName = async (routeName: string) => {
    const res = axiosInstance.get<TrainDTO>(`${API_URL}/${routeName}/all`);

    return (await res).data;
}

export const getActiveTrainsByRouteName = async (routeName: string) => {
    const res = axiosInstance.get<ActiveTrainDTO[]>(`${API_URL}/${routeName}/active`);

    return (await res).data;
}

export const getAllActiveTrains = async () => {
    const res = axiosInstance.get<ActiveTrainDTO[]>(`${API_URL}/active/all`);

    return (await res).data;
}

