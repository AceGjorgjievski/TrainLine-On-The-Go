"use client";

import {
  Box,
  Typography,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import Image from "next/image";

import LanguageIcon from "@mui/icons-material/Language";
import { useTranslations } from "next-intl";

import { useState } from "react";
import { useAuthContext } from "@/auth/hooks";
import { paths } from "@/routes/paths";
import { routing, usePathname, useRouter } from "../../../i18n/routing";
import { useSidebarContext } from "../context";

export default function Header() {
  const { locales } = routing;
  const { authenticated, logout } = useAuthContext();
  const { isCollapsed } = useSidebarContext();
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Locale");
  const tHeader = useTranslations("Header");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const logoutUser = async () => {
    await logout();
    if (pathname === "/admin") {
      router.replace(paths.home());
    }
  };

  const loginUser = () => {
    const loginPath = paths.login();

    if (pathname !== loginPath) {
      router.push(paths.login());
    }
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (localeParam: string | null = null) => {
    setAnchorEl(null);
    if (localeParam) {
      router.push(pathname, { locale: localeParam });
    }
  };

  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 2,
        bgcolor: "background.paper",
        py: 2,
        paddingBottom: "0.5rem",
        boxShadow: 5,
        margin: 0,
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 0,
          width: "2000px",
          marginRight: "2rem",
        }}
      >
        <Box
          sx={{
            marginLeft: isCollapsed ? "-520px" : "-380px",
            transition: "margin-left 0.3s ease",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              fontWeight: "bold",
              fontSize: "1.5rem",
              textDecoration: "none",
              color: "text.primary",
              cursor: "pointer",
            }}
            onClick={() => router.push(paths.home())}
          >
            {tHeader("title")}
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={4}
          alignItems="center"
          sx={{
            marginLeft: "-2rem",
          }}
        >
          {!authenticated ? (
            <Button variant="contained" onClick={loginUser} size="small">
              {tHeader("login-button")}
            </Button>
          ) : (
            <Button variant="contained" onClick={logoutUser} size="small">
              {tHeader("logout-button")}
            </Button>
          )}

          <IconButton onClick={handleClick} color="primary">
            <LanguageIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={() => handleClose()}>
            {locales.map((loc) => (
              <MenuItem key={loc} onClick={() => handleClose(loc)}>
                <Image
                  src={`https://flagsapi.com/${t(
                    `${loc}.flagCode`
                  )}/shiny/24.png`}
                  alt={t(`${loc}.name`)}
                  width={24}
                  height={16}
                  style={{ marginRight: 3 }}
                />
                {t(`${loc}.name`)}
              </MenuItem>
            ))}
          </Menu>
        </Stack>
      </Container>
    </Box>
  );
}
