/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module 'react-google-recaptcha' {
  import React from 'react';
  
  interface ReCAPTCHAProps {
    sitekey: string;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    theme?: 'light' | 'dark';
    type?: 'image' | 'audio';
    tabindex?: number;
  }
  
  const ReCAPTCHA: React.FC<ReCAPTCHAProps>;
  export default ReCAPTCHA;
}
