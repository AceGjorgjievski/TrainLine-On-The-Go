import { TrainStop } from "@/types";
import axiosInstance from "@/utils/axios";


const API_URL = "http://localhost:8080/api/train-stop";


export const getAllTrainStops = async () => {
    const res = axiosInstance.get<TrainStop[]>(`${API_URL}`);

    return (await res).data;
}

export const getTrainStop = async (id: number) => {
    const res = axiosInstance.get<TrainStop>(`${API_URL}/${id}`);

    return (await res).data;
}

export const addTrainStop = async (trainStop : {name: string, latitude: number, longitude: number}) => {
    const res = axiosInstance.post<TrainStop>(`${API_URL}/add`, trainStop);

    return (await res).data;
}

export const editTrainStop = async (trainStop: TrainStop) => {
    const res = axiosInstance.put<TrainStop>(`${API_URL}/${trainStop.id}/edit`, trainStop);

    return (await res).data;
}

export const deleteTrainStop = async (id: number) => {
    axiosInstance.delete(`${API_URL}/${id}/delete`);
}


