import { TrainStop } from "@/types";
import axiosInstance from "@/utils/axios";


const API_URL = "http://localhost:8080/api/train-stop";


export const getAllTrainStops = async () => {
    const res = axiosInstance.get<TrainStop[]>(`${API_URL}`);

    return (await res).data;
}
