"use client";

import { Paper, Box, Typography, colors } from "@mui/material";
import { useEffect, useState } from "react";
import TrainsAdminView from "./trains/view";
import TrainStopsAdminView from "./train-stops/view";
import TrainRoutesAdminView from "./train-routes/view";

const TrainsView = () => <TrainsAdminView />;
const TrainStopsView = () => <TrainStopsAdminView />;
const TrainRoutesView = () => <TrainRoutesAdminView />;

const adminCards = [
  {
    label: "View All Trains",
    key: "trains",
    color: colors.purple[700],
    hoverColor: colors.purple[500],
    component: <TrainsView />,
  },
  {
    label: "View All Train Stops",
    key: "trainStops",
    color: colors.purple[700],
    hoverColor: colors.purple[500],
    component: <TrainStopsView />,
  },
  {
    label: "View All Train Routes",
    key: "trainRoutes",
    color: colors.purple[700],
    hoverColor: colors.purple[500],
    component: <TrainRoutesView />,
  },
];

export default function AdminDashboardView() {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const selectedCard = adminCards.find((card) => card.key === selectedKey);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          justifyContent: "center",
          "& > :not(style)": {
            mt: 4,
            width: 220,
            height: 120,
          },
        }}
      >
        {adminCards.map((card) => (
          <Paper
            key={card.key}
            elevation={3}
            onClick={() => setSelectedKey(card.key)}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: card.color,
              cursor: "pointer",
              transition: "transform .3s, box-shadow .3s, background-color .3s",
              borderRadius: 2,
              boxShadow: 5,
              border: "2px solid",
              transform: selectedKey === card.key ? "scale(1.2)" : "scale(1)",
              "&:hover": {
                transform: "scale(1.2)",
                boxShadow: 12,
                bgcolor: card.hoverColor,
              },
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white">
              {card.label}
            </Typography>
          </Paper>
        ))}
      </Box>

      <Box mt={4}>{selectedCard?.component}</Box>
    </>
  );
}
