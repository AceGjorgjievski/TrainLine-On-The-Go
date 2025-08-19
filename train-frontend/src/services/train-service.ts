import { ActiveTrainDTO } from "@/types/ActiveTrainDTO";
import axiosInstance from "@/utils/axios";


const API_URL = "http://localhost:8080/api/train";

export const getActiveTrainsByRouteName = async (routeName: string) => {
    const res = axiosInstance.get<ActiveTrainDTO>(`${API_URL}/${routeName}`);

    return (await res).data;
}

