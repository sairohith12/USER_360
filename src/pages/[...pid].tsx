// pages/[...pid].tsx
import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography } from '@mui/material';
import { menuItems } from '@/config/menuItems';

// Find the matching component for a given path
const findComponentForPath = (path: string) => {
  for (const item of menuItems) {
    // Check for main item paths
    if (item.path === path) {
      return item.Component;
    }
    // Check for sub-item paths
    if (item.subItems) {
      const subItem = item.subItems.find((sub) => sub.path === path);
      if (subItem) {
        return subItem.Component;
      }
    }
  }
  // If no match, return a default component (e.g., a 404 page or a placeholder)
  const NotFoundComponent = () => <Typography>Page Not Found</Typography>;
  NotFoundComponent.displayName = 'NotFoundComponent';
  return NotFoundComponent;
};

const DynamicPage: React.FC = () => {
  const router = useRouter();
  const { pid } = router.query;
  // Ensure 'pid' is valid and handle path as a string
  const path = Array.isArray(pid) ? pid.join('/') : pid;
  const ComponentToRender = findComponentForPath(`/${path}` || '/');

  return (
    <Box sx={{ padding: 3 }}>
      {ComponentToRender ? <ComponentToRender /> : <Typography>Page Not Found</Typography>}
    </Box>
  );
};

export default DynamicPage;
