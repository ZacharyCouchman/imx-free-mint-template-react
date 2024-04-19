// theme.ts
import { ThemeConfig, extendTheme } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
}
  // styles: {
  //   global: {
  //     body: {
  //       fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
  //       lineHeight: '1.5',
  //       fontWeight: '400',
  //       color: 'rgba(255, 255, 255, 0.87)',
  //       bg: 'black',
  //       margin: 0,
  //       display: 'flex',
  //       minWidth: '320px',
  //       minHeight: '100vh',
  //       textRendering: 'optimizeLegibility',
  //       WebkitFontSmoothing: 'antialiased',
  //       MozOsxFontSmoothing: 'grayscale',
  //     },
  //     a: {
  //       fontWeight: '500',
  //       color: '#646cff',
  //       textDecoration: 'inherit',
  //       _hover: {
  //         color: '#535bf2',
  //       },
  //     },
  //     h1: {
  //       fontSize: '3.2em',
  //       lineHeight: '1.1',
  //     },
  //     p: {
  //       margin: 0,
  //     },
  //     button: {
  //       borderRadius: '8px',
  //       border: '1px solid transparent',
  //       padding: '0.6em 1.2em',
  //       fontSize: '1em',
  //       fontWeight: '500',
  //       fontFamily: 'inherit',
  //       bg: '#1a1a1a',
  //       cursor: 'pointer',
  //       transition: 'border-color 0.25s',
  //       _hover: {
  //         borderColor: '#646cff',
  //       },
  //       _focusVisible: {
  //         outline: '4px auto -webkit-focus-ring-color',
  //       },
  //     },
  //     '@media (prefers-color-scheme: light)': {
  //       body: {
  //         color: '#213547',
  //         bg: '#ffffff',
  //       },
  //       button: {
  //         bg: '#f9f9f9',
  //       },
  //     },
  //   },
  // },
);

export default theme;
