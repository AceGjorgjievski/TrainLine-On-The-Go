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
import { useLocale, useTranslations } from "next-intl";

import { useState } from "react";
import { useAuthContext } from "@/auth/hooks";
import { paths } from "@/routes/paths";
import { routing, usePathname, useRouter } from "../../../i18n/routing";

export default function Header() {
  const { locales } = routing;
  const { authenticated, logout } = useAuthContext();
  console.log("auth", authenticated);
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Locale");
  const tHeader = useTranslations("Header");
  const locale = useLocale();

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
        zIndex: (theme) => theme.zIndex.appBar + 1,
        bgcolor: "background.paper",
        borderBottom: "1px solid black",
        py: 2,
        paddingBottom: "0.5rem",
        boxShadow: 5,
      }}
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>{tHeader("title")}</Typography>
        <Stack direction="row" spacing={2}>
          {!authenticated && (
            <Button variant="contained" onClick={loginUser} size="small">
              Login
            </Button>
          )}

          {authenticated && (
            <>
              <Button variant="contained" onClick={logoutUser} size="small">
                Log out
              </Button>
            </>
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
                  style={{ marginRight: 8 }}
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
