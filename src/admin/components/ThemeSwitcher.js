import React from "react";
import Button from "@mui/material/Button";
import {
    LightMode as LightModeIcon,
    DarkMode as DarkModeIcon,
  } from "@mui/icons-material";
import { lightTheme, darkTheme } from "../../themes/theme";
import { useTheme, ThemeProvider } from "../context/ThemeContext";


export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  const handleToggleTheme = () => {
    const newTheme = theme.palette.mode === "dark" ? lightTheme : darkTheme;
    toggleTheme(newTheme);
  };

  return (
    <ThemeProvider theme={theme}>
      <Button onClick={handleToggleTheme} color="inherit">
        {theme.palette.mode === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
      </Button>
    </ThemeProvider>
  );
}
