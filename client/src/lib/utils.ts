import { ThemeOptions, createTheme } from "@mui/material";
import themeConfig, { darkThemeOverrides } from "../theme";
import { Theme } from "@mui/material";
import { AppTheme } from "./constants";
import { AxiosError } from "axios";

function hexToRgb(hex = AppTheme.Colors.primary) {
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function updateTheme(setTheme: (theme: Theme) => void, mode?: string) {
  if (!mode) {
    mode = localStorage.getItem('theme') || 'light';
  }

  localStorage.setItem('theme', mode);

  const newThemeObject = {
    ...themeConfig,
    palette: {
      ...themeConfig.palette,
      mode: mode
    },
    components: {
      ...themeConfig.components,
      ...(mode === 'dark' ? darkThemeOverrides.components : {})
    }
  };

  document.body.className = mode;
  setTheme(createTheme(newThemeObject as ThemeOptions));
}

function getErrorObject(error: unknown) {
  if (error instanceof AxiosError) {
    return {
      message: error.response?.data.message || 'Something went wrong, please try again.',
      errors: error.response?.data.errors || []
    };
  } else if (error instanceof Error) {
    return {
      message: error.message || 'Something went wrong, please try again.'
    };
  }

  return {
    message: 'Something went wrong...'
  };
}

export {
  hexToRgb,
  updateTheme,
  getErrorObject
};