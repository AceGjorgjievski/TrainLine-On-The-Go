"use client";

import { useResponsive } from "@/hooks";
import HomeDesktopView from "./home-desktop-view";
import HomeMobileView from "./home-mobile-view";

export default function HomeView() {
  const isSmUp = useResponsive("up", "sm");

  return <>{isSmUp ? <HomeDesktopView /> : <HomeMobileView />}</>;
}
