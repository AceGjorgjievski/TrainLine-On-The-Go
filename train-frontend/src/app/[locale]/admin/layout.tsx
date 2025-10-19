"use client";

import { AuthGuard } from "@/auth/guard";
import { Box, colors } from "@mui/material";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <Box
      sx={{
        height: "100%",
        bgcolor: colors.blue[50],
        padding: 0,
        margin: 0,
      }}
    >
      <AuthGuard>{children}</AuthGuard>
    </Box>
  );
}
