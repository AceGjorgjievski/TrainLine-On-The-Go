import { useEffect, useState } from "react";
import { findStationsBetween, getTimeDiffInSeconds, parseRouteName } from "@/shared/utils";

import { ActiveTrainDTO, Coord, LiveTrainProgress } from "@/types";

export function useLiveTrainProgress(
  activeTrains: ActiveTrainDTO[],
  allCoordMap: Map<string, Coord[]>
) {
  const [liveTrainProgress, setLiveTrainProgress] = useState<LiveTrainProgress[]>([]);

  useEffect(() => {
    if (!allCoordMap.size || !activeTrains.length) return;

    const updatedProgress: LiveTrainProgress[] = activeTrains.map((train) => {
      const parsed = parseRouteName(train.routeName);
      if (!parsed) return null;

      const key = `${parsed.route}-${parsed.direction}`;
      const coordList = allCoordMap.get(key);
      if (!coordList) return null;

      const lastStationNumber = train.currentPassedStationNumber.toString();
      const { lastStation, nextStation, segment } = findStationsBetween(coordList, lastStationNumber);

      const stopIdx = train.trainStopTimeList.findIndex(
        (t) => t.trainRouteStopDTO.stationSequenceNumber === Number(lastStationNumber)
      );

      const lastStop = train.trainStopTimeList[stopIdx];
      const nextStop = train.trainStopTimeList[stopIdx + 1];

      if (!lastStop || !nextStop || segment.length === 0) return null;

      const totalTime = getTimeDiffInSeconds(lastStop.trainStopTime, nextStop.trainStopTime);
      const intervalPerStep = totalTime / segment.length;

      return {
        trainId: train.id,
        trainName: train.name,
        lastStationName: lastStation?.stationName,
        nextStationName: nextStation?.stationName,
        lastStationNumber: Number(lastStation?.stationNumber),
        nextStationNumber: Number(nextStation?.stationNumber),
        trainStopTimeList: train.trainStopTimeList,
        routeName: train.routeName,
        segment,
        centerLatitude: train.centerLatitude,
        centerLongitude: train.centerLongitude,
        zoomLevel: train.zoomLevel,
        currentIndex: 0,
        interval: intervalPerStep * 1000,
      };
    }).filter(Boolean) as LiveTrainProgress[];

    setLiveTrainProgress(updatedProgress);
  }, [activeTrains, allCoordMap]);

  return {
    liveTrainProgress,
    setLiveTrainProgress,
  };
}
