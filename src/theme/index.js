const theme = {
  palette: {
    primary: {
      main: '#267ffd',
      contrastText: '#ffffff'
    }
  },
  typography: {
    fontSize: 16,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableRipple: true
      },
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