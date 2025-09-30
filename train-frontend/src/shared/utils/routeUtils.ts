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

export function parseRouteName(routeName: string): {
  route: RouteKey | null;
  direction: Direction | null;
} {
  for (const key in fromSkopjeRouteNameMap) {
    const typedKey = key as RouteKey;
    if (fromSkopjeRouteNameMap[typedKey] === routeName) {
      return {
        route: typedKey,
        direction: "departure",
      };
    }
  }

  for (const key in toSkopjeRouteNameMap) {
    const typedKey = key as RouteKey;
    if (toSkopjeRouteNameMap[typedKey] === routeName) {
      return {
        route: typedKey,
        direction: "arrival",
      };
    }
  }

  return { route: null, direction: null };
}