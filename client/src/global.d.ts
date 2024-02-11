declare module '*.jpg';
declare module '*.png';
declare module '*.gif';

interface Window {
  google?: {
    accounts?: any; // Replace 'any' with the actual type if possible
  },
  googleButtonInterval: NodeJS.Timeout,
  VANTA?: {
    TOPOLOGY: any;
  };
}

namespace StateSetters {
  type String = React.Dispatch<React.SetStateAction<string>>;
  type Number = React.Dispatch<React.SetStateAction<number>>;
  type Boolean = React.Dispatch<React.SetStateAction<boolean>>;
  type NumberOrUndefined = React.Dispatch<React.SetStateAction<number | undefined>>;
}
