"use client";

import { Paper, Box, Typography, colors } from "@mui/material";
import { useEffect, useState } from "react";
import TrainsAdminView from "./trains/view";
import TrainStopsAdminView from "./train-stops/view";
import TrainRoutesAdminView from "./train-routes/view";
import { useTranslations } from "next-intl";

const TrainsView = () => <TrainsAdminView />;
const TrainStopsView = () => <TrainStopsAdminView />;
const TrainRoutesView = () => <TrainRoutesAdminView />;

const adminCards = [
  {
    key: "view-all-trains",
    color: colors.purple[700],
    hoverColor: colors.purple[500],
    component: <TrainsView />,
  },
  {
    key: "view-all-train-stops",
    color: colors.purple[700],
    hoverColor: colors.purple[500],
    component: <TrainStopsView />,
  },
  {
    key: "view-all-train-routes",
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
  const tAdminTrains = useTranslations("AdminPage");

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: {
            xs: 2,
            sm: 5,
          },
          justifyContent: "center",
          "& > :not(style)": {
            mt: 2,
            width: {
              md: '220px',
              sm: '180px',
              xs: '200px'
            },
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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
                textAlign: "center",
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                color="white"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%"
                }}
              >
                {tAdminTrains(card.key + ".title")}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      <Box mt={4}>{selectedCard?.component}</Box>
    </>
  );
}
