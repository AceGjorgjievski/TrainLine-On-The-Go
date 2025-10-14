"use client";

import { useAuthContext } from "@/auth/hooks";
import { Box } from "@mui/material";
import { useTranslations } from "next-intl";

export default function HomeView() {
  const t = useTranslations("Home");
  const { user } = useAuthContext();

  return (
    <>
      <Box sx={{ position: "relative" }}>
        <video
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{
            width: "105%",
            height: "100vh",
            objectFit: "cover",
            display: "block",
            marginLeft: "-2rem",
            pointerEvents: "none",
          }}
        >
          <source src="/videos/train_video_home_page.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            textShadow: "0 0 10px rgba(0,0,0,0.7)",
          }}
        >
          <h1>Welcome to the Train System</h1>
        </Box>
      </Box>
    </>
  );
}
