import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const PlaceholderComponent: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh", // Full height
        textAlign: "center",
        gap: 2,
      }}
    >
      <CircularProgress />
      <Typography variant="h6" sx={{ marginTop: 2 }}>
        Loading, please wait...
      </Typography>
    </Box>
  );
};

export default PlaceholderComponent;
