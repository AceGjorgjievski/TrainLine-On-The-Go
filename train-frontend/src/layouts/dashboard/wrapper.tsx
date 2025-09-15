"use client";

import dynamic from "next/dynamic";

const DashBoardLayout = dynamic(() => import("./index"), {
  loading: () => <div>Loading Dashbaord</div>,
  ssr: false,
});

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashBoardLayout>{children}</DashBoardLayout>;
}
