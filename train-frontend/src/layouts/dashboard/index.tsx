"use client";

import { Header } from "@/components/header";
import {
  Box,
  colors,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

import { usePathname, useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";

type Props = {
  children: React.ReactNode;
};

const drawerWidth = 240;
const drawerItems = [
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

export default function DashBoardLayout({ children }: Props) {
  const router = useRouter();
  const pathName = usePathname();

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar>Logo</Toolbar>
          <Divider />
          <Box sx={{ overflow: "auto" }}>
            <List>
              {drawerItems.map(({ label, path, icon }, index) => {
                const selected = pathName === path;
                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton
                      selected={selected}
                      onClick={() => handleNavigate(path)}
                      sx={{
                        marginTop: "1rem",
                        bgcolor: selected ? colors.purple[500] : "",
                        color: selected ? "#d93232ff" : "#000",
                        "& .MuiListItemText-primary": {
                          fontWeight: "bold",
                          color: selected ? "#fff" : "#000",
                        },
                        "&:hover": {
                          bgcolor: colors.purple[300],
                        },
                        "&:hover .MuiListItemText-primary": {
                          color: "#fff",
                        },
                        "&.Mui-selected": {
                          bgcolor: colors.purple[500],
                          color: "#fff",
                        },
                        "&.Mui-selected:hover": {
                          bgcolor: colors.purple[600],
                          color: "#fff",
                        },
                        "& .MuiListItemIcon-root": {
                          color: selected ? "#fff" : "#000",
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40 }}>{icon}</ListItemIcon>

                      <ListItemText primary={label} />
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
          }}
        >
          <Header />

          <Box sx={{ flexGrow: 1, p: 0 }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}
