import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createHashRouter, RouterProvider, Outlet } from "react-router";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import { TRPCProvider } from "@/providers/trpc";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import "./index.css";

// Layout wrapper — CartProvider + CartDrawer tüm sayfalara uygulanır
function RootLayout() {
  return (
    <CartProvider>
      <CartDrawer />
      <Outlet />
    </CartProvider>
  );
}

const router = createHashRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/",             element: <HomePage /> },
      { path: "/urun/:handle", element: <ProductPage /> },
      { path: "/sepet",        element: <CartPage /> },
      { path: "/odeme",        element: <CheckoutPage /> },
      { path: "/admin",        element: <AdminDashboard /> },
      { path: "/login",        element: <Login /> },
      { path: "*",             element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TRPCProvider>
      <RouterProvider router={router} />
    </TRPCProvider>
  </StrictMode>
);
