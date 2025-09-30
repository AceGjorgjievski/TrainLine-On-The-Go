import { TimetableDTO } from "@/types";
import axiosInstance from "@/utils/axios";



const API_URL = "http://localhost:8080/api/train-stop-time";

export default async function getTimetableForRouteName(mode: "departure" | "arrival" | "all") {
    const res = axiosInstance.get<TimetableDTO>(`${API_URL}/${mode}/timetable`);

    return (await res).data;
}
