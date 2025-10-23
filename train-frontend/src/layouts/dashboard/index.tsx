"use client";

import { useEffect } from "react";
import { useResponsive } from "@/hooks";
import { useSidebarContext } from "@/components/context";

import DashBoardDesktopLayout from "./dashboard-desktop-layout";
import DashBoardMobileLayout from "./daskboard-mobile-layout";

type Props = {
  children: React.ReactNode;
};

export default function DashBoardLayout({ children }: Props) {
  const { toggleCollapse } = useSidebarContext();
  const isSmUp = useResponsive("up", "sm");

  useEffect(() => {

    if (isSmUp) {
      toggleCollapse();
    }
  }, []);

  return (
    <>
      {isSmUp ? (
        <DashBoardDesktopLayout>{children}</DashBoardDesktopLayout>
      ) : (
        <DashBoardMobileLayout>{children}</DashBoardMobileLayout>
      )}
    </>
  );
}
