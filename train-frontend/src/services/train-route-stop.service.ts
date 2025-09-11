import { TrainRouteStop } from "@/types/trainRouteStop";
import axiosInstance from "@/utils/axios";



const API_URL = "http://localhost:8080/api/train-route-stop";

export const getTrainRouteStopsByRouteName = async (routeName: string) => {
    const res = axiosInstance.get<TrainRouteStop[]>(`${API_URL}/${routeName}`);

    return (await res).data;
}
