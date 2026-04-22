import { Routes, Route } from "react-router";
import { CartProvider } from "@/hooks/useCart";
import CartDrawer from "@/components/CartDrawer";
import HomePage from "@/pages/HomePage";
import ProductPage from "@/pages/ProductPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AdminDashboard from "@/pages/AdminDashboard";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

function App() {
  return (
    <CartProvider>
      <CartDrawer />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/urun/:handle" element={<ProductPage />} />
        <Route path="/sepet" element={<CartPage />} />
        <Route path="/odeme" element={<CheckoutPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </CartProvider>
  );
}

export default App;
