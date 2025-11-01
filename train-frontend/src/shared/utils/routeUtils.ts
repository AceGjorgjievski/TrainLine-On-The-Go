import { fromSkopjeRouteNameMap, toSkopjeRouteNameMap } from "@/constants/routes";
import { Direction, RouteKey } from "@/types";


export const checkIfJsonExists = async (route: string, direction: string): Promise<boolean> => {
  try {
    const fileName = route.toLowerCase().replace(/\s+/g, "");
    const filePath = `/routes/${direction}/${fileName}.json`;
    const response = await fetch(filePath);
    return response.ok;
  } catch (err) {
    console.error("Error checking JSON file:", err);
    return false;
  }
};

export const getJsonFilePath = (route: RouteKey | string, direction: Direction) => {
  const fullName = getFullRouteName(route as RouteKey, direction);
  const fileName = fullName.toLowerCase().replace(/\s+/g, "");
  return `/routes/${direction}/${fileName}.json`;
};

export const getFullRouteName = (route: RouteKey | string, direction: Direction): string => {
  if (route.includes("-")) {
    return route;
  }

  return direction === "departure"
    ? fromSkopjeRouteNameMap[route as RouteKey]
    : toSkopjeRouteNameMap[route as RouteKey];
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