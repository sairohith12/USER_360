import React, { useState } from "react";
import { Box } from "@mui/material";
import TabsHeader from "./tabHeader";
import TabItemPOS from "./tabItemPos";
import TabItemRoom from "./tabItemRoom";

const ModernTabs: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0); // Default Room tab selected

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <Box sx={{ paddingY: 3 }}>
      <TabsHeader value={tabIndex} onChange={handleChange} />

      {/* Render Content based on tab */}
      {tabIndex === 0 && <TabItemRoom />}
      {tabIndex === 1 && <TabItemPOS />}
    </Box>
  );
};

export default ModernTabs;
