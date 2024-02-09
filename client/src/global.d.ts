declare module '*.jpg';
declare module '*.png';

interface Window {
  google?: {
    accounts?: any; // Replace 'any' with the actual type if possible
  },
  googleButtonInterval: NodeJS.Timeout,
  VANTA?: {
    TOPOLOGY: any;
  };
}