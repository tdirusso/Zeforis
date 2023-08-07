const theme = {
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
    MuiTooltip: {
      defaultProps: {
        arrow: true,
      }
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: 'rgba(204, 207, 242, 0.4) 0px 7px 24px 0px !important',
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
          boxShadow: 'rgba(204, 207, 242, 0.4) 0px 7px 24px 0px !important',
          padding: '0 !important'
        }
      }
    },
    MuiPickersPopper: {
      styleOverrides: {
        paper: {
          boxShadow: 'rgba(204, 207, 242, 0.4) 0px 7px 24px 0px !important',
          padding: '0 !important'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: 'rgba(204, 207, 242, 0.4) 0px 7px 24px 0px',
          borderRadius: '24px',
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
          borderRadius: '12px',
          transitionDuration: '0s',
          '&:hover': {
            boxShadow: 'none'
          }
        }
      }
    },
    MuiLoadingButton: {
      defaultProps: { disableFocusRipple: true },
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
            borderRadius: '12px',
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
            borderRadius: '12px'
          }
        }
      }
    },
    MuiIconButton: {
      defaultProps: { disableFocusRipple: true },
    }
  }
};

export default theme;