declare module '*.jpg';
declare module '*.png';

interface Window {
  google?: {
    accounts?: any; // Replace 'any' with the actual type if possible
  },
  googleButtonInterval: NodeJS.Timeout;
}

// declare module '@mui/material' {
//   interface Test extends Theme {
//     main: string;
//   }
// }

// declare module '@mui/material/styles' {
//   type ColorPartial {
//     main: string;
//   }
// }

// declare module '@mui/material/styles' {
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     palette: {
//       primary: {
//         main: string;
//         contrastText: string;
//       };
//     };
//     typography: {
//       fontSize: number;
//       fontFamily: string;
//     };
//     components: {
//       MuiFormHelperText?: {
//         styleOverrides?: {
//           root?: {
//             marginLeft?: string;
//             marginTop?: string;
//           };
//         };
//       };
//       MuiTooltip?: {
//         defaultProps?: {
//           arrow?: boolean;
//         };
//       };
//       MuiMenu?: {
//         styleOverrides?: {
//           paper?: {
//             boxShadow?: string;
//             padding?: string;
//           };
//         };
//         defaultProps?: {
//           transitionDuration?: number;
//           disableScrollLock?: boolean;
//           TransitionComponent?: React.ComponentType<any>;
//         };
//       };
//       MuiAutocomplete?: {
//         styleOverrides?: {
//           paper?: {
//             boxShadow?: string;
//             padding?: string;
//           };
//         };
//       };
//       MuiPickersPopper?: {
//         styleOverrides?: {
//           paper?: {
//             boxShadow?: string;
//             padding?: string;
//           };
//         };
//       };
//       MuiPaper?: {
//         styleOverrides?: {
//           root?: {
//             boxShadow?: string;
//             borderRadius?: string;
//             padding?: string;
//           };
//         };
//       };
//       MuiButton?: {
//         defaultProps?: {
//           disableFocusRipple?: boolean;
//         };
//         styleOverrides?: {
//           root?: {
//             textTransform?: string;
//             whiteSpace?: string;
//             boxShadow?: string;
//             fontWeight?: number;
//             borderRadius?: string;
//             transitionDuration?: string;
//             '&:hover'?: {
//               boxShadow?: string;
//             };
//           };
//         };
//       };
//       MuiLoadingButton?: {
//         defaultProps?: {
//           disableFocusRipple?: boolean;
//         };
//         styleOverrides?: {
//           root?: {
//             textTransform?: string;
//             boxShadow?: string;
//             fontWeight?: number;
//             borderRadius?: string;
//             transitionDuration?: string;
//             '&:hover'?: {
//               boxShadow?: string;
//             };
//           };
//         };
//       };
//       MuiTextField?: {
//         defaultProps?: {
//           InputLabelProps?: {
//             style?: {
//               fontWeight?: number;
//             };
//           };
//           inputProps?: {
//             style?: {
//               fontWeight?: number;
//             };
//           };
//         };
//         styleOverrides?: {
//           root?: {
//             '& fieldset'?: {
//               borderRadius?: string;
//               borderColor?: string;
//             };
//           };
//         };
//       };
//       MuiAlertTitle?: {
//         defaultProps?: {
//           style?: {
//             fontWeight?: number;
//           };
//         };
//       };
//       MuiTab?: {
//         defaultProps?: {
//           style?: {
//             textTransform?: string;
//           };
//         };
//       };
//       MuiOutlinedInput?: {
//         styleOverrides?: {
//           root?: {
//             '& fieldset'?: {
//               borderRadius?: string;
//             };
//           };
//         };
//       };
//       MuiIconButton?: {
//         defaultProps?: {
//           disableFocusRipple?: boolean;
//         };
//       };
//       MuiToggleButton?: {
//         styleOverrides?: {
//           root?: {
//             textTransform?: string;
//           };
//         };
//       };
//       MuiSwitch?: {
//         styleOverrides?: {
//           root?: {
//             width?: number;
//             height?: number;
//             padding?: number | string;
//             '& .MuiSwitch-switchBase'?: {
//               padding?: number | string;
//               margin?: number | string;
//               transitionDuration?: string;
//               '&.Mui-checked'?: {
//                 transform?: string;
//                 color?: string;
//                 '& + .MuiSwitch-track'?: {
//                   backgroundColor?: string;
//                   opacity?: number;
//                   border?: number | string;
//                 };
//                 '&.Mui-disabled + .MuiSwitch-track'?: {
//                   opacity?: number;
//                 };
//               };
//               '&.Mui-focusVisible .MuiSwitch-thumb'?: {
//                 color?: string;
//                 border?: string;
//               };
//               '&.Mui-disabled .MuiSwitch-thumb'?: {
//                 color?: string;
//               };
//               '&.Mui-disabled + .MuiSwitch-track'?: {
//                 opacity?: number;
//               };
//             };
//             '& .MuiSwitch-thumb'?: {
//               boxSizing?: string;
//               width?: number;
//               height?: number;
//             };
//             '& .MuiSwitch-track'?: {
//               borderRadius?: number;
//               backgroundColor?: string;
//               opacity?: number;
//               transition?: string;
//             };
//           };
//         };
//       };
//     };
//   }
// }