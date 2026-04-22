import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router";
import App from "./App";
import { TRPCProvider } from "./providers/trpc";
import "./index.css";

const router = createHashRouter([
  { path: "*", element: <App /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  </StrictMode>
);
