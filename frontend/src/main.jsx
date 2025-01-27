import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import EventEmailForm from './Components/forms/InvitationMail/EventMailForm.jsx'
import ThankMail from './Components/forms/InvitationMail/ThankMail.jsx'
import Home from './Components/Home/Home.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path="invitation" element={<EventEmailForm />} />
      <Route path="thank-you" element={<ThankMail />} />
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)