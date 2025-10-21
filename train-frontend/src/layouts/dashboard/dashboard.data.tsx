import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { paths } from "@/routes/paths";
import { ReactNode } from "react";

type DrawerItem = {
  label: string;
  path: string;
  icon: ReactNode
};

export const drawerItems: DrawerItem[] = [
  {
    label: "Home",
    path: paths.home(),
    icon: <HomeIcon />,
  },
  {
    label: "Timetable",
    path: paths.timetable(),
    icon: <ScheduleIcon />,
  },
  {
    label: "Live",
    path: paths.live(),
    icon: <LiveTvIcon />,
  },
  {
    label: "Admin",
    path: paths.admin.root(),
    icon: <AdminPanelSettingsIcon />,
  },
];
