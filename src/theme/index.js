const theme = {
  palette: {
    primary: {
      main: '#2399ef',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Inter',
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
          boxShadow: 'rgba(204, 207, 242, 0.4) 0px 7px 24px 0px',
          borderRadius: '20px',
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
          borderRadius: '12px',
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
          borderRadius: '12px',
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