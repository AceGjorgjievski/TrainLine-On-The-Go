import { useState } from "react";
import { getFullRouteName, getJsonFilePath, parseRouteName } from "@/shared/utils";

import {
  getTrainRoutesByName,
  getActiveTrainsByRouteName,
  getAllActiveTrains,
} from "@/services";
import { TrainRouteDTO, Coord, Direction, RouteKey } from "@/types";

export function useTrainDataFetcher() {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState<TrainRouteDTO | null>(null);
  const [coord, setCoord] = useState<Coord[]>([]);
  const [allCoordMap, setAllCoordMap] = useState<Map<string, Coord[]>>(new Map());

  const fetchStations = async (route: RouteKey, direction: Direction) => {
    setLoading(true);
    const fullName = getFullRouteName(route, direction);
    try {
      const data = await getTrainRoutesByName(fullName);
      setRouteData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLiveTrains = async (route: RouteKey, direction: Direction) => {
    setLoading(true);
    const fullName = getFullRouteName(route, direction);
    const fullJsonFileName = getJsonFilePath(route, direction);

    try {
      const [activeTrains, coordData] = await Promise.all([
        getActiveTrainsByRouteName(fullName),
        fetch(fullJsonFileName).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch coordinates");
          return res.json();
        }),
      ]);

      const key = `${route}-${direction}`;
      setAllCoordMap((prev) => {
        const updated = new Map(prev);
        updated.set(key, coordData);
        return updated;
      });

      setCoord(coordData);
      return { activeTrains, coordData };
    } catch (err) {
      console.error(err);
      return { activeTrains: [], coordData: [] };
    } finally {
      setLoading(false);
    }
  };

  const fetchAllActiveTrains = async () => {
    setLoading(true);
    try {
      const data = await getAllActiveTrains();

      const routeJsonsToFetch = new Map<string, { route: RouteKey; direction: Direction }>();
      for (const train of data) {
        const { route, direction } = parseRouteName(train.routeName);
        if (route && direction) {
          const key = `${route}-${direction}`;
          routeJsonsToFetch.set(key, { route, direction });
        }
      }

      const coordPromises = Array.from(routeJsonsToFetch.entries()).map(
        async ([key, { route, direction }]) => {
          const jsonPath = getJsonFilePath(route, direction);
          const res = await fetch(jsonPath);
          if (!res.ok) throw new Error(`Failed to load ${key}`);
          const data = await res.json();
          return [key, data] as [string, Coord[]];
        }
      );

      const entries = await Promise.all(coordPromises);
      const newMap = new Map(entries);
      setAllCoordMap(newMap);

      return data;
    } catch (err) {
      console.error("Error fetching active trains or JSONs:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    routeData,
    coord,
    allCoordMap,
    fetchStations,
    fetchLiveTrains,
    fetchAllActiveTrains,
  };
}
