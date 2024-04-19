// main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import theme from './theme';  // Import the theme you created
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import PassportRedirect from './routes/PassportRedirect';
import { passportInstance } from './immutable/passport';
import { CheckoutProvider } from './contexts/CheckoutContext';
import { checkoutInstance } from './immutable/checkout';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App passportInstance={passportInstance} />,
  },
  {
    path: "/passport-redirect",
    element: <PassportRedirect passportInstance={passportInstance} />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <CheckoutProvider checkout={checkoutInstance}>
        <RouterProvider router={router} />
      </CheckoutProvider>
    </ChakraProvider>
  </React.StrictMode>,
);
