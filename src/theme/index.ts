import { Fade, ThemeOptions } from "@mui/material";

declare module '@mui/material' {
  interface Color {
    main?: string;
  }
}

const lightBoxShadow = 'rgba(33, 33, 52, 0.1) 0px 1px 4px !important';
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
  },
  components: {
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
          borderRadius: '8px',
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
            borderColor: '#eeeeee'
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
          borderRadius: '8px',
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