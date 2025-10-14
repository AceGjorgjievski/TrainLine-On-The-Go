"use client";
import SplashScreen from "@/components/loading-screen/loading-screen";
import dynamic from "next/dynamic";
import { usePathname } from "../../../i18n/routing";

const DashboardLayout = dynamic(() => import("./index"), {
  loading: () => <SplashScreen />,
  ssr: false,
});

const publicRoutes = ["/login"];

export default function DashboardClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (isPublicRoute) {
    return <>{children}</>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
