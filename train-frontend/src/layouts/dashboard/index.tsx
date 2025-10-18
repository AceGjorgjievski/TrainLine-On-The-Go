"use client";

import {
  Box,
  colors,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ScheduleIcon from "@mui/icons-material/Schedule";
import LiveTvIcon from "@mui/icons-material/LiveTv";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { usePathname, useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";
import { useAuthContext } from "@/auth/hooks";
import { useSidebarContext } from "@/components/context";
import { useTranslations } from "next-intl";

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

type Props = {
  children: React.ReactNode;
};

export default function DashBoardLayout({ children }: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const tDashboard = useTranslations("Dashboard");

  const { isCollapsed, toggleCollapse } = useSidebarContext();
  const drawerWidth = isCollapsed ? 90 : 240;

  const { authenticated } = useAuthContext();

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
              top: "88px",
              overflowX: "hidden",
              transition: "width 0.3s ease",
              boxSizing: "border-box",
            },
            zIndex: 3,
          }}
        >
          <Box sx={{ overflow: "auto" }}>
            <List>
              {drawerItems
                .filter((item) => item.label !== "Admin" || authenticated)
                .map(({ label, path, icon }, index) => {
                  const selected = pathName === path;
                  return (
                    <Tooltip
                      title={isCollapsed ? label : ""}
                      placement="right"
                      key={index}
                      arrow
                    >
                      <ListItem
                        disablePadding
                        sx={{
                          justifyContent: isCollapsed ? "center" : "flex-start",
                        }}
                      >
                        <ListItemButton
                          selected={selected}
                          onClick={() => handleNavigate(path)}
                          sx={{
                            marginTop: "1rem",
                            justifyContent: isCollapsed
                              ? "center"
                              : "flex-start",
                            bgcolor: selected ? colors.purple[500] : "",
                            color: selected ? "#fff" : "#000",
                            "&:hover": {
                              bgcolor: colors.purple[300],
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
                              minWidth: 0,
                              mr: isCollapsed ? 0 : 2,
                              justifyContent: "center",
                            },
                          }}
                        >
                          <ListItemIcon>{icon}</ListItemIcon>
                          {!isCollapsed && (
                            <ListItemText
                              primary={tDashboard(label.toLocaleLowerCase())}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    </Tooltip>
                  );
                })}
            </List>
          </Box>
        </Drawer>
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: isCollapsed ? 68 : 220,
            transition: "left 0.3s ease",
            zIndex: 3,
          }}
        >
          <IconButton
            onClick={() => toggleCollapse()}
            sx={{
              background: "#fff",
              boxShadow: 10,
              borderRadius: "50%",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            {isCollapsed ? (
              <KeyboardDoubleArrowRightIcon />
            ) : (
              <KeyboardDoubleArrowLeftIcon />
            )}
          </IconButton>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            transition: "padding-left 0.5s ease",
            height: "100vh",
            overflowY: "auto",
            px: 0,
            mx: 0,
          }}
        >
          <Box sx={{ flexGrow: 1, px: 0, mx: 0 }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}
