const theme = {
  palette: {
    primary: {
      main: '#2399ef',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Montserrat',
  },
  components: {
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important',
          padding: '0 !important'
        }
      }
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important',
          padding: '0 !important'
        }
      }
    },
    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          boxShadow: '0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%) !important',
          padding: '0 !important'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'rgb(95 116 141 / 3%) 0px 2px 1px -1px, rgb(95 116 141 / 4%) 0px 1px 1px 0px, rgb(95 116 141 / 8%) 0px 1px 3px 0px',
          borderRadius: '8px',
          padding: '24px'
        }
      }
    },
    MuiButton: {
      defaultProps: {},
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
    MuiLoadingButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
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
    MuiTextField: {
      defaultProps: {
        InputLabelProps: {
          sx: {
            fontWeight: 300
          }
        },
        inputProps: {
          sx: {
            fontWeight: 400
          }
        },
      },
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: '8px',
          }
        }
      }
    },
    MuiAlertTitle: {
      defaultProps: {
        sx: {
          fontWeight: 300
        }
      }
    },
    MuiTab: {
      defaultProps: {
        sx: {
          textTransform: 'none'
        }
      }
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '& fieldset': {
            borderRadius: '8px'
          }
        }
      }
    }
  }
};

export default theme;