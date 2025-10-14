"use client";
import SplashScreen from "@/components/loading-screen/loading-screen";
import dynamic from "next/dynamic";

const DashBoardLayout = dynamic(() => import("./index"), {
  loading: () => <SplashScreen/>,
  ssr: false,
});

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashBoardLayout>{children}</DashBoardLayout>;
}
