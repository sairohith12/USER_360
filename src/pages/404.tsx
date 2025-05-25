// pages/404.tsx
import React from "react";
import { Button, Box, Typography } from "@mui/material";
import { useRouter } from "next/router";

const Custom404: React.FC = () => {
  const router = useRouter();

  const goHome = () => {
    router.push("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <Typography variant="h4" color="error">
        404 - Page Not Found
      </Typography>
      <Button onClick={goHome} variant="contained" sx={{ mt: 2 }}>
        Go to Home
      </Button>
    </Box>
  );
};

export default Custom404;
