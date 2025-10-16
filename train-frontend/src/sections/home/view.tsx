"use client";

import { useAuthContext } from "@/auth/hooks";
import { Box, Typography } from "@mui/material";
import { useTranslations } from "next-intl";
import Typewriter from "typewriter-effect";

export default function HomeView() {
  const tHome = useTranslations("Home");
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
            height: "97vh",
            objectFit: "cover",
            display: "block",
            marginLeft: "-2rem",
            pointerEvents: "none",
          }}
        >
          <source src="/videos/train_video_home_page.mp4" type="video/mp4" />
          {tHome("video-additional-message")}
        </video>

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
        ></Box>
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
            flexDirection: "column",
            textAlign: "center",
            px: 2,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              mt: 5,
              fontWeight: "bold",
              fontFamily: "'Anton', sans-serif",
              color: "#ffffffff",
              letterSpacing: 2,
              textShadow: "2px 2px 4px rgba(164, 155, 155, 0.8)",
              border: "2px solod white",
              WebkitTextStroke: "0.3px #000000ff",
            }}
          >
            {tHome("screen-title")}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 900,
              fontFamily: "'Anton', sans-serif",
              textTransform: "uppercase",
              color: "#FFD700",
              letterSpacing: 3,
              textShadow: "2px 2px 4px rgba(164, 155, 155, 0.8)",
              WebkitTextStroke: "0.3px #000000ff",
            }}
          >
            {tHome("screen-subtitle")}
          </Typography>

          <Typography
            variant="h2"
            sx={{
              mb: 2,
              mt: 7,
              fontWeight: "bold",
              fontFamily: "'Anton', sans-serif",
              color: "#90ea4fff",
              letterSpacing: 2,
              textShadow: "1px 1px 3px rgba(0,0,0,0.4)",
              WebkitTextStroke: "0.3px #000000ff",
            }}
          >
            <Typewriter
              options={{
                strings: [
                  tHome("screen-subtitle-typewriter-word-one"),
                  tHome("screen-subtitle-typewriter-word-two"),
                  tHome("screen-subtitle-typewriter-word-three")
                ],
                autoStart: true,
                loop: true,
                delay: 200,
              }}
            />
          </Typography>
        </Box>
      </Box>
    </>
  );
}
