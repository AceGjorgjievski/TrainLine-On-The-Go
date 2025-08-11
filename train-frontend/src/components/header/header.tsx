"use client";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Container, IconButton, Menu, MenuItem, Stack } from "@mui/material";
import { Link, routing, usePathname, useRouter } from "../../../i18n/routing";
import LanguageIcon from "@mui/icons-material/Language";
import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";


export default function Header() {
  const { locales } = routing;
  const pathname = usePathname();
  const router = useRouter();
  const t = useTranslations("Locale");
  const tHeader = useTranslations("Header");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (locale: string | null = null) => {
    setAnchorEl(null);
    if (locale) {
      router.push(pathname, { locale });
    }
  };

  return (
    <Box
      component="header"
      sx={{
        borderBottom: "1px solid black",
        py: 2,
        backgroundColor: "cyan",
      }}
    >
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography>
          <Link href="/">
            {tHeader('home')}
          </Link>
        </Typography>
        <Stack direction="row" spacing={4}>
          <Link href="/timetable" color="text.primary">
            {tHeader('timetable')}
          </Link>
          <Link href="/live" color="text.primary">
            {tHeader('live')}
          </Link>
          <Link href="/login" color="text.primary">
            Login
          </Link>
          <IconButton onClick={handleClick} color="inherit">
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
