import { ActiveTrainDTO } from "@/types/ActiveTrainDTO";
import { TrainDTO } from "@/types/TrainDTO";
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

