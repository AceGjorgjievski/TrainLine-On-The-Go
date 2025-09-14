import { Coord } from "@/types";

export const getTimeDiffInSeconds = (time1: string, time2: string): number => {
  const [h1, m1, s1] = time1.split(":").map(Number);
  const [h2, m2, s2] = time2.split(":").map(Number);

  //without seconds - dont add
  const totalSeconds1 = h1 * 3600 + m1 * 60;
  const totalSeconds2 = h2 * 3600 + m2 * 60;

  return totalSeconds2 - totalSeconds1;
};

export const findStationsBetween = (
  coord: Coord[],
  lastStationNumber: string
) => {
  const currentIdx = coord.findIndex(
    (c) => c.stationNumber === lastStationNumber
  );
  if (currentIdx === -1) {
    return { lastStation: null, nextStation: null, segment: [] };
  }

  const lastStationNum = parseInt(lastStationNumber);
  const nextStationNum = lastStationNum + 1;
  const nextStationNumber = nextStationNum.toString();

  const nextIdx = coord.findIndex((c) => c.stationNumber === nextStationNumber);

  if (nextIdx === -1) {
    return { lastStation: coord[currentIdx], nextStation: null, segment: [] };
  }

  const segment = coord.slice(currentIdx, nextIdx + 1);

  return {
    lastStation: coord[currentIdx],
    nextStation: coord[nextIdx],
    segment,
  };
};
