import { createTheme } from "@mui/material";
import themeConfig, { darkThemeOverrides } from "../theme";

function hexToRgb(hex) {
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

function updateTheme(setTheme, mode) {
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
  setTheme(createTheme(newThemeObject));
}

export {
  hexToRgb,
  updateTheme
};