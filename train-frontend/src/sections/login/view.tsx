"use client";

import { useAuthContext } from "@/auth/hooks";
import {
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import { useState } from "react";
import { Link, usePathname, useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";

export default function LoginView() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const pathName = usePathname();

  const { login } = useAuthContext();

  const onSubmit = async () => {
    try {
      setError(null);
      sessionStorage.removeItem("accessToken");
      await login(username, password);

      if (pathName) {
        router.replace(paths.home());
      }
    } catch (err) {
      setError("Login failed");
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
      <Container
        maxWidth="sm"
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          p: { xs: 3, sm: 4 },
          borderRadius: 2,
          boxShadow: 3,
          width: "100%",
          maxWidth: "500px",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            mt: 3,
            mb: 3,
          }}
        >
          Login Page
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
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <TextField
              required
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              type="submit"
              sx={{
                mt: 3,
              }}
            >
              Log in
            </Button>
            <Link href={paths.home()} passHref>
              <Typography
                variant="body2"
                align="center"
                sx={{
                  mt: 2,
                  textDecoration: "underline",
                  color: "primary.main",
                  cursor: "pointer",
                }}
              >
                Go to Home Page
              </Typography>
            </Link>
          </FormControl>
        </form>
      </Container>
    </Box>
  );
}
