import { fromSkopjeRouteNameMap, toSkopjeRouteNameMap } from "@/constants/routes";
import { Direction, RouteKey } from "@/types";


export const getJsonFilePath = (route: RouteKey, direction: Direction) => {
  const fullName = getFullRouteName(route, direction);
  const fileName = fullName.toLowerCase().replace(/\s+/g, "");
  return `/routes/${direction}/${fileName}.json`;
};

export const getFullRouteName = (route: RouteKey, direction: Direction): string => {
  return direction === "departure"
    ? fromSkopjeRouteNameMap[route]
    : toSkopjeRouteNameMap[route];
};