export type RouteKey = "tabanovce"
  | "veles"
  | "gevgelija"
  | "bitola"
  | "kochani"
  | "kichevo"
  | "prishtina";

export type Direction = "arrival" | "departure";

export type ViewOptions = "stations" | "live";

export type FormData = {
  direction: Direction;
  route: RouteKey;
  viewOption: ViewOptions;
  showAllLiveTrains?: boolean
}