"use client";

import { useAuthContext } from "@/auth/hooks";
import {
  Button,
  Toolbar,
  CardContent,
  Card,
  FormControl,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import Image from "next/image";
import { useState } from "react";
import { Link, usePathname, useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";
import { useTranslations } from "next-intl";

export default function LoginView() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathName = usePathname();

  const { login } = useAuthContext();
  const tLogin = useTranslations("Login");

  const onSubmit = async () => {
    try {
      setError(null);
      if (username.trim() === "" || password.trim() === "") {
        setError("Username and password cannot be empty.");
        return;
      }
      sessionStorage.removeItem("accessToken");
      await login(username, password);

      if (pathName) {
        router.replace(paths.home());
      }
    } catch (err) {
      setError("Login error: " + err);
      console.log(err);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url('/images/login_page_background.png')`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        px: { xs: 2, sm: 4, md: 8, lg: 16 },
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 550,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          boxShadow: 6,
          borderRadius: 3,
          height: 600,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ mt: 5, mb: 8 }}
          >
            {tLogin("title")}
          </Typography>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
          >
            <FormControl fullWidth sx={{ gap: 3 }}>
              <TextField
                required
                label={tLogin("username")}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
              />

              <TextField
                required
                label={tLogin("password")}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              {error && (
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  color="error"
                  variant="body2"
                >
                  {error}
                </Typography>
              )}

              <Button variant="contained" type="submit" sx={{ mt: 5 }}>
                {tLogin("button-login")}
              </Button>

              <Link href={paths.home()} passHref>
                <Typography
                  variant="body2"
                  align="center"
                  sx={{
                    textDecoration: "underline",
                    color: "primary.main",
                    cursor: "pointer",
                  }}
                >
                  {tLogin("link-home-page")}
                </Typography>
              </Link>
              <Toolbar
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  src="/images/train-logo.png"
                  alt="Logo"
                  width={150}
                  height={70}
                  onClick={() => router.push(paths.home())}
                  style={{
                    cursor: "pointer",
                    transition: "all 0.7s ease",
                    textShadow: "inherit",
                  }}
                />
              </Toolbar>
            </FormControl>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
