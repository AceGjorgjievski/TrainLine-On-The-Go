"use client";

import { Header } from "@/components/header";
import {
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};
const drawerWidth = 240;

export default function DashBoardLayout({ children }: Props) {
  const router = useRouter();
  const [selectedNavBar, setselectedNavBar] = useState<number>(0);

  const handleNavigate = (path: string, index: number) => {
    const validPath = path as keyof typeof paths;
    setselectedNavBar(index);
    router.push(paths[validPath]());
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
          <Toolbar>
            Logo
          </Toolbar>
          <Divider/>
          <Box sx={{ overflow: "auto" }}>
            <List>
              {["Home", "Timetable", "Live"].map((text, index) => {
                const path = text.toLowerCase();
                return (
                  <ListItem key={index} disablePadding>
                    <ListItemButton selected={selectedNavBar === index} onClick={() => handleNavigate(path, index)}>
                      <ListItemText primary={text} />
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

          <Box sx={{ flexGrow: 1, p: 3 }}>{children}</Box>
        </Box>
      </Box>
    </>
  );
}
