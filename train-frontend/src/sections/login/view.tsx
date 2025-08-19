"use client";

import { useAuthContext } from "@/auth/hooks";
import {
  Button,
  Container,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useRouter } from "@/routes/hooks";
import { paths } from "@/routes/paths";

export default function LoginView() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const { login } = useAuthContext();

  const onSubmit = async () => {
    try {
      setError(null);
      console.log(username, password);
      await login(username, password);

      router.replace(paths.home);
    } catch (err) {
      setError("Login failed");
      console.log(err);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ marginTop: "2rem" }}>
        <Typography sx={{ display: "flex", justifyContent: "center" }}>
          Login Page
        </Typography>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          <FormControl fullWidth sx={{ gap: 2 }}>
            <Typography>Enter username</Typography>
            <TextField
              required
              id="username"
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <Typography>Enter password</Typography>
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

            <Button variant="outlined" type="submit">
              Log in
            </Button>
          </FormControl>
        </form>
      </Container>
    </>
  );
}
