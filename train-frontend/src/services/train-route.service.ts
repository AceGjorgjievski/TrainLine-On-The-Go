import { TrainRouteDTO, EditTrainRoutePayload } from "@/types";
import { apiGet } from "./api";
import axiosInstance from "@/utils/axios";

const API_URL = "http://localhost:8080/api/train-route";

export const getTrainRoutesByName = async (name: string) => {
  // const res =  apiGet<TrainRouteDTO>(`${API_URL}/${name}`);
  const res = axiosInstance.get<TrainRouteDTO>(`${API_URL}/${name}`);

  return (await res).data;
};

export const getDepartureTrainRoutes = async () => {
  const res = axiosInstance.get<TrainRouteDTO[]>(`${API_URL}/departure`);
  return (await res).data;
}

export const getArrivalTrainRoutes = async () => {
  const res = axiosInstance.get<TrainRouteDTO[]>(`${API_URL}/arrival`);
  return (await res).data;
}

export const editTrainRoute = async (
  id: number,
  data: EditTrainRoutePayload
) => {
  const res = await axiosInstance.put<TrainRouteDTO>(`${API_URL}/${id}/edit`, data);
  return res.data;
};

export const deleteTrainRoute = async (id: number) => {
  axiosInstance.delete(`${API_URL}/${id}/delete`);
};

export const addTrainRoute = async (route: {
  name: string;
  centerLatitude: number;
  centerLongitude: number;
  zoomLevel: number;
  stationStops: number[];
}) => {
  const res = await axiosInstance.post<TrainRouteDTO>(`${API_URL}/add`, route);
  return res.data;
};
