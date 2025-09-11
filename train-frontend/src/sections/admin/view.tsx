"use client";

import { Paper, Box, Typography, colors } from "@mui/material";
import { useRouter } from "../../../i18n/routing";
import { paths } from "@/routes/paths";


export default function AdminDashboardView() {
  const router = useRouter();

  return (
    <>
      <>Admin view</>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 256,
            height: 256,
          },
        }}
      >
        <Paper
          elevation={3}
          onClick={() => router.push(paths.admin.trains())}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: colors.cyan[100],
            cursor: "pointer",
            transition: "transform .3s, box-shadow .3s, background-color .3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 12,
              bgcolor: colors.green[200],
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            View All Trains
          </Typography>
        </Paper>
        <Paper
          elevation={3}
          onClick={() => router.push(paths.admin.trainStops())}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: colors.cyan[100],
            cursor: "pointer",
            transition: "transform .3s, box-shadow .3s, background-color .3s",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: 12,
              bgcolor: colors.green[200],
            },
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            View all Train Stops
          </Typography>
        </Paper>
      </Box>
    </>
  );
}
