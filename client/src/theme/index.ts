import { Fade, ThemeOptions } from "@mui/material";

declare module '@mui/material' {
  interface Color {
    main?: string;
  }
}

const lightBoxShadow = 'var(--shadow-border) !important';
const darkBoxShadow = 'rgba(5, 5, 5, 0.35) 1px 1px 10px  !important';

const theme: ThemeOptions = {
  palette: {
    primary: {
      main: '#3365f6',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Inter',
    h1: {
      fontWeight: 500,
      fontSize: '2rem',
      color: 'var(--colors-gray-1000)'
    },
    h2: {
      fontWeight: 600,
      fontSize: '1.25rem',
      color: 'var(--colors-gray-1000)'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.17rem',
      color: 'var(--colors-gray-1000)'
    },
    subtitle1: {
      fontWeight: 400,
      fontSize: '14px',
      color: 'var(--colors-gray-1000)'
    },
    body1: {
      fontWeight: 400,
      fontSize: '14px',
      color: 'var(--colors-gray-1000)'
    },
    body2: {
      fontWeight: 300,
      fontSize: '14px',
      color: 'var(--colors-gray-900)'
    }
  },
  components: {
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true
      },
      styleOverrides: {
        root: {
          '&.MuiButton-sizeMedium': {
            padding: '3.5px 10px'
          },
          '&.btn-default': {
            borderColor: '#e7e7e7',
            borderStyle: 'solid',
            borderWidth: '1px',
            borderRadius: '6px',
            color: 'var(--colors-gray-1000)',
            '& .MuiSvgIcon-root': {
              opacity: 0.4
            },
            '&:hover': {
              background: 'var(--colors-gray-100)',
              borderColor: '#e7e7e7'
            }
          }
        }
      }
    },
    MuiTouchRipple: {
      styleOverrides: {
        ripple: {
          animationDuration: '250ms !important'
        }
      }
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          marginLeft: '2px',
          marginTop: '0'
        }
      }
    },
    MuiTooltip: {
      defaultProps: {
        arrow: false,
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: lightBoxShadow,
          padding: '0 !important'
        }
      },
      defaultProps: {
        transitionDuration: 250,
        disableScrollLock: true,
        TransitionComponent: Fade
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: lightBoxShadow,
          padding: '0 !important'
        }
      }
    },
    // MuiPickersPopper: {
    //   styleOverrides: {
    //     paper: {
    //       boxShadow: lightBoxShadow,
    //       padding: '0 !important'
    //     }
    //   }
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: lightBoxShadow,
          borderRadius: '6px',
          padding: '24px'
        }
      }
    },
    MuiButton: {
      defaultProps: {
        disableFocusRipple: true
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          fontWeight: 400,
          borderRadius: '6px',
          transitionDuration: '0s',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    // MuiLoadingButton: {
    //   defaultProps: { disableFocusRipple: true },
    //   styleOverrides: {
    //     root: {
    //       textTransform: 'none',
    //       boxShadow: 'none',
    //       fontWeight: 400,
    //       borderRadius: '6px',
    //       transitionDuration: '0s',
    //       '&:hover': {
    //         boxShadow: 'none'
    //       }
    //     }
    //   }
    // },
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          style: {
            fontWeight: 300
          }
        },
        inputProps: {
          style: {
            fontWeight: 400
          }
        },
      },
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: '6px',
            borderColor: '#e7e7e7'
          },
          '& .MuiInputBase-inputSizeSmall': {
            padding: '11px 12px !important'
          }
        }
      }
    },
    MuiAlertTitle: {
      defaultProps: {
        style: {
          fontWeight: 300
        }
      }
    },
    MuiTab: {
      defaultProps: {
        style: {
          textTransform: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: '6px'
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: { disableFocusRipple: true },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          textTransform: 'none'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 35,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(14px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: 'var(--colors-primary)',
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#f5f5f5'

            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.7
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 16,
            height: 16,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#E9E9EA',
            opacity: 1,
            transition: 'background-color 500ms'
          }
        }
      }
    }
  }
};

const darkThemeOverrides: ThemeOptions = {
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderColor: '#333333'
          }
        }
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: darkBoxShadow,
          padding: '0 !important'
        }
      },
      defaultProps: {
        transitionDuration: 150,
        disableScrollLock: true
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: darkBoxShadow,
          padding: '0 !important'
        }
      }
    },
    // MuiPickersPopper: {
    //   styleOverrides: {
    //     paper: {
    //       boxShadow: darkBoxShadow,
    //       padding: '0 !important'
    //     }
    //   }
    // },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: darkBoxShadow,
          borderRadius: '6px',
          padding: '24px'
        }
      }
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 40,
          height: 20,
          padding: 0,
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(19px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: 'var(--colors-primary)',
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#33cf4d',
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#757575'

            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.3
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 16,
            height: 16,
          },
          '& .MuiSwitch-track': {
            borderRadius: 26 / 2,
            backgroundColor: '#39393D',
            opacity: 1,
            transition: 'background-color 500ms'
          }
        }
      }
    }
  }
};

export default theme;

export { darkThemeOverrides };