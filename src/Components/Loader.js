import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loader = () => {
  return (
    <Box display="flex" justifyContent="center" marginTop={20}>
      <CircularProgress />
    </Box>
  );
};

export default Loader;
