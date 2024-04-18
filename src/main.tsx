import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PassportRedirect from './routes/PassportRedirect.tsx'
import { passportInstance } from './immutable/passport.ts'
import { CheckoutProvider } from './contexts/CheckoutContext.tsx'
import { checkoutInstance } from './immutable/checkout.ts'

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CheckoutProvider checkout={checkoutInstance}>
      <RouterProvider router={router} />
    </CheckoutProvider>
  </React.StrictMode>,
)
