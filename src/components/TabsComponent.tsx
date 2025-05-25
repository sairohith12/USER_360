import React, { useState } from "react";
import { Tabs, Tab, Box, Typography, useTheme, Paper } from "@mui/material";
import { AccountCircle, Hotel } from "@mui/icons-material";

const TabsComponent: React.FC = () => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState(0); // State for the selected tab

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue); // Update selected tab
  };

  return (
    <Box
      sx={{
        maxWidth: 500,
        margin: "auto",
        borderRadius: "16px", // Rounded corners for container
        overflow: "hidden",
        boxShadow: theme.shadows[5],
      }}
    >
      {/* Tab Header */}
      <Tabs
        value={selectedTab}
        onChange={handleTabChange}
        variant="fullWidth"
        indicatorColor="secondary"
        textColor="inherit"
        sx={{
          backgroundColor: theme.palette.primary.main, // Tab header background
          borderRadius: "16px", // Rounded corners for the tab header
          boxShadow: theme.shadows[1],
        }}
      >
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <AccountCircle sx={{ marginRight: 1 }} />
              <Typography>POS</Typography>
            </Box>
          }
          sx={{
            textTransform: "none", // Disable text transform
            fontWeight: 600,
            fontSize: "14px", // Adjusted for modern look
            borderRadius: "12px", // Rounded corners for each tab
            transition: "background-color 0.3s ease-in-out",
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main, // Active tab background
              color: theme.palette.background.paper,
            },
            "&:hover": {
              backgroundColor: theme.palette.primary.dark, // Hover effect
            },
          }}
        />
        <Tab
          label={
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Hotel sx={{ marginRight: 1 }} />
              <Typography>ROOM</Typography>
            </Box>
          }
          sx={{
            textTransform: "none",
            fontWeight: 600,
            fontSize: "14px",
            borderRadius: "12px",
            transition: "background-color 0.3s ease-in-out",
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.background.paper,
            },
            "&:hover": {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ padding: 3 }}>
        {selectedTab === 0 && (
          <Paper
            sx={{
              padding: 2,
              borderRadius: "12px",
              backgroundColor: theme.palette.background.default,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography variant="h6" color="text.primary">
              POS Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Here is the POS-related content for the customer.
            </Typography>
          </Paper>
        )}
        {selectedTab === 1 && (
          <Paper
            sx={{
              padding: 2,
              borderRadius: "12px",
              backgroundColor: theme.palette.background.default,
              boxShadow: theme.shadows[2],
            }}
          >
            <Typography variant="h6" color="text.primary">
              Room Details
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This section will display room details and booking options.
            </Typography>
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default TabsComponent;
