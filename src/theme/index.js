const theme = {
  palette: {
    primary: {
      main: '#2399ef',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Montserrat'
  },
  components: {
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
            fontWeight: 300
          }
        }
      },
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
    }
  }
};

export default theme;