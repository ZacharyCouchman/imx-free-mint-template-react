import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PassportRedirect from './components/PassportRedirect.tsx'
import { passportInstance } from './utils/passport.ts'

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
    <RouterProvider router={router} />
  </React.StrictMode>,
)
