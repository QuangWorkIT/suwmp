import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.tsx";

import { GoogleOAuthProvider } from "@react-oauth/google";

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) console.error("VITE_GOOGLE_CLIENT_ID is not configured. Google login will not work.");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={clientId} locale="en">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>,
);
