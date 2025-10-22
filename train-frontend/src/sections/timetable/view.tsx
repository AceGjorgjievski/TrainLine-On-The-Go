"use client";

import { useResponsive } from "@/hooks";
import TimetableDesktopView from "./timetable-desktop-view";
import TimetableMobileView from "./timetable-mobile-view";

export default function TimeTableView() {
  const isSmUp = useResponsive("up", "sm");

  return <>{isSmUp ? <TimetableDesktopView /> : <TimetableMobileView />}</>;
}
