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
        overflow: 'hidden'
      }}
    >
      {children}
    </Box>
  );
}
